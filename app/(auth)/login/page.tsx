import { getStore } from "@/actions/store";
import { LoginForm } from "@/components/auth/log-in";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const { name } = await getStore();
	return {
		title: "Log in",
		description: `Log in to your ${name} account`,
	};
}

export default async function Page() {
	const { name } = await getStore();
	return <LoginForm name={name} />;
}
