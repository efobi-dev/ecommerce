"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	Legend,
	ResponsiveContainer,
	Tooltip,
	XAxis,
} from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
	totalOrders: {
		label: "Total Orders",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig;

export function ProductsChart({
	chartData,
}: {
	chartData: {
		name: string;
		totalOrders: number;
		productName: string;
		orderData: { year: number; totalOrders: number }[];
	}[];
}) {
	const formattedData = chartData.flatMap(({ productName, orderData }) =>
		orderData.map(({ year, totalOrders }) => ({
			year,
			[productName]: totalOrders,
		})),
	);

	const mergedData = formattedData.reduce(
		(acc: { year: number; [key: string]: number }[], curr) => {
			const existingEntry = acc.find((item) => item.year === curr.year);
			if (existingEntry) {
				Object.assign(existingEntry, curr);
			} else {
				acc.push(curr);
			}
			return acc;
		},
		[],
	);

	const sortedData = mergedData.sort((a, b) => a.year - b.year);

	const productNames = chartData.map((item) => item.productName);

	return (
		<ChartContainer config={chartConfig}>
			<ResponsiveContainer width="100%" height={400}>
				<BarChart
					data={sortedData}
					margin={{
						top: 20,
						right: 30,
						left: 20,
						bottom: 5,
					}}
				>
					<CartesianGrid vertical={false} />
					<XAxis
						dataKey="year"
						tickLine={false}
						tickMargin={10}
						axisLine={false}
					/>
					<Tooltip
						cursor={false}
						content={({ payload, label }) => (
							<div className="bg-background p-2 shadow-md rounded-md">
								<p className="font-bold">{label}</p>
								{payload?.map((entry) => (
									<p key={entry.name}>
										{entry.name}: {entry.value}
									</p>
								))}
							</div>
						)}
					/>
					<Legend />
					{productNames.slice(0, 5).map((productName, index) => (
						<Bar
							key={productName}
							dataKey={productName}
							fill={`hsl(var(--chart-${index + 1}))`}
							radius={8}
						>
							<LabelList
								position="top"
								offset={12}
								className="fill-foreground"
								fontSize={12}
							/>
						</Bar>
					))}
				</BarChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
