"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Naira } from "./naira";

export type Order = {
	id: string;
	customerId: string;
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
			return (
				<div className="font-medium">
					<Naira value={Number(row.getValue("totalAmount"))} />
				</div>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: "Date",
	},
];
