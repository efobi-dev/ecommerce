"use client";

import { type Cart, type PartialProduct, cartSchema } from "@/lib/constants";
import { useCartState, useCartStore } from "@/lib/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Naira } from "./naira";
import { Button, buttonVariants } from "./ui/button";
import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "./ui/carousel";
import { Form } from "./ui/form";

export function ProductDetails({ product }: { product: PartialProduct }) {
	const { toggle } = useCartState();
	const [quantity, setQuantity] = useState(1);
	const { addToCart } = useCartStore();
	const price = product.basePrice + product.basePrice * 0.1;
	const form = useForm<Cart>({
		resolver: zodResolver(cartSchema),
		defaultValues: {
			id: product.id,
			name: product.name,
			price,
			quantity,
		},
	});

	useEffect(() => {
		form.setValue("quantity", quantity);
	}, [quantity, form]);

	const submit = (values: Cart) => {
		addToCart(values);
		toggle();
	};

	return (
		<div className="max-w-4xl mx-auto p-6">
			<div className="relative">
				<Carousel opts={{ loop: true }} className="mb-8 w-full">
					<CarouselContent>
						{product.images.map((p) => (
							<CarouselItem key={p.id}>
								<div className="w-full aspect-square h-[50vh] min-h-[300px] relative">
									<Image
										src={p.url}
										alt={p.altText || ""}
										className="rounded-lg"
										style={{ objectFit: "cover", objectPosition: "center" }}
										fill
										quality={100}
										sizes="(max-width: 768px) 100vw, 50vw"
									/>
								</div>
							</CarouselItem>
						))}
					</CarouselContent>
					<CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2" />
					<CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2" />
				</Carousel>
			</div>
			<h3 className="text-2xl font-bold mb-4">{product.name}</h3>
			<p>
				<span className="text-primary text-xl font-semibold">
					<Naira value={price} />
				</span>{" "}
				per carton
			</p>
			<div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
				<p className="flex-grow">{product.description}</p>
				<p className="text-sm font-semibold px-3 py-1">
					{product.category.name}
				</p>
			</div>
			<div className="flex items-center justify-center gap-4 mb-6">
				<Button
					variant="outline"
					onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
					className="w-10 h-10 rounded-full"
				>
					<Minus className="text-primary w-4 h-4" />
				</Button>
				<span
					className={`${buttonVariants({ variant: "ghost" })} text-xl font-semibold`}
				>
					{quantity}
				</span>
				<Button
					variant="outline"
					onClick={() => setQuantity((prev) => prev + 1)}
					className="w-10 h-10 rounded-full"
				>
					<Plus className="text-primary w-4 h-4" />
				</Button>
			</div>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(submit)}>
					<Button type="submit" className="w-full py-3 text-lg font-semibold">
						Add to cart
					</Button>
				</form>
			</Form>
		</div>
	);
}
