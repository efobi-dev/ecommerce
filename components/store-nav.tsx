import type { Store } from "@/lib/constants";
import prisma from "@/lib/db";
import Link from "next/link";
import { Cart } from "./cart";
import { CategorySheet } from "./category-sheet";
import { SearchInput } from "./search";
import { Button } from "./ui/button";

export async function StoreNav({ store }: { store: Store }) {
	const categories = await prisma.category.findMany();
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
							<Link href={`/search/${route.name}`}>{route.name}</Link>
						</Button>
					))}
				</nav>
				<SearchInput className="max-w-md" />
			</div>
			<div className="flex justify-end items-center space-x-2 ml-auto">
				{/* {user && (
					<Button size="icon" variant="outline" asChild>
						<Link href="/profile">
							<User className="w-4 h-4 text-primary" />
						</Link>
					</Button>
				)} */}
				<Cart />
			</div>
		</header>
	);
}
