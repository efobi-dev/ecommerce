"use server";

import { getAuth } from "@/actions/auth";
import prisma from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function getCategories() {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Unauthenticated" };
		const categories = await prisma.category.findMany();
		if (!categories) return { error: "Failed to get categories" };
		return { success: true, categories };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function addCategory(name: string) {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Unauthenticated" };
		const category = await prisma.category.create({ data: { name } });
		if (!category) return { error: "Failed to create category" };
		revalidatePath("/products");
		return { success: true, message: "Category created" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function deleteCategory(id: string) {
	try {
		const { user } = await getAuth();
		if (!user) return { error: "Unauthenticated" };
		const category = await prisma.category.delete({ where: { id } });
		if (!category) return { error: "Failed to delete category" };
		revalidatePath("/products");
		return { success: true, message: "Category deleted" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}
