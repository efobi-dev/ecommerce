"use client";

import { useCartStore } from "@/lib/store";
import {
	Sheet,
	SheetTitle,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTrigger,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { ShoppingBag, ShoppingCart, Delete } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export function Cart() {
	const { cart, emptyCart, removeItem } = useCartStore();

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button size={"icon"} variant={"outline"}>
					<ShoppingBag className="text-primary w-4 h-4" />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Your cart</SheetTitle>
				</SheetHeader>
				{cart ? (
					<div className="grid gap-4">
						<ScrollArea>
							{cart.map((item) => (
								<Card key={item.id} className="flex flex-row justify-between">
									<CardHeader>
										<CardTitle>{item.name}</CardTitle>
										<CardDescription>
											{item.quantity} at {item.price} totalling{" "}
											{item.quantity * item.price}
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Button
											size={"icon"}
											variant={"destructive"}
											onClick={() => removeItem(item.id)}
										>
											<Delete className="w-4 h-4" />
										</Button>
									</CardContent>
								</Card>
							))}
						</ScrollArea>
						<Button
							size={"lg"}
							variant={"destructive"}
							onClick={() => emptyCart()}
						>
							Empty cart
						</Button>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center gap-4 px-4">
						<ShoppingCart className="w-10 h-10 text-destructive-foreground" />
						<SheetDescription>Your cart is empty</SheetDescription>
						<Button size={"lg"}>
							<Link href="/search">Continue shopping</Link>
						</Button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
