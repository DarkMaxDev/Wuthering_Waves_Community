"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { fmtDate } from "@/lib/utils";

type U = { _id: string; username: string; email: string; role: "user" | "admin"; createdAt: string };

/** Lista de usuarios con cambio de rol y eliminación (solo admin). */
export default function UsersTable({ users, meId }: { users: U[]; meId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function call(id: string, init: RequestInit) {
    setError("");
    const res = await fetch(`/api/admin/users/${id}`, { headers: { "Content-Type": "application/json" }, ...init });
    if (!res.ok) setError((await res.json()).error ?? "Error");
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      {users.map((u) => {
        const me = u._id === meId;
        return (
          <div key={u._id} className="card flex flex-wrap items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="font-medium">{u.username} {me && <span className="chip ml-1">Tú</span>}</p>
              <p className="truncate text-xs text-slate2">{u.email} · desde {fmtDate(u.createdAt)}</p>
            </div>
            <select
              aria-label={`Rol de ${u.username}`}
              className="input w-auto" value={u.role} disabled={me}
              onChange={(e) => call(u._id, { method: "PATCH", body: JSON.stringify({ role: e.target.value }) })}
            >
              <option value="user">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            <button
              className="btn btn-ghost" disabled={me} aria-label={`Eliminar a ${u.username}`}
              onClick={() => confirm(`¿Eliminar a ${u.username} y sus comentarios?`) && call(u._id, { method: "DELETE" })}
            ><Trash2 size={16} /></button>
          </div>
        );
      })}
    </div>
  );
}
