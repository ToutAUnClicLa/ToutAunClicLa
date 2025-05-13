"use server";

import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

export async function createOrUpdateUser() {
  const { userId } = auth();
  
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await db.usuarios.findUnique({
    where: {
      clerk_id: userId
    }
  });

  if (!user) {
    // Create new user
    const clerkUser = await clerkClient.users.getUser(userId);
    
    await db.usuarios.create({
      data: {
        clerk_id: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        first_name: clerkUser.firstName || "",
        last_name: clerkUser.lastName || "",
      }
    });
  }

  return user;
}