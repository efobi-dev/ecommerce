"use client";

import { useToast } from "@/hooks/use-toast";
import { changeEmail } from "@/lib/auth.client";
import Form from "next/form";
import { Submit } from "../submit";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function EmailChange({ email }: { email: string }) {
	const { toast } = useToast();
	const submit = async (form: FormData) => {
		const newEmail = form.get("email") as string;
		try {
			await changeEmail(
				{ newEmail },
				{
					onSuccess: () => {
						toast({
							title: "Success",
						});
					},
					onError: (ctx) => {
						toast({
							title: "Something went wrong",
							description: ctx.error.message,
							variant: "destructive",
						});
					},
				},
			);
		} catch (error) {
			console.error(error);
			toast({
				title: "Something went wrong",
				description:
					error instanceof Error ? error.message : "Internal server error",
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
