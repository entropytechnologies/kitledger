import { assertEquals } from '@std/assert';
import { postgresConfig, postgresUrl } from '../test_config.ts';
import { createDatabase, TransactionModelFactory, TransactionModels } from '@kitledger/core';

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

Deno.test({
	name: 'Create a valid transaction model',
	async fn() {
		const transactionModelPayload = new TransactionModelFactory().make();
		transactionModelPayload.ref_id = SUCCESS_REF_ID;

		const res = await TransactionModels.create(transactionModelPayload);

		assertEquals(res.id.length, 36);
		assertEquals(res.ref_id, SUCCESS_REF_ID);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const transactionModelPayload = new TransactionModelFactory().make();
		transactionModelPayload.name = 'A'.repeat(256);

		const res = await TransactionModels.validateCreation(transactionModelPayload);

		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const transactionModelPayload = new TransactionModelFactory().make();
		transactionModelPayload.ref_id = SUCCESS_REF_ID;

		const res = await TransactionModels.validateCreation(transactionModelPayload);

		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});
