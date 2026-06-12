import { Suspense } from "react";

import { AuthCard } from "@/components/auth/auth-card";

export const metadata = {
  title: "Create Account"
};

export default function SignupPage() {
  return (
    <div className="min-h-[calc(100vh-260px)] bg-gradient-to-b from-slate-100 to-white px-5 py-12 dark:from-slate-950 dark:to-slate-900">
      <Suspense fallback={null}>
        <AuthCard mode="signup" />
      </Suspense>
    </div>
  );
}
