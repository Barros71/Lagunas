-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'comida',
ADD COLUMN     "is_promo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "promo_price" DOUBLE PRECISION;
