import { NextRequest } from "next/server";

export function verifyAdmin(request: NextRequest): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;

  const authHeader = request.headers.get("authorization");
  if (authHeader === `Bearer ${secret}`) return true;

  const cookie = request.cookies.get("admin_session")?.value;
  return cookie === secret;
}

export function getAdminSecret(): string | undefined {
  return process.env.ADMIN_SECRET;
}
