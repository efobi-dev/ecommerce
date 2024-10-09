import * as z from "zod"
import { CompleteProduct, relatedProductSchema } from "./index"

export const productImageSchema = z.object({
  id: z.number().int(),
  url: z.string(),
  altText: z.string().nullish(),
  productId: z.string(),
})

export interface CompleteProductImage extends z.infer<typeof productImageSchema> {
  product: CompleteProduct
}

/**
 * relatedProductImageSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedProductImageSchema: z.ZodSchema<CompleteProductImage> = z.lazy(() => productImageSchema.extend({
  product: relatedProductSchema,
}))
