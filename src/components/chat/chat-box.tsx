"use client";

import { useState, useEffect } from "react";
import Pusher from "pusher-js";
import { Message } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { sendMessage, getMessages } from "@/app/actions";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRef } from "react";

export default function ChatComponent({
  postId,
  userId,
  conversationId,
  receiverId,
}: {
  postId: string;
  userId: string;
  conversationId: string;
  receiverId: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const { user, isSignedIn } = useUser();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    });

    const channel = pusher.subscribe(`conversation-${conversationId}`);
    channel.bind("new-message", (data: Message) => {
      setMessages((prevMessages) => [data, ...prevMessages]);
    });

    // Fetch initial messages
    getMessages(conversationId).then(setMessages);

    return () => {
      pusher.unsubscribe(`conversation-${conversationId}`);
    };
  }, [conversationId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message = await sendMessage(newMessage, receiverId, conversationId);

    setMessages((prevMessages) => [...prevMessages, message]);

    setNewMessage("");
  };

  return (
    <div className="container relative p-4 min-h-full w-full">
      <div className="flex flex-col gap-4 pb-8 max-h-full min-w-full">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`
            p-2 max-w-[70%] rounded-full px-5
            ${msg.senderId === user?.id ? "bg-blue-100" : "bg-gray-100"}
            ${msg.senderId === user?.id ? "self-end" : "self-start"}
          `}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="w-full sticky bottom-4">
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message"
            className="border p-2 mr-2"
          />
          <Button type="submit">Send</Button>
        </form>
      </div>
    </div>
  );
}
