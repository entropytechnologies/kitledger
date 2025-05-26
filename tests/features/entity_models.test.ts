import { describe, test, expect } from "vitest";
import { createDatabase } from "../../core/services/database/db";
import { postgresUrl, postgresConfig } from "../test_config";
import { EntityModelFactory } from "../../core/services/database/factories";
import { create, validateCreation } from "../../core/actions/entity_model_actions";

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

// Using .sequential to maintain similar execution order to Deno's default for interdependent tests.
describe.sequential("EntityModel API", () => {
	test("Create a valid entity model", async () => {
		const entityModelPayload = new EntityModelFactory().make();
		entityModelPayload.ref_id = SUCCESS_REF_ID;

		const res = await create(entityModelPayload);
		expect(res.id).toHaveLength(36);
		expect(res.ref_id).toBe(SUCCESS_REF_ID);
	});

	test("Invalid name fails validation", async () => {
		const entityModelPayload = new EntityModelFactory().make();
		entityModelPayload.name = "A".repeat(256);

		const res = await validateCreation(entityModelPayload);

		expect(res.success).toBe(false);
	});

	test("Repeated Ref ID fails validation", async () => {
		const entityModelPayload = new EntityModelFactory().make();
		entityModelPayload.ref_id = SUCCESS_REF_ID;

		const res = await validateCreation(entityModelPayload);
		expect(res.success).toBe(false);
	});
});
