import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		template: "%s | Super Admin",
		default: "Super Admin",
	},
	description: "Super admin dashboard",
};

export default async function ({ children }: { children: ReactNode }) {
	const authz = await auth.api.getSession({ headers: await headers() });
	if (!authz?.user) redirect("/login");
	if (authz?.user.role !== "owner") redirect("/products");
	return <> {children} </>;
}
