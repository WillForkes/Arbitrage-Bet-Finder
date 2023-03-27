/*
  Warnings:

  - You are about to drop the column `apiKey` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "authid" TEXT NOT NULL PRIMARY KEY,
    "plan" TEXT NOT NULL DEFAULT 'Free',
    "whitelist" TEXT NOT NULL DEFAULT '[]',
    "planExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "apikey" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("authid", "banned", "createdAt", "plan", "planExpiresAt", "updatedAt", "whitelist") SELECT "authid", "banned", "createdAt", "plan", "planExpiresAt", "updatedAt", "whitelist" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_apikey_key" ON "User"("apikey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
