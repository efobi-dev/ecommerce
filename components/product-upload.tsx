"use client";

import { addProductImage } from "@/actions/product";
import { useToast } from "@/hooks/use-toast";
import type { ProductImage } from "@/lib/constants";
import { UploadDropzone } from "@/lib/uploadthing/client";
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
	const [maxImage, setMaxImage] = useState(0);
	const [pending, startTransition] = useTransition();
	const [fileUrl, setFileUrl] = useState<string>();
	const form = useForm<ProductImage>({
		resolver: zodResolver(productImageSchema),
		defaultValues: {
			id: nanoid(5),
			productId,
			url: "",
			altText: "",
		},
	});
	//set max images to 3 as we are allocated 2GB free max space, with 4mb per image that's around 170 products max
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
					return;
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
				onSubmit={form.handleSubmit(submit, (errors) => {
					const errorMessages = Object.values(errors);
					toast({
						title: "Invalid body",
						description: errorMessages[0].message,
						variant: "destructive",
					});
				})}
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
							disabled={maxImage === 2}
							endpoint="products"
							onClientUploadComplete={(res) => {
								form.setValue("url", res[0].url);
								setFileUrl(res[0].url);
								setMaxImage((prev) => prev + 1);
							}}
							className="w-full max-w-md border-2 border-dashed border-gray-300 rounded-lg p-6"
						/>
					)}
					{maxImage === 2 && (
						<p className="text-center text-destructive">
							Maximum 3 images allowed
						</p>
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
					disabled={fileUrl === undefined || pending}
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
