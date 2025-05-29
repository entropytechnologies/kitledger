import { getDbInstance } from '../services/database/db.ts';
import { kl_core_transaction_models } from '../services/database/schema.ts';
import z from 'zod/v4';
import { type NewTransactionModel } from '../types/index.ts';
import { valueIsAvailable } from '../utils/validation.ts';

/**
 * Check if the name is available
 * @param name
 * @returns Promise<boolean>
 */
async function nameIsAvailable(name: string): Promise<boolean> {
	return await valueIsAvailable(kl_core_transaction_models, 'name', name);
}

/**
 * Check if the ref_id is available
 * @param ref_id
 * @returns :Promise<boolean>
 */
async function refIdIsAvailable(ref_id: string): Promise<boolean> {
	return await valueIsAvailable(kl_core_transaction_models, 'ref_id', ref_id);
}

/**
 * Check if the alt_id is available
 * @param alt_id
 * @returns :Promise<boolean>
 */
async function altIdIsAvailable(alt_id: string): Promise<boolean> {
	return await valueIsAvailable(kl_core_transaction_models, 'alt_id', alt_id);
}

/**
 * Validate the creation of a new transaction model
 * @param data
 * @returns Promise<z.infer<typeof validationSchema>>
 */
async function validateCreation(data: NewTransactionModel) {
	const validationSchema = z.object({
		id: z.uuid(),
		ref_id: z.string().max(64, { error: 'Ref ID must be less than 64 characters' }).refine(refIdIsAvailable, {
			error: 'Ref ID already exists',
		}),
		alt_id: z
			.string()
			.max(64, { error: 'Alt ID must be less than 64 characters' })
			.refine(altIdIsAvailable, {
				error: 'Alt ID already exists',
			})
			.optional()
			.nullable(),
		name: z.string().max(255, { error: 'Name must be less than 255 characters' }).refine(nameIsAvailable, {
			error: 'Name already exists',
		}),
		active: z.boolean().optional().nullable(),
	});

	return await validationSchema.safeParseAsync(data);
}

/**
 * Create a new transaction model
 * @param data
 */
async function create(data: NewTransactionModel) {
	const db = getDbInstance();
	const result = await db.insert(kl_core_transaction_models).values(data).returning();
	return result[0];
}

/**
 * Export a namespaced object with the actions
 */
export const TransactionModels = {
	create,
	validateCreation,
};
