import * as z from "zod";
import {
	type CompleteCustomer,
	type CompleteProduct,
	type CompleteProductVariant,
	relatedCustomerSchema,
	relatedProductSchema,
	relatedProductVariantSchema,
} from "./index";

export const orderSchema = z.object({
	id: z.string(),
	customerId: z.string(),
	productId: z.string(),
	productVariantId: z.string().nullish(),
	quantity: z.number().int(),
	price: z.number(),
	totalAmount: z.number(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export interface CompleteOrder extends z.infer<typeof orderSchema> {
	customer: CompleteCustomer;
	product: CompleteProduct;
	productVariant?: CompleteProductVariant | null;
}

/**
 * relatedOrderSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOrderSchema: z.ZodSchema<CompleteOrder> = z.lazy(() =>
	orderSchema.extend({
		customer: relatedCustomerSchema,
		product: relatedProductSchema,
		productVariant: relatedProductVariantSchema.nullish(),
	}),
);
