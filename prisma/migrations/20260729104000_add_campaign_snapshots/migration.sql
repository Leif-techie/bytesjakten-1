CREATE TABLE "CampaignSnapshot" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT,
    "operator" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "dataGB" INTEGER NOT NULL,
    "campaignPrice" INTEGER NOT NULL,
    "regularPrice" INTEGER NOT NULL,
    "campaignStart" TIMESTAMP(3) NOT NULL,
    "campaignEnd" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "network" TEXT NOT NULL DEFAULT 'any',
    "noBinding" BOOLEAN NOT NULL DEFAULT true,
    "isStudent" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "source" TEXT NOT NULL,
    "capturedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CampaignSnapshot_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "CampaignSnapshot_operator_capturedAt_idx" ON "CampaignSnapshot"("operator", "capturedAt");
CREATE INDEX "CampaignSnapshot_isStudent_capturedAt_idx" ON "CampaignSnapshot"("isStudent", "capturedAt");
CREATE INDEX "CampaignSnapshot_campaignId_capturedAt_idx" ON "CampaignSnapshot"("campaignId", "capturedAt");

ALTER TABLE "CampaignSnapshot"
ADD CONSTRAINT "CampaignSnapshot_campaignId_fkey"
FOREIGN KEY ("campaignId") REFERENCES "Campaign"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
