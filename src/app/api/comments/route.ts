import { connectDB } from "@/lib/db";
import { handle, json, requireUser } from "@/lib/api";
import { commentSchema } from "@/lib/validators";
import Comment from "@/models/Comment";

export const GET = handle(async (req: Request) => {
  const sp = new URL(req.url).searchParams;
  const { targetType, target } = commentSchema
    .pick({ targetType: true, target: true })
    .parse({ targetType: sp.get("targetType"), target: sp.get("target") });
  await connectDB();
  const comments = await Comment.find({ targetType, target })
    .populate("author", "username")
    .sort({ createdAt: 1 })
    .lean();
  return json({ comments });
});

export const POST = handle(async (req: Request) => {
  const [user, deny] = await requireUser();
  if (!user) return deny;
  const data = commentSchema.parse(await req.json());
  await connectDB();
  const created = await Comment.create({ ...data, author: user.id });
  const comment = await Comment.findById(created._id)
    .populate("author", "username")
    .lean();
  return json({ comment }, 201);
});
