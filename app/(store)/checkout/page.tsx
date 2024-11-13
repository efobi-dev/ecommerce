import { getAuth } from "@/actions/auth";
import { CustomerForm } from "@/components/customer-form";
import prisma from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Checkout",
};

export default async function Page() {
	const { user } = await getAuth();
	const customer = user
		? await prisma.user.findUnique({
				where: { id: user.id },
				include: { customer: true },
			})
		: null;

	return (
		<CustomerForm
			user={
				customer
					? { ...customer, customer: customer.customer || undefined }
					: null
			}
		/>
	);
}
