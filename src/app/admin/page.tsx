import Link from "next/link";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Character from "@/models/Character";

export default async function AdminHome() {
  await connectDB();
  const [users, admins, chars] = await Promise.all([User.countDocuments(), User.countDocuments({ role: "admin" }), Character.countDocuments()]);
  return (
    <div>
      <h1 className="mb-6 text-5xl">Panel de administración</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/users" className="card hover:border-platinum-dark"><h2 className="text-2xl">Usuarios</h2><p className="text-sm text-slate2">{users} registrados · {admins} administradores</p></Link>
        <Link href="/admin/characters" className="card hover:border-platinum-dark"><h2 className="text-2xl">Personajes</h2><p className="text-sm text-slate2">{chars} en el catálogo</p></Link>
      </div>
    </div>
  );
}
