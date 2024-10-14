import prisma from "@/lib/db";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { CategoryForm } from "./category-form";
import { CategoryMenu } from "./category-menu";

export async function CategoriesCard() {
	const categories = await prisma.category.findMany();

	return (
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
	);
}
