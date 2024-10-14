"use client";

import { deleteCategory } from "@/actions/category";
import { useToast } from "@/hooks/use-toast";
import type { Category } from "@/lib/constants";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function CategoryMenu({ values }: { values: Category[] }) {
	const { toast } = useToast();
	const [pending, setPending] = useState(false);

	const submit = async (id: string) => {
		setPending(true);
		try {
			const { error, message } = await deleteCategory(id);
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
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant={"ghost"}>View categories</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{values.map((category) => (
					<DropdownMenuSub key={category.id}>
						<DropdownMenuSubTrigger>{category.name}</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuItem
									onClick={async () => submit(category.id)}
									disabled={pending}
								>
									{pending ? (
										<LoaderCircle className="w-4 h-4 animate-spin" />
									) : (
										"Delete"
									)}
								</DropdownMenuItem>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
