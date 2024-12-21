import prisma from "@/lib/db";
import { bannerColumns } from "./banner-column";
import { DataTable } from "./ui/data-table";

export async function BannerTable() {
	const images = await prisma.bannerImages.findMany();
	return <DataTable data={images} columns={bannerColumns} />;
}
