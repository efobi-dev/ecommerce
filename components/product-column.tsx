"use client";

import { updateAvailability } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircle, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export type Product = {
	id: string;
	name: string;
	basePrice: number;
	totalOrders: number;
	available: boolean;
};

export const productColumns: ColumnDef<Product>[] = [
	{ accessorKey: "name", header: "Product name" },
	{
		accessorKey: "basePrice",
		header: "Price",
		cell: ({ row }) => {
			const amount = Number(row.getValue("basePrice"));
			const formatted = new Intl.NumberFormat("en-NG", {
				style: "currency",
				currency: "NGN",
			}).format(amount);

			return <div className="font-medium">{formatted}</div>;
		},
	},
	{
		accessorKey: "totalOrders",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Orders
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "available",
		header: "In Stock",
		cell: ({ row }) => {
			return <div>{row.getValue("available") ? "Yes" : "No"}</div>;
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const product = row.original;
			const { toast } = useToast();
			const [pending, setPending] = useState(false);

			async function submit() {
				try {
					setPending(true);
					const { error, message } = await updateAvailability({
						id: product.id,
						state: !product.available,
					});
					if (error) {
						toast({
							title: "Something went wrong",
							description: error,
							variant: "destructive",
						});
						return;
					}
					toast({
						title: "Success",
						description: message,
					});
				} catch (error) {
					console.error(error);
					toast({
						title: "Something went wrong",
						description: "Internal server error",
						variant: "destructive",
					});
				} finally {
					setPending(false);
				}
			}

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							onClick={() =>
								navigator.clipboard.writeText(product.id).then(() =>
									toast({
										title: "Copied to clipboard",
									}),
								)
							}
						>
							Copy product ID
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => submit()}
							disabled={pending}
							className={buttonVariants({
								variant: product.available ? "default" : "ghost",
							})}
						>
							{pending ? (
								<LoaderCircle className="animate-spin mr-2 w-4 h-4" />
							) : null}
							{pending ? "Updating" : "Update to "}
							{product.available ? "unavailable" : "available"}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
