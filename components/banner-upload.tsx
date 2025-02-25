"use client";

import { addBannerImage } from "@/actions/store";
import { useToast } from "@/hooks/use-toast";
import type { BannerImage } from "@/lib/constants";
import { UploadDropzone } from "@/lib/uploadthing/client";
import { bannerImagesSchema } from "@/prisma/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus } from "lucide-react";
import { nanoid } from "nanoid";
import Image from "next/image";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Button } from "./ui/button";
import {
	Drawer,
	DrawerContent,
	DrawerHeader,
	DrawerTrigger,
} from "./ui/drawer";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";

export function BannerUpload() {
	const { toast } = useToast();
	const [pending, startTransition] = useTransition();
	const [fileUrl, setFileUrl] = useState<string>();
	const form = useForm<BannerImage>({
		resolver: zodResolver(bannerImagesSchema),
		defaultValues: {
			id: nanoid(7),
			url: "",
			altText: "",
			active: false,
		},
	});
	function submit(values: BannerImage) {
		startTransition(async () => {
			try {
				const { error, message } = await addBannerImage(values);
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
					description:
						error instanceof Error ? error.message : "Internal server error",
					variant: "destructive",
				});
			}
		});
	}

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<Button size={"icon"} variant={"outline"}>
					<Plus />
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<span className="text-xl font-semibold">New Banner Image</span>
				</DrawerHeader>
				<div className="flex flex-col gap-4 max-w-md items-center justify-center">
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
							className="grid gap-4"
						>
							<div>
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
										endpoint={"bannerImages"}
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
				</div>
			</DrawerContent>
		</Drawer>
	);
}
