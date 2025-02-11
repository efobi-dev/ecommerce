import prisma from "@/lib/db";
import { PlusIcon } from "lucide-react";
import { Suspense } from "react";
import { CategoryForm } from "./category-form";
import { CategoryMenu } from "./category-menu";
import { CardSkeleton } from "./loaders/card";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";

export async function CategoriesCard() {
	const categories = await prisma.category.findMany();

	return (
		<Suspense
			fallback={<CardSkeleton title="Categories" icon={<PlusIcon />} />}
		>
			<Card className="h-full">
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<CardTitle className="text-lg font-semibold">Categories</CardTitle>
					<CardDescription>
						<CategoryForm />
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">
							Total Categories
						</span>
						<span className="text-2xl font-bold">{categories.length}</span>
					</div>
					<CategoryMenu values={categories} />
				</CardContent>
			</Card>
		</Suspense>
	);
}
