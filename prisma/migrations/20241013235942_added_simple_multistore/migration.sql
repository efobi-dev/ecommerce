-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "maintenance" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);
