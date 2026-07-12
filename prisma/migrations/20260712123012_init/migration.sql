-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL,
    "currentOperator" TEXT NOT NULL,
    "contractEndDate" DATETIME NOT NULL,
    "minDataGB" INTEGER NOT NULL,
    "networkPreference" TEXT NOT NULL DEFAULT 'any',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Campaign" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "operator" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataGB" INTEGER NOT NULL,
    "campaignPrice" INTEGER NOT NULL,
    "regularPrice" INTEGER NOT NULL,
    "campaignStart" DATETIME NOT NULL,
    "campaignEnd" DATETIME NOT NULL,
    "url" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'any',
    "noBinding" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "NotificationLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "sentAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "campaignId" TEXT,
    CONSTRAINT "NotificationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SystemMeta" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'singleton',
    "lastCampaignUpdate" DATETIME
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Campaign_active_dataGB_idx" ON "Campaign"("active", "dataGB");

-- CreateIndex
CREATE INDEX "NotificationLog_userId_type_idx" ON "NotificationLog"("userId", "type");
