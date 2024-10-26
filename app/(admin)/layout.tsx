import { getStore } from "@/actions/store";
import { Header } from "@/components/header";
import { SideBar } from "@/components/side-bar";
import { getAuth } from "@/actions/auth";
import { menuLink } from "@/lib/constants";
import type { Metadata } from "next";
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
	const { user } = await getAuth();

	if (!user) redirect("/login");
	if (user.role === "User") redirect("/checkout");

	const routes = menuLink.filter((p) => {
		if (user.role === "Admin") {
			return p.name === "Products";
		}
		return true;
	});

	const store = await getStore();

	return (
		<div className="flex h-screen overflow-hidden">
			<SideBar menu={routes} name={store.name} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header email={user.email} />
				{children}
			</div>
		</div>
	);
}
