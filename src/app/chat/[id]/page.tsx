import ChatComponent from "@/components/chat/chat-box";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";

export default async function ChatPage({ params }: { params: { id: string } }) {
  const { userId }: { userId: string | null } = auth();
  if (!userId) return null;

  const conversation = await db.conversation.findUnique({
    where: {
      id: params.id,
    },
  });

  if (!conversation) {
    return null;
  }

  return (
    <ChatComponent
      conversationId={conversation.id}
      postId={conversation.relatedPostId}
      userId={userId}
      receiverId={conversation.users.find((id) => id !== userId)!}
    />
  );
}
