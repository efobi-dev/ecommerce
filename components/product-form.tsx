"use client";

import { getCategories } from "@/actions/category";
import { addProduct } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";
import type { Category, Product } from "@/lib/constants";
import { productSchema } from "@/prisma/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { nanoid } from "nanoid";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { ProductUpload } from "./product-upload";
import { Button, buttonVariants } from "./ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
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
import { Textarea } from "./ui/textarea";

export function ProductForm() {
	const { toast } = useToast();
	const [pending, startTransition] = useTransition();
	const [step, setStep] = useState(0);
	const [productId, setProductId] = useState<string | undefined>(undefined);
	const [categories, setCategories] = useState<Category[] | undefined>(
		undefined,
	);

	const form = useForm<Product>({
		resolver: zodResolver(productSchema),
		defaultValues: {
			id: "",
			name: "",
			description: "",
			sku: `pro-${nanoid(5)}`,
			basePrice: 0,
			categoryId: "",
			createdAt: new Date(),
			updatedAt: new Date(),
			available: true,
		},
	});

	const loadCategories = async () => {
		try {
			const { categories, error } = await getCategories();
			if (error) {
				toast({
					title: "Error loading categories",
					description: error,
					variant: "destructive",
				});
				return;
			}
			setCategories(categories);
			const newProductId = nanoid(10);
			setProductId(newProductId);
			form.setValue("id", newProductId);
			console.log(newProductId);
		} catch (error) {
			console.error(error);
			toast({
				title: "Error loading categories",
				description: "An unexpected error occurred",
				variant: "destructive",
			});
		}
	};

	function submit(values: Product) {
		startTransition(async () => {
			try {
				const { error } = await addProduct(values);
				if (error) {
					toast({
						title: "Error adding product",
						description: error,
						variant: "destructive",
					});
					return;
				}
				setStep((prev) => prev + 1);
				toast({
					title: "Product added successfully",
					description: "You can now upload images for this product",
				});
			} catch (error) {
				console.error(error);
				toast({
					title: "Error adding product",
					description: "An unexpected error occurred",
					variant: "destructive",
				});
			}
		});
	}

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button onClick={loadCategories} className="flex items-center">
					<Plus className="mr-2 h-4 w-4" /> Add New Stock
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						Add New Stock
					</DialogTitle>
					<DialogDescription className="text-gray-500">
						Enter the details of the new stock item here. Click save when you're
						done.
					</DialogDescription>
				</DialogHeader>
				{categories ? (
					step === 0 ? (
						<Form {...form}>
							<form
								onSubmit={form.handleSubmit(submit, (errors) =>
									console.error(errors),
								)}
								className="space-y-4"
							>
								<FormField
									name="name"
									control={form.control}
									label="Product name"
									render={({ field }) => (
										<Input
											placeholder="Electric bulb"
											{...field}
											className="w-full"
										/>
									)}
								/>
								<FormField
									name="description"
									control={form.control}
									label="Product description"
									render={({ field }) => (
										<Textarea
											placeholder="A bulb is an electric bulb that turns on when you switch it on"
											{...field}
											value={field.value ?? ""}
											className="w-full min-h-[100px]"
										/>
									)}
								/>
								<FormField
									name="basePrice"
									control={form.control}
									label="Product price in naira"
									render={({ field }) => (
										<Input
											type="number"
											{...field}
											value={field.value === 0 ? "" : field.value}
											onChange={(e) =>
												field.onChange(e.target.valueAsNumber || 0)
											}
											className="w-full"
										/>
									)}
								/>
								<FormField
									name="categoryId"
									control={form.control}
									label="Product category"
									render={({ field }) => (
										<Select onValueChange={field.onChange} value={field.value}>
											<SelectTrigger className="w-full">
												<SelectValue placeholder="Select a product category" />
											</SelectTrigger>
											<SelectContent>
												{categories.map((p) => (
													<SelectItem key={p.id} value={p.id.toString()}>
														{p.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								<Button type="submit" className="w-full">
									{pending ? (
										<LoaderCircle className="w-4 h-4 animate-spin mr-2" />
									) : null}
									{pending ? "Processing..." : "Next step"}
								</Button>
							</form>
						</Form>
					) : (
						productId && <ProductUpload productId={productId} />
					)
				) : (
					<div className="flex justify-center items-center h-40">
						<LoaderCircle className="w-8 h-8 animate-spin text-primary" />
					</div>
				)}
				<DialogFooter className="flex flex-row gap-4 items-center justify-between">
					<Button
						variant={"outline"}
						disabled={step === 0}
						onClick={() => setStep(step - 1)}
						className="mr-2"
					>
						Back
					</Button>
					<DialogClose className={buttonVariants({ variant: "secondary" })}>
						Save changes
					</DialogClose>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
