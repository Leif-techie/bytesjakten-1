import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/lib/notifications";
import { OPERATORS, DATA_OPTIONS, NETWORK_OPTIONS } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, currentOperator, contractEndDate, minDataGB, networkPreference, isStudent } =
      body;

    if (!email || !currentOperator || !contractEndDate || !minDataGB) {
      return NextResponse.json(
        { error: "Alla obligatoriska fält måste fyllas i." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Ogiltig e-postadress." }, { status: 400 });
    }

    if (!OPERATORS.includes(currentOperator)) {
      return NextResponse.json({ error: "Ogiltig operatör." }, { status: 400 });
    }

    if (!DATA_OPTIONS.includes(Number(minDataGB) as (typeof DATA_OPTIONS)[number])) {
      return NextResponse.json({ error: "Ogiltigt dataval." }, { status: 400 });
    }

    const endDate = new Date(contractEndDate);
    if (isNaN(endDate.getTime()) || endDate <= new Date()) {
      return NextResponse.json(
        { error: "Slutdatum måste vara i framtiden." },
        { status: 400 }
      );
    }

    const validNetwork = NETWORK_OPTIONS.some((n) => n.value === networkPreference);
    if (!validNetwork) {
      return NextResponse.json({ error: "Ogiltigt nätverksval." }, { status: 400 });
    }

    const result = await registerUser({
      email,
      currentOperator,
      contractEndDate: endDate,
      minDataGB: Number(minDataGB),
      networkPreference: networkPreference ?? "any",
      isStudent: Boolean(isStudent),
    });

    return NextResponse.json({
      success: true,
      userId: result.userId,
      isNew: result.isNew,
      emailSent: result.emailSent,
      message: result.isNew
        ? result.emailSent
          ? "Registrerad! Vi har skickat en bekräftelse till din e-post."
          : "Registrerad! Vi mejlar dig när det är dags att byta."
        : result.emailSent
          ? "Dina uppgifter är uppdaterade. Vi har skickat en bekräftelse till din e-post."
          : "Dina uppgifter är uppdaterade.",
    });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Något gick fel. Försök igen." },
      { status: 500 }
    );
  }
}
