import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { fmtDate, plain } from "@/lib/utils";
import Post from "@/models/Post";
import CommentSection from "@/components/CommentSection";
import DeleteButton from "@/components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function Thread({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  await connectDB();
  const raw = await Post.findById(id).populate("author", "username").lean();
  if (!raw) notFound();
  const p: any = plain(raw);
  const user = await getSession();
  return (
    <article className="max-w-3xl">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="chip">{p.category}</span>
        {user?.role === "admin" && (
          <DeleteButton
            url={`/api/posts/${p._id}`}
            redirectTo="/community"
            label="Eliminar pregunta"
            confirmText="¿Eliminar esta pregunta y todas sus respuestas?"
          />
        )}
      </div>
      <h1 className="mt-3 text-5xl">{p.title}</h1>
      <p className="mt-2 text-xs text-slate2">{p.author?.username} · {fmtDate(p.createdAt)}</p>
      <p className="mt-6 whitespace-pre-wrap">{p.body}</p>
      <CommentSection targetType="post" target={p._id} canPost={!!user} meId={user?.id} isAdmin={user?.role === "admin"} label="Respuestas" />
    </article>
  );
}