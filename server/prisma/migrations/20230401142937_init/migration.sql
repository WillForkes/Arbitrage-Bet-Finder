-- CreateTable
CREATE TABLE "User" (
    "authid" TEXT NOT NULL,
    "whitelist" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "region" TEXT DEFAULT 'UK',
    "phone" TEXT,
    "email" TEXT,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT false,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT false,
    "apikey" TEXT,
    "banned" BOOLEAN NOT NULL DEFAULT false,
    "staff" BOOLEAN NOT NULL DEFAULT false,
    "trialActivated" BOOLEAN NOT NULL DEFAULT false,
    "promotions" BOOLEAN NOT NULL DEFAULT true,
    "afilliateCode" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("authid")
);

-- CreateTable
CREATE TABLE "Bet" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'arbitrage',
    "data" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlacedBets" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'arbitrage',
    "status" INTEGER NOT NULL DEFAULT 0,
    "matchName" TEXT NOT NULL,
    "totalStake" DOUBLE PRECISION NOT NULL,
    "profitPercentage" DOUBLE PRECISION NOT NULL,
    "bookmakers" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlacedBets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "planExpiresAt" TIMESTAMP(3) NOT NULL,
    "stripePaymentId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripeCustomerId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'inactive',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "id" SERIAL NOT NULL,
    "stripeSubscriptionId" TEXT NOT NULL,
    "stripeInvoiceId" TEXT NOT NULL,
    "stripeInvoicePdfUrl" TEXT,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SignupDeal" (
    "id" SERIAL NOT NULL,
    "deal" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SignupDeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bookmaker" (
    "id" SERIAL NOT NULL,
    "bookName" TEXT NOT NULL,

    CONSTRAINT "Bookmaker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_apikey_key" ON "User"("apikey");

-- CreateIndex
CREATE UNIQUE INDEX "User_afilliateCode_key" ON "User"("afilliateCode");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripePaymentId_key" ON "Subscription"("stripePaymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmaker_bookName_key" ON "Bookmaker"("bookName");

-- AddForeignKey
ALTER TABLE "PlacedBets" ADD CONSTRAINT "PlacedBets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("authid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("authid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_stripeSubscriptionId_fkey" FOREIGN KEY ("stripeSubscriptionId") REFERENCES "Subscription"("stripeSubscriptionId") ON DELETE RESTRICT ON UPDATE CASCADE;
