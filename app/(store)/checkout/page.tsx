import { CustomerForm } from "@/components/customer-form";
import { getAuth } from "@/lib/auth";
import prisma from "@/lib/db";

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
