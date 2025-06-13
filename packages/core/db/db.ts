import { type PostgresClientConfig, createPostgresClient } from './postgres.ts';
import { type SqliteClientConfig, createSqliteClient } from './sqlite.ts';

export type DbType = 'postgres' | 'sqlite';

export type DbConfig = PostgresClientConfig | SqliteClientConfig;

export function createDbClient(type: DbType, config: DbConfig) {
    switch (type) {
        case 'postgres':
            return createPostgresClient(config as PostgresClientConfig);
        case 'sqlite':
            return createSqliteClient(config as SqliteClientConfig);
        default: {
            throw new Error(`Unsupported database type: ${type}`);
        }
    }
}