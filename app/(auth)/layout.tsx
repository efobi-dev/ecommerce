import { getAuth } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: "%s |Authentication",
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
		<div className="flex flex-col items-center justify-center h-screen">
			{children}
		</div>
	);
}
