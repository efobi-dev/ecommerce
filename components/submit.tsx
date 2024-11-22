"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Button, type ButtonProps } from "./ui/button";

export function Submit({ children, className, variant, size }: ButtonProps) {
	const { pending } = useFormStatus();

	return (
		<Button
			disabled={pending}
			className={className}
			variant={variant}
			size={size}
			type="submit"
		>
			{pending ? <LoaderCircle className="animate-spin size-6" /> : children}
		</Button>
	);
}
