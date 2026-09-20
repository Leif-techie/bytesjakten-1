-- CreateTable
CREATE TABLE "ReminderSubscription" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subtype" TEXT NOT NULL,
    "provider" TEXT NOT NULL DEFAULT '',
    "renewalDate" TIMESTAMP(3),
    "objectLabel" TEXT,
    "notes" TEXT,
    "unsubscribeToken" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReminderSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReminderSubscription_unsubscribeToken_key" ON "ReminderSubscription"("unsubscribeToken");

-- CreateIndex
CREATE INDEX "ReminderSubscription_email_active_idx" ON "ReminderSubscription"("email", "active");

-- CreateIndex
CREATE INDEX "ReminderSubscription_renewalDate_active_idx" ON "ReminderSubscription"("renewalDate", "active");

-- CreateIndex
CREATE UNIQUE INDEX "ReminderSubscription_email_category_subtype_key" ON "ReminderSubscription"("email", "category", "subtype");
