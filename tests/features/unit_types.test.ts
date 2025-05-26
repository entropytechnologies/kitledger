import { describe, test, expect } from "vitest";
import { createDatabase } from "../../packages/core/services/database/db";
import { postgresUrl, postgresConfig } from "../test_config";
import { UnitTypeFactory } from "../../packages/core/services/database/factories";
import type { NewUnitType, UnitType } from "../../packages/core/types/index";
import { create, validateCreation } from "../../packages/core/actions/unit_type_actions";

createDatabase({
	postgresUrl,
	maxConnections: postgresConfig.max_connections,
});

const SUCCESS_REF_ID = `T${Math.floor(Math.random() * 9999)}`;

// Using .sequential to maintain similar execution order to Deno's default for interdependent tests.
describe.sequential("UnitType API", () => {
	test("Create a valid unit type", async () => {
		const unitTypePayload = new UnitTypeFactory().make();
		unitTypePayload.ref_id = SUCCESS_REF_ID;

		const res = await create(unitTypePayload);

		expect(res.id).toHaveLength(36);
		expect(res.ref_id).toBe(SUCCESS_REF_ID);
	});

	test("Invalid name fails validation", async () => {
		const unitTypePayload = new UnitTypeFactory().make();
		unitTypePayload.name = "A".repeat(256);

		const res = await validateCreation(unitTypePayload);

		expect(res.success).toBe(false);
	});

	test("Repeated Ref ID fails validation", async () => {
		const unitTypePayload = new UnitTypeFactory().make();
		unitTypePayload.ref_id = SUCCESS_REF_ID;

		const res = await validateCreation(unitTypePayload);

		expect(res.success).toBe(false);
	});
});
