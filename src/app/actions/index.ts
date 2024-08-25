"use server";

import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { PostCreateFormValues } from "@/components/feed/create-button";
import { auth } from "@clerk/nextjs/server";
import type { AdoptionRequestFormValues } from "@/components/feed/adoption-request";
import { AdoptionPost } from "@prisma/client";
import Pusher from "pusher";
import { revalidatePath } from "next/cache";
const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
});

export async function creatAdoptionPost(values: PostCreateFormValues) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const post = await db.adoptionPost.create({
    data: {
      petType: values.petType,
      petName: values.petName !== "" ? values.petName : null,
      description: values.description,
      contactEmail: values.contactEmail !== "" ? values.contactEmail : null,
      contactPhone: values.contactPhone !== "" ? values.contactPhone : null,
      location: values.location,
      userId,
      photos: values.photos,
      lat: values.lat,
      lng: values.lng,
    },
  });

  revalidatePath("/feed");

  return post;
}

export async function createAdoptionRequest(
  values: AdoptionRequestFormValues,
  post: AdoptionPost
) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (userId === post.userId) {
    throw new Error("You can't send an adoption request to your own post");
  }

  const request = await db.adoptionRequest.create({
    data: {
      ...values,
      userId,
      adoptionPostId: post.id,
    },
  });

  const convo = await db.conversation.create({
    data: {
      relatedPostId: post.id,
      users: [userId, post.userId],
    },
  });

  const message = await db.message.create({
    data: {
      senderId: userId,
      receiverId: post.userId,
      text: values.message,
      conversationId: convo.id,
    },
  });

  return request;
}

export async function getMessages(conversationId: string) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const messages = await db.message.findMany({
    where: {
      conversationId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  console.log(messages);

  return messages;
}

export async function sendMessage(
  message: string,
  receiverId: string,
  conversationId: string
) {
  const { userId }: { userId: string | null } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  if (userId === receiverId) {
    throw new Error("You can't send a message to yourself");
  }

  // const conversation = await db.conversation.findFirst({
  //   where: {
  //     relatedPostId: postId,
  //     users: {
  //       hasEvery: [userId, receiverId],
  //     },
  //   },
  // });

  // if (!conversation) {
  //   throw new Error("Conversation not found");
  // }

  const messageRecord = await db.message.create({
    data: {
      senderId: userId,
      conversationId: conversationId,
      text: message,
      receiverId,
    },
  });

  pusher.trigger(`conversation-${conversationId}`, "new-message", {
    message: messageRecord,
  });

  return messageRecord;
}

export async function uploadImageToCloudinary(image: File) {
  const url = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`;

  const formData = new FormData();
  const arrayBuffer = await image.arrayBuffer();
  const buffer = new Uint8Array(arrayBuffer);

  formData.append("file", new Blob([buffer]));

  formData.append("upload_preset", process.env.CLOUDINARY_UPLOAD_PRESET!);

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  });

  const data = await response.json();

  return data.secure_url;
}
