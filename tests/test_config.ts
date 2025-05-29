type PostgresConfig = {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	max_connections?: number;
};

export const postgresConfig: PostgresConfig = {
	user: Deno.env.get('KL_PG_USER') || '',
	password: Deno.env.get('KL_PG_PASSWORD') || '',
	host: Deno.env.get('KL_PG_HOST') || 'localhost',
	port: parseInt(Deno.env.get('KL_PG_PORT') || '5432'),
	database: Deno.env.get('KL_PG_NAME') || 'kitledger',
	max_connections: parseInt(Deno.env.get('KL_PG_MAX_CONNECTIONS') || '10'),
};

export const postgresUrl =
	`postgres://${postgresConfig.user}:${postgresConfig.password}@${postgresConfig.host}:${postgresConfig.port}/${postgresConfig.database}`;
