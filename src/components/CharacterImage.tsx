"use client";
import { useState } from "react";

/** Foto del personaje desde una URL; si falta o falla, muestra su inicial. */
export default function CharacterImage({ src, name }: { src?: string; name: string }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed)
    return <span className="p-3 font-display text-5xl text-platinum-dark">{name[0]}</span>;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover object-top"
    />
  );
}