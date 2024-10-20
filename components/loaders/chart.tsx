import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartSkeleton() {
	return (
		<Card>
			<CardHeader>
				<CardTitle>
					<Skeleton className="h-6 w-48" />
				</CardTitle>
				<CardDescription>
					<Skeleton className="h-4 w-36" />
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Skeleton className="h-[300px] w-full" />
			</CardContent>
			<CardFooter className="flex-col items-start gap-2">
				<Skeleton className="h-4 w-48" />
				<Skeleton className="h-4 w-64" />
			</CardFooter>
		</Card>
	);
}
