/*
  Warnings:

  - A unique constraint covering the columns `[afilliateCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "afilliateCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_afilliateCode_key" ON "User"("afilliateCode");
