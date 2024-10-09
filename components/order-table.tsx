import prisma from "@/lib/db";
import { DataTable } from "./ui/data-table";
import { orderColumns } from "./order-column";

export async function OrderTable() {
	const orders = await prisma.order.findMany();

	const formattedOrders = orders.map((order) => ({
		...order,
		totalAmount: Number(order.totalAmount),
		createdAt: new Date(order.createdAt).toLocaleDateString(),
		updatedAt: new Date(order.updatedAt).toLocaleDateString(),
	}));

	return <DataTable data={formattedOrders} columns={orderColumns} />;
}
