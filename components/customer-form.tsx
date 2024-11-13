"use client";

import { createCustomer, getCustomer } from "@/actions/customer";
import { createOrder } from "@/actions/customer";
import { useToast } from "@/hooks/use-toast";
import type { Customer } from "@/lib/constants";
import { useCartStore } from "@/lib/store";
import { customerSchema } from "@/prisma/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@prisma/client";
import { LoaderCircle, ShoppingCart } from "lucide-react";
import { nanoid } from "nanoid";
import Link from "next/link";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { usePaystackPayment } from "react-paystack";
import { Naira } from "./naira";
import { SignUpDialog } from "./signup-dialog";
import { Button } from "./ui/button";
import { Form, FormField } from "./ui/form";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

interface UserCustomer extends User {
	customer?: Customer;
}

export function CustomerForm({ user }: { user: UserCustomer | null }) {
	const { cart, emptyCart } = useCartStore();
	const [pending, startTransition] = useTransition();
	const { toast } = useToast();
	const form = useForm<Customer>({
		resolver: zodResolver(customerSchema),
		defaultValues: {
			id: user?.customer?.id ?? `CUS-${nanoid(5)}`,
			name: user?.fullName ?? "",
			email: user?.email ?? "",
			userId: user?.id,
			phone: "",
			address: "",
			createdAt: new Date(),
			updatedAt: new Date(),
		},
	});

	if (!cart || cart?.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 rounded-lg shadow-md">
				<h2 className="text-3xl font-bold text-primary mb-4">
					Your cart is empty
				</h2>
				<p className="text-xl mb-6">
					It looks like you haven't added any items to your cart yet.
				</p>
				<div className="mb-8">
					<ShoppingCart className="w-32 h-32 text-primary" />
				</div>
				<p className="text-lg text-gray-700 mb-6">
					Explore our amazing products and find something you love!
				</p>
				<Button variant={"secondary"}>
					<Link href="/">Continue Shopping</Link>
				</Button>
			</div>
		);
	}

	const onSuccess = async () => {
		try {
			const { error, message } = await createOrder(cart, form.getValues("id"));
			if (error) {
				toast({
					title: "Error creating order",
					description: error,
					variant: "destructive",
				});
				return;
			}
			toast({
				title: "Order created",
				description: message,
			});
			emptyCart();
		} catch (error) {
			console.error(error);
			toast({
				title: "Error creating order",
				description: "Internal server error",
				variant: "destructive",
			});
		}
	};

	const onClose = () => {
		toast({
			title: "Payment canceled",
			description: "Your payment was canceled",
			variant: "destructive",
		});
	};

	const config = {
		publicKey: "pk_test_2255cad94acf9d391fc7b3fb02d287d00ee1ea09",
		reference: nanoid(10),
		email: form.getValues("email"),
		amount: cart?.reduce((a, c) => a + c.price * c.quantity, 0) * 100,
		onSuccess,
		onClose,
	};
	const initPay = usePaystackPayment(config);
	const submit = (values: Customer) => {
		startTransition(async () => {
			try {
				const { error } = await getCustomer(user?.id || "");
				if (error === "Customer not found") {
					const { error: createError } = await createCustomer(values);
					if (createError) {
						toast({
							title: "Error creating customer",
							description: createError,
							variant: "destructive",
						});
						return;
					}
				}
				initPay(config);
			} catch (error) {
				console.error(error);
				toast({
					title: "Error creating customer",
					description: "An unexpected error occurred.",
					variant: "destructive",
				});
			}
		});
	};

	return (
		<section className="max-w-7xl w-full mx-auto p-6">
			<div className="grid md:grid-cols-2 gap-8">
				<div className="shadow-md rounded-lg p-6">
					<div className="flex flex-col items-center mb-6">
						<h2 className="text-3xl font-bold mb-4 sm:mb-0">Checkout</h2>
						{!user && (
							<p className="text-sm mt-2 sm:mt-0">
								Already have an account?{" "}
								<Link className="font-semibold" href="/login">
									Sign in
								</Link>
							</p>
						)}
					</div>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(submit, (error) => {
								console.error(error);
							})}
							className="space-y-2"
						>
							<FormField
								name="email"
								control={form.control}
								label="Email"
								render={({ field }) => (
									<Input type="email" autoComplete="billing email" {...field} />
								)}
							/>
							{!user && <SignUpDialog />}
							<Separator className="my-4" />
							<h3 className="text-xl font-semibold mb-3">Shipping Address</h3>
							<FormField
								name="name"
								control={form.control}
								label="Full name"
								render={({ field }) => (
									<Input autoComplete="billing name" {...field} />
								)}
							/>
							<FormField
								name="phone"
								control={form.control}
								label="Phone number"
								render={({ field }) => (
									<Input
										type="tel"
										autoComplete="billing tel"
										{...field}
										required
									/>
								)}
							/>
							<FormField
								name="address"
								control={form.control}
								label="Street address"
								render={({ field }) => (
									<Input
										type="text"
										autoComplete="billing address-level1"
										{...field}
										required
									/>
								)}
							/>
							<Button
								type="submit"
								className="w-full font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out mt-4"
							>
								{pending ? (
									<LoaderCircle className="w-5 h-5 animate-spin mr-2" />
								) : null}
								{pending ? "Processing..." : "Next step"}
							</Button>
						</form>
					</Form>
				</div>
				<div className="shadow-md rounded-lg p-6">
					<h3 className="font-semibold text-2xl mb-4">Order Summary</h3>
					<div className="space-y-4">
						{cart.map((item) => (
							<div
								key={item.id}
								className="flex items-center justify-between border-b pb-4"
							>
								<div className="flex-1">
									<p className="text-lg font-semibold">{item.name}</p>
									<p className="text-sm text-gray-600">
										Quantity: {item.quantity}
									</p>
								</div>
								<div className="text-right">
									<p className="text-lg font-bold">
										<Naira value={item.price * item.quantity} />
									</p>
									<p className="text-sm text-gray-600">
										<Naira value={item.price} /> per carton
									</p>
								</div>
							</div>
						))}
					</div>
					<Separator className="my-4" />
					<div className="flex justify-between items-center text-xl font-bold">
						<span>Total:</span>
						<span>
							<Naira
								value={cart.reduce(
									(total, item) => total + item.quantity * item.price,
									0,
								)}
							/>
						</span>
					</div>
				</div>
			</div>
		</section>
	);
}
