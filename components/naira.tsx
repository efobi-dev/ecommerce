export function Naira({ value }: { value: number }) {
	return (
		<>
			{new Intl.NumberFormat("en-NG", {
				style: "currency",
				currency: "NGN",
			}).format(value)}
		</>
	);
}
