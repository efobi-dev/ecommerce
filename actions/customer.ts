"use server";

import { getAuth } from "@/actions/auth";
import type { Cart, Customer } from "@/lib/constants";
import prisma from "@/lib/db";
import { customerSchema } from "@/prisma/zod";

export async function createCustomer(values: Customer) {
	try {
		const { data, error } = await customerSchema.safeParseAsync(values);
		if (error) return { error: error.issues[0].message };
		const customer = await prisma.customer.create({ data });
		if (!customer) return { error: "Failed to create customer" };
		return { success: true, message: "Customer created successfully" };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function getCustomer(userId: string) {
	try {
		const customer = await prisma.customer.findUnique({
			where: { userId },
		});

		if (!customer) return { error: "Customer not found" };

		return {
			success: true,
		};
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}

export async function createOrder(cart: Cart[], customerId: string) {
	try {
		if (!cart || cart.length === 0) {
			return { error: "Cart is empty" };
		}

		// Check if the customer exists before creating orders
		const customer = await prisma.customer.findUnique({
			where: { id: customerId },
		});

		if (!customer) {
			return { error: "Customer not found" };
		}

		const orders = await prisma.$transaction(
			cart.map((item) =>
				prisma.order.create({
					data: {
						customer: {
							connect: { id: customer.id },
						},
						product: {
							connect: { id: item.id },
						},
						quantity: item.quantity,
						price: item.price,
						totalAmount: item.price * item.quantity,
					},
				}),
			),
		);

		if (!orders || orders.length === 0)
			return { error: "Failed to create orders" };

		return { success: true, message: "Orders created successfully", orders };
	} catch (error) {
		console.error(error);
		return { error: "Internal server error" };
	}
}
