import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Script from "next/script";
import type { ReactNode } from "react";

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
	const authz = await auth.api.getSession({ headers: await headers() });

	if (authz?.session) {
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
