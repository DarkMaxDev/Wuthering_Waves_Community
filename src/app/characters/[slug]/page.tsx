import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { plain } from "@/lib/utils";
import Character from "@/models/Character";
import Build from "@/models/Build";
import BuildForm from "@/components/BuildForm";
import CommentSection from "@/components/CommentSection";
import CharacterImage from "@/components/CharacterImage";
import BuildActions from "@/components/BuildActions";

export const dynamic = "force-dynamic";

export default async function CharacterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await connectDB();
  const raw = await Character.findOne({ slug }).lean();
  if (!raw) notFound();
  const c: any = plain(raw);
  const builds: any[] = plain(await Build.find({ character: c._id }).populate("author", "username").sort({ official: -1, createdAt: -1 }).lean());
  const user = await getSession();

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-6 sm:flex-row">
        <div className="flex h-72 w-full shrink-0 items-end overflow-hidden rounded-lg bg-gradient-to-br from-fog to-platinum-light sm:w-56">
          <CharacterImage src={c.imageUrl} name={c.name} />
        </div>
        <div>
          <div className="mb-3 flex flex-wrap gap-2"><span className="chip">{c.element}</span><span className="chip">{c.weaponType}</span><span className="chip">{c.role}</span><span className="chip">{"★".repeat(c.rarity)}</span></div>
          <h1 className="text-6xl">{c.name}</h1>
          <p className="mt-3 max-w-2xl text-slate2">{c.description}</p>
        </div>
      </header>

      <section>
        <h2 className="mb-3 text-3xl">Atributos a mejorar</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {c.keyStats.map((s: any) => (
            <div key={s.stat} className="card py-4">
              <div className="mb-2 flex justify-between text-sm"><span className="font-medium">{s.stat}</span><span className="text-slate2">{s.note}</span></div>
              <div className="h-1.5 rounded-full bg-mist" role="meter" aria-valuenow={s.priority} aria-valuemin={1} aria-valuemax={5} aria-label={`Prioridad de ${s.stat}`}>
                <div className="h-full rounded-full bg-graphite" style={{ width: `${s.priority * 20}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl">Builds y ecos recomendados</h2>
          {user ? <BuildForm characterId={c._id} /> : <p className="text-sm text-slate2">Inicia sesión para proponer builds.</p>}
        </div>
        {builds.map((b) => (
          <article key={b._id} className="card">
            <div className="flex flex-wrap items-center gap-2"><h3 className="text-2xl">{b.title}</h3>{b.official && <span className="chip">Oficial</span>}</div>
            <p className="text-xs text-slate2">por {b.author?.username}</p>
            {b.description && <p className="mt-3 text-sm">{b.description}</p>}
            <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
              <div><dt className="mb-1 font-semibold">Sets de ecos</dt>{b.echoSets.map((s: any) => <dd key={s.name}>{s.name} ({s.pieces}p)</dd>)}</div>
              <div><dt className="mb-1 font-semibold">Main stats</dt><dd>Coste 4: {b.mainStats.cost4}</dd><dd>Coste 3: {b.mainStats.cost3}</dd><dd>Coste 1: {b.mainStats.cost1}</dd></div>
              <div><dt className="mb-1 font-semibold">Sub-stats</dt><dd className="flex flex-wrap gap-1">{b.subStats.map((s: string) => <span key={s} className="chip">{s}</span>)}</dd>{b.weapon && <dd className="mt-2">Arma: {b.weapon}</dd>}</div>
            </dl>
            {user && (user.role === "admin" || b.author?._id === user.id) && (
             <div className="mt-4"><BuildActions characterId={c._id} build={b} /></div>
            )}
            <CommentSection targetType="build" target={b._id} canPost={!!user} meId={user?.id} isAdmin={user?.role === "admin"} label="Feedback de la comunidad" />
          </article>
        ))}
        {!builds.length && <p className="text-slate2">Aún no hay builds para este personaje.</p>}
      </section>
    </div>
  );
}