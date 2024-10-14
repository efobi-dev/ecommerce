"use client";

import type { User } from "@/lib/constants";
import { DeleteUser } from "./delete-user";
import { UpdateUser } from "./edit-user";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";

export function AdminTable({ users }: { users: User[] }) {
	return (
		<div className="space-y-2">
			<h2 className="text-2xl font-semibold">Current admins</h2>
			<Table className="overflow-auto">
				<TableHeader>
					<TableRow>
						<TableHead>Name</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{users.map((user) => (
						<TableRow key={user.id}>
							<TableCell>{user.fullName}</TableCell>
							<TableCell>{user.email}</TableCell>
							<TableCell className="capitalize">
								{user.role === "Admin"
									? "Admin"
									: user.role === "User"
										? "User"
										: "Super admin"}
							</TableCell>
							<TableCell className="flex gap-4">
								<UpdateUser values={user} />
								<DeleteUser userId={user.id} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
