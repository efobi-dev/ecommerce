import prisma from "@/lib/db";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "./ui/card";

export async function CategorySection() {
	const categories = await prisma.category.findMany();
	return (
		<section className="w-full py-8">
			<h2 className="text-2xl font-semibold mb-4">Categories</h2>
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
				{categories.map((c) => (
					<Card key={c.id} className="hover:bg-accent/45">
						<Link href={`/search/${c.name}`}>
							<CardHeader>
								<CardTitle>{c.name}</CardTitle>
							</CardHeader>
						</Link>
					</Card>
				))}
			</div>
		</section>
	);
}
