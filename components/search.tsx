"use client";

import { Input } from "./ui/input";
import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function SearchInput({ className }: { className?: string }) {
	const router = useRouter();

	const handleSearch = useDebouncedCallback((value: string) => {
		router.push(`/search?q=${encodeURIComponent(value)}`);
	}, 300);

	return (
		<Input
			type="search for products"
			placeholder="Search"
			autoFocus
			className={cn("w-full", className)}
			onChange={(e) => handleSearch(e.target.value)}
		/>
	);
}
