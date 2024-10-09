import { getAuth } from "@/lib/auth";
import type { ReactNode } from "react";
import { redirect } from "next/navigation";

export default async function ({ children }: { children: ReactNode }) {
	const { user } = await getAuth();
	if (!user) redirect("/login");
	if (user.role !== "Superadmin") redirect("/products");
	return <> {children} </>;
}
