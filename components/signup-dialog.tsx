"use client";

import { signUp } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { type SignUp, signUpSchema } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
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

export function SignUpDialog() {
	const { toast } = useToast();
	const [pending, startTransition] = useTransition();
	const form = useForm<SignUp>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
		},
	});

	function submit(values: SignUp) {
		startTransition(async () => {
			try {
				const { error } = await signUp(values);
				if (error) {
					toast({
						title: "Sign up failed",
						description: error,
						variant: "destructive",
					});
				}
			} catch (err) {
				console.error(err);
				toast({
					title: "Something went wrong",
					description: "Internal server error",
					variant: "destructive",
				});
			}
		});
	}

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
				<Form {...form}>
					<form onSubmit={form.handleSubmit(submit)} className="grid gap-2">
						<FormField
							name="fullName"
							control={form.control}
							label="Full name"
							render={({ field }) => (
								<Input
									placeholder="Bola Ahmed"
									autoComplete="name"
									{...field}
								/>
							)}
						/>
						<FormField
							name="email"
							control={form.control}
							label="Email"
							render={({ field }) => (
								<Input
									type="email"
									autoComplete="work email"
									placeholder="example@unn.edu.ng"
									{...field}
								/>
							)}
						/>
						<FormField
							name="password"
							control={form.control}
							label="Password"
							render={({ field }) => (
								<Input type="password" autoComplete="new-password" {...field} />
							)}
						/>
						<Button type="submit" className="w-full" disabled={pending}>
							{pending ? (
								<LoaderCircle className="w-4 h-4 animate-spin" />
							) : (
								"Sign up"
							)}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
