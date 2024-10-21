import { ProductForm } from "@/components/product-form";
import { Product } from "@/components/products";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Products",
};

export default function Page() {
	return (
		<main className="flex-1 overflow-y-auto p-4">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-semibold">Products</h1>
				<ProductForm />
			</div>
			<Product />
		</main>
	);
}
