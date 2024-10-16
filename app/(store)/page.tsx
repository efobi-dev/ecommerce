import { HeroSection } from "@/components/hero-section";
import { ProductSection } from "@/components/product-section";
import { CategorySection } from "@/components/category-section";
import prisma from "@/lib/db";

export default async function Page() {
	const categories = await prisma.category.findMany();
	return (
		<>
			<HeroSection />
			<CategorySection categories={categories} />
			<ProductSection />
		</>
	);
}
