"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * DEMO AUTHENTICATION ONLY.
 *
 * This checks a hard-coded member list so the dashboard can be demonstrated
 * without a backend. Before this goes anywhere near real subscribers, replace
 * `MEMBERS` with a real user store and swap the plain cookie for a signed,
 * encrypted session (Auth.js, Clerk, Supabase Auth, or your own JWT).
 */

const MEMBERS = [
  { email: "member@thefather.io", password: "goldenthrone", name: "Member" },
  { email: "demo@thefather.io", password: "demo1234", name: "Demo" },
];

const SESSION_COOKIE = "fi_session";

type Session = { email: string; name: string };

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString()) as Session;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function signIn(_prev: { error?: string } | undefined, formData: FormData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Enter your email and password." };
  }

  const member = MEMBERS.find((m) => m.email === email && m.password === password);

  if (!member) {
    return { error: "That email and password don't match a member account." };
  }

  const value = Buffer.from(JSON.stringify({ email: member.email, name: member.name })).toString(
    "base64",
  );

  (await cookies()).set(SESSION_COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect("/dashboard");
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect("/");
}
