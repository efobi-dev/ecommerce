import * as z from "zod";
import {
	type CompleteAccount,
	type CompleteCustomer,
	type CompleteSession,
	relatedAccountSchema,
	relatedCustomerSchema,
	relatedSessionSchema,
} from "./index";

export const userSchema = z.object({
	id: z.string(),
	name: z.string(),
	email: z.string(),
	emailVerified: z.boolean(),
	image: z.string().nullish(),
	createdAt: z.date(),
	updatedAt: z.date(),
	role: z.string().nullish(),
	banned: z.boolean().nullish(),
	banReason: z.string().nullish(),
	banExpires: z.date().nullish(),
});

export interface CompleteUser extends z.infer<typeof userSchema> {
	Account: CompleteAccount[];
	Session: CompleteSession[];
	Customer: CompleteCustomer[];
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() =>
	userSchema.extend({
		Account: relatedAccountSchema.array(),
		Session: relatedSessionSchema.array(),
		Customer: relatedCustomerSchema.array(),
	}),
);
