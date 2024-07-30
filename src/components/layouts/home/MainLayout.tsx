import Link from "next/link";
import React from "react";
import { Button } from "~/components/ui/button";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center space-y-4 bg-gradient-to-b from-[#2e026d] to-[#15162c] px-44 text-white">
      <h3 className="text-center text-6xl font-bold">
        The most comprehensive User Management Platform
      </h3>
      <p className="mx-44 text-center">
        Need more than just a sign-in box? Clerk is a complete suite of
        embeddable UIs, flexible APIs, and admin dashboards to authenticate and
        manage your users.
      </p>

      <div>
        <Link href="/admin">
          <Button>Get Started</Button>
        </Link>
      </div>
    </div>
  );
}
