import type {
	categorySchema,
	customerSchema,
	orderItemSchema,
	orderSchema,
	productImageSchema,
	productSchema,
	storeSchema,
} from "@/prisma/zod";
import { z } from "zod";

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type OrderItem = z.infer<typeof orderItemSchema>;
export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type Store = z.infer<typeof storeSchema>;

export interface Menu {
	name: string;
	link: string;
	icon: string;
}

export const signInSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = z.object({
	email: z
		.string({ required_error: "Email is required" })
		.min(1, "Email is required")
		.email("Invalid email"),
	password: z
		.string({ required_error: "Password is required" })
		.min(1, "Password is required")
		.min(8, "Password must be more than 8 characters")
		.max(32, "Password must be less than 32 characters"),
	fullName: z.string().min(8),
});

export const menuLink: Menu[] = [
	{
		name: "Dashboard",
		link: "/dashboard",
		icon: "Home",
	},
	{
		name: "Orders",
		link: "/orders",
		icon: "ShoppingCart",
	},
	{
		name: "Products",
		link: "/products",
		icon: "Package",
	},
	// {
	// 	name: "Users",
	// 	link: "/users",
	// 	icon: "Users",
	// },
];
