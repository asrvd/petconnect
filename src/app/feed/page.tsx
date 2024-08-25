/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import SearchFilters from "@/components/feed/filters";
import { db } from "@/lib/db";
import { clerkClient } from "@clerk/nextjs/server";

export default async function FeedPage() {
  const posts = await db.adoptionPost.findMany({
    where: {
      status: "PENDING",
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const postsWithUser = await Promise.all(
    posts.map(async (post) => {
      const user = await clerkClient.users.getUser(post.userId);
      return {
        ...post,
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
    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
      <SearchFilters
      postsWithUser={postsWithUser}
      />
    </div>
  );
}
