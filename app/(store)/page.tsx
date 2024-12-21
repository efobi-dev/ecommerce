import { CategorySection } from "@/components/category-section";
import { HeroSection } from "@/components/hero-section";
import { ProductSection } from "@/components/product-section";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Page() {
	const [images, response] = await Promise.all([
		await prisma.bannerImages.findMany({ where: { active: true } }),
		await prisma.product.findMany({
			take: 6,
			include: { images: true, category: true },
		}),
	]);
	if (!response) return notFound();
	const products = response.map((p) => ({
		...p,
		basePrice: Number(p.basePrice),
	}));
	return (
		<>
			<HeroSection images={images} />
			<CategorySection />
			<ProductSection products={products} />
		</>
	);
}
