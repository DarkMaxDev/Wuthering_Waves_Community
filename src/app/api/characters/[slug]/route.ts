import { connectDB } from "@/lib/db";
import { fail, handle, json, requireAdmin } from "@/lib/api";
import { characterSchema } from "@/lib/validators";
import Character from "@/models/Character";
import Build from "@/models/Build";
import Comment from "@/models/Comment";

type Ctx = { params: Promise<{ slug: string }> };

export const GET = handle(async (_req: Request, { params }: Ctx) => {
  const { slug } = await params;
  await connectDB();
  const character = await Character.findOne({ slug }).lean();
  if (!character) return fail("Personaje no encontrado", 404);
  const builds = await Build.find({ character: (character as any)._id })
    .populate("author", "username").sort({ official: -1, createdAt: -1 }).lean();
  return json({ character, builds });
});

/** PATCH: edita un personaje (el slug no cambia para no romper enlaces). Solo admin. */
export const PATCH = handle(async (req: Request, { params }: Ctx) => {
  const [, deny] = await requireAdmin();
  if (deny) return deny;
  const { slug } = await params;
  const data = characterSchema.parse(await req.json());
  await connectDB();
  const character = await Character.findOneAndUpdate({ slug }, data, { new: true }).lean();
  return character ? json({ character }) : fail("Personaje no encontrado", 404);
});

/** DELETE: elimina el personaje junto con sus builds y los comentarios de esas builds. Solo admin. */
export const DELETE = handle(async (_req: Request, { params }: Ctx) => {
  const [, deny] = await requireAdmin();
  if (deny) return deny;
  const { slug } = await params;
  await connectDB();
  const character = await Character.findOneAndDelete({ slug });
  if (!character) return fail("Personaje no encontrado", 404);
  const ids = (await Build.find({ character: character._id }).select("_id").lean()).map((b: any) => b._id);
  await Comment.deleteMany({ targetType: "build", target: { $in: ids } });
  await Build.deleteMany({ character: character._id });
  return json({ ok: true });
});
