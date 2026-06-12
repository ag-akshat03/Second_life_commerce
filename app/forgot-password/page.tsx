"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
    toast.success("Reset link sent (demo)", {
      description: "Check your email for password reset instructions."
    });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="amazon-card">
        <h1 className="text-2xl font-bold">Forgot your password?</h1>
        <p className="mt-2 text-sm text-slate-600">Enter your email and we&apos;ll send a reset link.</p>
        {sent ? (
          <p className="mt-4 text-sm text-amazon-green">
            If an account exists, you will receive an email shortly.{" "}
            <Link href="/login" className="text-amazon-teal underline">
              Back to sign in
            </Link>
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="h-11 w-full rounded border border-slate-200 px-3 dark:border-white/10 dark:bg-slate-950"
            />
            <Button type="submit" className="w-full">
              Send reset link
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
