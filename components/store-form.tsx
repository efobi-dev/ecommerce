"use client";

import { getStore, updateStore } from "@/actions/store";
import { useToast } from "@/hooks/use-toast";
import type { Store } from "@/lib/constants";
import { storeSchema } from "@/prisma/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";
import { Switch } from "./ui/switch";
import { TabsContent } from "./ui/tabs";

export function StoreForm() {
	const { toast } = useToast();
	const [pending, setPending] = useState(false);
	const [store, setStore] = useState<Store | null>(null);
	const form = useForm<Store>({
		resolver: zodResolver(storeSchema),
		defaultValues: {
			id: store?.id,
			name: store?.name,
			url: store?.url,
			maintenance: store?.maintenance,
		},
	});

	useEffect(() => {
		loadStore();
	}, []);

	useEffect(() => {
		if (store) {
			form.reset({
				id: store.id,
				name: store.name,
				url: store.url,
				maintenance: store.maintenance,
			});
		}
	}, [store, form]);

	const loadStore = async () => {
		const storeData = await getStore();
		if (!storeData) {
			toast({
				title: "Failed to load store",
				description: "Please reload the page and try again.",
				variant: "destructive",
			});
		}
		setStore(storeData);
	};

	const submit = async (values: Store) => {
		setPending(true);
		try {
			const { error, message } = await updateStore(values);
			if (error) {
				toast({
					title: "Something went wrong",
					description: error,
					variant: "destructive",
				});
				return;
			}
			toast({
				title: "Success",
				description: message,
			});
		} catch (error) {
			console.error(error);
			toast({
				title: "Something went wrong",
				description: "Internal server error",
				variant: "destructive",
			});
		} finally {
			setPending(false);
		}
	};

	return (
		<TabsContent value="store">
			<Card>
				<CardHeader>
					<CardTitle>Store configuration</CardTitle>
					<CardDescription>
						Manage your store's general settings.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{store ? (
						<Form {...form}>
							<form onSubmit={form.handleSubmit(submit)} className="grid gap-2">
								<FormField
									label="Store name"
									control={form.control}
									name="name"
									render={({ field }) => <Input {...field} />}
								/>
								<FormField
									label="Store URL"
									control={form.control}
									name="url"
									render={({ field }) => <Input type="url" {...field} />}
								/>
								<FormField
									label="Maintenance mode"
									control={form.control}
									className="space-x-4 items-center"
									name="maintenance"
									render={({ field }) => (
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									)}
								/>
								<Button type="submit" disabled={pending}>
									{pending ? (
										<LoaderCircle className="animate-spin w-4 h-4" />
									) : (
										"Save changes"
									)}
								</Button>
							</form>
						</Form>
					) : (
						<LoaderCircle size={60} className="text-primary animate-spin" />
					)}
				</CardContent>
			</Card>
		</TabsContent>
	);
}
