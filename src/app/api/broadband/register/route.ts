import { NextRequest, NextResponse } from "next/server";
import { registerBroadbandUser } from "@/lib/broadband";
import {
  BROADBAND_OPERATORS,
  BROADBAND_SPEED_OPTIONS,
  BROADBAND_TECHNOLOGY_OPTIONS,
} from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      email,
      currentOperator,
      contractEndDate,
      minSpeedMbps,
      technology,
    } = body;

    if (!email || !currentOperator || !contractEndDate || !minSpeedMbps) {
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
      !BROADBAND_OPERATORS.includes(
        currentOperator as (typeof BROADBAND_OPERATORS)[number]
      )
    ) {
      return NextResponse.json({ error: "Ogiltig operatör." }, { status: 400 });
    }

    if (
      !BROADBAND_SPEED_OPTIONS.includes(
        Number(minSpeedMbps) as (typeof BROADBAND_SPEED_OPTIONS)[number]
      )
    ) {
      return NextResponse.json({ error: "Ogiltigt hastighetsval." }, { status: 400 });
    }

    const validTechnology = BROADBAND_TECHNOLOGY_OPTIONS.some(
      (opt) => opt.value === (technology ?? "any")
    );
    if (!validTechnology) {
      return NextResponse.json({ error: "Ogiltigt nätval." }, { status: 400 });
    }

    const endDate = new Date(contractEndDate);
    if (isNaN(endDate.getTime()) || endDate <= new Date()) {
      return NextResponse.json(
        { error: "Slutdatum måste vara i framtiden." },
        { status: 400 }
      );
    }

    const result = await registerBroadbandUser({
      email,
      currentOperator,
      contractEndDate: endDate,
      minSpeedMbps: Number(minSpeedMbps),
      technology: technology ?? "any",
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
    console.error("Broadband register error:", error);
    return NextResponse.json(
      { error: "Något gick fel. Försök igen." },
      { status: 500 }
    );
  }
}
