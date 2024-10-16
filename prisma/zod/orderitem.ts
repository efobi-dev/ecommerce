import * as z from "zod"
import { CompleteOrder, relatedOrderSchema, CompleteProduct, relatedProductSchema, CompleteProductVariant, relatedProductVariantSchema } from "./index"

export const orderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  productVariantId: z.string().nullish(),
  quantity: z.number().int(),
  price: z.number(),
})

export interface CompleteOrderItem extends z.infer<typeof orderItemSchema> {
  order: CompleteOrder
  product: CompleteProduct
  productVariant?: CompleteProductVariant | null
}

/**
 * relatedOrderItemSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedOrderItemSchema: z.ZodSchema<CompleteOrderItem> = z.lazy(() => orderItemSchema.extend({
  order: relatedOrderSchema,
  product: relatedProductSchema,
  productVariant: relatedProductVariantSchema.nullish(),
}))
