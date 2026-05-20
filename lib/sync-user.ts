import "server-only";

import { currentUser } from "@clerk/nextjs/server";

import { db, users } from "@/db";

export async function syncCurrentUserToDatabase() {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Authenticated Clerk user does not have an email address.");
  }

  const name =
    clerkUser.fullName ??
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ??
    null;

  const [syncedUser] = await db
    .insert(users)
    .values({
      clerkUserId: clerkUser.id,
      email,
      name: name || null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: users.clerkUserId,
      set: {
        email,
        name: name || null,
        updatedAt: new Date(),
      },
    })
    .returning();

  return syncedUser;
}
