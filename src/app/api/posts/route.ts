import { connectDB } from "@/lib/db";
import { fail, handle, json, requireUser } from "@/lib/api";
import { postSchema } from "@/lib/validators";
import Post from "@/models/Post";

export const GET = handle(async (req: Request) => {
  const kind = new URL(req.url).searchParams.get("kind");
  await connectDB();
  const posts = await Post.find(
    kind === "news" || kind === "question" ? { kind } : {},
  )
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return json({ posts });
});

export const POST = handle(async (req: Request) => {
  const [user, deny] = await requireUser();
  if (!user) return deny;
  const data = postSchema.parse(await req.json());
  if (data.kind === "news" && user.role !== "admin")
    return fail("Solo administradores", 403);
  await connectDB();
  const post = await Post.create({ ...data, author: user.id });
  return json({ post }, 201);
});
