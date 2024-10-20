import * as z from "zod";
import {
	type CompleteOrder,
	type CompleteUser,
	relatedOrderSchema,
	relatedUserSchema,
} from "./index";

export const customerSchema = z.object({
	id: z.string(),
	userId: z.string().nullish(),
	name: z.string(),
	email: z.string(),
	phone: z.string(),
	address: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export interface CompleteCustomer extends z.infer<typeof customerSchema> {
	user?: CompleteUser | null;
	orders: CompleteOrder[];
}

/**
 * relatedCustomerSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCustomerSchema: z.ZodSchema<CompleteCustomer> = z.lazy(() =>
	customerSchema.extend({
		user: relatedUserSchema.nullish(),
		orders: relatedOrderSchema.array(),
	}),
);
