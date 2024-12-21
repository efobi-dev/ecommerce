import prisma from "@/lib/db";
import { Suspense } from "react";
import { CategoriesCard } from "./categories";
import { ContentCard } from "./content-card";
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
import { Skeleton } from "./ui/skeleton";

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
		<Suspense fallback={<ProductsLoader />}>
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
				<ContentCard />
			</div>
			<h2 className="mt-8 text-xl font-semibold">All Products</h2>
			<DataTable columns={productColumns} data={data} />
		</Suspense>
	);
}

function ProductsLoader() {
	return (
		<>
			<Card>
				<CardHeader>
					<Skeleton className="h-8 w-3/4" />
					<Skeleton className="h-4 w-1/2 mt-2" />
				</CardHeader>
				<CardContent>
					<Skeleton className="h-[300px] w-full" />
				</CardContent>
			</Card>
			<Skeleton className="h-8 w-1/4 mt-8" />
			<div className="grid gap-4 md:grid-cols-3 mt-4">
				<Skeleton className="h-[200px]" />
				<Skeleton className="h-[200px]" />
			</div>
			<Skeleton className="h-8 w-1/4 mt-8" />
			<Skeleton className="h-[400px] w-full mt-4" />
		</>
	);
}
