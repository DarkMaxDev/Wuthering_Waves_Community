import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { getSession } from "./auth";

export const json = (data: unknown, status = 200) => NextResponse.json(data, { status });
export const fail = (message: string, status = 400) => NextResponse.json({ error: message }, { status });

/** Envuelve un handler: captura errores de validación Zod y fallos inesperados. */
export function handle<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
  return async (...args: A): Promise<Response> => {
    try {
      return await fn(...args);
    } catch (e) {
      if (e instanceof ZodError) return fail(e.issues[0]?.message ?? "Datos inválidos", 422);
      console.error(e);
      return fail("Error interno del servidor", 500);
    }
  };
}

/** Exige sesión; devuelve [user, null] o [null, respuesta 401]. */
export async function requireUser() {
  const user = await getSession();
  return user ? ([user, null] as const) : ([null, fail("No autenticado", 401)] as const);
}

/** Exige rol admin; devuelve [user, null] o [null, respuesta 401/403]. */
export async function requireAdmin() {
  const user = await getSession();
  if (!user) return [null, fail("No autenticado", 401)] as const;
  if (user.role !== "admin") return [null, fail("Solo administradores", 403)] as const;
  return [user, null] as const;
}
