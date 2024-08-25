/* eslint-disable @next/next/no-img-element */

import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <main className="flex flex-col lg:flex-row items-center h-screen w-full text-center">
      <div className="w-1/2 h-full flex flex-col items-center justify-center">
        <SignIn
          appearance={{
            elements: {
              formContainer: {
                className: "w-full",
              },
              rootBox: "w-full items-center justify-center flex flex-col",
              cardBox: "w-2/3 bg-transparent rounded-none shadow-none p-0",
              card: "bg-transparent rounded-none p-2",
              footer: "bg-transparent bg-none",
            },
          }}
          forceRedirectUrl={"http://localhost:3000/feed"}
        />
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
