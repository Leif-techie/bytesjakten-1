import { NextRequest, NextResponse } from "next/server";
import { registerSamling } from "@/lib/samling";
import { SAMLING_SERVICE_KEYS } from "@/lib/samling-constants";
import {
  OPERATORS,
  BROADBAND_OPERATORS,
  ELECTRICITY_OPERATORS,
  DATA_OPTIONS,
  BROADBAND_SPEED_OPTIONS,
  NETWORK_OPTIONS,
  BROADBAND_TECHNOLOGY_OPTIONS,
  ELECTRICITY_PRICE_TYPE_OPTIONS,
} from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const services = Array.isArray(body.services) ? body.services : [];
    const invalid = services.some(
      (s: unknown) =>
        typeof s !== "string" ||
        !SAMLING_SERVICE_KEYS.includes(
          s as (typeof SAMLING_SERVICE_KEYS)[number],
        ),
    );
    if (invalid) {
      return NextResponse.json({ error: "Ogiltig tjänst." }, { status: 400 });
    }

    if (body.mobile?.currentOperator) {
      if (!OPERATORS.includes(body.mobile.currentOperator)) {
        return NextResponse.json(
          { error: "Ogiltig mobiloperatör." },
          { status: 400 },
        );
      }
      if (
        body.mobile.minDataGB != null &&
        !DATA_OPTIONS.includes(
          Number(body.mobile.minDataGB) as (typeof DATA_OPTIONS)[number],
        )
      ) {
        return NextResponse.json(
          { error: "Ogiltigt dataval." },
          { status: 400 },
        );
      }
      if (
        body.mobile.networkPreference &&
        !NETWORK_OPTIONS.some((n) => n.value === body.mobile.networkPreference)
      ) {
        return NextResponse.json(
          { error: "Ogiltigt nätverksval." },
          { status: 400 },
        );
      }
    }

    if (body.broadband?.currentOperator) {
      if (!BROADBAND_OPERATORS.includes(body.broadband.currentOperator)) {
        return NextResponse.json(
          { error: "Ogiltig bredbandsoperatör." },
          { status: 400 },
        );
      }
      if (
        body.broadband.minSpeedMbps != null &&
        !BROADBAND_SPEED_OPTIONS.includes(
          Number(
            body.broadband.minSpeedMbps,
          ) as (typeof BROADBAND_SPEED_OPTIONS)[number],
        )
      ) {
        return NextResponse.json(
          { error: "Ogiltig hastighet." },
          { status: 400 },
        );
      }
      if (
        body.broadband.technology &&
        !BROADBAND_TECHNOLOGY_OPTIONS.some(
          (t) => t.value === body.broadband.technology,
        )
      ) {
        return NextResponse.json(
          { error: "Ogiltig teknik." },
          { status: 400 },
        );
      }
    }

    if (body.electricity?.currentOperator) {
      if (!ELECTRICITY_OPERATORS.includes(body.electricity.currentOperator)) {
        return NextResponse.json(
          { error: "Ogiltig elleverantör." },
          { status: 400 },
        );
      }
      if (
        body.electricity.priceTypePreference &&
        !ELECTRICITY_PRICE_TYPE_OPTIONS.some(
          (p) => p.value === body.electricity.priceTypePreference,
        )
      ) {
        return NextResponse.json(
          { error: "Ogiltig pristyp." },
          { status: 400 },
        );
      }
    }

    const result = await registerSamling(body);
    return NextResponse.json({
      success: true,
      registered: result.registered,
      isNew: result.isNew,
      emailSent: result.emailSent,
      message: result.isNew
        ? result.emailSent
          ? "Registrerad! Vi har skickat en bekräftelse."
          : "Registrerad! Vi mejlar dig när det är dags."
        : result.emailSent
          ? "Uppdaterat! Vi har skickat en bekräftelse."
          : "Dina påminnelser är uppdaterade.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Något gick fel. Försök igen.";
    const status =
      message.includes("måste") ||
      message.includes("Välj") ||
      message.includes("Ogiltig") ||
      message.includes("Ange") ||
      message.includes("Lägg") ||
      message.includes("Fyll")
        ? 400
        : 500;
    if (status === 500) console.error("Samling register error:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
