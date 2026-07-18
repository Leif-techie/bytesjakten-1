import { NextRequest, NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { OPERATORS } from "@/lib/constants";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    operator,
    name,
    dataGB,
    campaignPrice,
    regularPrice,
    campaignStart,
    campaignEnd,
    url,
    network,
  } = body;

  if (!operator || !name || !dataGB || !campaignPrice || !regularPrice || !url) {
    return NextResponse.json({ error: "Fyll i alla obligatoriska fält." }, { status: 400 });
  }

  const affiliateUrl = String(url).trim();
  if (!/^https?:\/\//i.test(affiliateUrl)) {
    return NextResponse.json(
      { error: "Affiliatelänken måste börja med http:// eller https://." },
      { status: 400 }
    );
  }

  if (!OPERATORS.includes(operator)) {
    return NextResponse.json({ error: "Ogiltig operatör." }, { status: 400 });
  }

  const now = new Date();
  const start = new Date(campaignStart);
  const end = new Date(campaignEnd);

  const campaign = await db.campaign.create({
    data: {
      operator,
      name,
      dataGB: Number(dataGB),
      campaignPrice: Number(campaignPrice),
      regularPrice: Number(regularPrice),
      campaignStart: start,
      campaignEnd: end,
      url: affiliateUrl,
      network: network ?? "any",
      noBinding: true,
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

  const campaign = await db.campaign.update({
    where: { id },
    data: {
      ...(data.operator && { operator: data.operator }),
      ...(data.name && { name: data.name }),
      ...(data.dataGB !== undefined && { dataGB: Number(data.dataGB) }),
      ...(data.campaignPrice !== undefined && { campaignPrice: Number(data.campaignPrice) }),
      ...(data.regularPrice !== undefined && { regularPrice: Number(data.regularPrice) }),
      ...(data.campaignStart && { campaignStart: new Date(data.campaignStart) }),
      ...(data.campaignEnd && { campaignEnd: new Date(data.campaignEnd) }),
      ...(data.url && { url: data.url }),
      ...(data.network && { network: data.network }),
      ...(data.active !== undefined && { active: Boolean(data.active) }),
    },
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

  await db.campaign.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
