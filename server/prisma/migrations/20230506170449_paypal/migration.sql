-- Remove apikey and affiliateCode columns from User table
ALTER TABLE "User" DROP COLUMN "apikey";
ALTER TABLE "User" DROP COLUMN "affiliateCode";

DROP TABLE "Invoice";
DROP TABLE "Subscription";

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "planExpiresAt" TIMESTAMP(3) NOT NULL,
    "paypalSubscriptionId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);


-- CreateIndex
CREATE UNIQUE INDEX "Subscription_paypalSubscriptionId_key" ON "Subscription"("paypalSubscriptionId");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("authid") ON DELETE RESTRICT ON UPDATE CASCADE;
