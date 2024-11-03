import { getStore } from "@/actions/store";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const body = localFont({
	src: "../assets/fonts/body.ttf",
});

export async function generateMetadata(): Promise<Metadata> {
	const store = await getStore();
	return {
		title: {
			template: `%s | ${store.name}`,
			default: `${store.name}`,
		},
		description: `The warehouse for all electronics at ${store.name}`,
	};
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body
				className={`${body.className} antialiased`}
				suppressHydrationWarning
			>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					{children}
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	);
}
