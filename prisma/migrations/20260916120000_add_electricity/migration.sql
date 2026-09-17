-- CreateTable
CREATE TABLE "ElectricityUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "currentOperator" TEXT NOT NULL,
    "contractEndDate" TIMESTAMP(3) NOT NULL,
    "priceTypePreference" TEXT NOT NULL DEFAULT 'any',
    "maxBindingMonths" INTEGER,
    "unsubscribeToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ElectricityUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ElectricityCampaign" (
    "id" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priceType" TEXT NOT NULL,
    "bindingMonths" INTEGER NOT NULL DEFAULT 0,
    "campaignPrice" INTEGER NOT NULL,
    "regularPrice" INTEGER NOT NULL,
    "campaignStart" TIMESTAMP(3) NOT NULL,
    "campaignEnd" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ElectricityCampaign_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "NotificationLog" ADD COLUMN "electricityUserId" TEXT;
ALTER TABLE "NotificationLog" ADD COLUMN "electricityCampaignId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ElectricityUser_email_key" ON "ElectricityUser"("email");
CREATE UNIQUE INDEX "ElectricityUser_unsubscribeToken_key" ON "ElectricityUser"("unsubscribeToken");
CREATE INDEX "ElectricityCampaign_active_priceType_idx" ON "ElectricityCampaign"("active", "priceType");
CREATE INDEX "ElectricityCampaign_active_bindingMonths_idx" ON "ElectricityCampaign"("active", "bindingMonths");
CREATE INDEX "NotificationLog_electricityUserId_type_idx" ON "NotificationLog"("electricityUserId", "type");

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_electricityUserId_fkey" FOREIGN KEY ("electricityUserId") REFERENCES "ElectricityUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
