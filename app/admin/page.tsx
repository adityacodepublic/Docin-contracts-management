import { redirect } from "next/navigation";
import { checkRole } from "@/lib/utils/roles";
import { clerkClient } from "@clerk/nextjs/server";
import { removeRole, setRole } from "./_actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";


export default async function AdminDashboard() {
  if (!checkRole("admin")) {
    redirect("/");
  }

  const client = await clerkClient();

  const users = (await client.users.getUserList()).data;

  return (
    <>
      <p className="text-3xl font-bold mb-4 mt-10 text-center py-7 pb-10">
        Manage your Organization&apos;s Users and Roles
      </p>

      <div className="space-y-4 flex items-center justify-center">
        {users.map((user) => {
          return (
            <div
              key={user.id}
              className="flex items-center p-4 border rounded-3xl shadow-md bg-white w-auto space-x-4"
            >
              <Image
                src={user.imageUrl}
                alt={"user image"}
                height={40}
                width={40}
                className="rounded-full mr-4"
              />
              <div>
                <div className="font-medium text-lg">
                  {user.firstName} {user.lastName}
                </div>
                <div className="text-sm text-gray-600">
                  {
                    user.emailAddresses.find(
                      (email) => email.id === user.primaryEmailAddressId
                    )?.emailAddress
                  }
                </div>
                <div className="text-sm text-gray-500">
                  {user.publicMetadata.role as string}
                </div>
              </div>
              <div className="flex ">
                <form
                  action={setRole}
                  method="POST"
                  className="flex items-center space-x-2"
                >
                  <input type="hidden" value={user.id} name="id" />
                  <Input
                    name="role"
                    placeholder="Enter new role"
                    className="border border-gray-300 p-1 px-4 rounded-xl"
                  />
                  <Button variant="secondary" type="submit" className="px-3 rounded-xl">
                    Make Moderator
                  </Button>
                </form>

                <form action={removeRole} className="ml-2">
                  <input type="hidden" value={user.id} name="id" />
                  <Button
                    variant={"secondary"}
                    className="rounded-xl px-3"
                    type="submit"
                  >
                    Remove Role
                  </Button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
