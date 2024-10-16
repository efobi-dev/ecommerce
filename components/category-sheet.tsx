import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
	SheetHeader,
} from "./ui/sheet";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";
import type { Category } from "@/lib/constants";
import { ScrollArea } from "./ui/scroll-area";
import Link from "next/link";
import { SearchInput } from "./search";

export function CategorySheet({ categories }: { categories: Category[] }) {
	return (
		<Sheet>
			<SheetTrigger asChild className="md:hidden">
				<Button size={"icon"} variant={"outline"}>
					<Menu />
				</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Categories</SheetTitle>
					<SearchInput />
				</SheetHeader>
				<ScrollArea className="py-4">
					<Link href="/search">All</Link>
					{categories.map((route) => (
						<Link key={route.id} href={`/search/${route.name.toLowerCase()}`}>
							{route.name}
						</Link>
					))}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
