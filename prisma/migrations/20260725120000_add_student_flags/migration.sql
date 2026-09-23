-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isStudent" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN IF NOT EXISTS "isStudent" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Campaign_active_isStudent_idx" ON "Campaign"("active", "isStudent");
