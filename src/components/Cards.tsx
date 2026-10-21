import Link from "next/link";
import { fmtDate } from "@/lib/utils";
import CharacterImage from "./CharacterImage";

export function CharacterCard({ c }: { c: any }) {
  return (
    <Link href={`/characters/${c.slug}`} className="card card-lift group block">
      <div className="mb-4 h-44 overflow-hidden rounded-md bg-gradient-to-br from-fog to-platinum-light">
        <div className="flex h-full w-full items-end transition-transform duration-500 group-hover:scale-105">
          <CharacterImage src={c.imageUrl} name={c.name} />
        </div>
      </div>
      <h3 className="text-2xl">{c.name}</h3>
      <p className="mb-3 text-xs text-slate2">
        {"★".repeat(c.rarity)} · {c.role}
      </p>
      <div className="flex gap-2">
        <span className="chip">{c.element}</span>
        <span className="chip">{c.weaponType}</span>
      </div>
    </Link>
  );
}

export function PostCard({ p, base }: { p: any; base: "news" | "community" }) {
  return (
    <Link href={`/${base}/${p._id}`} className="card card-lift block">
      <span className="chip mb-2">{p.category}</span>
      <h3 className="text-xl">{p.title}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-slate2">{p.body}</p>
      <p className="mt-3 text-xs text-slate2">
        {p.author?.username} · {fmtDate(p.createdAt)}
      </p>
    </Link>
  );
}
