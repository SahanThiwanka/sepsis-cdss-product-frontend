"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession, getStoredUser } from "@/lib/auth";
import { User } from "@/types/auth";

type NavItem = {
  href: string;
  label: string;
  roles: string[];
};

const mainNavItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    roles: ["admin", "clinician", "researcher"],
  },
  {
    href: "/predict",
    label: "Prediction",
    roles: ["admin", "clinician"],
  },
  {
    href: "/patients",
    label: "Patients",
    roles: ["admin", "clinician", "researcher"],
  },
  {
    href: "/alerts",
    label: "Alerts",
    roles: ["admin", "clinician", "researcher"],
  },
];

const moreNavItems: NavItem[] = [
  {
    href: "/users",
    label: "Users",
    roles: ["admin"],
  },
  {
    href: "/audit-logs",
    label: "Audit Logs",
    roles: ["admin"],
  },
  {
    href: "/model",
    label: "Model Info",
    roles: ["admin", "clinician", "researcher"],
  },
  {
    href: "/system-health",
    label: "System Health",
    roles: ["admin", "clinician", "researcher"],
  },
  {
    href: "/safety",
    label: "Safety",
    roles: ["admin", "clinician", "researcher"],
  },
  {
  href: "/backup",
  label: "Backup Guide",
  roles: ["admin"],
  },
];

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setUser(getStoredUser());
    setMoreOpen(false);
  }, [pathname]);

  function handleLogout() {
    clearAuthSession();
    setUser(null);
    setMoreOpen(false);
    router.push("/login");
    router.refresh();
  }

  const visibleMainItems = user
    ? mainNavItems.filter((item) => item.roles.includes(user.role))
    : [];

  const visibleMoreItems = user
    ? moreNavItems.filter((item) => item.roles.includes(user.role))
    : moreNavItems.filter((item) => item.href === "/model");

  const isMoreActive = visibleMoreItems.some((item) => item.href === pathname);

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="min-w-fit">
          <p className="text-sm font-semibold text-blue-700">Sepsis CDSS</p>
          <h1 className="text-lg font-bold text-slate-900">
            Early Sepsis Risk Prediction
          </h1>
        </Link>

        <nav className="flex items-center gap-2">
          {visibleMainItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 ${
                pathname === item.href
                  ? "bg-slate-100 text-blue-700"
                  : "text-slate-700"
              }`}
            >
              {item.label}
            </Link>
          ))}

          {visibleMoreItems.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMoreOpen((current) => !current)}
                className={`rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 ${
                  isMoreActive
                    ? "bg-slate-100 text-blue-700"
                    : "text-slate-700"
                }`}
              >
                More ▾
              </button>

              {moreOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                  {visibleMoreItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 ${
                        pathname === item.href
                          ? "bg-slate-100 text-blue-700"
                          : "text-slate-700"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {user ? (
            <div className="ml-3 flex items-center gap-3 border-l border-slate-200 pl-3">
              <div className="hidden text-right md:block">
                <p className="text-sm font-semibold text-slate-900">
                  {user.full_name || user.username}
                </p>
                <p className="text-xs capitalize text-slate-500">
                  {user.role}
                </p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="ml-3 rounded-lg bg-blue-700 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-800"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}