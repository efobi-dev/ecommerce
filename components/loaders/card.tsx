import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import type { ReactNode } from "react";

export function CardSkeleton({
	title,
	icon,
}: { title: string; icon: ReactNode }) {
	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				{icon}
			</CardHeader>
			<CardContent>
				<Skeleton className="h-8 w-24 mb-2" />
				<Skeleton className="h-4 w-36" />
			</CardContent>
		</Card>
	);
}
