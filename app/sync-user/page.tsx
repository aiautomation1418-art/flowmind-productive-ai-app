import { redirect } from "next/navigation";

import { syncCurrentUserToDatabase } from "@/lib/sync-user";

export default async function SyncUserPage() {
  const syncedUser = await syncCurrentUserToDatabase();

  if (!syncedUser) {
    redirect("/sign-in");
  }

  redirect("/");
}
