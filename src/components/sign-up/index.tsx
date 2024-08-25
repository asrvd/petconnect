import { SignUp } from "@clerk/nextjs";

export default function SignUpComponent() {
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <SignUp
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
        forceRedirectUrl={new URL(
          "/sign-up",
          window.location.origin
        ).toString()}
      />
    </div>
  );
}
