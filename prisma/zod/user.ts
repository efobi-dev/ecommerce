import { Role } from "@prisma/client";
import * as z from "zod";
import {
	type CompleteCustomer,
	type CompleteSession,
	relatedCustomerSchema,
	relatedSessionSchema,
} from "./index";

export const userSchema = z.object({
	id: z.string(),
	email: z.string(),
	fullName: z.string(),
	hashedPassword: z.string().nullish(),
	googleId: z.string().nullish(),
	avatar: z.string().nullish(),
	role: z.nativeEnum(Role),
});

export interface CompleteUser extends z.infer<typeof userSchema> {
	sessions: CompleteSession[];
	customer?: CompleteCustomer | null;
}

/**
 * relatedUserSchema contains all relations on your model in addition to the scalars
 *
 * NOTE: Lazy required in case of potential circular dependencies within schema
 */
export const relatedUserSchema: z.ZodSchema<CompleteUser> = z.lazy(() =>
	userSchema.extend({
		sessions: relatedSessionSchema.array(),
		customer: relatedCustomerSchema.nullish(),
	}),
);
