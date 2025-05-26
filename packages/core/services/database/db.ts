import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "./schema.js";
import postgres from "postgres";
import { join } from "node:path";

export interface DatabaseConfig {
	postgresUrl: string;
	maxConnections?: number;
}

/** Alias for the specific Drizzle PostgresJsDatabase type with the application's schema. */
export type KitledgerDatabase = PostgresJsDatabase<typeof schema>;

let _db: KitledgerDatabase | null = null;
let _queryClient: postgres.Sql | null = null;
let _isInitialized = false;
let _currentConfig: DatabaseConfig | null = null;

async function _internalMigrateDb(): Promise<void> {
	if (!_db || !_isInitialized) {
		throw new Error("Database not initialized. Cannot migrate.");
	}
	const migrationFolder = join(String(import.meta.dirname ?? "."), "./migrations");
	try {
		await migrate(_db, {
			migrationsFolder: migrationFolder,
			migrationsTable: "kl_core_migrations",
			migrationsSchema: "public",
		});
	} catch (error) {
		console.error("Error during database migration:", error);
		throw error;
	}
}

async function _internalClose(): Promise<void> {
	if (!_queryClient || !_isInitialized) {
		// console.warn("Database connection already closed or was not initialized."); // Optional: keep if useful
		return;
	}
	try {
		await _queryClient.end();
		_db = null;
		_queryClient = null;
		_isInitialized = false;
		_currentConfig = null;
		// console.log("Database connection closed."); // Optional: keep if useful
	} catch (error) {
		console.error("Error closing database connection:", error);
		throw error;
	}
}

/**
 * Initializes the database service or returns access to an existing initialized instance.
 * Throws an error if re-attempting initialization with a different configuration without prior close.
 * @param config The database configuration.
 * @returns An object with `db`, `queryClient`, `migrateDb`, and `close` members.
 */
export function createDatabase(config: DatabaseConfig) {
	if (!_isInitialized) {
		const { postgresUrl, maxConnections = 10 } = config;
		if (!postgresUrl) {
			throw new Error("postgresUrl is required in DatabaseConfig.");
		}
		_queryClient = postgres(postgresUrl, {
			max: maxConnections,
			onnotice: (e) => {
				/**
				 * Not show the warnings of skipped migrations or instructions.
				 */
				if (!e.message.includes("skipping")) {
					console.log(e.message);
				}
			},
		});
		_db = drizzle(_queryClient, { schema: schema });
		_isInitialized = true;
		_currentConfig = config;
		console.log("Database service initialized.");
	} else if (JSON.stringify(_currentConfig) !== JSON.stringify(config)) {
		throw new Error(
			"Database service already initialized with a different configuration. " +
				"Close the existing connection before re-initializing with a new configuration.",
		);
	}

	return {
		/** The Drizzle ORM database instance. */
		get db(): KitledgerDatabase {
			if (!_db) throw new Error("Database instance unavailable (closed or not initialized).");
			return _db;
		},
		/** The raw Postgres.js query client. */
		get queryClient(): postgres.Sql {
			if (!_queryClient) throw new Error("Query client unavailable (closed or not initialized).");
			return _queryClient;
		},
		/** Migrates the database to the latest version. */
		migrateDb: _internalMigrateDb,
		/** Closes the database connection. */
		close: _internalClose,
	};
}

/**
 * Retrieves the singleton Drizzle database instance for internal package use.
 * @returns The initialized KitledgerDatabase instance.
 * @throws Error if the database is not initialized.
 */
export function getDbInstance(): KitledgerDatabase {
	if (!_db || !_isInitialized) {
		throw new Error("Database not initialized. Call createDatabase() first.");
	}
	return _db;
}

/**
 * Retrieves the singleton Postgres.js query client instance for internal package use.
 * @returns The initialized Postgres.js Sql instance.
 * @throws Error if the query client is not initialized.
 */
export function getQueryClientInstance(): postgres.Sql {
	if (!_queryClient || !_isInitialized) {
		throw new Error("Query client not initialized. Call createDatabase() first.");
	}
	return _queryClient;
}
