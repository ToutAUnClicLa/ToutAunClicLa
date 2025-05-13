"use server";

import { auth, clerkClient } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase/client";

export async function createOrUpdateUser() {
  const { userId } = await auth();
  
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const { data: user, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('clerk_id', userId)
    .single();

  if (error || !user) {
    // Create new user
    const clerkUser = await clerkClient.users.getUser(userId);
    
    const { error: insertError } = await supabase
      .from('usuarios')
      .insert({
        clerk_id: userId,
        email: clerkUser.emailAddresses[0].emailAddress,
        first_name: clerkUser.firstName || "",
        last_name: clerkUser.lastName || "",
      });

    if (insertError) {
      throw insertError;
    }
  }

  return user;
}