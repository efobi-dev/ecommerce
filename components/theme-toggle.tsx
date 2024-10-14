"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";

const ThemeToggle = () => {
	const [mounted, setMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	return (
		<Button
			variant={"ghost"}
			onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
			className="p-2 rounded-full"
			aria-label="Toggle theme"
		>
			{theme === "dark" ? (
				<Sun className="w-5 h-5 text-yellow-500" />
			) : (
				<Moon className="w-5 h-5 text-blue-500" />
			)}
		</Button>
	);
};

export { ThemeToggle };
