import prisma from "@/lib/db";
import { DollarSign } from "lucide-react";
import { Suspense } from "react";
import { CardSkeleton } from "./loaders/card";
import { Naira } from "./naira";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export async function TotalRevenue() {
	const currentDate = new Date();
	const currentMonth = currentDate.getMonth();
	const currentYear = currentDate.getFullYear();

	const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
	const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

	const currentRevenue = await prisma.order.aggregate({
		_sum: {
			totalAmount: true,
		},
		where: {
			createdAt: {
				gte: new Date(currentYear, currentMonth, 1),
				lt: new Date(currentYear, currentMonth + 1, 1),
			},
		},
	});

	const lastMonthRevenue = await prisma.order.aggregate({
		_sum: {
			totalAmount: true,
		},
		where: {
			createdAt: {
				gte: new Date(lastMonthYear, lastMonth, 1),
				lt: new Date(currentYear, currentMonth, 1),
			},
		},
	});

	const currentTotal = currentRevenue._sum?.totalAmount || 0;
	const lastMonthTotal = lastMonthRevenue._sum?.totalAmount || 0;

	const percentageChange =
		lastMonthTotal !== 0
			? ((Number(currentTotal) - Number(lastMonthTotal)) /
					Number(lastMonthTotal)) *
				100
			: 0;

	return (
		<Suspense
			fallback={<CardSkeleton title="Total Revenue" icon={<DollarSign />} />}
		>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
					<DollarSign />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">
						<Naira value={Number(currentTotal)} />
					</div>
					<p className="text-xs text-muted-foreground">
						{percentageChange >= 0 ? "+" : "-"}
						{Math.abs(percentageChange).toFixed(1)}% from last month
					</p>
				</CardContent>
			</Card>
		</Suspense>
	);
}
