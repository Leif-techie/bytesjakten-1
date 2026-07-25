import { NextRequest, NextResponse } from "next/server";
import { completeSwitch, getUserByToken } from "@/lib/admin";
import { OPERATORS } from "@/lib/constants";

export const runtime = "nodejs";

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
    minDataGB: user.minDataGB,
    networkPreference: user.networkPreference,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, currentOperator, contractEndDate } = body;

    if (!token || !currentOperator || !contractEndDate) {
      return NextResponse.json(
        { error: "Alla fält måste fyllas i." },
        { status: 400 }
      );
    }

    if (!OPERATORS.includes(currentOperator)) {
      return NextResponse.json({ error: "Ogiltig operatör." }, { status: 400 });
    }

    const endDate = new Date(contractEndDate);
    if (isNaN(endDate.getTime()) || endDate <= new Date()) {
      return NextResponse.json(
        { error: "Påminnelsedatum måste vara i framtiden." },
        { status: 400 }
      );
    }

    const result = await completeSwitch({
      token,
      currentOperator,
      contractEndDate: endDate,
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
        "Tack! Vi har sparat ditt nya datum och skickar en påminnelse innan det är dags att byta igen.",
    });
  } catch (error) {
    console.error("Switch complete error:", error);
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 });
  }
}
