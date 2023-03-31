/*
  Warnings:

  - You are about to drop the column `plan` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `planExpiresAt` on the `User` table. All the data in the column will be lost.
  - Added the required column `plan` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planExpiresAt` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Subscription" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "planExpiresAt" DATETIME NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("authid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Subscription" ("createdAt", "id", "status", "stripeCustomerId", "stripePaymentId", "stripeSubscriptionId", "updatedAt", "userId") SELECT "createdAt", "id", "status", "stripeCustomerId", "stripePaymentId", "stripeSubscriptionId", "updatedAt", "userId" FROM "Subscription";
DROP TABLE "Subscription";
ALTER TABLE "new_Subscription" RENAME TO "Subscription";
CREATE UNIQUE INDEX "Subscription_stripePaymentId_key" ON "Subscription"("stripePaymentId");
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");
CREATE TABLE "new_User" (
    "authid" TEXT NOT NULL PRIMARY KEY,
    "whitelist" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "apikey" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("apikey", "authid", "banned", "createdAt", "updatedAt", "whitelist") SELECT "apikey", "authid", "banned", "createdAt", "updatedAt", "whitelist" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_apikey_key" ON "User"("apikey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
