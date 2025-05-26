import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import {
	kl_core_accounts,
	kl_core_entity_models,
	kl_core_ledgers,
	kl_core_transaction_models,
	kl_core_unit_types,
	BalanceType,
} from "../services/database/schema.js";

/**
 * Account types
 */
export type Account = InferSelectModel<typeof kl_core_accounts>;
export type NewAccount = InferInsertModel<typeof kl_core_accounts>;
export type RefinedNewAccount = Omit<NewAccount, "ledger_id" | "balance_type"> & {
	ledger_id?: string;
	balance_type?: BalanceType;
};
export type UpdateAccount = Pick<NewAccount, "ref_id" | "alt_id" | "name" | "balance_type" | "meta" | "active">;

/**
 * Entity Model types
 */
export type EntityModel = InferSelectModel<typeof kl_core_entity_models>;
export type NewEntityModel = InferInsertModel<typeof kl_core_entity_models>;

/**
 * Transaction Model types
 */
export type TransactionModel = InferSelectModel<typeof kl_core_transaction_models>;
export type NewTransactionModel = InferInsertModel<typeof kl_core_transaction_models>;

/**
 * Ledger types
 */
export type Ledger = InferSelectModel<typeof kl_core_ledgers>;
export type NewLedger = InferInsertModel<typeof kl_core_ledgers>;
export type UpdateLedger = Pick<NewLedger, "ref_id" | "alt_id" | "name" | "description" | "active">;

/**
 * Unit Type types
 */
export type UnitType = InferSelectModel<typeof kl_core_unit_types>;
export type NewUnitType = InferInsertModel<typeof kl_core_unit_types>;
