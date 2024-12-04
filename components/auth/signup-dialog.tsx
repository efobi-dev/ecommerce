"use client";

import { signUp } from "@/lib/auth.client";
import { useToast } from "@/hooks/use-toast";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { Submit } from "../submit";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export function SignUpDialog() {
	const { toast } = useToast();
	const router = useRouter();
	const submit = async (form: FormData) => {
		const name = form.get("name") as string;
		const email = form.get("email") as string;
		const password = form.get("password") as string;
		try {
			await signUp.email(
				{
					name,
					email,
					password,
				},
				{
					onSuccess: () => {
						router.refresh();
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
				title: "Sign up failed",
				description:
					error instanceof Error ? error.message : "Internal server error",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"link"}>Create an account instead</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Sign up</DialogTitle>
					<DialogDescription>
						Create an account to access other special benefits
					</DialogDescription>
				</DialogHeader>
				<Form action={submit}>
					<div className="grid gp-2">
						<Label htmlFor="name">Full name</Label>
						<Input
							placeholder="Bola Ahmed"
							id="name"
							name="name"
							autoComplete="name"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input
							id="email"
							type="email"
							name="email"
							autoComplete="work email"
							required
						/>
					</div>
					<div className="grid gap-2">
						<Label htmlFor="password">Password</Label>
						<Input
							id="password"
							type="password"
							name="password"
							autoComplete="current-password"
							placeholder="************"
							min={8}
							max={32}
							required
						/>
					</div>
					<Submit className="w-full">Sign up</Submit>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
