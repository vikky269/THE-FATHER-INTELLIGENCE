import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import ThemeToggle from "@/components/ThemeToggle";
import { Wordmark } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";

export const metadata = { title: "Admin — The Father Intelligence" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-line bg-base/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-6 px-5 py-3.5">
          <div className="flex items-center gap-5">
            <Link href="/admin">
              <Wordmark />
            </Link>
            <span className="font-mono border border-gold/50 px-2.5 py-1 text-[9px] tracking-[0.18em] text-gold uppercase">
              Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase hover:text-gold"
            >
              Member view
            </Link>
            <ThemeToggle />
            <UserButton />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-10">{children}</main>
    </div>
  );
}
