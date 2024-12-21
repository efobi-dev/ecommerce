import type { BannerImage } from "@/lib/constants";
import { Eye } from "lucide-react";
import Image from "next/image";
import { BannerTable } from "./banner-table";
import { BannerUpload } from "./banner-upload";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

export function BannerDialog({ images }: { images: BannerImage[] }) {
	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant={"outline"} size={"icon"}>
					<Eye />
				</Button>
			</DialogTrigger>
			<DialogContent className="w-full lg:max-w-screen-md">
				<DialogHeader className="flex items-center justify-center">
					<div className="flex flex-row items-center justify-between gap-4">
						<DialogTitle>Banner Images Overview</DialogTitle>
						<BannerUpload />
					</div>
				</DialogHeader>
				{images.length > 0 ? (
					<div className="flex items-center gap-2 justify-evenly">
						{images.map((image) => (
							<div key={image.id} className="relative w-1/4 h-1/4">
								<Image
									src={image.url}
									alt={image.altText}
									fill
									objectFit="cover"
									className="rounded-lg hover:scale-120"
								/>
							</div>
						))}
					</div>
				) : (
					<span className="text-xl font-semibold">No banner images found</span>
				)}
				<BannerTable />
			</DialogContent>
		</Dialog>
	);
}
