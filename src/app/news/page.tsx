import Link from "next/link";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { cn, plain } from "@/lib/utils";
import Post from "@/models/Post";
import { PostCard } from "@/components/Cards";

export const dynamic = "force-dynamic";
const CATS = ["personaje", "banner", "evento", "colaboración", "reseña"];

export default async function News({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  await connectDB();
  const posts = plain(await Post.find({ kind: "news", ...(category ? { category } : {}) }).populate("author", "username").sort({ createdAt: -1 }).lean());
  const user = await getSession();
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-5xl">Noticias</h1>
        {user?.role === "admin" && <Link href="/news/new" className="btn">Publicar noticia</Link>}
      </div>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/news" className={cn("chip", !category && "border-ink bg-ink text-white")}>Todas</Link>
        {CATS.map((c) => <Link key={c} href={`/news?category=${c}`} className={cn("chip", category === c && "border-ink bg-ink text-white")}>{c}</Link>)}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">{posts.map((p: any) => <PostCard key={p._id} p={p} base="news" />)}</div>
      {!posts.length && <p className="text-slate2">No hay noticias en esta categoría.</p>}
    </div>
  );
}
