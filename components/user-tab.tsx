import prisma from "@/lib/db";
import { AdminTable } from "./admin-table";
import { AddUser } from "./create-admin";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { TabsContent } from "./ui/tabs";

export async function UserTab() {
	const admins = await prisma.user.findMany({
		where: { role: { in: ["Admin", "Superadmin"] } },
		select: {
			id: true,
			email: true,
			role: true,
			fullName: true,
		},
	});
	return (
		<TabsContent value="users">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between gap-4">
					<div className="flex flex-col">
						<CardTitle>User management</CardTitle>
						<CardDescription>
							Manage admin users and permissions
						</CardDescription>
					</div>
					<AddUser />
				</CardHeader>
				<CardContent>
					<AdminTable users={admins} />
				</CardContent>
			</Card>
		</TabsContent>
	);
}
