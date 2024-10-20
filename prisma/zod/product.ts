import * as z from "zod"
import { CompleteCategory, relatedCategorySchema, CompleteProductImage, relatedProductImageSchema, CompleteProductVariant, relatedProductVariantSchema, CompleteOrder, relatedOrderSchema } from "./index"

export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  sku: z.string(),
  basePrice: z.number(),
  categoryId: z.string(),
  available: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteProduct extends z.infer<typeof productSchema> {
  category: CompleteCategory
  images: CompleteProductImage[]
  variants: CompleteProductVariant[]
  orders: CompleteOrder[]
}

/**
 * relatedProductSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductSchema: z.ZodSchema<CompleteProduct> = z.lazy(() => productSchema.extend({
  category: relatedCategorySchema,
  images: relatedProductImageSchema.array(),
  variants: relatedProductVariantSchema.array(),
  orders: relatedOrderSchema.array(),
}))
