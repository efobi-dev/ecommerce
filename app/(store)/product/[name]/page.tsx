import { ProductDetails } from "@/components/product-details";
import prisma from "@/lib/db";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata({
	params,
}: { params: { name: string } }): Promise<Metadata> {
	const decodedName = decodeURIComponent(params.name);
	const product = await prisma.product.findFirst({
		where: { name: decodedName },
		include: { images: true },
	});

	if (!product) {
		return {
			title: "Product Not Found",
			description: "The requested product could not be found.",
		};
	}

	return {
		title: product.name,
		description: product.description,
		openGraph: {
			type: "website",
			title: product.name,
			description: product.description,
			images: product.images.map((image: { url: string }) => image.url),
			locale: "en-NG",
		},
	};
}

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
