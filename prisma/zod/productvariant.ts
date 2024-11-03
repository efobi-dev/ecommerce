import * as z from "zod"
import { CompleteProduct, relatedProductSchema, CompleteOrder, relatedOrderSchema } from "./index"

export const productVariantSchema = z.object({
  id: z.string(),
  name: z.string(),
  sku: z.string(),
  price: z.number(),
  stock: z.number().int(),
  productId: z.string(),
})

export interface CompleteProductVariant extends z.infer<typeof productVariantSchema> {
  product: CompleteProduct
  orders: CompleteOrder[]
}

/**
 * relatedProductVariantSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductVariantSchema: z.ZodSchema<CompleteProductVariant> = z.lazy(() => productVariantSchema.extend({
  product: relatedProductSchema,
  orders: relatedOrderSchema.array(),
}))
