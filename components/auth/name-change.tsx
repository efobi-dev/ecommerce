"use client";

import { changeName } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import Form from "next/form";
import { Input } from "../ui/input";
import { Submit } from "../submit";
import { Label } from "../ui/label";

export function NameChange({ name }: { name: string }) {
	const { toast } = useToast();
	const submit = async (form: FormData) => {
		const name = form.get("name") as string;
		try {
			const { error, message } = await changeName(name);
			if (error) {
				toast({
					title: "Name change failed",
					description: error,
					variant: "destructive",
				});
			}
			toast({
				title: "Success",
				description: message,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Name change failed",
				description: "Internal server error",
				variant: "destructive",
			});
		}
	};

	return (
		<Form action={submit} className="grid grid-cols-4 gap-4 items-center">
			<div className="col-span-3">
				<div className="grid gap-1">
					<Label htmlFor="name">Full name</Label>
					<Input
						placeholder="Enter your full name"
						className="w-full"
						name="name"
						id="name"
						value={name}
						autoComplete="name"
						required
					/>
				</div>
			</div>
			<Submit className="col-span-1">Update</Submit>
		</Form>
	);
}
