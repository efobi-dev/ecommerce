import { ProductCardLoader } from "@/components/loaders/product-card";
import { ProductCard } from "@/components/product-card";
import prisma from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata({
	params,
}: { params: Promise<{ name: string }> }): Promise<Metadata> {
	const { name } = await params;
	const category = await prisma.category.findUnique({ where: { name } });

	return {
		title: `${category?.name} Products`,
		description: `Browse ${category?.name} products`,
		openGraph: {
			type: "website",
			title: `${category?.name} Products`,
			description: `Browse ${category?.name} products`,
		},
	};
}
export default async function Page({
	params,
}: { params: Promise<{ name: string }> }) {
	const { name } = await params;
	const category = await prisma.category.findUnique({ where: { name } });
	const products = await prisma.product.findMany({
		where: { categoryId: category?.id },
		include: { images: true },
	});

	if (!category || !products) {
		notFound();
	}

	return (
		<section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			<Suspense
				fallback={new Array(6).fill(null).map((_, index) => (
					<ProductCardLoader
						key={`loader-${
							// biome-ignore lint/suspicious/noArrayIndexKey: need to use the index for this
							index
						}`}
					/>
				))}
			>
				{products.map((p) => (
					<ProductCard
						key={p.id}
						p={{ ...p, basePrice: Number(p.basePrice), category }}
					/>
				))}
			</Suspense>
		</section>
	);
}
