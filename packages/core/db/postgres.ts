import postgres from 'npm:postgres';

export type PostgresClientConfig = postgres.Options<Record<string, postgres.PostgresType>>;

export function createPostgresClient(config: PostgresClientConfig) {
    return postgres(config)
}