-- CreateTable
CREATE TABLE "SignupDeal" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "deal" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignupDeal_pkey" PRIMARY KEY ("id")
);
