import * as z from "zod";
import {
	type CompleteCategory,
	type CompleteOrderItem,
	type CompleteProductImage,
	type CompleteProductVariant,
	relatedCategorySchema,
	relatedOrderItemSchema,
	relatedProductImageSchema,
	relatedProductVariantSchema,
} from "./index";

export const productSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string().nullish(),
	sku: z.string(),
	basePrice: z.number(),
	categoryId: z.string(),
	available: z.boolean(),
	createdAt: z.date(),
	updatedAt: z.date(),
});

export interface CompleteProduct extends z.infer<typeof productSchema> {
	category: CompleteCategory;
	images: CompleteProductImage[];
	variants: CompleteProductVariant[];
	orderItems: CompleteOrderItem[];
}

/**
 * relatedProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductSchema: z.ZodSchema<CompleteProduct> = z.lazy(() =>
	productSchema.extend({
		category: relatedCategorySchema,
		images: relatedProductImageSchema.array(),
		variants: relatedProductVariantSchema.array(),
		orderItems: relatedOrderItemSchema.array(),
	}),
);
