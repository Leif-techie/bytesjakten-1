import { db } from "./db";
import { registerUser } from "./notifications";
import { registerBroadbandUser } from "./broadband";
import { registerElectricityUser } from "./electricity";
import { sendSamlingConfirmationEmail } from "./email";
import {
  INSURANCE_SUBTYPES,
  INSPECTION_SUBTYPES,
  STREAMING_SUBTYPES,
  type ReminderCategory,
  type SamlingServiceKey,
} from "./samling-constants";

export type ReminderItemInput = {
  category: ReminderCategory;
  subtype: string;
  provider?: string;
  renewalDate?: string | null;
  objectLabel?: string | null;
  notes?: string | null;
};

export type SamlingRegisterPayload = {
  email: string;
  services: SamlingServiceKey[];
  mobile?: {
    currentOperator: string;
    contractEndDate: string;
    minDataGB: number;
    networkPreference: string;
    isStudent?: boolean;
  };
  broadband?: {
    currentOperator: string;
    contractEndDate: string;
    minSpeedMbps: number;
    technology: string;
  };
  electricity?: {
    currentOperator: string;
    contractEndDate: string;
    priceTypePreference: string;
    maxBindingMonths: number | null;
  };
  reminders?: ReminderItemInput[];
};

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function parseFutureDate(value: string, label: string): Date {
  const date = new Date(value);
  if (isNaN(date.getTime()) || date <= new Date()) {
    throw new Error(`${label} måste vara i framtiden.`);
  }
  return date;
}

function parseOptionalDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    throw new Error("Ogiltigt datum.");
  }
  return date;
}

function subtypeAllowed(
  category: ReminderCategory,
  subtype: string,
): boolean {
  if (category === "insurance") {
    return INSURANCE_SUBTYPES.some((s) => s.value === subtype);
  }
  if (category === "inspection") {
    return INSPECTION_SUBTYPES.some((s) => s.value === subtype);
  }
  return STREAMING_SUBTYPES.some((s) => s.value === subtype);
}

function reminderLabel(item: ReminderItemInput): string {
  const lists = {
    insurance: INSURANCE_SUBTYPES,
    inspection: INSPECTION_SUBTYPES,
    streaming: STREAMING_SUBTYPES,
  } as const;
  const found = lists[item.category].find((s) => s.value === item.subtype);
  const typeLabel = found?.label ?? item.subtype;
  if (item.category === "streaming") return typeLabel;
  if (item.provider?.trim()) return `${typeLabel} · ${item.provider.trim()}`;
  return typeLabel;
}

