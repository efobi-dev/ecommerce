"use client";

import { changeEmail } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { Label } from "../ui/label";
import { Submit } from "../submit";
import { Input } from "../ui/input";
import Form from "next/form";

export function EmailChange({ email }: { email: string }) {
	const { toast } = useToast();
	const submit = async (form: FormData) => {
		const email = form.get("email") as string;
		try {
			const { error, message } = await changeEmail(email);
			if (error) {
				toast({
					title: "Email change failed",
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
				title: "Email change failed",
				description: "Internal server error",
				variant: "destructive",
			});
		}
	};

	return (
		<Form action={submit} className="grid grid-cols-4 gap-4 items-center">
			<div className="col-span-3">
				<div className="grid gap-1">
					<Label htmlFor="email">Email address</Label>
					<Input
						placeholder="Enter your new email address"
						className="w-full"
						name="email"
						id="email"
						value={email}
						autoComplete="email"
						type="email"
						required
					/>
				</div>
			</div>
			<Submit className="col-span-1">Update</Submit>
		</Form>
	);
}
