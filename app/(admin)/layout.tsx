import { getStore } from "@/actions/store";
import { Header } from "@/components/header";
import { SideBar } from "@/components/side-bar";
import { auth } from "@/lib/auth";
import { menuLink } from "@/lib/constants";
import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

export const metadata: Metadata = {
	title: {
		template: "%s | Admin",
		default: "Admin",
	},
	description: "Admin dashboard",
};

export default async function ({ children }: { children: ReactNode }) {
	const authz = await auth.api.getSession({ headers: await headers() });

	if (!authz?.user) redirect("/login");
	if (authz?.user.role === "user") redirect("/checkout");

	const routes = menuLink.filter((p) => {
		if (authz?.user.role === "admin") {
			return p.name === "Products";
		}
		return true;
	});

	const { name } = await getStore();

	return (
		<div className="flex h-screen overflow-hidden">
			<SideBar menu={routes} name={name} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header email={authz?.user.email} />
				{children}
			</div>
		</div>
	);
}
