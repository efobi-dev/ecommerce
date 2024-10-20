import { ProductCard } from "@/components/product-card";
import prisma from "@/lib/db";
import type { Prisma } from "@prisma/client";

export default async function SearchPage({
	searchParams,
}: { searchParams: { q?: string } }) {
	const query = searchParams.q || "";

	let where: Prisma.ProductWhereInput = {};
	if (query) {
		where = {
			OR: [
				{ name: { contains: query, mode: "insensitive" } },
				{ description: { contains: query, mode: "insensitive" } },
			],
		};
	}

	const products = await prisma.product.findMany({
		where,
		include: { category: true, images: true },
	});

	return (
		<div>
			{query && (
				<h1 className="text-xl py-1">
					Search results for{" "}
					<span className="text-primary font-semibold">"{query}"</span>
				</h1>
			)}
			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
				{products?.map((p) => (
					<ProductCard
						p={{ ...p, basePrice: Number(p.basePrice) }}
						key={p.id}
					/>
				))}
			</div>
		</div>
	);
}
