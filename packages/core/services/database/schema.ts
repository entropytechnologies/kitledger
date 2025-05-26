import { type AnyPgColumn, boolean, char, index, integer, jsonb, numeric, pgEnum, pgTable, text, uuid, varchar } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import type { MetaType, TransactionLineType } from "../../utils/validation.js";

/**
 * Balance Types
 */
export enum BalanceType {
	DEBIT = "DEBIT",
	CREDIT = "CREDIT",
}

export const balance_type_pg_enum = pgEnum("kl_core_balance_type", [BalanceType.DEBIT, BalanceType.CREDIT]);

export const kl_core_ledgers = pgTable(
	"kl_core_ledgers",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		name: varchar("name", { length: 255 }).unique().notNull(),
		description: text("description"),
		unit_type_id: uuid("unit_type_id").references(() => kl_core_unit_types.id),
		active: boolean("active").default(true),
	},
	(table) => [
		{
			name_idx: index("kl_ledgers_name_idx").on(table.name), // Custom SQL name
			ref_id_idx: index("kl_ledgers_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_ledgers_alt_id_idx").on(table.alt_id), // Custom SQL name
		},
	],
);

export const ledger_relations = relations(kl_core_ledgers, ({ one }) => {
	return {
		unit_type: one(kl_core_unit_types, {
			fields: [kl_core_ledgers.unit_type_id],
			references: [kl_core_unit_types.id],
		}),
	};
});

export const kl_core_accounts = pgTable(
	"kl_core_accounts",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		balance_type: balance_type_pg_enum("balance_type"),
		ledger_id: uuid("ledger_id")
			.references(() => kl_core_ledgers.id)
			.notNull(),
		parent_id: uuid("parent_id").references((): AnyPgColumn => kl_core_accounts.id),
		name: varchar("name", { length: 255 }).unique().notNull(),
		meta: jsonb("meta").$type<MetaType>(),
		active: boolean("active").default(true),
	},
	(table) => [
		{
			balance_type_idx: index("kl_accounts_bal_type_idx").on(table.balance_type), // Custom SQL name
			name_idx: index("kl_accounts_name_idx").on(table.name), // Custom SQL name
			ref_id_idx: index("kl_accounts_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_accounts_alt_id_idx").on(table.alt_id), // Custom SQL name
		},
	],
);

export const account_relations = relations(kl_core_accounts, ({ one, many }) => {
	return {
		ledger: one(kl_core_ledgers, {
			fields: [kl_core_accounts.id], // Keeping your original relation definition
			references: [kl_core_ledgers.id],
		}),
		parent: one(kl_core_accounts, {
			fields: [kl_core_accounts.id], // Keeping your original relation definition
			references: [kl_core_accounts.id],
		}),
		children: many(kl_core_accounts),
	};
});

export const kl_core_unit_types = pgTable(
	"kl_core_unit_types",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		name: varchar("name", { length: 255 }).unique().notNull(),
	},
	(table) => [
		{
			name_idx: index("kl_unit_types_name_idx").on(table.name), // Custom SQL name
			ref_id_idx: index("kl_unit_types_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_unit_types_alt_id_idx").on(table.alt_id), // Custom SQL name
		},
	],
);

export const unit_type_relations = relations(kl_core_unit_types, ({ many }) => {
	return {
		units: many(kl_core_units),
	};
});

export const kl_core_units = pgTable(
	"kl_core_units",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		unit_type_id: uuid("unit_type_id")
			.references(() => kl_core_unit_types.id)
			.notNull(),
		name: varchar("name", { length: 255 }).unique().notNull(),
		symbol: varchar("symbol", { length: 20 }).unique(),
		precision: integer("precision").default(0),
		decimal_separator: char("decimal_separator", { length: 1 }).notNull(),
		thousands_separator: char("thousands_separator", { length: 1 }).notNull(),
		active: boolean("active").default(true),
	},
	(table) => [
		{
			ref_id_idx: index("kl_units_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_units_alt_id_idx").on(table.alt_id), // Custom SQL name
			name_idx: index("kl_units_name_idx").on(table.name), // Custom SQL name
			symbol_idx: index("kl_units_symbol_idx").on(table.symbol), // Custom SQL name
		},
	],
);

