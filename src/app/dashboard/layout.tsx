import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import { Wordmark } from "@/components/ui";
import { requireViewer } from "@/lib/auth";

export const metadata = { title: "Dashboard — The Father Intelligence" };

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const viewer = await requireViewer();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-base/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-3.5">
          <Link href="/dashboard">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-4">
            {viewer.isAdmin && (
              <Link
                href="/admin"
                className="font-mono border border-gold/50 px-4 py-2 text-[10px] tracking-[0.16em] text-gold uppercase transition hover:bg-gold/10"
              >
                Admin
              </Link>
            )}
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
