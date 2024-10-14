"use server";

import prisma from "@/lib/db";
import type { Product, ProductImage } from "@/lib/constants";
import { getAuth } from "@/lib/auth";
import { productSchema, productImageSchema } from "@/prisma/zod";
import { revalidatePath } from "next/cache";

export async function addProduct(values: Product) {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Unauthenticated" };
		const { data, error } = await productSchema.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const product = await prisma.product.create({ data });
		if (!product) return { error: "Failed to create product" };
		return { success: true, message: "Product created successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function addProductImage(values: ProductImage) {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Unauthenticated" };
		const { data, error } = await productImageSchema.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const productImage = await prisma.productImage.create({ data });
		if (!productImage) return { error: "Failed to create product image" };
		return { success: true, message: "Product image added successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function updateAvailability(values: {
	id: string;
	state: boolean;
}) {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Unauthenticated" };
		const { id, state } = values;
		const update = await prisma.product.update({
			where: { id },
			data: { available: state },
		});
		if (!update) return { error: "Failed to update availability" };
		revalidatePath("/products");
		return { success: true, message: "Availability updated" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}
