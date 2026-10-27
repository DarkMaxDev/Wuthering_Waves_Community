"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostForm({
  kind,
  categories,
}: {
  kind: "question" | "news";
  categories: string[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const body = { ...Object.fromEntries(new FormData(e.currentTarget)), kind };
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await res.json();
    if (!res.ok) return setError(d.error);
    router.push(`/${kind === "news" ? "news" : "community"}/${d.post._id}`);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card max-w-2xl space-y-3">
      <input name="title" className="input" placeholder="Título" required />
      
      <select name="category" className="input">
        {categories.map((c) => (
          <option key={c}>{c}</option>
        ))}
      </select>

      {kind === "news" && (
        <input
          name="videoUrl"
          type="url"
          className="input"
          placeholder="URL del video (YouTube o X / Twitter) - Opcional"
        />
      )}

      <textarea
        name="body"
        className="input min-h-40"
        placeholder="Describe tu duda o escribe el artículo…"
        required
      />
      
      {error && <p className="text-sm text-red-700">{error}</p>}
      <button className="btn">Publicar</button>
    </form>
  );
}