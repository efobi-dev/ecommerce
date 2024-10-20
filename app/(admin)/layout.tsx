import { Header } from "@/components/header";
import { SideBar } from "@/components/side-bar";
import { getAuth } from "@/lib/auth";
import { menuLink } from "@/lib/constants";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

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

	return (
		<div className="flex h-screen overflow-hidden">
			<SideBar menu={routes} />
			<div className="flex flex-1 flex-col overflow-hidden">
				<Header email={user.email} />
				{children}
			</div>
		</div>
	);
}
