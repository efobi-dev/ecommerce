"use client";

import { useState } from "react";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LoaderCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { changePassword } from "@/actions/auth";

export function PasswordChange({ email }: { email: string }) {
	const { toast } = useToast();
	const [pending, setPending] = useState(false);
	const schema = z.object({
		email: z.string().email(),
		password: z
			.string({ required_error: "Password is required" })
			.min(1, "Password is required")
			.min(8, "Password must be more than 8 characters")
			.max(32, "Password must be less than 32 characters"),
	});
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: email,
			password: "",
		},
	});

	const submit = async (values: z.infer<typeof schema>) => {
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
