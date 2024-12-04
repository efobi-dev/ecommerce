import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { CustomerForm } from "@/components/customer-form";
import prisma from "@/lib/db";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Checkout",
};

export default async function Page() {
	const authz = await auth.api.getSession({ headers: await headers() });
	const customer = authz?.user
		? await prisma.user.findUnique({
				where: { id: authz?.user.id },
				include: { Customer: true },
			})
		: null;

	return (
		<CustomerForm
			user={
				customer?.Customer && customer.Customer.length > 0
					? { ...customer, Customer: customer.Customer[0] }
					: null
			}
		/>
	);
}
