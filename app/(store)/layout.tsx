import type { ReactNode } from "react";
import { StoreNav } from "@/components/store-nav";

export default function StoreLayout({ children }: { children: ReactNode }) {
	return (
		<>
			<StoreNav />
			<main className="flex flex-col gap-4 p-4">{children}</main>
		</>
	);
}