export async function registerSamling(
  payload: SamlingRegisterPayload,
): Promise<{
  registered: string[];
  isNew: boolean;
  emailSent: boolean;
}> {
  const email = payload.email.trim().toLowerCase();
  if (!email || !isValidEmail(email)) {
    throw new Error("Ogiltig e-postadress.");
  }

  const services = Array.from(new Set(payload.services ?? []));
  if (services.length === 0) {
    throw new Error("Välj minst en tjänst.");
  }

  const registered: string[] = [];
  let anyNew = false;

  if (services.includes("mobile")) {
    if (!payload.mobile?.currentOperator || !payload.mobile.contractEndDate) {
      throw new Error("Fyll i operatör och slutdatum för mobilabonnemang.");
    }
    const result = await registerUser({
      email,
      currentOperator: payload.mobile.currentOperator,
      contractEndDate: parseFutureDate(
        payload.mobile.contractEndDate,
        "Slutdatum för mobil",
      ),
      minDataGB: Number(payload.mobile.minDataGB) || 20,
      networkPreference: payload.mobile.networkPreference || "any",
      isStudent: Boolean(payload.mobile.isStudent),
      sendEmail: false,
    });
    registered.push("Mobilabonnemang");
    if (result.isNew) anyNew = true;
  }

  if (services.includes("broadband")) {
    if (
      !payload.broadband?.currentOperator ||
      !payload.broadband.contractEndDate
    ) {
      throw new Error("Fyll i operatör och slutdatum för mobilt bredband.");
    }
    const result = await registerBroadbandUser({
      email,
      currentOperator: payload.broadband.currentOperator,
      contractEndDate: parseFutureDate(
        payload.broadband.contractEndDate,
        "Slutdatum för bredband",
      ),
      minSpeedMbps: Number(payload.broadband.minSpeedMbps) || 100,
      technology: payload.broadband.technology || "any",
      sendEmail: false,
    });
    registered.push("Mobilt bredband");
    if (result.isNew) anyNew = true;
  }

  if (services.includes("electricity")) {
    if (
      !payload.electricity?.currentOperator ||
      !payload.electricity.contractEndDate
    ) {
      throw new Error("Fyll i elleverantör och slutdatum för elavtal.");
    }
    const result = await registerElectricityUser({
      email,
      currentOperator: payload.electricity.currentOperator,
      contractEndDate: parseFutureDate(
        payload.electricity.contractEndDate,
        "Slutdatum för elavtal",
      ),
      priceTypePreference: payload.electricity.priceTypePreference || "any",
      maxBindingMonths: payload.electricity.maxBindingMonths ?? null,
      sendEmail: false,
    });
    registered.push("Elavtal");
    if (result.isNew) anyNew = true;
  }

  const reminderServices = services.filter(
    (s): s is ReminderCategory =>
      s === "insurance" || s === "inspection" || s === "streaming",
  );

  if (reminderServices.length > 0) {
    const items = (payload.reminders ?? []).filter((item) =>
      reminderServices.includes(item.category),
    );
    if (items.length === 0) {
      throw new Error("Lägg till minst en rad för valda påminnelsetjänster.");
    }

    for (const item of items) {
      if (!subtypeAllowed(item.category, item.subtype)) {
        throw new Error("Ogiltig typ för påminnelse.");
      }
      if (item.category !== "streaming" && !item.provider?.trim()) {
        throw new Error("Ange bolag/leverantör för försäkring och besiktning.");
      }
      if (item.category !== "streaming" && !item.renewalDate) {
        throw new Error("Ange förnyelse- eller besiktningsdatum.");
      }

      const existing = await db.reminderSubscription.findUnique({
        where: {
          email_category_subtype: {
            email,
            category: item.category,
            subtype: item.subtype,
          },
        },
      });

      const data = {
        provider:
          item.category === "streaming"
            ? item.subtype
            : (item.provider?.trim() ?? ""),
        renewalDate: parseOptionalDate(item.renewalDate),
        objectLabel: item.objectLabel?.trim() || null,
        notes: item.notes?.trim() || null,
        active: true,
      };

      if (existing) {
        await db.reminderSubscription.update({
          where: { id: existing.id },
          data,
        });
      } else {
        await db.reminderSubscription.create({
          data: {
            email,
            category: item.category,
            subtype: item.subtype,
            ...data,
          },
        });
        anyNew = true;
      }

      registered.push(reminderLabel(item));
    }
  }

  const emailResult = await sendSamlingConfirmationEmail({
    email,
    services: registered,
    kind: anyNew ? "register" : "update",
  });

  return {
    registered,
    isNew: anyNew,
    emailSent: emailResult.success,
  };
}

export async function unsubscribeReminderByToken(
  token: string,
): Promise<boolean> {
  const row = await db.reminderSubscription.findUnique({
    where: { unsubscribeToken: token },
  });
  if (!row) return false;
  await db.reminderSubscription.update({
    where: { id: row.id },
    data: { active: false },
  });
  return true;
}

/** Avaktivera alla påminnelser/abonnemang för en e-postadress. */
export async function unsubscribeAllForEmail(email: string): Promise<void> {
  await Promise.all([
    db.user.updateMany({ where: { email }, data: { active: false } }),
    db.broadbandUser.updateMany({
      where: { email },
      data: { active: false },
    }),
    db.electricityUser.updateMany({
      where: { email },
      data: { active: false },
    }),
    db.reminderSubscription.updateMany({
      where: { email },
      data: { active: false },
    }),
  ]);
}

export async function resolveEmailFromUnsubscribeToken(
  token: string,
): Promise<string | null> {
  const user = await db.user.findUnique({
    where: { unsubscribeToken: token },
    select: { email: true },
  });
  if (user) return user.email;

  const broadband = await db.broadbandUser.findUnique({
    where: { unsubscribeToken: token },
    select: { email: true },
  });
  if (broadband) return broadband.email;

  const electricity = await db.electricityUser.findUnique({
    where: { unsubscribeToken: token },
    select: { email: true },
  });
  if (electricity) return electricity.email;

  const reminder = await db.reminderSubscription.findUnique({
    where: { unsubscribeToken: token },
    select: { email: true },
  });
  return reminder?.email ?? null;
}
