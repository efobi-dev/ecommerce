"use client";

import { signIn } from "@/actions/auth";
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

export function LoginForm({ name }: { name: string }) {
	const router = useRouter();
	const { toast } = useToast();
	const submit = async (form: FormData) => {
		const email = form.get("email") as string;
		const password = form.get("password") as string;
		try {
			const { error, redirectTo } = await signIn({ email, password });
			if (error) {
				toast({
					title: "Login failed",
					description: error,
					variant: "destructive",
				});
			}
			if (redirectTo) {
				router.push(redirectTo);
			}
		} catch (error) {
			console.error(error);
			if (error) {
				toast({
					title: "Login failed",
					description: "Internal server error",
					variant: "destructive",
				});
			}
		}
	};

	return (
		<Card className="w-full mx-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Log in</CardTitle>
				<CardDescription>
					Log in to your{" "}
					<span className="font-semibold text-primary text-xl">{name}</span>{" "}
					account to continue
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Form action={submit}>
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
					<Submit className="w-full">Sign in</Submit>
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
					<Link href="/signup">Sign up</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
