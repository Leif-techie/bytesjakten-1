import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import {
  ELECTRICITY_OPERATORS,
  ELECTRICITY_PRICE_TYPE_OPTIONS,
} from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    operator,
    name,
    priceType,
    bindingMonths,
    campaignPrice,
    regularPrice,
    campaignStart,
    campaignEnd,
    url,
  } = body;

  if (
    !operator ||
    !name ||
    !priceType ||
    campaignPrice === undefined ||
    regularPrice === undefined ||
    !url
  ) {
    return NextResponse.json(
      { error: "Fyll i alla obligatoriska fält." },
      { status: 400 }
    );
  }

  const affiliateUrl = String(url).trim();
  if (!/^https?:\/\//i.test(affiliateUrl)) {
    return NextResponse.json(
      { error: "Affiliatelänken måste börja med http:// eller https://." },
      { status: 400 }
    );
  }

  if (
    !ELECTRICITY_OPERATORS.includes(
      operator as (typeof ELECTRICITY_OPERATORS)[number]
    )
  ) {
    return NextResponse.json({ error: "Ogiltig elleverantör." }, { status: 400 });
  }

  if (!ELECTRICITY_PRICE_TYPE_OPTIONS.some((o) => o.value === priceType) || priceType === "any") {
    return NextResponse.json({ error: "Ogiltig pristyp." }, { status: 400 });
  }

  const binding = Number(bindingMonths ?? 0);
  if (!Number.isFinite(binding) || binding < 0) {
    return NextResponse.json({ error: "Ogiltig bindningstid." }, { status: 400 });
  }

  const now = new Date();
  const start = new Date(campaignStart);
  const end = new Date(campaignEnd);

  const campaign = await db.electricityCampaign.create({
    data: {
      operator,
      name,
      priceType,
      bindingMonths: binding,
      campaignPrice: Number(campaignPrice),
      regularPrice: Number(regularPrice),
      campaignStart: start,
      campaignEnd: end,
      url: affiliateUrl,
      active: now >= start && now <= end,
    },
  });

  return NextResponse.json({ campaign });
}

export async function PATCH(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, ...data } = body;

  if (!id) {
    return NextResponse.json({ error: "ID saknas." }, { status: 400 });
  }

  if (data.url !== undefined) {
    const affiliateUrl = String(data.url).trim();
    if (!affiliateUrl || !/^https?:\/\//i.test(affiliateUrl)) {
      return NextResponse.json(
        { error: "Affiliatelänken måste börja med http:// eller https://." },
        { status: 400 }
      );
    }
    data.url = affiliateUrl;
  }

  if (data.campaignStart) data.campaignStart = new Date(data.campaignStart);
  if (data.campaignEnd) data.campaignEnd = new Date(data.campaignEnd);
  if (data.campaignPrice !== undefined) data.campaignPrice = Number(data.campaignPrice);
  if (data.regularPrice !== undefined) data.regularPrice = Number(data.regularPrice);
  if (data.bindingMonths !== undefined) data.bindingMonths = Number(data.bindingMonths);

  const campaign = await db.electricityCampaign.update({
    where: { id },
    data,
  });

  return NextResponse.json({ campaign });
}

export async function DELETE(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "ID saknas." }, { status: 400 });
  }

  await db.electricityCampaign.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
