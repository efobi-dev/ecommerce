import prisma from "@/lib/db";
import { getStore } from "@/actions/store";
import { CategorySheet } from "./category-sheet";
import { SearchInput } from "./search";
import { Button } from "./ui/button";
import Link from "next/link";
import { User } from "lucide-react";
import { Cart } from "./cart";

export async function StoreNav() {
	const [categories, store] = await Promise.all([
		prisma.category.findMany(),
		getStore(),
	]);
	return (
		<header className="sticky top-0 bg-transparent backdrop-blur-md flex items-center gap-4 px-4 py-2 z-10 w-full">
			<CategorySheet categories={categories} />
			<h1 className="font-semibold">
				<Link href={"/"}>{store.name}</Link>
			</h1>
			<div className="hidden md:flex justify-center flex-grow">
				<nav className="flex items-center">
					<Button variant="link" asChild>
						<Link href="/search">All</Link>
					</Button>
					{categories.slice(0, 3).map((route) => (
						<Button variant="link" key={route.id} asChild>
							<Link href={`/search/${route.name.toLowerCase()}`}>
								{route.name}
							</Link>
						</Button>
					))}
				</nav>
				<SearchInput className="max-w-md" />
			</div>
			<div className="flex justify-end items-center space-x-2 ml-auto">
				<Button size="icon" variant="outline" asChild>
					<Link href="/profile">
						<User className="w-4 h-4 text-primary" />
					</Link>
				</Button>
				<Cart />
			</div>
		</header>
	);
}
