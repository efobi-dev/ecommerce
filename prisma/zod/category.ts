import * as z from "zod";
import { type CompleteProduct, relatedProductSchema } from "./index";

export const categorySchema = z.object({
	id: z.string(),
	name: z.string(),
});

export interface CompleteCategory extends z.infer<typeof categorySchema> {
	products: CompleteProduct[];
}

/**
 * relatedCategorySchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedCategorySchema: z.ZodSchema<CompleteCategory> = z.lazy(() =>
	categorySchema.extend({
		products: relatedProductSchema.array(),
	}),
);
