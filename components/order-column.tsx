"use client";

import type { ColumnDef } from "@tanstack/react-table";

export type Order = {
	id: string;
	customerId: number;
	totalAmount: number;
	createdAt: string;
	updatedAt: string;
};

export const orderColumns: ColumnDef<Order>[] = [
	{
		accessorKey: "customerId",
		header: "Customer ID",
	},
	{
		accessorKey: "totalAmount",
		header: "Amount",
		cell: ({ row }) => {
			const amount = Number(row.getValue("totalAmount"));
			const formatted = new Intl.NumberFormat("en-NG", {
				style: "currency",
				currency: "NGN",
			}).format(amount);

			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "createdAt",
		header: "Date",
	},
];
