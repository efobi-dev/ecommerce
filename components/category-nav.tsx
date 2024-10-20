"use client";

import type { Category } from "@/lib/constants";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";

export function CategoryNav({ categories }: { categories: Category[] }) {
	const pathname = usePathname();

	return (
		<aside className="hidden md:flex">
			<ScrollArea>
				<nav className="flex flex-col gap-y-2">
					<Link href={"/search"}>
						<Button
							variant={"link"}
							className={
								pathname === "/search" ? "text-primary" : "text-secondary"
							}
							disabled={pathname === "/search"}
						>
							All
						</Button>
					</Link>
					{categories.map((category) => (
						<Link href={`/search/${category.name}`} key={category.id}>
							<Button
								variant={"link"}
								className={
									pathname.includes(category.name)
										? "text-primary"
										: "text-secondary"
								}
								disabled={pathname.includes(category.name)}
							>
								{category.name}
							</Button>
						</Link>
					))}
				</nav>
			</ScrollArea>
		</aside>
	);
}
