import { ProductDetails } from "@/components/product-details";
import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { name: string } }) {
	const { name } = params;
	if (!name) {
		notFound();
	}

	const decodedName = decodeURIComponent(name);

	const product = await prisma.product.findFirst({
		where: { name: decodedName },
		include: { images: true, category: true },
	});

	if (!product) {
		notFound();
	}

	return (
		<section>
			<ProductDetails
				product={{ ...product, basePrice: Number(product.basePrice) }}
			/>
		</section>
	);
}
