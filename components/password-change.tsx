"use client";

import { useToast } from "@/hooks/use-toast";
import { changePassword } from "@/lib/auth.client";
import Form from "next/form";
import { Submit } from "./submit";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
export function PasswordChange() {
	const { toast } = useToast();

	const submit = async (form: FormData) => {
		const currentPassword = form.get("current-password") as string;
		const newPassword = form.get("new-password") as string;
		try {
			await changePassword(
				{ newPassword, currentPassword },
				{
					onSuccess: () => {
						toast({
							title: "Success",
							description: "Password changed successfully",
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
				title: "Error",
				description:
					error instanceof Error ? error.message : "Internal server error",
				variant: "destructive",
			});
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle>Change your password</CardTitle>
			</CardHeader>
			<CardContent>
				<Form action={submit} className="grid gap-4 items-center max-w-sm">
					<div className="grid gap-2">
						<Label htmlFor="current-password">Current password</Label>
						<Input
							id="current-password"
							name="current-password"
							className="w-full"
							placeholder="**********"
							required
							type="password"
							autoComplete="current-password"
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="new-password">New password</Label>
						<Input
							id="new-password"
							name="new-password"
							className="w-full"
							placeholder="**********"
							required
							type="password"
							autoComplete="new-password"
						/>
					</div>
					<Submit>Change password</Submit>
				</Form>
			</CardContent>
		</Card>
	);
}
