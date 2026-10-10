import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { connectDB } from "./db";
import User from "@/models/User";

export const COOKIE_NAME = "wuwa_token";
const DAYS = () => Number(process.env.JWT_EXPIRES_DAYS ?? 7);
const secret = () => {
  const s = process.env.JWT_SECRET ?? "";
  if (s.length < 16) throw new Error("JWT_SECRET ausente o demasiado corto");
  return s;
};

export type SessionUser = { id: string; username: string; role: "user" | "admin" };

export const signToken = (user: SessionUser) =>
  jwt.sign(user, secret(), { expiresIn: `${DAYS()}d` });

/** Guarda el JWT en una cookie HTTP-only (inaccesible desde JS del navegador). */
export async function setAuthCookie(token: string) {
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: DAYS() * 86400,
  });
}

export async function clearAuthCookie() {
  (await cookies()).delete(COOKIE_NAME);
}

/** Usuario de la sesión actual (o null). Úsalo en rutas API y Server Components. */
export async function getSession(): Promise<SessionUser | null> {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  try {
    const p = jwt.verify(token, secret()) as SessionUser;
    await connectDB();
    // El rol se lee de la BD (no del token) para que los cambios de rol apliquen al instante
    const u = await User.findById(p.id).select("username role").lean<{ username: string; role: "user" | "admin" }>();
    return u ? { id: p.id, username: u.username, role: u.role } : null;
  } catch {
    return null;
  }
}
