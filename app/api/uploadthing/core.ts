import { getAuth } from "@/actions/auth";
import { type FileRouter, createUploadthing } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

export const fileRouter = {
	products: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
		.middleware(async () => {
			const { user } = await getAuth();
			if (!user) throw new UploadThingError("Unauthenticated");
			return { userId: user.id };
		})
		.onUploadComplete(async ({ file, metadata }) => {
			const { userId } = metadata;
			console.log("File uploaded by user: ", userId);
			return { fileUrl: file.url };
		}),
} satisfies FileRouter;

export type APIFileRouter = typeof fileRouter;
