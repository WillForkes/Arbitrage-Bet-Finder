/*
  Warnings:

  - You are about to drop the column `name` on the `Bookmaker` table. All the data in the column will be lost.
  - Added the required column `bookName` to the `Bookmaker` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Bookmaker" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "bookName" TEXT NOT NULL
);
INSERT INTO "new_Bookmaker" ("id") SELECT "id" FROM "Bookmaker";
DROP TABLE "Bookmaker";
ALTER TABLE "new_Bookmaker" RENAME TO "Bookmaker";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
