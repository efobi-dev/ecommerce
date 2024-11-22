import { getAuth } from "@/actions/auth";
import { getStore } from "@/actions/store";
import { EmailChange } from "@/components/auth/email-change";
import { NameChange } from "@/components/auth/name-change";
import { PasswordChange } from "@/components/password-change";
import { StoreForm } from "@/components/store-form";
import { ThemeToggle } from "@/components/theme-toggle";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserTab } from "@/components/user-tab";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Settings",
};

export default async function Page() {
	const tabList = [
		{ name: "Profile", value: "profile" },
		{ name: "Store settings", value: "store" },
		{ name: "User management", value: "users" },
		// { name: "System configuration", value: "system" },
	];
	const [auth, store] = await Promise.all([getAuth(), getStore()]);
	if (auth.user?.role !== "Superadmin") {
		return tabList.filter((tab) => tab.value === "profile");
	}

	return (
		<main className="flex-1 overflow-y-auto p-4">
			<div className="mx-auto max-w-4xl">
				<h1 className="mb-4 text-2xl font-semibold">Settings & Profile</h1>
				<Tabs defaultValue="profile">
					<TabsList>
						{tabList.map((tab) => (
							<TabsTrigger key={tab.value} value={tab.value}>
								{tab.name}
							</TabsTrigger>
						))}
					</TabsList>
					<TabsContent value="profile">
						<Card>
							<CardHeader className="flex flex-row items-center justify-between gap-4">
								<div className="flex flex-col">
									<CardTitle>Profile Information</CardTitle>
									<CardDescription>
										Update your profile details here.
									</CardDescription>
								</div>
								<ThemeToggle />
							</CardHeader>
							<CardContent className="space-y-4">
								<NameChange name={auth.user.fullName} />
								<EmailChange email={auth.user.email} />
								<PasswordChange email={auth.user.email} />
							</CardContent>
						</Card>
					</TabsContent>
					<StoreForm store={store} />
					<UserTab />
				</Tabs>
			</div>
		</main>
	);
}
