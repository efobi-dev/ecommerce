import { CategorySection } from "@/components/category-section";
import { HeroSection } from "@/components/hero-section";
import { ProductSection } from "@/components/product-section";
import prisma from "@/lib/db";

export default async function Page() {
	const response = await prisma.product.findMany({
		take: 6,
		include: { images: true, category: true },
	});
	const products = response.map((p) => ({
		...p,
		basePrice: Number(p.basePrice),
	}));

	const images = products.map((p) => p.images[0]);
	return (
		<>
			<HeroSection images={images} />
			<CategorySection />
			<ProductSection products={products} />
		</>
	);
}
