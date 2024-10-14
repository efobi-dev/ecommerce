"use client";

import type { Menu } from "@/lib/constants";
import { X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "../lib/store";
import { Button } from "./ui/button";

export function SideBar({ menu }: { menu: Menu[] }) {
	const { toggle, isOpen } = useSidebarStore();
	const pathname = usePathname();
	return (
		<aside
			className={`${
				isOpen ? "translate-x-0" : "-translate-x-full"
			} fixed inset-y-0 left-0 z-50 w-64 bg-secondary text-accent-foreground transition-transform duration-300 ease-in-out lg:static lg:translate-x-0`}
		>
			<div className="flex h-16 items-center justify-between px-4">
				<span className="text-2xl font-semibold">Something</span>
				<Button
					variant="ghost"
					size="icon"
					className="lg:hidden"
					onClick={() => toggle()}
				>
					<X className="h-6 w-6" />
				</Button>
			</div>
			<nav className="mt-8 px-4">
				<ul className="space-y-2">
					{menu.map((route) => {
						const Icon = LucideIcons[
							route.icon as keyof typeof LucideIcons
						] as LucideIcons.LucideIcon;
						return (
							<li key={route.name}>
								<Link href={route.link}>
									<Button
										variant={
											pathname.includes(route.link) ? "default" : "ghost"
										}
										className="w-full justify-start"
									>
										{Icon && <Icon className="w-5 h-5 mr-3" />}
										{route.name}
									</Button>
								</Link>
							</li>
						);
					})}
				</ul>
			</nav>
		</aside>
	);
}
