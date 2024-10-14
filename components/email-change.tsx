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
import { changeEmail } from "@/actions/auth";

export function EmailChange({ email }: { email: string }) {
	const { toast } = useToast();
	const [pending, setPending] = useState(false);
	const schema = z.object({
		email: z.string().email("Email must be a valid email address"),
	});
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			email: email,
		},
	});

	const submit = async (value: z.infer<typeof schema>) => {
		setPending(true);
		try {
			const { error, message } = await changeEmail(value.email);
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
						label="Email address"
						control={form.control}
						name="email"
						render={({ field }) => (
							<Input
								type="email"
								autoComplete="email"
								{...field}
								className="w-full"
							/>
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
