/*
  Warnings:

  - The primary key for the `Category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Customer` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `OrderItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductImage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductVariant` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_customerId_fkey";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_productVariantId_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_categoryId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP CONSTRAINT "Category_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Category_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Category_id_seq";

-- AlterTable
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Customer_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Customer_id_seq";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "customerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "OrderItem" DROP CONSTRAINT "OrderItem_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productVariantId" SET DATA TYPE TEXT,
ADD CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "OrderItem_id_seq";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "categoryId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "ProductImage" DROP CONSTRAINT "ProductImage_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProductImage_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProductImage_id_seq";

-- AlterTable
ALTER TABLE "ProductVariant" DROP CONSTRAINT "ProductVariant_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProductVariant_id_seq";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productVariantId_fkey" FOREIGN KEY ("productVariantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
