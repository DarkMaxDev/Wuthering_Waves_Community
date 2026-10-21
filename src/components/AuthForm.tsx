"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }: { mode: "login" | "register" }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const isRegister = mode === "register";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const body = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) return setError(data.error ?? "Error");
    router.push("/profile");
    router.refresh();
  }

  return (
    <form
      onSubmit={onSubmit}
      className="card mx-auto w-full max-w-sm space-y-4"
    >
      <h1 className="text-3xl">
        {isRegister ? "Crear cuenta" : "Iniciar sesión"}
      </h1>
      {isRegister && (
        <input
          name="username"
          className="input"
          placeholder="Usuario"
          required
          autoComplete="username"
        />
      )}
      <input
        name="email"
        type="email"
        className="input"
        placeholder="Correo"
        required
        autoComplete="email"
      />
      <input
        name="password"
        type="password"
        className="input"
        placeholder="Contraseña"
        required
        autoComplete={isRegister ? "new-password" : "current-password"}
      />
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      <button className="btn w-full" disabled={loading}>
        {loading ? "Procesando…" : isRegister ? "Registrarme" : "Entrar"}
      </button>
      <p className="text-center text-sm text-slate2">
        {isRegister ? (
          <>
            ¿Ya tienes cuenta?{" "}
            <Link href="/login" className="underline">
              Inicia sesión
            </Link>
          </>
        ) : (
          <>
            ¿Sin cuenta?{" "}
            <Link href="/register" className="underline">
              Regístrate
            </Link>
          </>
        )}
      </p>
    </form>
  );
}
