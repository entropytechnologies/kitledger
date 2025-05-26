type PostgresConfig = {
	host: string;
	port: number;
	user: string;
	password: string;
	database: string;
	max_connections?: number;
};

export const postgresConfig: PostgresConfig = {
	user: process.env.KL_PG_USER || "",
	password: process.env.KL_PG_PASSWORD || "",
	host: process.env.KL_PG_HOST || "localhost",
	port: parseInt(process.env.KL_PG_PORT || "5432", 10), // Added radix 10 to parseInt
	database: process.env.KL_PG_NAME || "kitledger",
	max_connections: parseInt(process.env.KL_PG_MAX_CONNECTIONS || "10", 10), // Added radix 10 to parseInt
};

export const postgresUrl = `postgres://${postgresConfig.user}:${postgresConfig.password}@${postgresConfig.host}:${postgresConfig.port}/${postgresConfig.database}`;
