/* eslint-disable @next/next/no-img-element */
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { clerkClient } from "@clerk/nextjs/server";

export default async function ChatPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return null;

  const convos = await db.conversation.findMany({
    where: {
      users: {
        has: userId,
      },
    },
  });

  const convosWithUser = await Promise.all(
    convos.map(async (convo) => {
      const user = await clerkClient.users.getUser(
        convo.users.find((id) => id !== userId)!
      );
      return {
        ...convo,
        user: {
          id: user.id,
          email: user.emailAddresses[0].emailAddress,
          firstName: user.firstName!,
          lastName: user.lastName!,
          username: user.username!,
          avatar: user.imageUrl,
        },
      };
    })
  );

  return (
    <div className="min-w-screen flex justify-start gap-4 min-h-screen">
      <div className="flex flex-col gap-4 w-[25%] p-4 min-h-full justify-start border-r border-border">
        {convosWithUser.map((convo) => (
          <Link key={convo.id} href={`/chat/${convo.id}`}
            className="p-2 rounded-md bg-red-100 hover:bg-red-200 min-w-full"
          >
            <div className="flex gap-4 items-center">
              <img
                src={convo.user.avatar}
                alt="User Avatar"
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="text-lg font-semibold">
                  {convo.user.firstName} {convo.user.lastName}
                </h3>
                <p className="text-sm text-gray-500">{convo.id}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="flex flex-col gap-4 w-[75%] p-4 min-h-full">{children}</div>
    </div>
  );
}
