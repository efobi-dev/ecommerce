import { ProductCardLoader } from "@/components/loaders/product-card";
import { ProductCard } from "@/components/product-card";
import prisma from "@/lib/db";

//TODO:fix code errors

export default async function Page({ params }: { params: { name: string } }) {
	const { name } = params;
	const category = await prisma.category.findUnique({ where: { name } });
	const products = await prisma.product.findMany({
		where: { categoryId: category?.id },
		include: { images: true },
	});

	return (
		<section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{category
				? products.map((p) => (
						<ProductCard
							p={{ ...p, basePrice: Number(p.basePrice), category }}
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
			{category &&
				products.map((p) => (
					<ProductCard
						p={{ ...p, basePrice: Number(p.basePrice), category }}
						key={p.id}
					/>
				))}
		</section>
	);
}