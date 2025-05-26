import { faker } from "@faker-js/faker";
import { type NewAccount, type NewEntityModel, type NewLedger, type NewTransactionModel, type NewUnitType } from "../../types/index.js";
import { v7 as uuid } from "uuid";
import { BalanceType } from "./schema.js";

abstract class Factory {
	abstract make(type?: string): NewLedger | NewAccount | NewUnitType | NewEntityModel | NewTransactionModel;
	abstract makeMany(count: number, type?: string): NewLedger[] | NewAccount[] | NewUnitType[] | NewEntityModel[] | NewTransactionModel[];
}

export class LedgerFactory extends Factory {
	public make(type?: string): NewLedger {
		// Choose to not do anything with the type argument
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.company.name(),
			description: faker.company.catchPhrase(),
			active: true,
		};
	}

	public makeMany(count: number) {
		return Array.from({ length: count }, () => this.make());
	}
}

export class AccountFactory extends Factory {
	public make(type?: string): NewAccount {
		// Choose to not do anything with the type argument
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.company.name(),
			balance_type: [BalanceType.DEBIT, BalanceType.CREDIT][Math.floor(Math.random() * 2)],
			ledger_id: uuid(),
			active: true,
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class UnitTypeFactory extends Factory {
	public make(type?: string): NewUnitType {
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.word.words(2),
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class EntityModelFactory extends Factory {
	public make(type?: string): NewEntityModel {
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.company.name(),
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}

export class TransactionModelFactory extends Factory {
	public make(type?: string): NewTransactionModel {
		type;

		return {
			id: uuid(),
			ref_id: uuid(),
			alt_id: uuid(),
			name: faker.company.name(),
		};
	}

	public makeMany(count: number, type?: string) {
		return Array.from({ length: count }, () => this.make(type));
	}
}
