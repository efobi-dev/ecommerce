/*
  Warnings:

  - Made the column `description` on table `Product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `altText` on table `ProductImage` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Product" ALTER COLUMN "description" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductImage" ALTER COLUMN "altText" SET NOT NULL;
