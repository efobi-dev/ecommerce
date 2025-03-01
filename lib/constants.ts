import type {
	bannerImagesSchema,
	categorySchema,
	customerSchema,
	orderSchema,
	productImageSchema,
	productSchema,
	storeSchema,
} from "@/prisma/zod";
import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";

export type SignIn = z.infer<typeof signInSchema>;
export type SignUp = z.infer<typeof signUpSchema>;
export type Order = z.infer<typeof orderSchema>;
export type Customer = z.infer<typeof customerSchema>;
export type Product = z.infer<typeof productSchema>;
export type Category = z.infer<typeof categorySchema>;
export type ProductImage = z.infer<typeof productImageSchema>;
export type Store = z.infer<typeof storeSchema>;
export type Cart = z.infer<typeof cartSchema>;
export type BannerImage = z.infer<typeof bannerImagesSchema>;

export interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export interface User {
	id: string;
	name: string;
	email: string;
	role: string | null | undefined;
}
export interface PartialProduct extends Product {
	category: Category;
	images: ProductImage[];
}

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
	name: z.string().min(8),
	role: z.enum(["owner", "admin", "user"]).default("user"),
});

export const cartSchema = z.object({
	id: z.string(), //product id
	name: z.string(),
	price: z.number().min(0),
	quantity: z.number().min(1).default(1),
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

export interface GoogleUser {
	sub: string;
	name: string;
	given_name: string;
	family_name: string;
	picture: string;
	email: string;
	email_verified: boolean;
	locale: string;
}
