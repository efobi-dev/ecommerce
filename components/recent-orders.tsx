import prisma from "@/lib/db";
import { Suspense } from "react";
import { TableSkeleton } from "./loaders/table";
import { Naira } from "./naira";
import { Card, CardContent } from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

export async function RecentOrders() {
	const recentOrders = await prisma.order.findMany({
		take: 5,
		include: {
			customer: true,
			product: true,
		},
	});
	return (
		<Suspense fallback={<TableSkeleton number={3} />}>
			<Card>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Order ID</TableHead>
								<TableHead>Customer</TableHead>
								<TableHead>Product</TableHead>
								<TableHead>Date</TableHead>
								<TableHead className="text-right">Amount</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{recentOrders.map((order) => (
								<TableRow key={order.id}>
									<TableCell>#{order.id}</TableCell>
									<TableCell>{order.customer.name}</TableCell>
									<TableCell>{order.product.name}</TableCell>
									<TableCell>
										{new Date(order.createdAt).toLocaleString()}
									</TableCell>
									<TableCell className="text-right">
										<Naira value={Number(order.totalAmount)} />
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</Suspense>
	);
}
