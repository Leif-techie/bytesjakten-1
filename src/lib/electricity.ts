import { db } from "./db";
import { sendElectricityPrefsConfirmationEmail } from "./email";

export async function registerElectricityUser(data: {
  email: string;
  currentOperator: string;
  contractEndDate: Date;
  priceTypePreference: string;
  maxBindingMonths: number | null;
}): Promise<{ userId: string; isNew: boolean; emailSent: boolean }> {
  const existing = await db.electricityUser.findUnique({
    where: { email: data.email },
  });

  if (existing) {
    const updated = await db.electricityUser.update({
      where: { id: existing.id },
      data: {
        currentOperator: data.currentOperator,
        contractEndDate: data.contractEndDate,
        priceTypePreference: data.priceTypePreference,
        maxBindingMonths: data.maxBindingMonths,
        active: true,
      },
    });

    const emailResult = await sendElectricityPrefsConfirmationEmail({
      email: updated.email,
      currentOperator: updated.currentOperator,
      contractEndDate: updated.contractEndDate,
      priceTypePreference: updated.priceTypePreference,
      maxBindingMonths: updated.maxBindingMonths,
      unsubscribeToken: updated.unsubscribeToken,
      kind: "update",
    });

    return {
      userId: updated.id,
      isNew: false,
      emailSent: emailResult.success,
    };
  }

  const user = await db.electricityUser.create({
    data: {
      email: data.email,
      currentOperator: data.currentOperator,
      contractEndDate: data.contractEndDate,
      priceTypePreference: data.priceTypePreference,
      maxBindingMonths: data.maxBindingMonths,
    },
  });

  const emailResult = await sendElectricityPrefsConfirmationEmail({
    email: user.email,
    currentOperator: user.currentOperator,
    contractEndDate: user.contractEndDate,
    priceTypePreference: user.priceTypePreference,
    maxBindingMonths: user.maxBindingMonths,
    unsubscribeToken: user.unsubscribeToken,
    kind: "register",
  });

  return {
    userId: user.id,
    isNew: true,
    emailSent: emailResult.success,
  };
}
