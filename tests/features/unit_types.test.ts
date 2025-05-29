import { assertEquals } from '@std/assert';
import { postgresConfig, postgresUrl } from '../test_config.ts';
import { createDatabase, UnitTypeFactory, UnitTypes } from '@kitledger/core';

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

Deno.test({
	name: 'Create a valid unit type',
	async fn() {
		const unitTypePayload = new UnitTypeFactory().make();
		unitTypePayload.ref_id = SUCCESS_REF_ID;

		const res = await UnitTypes.create(unitTypePayload);

		assertEquals(res.id.length, 36);
		assertEquals(res.ref_id, SUCCESS_REF_ID);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const unitTypePayload = new UnitTypeFactory().make();
		unitTypePayload.name = 'A'.repeat(256);

		const res = await UnitTypes.validateCreation(unitTypePayload);

		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const unitTypePayload = new UnitTypeFactory().make();
		unitTypePayload.ref_id = SUCCESS_REF_ID;

		const res = await UnitTypes.validateCreation(unitTypePayload);

		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});
