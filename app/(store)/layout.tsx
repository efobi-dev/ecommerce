import { getStore } from "@/actions/store";
import { StoreNav } from "@/components/store-nav";
import prisma from "@/lib/db";
import { env } from "@/lib/env";
import type { Metadata } from "next";
import Script from "next/script";
import type { ReactNode } from "react";

export async function generateMetadata(): Promise<Metadata> {
	const store = await prisma.store.findUnique({
		where: { id: env.NEXT_PUBLIC_STORE_ID },
	});
	return {
		title: {
			template: `%s | ${store?.name}`,
			default: `${store?.name}`,
		},
		description: store?.maintenance
			? "The store is currently under maintenance"
			: `Welcome to ${store?.name}`,
	};
}

export default async function StoreLayout({
	children,
}: { children: ReactNode }) {
	const store = await getStore();
	return store.maintenance === false ? (
		<>
			<Script
				src="https://cdn.amplitude.com/script/aed8ca2558c6a2dda5f31c8d2aa74dae.js"
				strategy="afterInteractive"
			/>
			<Script id="amplitude-init">
				{`
					window.amplitude.add(window.sessionReplay.plugin({sampleRate: 1}));
					window.amplitude.init('aed8ca2558c6a2dda5f31c8d2aa74dae', {
						fetchRemoteConfig: true,
						autocapture: true
					});
				`}
			</Script>
			<StoreNav store={store} />
			<main className="flex flex-col gap-4 p-4">{children}</main>
		</>
	) : (
		<div className="flex h-screen items-center justify-center">
			<div className="text-center p-8 bg-secondary rounded-lg shadow-lg">
				<h1 className="text-3xl font-bold text-muted mb-4">
					Store Maintenance
				</h1>
				<p className="text-xl mb-6">
					We're currently updating our store to serve you better.
				</p>
				<div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 mx-auto" />
				<p className="mt-6 ">
					Please check back soon. We appreciate your patience!
				</p>
			</div>
		</div>
	);
}
