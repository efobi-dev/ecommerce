"use client";

import {
	Bar,
	BarChart,
	CartesianGrid,
	LabelList,
	XAxis,
	Tooltip,
} from "recharts";

import { type ChartConfig, ChartContainer } from "@/components/ui/chart";

const chartConfig = {
	sales: {
		label: "Sales",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export function OrderChart({
	chartData,
}: {
	chartData: {
		month: string;
		sales: number;
		percentageChange: number;
	}[];
}) {
	return (
		<ChartContainer config={chartConfig}>
			<BarChart
				accessibilityLayer
				data={chartData}
				margin={{
					top: 20,
				}}
			>
				<CartesianGrid vertical={false} />
				<XAxis
					dataKey="month"
					tickLine={false}
					tickMargin={10}
					axisLine={false}
					tickFormatter={(value) => value.slice(0, 3)}
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
				<Bar dataKey="sales" fill="var(--color-sales)" radius={8}>
					<LabelList
						position="top"
						offset={12}
						className="fill-foreground"
						fontSize={12}
					/>
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
