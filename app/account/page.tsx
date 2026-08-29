import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import { User } from "@/lib/models/User";
import { AccountView } from "@/components/account/account-view";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await connectToDatabase();
  const userId = (session.user as { id?: string }).id;
  const user = await User.findById(userId).lean();

  if (!user) redirect("/login");

  return (
    <AccountView
      name={user.name}
      email={user.email}
      avatarUrl={user.avatarUrl ?? ""}
      memberSince={user.createdAt ? user.createdAt.toISOString() : ""}
    />
  );
}
