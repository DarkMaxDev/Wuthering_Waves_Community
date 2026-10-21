import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { fail, handle, json, requireUser } from "@/lib/api";
import { buildSchema } from "@/lib/validators";
import Build from "@/models/Build";
import Comment from "@/models/Comment";

type Ctx = { params: Promise<{ id: string }> };

async function loadOwned(id: string) {
  const [user, deny] = await requireUser();
  if (!user) return { error: deny };
  if (!mongoose.isValidObjectId(id)) return { error: fail("ID inválido", 422) };
  await connectDB();
  const build = await Build.findById(id);
  if (!build) return { error: fail("Build no encontrada", 404) };
  if (String(build.author) !== user.id && user.role !== "admin")
    return { error: fail("No puedes modificar esta build", 403) };
  return { build };
}

export const PATCH = handle(async (req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { build, error } = await loadOwned(id);
  if (!build) return error!;
  const data = buildSchema.omit({ character: true }).parse(await req.json());
  build.set(data);
  await build.save();
  return json({ build });
});

export const DELETE = handle(async (_req: Request, { params }: Ctx) => {
  const { id } = await params;
  const { build, error } = await loadOwned(id);
  if (!build) return error!;
  await Comment.deleteMany({ targetType: "build", target: build._id });
  await build.deleteOne();
  return json({ ok: true });
});
