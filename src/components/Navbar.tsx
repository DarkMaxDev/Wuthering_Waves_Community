import Link from "next/link";
import { getSession } from "@/lib/auth";
import LogoutButton from "./LogoutButton";
import {
  Users,
  MessagesSquare,
  Newspaper,
  User as UserIcon,
  Shield,
} from "lucide-react";

const links = [
  { href: "/characters", label: "Personajes", Icon: Users },
  { href: "/community", label: "Comunidad", Icon: MessagesSquare },
  { href: "/news", label: "Noticias", Icon: Newspaper },
];

export default async function Navbar() {
  const user = await getSession();
  return (
    <header className="sticky top-0 z-20 border-b border-mist bg-night/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="font-display text-2xl font-semibold text-ink">
          Wuthering_Community
        </Link>
        <div className="order-3 flex w-full gap-4 overflow-x-auto text-sm sm:order-none sm:w-auto">
          {links.map(({ href, label, Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-1.5 whitespace-nowrap text-slate2 transition hover:text-ink"
            >
              <Icon size={16} /> {label}
            </Link>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2 text-sm">
          {user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin" className="btn btn-ghost">
                  <Shield size={16} /> Admin
                </Link>
              )}
              <Link href="/profile" className="btn btn-ghost">
                <UserIcon size={16} /> {user.username}
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost">
                Iniciar sesión
              </Link>
              <Link href="/register" className="btn">
                Registrarse
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
