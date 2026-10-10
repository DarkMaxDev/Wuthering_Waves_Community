import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import { fail, handle, json } from "@/lib/api";
import { setAuthCookie, signToken } from "@/lib/auth";
import { loginSchema } from "@/lib/validators";
import User from "@/models/User";

export const POST = handle(async (req: Request) => {
  const { email, password } = loginSchema.parse(await req.json());
  await connectDB();

  const user = await User.findOne({ email }).select("+passwordHash");
  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return fail("Credenciales incorrectas", 401);

  await setAuthCookie(signToken({ id: String(user._id), username: user.username, role: user.role }));
  return json({ user: { id: user._id, username: user.username, role: user.role } });
});
