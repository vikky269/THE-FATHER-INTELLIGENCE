"use client";

import { useState } from "react";
import { parseYouTubeId } from "@/lib/youtube";

export { parseYouTubeId };

/**
 * Click-to-play YouTube embed.
 *
 * Renders a thumbnail until the visitor clicks, then swaps in the iframe.
 * Two reasons: the landing page doesn't pay YouTube's ~1MB player cost on
 * load, and no third-party cookies are set until someone actually chooses
 * to watch. The privacy-enhanced (youtube-nocookie) host is used either way.
 */
export default function VideoEmbed({
  url,
  title = "The Father Intelligence — how it works",
}: {
  url: string;
  title?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const id = parseYouTubeId(url);

  if (!id) return null;

  return (
    <div className="relative aspect-video w-full overflow-hidden border border-line bg-surface">
      {playing ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full cursor-pointer"
          aria-label={`Play video: ${title}`}
        >
          {/* Plain img: no next/image domain config needed for a single thumbnail. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
          />

          <span className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />

          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex size-16 items-center justify-center rounded-full border border-gold/70 bg-black/55 backdrop-blur-sm transition group-hover:scale-110 group-hover:bg-black/70">
              <svg viewBox="0 0 24 24" className="ml-1 size-6 fill-gold-hi" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
        </button>
      )}
    </div>
  );
}