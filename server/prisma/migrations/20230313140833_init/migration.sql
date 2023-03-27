-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "authid" TEXT NOT NULL PRIMARY KEY,
    "whitelist" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "region" TEXT NOT NULL DEFAULT 'UK',
    "phone" TEXT,
    "discordWebhook" TEXT,
    "smsNotifcations" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "discordNotifications" BOOLEAN NOT NULL DEFAULT false,
    "apikey" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("apikey", "authid", "banned", "createdAt", "discordNotifications", "discordWebhook", "emailNotifications", "phone", "smsNotifcations", "updatedAt", "whitelist") SELECT "apikey", "authid", "banned", "createdAt", "discordNotifications", "discordWebhook", "emailNotifications", "phone", "smsNotifcations", "updatedAt", "whitelist" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_apikey_key" ON "User"("apikey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
