import { defineConfig } from "drizzle-kit";

const user = process.env.KL_PG_USER || "";
const password = process.env.KL_PG_PASSWORD || "";
const host = process.env.KL_PG_HOST || "localhost";
const port = process.env.KL_KG_PORT || "5432";
const database = process.env.KL_PG_NAME || "kitledger";

export const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

export default defineConfig({
	dbCredentials: {
		url: postgresUrl,
	},
	schema: "./core/services/database/schema.ts",
	out: "./core/services/database/migrations",
	dialect: "postgresql",
	verbose: true,
	strict: true,
	migrations: {
		table: "kl_core_migrations",
		schema: "public",
	},
});
