/*
  Warnings:

  - A unique constraint covering the columns `[bookName]` on the table `Bookmaker` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Bookmaker_bookName_key" ON "Bookmaker"("bookName");
