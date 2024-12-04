"use server";

import { auth } from "@/lib/auth";
import type { Store } from "@/lib/constants";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import { storeSchema } from "@/prisma/zod";
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
