-- CreateTable
CREATE TABLE "BroadbandUser" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "currentOperator" TEXT NOT NULL,
    "contractEndDate" TIMESTAMP(3) NOT NULL,
    "minSpeedMbps" INTEGER NOT NULL,
    "technology" TEXT NOT NULL DEFAULT 'any',
    "unsubscribeToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BroadbandUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BroadbandUser_email_key" ON "BroadbandUser"("email");

-- CreateIndex
CREATE UNIQUE INDEX "BroadbandUser_unsubscribeToken_key" ON "BroadbandUser"("unsubscribeToken");
