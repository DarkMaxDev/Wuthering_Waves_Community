import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db";
import { plain } from "@/lib/utils";
import Character from "@/models/Character";
import CharacterForm from "@/components/CharacterForm";

export default async function EditCharacter({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await connectDB();
  const c = await Character.findOne({ slug }).lean();
  if (!c) notFound();
  return (
    <div>
      <h1 className="mb-6 text-5xl">Editar personaje</h1>
      <CharacterForm initial={plain(c) as any} />
    </div>
  );
}
