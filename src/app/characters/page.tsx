import Link from "next/link";
import type { Metadata } from "next";
import { connectDB } from "@/lib/db";
import { cn, plain } from "@/lib/utils";
import Character from "@/models/Character";
import { CharacterCard } from "@/components/Cards";
import SearchInput from "@/components/SearchInput";

export const dynamic = "force-dynamic";

const ELEMENTS = ["Fusion", "Glacio", "Electro", "Aero", "Spectro", "Havoc"];

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ element?: string; q?: string }>;
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
  searchParams: Promise<{ element?: string; q?: string }>;
}) {
  const { element, q } = await searchParams;
  await connectDB();

  // Construcción del query dinámico para MongoDB
  const query: Record<string, any> = {};

  if (ELEMENTS.includes(element ?? "")) {
    query.element = element;
  }

  if (q && q.trim() !== "") {
    // Búsqueda insensible a mayúsculas/minúsculas por el nombre
    query.name = { $regex: q.trim(),$options: "i" };
  }

  const chars = plain(
    await Character.find(query)
      .sort({ rarity: -1, name: 1 })
      .lean(),
  );

  return (
    <div>
      <h1 className="mb-4 text-5xl">Personajes</h1>

      {/* Contenedor con la barra de búsqueda y los filtros de elementos */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput placeholder="Buscar personaje por nombre..." />

        <div className="flex flex-wrap gap-2">
          <Link
            href={q ? `/characters?q=${encodeURIComponent(q)}` : "/characters"}
            className={cn("chip", !element && "border-ink bg-ink text-white")}
          >
            Todos
          </Link>
          {ELEMENTS.map((e) => {
            const href = q
              ? `/characters?element=${e}&q=${encodeURIComponent(q)}`
              : `/characters?element=${e}`;

            return (
              <Link
                key={e}
                href={href}
                className={cn(
                  "chip",
                  element === e && "border-ink bg-ink text-white",
                )}
              >
                {e}
              </Link>
            );
          })}
        </div>
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