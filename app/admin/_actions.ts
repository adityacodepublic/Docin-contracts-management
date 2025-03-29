"use server";

import { checkRole } from "@/lib/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function setRole(formData: FormData) {
  const client = await clerkClient();

  // Check that the user trying to set the role is an admin
  if (!checkRole("admin")) {
    return { message: "Not Authorized" };
  }

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: formData.get("role") },
      }
    );
    revalidatePath("/admin");
    redirect("/admin");
    return { message: JSON.stringify(res.publicMetadata.role) };
  } catch (err) {
    return { error: JSON.stringify(err) };
  }
}

export async function removeRole(formData: FormData) {
  const client = await clerkClient();

  try {
    const res = await client.users.updateUserMetadata(
      formData.get("id") as string,
      {
        publicMetadata: { role: null },
      }
    );
    revalidatePath("/admin");
    redirect("/admin");
    return { message: JSON.stringify(res.publicMetadata.role) };
  } catch (err) {
    return { error: JSON.stringify(err) };
  }
}
