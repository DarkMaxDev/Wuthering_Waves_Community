import { notFound } from "next/navigation";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { fmtDate, plain } from "@/lib/utils";
import { requireUser } from "@/lib/api"; // O la función con la que obtengas la sesión actual
import Post from "@/models/Post";
import Comment from "@/models/Comment";
import { VideoEmbed } from "@/components/VideoEmbed"; 
import CommentSection from "@/components/CommentSection";

export const dynamic = "force-dynamic";

export default async function Article({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!mongoose.isValidObjectId(id)) notFound();
  
  await connectDB();
  
  const [user] = await requireUser();

  const raw = await Post.findOne({ _id: id, kind: "news" }).populate("author", "username").lean();
  if (!raw) notFound();
  const p: any = plain(raw);

  const rawComments = await Comment.find({ targetType: "post", target: id })
    .populate("author", "username")
    .sort({ createdAt: 1 })
    .lean();
  const comments = plain(rawComments);

  return (
    <article className="max-w-2xl">
      <span className="chip">{p.category}</span>
      <h1 className="mt-3 text-5xl">{p.title}</h1>
      <p className="mt-2 text-xs text-slate2">{p.author?.username} · {fmtDate(p.createdAt)}</p>
      
      <VideoEmbed url={p.videoUrl} />

      <div className="mt-6 space-y-4 leading-relaxed">
        {p.body.split("\n\n").map((para: string, i: number) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <CommentSection 
        postId={p._id} 
        comments={comments} 
        meId={user?.id}
        isAdmin={user?.role === "admin"} 
      />
    </article>
  );
}