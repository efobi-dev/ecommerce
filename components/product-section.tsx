import prisma from "@/lib/db";
import { ProductCard } from "./product-card";

export async function ProductSection() {
	const products = await prisma.product.findMany({
		take: 6,
		include: { images: true, category: true },
	});
	return (
		<section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{products.map((p) => (
				<ProductCard p={{ ...p, basePrice: Number(p.basePrice) }} key={p.id} />
			))}
		</section>
	);
}
