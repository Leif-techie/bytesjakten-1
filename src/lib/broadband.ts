import { db } from "./db";
import { sendBroadbandPrefsConfirmationEmail } from "./email";

export async function registerBroadbandUser(data: {
  email: string;
  currentOperator: string;
  contractEndDate: Date;
  minSpeedMbps: number;
  technology: string;
}): Promise<{ userId: string; isNew: boolean; emailSent: boolean }> {
  const existing = await db.broadbandUser.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    const updated = await db.broadbandUser.update({
      where: { id: existing.id },
      data: {
        currentOperator: data.currentOperator,
        contractEndDate: data.contractEndDate,
        minSpeedMbps: data.minSpeedMbps,
        technology: data.technology,
        active: true,
      },
    });

    const emailResult = await sendBroadbandPrefsConfirmationEmail({
      email: updated.email,
      currentOperator: updated.currentOperator,
      contractEndDate: updated.contractEndDate,
      minSpeedMbps: updated.minSpeedMbps,
      technology: updated.technology,
      unsubscribeToken: updated.unsubscribeToken,
      kind: "update",
    });

    return {
      userId: updated.id,
      isNew: false,
      emailSent: emailResult.success,
    };
  }

  const user = await db.broadbandUser.create({
    data: {
      email: data.email,
      currentOperator: data.currentOperator,
      contractEndDate: data.contractEndDate,
      minSpeedMbps: data.minSpeedMbps,
      technology: data.technology,
    },
  });

  const emailResult = await sendBroadbandPrefsConfirmationEmail({
    email: user.email,
    currentOperator: user.currentOperator,
    contractEndDate: user.contractEndDate,
    minSpeedMbps: user.minSpeedMbps,
    technology: user.technology,
    unsubscribeToken: user.unsubscribeToken,
    kind: "register",
  });

  return {
    userId: user.id,
    isNew: true,
    emailSent: emailResult.success,
  };
}
