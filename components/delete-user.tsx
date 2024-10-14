"use client";

import { deleteAdmin } from "@/actions/auth";
import { useToast } from "@/hooks/use-toast";
import { LoaderCircle, Trash } from "lucide-react";
import { useTransition } from "react";
import { Button } from "./ui/button";

export function DeleteUser({ userId }: { userId: string }) {
	const { toast } = useToast();
	const [pending, startTransition] = useTransition();
	function submit(userId: string) {
		startTransition(async () => {
			try {
				const { error, message } = await deleteAdmin(userId);
				if (error) {
					toast({
						title: "Something went wrong",
						description: error,
						variant: "destructive",
					});
				}
				toast({
					title: "Success",
					description: message,
				});
			} catch (error) {
				toast({
					title: "Something went wrong",
					description: "Internal server error",
					variant: "destructive",
				});
			}
		});
	}

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
