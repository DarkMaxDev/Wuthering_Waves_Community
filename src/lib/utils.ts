import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

/** Convierte documentos de Mongoose (.lean()) a JSON plano serializable. */
export const plain = <T,>(doc: T): T => JSON.parse(JSON.stringify(doc));

export const fmtDate = (d: string | Date) =>
  new Date(d).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
