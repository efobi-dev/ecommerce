import prisma from "@/lib/db";
import { CategoriesCard } from "./categories";
import { productColumns } from "./product-column";
import { ProductsChart } from "./products-chart";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { DataTable } from "./ui/data-table";

export async function Product() {
	const [products, orderItems] = await Promise.all([
		prisma.product.findMany(),
		prisma.orderItem.findMany({
			include: {
				order: {
					select: {
						createdAt: true,
					},
				},
			},
		}),
	]);

	const chartData = products.map((product) => {
		const productOrders = orderItems.filter(
			(item) => item.productId === product.id,
		);
		const ordersByYear = productOrders.reduce<Record<number, number>>(
			(acc, item) => {
				const year = new Date(item.order.createdAt).getFullYear();
				acc[year] = (acc[year] || 0) + 1;
				return acc;
			},
			{},
		);

		return {
			productName: product.name,
			orderData: Object.entries(ordersByYear).map(([year, count]) => ({
				year: Number.parseInt(year),
				totalOrders: count,
			})),
		};
	});

	const data = products.map((product) => {
		const totalOrders = orderItems.filter(
			(item) => item.productId === product.id,
		).length;
		return {
			id: product.id,
			name: product.name,
			available: product.available,
			basePrice: Number(product.basePrice),
			totalOrders: totalOrders,
		};
	});

	return (
		<>
			<Card>
				<CardHeader>
					<CardTitle>Product Performance Overview</CardTitle>
					<CardDescription>
						Performance data for the duration of a year
					</CardDescription>
				</CardHeader>
				<CardContent>
					<ProductsChart chartData={chartData} />
				</CardContent>
			</Card>
			<h2 className="text-xl font-semibold py-4">Other actions</h2>
			<div className="grid gap-4 md:grid-cols-3">
				<CategoriesCard />
			</div>
			<h2 className="mt-8 text-xl font-semibold">All Products</h2>
			<DataTable columns={productColumns} data={data} />
		</>
	);
}
