import { db } from "@/db";
import { users } from "@/db/schema";

export default async function Page() {
  try {
    const [syncedUser] = await db
      .insert(users)
      .values({
        clerkUserId: "test123",
        name: "Ali",
        email: "ali@test.com",
      })
      .returning();

    console.log(syncedUser);

    return (
      <div>
        User Synced
      </div>
    );

  } catch (error) {

    console.log("DATABASE ERROR:");
    console.error(error);

    return (
      <div>
        Error
      </div>
    );
  }
}