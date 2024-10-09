import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
	// Seed Categories
	const categories = await Promise.all(
		Array.from({ length: 5 }).map(() =>
			prisma.category.create({
				data: {
					name: faker.commerce.department(),
				},
			}),
		),
	);

	// Seed Products
	for (let i = 0; i < 20; i++) {
		const product = await prisma.product.create({
			data: {
				name: faker.commerce.productName(),
				description: faker.commerce.productDescription(),
				sku: faker.string.alphanumeric(10),
				basePrice: Number.parseFloat(faker.commerce.price()),
				categoryId: faker.helpers.arrayElement(categories).id,
				supplierId: faker.number.int({ min: 1, max: 10 }),
			},
		});

		// Seed ProductImages
		await Promise.all(
			Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(() =>
				prisma.productImage.create({
					data: {
						url: faker.image.url(),
						altText: faker.lorem.sentence(),
						productId: product.id,
					},
				}),
			),
		);

		// Seed ProductVariants
		await Promise.all(
			Array.from({ length: faker.number.int({ min: 1, max: 3 }) }).map(() =>
				prisma.productVariant.create({
					data: {
						name: faker.commerce.productAdjective(),
						sku: faker.string.alphanumeric(10),
						price: Number.parseFloat(faker.commerce.price()),
						stock: faker.number.int({ min: 0, max: 100 }),
						productId: product.id,
					},
				}),
			),
		);
	}

	// Seed Customers
	const customers = await Promise.all(
		Array.from({ length: 10 }).map(() =>
			prisma.customer.create({
				data: {
					name: faker.person.fullName(),
					email: faker.internet.email(),
					phone: faker.phone.number(),
					address: faker.location.streetAddress(),
				},
			}),
		),
	);

	// Seed Orders and OrderItems
	for (const customer of customers) {
		const order = await prisma.order.create({
			data: {
				customerId: customer.id,
				totalAmount: 0,
			},
		});

		const orderItems = await Promise.all(
			Array.from({ length: faker.number.int({ min: 1, max: 5 }) }).map(
				async () => {
					const product = await prisma.product.findFirst({
						include: { variants: true },
					});
					if (product) {
						const variant = faker.helpers.arrayElement(product.variants);
						const quantity = faker.number.int({ min: 1, max: 5 });
						const price =
							Number.parseFloat(variant.price.toString()) * quantity;

						return prisma.orderItem.create({
							data: {
								orderId: order.id,
								productId: product.id,
								productVariantId: variant.id,
								quantity,
								price,
							},
						});
					}
				},
			),
		);

		const totalAmount = orderItems.reduce(
			(sum, item) =>
				sum + (item ? Number.parseFloat(item.price.toString()) : 0),
			0,
		);
		await prisma.order.update({
			where: { id: order.id },
			data: { totalAmount },
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
