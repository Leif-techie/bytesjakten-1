import { NextRequest, NextResponse } from "next/server";
import { getAdminSecret } from "@/lib/admin-auth";

export async function POST(request: NextRequest) {
  const secret = getAdminSecret();
  if (!secret) {
    return NextResponse.json(
      { error: "ADMIN_SECRET är inte konfigurerat." },
      { status: 503 }
    );
  }

  const { password } = await request.json();
  if (password !== secret) {
    return NextResponse.json({ error: "Fel lösenord." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("admin_session", secret, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ success: true });
  response.cookies.delete("admin_session");
  return response;
}
