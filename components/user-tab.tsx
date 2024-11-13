import prisma from "@/lib/db";
import { Suspense } from "react";
import { AdminTable } from "./admin-table";
import { AddUser } from "./create-admin";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
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
					<Suspense fallback={<UserTableSkeleton />}>
						<AdminTable users={admins} />
					</Suspense>
				</CardContent>
			</Card>
		</TabsContent>
	);
}

function UserTableSkeleton() {
	return (
		<Card>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{[...Array(4)].map((_, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: index needed fot iteration
							<TableRow key={index}>
								<TableCell>
									<Skeleton className="h-4 w-[60px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[100px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[80px]" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-4 w-[80px]" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
