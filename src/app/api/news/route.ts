import { connectDB } from "@/lib/db";
import { fail, handle, json, requireUser } from "@/lib/api";
import { postSchema } from "@/lib/validators";
import Post from "@/models/Post";

export const GET = handle(async (req: Request) => {
  const category = new URL(req.url).searchParams.get("category");
  await connectDB();
  const news = await Post.find({
    kind: "news",
    ...(category ? { category } : {}),
  })
    .populate("author", "username")
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();
  return json({ news });
});

export const POST = handle(async (req: Request) => {
  const [user, deny] = await requireUser();
  if (!user) return deny;
  if (user.role !== "admin") return fail("Solo administradores", 403);
  const data = postSchema.parse({ ...(await req.json()), kind: "news" });
  await connectDB();
  return json({ news: await Post.create({ ...data, author: user.id }) }, 201);
});
