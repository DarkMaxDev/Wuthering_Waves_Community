import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getSession();
  if (user?.role !== "admin") redirect("/"); // doble barrera: la API también valida el rol
  return (
    <div>
      <nav className="mb-6 flex gap-4 border-b border-mist pb-3 text-sm">
        <Link href="/admin" className="font-medium">Panel</Link>
        <Link href="/admin/users" className="text-graphite hover:text-ink">Usuarios</Link>
        <Link href="/admin/characters" className="text-graphite hover:text-ink">Personajes</Link>
      </nav>
      {children}
    </div>
  );
}
