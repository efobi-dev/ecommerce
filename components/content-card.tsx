import prisma from "@/lib/db";
import { Eye } from "lucide-react";
import { Suspense } from "react";
import { BannerDialog } from "./banner-dialog";
import { CardSkeleton } from "./loaders/card";
import { Button } from "./ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
export async function ContentCard() {
	const activeImages = await prisma.bannerImages.findMany({
		where: { active: true },
	});
	return (
		<Suspense fallback={<CardSkeleton title="Banner Images" icon={<Eye />} />}>
			<Card className="h-full">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-lg font-semibold">Banner Images</CardTitle>
					<BannerDialog images={activeImages} />
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							Current active images
						</span>
						<span className="text-2xl font-bold">{activeImages.length}</span>
					</div>
				</CardContent>
			</Card>
		</Suspense>
	);
}
