import Link from "next/link";
import { redirect } from "next/navigation";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { plain } from "@/lib/utils";
import Build from "@/models/Build";
import Post from "@/models/Post";
import { PostCard } from "@/components/Cards";

export const dynamic = "force-dynamic";

export default async function Profile() {
  const user = await getSession();
  if (!user) redirect("/login");
  await connectDB();
  const [builds, posts] = await Promise.all([
    Build.find({ author: user.id }).populate("character", "name slug").sort({ createdAt: -1 }).lean(),
    Post.find({ author: user.id }).populate("author", "username").sort({ createdAt: -1 }).lean(),
  ]);
  return (
    <div className="space-y-10">
      <header><h1 className="text-5xl">{user.username}</h1><span className="chip mt-2">{user.role === "admin" ? "Administrador" : "Resonador"}</span></header>
      <section>
        <h2 className="mb-3 text-3xl">Mis builds ({builds.length})</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {plain(builds).map((b: any) => (
            <Link key={b._id} href={`/characters/${b.character?.slug}`} className="card block hover:border-platinum-dark">
              <h3 className="text-xl">{b.title}</h3><p className="text-sm text-slate2">{b.character?.name} · {b.echoSets[0]?.name}</p>
            </Link>))}
        </div>
        {!builds.length && <p className="text-slate2">Aún no has guardado builds. Entra a un personaje y propón una.</p>}
      </section>
      <section>
        <h2 className="mb-3 text-3xl">Mis publicaciones ({posts.length})</h2>
        <div className="grid gap-3 md:grid-cols-2">{plain(posts).map((p: any) => <PostCard key={p._id} p={p} base={p.kind === "news" ? "news" : "community"} />)}</div>
        {!posts.length && <p className="text-slate2">Sin publicaciones todavía.</p>}
      </section>
    </div>
  );
}
