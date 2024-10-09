import prisma from "@/lib/db";
import { Card, CardContent } from "./ui/card";
import {
	Table,
	TableHeader,
	TableRow,
	TableHead,
	TableBody,
	TableCell,
} from "./ui/table";
import { TableSkeleton } from "./loaders/table";

export async function RecentOrders() {
	const recentOrders = await prisma.order.findMany({
		take: 5,
		include: {
			customer: true,
			orderItems: {
				include: {
					product: true,
				},
			},
		},
	});
	return recentOrders && recentOrders.length > 0 ? (
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
								<TableCell>
									{order.orderItems[0]?.product.name || "N/A"}
								</TableCell>
								<TableCell>
									{new Date(order.createdAt).toLocaleString()}
								</TableCell>
								<TableCell className="text-right">
									{new Intl.NumberFormat("en-NG", {
										style: "currency",
										currency: "NGN",
									}).format(Number(order.totalAmount))}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	) : (
		<TableSkeleton number={3} />
	);
}
