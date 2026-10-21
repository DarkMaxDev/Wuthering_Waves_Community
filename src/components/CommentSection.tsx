"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { fmtDate } from "@/lib/utils";

type C = {
  _id: string;
  body: string;
  createdAt: string;
  author?: { _id: string; username: string };
};

export default function CommentSection({
  targetType,
  target,
  canPost,
  meId,
  isAdmin = false,
  label = "Comentarios",
}: {
  targetType: "build" | "post";
  target: string;
  canPost: boolean;
  meId?: string;
  isAdmin?: boolean;
  label?: string;
}) {
  const [items, setItems] = useState<C[]>([]);
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/comments?targetType=${targetType}&target=${target}`)
      .then((r) => r.json())
      .then((d) => setItems(d.comments ?? []));
  }, [targetType, target]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/comments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetType, target, body }),
    });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    setItems((p) => [...p, d.comment]);
    setBody("");
  }

  async function remove(id: string) {
    if (!confirm("¿Eliminar este comentario?")) return;
    setError("");
    const res = await fetch(`/api/comments/${id}`, { method: "DELETE" });
    if (!res.ok) return setError((await res.json()).error ?? "Error");
    setItems((p) => p.filter((c) => c._id !== id));
  }

  const canDelete = (c: C) => !!meId && (isAdmin || c.author?._id === meId);

  return (
    <section className="mt-4 space-y-3">
      <h4 className="text-sm font-semibold">
        {label} ({items.length})
      </h4>
      {items.map((c) => (
        <div key={c._id} className="rounded-md bg-fog p-3 text-sm">
          <div className="mb-1 flex items-center justify-between gap-2">
            <p className="text-xs text-slate2">
              {c.author?.username ?? "usuario eliminado"} ·{" "}
              {fmtDate(c.createdAt)}
            </p>
            {canDelete(c) && (
              <button
                onClick={() => remove(c._id)}
                className="text-slate2 hover:text-ink"
                aria-label="Eliminar comentario"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
          <p className="whitespace-pre-wrap">{c.body}</p>
        </div>
      ))}
      {canPost ? (
        <form onSubmit={submit} className="space-y-2">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="input min-h-20"
            placeholder="Sugiere una mejora o comparte tu combinación…"
            required
          />
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <button className="btn">Publicar</button>
        </form>
      ) : (
        <p className="text-sm text-slate2">
          <Link href="/login" className="underline">
            Inicia sesión
          </Link>{" "}
          para participar.
        </p>
      )}
    </section>
  );
}
