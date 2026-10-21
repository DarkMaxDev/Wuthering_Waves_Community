"use client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export default function DeleteButton({
  url,
  confirmText,
  redirectTo,
  label,
}: {
  url: string;
  confirmText: string;
  redirectTo?: string;
  label?: string;
}) {
  const router = useRouter();
  async function remove() {
    if (!confirm(confirmText)) return;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) return alert((await res.json()).error ?? "Error");
    if (redirectTo) router.push(redirectTo);
    router.refresh();
  }
  return (
    <button onClick={remove} className="btn btn-ghost" aria-label="Eliminar">
      <Trash2 size={16} />
      {label}
    </button>
  );
}
