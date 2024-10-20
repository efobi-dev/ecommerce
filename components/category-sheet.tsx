import type { Category } from "@/lib/constants";
import { Menu } from "lucide-react";
import Link from "next/link";
import { SearchInput } from "./search";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "./ui/sheet";

export function CategorySheet({ categories }: { categories: Category[] }) {
	return (
		<Sheet>
			<SheetTrigger asChild className="md:hidden">
				<Button size="icon" variant="outline">
					<Menu className="h-5 w-5" />
				</Button>
			</SheetTrigger>
			<SheetContent side="left" className="w-[300px] sm:w-[400px]">
				<SheetHeader>
					<SheetTitle className="text-2xl font-bold">Categories</SheetTitle>
					<SearchInput className="mt-4" />
				</SheetHeader>
				<ScrollArea className="mt-6 h-[calc(100vh-180px)]">
					<div className="flex flex-col space-y-2">
						<Link href="/search" className="px-4 py-2 rounded-md">
							All
						</Link>
						{categories.map((route) => (
							<Link
								key={route.id}
								href={`/search/${route.name}`}
								className="px-4 py-2 rounded-md"
							>
								{route.name}
							</Link>
						))}
					</div>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	);
}
