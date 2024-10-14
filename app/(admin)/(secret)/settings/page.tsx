import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardContent,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getAuth } from "@/lib/auth";
import { NameChange } from "@/components/name-change";
import { EmailChange } from "@/components/email-change";
import { PasswordChange } from "@/components/password-change";
import { StoreForm } from "@/components/store-form";

export default async function Page() {
	const tabList = [
		{ name: "Profile", value: "profile" },
		{ name: "Store settings", value: "store" },
		{ name: "User management", value: "users" },
		{ name: "System configuration", value: "system" },
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
							<CardHeader>
								<CardTitle>Profile Information</CardTitle>
								<CardDescription>
									Update your profile details here.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<NameChange name={user.fullName} />
								<EmailChange email={user.email} />
								<PasswordChange email={user.email} />
							</CardContent>
						</Card>
					</TabsContent>
					<StoreForm />
				</Tabs>
			</div>
		</main>
	);
}
