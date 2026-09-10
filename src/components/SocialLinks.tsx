import { SOCIAL_LINKS } from "@/lib/social";

/**
 * Icons are inline SVG, not an icon library — keeps the footer dependency
 * free for four glyphs, and they inherit currentColor so they follow the
 * theme automatically in both light and dark.
 */
const ICONS: Record<keyof typeof SOCIAL_LINKS, React.ReactNode> = {
  x: (
    <path d="M18.9 2H22l-7.6 8.7L23.3 22h-7.2l-5.6-7.3L4 22H1l8.1-9.3L1 2h7.3l5.1 6.7L18.9 2Zm-1.3 18h2L6.5 4H4.4l13.2 16Z" />
  ),
  instagram: (
    <path d="M12 2.2c3.2 0 3.6 0 4.9.07 1.2.06 2 .25 2.4.42.6.24 1 .53 1.5 1a4.3 4.3 0 0 1 1 1.5c.17.4.36 1.2.42 2.4.06 1.3.07 1.7.07 4.9s0 3.6-.07 4.9c-.06 1.2-.25 2-.42 2.4-.24.6-.53 1-1 1.5a4.3 4.3 0 0 1-1.5 1c-.4.17-1.2.36-2.4.42-1.3.06-1.7.07-4.9.07s-3.6 0-4.9-.07c-1.2-.06-2-.25-2.4-.42a4.1 4.1 0 0 1-1.5-1 4.3 4.3 0 0 1-1-1.5c-.17-.4-.36-1.2-.42-2.4C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.9c.06-1.2.25-2 .42-2.4a4.3 4.3 0 0 1 1-1.5 4.1 4.1 0 0 1 1.5-1c.4-.17 1.2-.36 2.4-.42C8.4 2.21 8.8 2.2 12 2.2Zm0 1.8c-3.15 0-3.52 0-4.76.07-1 .04-1.5.2-1.86.34a2.3 2.3 0 0 0-.87.56 2.3 2.3 0 0 0-.56.87c-.14.36-.3.86-.34 1.86C3.5 8.48 3.5 8.85 3.5 12s0 3.52.07 4.76c.04 1 .2 1.5.34 1.86.13.34.3.6.56.87.26.26.53.43.87.56.36.14.86.3 1.86.34 1.24.06 1.6.07 4.76.07s3.52 0 4.76-.07c1-.04 1.5-.2 1.86-.34.34-.13.6-.3.87-.56.26-.26.43-.53.56-.87.14-.36.3-.86.34-1.86.06-1.24.07-1.6.07-4.76s0-3.52-.07-4.76c-.04-1-.2-1.5-.34-1.86a2.3 2.3 0 0 0-.56-.87 2.3 2.3 0 0 0-.87-.56c-.36-.14-.86-.3-1.86-.34C15.52 4 15.15 4 12 4Zm0 3.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2Zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Zm4.8-2a1.08 1.08 0 1 1 0 2.16 1.08 1.08 0 0 1 0-2.16Z" />
  ),
  facebook: (
    <path d="M13.5 22v-8.4h2.8l.4-3.3h-3.2V8.1c0-.95.27-1.6 1.63-1.6H17V3.5A22 22 0 0 0 14.4 3.4c-2.6 0-4.4 1.6-4.4 4.5v2.4H7.2v3.3H10V22h3.5Z" />
  ),
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.64h.05c.53-.95 1.83-1.94 3.77-1.94 4.03 0 4.78 2.5 4.78 5.76V21h-4v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.44-2.16 2.96V21H10V9Z" />
  ),
};

export default function SocialLinks() {
  const active = (Object.entries(SOCIAL_LINKS) as [keyof typeof SOCIAL_LINKS, string][]).filter(
    ([, url]) => url,
  );

  if (active.length === 0) return null;

  return (
    <ul className="flex items-center gap-3">
      {active.map(([name, url]) => (
        <li key={name}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`The Father Intelligence on ${name === "x" ? "X" : name}`}
            className="flex size-8 items-center justify-center border border-line text-muted transition hover:border-gold/60 hover:text-gold"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden>
              {ICONS[name]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  );
}