import { NextRequest, NextResponse } from "next/server";
import { unsubscribeUser } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ error: "Token saknas." }, { status: 400 });
    }

    const success = await unsubscribeUser(token);
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
  if (!token) {
    return NextResponse.json({ error: "Token saknas." }, { status: 400 });
  }

  const success = await unsubscribeUser(token);
  if (!success) {
    return NextResponse.json({ error: "Ogiltig länk." }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
