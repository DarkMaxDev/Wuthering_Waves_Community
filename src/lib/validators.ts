import { z } from "zod";

const objectId = z.string().regex(/^[a-f\d]{24}$/i, "ID inválido");

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, "Usuario: mínimo 3 caracteres")
    .max(24)
    .regex(/^[\w-]+$/, "Usuario: solo letras, números, _ y -"),
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  password: z.string().min(8, "Contraseña: mínimo 8 caracteres").max(72),
});
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña").max(72),
});
export const buildSchema = z.object({
  character: objectId,
  title: z.string().trim().min(3, "Título: mínimo 3 caracteres").max(80),
  description: z.string().trim().max(1000).default(""),
  echoSets: z
    .array(
      z.object({
        name: z.string().trim().min(2).max(60),
        pieces: z.enum(["2", "3", "5"]),
      }),
    )
    .min(1)
    .max(3),
  mainStats: z.object({
    cost4: z.string().trim().max(40),
    cost3: z.string().trim().max(40),
    cost1: z.string().trim().max(40),
  }),
  subStats: z
    .array(z.string().trim().min(2).max(40))
    .min(1, "Agrega al menos una sub-stat")
    .max(8),
  weapon: z.string().trim().max(60).default(""),
});
export const commentSchema = z.object({
  targetType: z.enum(["build", "post"]),
  target: objectId,
  body: z.string().trim().min(2, "Comentario demasiado corto").max(1500),
});
export const postSchema = z.object({
  kind: z.enum(["news", "question"]),
  title: z.string().trim().min(5, "Título: mínimo 5 caracteres").max(120),
  body: z.string().trim().min(10, "Contenido: mínimo 10 caracteres").max(8000),
  category: z.string().trim().max(30).default("general"),
});

export const ELEMENTS = [
  "Fusion",
  "Glacio",
  "Electro",
  "Aero",
  "Spectro",
  "Havoc",
] as const;
export const WEAPONS = [
  "Broadblade",
  "Sword",
  "Pistols",
  "Gauntlets",
  "Rectifier",
] as const;
export const ROLES = ["Main DPS", "Sub-DPS", "Healer / Support"] as const;

export const roleSchema = z.object({ role: z.enum(["user", "admin"]) });
export const characterSchema = z.object({
  name: z.string().trim().min(2, "Nombre: mínimo 2 caracteres").max(40),
  rarity: z.coerce.number().int().min(4).max(5),
  element: z.enum(ELEMENTS),
  weaponType: z.enum(WEAPONS),
  role: z.enum(ROLES),
  description: z.string().trim().max(600).default(""),
  imageUrl: z
    .string()
    .trim()
    .max(500)
    .refine(
      (v) => v === "" || /^https?:\/\//i.test(v),
      "La imagen debe ser una URL que empiece con http:// o https://",
    )
    .default(""),
  keyStats: z
    .array(
      z.object({
        stat: z.string().trim().min(2).max(40),
        priority: z.coerce
          .number()
          .int()
          .min(1, "Prioridad: 1 a 5")
          .max(5, "Prioridad: 1 a 5"),
        note: z.string().trim().max(80).default(""),
      }),
    )
    .min(1, "Agrega al menos un atributo")
    .max(8),
});
