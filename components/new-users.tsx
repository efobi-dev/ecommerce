import prisma from "@/lib/db";
import { CreditCard } from "lucide-react";
import { Suspense } from "react";
import { CardSkeleton } from "./loaders/card";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export async function NewUsers() {
	const currentDate = new Date();
	const lastMonthDate = new Date(
		currentDate.getFullYear(),
		currentDate.getMonth() - 1,
		1,
	);

	const currentMonthUsers = await prisma.customer.count({
		where: {
			createdAt: {
				gte: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
			},
		},
	});

	const lastMonthUsers = await prisma.customer.count({
		where: {
			createdAt: {
				gte: lastMonthDate,
				lt: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
			},
		},
	});

	const percentageChange =
		lastMonthUsers > 0
			? ((currentMonthUsers - lastMonthUsers) / lastMonthUsers) * 100
			: 100;

	return (
		<Suspense
			fallback={<CardSkeleton title="New Customers" icon={<CreditCard />} />}
		>
			<Card>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-sm font-medium">New Customers</CardTitle>
					<CreditCard />
				</CardHeader>
				<CardContent>
					<div className="text-2xl font-bold">{currentMonthUsers}</div>
					<p className="text-xs text-muted-foreground">
						{percentageChange >= 0 ? "+" : "-"}
						{Math.abs(percentageChange).toFixed(2)}% from last month
					</p>
				</CardContent>
			</Card>
		</Suspense>
	);
}
