import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { fail, handle, json } from "@/lib/api";
import { setAuthCookie, signToken } from "@/lib/auth";
import { registerSchema } from "@/lib/validators";
import User from "@/models/User";

export const POST = handle(async (req: Request) => {
  const data = registerSchema.parse(await req.json());
  await connectDB();

  if (await User.exists({ $or: [{ email: data.email }, { username: data.username }] }))
    return fail("El correo o el usuario ya están registrados", 409);

  const passwordHash = await bcrypt.hash(data.password, 12);
  const role = data.email === process.env.ADMIN_EMAIL?.toLowerCase() ? "admin" : "user";
  const user = await User.create({ username: data.username, email: data.email, passwordHash, role });

  await setAuthCookie(signToken({ id: String(user._id), username: user.username, role }));
  return json({ user: { id: user._id, username: user.username, role } }, 201);
});
