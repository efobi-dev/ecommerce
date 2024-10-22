import { Card, CardHeader } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function ProductCardLoader() {
	return (
		<Card className="overflow-hidden">
			<div className="relative h-48">
				<Skeleton className="h-full w-full" />
			</div>
			<CardHeader>
				<div className="flex justify-between items-start">
					<div>
						<Skeleton className="h-6 w-32 mb-2" />
						<Skeleton className="h-4 w-24" />
					</div>
					<Skeleton className="h-6 w-20" />
				</div>
			</CardHeader>
		</Card>
	);
}
