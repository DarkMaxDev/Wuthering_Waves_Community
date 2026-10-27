import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { fail, handle, json, requireUser } from "@/lib/api";
import Comment from "@/models/Comment";

export const DELETE = handle(
  async (_req: Request, { params }: { params: Promise<{ id: string }> }) => {
    const [user, deny] = await requireUser();
    if (!user) return deny;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) return fail("ID inválido", 422);

    await connectDB();
    const comment = await Comment.findById(id);
    if (!comment) return fail("Comentario no encontrado", 404);

    if (comment.author.toString() !== user.id && user.role !== "admin") {
      return fail("No tienes permisos para realizar esta acción", 403);
    }

    await Comment.findByIdAndDelete(id);
    return json({ ok: true });
  }
);