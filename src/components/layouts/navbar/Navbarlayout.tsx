import { SignOutButton, UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";
import { Button, buttonVariants } from "~/components/ui/button";
import { ButtonProps } from "../../ui/button";

export default async function Navbarlayout() {
  const user = await currentUser();
  // console.log(user);
  return (
    <nav className="flex items-center justify-between bg-slate-700 px-4 py-4 text-white">
      <h1 className="text-2xl font-semibold">Navbar</h1>

      <ul className="flex items-center gap-4 text-white">
        <li>
          <Link href="/">
            <Button variant="link" className="text-white">
              Home
            </Button>
          </Link>
        </li>
        <li>
          {user?.id ? (
            <div className="flex items-center gap-4">
              <h3>Hi, {user.fullName ? user.fullName : user.username}</h3>
              <Button variant="destructive">
                <SignOutButton />
              </Button>
              <UserButton />
            </div>
          ) : (
            <Link href="/sign-in">
              <Button variant="outline" className="text-black">
                Sign In
              </Button>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}
