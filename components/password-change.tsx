"use client";

import { changePassword } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { type SignIn, signInSchema } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";

export function PasswordChange({ email }: { email: string }) {
	const { toast } = useToast();
	const [pending, setPending] = useState(false);
	const form = useForm<SignIn>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: email,
			password: "",
		},
	});

	const submit = async (values: SignIn) => {
		setPending(true);
		try {
			const { email, password } = values;
			const { error, message } = await changePassword(email, password);
			if (error) {
				toast({
					title: "Error",
					description: error,
					variant: "destructive",
				});
				return;
			}
			toast({
				title: "Success",
				description: message,
				variant: "default",
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Error",
				description: "Internal server error",
				variant: "destructive",
			});
		} finally {
			setPending(false);
		}
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(submit)}
				className="grid grid-cols-4 gap-4 items-center"
			>
				<div className="col-span-3">
					<FormField
						label="Password"
						control={form.control}
						name="password"
						render={({ field }) => (
							<Input {...field} className="w-full" placeholder="*******" />
						)}
					/>
				</div>
				<div className="col-span-1">
					<Button type="submit" disabled={pending}>
						{pending ? (
							<LoaderCircle className="animate-spin w-4 h-4 mr-2" />
						) : null}
						{pending ? "Updating..." : "Update"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
