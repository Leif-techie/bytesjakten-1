import { NextRequest, NextResponse } from "next/server";
import { unsubscribeUser } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const token = body.token as string | undefined;
    const all = Boolean(body.all);
    if (!token) {
      return NextResponse.json({ error: "Token saknas." }, { status: 400 });
    }

    const success = await unsubscribeUser(token, { all });
    if (!success) {
      return NextResponse.json({ error: "Ogiltig länk." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Något gick fel." }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const all = request.nextUrl.searchParams.get("all") === "1";
  if (!token) {
    return NextResponse.json({ error: "Token saknas." }, { status: 400 });
  }

  const success = await unsubscribeUser(token, { all });
  if (!success) {
    return NextResponse.json({ error: "Ogiltig länk." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
