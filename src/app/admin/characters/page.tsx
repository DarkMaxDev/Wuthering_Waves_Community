import Link from "next/link";
import { Pencil } from "lucide-react";
import { connectDB } from "@/lib/db";
import { plain } from "@/lib/utils";
import Character from "@/models/Character";
import DeleteButton from "@/components/DeleteButton";

export default async function AdminCharacters() {
  await connectDB();
  const chars: any[] = plain(await Character.find().sort({ name: 1 }).lean());
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-5xl">Personajes</h1>
        <Link href="/admin/characters/new" className="btn">
          Agregar personaje
        </Link>
      </div>
      <div className="space-y-3">
        {chars.map((c) => (
          <div
            key={c._id}
            className="card flex flex-wrap items-center gap-3 py-3"
          >
            <div className="flex-1">
              <p className="font-medium">
                {c.name}{" "}
                <span className="text-xs text-slate2">
                  {"★".repeat(c.rarity)}
                </span>
              </p>
              <p className="text-xs text-slate2">
                {c.element} · {c.weaponType} · {c.role}
              </p>
            </div>
            <Link
              href={`/admin/characters/${c.slug}/edit`}
              className="btn btn-ghost"
              aria-label={`Editar ${c.name}`}
            >
              <Pencil size={16} />
            </Link>
            <DeleteButton
              url={`/api/characters/${c.slug}`}
              confirmText={`¿Eliminar a ${c.name}? Se borrarán también sus builds y comentarios.`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
