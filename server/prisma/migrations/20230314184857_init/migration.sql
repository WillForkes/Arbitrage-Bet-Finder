/*
  Warnings:

  - You are about to drop the `SignupDeals` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "SignupDeals";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "SignupDeal" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "deal" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "expiresAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
