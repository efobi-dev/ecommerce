import prisma from "@/lib/db";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import Link from "next/link";

export async function ProductSection() {
	const products = await prisma.product.findMany({
		take: 6,
		include: { images: true, category: true },
	});
	return (
		<section className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
			{products.map((p) => (
				<Card key={p.id} className="overflow-hidden">
					<Link href={`/products/${p.name}`} className="block">
						<div className="relative h-48">
							<Image
								src={p.images[0].url}
								fill
								alt={p.name}
								sizes="100vw"
								quality={100}
								className="object-cover hover:scale-110 transition duration-300"
							/>
						</div>
						<CardHeader>
							<div className="flex justify-between items-start">
								<div>
									<CardTitle className="text-lg">{p.name}</CardTitle>
									<CardDescription className="mt-1">
										{new Intl.NumberFormat("en-NG", {
											style: "currency",
											currency: "NGN",
										}).format(Number(p.basePrice) + 5000)}{" "}
										per carton
										{/** added #50 as requested */}
									</CardDescription>
								</div>
								<h3 className="font-semibold text-sm px-2 py-1 rounded">
									{p.category.name}
								</h3>
							</div>
						</CardHeader>
					</Link>
				</Card>
			))}
		</section>
	);
}
