-- AlterTable
ALTER TABLE "ProductImage" ADD COLUMN     "isMain" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "logoHeight" INTEGER NOT NULL DEFAULT 48,
ADD COLUMN     "ogImageUrl" TEXT;

-- CreateIndex
CREATE INDEX "ProductImage_productId_isMain_idx" ON "ProductImage"("productId", "isMain");
