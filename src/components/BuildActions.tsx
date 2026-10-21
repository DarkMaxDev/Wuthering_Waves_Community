"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import BuildForm from "./BuildForm";

export default function BuildActions({
  characterId,
  build,
}: {
  characterId: string;
  build: any;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);

  async function remove() {
    if (!confirm("¿Eliminar esta build y todos sus comentarios?")) return;
    const res = await fetch(`/api/builds/${build._id}`, { method: "DELETE" });
    if (!res.ok) return alert((await res.json()).error ?? "Error");
    router.refresh();
  }

  if (editing)
    return (
      <BuildForm
        characterId={characterId}
        build={build}
        onDone={() => setEditing(false)}
      />
    );
  return (
    <div className="flex gap-2">
      <button className="btn btn-ghost" onClick={() => setEditing(true)}>
        <Pencil size={16} /> Editar
      </button>
      <button className="btn btn-ghost" onClick={remove}>
        <Trash2 size={16} /> Eliminar
      </button>
    </div>
  );
}
