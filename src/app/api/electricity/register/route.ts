import { NextRequest, NextResponse } from "next/server";
import { registerElectricityUser } from "@/lib/electricity";
import {
  ELECTRICITY_OPERATORS,
  ELECTRICITY_PRICE_TYPE_OPTIONS,
  ELECTRICITY_BINDING_OPTIONS,
} from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      currentOperator,
      contractEndDate,
      priceTypePreference,
      maxBindingMonths,
    } = body;

    if (!email || !currentOperator || !contractEndDate) {
      return NextResponse.json(
        { error: "Alla obligatoriska fält måste fyllas i." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Ogiltig e-postadress." }, { status: 400 });
    }

    if (
      !ELECTRICITY_OPERATORS.includes(
        currentOperator as (typeof ELECTRICITY_OPERATORS)[number]
      )
    ) {
      return NextResponse.json(
        { error: "Ogiltig elleverantör." },
        { status: 400 }
      );
    }

    const priceType = priceTypePreference ?? "any";
    if (
      !ELECTRICITY_PRICE_TYPE_OPTIONS.some((opt) => opt.value === priceType)
    ) {
      return NextResponse.json({ error: "Ogiltig pristyp." }, { status: 400 });
    }

    let binding: number | null = null;
    if (maxBindingMonths === null || maxBindingMonths === undefined || maxBindingMonths === "any") {
      binding = null;
    } else {
      const n = Number(maxBindingMonths);
      const valid = ELECTRICITY_BINDING_OPTIONS.some(
        (opt) => opt.months === n || (opt.value === String(n) && opt.months !== null)
      );
      if (!valid && !(n === 0 || n === 12 || n === 24 || n === 36)) {
        return NextResponse.json(
          { error: "Ogiltig bindningstid." },
          { status: 400 }
        );
      }
      binding = n;
    }

    const endDate = new Date(contractEndDate);
    if (isNaN(endDate.getTime()) || endDate <= new Date()) {
      return NextResponse.json(
        { error: "Slutdatum måste vara i framtiden." },
        { status: 400 }
      );
    }

    const result = await registerElectricityUser({
      email,
      currentOperator,
      contractEndDate: endDate,
      priceTypePreference: priceType,
      maxBindingMonths: binding,
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
    console.error("Electricity register error:", error);
    return NextResponse.json(
      { error: "Något gick fel. Försök igen." },
      { status: 500 }
    );
  }
}
