import { connectDB } from "@/lib/db";
import { fail, handle, json, requireAdmin } from "@/lib/api";
import { characterSchema } from "@/lib/validators";
import Character from "@/models/Character";

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/** GET /api/characters?element=Fusion&role=Main%20DPS */
export const GET = handle(async (req: Request) => {
  const sp = new URL(req.url).searchParams;
  const filter: Record<string, string> = {};
  for (const k of ["element", "role", "weaponType"]) {
    const v = sp.get(k);
    if (v) filter[k] = v;
  }
  await connectDB();
  return json({ characters: await Character.find(filter).sort({ rarity: -1, name: 1 }).lean() });
});

/** POST /api/characters  (solo admin) */
export const POST = handle(async (req: Request) => {
  const [, deny] = await requireAdmin();
  if (deny) return deny;
  const data = characterSchema.parse(await req.json());
  const slug = slugify(data.name);
  if (!slug) return fail("Nombre inválido", 422);
  await connectDB();
  if (await Character.exists({ slug })) return fail("Ya existe un personaje con ese nombre", 409);
  return json({ character: await Character.create({ ...data, slug }) }, 201);
});
