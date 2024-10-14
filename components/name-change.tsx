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
import { changeName } from "@/actions/auth";

export function NameChange({ name }: { name: string }) {
	const { toast } = useToast();
	const [pending, setPending] = useState(false);
	const schema = z.object({
		name: z.string().min(8, "Name must be at least 8 characters long"),
	});
	const form = useForm<z.infer<typeof schema>>({
		resolver: zodResolver(schema),
		defaultValues: {
			name: name,
		},
	});

	const submit = async (value: z.infer<typeof schema>) => {
		setPending(true);
		try {
			const { error, message } = await changeName(value.name);
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
						label="Full name"
						control={form.control}
						name="name"
						render={({ field }) => (
							<Input
								{...field}
								placeholder="Enter your full name"
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