export const unit_relations = relations(kl_core_units, ({ one }) => {
	return {
		unit_type: one(kl_core_unit_types, {
			fields: [kl_core_units.id], // Keeping your original relation definition
			references: [kl_core_unit_types.id],
		}),
	};
});

export const kl_core_conversion_rates = pgTable(
	"kl_core_conversion_rates",
	{
		id: uuid("id").primaryKey(),
		from_uom_id: uuid("from_uom_id")
			.references(() => kl_core_units.id)
			.notNull(),
		to_uom_id: uuid("to_uom_id")
			.references(() => kl_core_units.id)
			.notNull(),
		rate: numeric("rate", { precision: 24, scale: 8 }).notNull(),
	},
	(table) => [
		{
			from_uom_idx: index("kl_conversion_rates_from_uom_idx").on(table.from_uom_id), // Custom SQL name
			to_uom_idx: index("kl_conversion_rates_to_uom_idx").on(table.to_uom_id), // Custom SQL name
			rate_idx: index("kl_conversion_rates_rate_idx").on(table.rate), // Custom SQL name
		},
	],
);

export const conversion_rate_relations = relations(kl_core_conversion_rates, ({ one }) => {
	return {
		from_uom: one(kl_core_units, {
			fields: [kl_core_conversion_rates.from_uom_id],
			references: [kl_core_units.id],
		}),
		to_uom: one(kl_core_units, {
			fields: [kl_core_conversion_rates.to_uom_id],
			references: [kl_core_units.id],
		}),
	};
});

export const kl_core_entity_models = pgTable(
	"kl_core_entity_models",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		name: varchar("name", { length: 255 }).unique().notNull(),
		active: boolean("active").default(true),
	},
	(table) => [
		{
			ref_id_idx: index("kl_entity_models_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_entity_models_alt_id_idx").on(table.alt_id), // Custom SQL name
			name_idx: index("kl_entity_models_name_idx").on(table.name), // Custom SQL name
		},
	],
);

export const entity_model_relations = relations(kl_core_entity_models, ({ many }) => {
	return {
		ledgers: many(kl_core_ledgers),
		entities: many(kl_core_entities),
		dimensions: many(kl_core_dimensions),
	};
});

export const kl_core_entities = pgTable(
	"kl_core_entities",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		entity_model_id: uuid("entity_model_id")
			.references(() => kl_core_entity_models.id)
			.notNull(),
		parent_id: uuid("parent_id").references((): AnyPgColumn => kl_core_entities.id),
		name: varchar("name", { length: 255 }).notNull(),
		meta: jsonb("meta").$type<MetaType>(),
	},
	(table) => [
		{
			ref_id_idx: index("kl_entities_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_entities_alt_id_idx").on(table.alt_id), // Custom SQL name
			name_idx: index("kl_entities_name_idx").on(table.name), // Custom SQL name
		},
	],
);

export const entity_relations = relations(kl_core_entities, ({ one, many }) => {
	return {
		entity_model: one(kl_core_entity_models, {
			fields: [kl_core_entities.id], // Keeping your original relation definition
			references: [kl_core_entity_models.id],
		}),
		parent: one(kl_core_entities, {
			fields: [kl_core_entities.id], // Keeping your original relation definition
			references: [kl_core_entities.id],
		}),
		children: many(kl_core_entities),
		dimensions: many(kl_core_dimensions),
	};
});

export const kl_core_transaction_models = pgTable(
	"kl_core_transaction_models",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		name: varchar("name", { length: 255 }).notNull().unique(),
		active: boolean("active").default(true),
	},
	(table) => [
		{
			ref_id_idx: index("kl_trans_models_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_trans_models_alt_id_idx").on(table.alt_id), // Custom SQL name
			name_idx: index("kl_trans_models_name_idx").on(table.name), // Custom SQL name
		},
	],
);

export const transaction_model_relations = relations(kl_core_transaction_models, ({ many }) => {
	return {
		transactions: many(kl_core_transactions),
	};
});

