import Link from "next/link";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { plain } from "@/lib/utils";
import { SITE } from "@/config/site";
import Character from "@/models/Character";
import Post from "@/models/Post";
import { CharacterCard, PostCard } from "@/components/Cards";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Inicio | Wuthering Waves Community",
  description: "Stats prioritarias, sets de ecos, builds optimizadas y debates de la comunidad para Wuthering Waves en un solo lugar.",
  openGraph: {
    title: "Wuthering Waves Community - Builds, Ecos y Guías",
    description: "Stats prioritarias, sets de ecos, builds optimizadas y debates de la comunidad para Wuthering Waves.",
  },
};

export default async function Home() {
  await connectDB();
  const [chars, news] = await Promise.all([
    Character.find().sort({ rarity: -1, name: 1 }).limit(4).lean(),
    Post.find({ kind: "news" }).populate("author", "username").sort({ createdAt: -1 }).limit(3).lean(),
  ]);
  const o = SITE.heroOverlay;

  return (
    <div className="space-y-14">
      <section className="relative overflow-hidden rounded-2xl border border-mist bg-gradient-to-b from-[#000000] to-night px-6 py-16 sm:px-12 sm:py-28">
        {SITE.heroImage && (
          <>
            <div aria-hidden className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${SITE.heroImage}")` }} />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, rgba(13,14,16,${o}) 0%, rgba(13,14,16,${o * 0.35}) 100%)`,
              }}
            />
          </>
        )}
        <div className="relative z-10 max-w-2xl">
          <h1 className="animate-rise bg-gradient-to-b from-white to-slate2 bg-clip-text text-5xl leading-[1.05] text-transparent sm:text-7xl">
            Cada eco cuenta. Construye a tu Resonador con criterio.
          </h1>
          <p className="mt-5 max-w-xl animate-rise text-lg text-slate2" style={{ animationDelay: "0.12s" }}>
            Stats prioritarias, sets de ecos y debates de la comunidad para Wuthering Waves, en un solo lugar.
          </p>
          <div className="mt-8 flex animate-rise flex-wrap gap-3" style={{ animationDelay: "0.24s" }}>
            <Link href="/characters" className="btn">Ver personajes</Link>
            <Link href="/community" className="btn btn-ghost">Preguntar a la comunidad</Link>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-3xl">Personajes destacados</h2>
          <span className="h-px flex-1 bg-mist" />
          <Link href="/characters" className="text-sm text-slate2 hover:text-ink">Ver todos</Link>
        </div>
        {chars.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {plain(chars).map((c: any) => (
              <CharacterCard key={c._id} c={c} />
            ))}
          </div>
        ) : (
          <p className="text-slate2">Aún no hay personajes. Ejecuta <code>pnpm seed</code>.</p>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center gap-4">
          <h2 className="text-3xl">Últimas noticias</h2>
          <span className="h-px flex-1 bg-mist" />
          <Link href="/news" className="text-sm text-slate2 hover:text-ink">Ver todas</Link>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {plain(news).map((p: any) => (
            <PostCard key={p._id} p={p} base="news" />
          ))}
        </div>
      </section>
    </div>
  );
}