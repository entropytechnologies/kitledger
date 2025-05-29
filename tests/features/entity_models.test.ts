import { assertEquals } from '@std/assert';
import { postgresConfig, postgresUrl } from '../test_config.ts';
import { createDatabase, EntityModelFactory, EntityModels } from '@kitledger/core';

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

Deno.test({
	name: 'Create a valid entity model',
	async fn() {
		const entityModelPayload = new EntityModelFactory().make();
		entityModelPayload.ref_id = SUCCESS_REF_ID;

		const res = await EntityModels.create(entityModelPayload);
		assertEquals(res.id.length, 36);
		assertEquals(res.ref_id, SUCCESS_REF_ID);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const entityModelPayload = new EntityModelFactory().make();
		entityModelPayload.name = 'A'.repeat(256);

		const res = await EntityModels.validateCreation(entityModelPayload);
		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const entityModelPayload = new EntityModelFactory().make();
		entityModelPayload.ref_id = SUCCESS_REF_ID;

		const res = await EntityModels.validateCreation(entityModelPayload);
		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});
