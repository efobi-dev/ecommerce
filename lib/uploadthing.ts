import {
	generateUploadButton,
	generateUploadDropzone,
} from "@uploadthing/react";

import type { APIFileRouter } from "@/app/api/uploadthing/core";

export const UploadButton = generateUploadButton<APIFileRouter>();
export const UploadDropzone = generateUploadDropzone<APIFileRouter>();
