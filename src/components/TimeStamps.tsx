"use client";

import { useEffect, useState } from "react";

/**
 * Renders a stored UTC timestamp in the reader's own timezone.
 *
 * This is a client component on purpose. Formatting a date on the server
 * would use the server's timezone (UTC on Netlify), so an admin in Lagos
 * would see times an hour out — and rendering it differently on server and
 * client causes a hydration mismatch. So the server emits nothing and the
 * browser fills it in.
 */
export default function TimeStamp({ iso, prefix = "" }: { iso: string; prefix?: string }) {
  const [text, setText] = useState("");

  useEffect(() => {
    const then = new Date(iso);
    const now = new Date();

    const absolute = then.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const mins = Math.round((now.getTime() - then.getTime()) / 60000);
    let relative: string;

    if (mins < 1) relative = "just now";
    else if (mins < 60) relative = `${mins}m ago`;
    else if (mins < 60 * 24) relative = `${Math.floor(mins / 60)}h ago`;
    else if (mins < 60 * 24 * 7) relative = `${Math.floor(mins / (60 * 24))}d ago`;
    else relative = "";

    setText(relative ? `${absolute} · ${relative}` : absolute);
  }, [iso]);

  // Empty on the server; the browser fills it in on mount.
  if (!text) return <span className="inline-block min-w-[9ch]" />;

  return (
    <span title={new Date(iso).toISOString()}>
      {prefix}
      {text}
    </span>
  );
}