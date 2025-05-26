import { describe, test, expect } from "vitest";
import { createDatabase } from "../../core/services/database/db";
import { postgresUrl, postgresConfig } from "../test_config";
import { TransactionModelFactory } from "../../core/services/database/factories";
import { create, validateCreation } from "../../core/actions/transaction_model_actions";

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

// Using .sequential to maintain similar execution order to Deno's default for interdependent tests.
describe.sequential("TransactionModel API", () => {
	test("Create a valid transaction model", async () => {
		const transactionModelPayload = new TransactionModelFactory().make();
		transactionModelPayload.ref_id = SUCCESS_REF_ID;

		const res = await create(transactionModelPayload);

		expect(res.id).toHaveLength(36);
		expect(res.ref_id).toBe(SUCCESS_REF_ID);
	});

	test("Invalid name fails validation", async () => {
		const transactionModelPayload = new TransactionModelFactory().make();
		transactionModelPayload.name = "A".repeat(256);

		const res = await validateCreation(transactionModelPayload);

		expect(res.success).toBe(false);
	});

	test("Repeated Ref ID fails validation", async () => {
		const transactionModelPayload = new TransactionModelFactory().make();
		transactionModelPayload.ref_id = SUCCESS_REF_ID;

		const res = await validateCreation(transactionModelPayload);

		expect(res.success).toBe(false);
	});
});
