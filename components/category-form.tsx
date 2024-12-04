"use client";

import { addCategory } from "@/actions/category";
import { useToast } from "@/hooks/use-toast";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import Form from "next/form";
import { Input } from "./ui/input";
import { Submit } from "./submit";
import { Label } from "./ui/label";

export function CategoryForm() {
	const { toast } = useToast();
	const [open, setOpen] = useState(false);
	const submit = async (form: FormData) => {
		const name = form.get("name") as string;
		try {
			const { error, message } = await addCategory(name);
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
			setOpen(false);
		} catch (error) {
			console.error(error);
			toast({
				title: "Something went wrong",
				description: "Internal server error",
				variant: "destructive",
			});
		}
	};
	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size={"icon"} variant={"outline"}>
					<PlusCircle className="h-4 w-4 text-foreground" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add category</DialogTitle>
					<DialogDescription>
						Enter the name of the new category below:
					</DialogDescription>
				</DialogHeader>
				<Form action={submit} className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor="name">Name</Label>
						<Input id="name" name="name" className="w-full" required />
					</div>
					<Submit>Add</Submit>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
