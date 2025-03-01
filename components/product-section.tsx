import type { PartialProduct } from "@/lib/constants";
import { ProductCardLoader } from "./loaders/product-card";
import { ProductCard } from "./product-card";

export function ProductSection({ products }: { products: PartialProduct[] }) {
	return (
		<section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{products.length > 0
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
