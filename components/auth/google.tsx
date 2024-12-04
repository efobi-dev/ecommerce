"use client";

import Google from "@/assets/icons/google";
import { useToast } from "@/hooks/use-toast";
import { signIn } from "@/lib/auth.client";
import { Loader } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

export function GoogleSignIn() {
	const { toast } = useToast();
	const [pending, setPending] = useState(false);

	const googleSignIn = async () => {
		setPending(true);
		try {
			await signIn.social(
				{ provider: "google" },
				{
					onSuccess: () => {},
					onError: (ctx) => {
						toast({
							title: "Something went wrong",
							description: ctx.error.message,
							variant: "destructive",
						});
					},
				},
			);
		} catch (error) {
			console.error(error);
			toast({
				title: "Something went wrong",
				description:
					error instanceof Error ? error.message : "Internal server error",
				variant: "destructive",
			});
		} finally {
			setPending(false);
		}
	};

	return (
		<Button variant={"outline"} disabled={pending} onClick={googleSignIn}>
			{pending ? (
				<Loader className="animate-spin w-4 h-4" />
			) : (
				<span>
					<Google className="w-4 h-4 mr-2" />
					Log in with Google
				</span>
			)}
		</Button>
	);
}
