"use client";
import { useState } from "react";

export default function CharacterImage({
  src,
  name,
}: {
  src?: string;
  name: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!src || failed)
    return (
      <span className="p-3 font-display text-5xl text-platinum-dark">
        {name[0]}
      </span>
    );
  return (
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
