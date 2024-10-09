import * as z from "zod"
import { CompleteOrder, relatedOrderSchema } from "./index"

export const customerSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  email: z.string(),
  phone: z.string().nullish(),
  address: z.string().nullish(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export interface CompleteCustomer extends z.infer<typeof customerSchema> {
  orders: CompleteOrder[]
}

/**
 * relatedCustomerSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCustomerSchema: z.ZodSchema<CompleteCustomer> = z.lazy(() => customerSchema.extend({
  orders: relatedOrderSchema.array(),
}))
