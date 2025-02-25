"use client";

import { useToast } from "@/hooks/use-toast";
import { admin } from "@/lib/auth.client";
import { LoaderCircle, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/button";

export function DeleteUser({ userId }: { userId: string }) {
	const { toast } = useToast();
	const router = useRouter();
	const [pending, setPending] = useState(false);
	const submit = async (userId: string) => {
		setPending(true);
		try {
			await admin.removeUser(
				{ userId },
				{
					onSuccess: () => {
						toast({
							title: "Success",
						});
						router.refresh();
					},
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
		<Button
			variant={"destructive"}
			size={"icon"}
			onClick={() => submit(userId)}
			disabled={pending}
		>
			{pending ? (
				<LoaderCircle className="w-4 h-4 animate-spin" />
			) : (
				<>
					<Trash className="w-4 h-4" />
				</>
			)}
		</Button>
	);
}
