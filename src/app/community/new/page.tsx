import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import PostForm from "@/components/PostForm";

export default async function NewQuestion() {
  if (!(await getSession())) redirect("/login");
  return (<div><h1 className="mb-6 text-5xl">Nueva pregunta</h1>
    <PostForm kind="question" categories={["team-comp", "rotación", "torre-de-adversidad", "ecos", "general"]} /></div>);
}
