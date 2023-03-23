-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlacedBets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'arbitrage',
    "status" INTEGER NOT NULL DEFAULT 0,
    "matchName" TEXT NOT NULL,
    "totalStake" REAL NOT NULL,
    "profitPercentage" REAL NOT NULL,
    "bookmakers" TEXT NOT NULL DEFAULT '[]',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlacedBets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("authid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlacedBets" ("bookmakers", "createdAt", "id", "matchName", "profitPercentage", "totalStake", "type", "updatedAt", "userId") SELECT "bookmakers", "createdAt", "id", "matchName", "profitPercentage", "totalStake", "type", "updatedAt", "userId" FROM "PlacedBets";
DROP TABLE "PlacedBets";
ALTER TABLE "new_PlacedBets" RENAME TO "PlacedBets";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
