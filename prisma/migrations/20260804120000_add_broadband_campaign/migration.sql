-- CreateTable
CREATE TABLE "BroadbandCampaign" (
    "id" TEXT NOT NULL,
    "operator" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "speedMbps" INTEGER NOT NULL,
    "campaignPrice" INTEGER NOT NULL,
    "regularPrice" INTEGER NOT NULL,
    "campaignStart" TIMESTAMP(3) NOT NULL,
    "campaignEnd" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "technology" TEXT NOT NULL DEFAULT '5g',
    "noBinding" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BroadbandCampaign_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BroadbandCampaign_active_speedMbps_idx" ON "BroadbandCampaign"("active", "speedMbps");

-- AlterTable
ALTER TABLE "NotificationLog" ALTER COLUMN "userId" DROP NOT NULL;
ALTER TABLE "NotificationLog" ADD COLUMN "broadbandUserId" TEXT;
ALTER TABLE "NotificationLog" ADD COLUMN "broadbandCampaignId" TEXT;

-- CreateIndex
CREATE INDEX "NotificationLog_broadbandUserId_type_idx" ON "NotificationLog"("broadbandUserId", "type");

-- AddForeignKey
ALTER TABLE "NotificationLog" ADD CONSTRAINT "NotificationLog_broadbandUserId_fkey" FOREIGN KEY ("broadbandUserId") REFERENCES "BroadbandUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;
