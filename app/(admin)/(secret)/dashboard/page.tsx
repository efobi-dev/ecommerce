import { TotalOrders } from "@/components/total-order";
import { NewUsers } from "@/components/new-users";
import { TotalRevenue } from "@/components/total-revenue";
import { AverageOrder } from "@/components/average-order";
import { RecentOrders } from "@/components/recent-orders";

export default function Dashboard() {
	return (
		<main className="flex-1 overflow-y-auto p-4">
			<h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<TotalRevenue />
				<TotalOrders />
				<NewUsers />
				<AverageOrder />
			</div>
			<h2 className="mt-8 mb-4 text-xl font-semibold">Recent Orders</h2>
			<RecentOrders />
		</main>
	);
}