"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { saveVideoSettings, type FormState } from "@/lib/actions";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className="btn-gold">
      {pending ? "Saving…" : "Save video"}
    </button>
  );
}

export default function SettingsForm({
  youtubeUrl,
  youtubeTitle,
}: {
  youtubeUrl: string;
  youtubeTitle: string;
}) {
  const [state, formAction] = useActionState<FormState, FormData>(saveVideoSettings, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <label className="block">
        <span className="font-mono block text-[10px] tracking-[0.18em] text-muted uppercase">
          YouTube link
        </span>
        <input
          name="youtubeUrl"
          defaultValue={youtubeUrl}
          placeholder="https://www.youtube.com/watch?v=…"
          className="field mt-2.5"
        />
        <span className="mt-2 block text-[11px] leading-relaxed text-muted">
          Any YouTube URL works — watch, youtu.be, shorts or embed. Leave blank to hide the video
          section from the landing page entirely.
        </span>
      </label>

      <label className="block">
        <span className="font-mono block text-[10px] tracking-[0.18em] text-muted uppercase">
          Video heading
        </span>
        <input
          name="youtubeTitle"
          defaultValue={youtubeTitle}
          placeholder="How The Father Intelligence works"
          className="field mt-2.5"
        />
      </label>

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

      {state?.ok && (
        <p
          className="border-l-2 px-4 py-3 text-sm"
          style={{
            borderColor: "var(--signal-positive)",
            color: "var(--signal-positive)",
            background: "color-mix(in srgb, var(--signal-positive) 8%, transparent)",
          }}
        >
          {state.ok}
        </p>
      )}

      <SaveButton />
    </form>
  );
}