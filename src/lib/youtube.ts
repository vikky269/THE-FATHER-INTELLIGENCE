/**
 * Accepts a YouTube link in any of its shapes, or a bare 11-character ID.
 * Returns null for anything else, which callers use to hide the video
 * section rather than render a broken frame.
 *
 * Lives in lib (not the component) so server actions can validate without
 * pulling a client component into the server bundle.
 */
export function parseYouTubeId(input: string): string | null {
  const raw = input?.trim();
  if (!raw) return null;
  if (/^[\w-]{11}$/.test(raw)) return raw;

  const patterns = [
    /youtu\.be\/([\w-]{11})/,
    /youtube\.com\/watch\?(?:.*&)?v=([\w-]{11})/,
    /youtube\.com\/embed\/([\w-]{11})/,
    /youtube\.com\/shorts\/([\w-]{11})/,
    /youtube\.com\/live\/([\w-]{11})/,
  ];

  for (const p of patterns) {
    const m = raw.match(p);
    if (m) return m[1];
  }
  return null;
}