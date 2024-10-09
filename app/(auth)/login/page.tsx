"use client";

import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Form, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { type SignIn, signInSchema } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";

export default function Page() {
	const { toast } = useToast();
	const [pending, startTransition] = useTransition();
	const form = useForm<SignIn>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function submit(values: SignIn) {
		startTransition(async () => {
			try {
				const { error } = await signIn(values);
				toast({
					title: "Login failed",
					description: error,
					variant: "destructive",
				});
			} catch (error) {
				console.error(error);
				toast({
					title: "Something went wrong",
					description: "Internal server error",
					variant: "destructive",
				});
			}
		});
	}

	return (
		<Card className="w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Login</CardTitle>
				<CardDescription>
					Enter your email below to login to your account.
				</CardDescription>
			</CardHeader>
			<CardContent className="grid gap-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} className="grid gap-2">
						<FormField
							name="email"
							label="Email"
							control={form.control}
							render={({ field }) => (
								<Input
									type="email"
									autoComplete="work email"
									{...field}
									placeholder="example@unn.edu.ng"
								/>
							)}
						/>
						<FormField
							name="password"
							label="Password"
							control={form.control}
							render={({ field }) => (
								<Input
									type="password"
									autoComplete="current-password"
									{...field}
								/>
							)}
						/>

						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? (
								<LoaderCircle className="w-4 h-4 animate-spin" />
							) : (
								"Sign in"
							)}
						</Button>
					</form>
				</Form>
			</CardContent>
			<CardFooter className="flex items-center justify-end">
				<Button variant={"link"}>
					<Link href="/signup">Sign up</Link>
				</Button>
			</CardFooter>
		</Card>
	);
}
