"use client";

import { addProductImage } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";
import type { ProductImage } from "@/lib/constants";
import { UploadDropzone } from "@/lib/uploadthing";
import { productImageSchema } from "@/prisma/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";

export function ProductUpload({ productId }: { productId: string }) {
	const { toast } = useToast();
	const [pending, startTransition] = useTransition();
	const [fileUrl, setFileUrl] = useState<string | undefined>(undefined);
	const form = useForm<ProductImage>({
		resolver: zodResolver(productImageSchema),
		defaultValues: {
			id: nanoid(5),
			productId,
			url: "",
			altText: "",
		},
	});

	function submit(values: ProductImage) {
		startTransition(async () => {
			try {
				const { error, message } = await addProductImage(values);
				if (error) {
					toast({
						title: "Something went wrong",
						description: error,
						variant: "destructive",
					});
				}
				toast({
					title: "Success",
					description: message,
				});
				setFileUrl(undefined);
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
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(submit, (errors) => console.error(errors))}
				className="space-y-6"
			>
				<div className="flex justify-center">
					{fileUrl ? (
						<Image
							src={fileUrl}
							alt={form.getValues("altText") ?? ""}
							width={200}
							height={200}
							className="rounded-lg object-cover"
						/>
					) : (
						<UploadDropzone
							endpoint="products"
							onClientUploadComplete={(res) => {
								form.setValue("url", res[0].url);
								setFileUrl(res[0].url);
							}}
							className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-6"
						/>
					)}
				</div>
				<FormField
					name="altText"
					control={form.control}
					label="Image description"
					render={({ field }) => (
						<Input
							{...field}
							value={field.value ?? ""}
							className="w-full"
							placeholder="Enter image description"
						/>
					)}
				/>
				<Button
					type="submit"
					className="w-full"
					disabled={fileUrl === undefined}
				>
					{pending ? (
						<LoaderCircle className="animate-spin h-4 w-4" />
					) : (
						"Upload Image"
					)}
				</Button>
			</form>
		</Form>
	);
}
