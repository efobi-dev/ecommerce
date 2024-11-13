"use client";

import { useCartState, useCartStore } from "@/lib/store";
import { Delete, ShoppingBag, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { Naira } from "./naira";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardTitle } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

export function Cart() {
	const { cart, emptyCart, removeItem } = useCartStore();
	const { isOpen, toggle } = useCartState();

	return (
		<Sheet open={isOpen} onOpenChange={toggle}>
			<SheetTrigger asChild>
				<Button size="icon" variant="outline" className="relative">
					<ShoppingBag className="text-primary w-5 h-5" />
					{cart && cart.length > 0 && (
						<span className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
							{cart?.length}
						</span>
					)}
				</Button>
			</SheetTrigger>
			<SheetContent className="w-full sm:max-w-md flex flex-col">
				<SheetHeader className="mb-6">
					<SheetTitle className="text-2xl font-bold">Your cart</SheetTitle>
				</SheetHeader>
				{cart && cart.length > 0 ? (
					<div className="flex flex-col h-full">
						<ScrollArea className="flex-grow mb-6">
							<div className="space-y-4">
								{cart.map((item) => (
									<Card key={item.id} className="flex items-center p-4">
										<div className="flex-grow">
											<CardTitle className="text-lg">{item.name}</CardTitle>
											<CardDescription className="text-sm mt-1">
												{item.quantity} x <Naira value={item.price} />
											</CardDescription>
										</div>
										<div className="flex items-center space-x-2">
											<CardContent className="text-lg font-semibold">
												<Naira value={item.quantity * item.price} />
											</CardContent>
											<Button
												size="icon"
												variant="destructive"
												onClick={() => removeItem(item.id)}
												className="h-8 w-8"
											>
												<Delete className="w-4 h-4" />
											</Button>
										</div>
									</Card>
								))}
							</div>
						</ScrollArea>
						<div className="space-y-4 mt-auto">
							<div className="flex justify-between items-center text-lg font-semibold">
								<span>Total:</span>
								<span>
									<Naira
										value={cart.reduce(
											(total, item) => total + item.quantity * item.price,
											0,
										)}
									/>
								</span>
							</div>{" "}
							<Button
								size="lg"
								className="w-full mb-4"
								onClick={() => toggle()}
							>
								<Link href="/checkout">Proceed to Checkout</Link>
							</Button>
							<Button
								size="lg"
								variant="destructive"
								onClick={() => emptyCart()}
								className="w-full"
							>
								Empty cart
							</Button>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center justify-center h-full gap-6 px-4 text-center">
						<ShoppingCart className="w-16 h-16 text-muted-foreground" />
						<SheetDescription className="text-xl">
							Your cart is empty
						</SheetDescription>
						<Button
							size="lg"
							className="w-full max-w-xs"
							onClick={() => toggle()}
						>
							<Link href="/search">Continue shopping</Link>
						</Button>
					</div>
				)}
			</SheetContent>
		</Sheet>
	);
}
