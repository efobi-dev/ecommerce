import { getAuth } from "@/actions/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import Script from "next/script";

export const metadata: Metadata = {
	title: {
		template: "%s | Authentication",
		default: "Authentication",
	},
	description: "Authentication page",
};

export default async function AuthLayout({
	children,
}: { children: ReactNode }) {
	const { user } = await getAuth();

	if (user) {
		redirect("/dashboard");
	}

	return (
		<>
			<Script
				defer
				src="https://cloud.umami.is/script.js"
				data-website-id="fd1a8035-3637-4ae8-ae77-7cb317a6ac35"
			/>
			<div className="flex flex-col items-center justify-center h-screen">
				{children}
			</div>
		</>
	);
}
