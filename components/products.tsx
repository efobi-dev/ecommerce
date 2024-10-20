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
	const [products, orders] = await Promise.all([
		prisma.product.findMany(),
		prisma.order.findMany(),
	]);

	const data = products.map((product) => {
		const totalOrders = orders.filter(
			(order) => order.productId === product.id,
		).length;
		return {
			id: product.id,
			name: product.name,
			available: product.available,
			basePrice: Number(product.basePrice),
			totalOrders: totalOrders,
		};
	});

	const chartData = products.map((product) => {
		const productOrders = orders.filter(
			(order) => order.productId === product.id,
		);
		const totalOrders = productOrders.length;
		const orderData = Array.from({ length: 5 }, (_, i) => {
			const year = new Date().getFullYear() - i;
			const yearOrders = productOrders.filter(
				(order) => new Date(order.createdAt).getFullYear() === year,
			);
			return {
				year,
				totalOrders: yearOrders.length,
			};
		});

		return {
			name: product.name,
			totalOrders,
			productName: product.name,
			orderData,
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
