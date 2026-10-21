import { connectDB } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { plain } from "@/lib/utils";
import User from "@/models/User";
import UsersTable from "@/components/UsersTable";

export default async function AdminUsers() {
  const me = await getSession();
  await connectDB();
  const users = plain(await User.find().sort({ createdAt: -1 }).lean());
  return (
    <div>
      <h1 className="mb-6 text-5xl">Usuarios</h1>
      <UsersTable users={users as any} meId={me!.id} />
    </div>
  );
}
