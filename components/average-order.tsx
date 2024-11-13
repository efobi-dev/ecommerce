import prisma from "@/lib/db";
import { DollarSign } from "lucide-react";
import { CardSkeleton } from "./loaders/card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Suspense } from "react";
import { Naira } from "./naira";

export async function AverageOrder() {
	const currentMonth = new Date().getMonth();
	const currentYear = new Date().getFullYear();

	const currentMonthAverage = await prisma.order.aggregate({
		_avg: {
			totalAmount: true,
		},
		where: {
			createdAt: {
				gte: new Date(currentYear, currentMonth, 1),
				lt: new Date(currentYear, currentMonth + 1, 1),
			},
		},
	});

	const previousMonthAverage = await prisma.order.aggregate({
		_avg: {
			totalAmount: true,
		},
		where: {
			createdAt: {
				gte: new Date(currentYear, currentMonth - 1, 1),
				lt: new Date(currentYear, currentMonth, 1),
			},
		},
	});

	const currentAverageValue = currentMonthAverage._avg.totalAmount || 0;
	const previousAverageValue = previousMonthAverage._avg.totalAmount || 0;

	const percentageChange =
		previousAverageValue !== 0
			? ((Number(currentAverageValue) - Number(previousAverageValue)) /
					Number(previousAverageValue)) *
				100
			: 0;

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">
					Average Order Value
				</CardTitle>
				<DollarSign />
			</CardHeader>
			<CardContent>
				<Suspense
					fallback={
						<CardSkeleton title="Average Order Value" icon={<DollarSign />} />
					}
				>
					<div className="text-2xl font-bold">
						<Naira value={Number(currentAverageValue)} />
					</div>
					<p className="text-xs text-muted-foreground">
						{percentageChange >= 0 ? "+" : "-"}
						{Math.abs(percentageChange).toFixed(2)}% from last month
					</p>
				</Suspense>
			</CardContent>
		</Card>
	);
}
