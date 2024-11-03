import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
	server: {
		DATABASE_URL: z.string().url(),
		UPLOADTHING_TOKEN: z.string(),
	},
	client: {
		NEXT_PUBLIC_STORE_ID: z.string(),
	},
	runtimeEnv: {
		DATABASE_URL: process.env.DATABASE_URL,
		NEXT_PUBLIC_STORE_ID: process.env.NEXT_PUBLIC_STORE_ID,
		UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
	},
});
