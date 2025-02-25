"use server";

import { auth } from "@/lib/auth";
import type { BannerImage, Store } from "@/lib/constants";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { utapi } from "@/lib/uploadthing/server";
import { bannerImagesSchema, storeSchema } from "@/prisma/zod";
import { unstable_cache as cache, revalidateTag } from "next/cache";
import { headers } from "next/headers";

export async function getStore() {
	return await cache(
		async () => {
			const response = await prisma.store.findUnique({
				where: { id: env.NEXT_PUBLIC_STORE_ID },
			});
			if (!response) throw new Error("Store not found");
			return storeSchema.parse(response);
		},
		["store"],
		{
			revalidate: 86400,
			tags: ["store"],
		},
	)();
}

export async function updateStore(values: Store) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (authz?.user.role !== "owner") return { error: "Unauthorized" };
		const { data, error } = await storeSchema.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const response = await prisma.store.update({
			where: { id: env.NEXT_PUBLIC_STORE_ID },
			data,
		});
		if (!response) return { error: "Store update failed" };
		revalidateTag("store");
		return { success: true, message: "Store updated successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function addBannerImage(values: BannerImage) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz?.user) return { error: "Unauthenticated" };
		if (authz?.user.role !== "owner") return { error: "Unauthorized" };
		const { data, error } = await bannerImagesSchema.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const response = await prisma.bannerImages.create({ data });
		if (!response) return { error: "Failed to create banner image" };
		return { success: true, message: "Banner image added successfully" };
	} catch (error) {
		console.error(error);
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}

export async function deleteBannerImage(id: string) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz?.user) return { error: "Unauthenticated" };
		if (authz?.user.role !== "owner") return { error: "Unauthorized" };
		const image = await prisma.bannerImages.findUnique({ where: { id } });
		if (!image) return { error: "Image not found" };
		const fileKey = image.url.split("/").pop() as string;
		const uploadthing = await utapi.deleteFiles(fileKey);
		if (!uploadthing.success)
			return { error: "Failed to delete the image from file server" };
		const deleted = await prisma.bannerImages.delete({ where: { id } });
		if (!deleted) return { error: "Failed to delete the image from database" };
		return { success: true, message: "Deleted successfully" };
	} catch (error) {
		console.error(error);
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}

export async function updateBannerImage(id: string) {
	try {
		const authz = await auth.api.getSession({ headers: await headers() });
		if (!authz?.user) return { error: "Unauthenticated" };
		if (authz?.user.role !== "owner") return { error: "Unauthorized" };
		const product = await prisma.bannerImages.findUnique({ where: { id } });
		if (!product) return { error: "Image not found" };
		const response = await prisma.bannerImages.update({
			where: { id },
			data: { active: !product.active },
		});
		if (!response) return { error: "Failed to update the image" };
		return { success: true, message: "Updated successfully" };
	} catch (error) {
		console.error(error);
		return {
			error: error instanceof Error ? error.message : "Internal server error",
		};
	}
}
