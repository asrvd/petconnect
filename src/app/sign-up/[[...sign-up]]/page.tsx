/* eslint-disable @next/next/no-img-element */
"use client";

import SignUpComponent from "@/components/sign-up";
import UserTypeFormComponent from "@/components/sign-up/userType";

import { useUser } from "@clerk/nextjs";

export default function Page() {
  const { isLoaded, isSignedIn, user } = useUser();

  return (
    <main className="flex flex-col lg:flex-row items-center h-screen w-full text-center">
      <div className="w-1/2 h-full flex flex-col items-center justify-center">
        {!isSignedIn ? <SignUpComponent /> : <UserTypeFormComponent />}
      </div>
      <div className="w-1/2 h-full">
        {/* <h1 className="text-3xl font-bold">Sign Up</h1>
        <p className="mt-4 text-lg text-gray-500">
          Create an account to get started.
        </p> */}
        <img src="/hero-image.png" alt="Hero Image" className="w-full h-full" />
      </div>
    </main>
  );
}
