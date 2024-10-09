import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

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
