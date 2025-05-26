DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typtype = 'e' AND n.nspname = 'public' AND t.typname = 'kl_core_balance_type'
    ) THEN
        CREATE TYPE "public"."kl_core_balance_type" AS ENUM('DEBIT', 'CREDIT');
    END IF;
END $$; --> statement-breakpoint
CREATE TABLE "kl_core_accounts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"balance_type" "kl_core_balance_type",
	"ledger_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"meta" jsonb,
	"active" boolean DEFAULT true,
	CONSTRAINT "kl_core_accounts_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_accounts_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "kl_core_accounts_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "kl_core_conversion_rates" (
	"id" uuid PRIMARY KEY NOT NULL,
	"from_uom_id" uuid NOT NULL,
	"to_uom_id" uuid NOT NULL,
	"rate" numeric(24, 8) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kl_core_dimensions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"entry_id" uuid NOT NULL,
	"entity_model_id" uuid,
	"entity_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "kl_core_entities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"entity_model_id" uuid NOT NULL,
	"parent_id" uuid,
	"name" varchar(255) NOT NULL,
	"meta" jsonb,
	CONSTRAINT "kl_core_entities_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_entities_alt_id_unique" UNIQUE("alt_id")
);
--> statement-breakpoint
CREATE TABLE "kl_core_entity_models" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"name" varchar(255) NOT NULL,
	"active" boolean DEFAULT true,
	CONSTRAINT "kl_core_entity_models_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_entity_models_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "kl_core_entity_models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "kl_core_entries" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"ledger_id" uuid NOT NULL,
	"debit_account_id" uuid NOT NULL,
	"credit_account_id" uuid NOT NULL,
	"uom_id" uuid NOT NULL,
	"value" numeric(64, 16) DEFAULT '0',
	"transaction_id" uuid NOT NULL,
	CONSTRAINT "kl_core_entries_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_entries_alt_id_unique" UNIQUE("alt_id")
);
--> statement-breakpoint
CREATE TABLE "kl_core_ledgers" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"name" varchar(255) NOT NULL,
	"description" text,
	"unit_type_id" uuid,
	"active" boolean DEFAULT true,
	CONSTRAINT "kl_core_ledgers_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_ledgers_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "kl_core_ledgers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "kl_core_transaction_models" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"name" varchar(255) NOT NULL,
	"active" boolean DEFAULT true,
	CONSTRAINT "kl_core_transaction_models_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_transaction_models_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "kl_core_transaction_models_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "kl_core_transactions" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"transaction_model_id" uuid NOT NULL,
	"meta" jsonb,
	"lines" jsonb,
	CONSTRAINT "kl_core_transactions_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_transactions_alt_id_unique" UNIQUE("alt_id")
);
--> statement-breakpoint
CREATE TABLE "kl_core_unit_types" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"name" varchar(255) NOT NULL,
	CONSTRAINT "kl_core_unit_types_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_unit_types_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "kl_core_unit_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "kl_core_units" (
	"id" uuid PRIMARY KEY NOT NULL,
	"ref_id" varchar(64) NOT NULL,
	"alt_id" varchar(64),
	"unit_type_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"symbol" varchar(20),
	"precision" integer DEFAULT 0,
	"decimal_separator" char(1) NOT NULL,
	"thousands_separator" char(1) NOT NULL,
	"active" boolean DEFAULT true,
	CONSTRAINT "kl_core_units_ref_id_unique" UNIQUE("ref_id"),
	CONSTRAINT "kl_core_units_alt_id_unique" UNIQUE("alt_id"),
	CONSTRAINT "kl_core_units_name_unique" UNIQUE("name"),
	CONSTRAINT "kl_core_units_symbol_unique" UNIQUE("symbol")
);
--> statement-breakpoint
ALTER TABLE "kl_core_accounts" ADD CONSTRAINT "kl_core_accounts_ledger_id_kl_core_ledgers_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."kl_core_ledgers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_accounts" ADD CONSTRAINT "kl_core_accounts_parent_id_kl_core_accounts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."kl_core_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_conversion_rates" ADD CONSTRAINT "kl_core_conversion_rates_from_uom_id_kl_core_units_id_fk" FOREIGN KEY ("from_uom_id") REFERENCES "public"."kl_core_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_conversion_rates" ADD CONSTRAINT "kl_core_conversion_rates_to_uom_id_kl_core_units_id_fk" FOREIGN KEY ("to_uom_id") REFERENCES "public"."kl_core_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_dimensions" ADD CONSTRAINT "kl_core_dimensions_entry_id_kl_core_entries_id_fk" FOREIGN KEY ("entry_id") REFERENCES "public"."kl_core_entries"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_dimensions" ADD CONSTRAINT "kl_core_dimensions_entity_model_id_kl_core_entity_models_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."kl_core_entity_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_dimensions" ADD CONSTRAINT "kl_core_dimensions_entity_id_kl_core_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."kl_core_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_entities" ADD CONSTRAINT "kl_core_entities_entity_model_id_kl_core_entity_models_id_fk" FOREIGN KEY ("entity_model_id") REFERENCES "public"."kl_core_entity_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_entities" ADD CONSTRAINT "kl_core_entities_parent_id_kl_core_entities_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."kl_core_entities"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_entries" ADD CONSTRAINT "kl_core_entries_ledger_id_kl_core_ledgers_id_fk" FOREIGN KEY ("ledger_id") REFERENCES "public"."kl_core_ledgers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_entries" ADD CONSTRAINT "kl_core_entries_debit_account_id_kl_core_accounts_id_fk" FOREIGN KEY ("debit_account_id") REFERENCES "public"."kl_core_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_entries" ADD CONSTRAINT "kl_core_entries_credit_account_id_kl_core_accounts_id_fk" FOREIGN KEY ("credit_account_id") REFERENCES "public"."kl_core_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_entries" ADD CONSTRAINT "kl_core_entries_uom_id_kl_core_units_id_fk" FOREIGN KEY ("uom_id") REFERENCES "public"."kl_core_units"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_entries" ADD CONSTRAINT "kl_core_entries_transaction_id_kl_core_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."kl_core_transactions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_ledgers" ADD CONSTRAINT "kl_core_ledgers_unit_type_id_kl_core_unit_types_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."kl_core_unit_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_transactions" ADD CONSTRAINT "kl_core_transactions_transaction_model_id_kl_core_transaction_models_id_fk" FOREIGN KEY ("transaction_model_id") REFERENCES "public"."kl_core_transaction_models"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "kl_core_units" ADD CONSTRAINT "kl_core_units_unit_type_id_kl_core_unit_types_id_fk" FOREIGN KEY ("unit_type_id") REFERENCES "public"."kl_core_unit_types"("id") ON DELETE no action ON UPDATE no action;