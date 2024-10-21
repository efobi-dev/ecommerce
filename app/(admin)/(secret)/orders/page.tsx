import { OrderTable } from "@/components/order-table";
import { Orders } from "@/components/orders";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Orders",
};

export default function Page() {
	return (
		<main className="flex-1 overflow-y-auto p-4">
			<h1 className="mb-4 text-2xl font-semibold">Orders</h1>
			<div className="grid gap-4">
				<Orders />
			</div>
			<h2 className="mt-8 mb-4 text-xl font-semibold">All Orders</h2>
			<OrderTable />
		</main>
	);
}
