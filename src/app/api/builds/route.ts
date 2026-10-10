import { connectDB } from "@/lib/db";
import { handle, json, requireUser } from "@/lib/api";
import { buildSchema } from "@/lib/validators";
import Build from "@/models/Build";

export const GET = handle(async (req: Request) => {
  const character = new URL(req.url).searchParams.get("character");
  await connectDB();
  const builds = await Build.find(character ? { character } : {})
    .populate("author", "username").sort({ createdAt: -1 }).limit(50).lean();
  return json({ builds });
});

export const POST = handle(async (req: Request) => {
  const [user, deny] = await requireUser();
  if (!user) return deny;
  const data = buildSchema.parse(await req.json());
  await connectDB();
  const build = await Build.create({ ...data, author: user.id, official: user.role === "admin" });
  return json({ build }, 201);
});
