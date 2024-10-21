import { getAuth } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "%s | Super Admin",
	description: "Super admin dashboard",
};

export default async function ({ children }: { children: ReactNode }) {
	const { user } = await getAuth();
	if (!user) redirect("/login");
	if (user.role !== "Superadmin") redirect("/products");
	return <> {children} </>;
}
