import * as z from "zod";

export const verificationSchema = z.object({
	id: z.string(),
	identifier: z.string(),
	value: z.string(),
	expiresAt: z.date(),
	createdAt: z.date().nullish(),
	updatedAt: z.date().nullish(),
});
