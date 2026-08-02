import { NextRequest, NextResponse } from "next/server";
import { completeSwitch, getUserByToken } from "@/lib/admin";
import { OPERATORS } from "@/lib/constants";

export const runtime = "nodejs";

const ALLOWED_LENGTHS = [3, 4, 5, 6] as const;

function addMonths(date: Date, months: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + months);
  return d;
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Token saknas." }, { status: 400 });
  }

  const user = await getUserByToken(token);
  if (!user) {
    return NextResponse.json({ error: "Ogiltig länk." }, { status: 404 });
  }

  return NextResponse.json({
    email: user.email,
    currentOperator: user.currentOperator,
    contractEndDate: user.contractEndDate.toISOString().slice(0, 10),
    campaignStartDate: user.campaignStartDate
      ? user.campaignStartDate.toISOString().slice(0, 10)
      : null,
    campaignLengthMonths: user.campaignLengthMonths,
    minDataGB: user.minDataGB,
    networkPreference: user.networkPreference,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, currentOperator, campaignStartDate, campaignLengthMonths } =
      body;

    if (
      !token ||
      !currentOperator ||
      !campaignStartDate ||
      campaignLengthMonths == null
    ) {
      return NextResponse.json(
        { error: "Alla fält måste fyllas i." },
        { status: 400 }
      );
    }

    if (!OPERATORS.includes(currentOperator)) {
      return NextResponse.json({ error: "Ogiltig operatör." }, { status: 400 });
    }

    const length = Number(campaignLengthMonths);
    if (!ALLOWED_LENGTHS.includes(length as (typeof ALLOWED_LENGTHS)[number])) {
      return NextResponse.json(
        { error: "Ogiltig kampanjlängd." },
        { status: 400 }
      );
    }

    const startDate = new Date(campaignStartDate);
    if (isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: "Ogiltigt datum för nummerflytt." },
        { status: 400 }
      );
    }

    const endDate = addMonths(startDate, length);
    if (endDate <= new Date()) {
      return NextResponse.json(
        {
          error:
            "Kampanjens slutdatum måste vara i framtiden. Kontrollera startdatum och längd.",
        },
        { status: 400 }
      );
    }

    const result = await completeSwitch({
      token,
      currentOperator,
      contractEndDate: endDate,
      campaignStartDate: startDate,
      campaignLengthMonths: length,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error ?? "Kunde inte spara." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Tack! Vi har sparat kampanjens slutdatum och skickar en påminnelse innan det är dags att byta igen.",
      contractEndDate: endDate.toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("Switch complete error:", error);
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 });
  }
}
