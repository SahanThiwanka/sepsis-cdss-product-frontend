"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getCurrentUser, clearAuthSession } from "@/lib/auth";
import { User } from "@/types/auth";

const publicRoutes = ["/login", "/model"];

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const [checking, setChecking] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function checkAuth() {
      if (publicRoutes.includes(pathname)) {
        setChecking(false);
        return;
      }

      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        clearAuthSession();
        router.push("/login");
      } finally {
        setChecking(false);
      }
    }

    checkAuth();
  }, [pathname, router]);

  if (checking && !publicRoutes.includes(pathname)) {
    return (
      <main className="min-h-screen bg-slate-100 px-6 py-8 text-slate-900">
        <div className="mx-auto max-w-7xl rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-slate-600">Checking authentication...</p>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}