/*
  Warnings:

  - You are about to drop the column `discordNotifications` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `discordWebhook` on the `User` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "authid" TEXT NOT NULL PRIMARY KEY,
    "whitelist" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "region" TEXT DEFAULT 'UK',
    "phone" TEXT,
    "email" TEXT,
    "smsNotifcations" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "apikey" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("apikey", "authid", "banned", "createdAt", "emailNotifications", "phone", "region", "smsNotifcations", "updatedAt", "whitelist") SELECT "apikey", "authid", "banned", "createdAt", "emailNotifications", "phone", "region", "smsNotifcations", "updatedAt", "whitelist" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_apikey_key" ON "User"("apikey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
