"use client";

import { signUp } from "@/actions/auth";
import Google from "@/assets/icons/google";
import { useToast } from "@/hooks/use-toast";
import Form from "next/form";
import Link from "next/link";
import { useRouter } from "next/navigation";
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

export function SignupForm({ name }: { name: string }) {
	const router = useRouter();
	const { toast } = useToast();
	const submit = async (form: FormData) => {
		const fullName = form.get("name") as string;
		const email = form.get("email") as string;
		const password = form.get("password") as string;

		try {
			const { error, redirectTo } = await signUp({
				fullName,
				email,
				password,
				role: "User",
			});
			if (error) {
				toast({
					title: "Sign up failed",
					description: error,
					variant: "destructive",
				});
			}
			if (redirectTo) {
				router.push(redirectTo);
			}
		} catch (error) {
			console.error(error);
			toast({
				title: "Sign up failed",
				description: "Internal server error",
				variant: "destructive",
			});
		}
	};

	return (
		<Card className="mx-auto max-w-sm">
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
				<Button variant={"outline"} className="w-full mt-2">
					<Link href={"/login/google"} className="flex items-center">
						<Google className="w-4 h-4 mr-2" />
						Login with Google
					</Link>
				</Button>
			</CardContent>
			<CardFooter className="flex items-center justify-end">
				<Button variant={"link"}>
					<Link href="/login">Log in</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
