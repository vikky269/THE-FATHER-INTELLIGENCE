import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Authentication is handled by Clerk. Members sign up with an email address
 * and land on /dashboard. A small allow-list decides who can also reach
 * /admin and publish.
 *
 * Two ways to grant admin, so you are never locked out:
 *   1. ADMIN_EMAILS  — comma-separated list in the environment
 *   2. Clerk publicMetadata: { "role": "admin" } on the user
 */

export type Viewer = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
};

function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function getViewer(): Promise<Viewer | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  if (!user) return null;

  const email = user.primaryEmailAddress?.emailAddress?.toLowerCase() ?? "";
  const roleIsAdmin = (user.publicMetadata as { role?: string } | null)?.role === "admin";

  return {
    id: user.id,
    email,
    name: user.firstName ?? user.username ?? email.split("@")[0] ?? "Member",
    isAdmin: roleIsAdmin || (email !== "" && adminEmails().includes(email)),
  };
}

/** For member pages. Middleware already blocks signed-out visitors. */
export async function requireViewer(): Promise<Viewer> {
  const viewer = await getViewer();
  if (!viewer) redirect("/sign-in");
  return viewer;
}

/** For /admin and every publishing action. */
export async function requireAdmin(): Promise<Viewer> {
  const viewer = await requireViewer();
  if (!viewer.isAdmin) redirect("/dashboard?denied=1");
  return viewer;
}
