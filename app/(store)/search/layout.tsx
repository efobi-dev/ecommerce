import { CategoryNav } from "@/components/category-nav";
import prisma from "@/lib/db";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		template: "%s | Search results",
		default: "Search results",
	},
};

export default async function SearchLayout({
	children,
}: { children: ReactNode }) {
	const categories = await prisma.category.findMany();
	return (
		<div className="flex min-h-screen">
			<CategoryNav categories={categories} />
			<main className="flex-1 p-4">{children}</main>
		</div>
	);
}
