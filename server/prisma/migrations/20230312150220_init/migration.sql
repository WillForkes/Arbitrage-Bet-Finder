/*
  Warnings:

  - Made the column `amount` on table `Payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripeCustomerId` on table `Payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripePaymentId` on table `Payments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `stripeSubscriptionId` on table `Payments` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "stripePaymentId" TEXT NOT NULL,
    "stripeCustomerId" TEXT NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "amount" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("authid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payments" ("amount", "createdAt", "id", "status", "stripeCustomerId", "stripePaymentId", "stripeSubscriptionId", "updatedAt", "userId") SELECT "amount", "createdAt", "id", "status", "stripeCustomerId", "stripePaymentId", "stripeSubscriptionId", "updatedAt", "userId" FROM "Payments";
DROP TABLE "Payments";
ALTER TABLE "new_Payments" RENAME TO "Payments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
