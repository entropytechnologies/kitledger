import { assertEquals } from '@std/assert';
import { postgresConfig, postgresUrl } from '../test_config.ts';
import {
	AccountFactory,
	Accounts,
	createDatabase,
	LedgerFactory,
	Ledgers,
	UnitTypeFactory,
	UnitTypes,
} from '@kitledger/core';

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const sample_ledger_data = new LedgerFactory().make();
const uom_type_array = await UnitTypes.create(new UnitTypeFactory().make());
sample_ledger_data.unit_type_id = uom_type_array.id;
const ledger = await Ledgers.create(sample_ledger_data);

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

Deno.test({
	name: 'Create a valid account',
	async fn() {
		const accountPayload = new AccountFactory().make();
		accountPayload.ref_id = SUCCESS_REF_ID;
		accountPayload.ledger_id = ledger.id;

		const res = await Accounts.create(accountPayload);
		assertEquals(res.id.length, 36);
		assertEquals(res.ref_id, SUCCESS_REF_ID);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid name fails validation',
	async fn() {
		const accountPayload = new AccountFactory().make();
		accountPayload.name = 'A'.repeat(256);
		accountPayload.ledger_id = ledger.id;

		const res = await Accounts.validateCreation(accountPayload);
		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});

Deno.test({
	name: 'Invalid ref_id fails validation',
	async fn() {
		const accountPayload = new AccountFactory().make();
		accountPayload.ref_id = 'A'.repeat(256);
		accountPayload.ledger_id = ledger.id;

		const res = await Accounts.validateCreation(accountPayload);
		assertEquals(res.success, false);
	},
	sanitizeOps: false,
	sanitizeResources: false,
});
