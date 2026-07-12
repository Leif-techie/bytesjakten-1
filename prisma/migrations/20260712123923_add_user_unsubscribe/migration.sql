-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "currentOperator" TEXT NOT NULL,
    "contractEndDate" DATETIME NOT NULL,
    "minDataGB" INTEGER NOT NULL,
    "networkPreference" TEXT NOT NULL DEFAULT 'any',
    "unsubscribeToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("contractEndDate", "createdAt", "currentOperator", "email", "id", "minDataGB", "networkPreference", "updatedAt", "unsubscribeToken", "active")
SELECT "contractEndDate", "createdAt", "currentOperator", "email", "id", "minDataGB", "networkPreference", "updatedAt", lower(hex(randomblob(16))), 1 FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_unsubscribeToken_key" ON "User"("unsubscribeToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