export const kl_core_transactions = pgTable(
	"kl_core_transactions",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		transaction_model_id: uuid("transaction_model_id")
			.references(() => kl_core_transaction_models.id)
			.notNull(),
		meta: jsonb("meta").$type<MetaType>(),
		lines: jsonb("lines").$type<TransactionLineType>(),
	},
	(table) => [
		{
			ref_id_idx: index("kl_transactions_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_transactions_alt_id_idx").on(table.alt_id), // Custom SQL name
		},
	],
);

export const transaction_relations = relations(kl_core_transactions, ({ one }) => {
	return {
		transaction_model: one(kl_core_transaction_models, {
			fields: [kl_core_transactions.id], // Keeping your original relation definition
			references: [kl_core_transaction_models.id],
		}),
	};
});

export const kl_core_entries = pgTable(
	"kl_core_entries",
	{
		id: uuid("id").primaryKey(),
		ref_id: varchar("ref_id", { length: 64 }).unique().notNull(),
		alt_id: varchar("alt_id", { length: 64 }).unique(),
		ledger_id: uuid("ledger_id")
			.references(() => kl_core_ledgers.id)
			.notNull(),
		debit_account_id: uuid("debit_account_id")
			.references(() => kl_core_accounts.id)
			.notNull(),
		credit_account_id: uuid("credit_account_id")
			.references(() => kl_core_accounts.id)
			.notNull(),
		uom_id: uuid("uom_id")
			.references(() => kl_core_units.id)
			.notNull(),
		value: numeric("value", { precision: 64, scale: 16 }).default("0"),
		transaction_id: uuid("transaction_id")
			.references(() => kl_core_transactions.id)
			.notNull(),
	},
	(table) => [
		{
			ref_id_idx: index("kl_entries_ref_id_idx").on(table.ref_id), // Custom SQL name
			alt_id_idx: index("kl_entries_alt_id_idx").on(table.alt_id), // Custom SQL name
		},
	],
);

export const entry_relations = relations(kl_core_entries, ({ one, many }) => {
	return {
		transaction: one(kl_core_transactions, {
			fields: [kl_core_entries.id], // Keeping your original relation definition
			references: [kl_core_transactions.id],
		}),
		ledger: one(kl_core_ledgers, {
			fields: [kl_core_entries.id], // Keeping your original relation definition
			references: [kl_core_ledgers.id],
		}),
		debit_account: one(kl_core_accounts, {
			fields: [kl_core_entries.id], // Keeping your original relation definition
			references: [kl_core_accounts.id],
		}),
		credit_account: one(kl_core_accounts, {
			fields: [kl_core_entries.id], // Keeping your original relation definition
			references: [kl_core_accounts.id],
		}),
		uom: one(kl_core_units, {
			fields: [kl_core_entries.id], // Keeping your original relation definition
			references: [kl_core_units.id],
		}),
		dimensions: many(kl_core_dimensions),
	};
});

// Pivot table between entries, entity_types and entities
export const kl_core_dimensions = pgTable(
	"kl_core_dimensions",
	{
		id: uuid("id").primaryKey(),
		entry_id: uuid("entry_id")
			.references(() => kl_core_entries.id)
			.notNull(),
		entity_model_id: uuid("entity_model_id").references(() => kl_core_entity_models.id),
		entity_id: uuid("entity_id")
			.references(() => kl_core_entities.id)
			.notNull(),
	},
	(table) => [
		{
			entry_id_idx: index("kl_dimensions_entry_id_idx").on(table.entry_id), // Custom SQL name
			entity_model_id_idx: index("kl_dimensions_em_id_idx").on(table.entity_model_id), // Custom SQL name
			entity_id_idx: index("kl_dimensions_entity_id_idx").on(table.entity_id), // Custom SQL name
		},
	],
);

export const dimension_relations = relations(kl_core_dimensions, ({ one }) => {
	return {
		entry: one(kl_core_entries, {
			fields: [kl_core_dimensions.entry_id],
			references: [kl_core_entries.id],
		}),
		entity_model: one(kl_core_entity_models, {
			fields: [kl_core_dimensions.entity_model_id],
			references: [kl_core_entity_models.id],
		}),
		entity: one(kl_core_entities, {
			fields: [kl_core_dimensions.entity_id],
			references: [kl_core_entities.id],
		}),
	};
});
