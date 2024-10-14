"use client";

import { addCategory } from "@/actions/category";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";

const schema = z.object({
	name: z.string(),
});

export function CategoryForm() {
	const { toast } = useToast();
	const [pending, setPending] = useState(false);
	const [open, setOpen] = useState(false);
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: "",
		},
	});
	const submit = async (values: z.infer<typeof schema>) => {
		setPending(true);
		try {
			const { error, message } = await addCategory(values.name);
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
		} finally {
			setPending(false);
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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} className="grid gap-4">
						<FormField
							control={form.control}
							name="name"
							label="Name"
							render={({ field }) => <Input {...field} />}
						/>
						<Button type="submit">
							{pending ? (
								<LoaderCircle className="w-4 h-4 animate-spin" />
							) : (
								"Add"
							)}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
