-- CreateTable
CREATE TABLE "BannerImages" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "altText" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "BannerImages_pkey" PRIMARY KEY ("id")
);
