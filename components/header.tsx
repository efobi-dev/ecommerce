"use client";

import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Menu } from "lucide-react";
import { Button } from "./ui/button";
import { useSidebarStore } from "@/lib/store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function Header({ email }: { email: string }) {
	const { toggle } = useSidebarStore();
	return (
		<header className="flex h-16 items-center justify-between border-b px-4">
			<Button
				variant="ghost"
				size="icon"
				className="lg:hidden"
				onClick={() => toggle()}
			>
				<Menu className="h-6 w-6" />
			</Button>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" className="relative h-8 w-8 rounded-full">
						<Avatar>
							<AvatarImage src="" />
							<AvatarFallback>{email.substring(0, 1)}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLabel>My Account</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem>Profile</DropdownMenuItem>
					<DropdownMenuItem>Settings</DropdownMenuItem>
					<DropdownMenuItem>Logout</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
}
