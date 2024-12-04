"use client";

import { useToast } from "@/hooks/use-toast";
import { signUp } from "@/lib/auth.client";
import Form from "next/form";
import Link from "next/link";
import { Submit } from "../submit";
import { Button } from "../ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { GoogleSignIn } from "./google";

export function SignupForm({ name }: { name: string }) {
	const { toast } = useToast();
	const submit = async (form: FormData) => {
		const name = form.get("name") as string;
		const email = form.get("email") as string;
		const password = form.get("password") as string;

		try {
			await signUp.email(
				{ name, email, password, callbackURL: "/dashboard" },
				{
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
		<Card className="mx-auto max-w-sm w-full">
			<CardHeader>
				<CardTitle className="text-2xl">Sign up</CardTitle>
				<CardDescription>
					Create your{" "}
					<span className="font-semibold text-primary text-xl">{name}</span>{" "}
					account
				</CardDescription>
			</CardHeader>
			<CardContent>
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
							placeholder={`support@${name.toLowerCase()}`}
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
				<GoogleSignIn />
			</CardContent>
			<CardFooter className="flex items-center justify-end">
				<Button variant={"link"}>
					<Link href="/login">Log in</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
