-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bet" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "type" TEXT NOT NULL DEFAULT 'arbitrage',
    "data" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Bet" ("createdAt", "data", "id", "type", "updatedAt") SELECT "createdAt", "data", "id", "type", "updatedAt" FROM "Bet";
DROP TABLE "Bet";
ALTER TABLE "new_Bet" RENAME TO "Bet";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;