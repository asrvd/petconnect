/* eslint-disable @next/next/no-img-element */
"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

export function NavMenu() {
  const { isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <img
          src={user?.imageUrl}
          alt="User Avatar"
          className="w-8 h-8 rounded-full"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuItem>
          <Link href="/profile" className="w-full h-full">
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/feed" className="w-full h-full">
            Feed
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href="/chat" className="w-full h-full">
            Chat
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Button onClick={() => signOut()} className="w-full h-full">
            Sign Out
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
