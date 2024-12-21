"use client";

import { deleteBannerImage, updateBannerImage } from "@/actions/store";
import { useToast } from "@/hooks/use-toast";
import type { BannerImage } from "@/lib/constants";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, LoaderCircle, MoreHorizontal } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, buttonVariants } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export const bannerColumns: ColumnDef<BannerImage>[] = [
	{
		accessorKey: "id",
		header: ({ column }) => {
			return (
				<Button
					variant="ghost"
					onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
				>
					Image ID
					<ArrowUpDown className="ml-2 h-4 w-4" />
				</Button>
			);
		},
	},
	{
		accessorKey: "url",
		header: "Image",
		cell: ({ row }) => (
			<div className="relative h-14 w-24">
				<Image
					src={row.getValue("url")}
					alt={row.id}
					className="rounded-md object-cover"
					fill
					sizes="(max-width: 96px) 100vw, 96px"
					quality={80}
				/>
			</div>
		),
	},
	{ accessorKey: "altText", header: "Description" },
	{
		accessorKey: "active",
		header: "Status",
		cell: ({ row }) => {
			return (
				<div>
					{row.getValue("active") ? (
						<span>On display</span>
					) : (
						<span className="text-muted-foreground">Not displayed</span>
					)}
				</div>
			);
		},
	},
	{
		id: "actions",
		cell: ({ row }) => {
			const image = row.original;
			const { toast } = useToast();
			const router = useRouter();
			const [pending, setPending] = useState(false);

			return (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button size={"icon"} variant={"ghost"} className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="w-4 h-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Actions</DropdownMenuLabel>
						<DropdownMenuItem
							disabled={pending}
							onClick={async () => {
								setPending(true);
								try {
									const { error, message } = await updateBannerImage(image.id);
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
									router.refresh();
								} catch (error) {
								} finally {
									setPending(false);
								}
							}}
						>
							{pending ? (
								<LoaderCircle className="animate-spin w-4h-4" />
							) : (
								<span>{image.active ? "Hide" : "Show"} banner</span>
							)}
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={pending}
							className={buttonVariants({ variant: "destructive" })}
							onClick={async () => {
								setPending(true);
								try {
									const { error, message } = await deleteBannerImage(image.id);
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
									router.refresh();
								} catch (error) {
									console.error(error);
									toast({
										title: "Something went wrong",
										description:
											error instanceof Error
												? error.message
												: "internal server error",
										variant: "destructive",
									});
								} finally {
									setPending(false);
								}
							}}
						>
							{pending ? (
								<LoaderCircle className="animate-spin w-4 h-4" />
							) : (
								<span>Delete banner</span>
							)}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
	},
];
