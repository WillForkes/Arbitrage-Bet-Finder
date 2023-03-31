/*
  Warnings:

  - Added the required column `profitPercentage` to the `PlacedBets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stake` to the `PlacedBets` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PlacedBets" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "betId" INTEGER NOT NULL,
    "stake" REAL NOT NULL,
    "profitPercentage" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "PlacedBets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("authid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PlacedBets_betId_fkey" FOREIGN KEY ("betId") REFERENCES "Bet" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PlacedBets" ("betId", "createdAt", "id", "updatedAt", "userId") SELECT "betId", "createdAt", "id", "updatedAt", "userId" FROM "PlacedBets";
DROP TABLE "PlacedBets";
ALTER TABLE "new_PlacedBets" RENAME TO "PlacedBets";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
