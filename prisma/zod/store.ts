import * as z from "zod"

export const storeSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.string(),
  maintenance: z.boolean(),
})
