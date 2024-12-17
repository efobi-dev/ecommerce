"use client";

import { updateAvailability, deleteProduct } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircle, MoreHorizontal, Trash2 } from "lucide-react";
import { useState } from "react";
import { Naira } from "./naira";
import { Button, buttonVariants } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";

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
			return (
				<div className="font-medium">
					<Naira value={Number(row.getValue("basePrice"))} />
				</div>
			);
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
			const router = useRouter()

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
						<DropdownMenuItem disabled={pending} className="bg-destructive text-destructive-foreground"  onClick={async () => {
	setPending(true)
	try {
		const {error, message, success} = await deleteProduct(product.id)
		if (error) {
			toast({
				title: 'Something went wrong',
				description: error,
				variant: 'destructive'
			})
			return
		}
		if (success) {
			toast({
				title: 'Success',
				description: message
			})
			router.refresh()
		}
	} catch (error) {
		console.error(error)
		toast({
			title: 'Something went wrong',
			description: error instanceof Error ? error.message : 'Internal server error',
			variant: 'destructive'
		})
	} finally {
		setPending(false)
	}
}}>{
	pending ? (
		<LoaderCircle className="animates-spin w-4 h-4" />
	) : (
		<span className="flex items-center">
<Trash2 /> Delete
		</span>
	)
}
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
