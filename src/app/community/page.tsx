import Link from "next/link";
import { connectDB } from "@/lib/db";
import { plain } from "@/lib/utils";
import Post from "@/models/Post";
import { PostCard } from "@/components/Cards";

export const dynamic = "force-dynamic";

export default async function Community() {
  await connectDB();
  const posts = plain(await Post.find({ kind: "question" }).populate("author", "username").sort({ createdAt: -1 }).limit(50).lean());
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div><h1 className="text-5xl">Centro de ayuda</h1><p className="text-slate2">Pide ayuda con equipos, rotaciones o la Torre de la Adversidad.</p></div>
        <Link href="/community/new" className="btn">Nueva pregunta</Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">{posts.map((p: any) => <PostCard key={p._id} p={p} base="community" />)}</div>
      {!posts.length && <p className="text-slate2">Nadie ha preguntado todavía. Sé la primera persona.</p>}
    </div>
  );
}
