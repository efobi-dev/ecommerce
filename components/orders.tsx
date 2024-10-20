import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/db";
import { TrendingDown, TrendingUp } from "lucide-react";
import { OrderChart } from "./orders-chart";
import { ChartSkeleton } from "./loaders/chart";

export async function Orders() {
	const orders = await prisma.order.findMany();
	if (!orders.length) return <ChartSkeleton />;
	const chartData = orders.reduce<Record<string, number>>((acc, order) => {
		const month = new Date(order.createdAt).toLocaleString("default", {
			month: "long",
		});
		if (!acc[month]) {
			acc[month] = 0;
		}
		acc[month] += Number(order.totalAmount);
		return acc;
	}, {});

	const formattedChartData = Object.entries(chartData).map(
		([month, sales], index, array) => {
			const prevSales = index > 0 ? array[index - 1][1] : sales;
			const percentageChange = ((sales - prevSales) / prevSales) * 100;
			return {
				month,
				sales,
				percentageChange: Number.isFinite(percentageChange)
					? percentageChange
					: 0,
			};
		},
	);

	const latestPercentageChange =
		formattedChartData[formattedChartData.length - 1].percentageChange;

	return orders ? (
		<Card>
			<CardHeader>
				<CardTitle>Monthly Sales Overview</CardTitle>
				<CardDescription>Sales data for the last 6 months</CardDescription>
			</CardHeader>
			<CardContent>
				<OrderChart chartData={formattedChartData} />
			</CardContent>
			<CardFooter className="flex-col items-start gap-2 text-sm">
				<div className="flex gap-2 font-medium leading-none">
					{latestPercentageChange >= 0 ? (
						<>
							Trending up by {latestPercentageChange.toFixed(1)}% this month{" "}
							<TrendingUp className="h-4 w-4" />
						</>
					) : (
						<>
							Trending down by {Math.abs(latestPercentageChange).toFixed(1)}%
							this month <TrendingDown className="h-4 w-4" />
						</>
					)}
				</div>
				<div className="leading-none text-muted-foreground">
					Showing total visitors for the last 6 months
				</div>
			</CardFooter>
		</Card>
	) : (
		<ChartSkeleton />
	);
}
