import { assertEquals } from '@std/assert';
import { postgresConfig, postgresUrl } from '../test_config.ts';
import { createDatabase, LedgerFactory, Ledgers, UnitTypeFactory, UnitTypes } from '@kitledger/core';

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const uom_type = await UnitTypes.create(new UnitTypeFactory().make());

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

Deno.test({
	name: 'Create a valid ledger',
	async fn() {
		const ledgerPayload = new LedgerFactory().make();
		ledgerPayload.ref_id = SUCCESS_REF_ID;
		ledgerPayload.unit_type_id = uom_type.id; // Use the id from the setup uom_type

		const res = await Ledgers.create(ledgerPayload);

		assertEquals(res.id.length, 36);
		assertEquals(res.ref_id, SUCCESS_REF_ID);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const ledgerPayload = new LedgerFactory().make();
		ledgerPayload.name = 'A'.repeat(256);
		ledgerPayload.unit_type_id = uom_type.id;

		const res = await Ledgers.validateCreation(ledgerPayload);

		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Repeated Ref ID fails validation',
	async fn() {
		const ledgerPayload = new LedgerFactory().make();
		ledgerPayload.ref_id = SUCCESS_REF_ID;
		ledgerPayload.unit_type_id = uom_type.id;

		const res = await Ledgers.validateCreation(ledgerPayload);

		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});
