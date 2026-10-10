"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Build = {
  _id: string; title: string; description?: string; weapon?: string;
  echoSets: { name: string; pieces: string }[];
  mainStats: { cost4: string; cost3: string; cost1: string };
  subStats: string[];
};

/** Crea una build (sin `build`) o edita una existente (con `build`). */
export default function BuildForm({ characterId, build, onDone }: { characterId: string; build?: Build; onDone?: () => void }) {
  const router = useRouter();
  const editing = !!build;
  const [error, setError] = useState("");
  const [open, setOpen] = useState(editing);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setError("");
    const f = new FormData(e.currentTarget);
    const payload = {
      character: characterId,
      title: f.get("title"), description: f.get("description"), weapon: f.get("weapon"),
      echoSets: [{ name: f.get("setName"), pieces: f.get("pieces") }],
      mainStats: { cost4: f.get("cost4"), cost3: f.get("cost3"), cost1: f.get("cost1") },
      subStats: String(f.get("subStats")).split(",").map((s) => s.trim()).filter(Boolean),
    };
    const res = await fetch(editing ? `/api/builds/${build!._id}` : "/api/builds", {
      method: editing ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
    });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    setOpen(false); onDone?.(); router.refresh();
  }

  function cancel() { setOpen(false); onDone?.(); }

  if (!open) return <button className="btn btn-ghost" onClick={() => setOpen(true)}>Proponer una build</button>;
  return (
    <form onSubmit={onSubmit} className="card mt-4 grid gap-3 sm:grid-cols-2">
      <input name="title" defaultValue={build?.title} className="input sm:col-span-2" placeholder="Título de la build" required />
      <input name="setName" defaultValue={build?.echoSets[0]?.name} className="input" placeholder="Set de ecos (ej. Celestial Light)" required />
      <select name="pieces" defaultValue={build?.echoSets[0]?.pieces ?? "5"} className="input"><option value="5">Set de 5 piezas</option><option value="3">3 piezas</option><option value="2">2 piezas</option></select>
      <input name="cost4" defaultValue={build?.mainStats.cost4} className="input" placeholder="Main stat coste 4" required />
      <input name="cost3" defaultValue={build?.mainStats.cost3} className="input" placeholder="Main stat coste 3" required />
      <input name="cost1" defaultValue={build?.mainStats.cost1} className="input" placeholder="Main stat coste 1" required />
      <input name="weapon" defaultValue={build?.weapon} className="input" placeholder="Arma recomendada" />
      <input name="subStats" defaultValue={build?.subStats.join(", ")} className="input sm:col-span-2" placeholder="Sub-stats separadas por coma: CRIT Rate, CRIT DMG, ATK%" required />
      <textarea name="description" defaultValue={build?.description} className="input sm:col-span-2" placeholder="Notas y rotación" />
      {error && <p role="alert" className="text-sm text-red-700 sm:col-span-2">{error}</p>}
      <div className="flex gap-2 sm:col-span-2">
        <button className="btn">{editing ? "Guardar cambios" : "Guardar build"}</button>
        <button type="button" className="btn btn-ghost" onClick={cancel}>Cancelar</button>
      </div>
    </form>
  );
}