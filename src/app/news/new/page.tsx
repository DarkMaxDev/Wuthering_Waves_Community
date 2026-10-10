import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import PostForm from "@/components/PostForm";

export default async function NewNews() {
  const user = await getSession();
  if (user?.role !== "admin") redirect("/news");
  return (<div><h1 className="mb-6 text-5xl">Publicar noticia</h1>
    <PostForm kind="news" categories={["personaje", "banner", "evento", "colaboración", "reseña"]} /></div>);
}
