import prisma from "@/lib/db";
import { Users } from "lucide-react";
import { Suspense } from "react";
import { CardSkeleton } from "./loaders/card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export async function TotalOrders() {
	const currentDate = new Date();
	const lastMonthDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() - 1,
		1,
	);
	const twoMonthsAgoDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() - 2,
		1,
	);

	const [totalOrders, lastMonthOrders, twoMonthsAgoOrders] = await Promise.all([
		prisma.order.count(),
		prisma.order.count({
			where: {
				createdAt: {
					gte: lastMonthDate,
					lt: currentDate,
				},
			},
		}),
		prisma.order.count({
			where: {
				createdAt: {
					gte: twoMonthsAgoDate,
					lt: lastMonthDate,
				},
			},
		}),
	]);

	const percentageIncrease =
		twoMonthsAgoOrders > 0
			? ((lastMonthOrders - twoMonthsAgoOrders) / twoMonthsAgoOrders) * 100
			: 0;

	return (
		<Suspense fallback={<CardSkeleton title="Total Order" icon={<Users />} />}>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Orders</CardTitle>
					<Users />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{totalOrders}</div>
					<p className="text-xs text-muted-foreground">
						{percentageIncrease > 0 ? "+" : ""}
						{percentageIncrease.toFixed(1)}% from last month
					</p>
				</CardContent>
			</Card>
		</Suspense>
	);
}
