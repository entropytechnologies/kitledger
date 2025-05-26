import { describe, test, expect } from "vitest";
import { createDatabase } from "../../core/services/database/db";
import { postgresUrl, postgresConfig } from "../test_config";
import { AccountFactory, LedgerFactory, UnitTypeFactory } from "../../core/services/database/factories";
import { create as createLedger } from "../../core/actions/ledger_actions";
import { create as createUnitType } from "../../core/actions/unit_type_actions";
import { create as createAccount, validateCreation as validateAccountCreation } from "../../core/actions/account_actions";

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const sample_ledger_data = new LedgerFactory().make();
const uom_type_array = await createUnitType(new UnitTypeFactory().make());
sample_ledger_data.unit_type_id = uom_type_array.id;
const ledger = await createLedger(sample_ledger_data);

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

// Using .sequential to maintain similar execution order to Deno's default for interdependent tests.
describe.sequential("Account API", () => {
	test("Create a valid account", async () => {
		const accountPayload = new AccountFactory().make();
		accountPayload.ref_id = SUCCESS_REF_ID;
		accountPayload.ledger_id = ledger.id;

		const res = await createAccount(accountPayload);
		expect(res.id).toHaveLength(36);
		expect(res.ref_id).toBe(SUCCESS_REF_ID);
	});

	test("Invalid name fails validation", async () => {
		const accountPayload = new AccountFactory().make();
		accountPayload.name = "A".repeat(256);
		accountPayload.ledger_id = ledger.id;

		const res = await validateAccountCreation(accountPayload);
		expect(res.success).toBe(false);
	});

	test("Repeated Ref ID fails validation", async () => {
		const accountPayload = new AccountFactory().make();
		accountPayload.ref_id = SUCCESS_REF_ID;
		accountPayload.ledger_id = ledger.id;

		const res = await validateAccountCreation(accountPayload);

		expect(res.success).toBe(false);
	});
});
