import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { fail, handle, json, requireAdmin } from "@/lib/api";
import Post from "@/models/Post";
import Comment from "@/models/Comment";

/** DELETE /api/posts/:id — solo administradores. Borra también las respuestas. */
export const DELETE = handle(async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
  const [, deny] = await requireAdmin();
  if (deny) return deny;
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) return fail("ID inválido", 422);
  await connectDB();
  const post = await Post.findByIdAndDelete(id);
  if (!post) return fail("Publicación no encontrada", 404);
  await Comment.deleteMany({ targetType: "post", target: id });
  return json({ ok: true });
});