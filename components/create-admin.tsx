"use client";

import { createAdmin } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { type SignUp, signUpSchema } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PlusCircle } from "lucide-react";
import { useTransition, useState } from "react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";

export function AddUser() {
	const [open, SetOpen] = useState(false);
	const [pending, startTransition] = useTransition();
	const { toast } = useToast();
	const form = useForm<SignUp>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			fullName: "",
			password: "",
			role: "User",
		},
	});

	function submit(values: SignUp) {
		startTransition(async () => {
			try {
				const { error, message } = await createAdmin(values);
				if (error) {
					toast({
						title: "Failed to create user",
						description: error,
						variant: "destructive",
					});
				}
				SetOpen(false);
				toast({
					title: "Success",
					description: message,
				});
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
		<Dialog open={open} onOpenChange={SetOpen}>
			<DialogTrigger asChild>
				<Button size={"icon"}>
					<PlusCircle className="w-4 h-4" />
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add new admin</DialogTitle>
					<DialogDescription>
						Enter the details for the new user.
					</DialogDescription>
				</DialogHeader>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(submit)}
						className="grid gap-4 py-4"
					>
						<FormField
							control={form.control}
							name="fullName"
							label="Full Name"
							className="grid grid-cols-4 items-center gap-4"
							render={({ field }) => (
								<Input className="col-span-3" {...field} autoComplete="name" />
							)}
						/>
						<FormField
							control={form.control}
							name="email"
							label="Email"
							className="grid grid-cols-4 items-center gap-4"
							render={({ field }) => (
								<Input
									className="col-span-3"
									{...field}
									autoComplete="email"
									type="email"
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="password"
							label="Password"
							className="grid grid-cols-4 items-center gap-4"
							render={({ field }) => (
								<Input
									className="col-span-3"
									{...field}
									placeholder="********"
									autoComplete="new-password"
								/>
							)}
						/>
						<FormField
							control={form.control}
							name="role"
							label="Designated role"
							className="grid grid-cols-4 items-center gap-4"
							render={({ field }) => (
								<Select defaultValue={field.value}>
									<SelectTrigger>
										<SelectValue placeholder="Select a role" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="User">User</SelectItem>
										<SelectItem value="Admin">Admin</SelectItem>
										<SelectItem value="Superadmin">Super admin</SelectItem>
									</SelectContent>
								</Select>
							)}
						/>
						<Button type="submit" disabled={pending}>
							{pending ? (
								<LoaderCircle className="animate-spin h-4 w-4" />
							) : (
								"Add User"
							)}
						</Button>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
