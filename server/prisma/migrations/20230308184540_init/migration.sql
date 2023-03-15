-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "authid" TEXT NOT NULL PRIMARY KEY,
    "plan" TEXT NOT NULL DEFAULT 'Free',
    "whitelist" TEXT NOT NULL DEFAULT '[]',
    "planExpiresAt" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "apiKey" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("apiKey", "authid", "createdAt", "plan", "planExpiresAt", "updatedAt") SELECT "apiKey", "authid", "createdAt", "plan", "planExpiresAt", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_apiKey_key" ON "User"("apiKey");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
