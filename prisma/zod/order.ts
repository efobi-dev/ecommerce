import * as z from "zod";
import {
	type CompleteCustomer,
	type CompleteOrderItem,
	relatedCustomerSchema,
	relatedOrderItemSchema,
} from "./index";

export const orderSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	totalAmount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export interface CompleteOrder extends z.infer<typeof orderSchema> {
	customer: CompleteCustomer;
	orderItems: CompleteOrderItem[];
}

/**
 * relatedOrderSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOrderSchema: z.ZodSchema<CompleteOrder> = z.lazy(() =>
	orderSchema.extend({
		customer: relatedCustomerSchema,
		orderItems: relatedOrderItemSchema.array(),
	}),
);
