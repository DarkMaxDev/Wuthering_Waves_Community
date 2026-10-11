import Link from "next/link";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { cn, plain } from "@/lib/utils";
import Character from "@/models/Character";
import { CharacterCard } from "@/components/Cards";

export const dynamic = "force-dynamic";

const ELEMENTS = ["Fusion", "Glacio", "Electro", "Aero", "Spectro", "Havoc"];

// Generación de metadatos dinámicos según el elemento seleccionado
export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ element?: string }>;
}): Promise<Metadata> {
  const { element } = await searchParams;
  const isElementValid = ELEMENTS.includes(element ?? "");

  const title = isElementValid
    ? `Personajes ${element} — Guías y Builds`
    : "Resonadores y Personajes — Guías y Builds";

  const description = isElementValid
    ? `Explora todos los Resonadores del elemento ${element} en Wuthering Waves. Encuentra sus mejores builds, ecos y atributos principales.`
    : "Lista completa de Resonadores de Wuthering Waves. Filtra por elemento (Fusion, Glacio, Electro, Aero, Spectro, Havoc) y descubre sus mejores builds y ecos.";

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Wuthering Waves Community`,
      description,
    },
  };
}

export default async function Characters({
  searchParams,
}: {
  searchParams: Promise<{ element?: string }>;
}) {
  const { element } = await searchParams;
  await connectDB();
  const chars = plain(
    await Character.find(ELEMENTS.includes(element ?? "") ? { element } : {})
      .sort({ rarity: -1, name: 1 })
      .lean()
  );

  return (
    <div>
      <h1 className="mb-4 text-5xl">Personajes</h1>
      <div className="mb-6 flex flex-wrap gap-2">
        <Link
          href="/characters"
          className={cn("chip", !element && "border-ink bg-ink text-white")}
        >
          Todos
        </Link>
        {ELEMENTS.map((e) => (
          <Link
            key={e}
            href={`/characters?element=${e}`}
            className={cn("chip", element === e && "border-ink bg-ink text-white")}
          >
            {e}
          </Link>
        ))}
      </div>
      {chars.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {chars.map((c: any) => (
            <CharacterCard key={c._id} c={c} />
          ))}
        </div>
      ) : (
        <p className="text-slate2">Sin resultados.</p>
      )}
    </div>
  );
}