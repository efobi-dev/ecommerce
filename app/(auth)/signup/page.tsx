import { getStore } from "@/actions/store";
import { SignupForm } from "@/components/auth/sign-up";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const { name } = await getStore();
	return {
		title: "Sign up",
		description: `Sign up to get your ${name} account`,
	};
}

export default async function Page() {
	const { name } = await getStore();
	return <SignupForm name={name} />;
}
