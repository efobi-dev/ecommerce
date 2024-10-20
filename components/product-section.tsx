import prisma from "@/lib/db";
import { ProductCard } from "./product-card";
import { ProductCardLoader } from "./loaders/product-card";

export async function ProductSection() {
	const products = await prisma.product.findMany({
		take: 6,
		include: { images: true, category: true },
	});
	return (
		<section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{products
				? products.map((p) => (
						<ProductCard
							p={{ ...p, basePrice: Number(p.basePrice) }}
							key={p.id}
						/>
					))
				: new Array(6).fill(null).map((_, index) => (
						<ProductCardLoader
							key={`loader-${
								// biome-ignore lint/suspicious/noArrayIndexKey: need to use the index for this
								index
							}`}
						/>
					))}
		</section>
	);
}
