-- CreateEnum
CREATE TYPE "KitchenOrderStatus" AS ENUM ('PENDING', 'READY', 'DELIVERED');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_tabId_fkey";

-- DropForeignKey
ALTER TABLE "TabItem" DROP CONSTRAINT "TabItem_tabId_fkey";

-- CreateTable
CREATE TABLE "KitchenOrder" (
    "id" TEXT NOT NULL,
    "tabId" TEXT NOT NULL,
    "itemName" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "status" "KitchenOrderStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KitchenOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TabItem" ADD CONSTRAINT "TabItem_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "Tab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "Tab"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "KitchenOrder" ADD CONSTRAINT "KitchenOrder_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "Tab"("id") ON DELETE CASCADE ON UPDATE CASCADE;
