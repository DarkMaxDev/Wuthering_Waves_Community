"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ELEMENTS, ROLES, WEAPONS } from "@/lib/validators";

type Initial = { slug: string; name: string; rarity: number; element: string; weaponType: string; role: string; description: string; imageUrl?: string; keyStats: { stat: string; priority: number; note?: string }[] };

/** Crear (sin `initial`) o editar (con `initial`) un personaje. */
export default function CharacterForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const statsText = initial?.keyStats.map((s) => `${s.stat}, ${s.priority}, ${s.note ?? ""}`).join("\n") ?? "CRIT Rate, 5, Meta 60-70%\nCRIT DMG, 5\nATK%, 4";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const f = new FormData(e.currentTarget);
    // Cada línea: "Atributo, prioridad (1-5), nota opcional"
    const keyStats = String(f.get("stats")).split("\n").map((l) => l.trim()).filter(Boolean).map((l) => {
      const [stat, priority, ...note] = l.split(",");
      return { stat: stat?.trim(), priority: priority?.trim(), note: note.join(",").trim() };
    });
    const payload = Object.fromEntries(f); delete (payload as any).stats;
    const res = await fetch(initial ? `/api/characters/${initial.slug}` : "/api/characters", {
      method: initial ? "PATCH" : "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, keyStats }),
    });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    router.push("/admin/characters"); router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card grid max-w-2xl gap-3 sm:grid-cols-2">
      <input name="name" defaultValue={initial?.name} className="input sm:col-span-2" placeholder="Nombre" required />
      <input name="imageUrl" type="url" defaultValue={initial?.imageUrl} className="input sm:col-span-2" placeholder="URL de la imagen (https://…) — opcional" />
      <select name="rarity" defaultValue={initial?.rarity ?? 5} className="input"><option value="5">5 estrellas</option><option value="4">4 estrellas</option></select>
      <select name="element" defaultValue={initial?.element} className="input">{ELEMENTS.map((x) => <option key={x}>{x}</option>)}</select>
      <select name="weaponType" defaultValue={initial?.weaponType} className="input">{WEAPONS.map((x) => <option key={x}>{x}</option>)}</select>
      <select name="role" defaultValue={initial?.role} className="input">{ROLES.map((x) => <option key={x}>{x}</option>)}</select>
      <textarea name="description" defaultValue={initial?.description} className="input min-h-20 sm:col-span-2" placeholder="Descripción breve" />
      <label className="text-sm sm:col-span-2">Atributos clave: una línea por atributo — <em>nombre, prioridad 1-5, nota opcional</em>
        <textarea name="stats" defaultValue={statsText} className="input mt-1 min-h-28 font-mono" required />
      </label>
      {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      <div className="flex gap-2 sm:col-span-2"><button className="btn">{initial ? "Guardar cambios" : "Crear personaje"}</button>
        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>Cancelar</button></div>
    </form>
  );
}