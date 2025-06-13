import { DatabaseSync } from 'node:sqlite';

export type SqliteClientConfig = {
    path: ":memory:" | string;
};

export function createSqliteClient(config: SqliteClientConfig) {
	return new DatabaseSync(config.path);
}