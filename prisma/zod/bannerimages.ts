import * as z from "zod";

export const bannerImagesSchema = z.object({
	id: z.string(),
	url: z.string(),
	altText: z.string(),
	active: z.boolean(),
});
