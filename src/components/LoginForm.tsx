"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signIn } from "@/lib/auth";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="btn-gold mt-2 w-full"
    >
      {pending ? "Verifying credentials…" : "Enter the dashboard"}
    </button>
  );
}

export default function LoginForm() {
  const [state, formAction] = useActionState(signIn, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label
          htmlFor="email"
          className="font-mono block text-[10px] tracking-[0.18em] text-muted uppercase"
        >
          Member email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className="field mt-2.5"
          placeholder="you@firm.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="font-mono block text-[10px] tracking-[0.18em] text-muted uppercase"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="field mt-2.5"
          placeholder="••••••••"
        />
      </div>

      {state?.error && (
        <p
          role="alert"
          className="border-l-2 px-4 py-3 text-sm"
          style={{
            borderColor: "var(--signal-negative)",
            color: "var(--signal-negative)",
            background: "color-mix(in srgb, var(--signal-negative) 8%, transparent)",
          }}
        >
          {state.error}
        </p>
      )}

      <SubmitButton />
    </form>
  );
}
