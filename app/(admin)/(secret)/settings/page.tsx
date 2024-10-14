import { EmailChange } from "@/components/email-change";
import { NameChange } from "@/components/name-change";
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
import { getAuth } from "@/lib/auth";

export default async function Page() {
	const tabList = [
		{ name: "Profile", value: "profile" },
		{ name: "Store settings", value: "store" },
		{ name: "User management", value: "users" },
		// { name: "System configuration", value: "system" },
	];
	const { user } = await getAuth();
	if (user?.role !== "Superadmin") {
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
								<NameChange name={user.fullName} />
								<EmailChange email={user.email} />
								<PasswordChange email={user.email} />
							</CardContent>
						</Card>
					</TabsContent>
					<StoreForm />
					<UserTab />
				</Tabs>
			</div>
		</main>
	);
}
