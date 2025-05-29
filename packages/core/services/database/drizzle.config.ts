import { defineConfig } from 'drizzle-kit';

const user = Deno.env.get('KL_PG_USER') || '';
const password = Deno.env.get('KL_PG_PASSWORD') || '';
const host = Deno.env.get('KL_PG_HOST') || 'localhost';
const port = parseInt(Deno.env.get('KL_PG_PORT') || '5432');
const database = Deno.env.get('KL_PG_NAME') || 'kitledger';

export const postgresUrl = `postgres://${user}:${password}@${host}:${port}/${database}`;

export default defineConfig({
	dbCredentials: {
		url: postgresUrl,
	},
	schema: './services/database/schema.ts',
	out: './services/database/migrations',
	dialect: 'postgresql',
	verbose: true,
	strict: true,
	migrations: {
		table: 'kl_core_migrations',
		schema: 'public',
	},
});
