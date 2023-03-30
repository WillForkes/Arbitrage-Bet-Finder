-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Payments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "amount" REAL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("authid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Payments" ("createdAt", "id", "status", "stripePaymentId", "updatedAt", "userId") SELECT "createdAt", "id", "status", "stripePaymentId", "updatedAt", "userId" FROM "Payments";
DROP TABLE "Payments";
ALTER TABLE "new_Payments" RENAME TO "Payments";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
