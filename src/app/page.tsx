/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col gap-4 bg-[#FBEDEC]">
      <img
        src="/home-image.png"
        alt="Home Image"
        className="w-full object-cover"
      />
      <div className="flex flex-col items-center justify-center gap-4 p-4 pt-0">
        <h1 className="text-[4rem] font-black text-center leading-none">
          Adopt, Don&apos;t Shop!
        </h1>
        <button className="bg-red-200/70 p-2.5 px-5 rounded-md hover:bg-red-300/50 text-xl">
          Get started
        </button>
      </div>
    </main>
  );
}
