/**
 * Seed: carga personajes y builds oficiales.  Uso:  pnpm seed
 * Requiere MONGODB_URI en .env.local (o .env)
 */
import { config } from "dotenv";
config({ path: ".env.local" });
config();
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/lib/db";
import Character from "../src/models/Character";
import Build from "../src/models/Build";
import Post from "../src/models/Post";
import User from "../src/models/User";
import { CHARACTERS, OFFICIAL_BUILDS } from "../src/data/characters";

async function main() {
  await connectDB();
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  let admin = await User.findOne({ email });
  if (!admin)
    admin = await User.create({ username: "WuwaHub", email, role: "admin", passwordHash: await bcrypt.hash("ChangeMe123!", 12) });

  for (const c of CHARACTERS) {
    const doc = await Character.findOneAndUpdate({ slug: c.slug }, c, { upsert: true, new: true });
    const b = OFFICIAL_BUILDS[c.slug];
    if (b && !(await Build.exists({ character: doc._id, official: true })))
      await Build.create({ ...b, character: doc._id, author: admin._id, official: true });
  }
  if (!(await Post.exists({ kind: "news" })))
    await Post.create({ kind: "news", category: "bienvenida", author: admin._id, title: "Bienvenido a Wuwa Hub",
      body: "Aquí encontrarás builds, guías de ecos y una comunidad para resolver dudas.\n\nLos admins publican banners, eventos y reseñas desde esta sección." });
  console.log(`Seed listo: ${CHARACTERS.length} personajes. Admin: ${email} / ChangeMe123! (cámbiala)`);
  await mongoose.disconnect();
}
main().catch((e) => { console.error(e); process.exit(1); });
