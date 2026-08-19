/**
 * PASTE NORMALISER
 *
 * Reports are produced in ChatGPT and pasted into the admin form as plain
 * text. That text carries four things standard markdown would destroy:
 *
 *   1. ASCII diagrams   — causal chains, the Hero vs Dragon tree, the
 *                         command-core box. Markdown collapses the runs of
 *                         whitespace that hold them together.
 *   2. Bar meters       — `MACRO SUPPORT  87 █████████░`
 *   3. Tab-separated tables — ChatGPT tables lose their pipes on copy.
 *   4. `⸻` separators   — a two-em dash used as a section rule.
 *
 * This module repairs all four so the pasted report renders the way it
 * looked in the chat. It is deliberately conservative: when a line is
 * ambiguous it is left alone rather than mangled.
 */

const BOX_CHARS = /[─│┌┐└┘├┤┬┴┼╔╗╚╝║═╠╣╦╩╬▀▄█▓▒░]/;
const ARROW_ONLY = /^[\s↓↑→←▲▼│┃├┤└┘┌┐+⚖·]+$/;
const SECTION_RULE = /^\s*[⸻—–]{1,}\s*$/;

/** A line that is unambiguously part of a diagram. */
function isStrongArt(line: string): boolean {
  if (!line.trim()) return false;
  if (BOX_CHARS.test(line)) return true;
  if (ARROW_ONLY.test(line) && /[↓↑→←▲▼]/.test(line)) return true;
  return false;
}

/** A line that is plausibly part of a diagram if its neighbours are. */
function isWeakArt(line: string): boolean {
  const t = line.trim();
  if (!t) return false;
  if (t.includes("|")) return false; // real tables
  if (/^#{1,6}\s/.test(t)) return false; // headings
  if (/^(-{3,}|_{3,}|\*{3,})$/.test(t)) return false; // section rules
  if (/^\s{4,}\S/.test(line)) return true; // deep indent = alignment
  if (/\S {3,}\S/.test(line)) return true; // internal column gaps
  return t.length <= 40; // short label in a chain, e.g. "4,400 ACCEPTANCE"
}

/**
 * Arrow chains are often written with blank lines between each step:
 *
 *     4,395
 *
 *     \u2193
 *
 *     4,400 ACCEPTANCE
 *
 * Closing those gaps turns the chain into one contiguous block so it can be
 * fenced as a single diagram rather than three fragments.
 */
function tightenArrowChains(lines: string[]): string[] {
  const isArrow = (s: string) => ARROW_ONLY.test(s) && /[\u2193\u2191\u2192\u2190\u25b2\u25bc]/.test(s);
  const short = (s: string) => {
    const t = s.trim();
    return t.length > 0 && t.length <= 40 && !t.startsWith("#") && !t.includes("|");
  };

  const drop = new Set<number>();
  for (let i = 0; i < lines.length; i += 1) {
    if (!isArrow(lines[i])) continue;
    if (i - 2 >= 0 && !lines[i - 1].trim() && short(lines[i - 2])) drop.add(i - 1);
    if (i + 2 < lines.length && !lines[i + 1].trim() && short(lines[i + 2])) drop.add(i + 1);
  }
  return lines.filter((_, i) => !drop.has(i));
}

/**
 * Convert runs of tab-separated lines into pipe tables.
 * ChatGPT tables arrive as `Header\tHeader\tHeader` once pasted.
 */
function convertTabTables(lines: string[]): string[] {
  const out: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const hasTabs = (s: string) => s.includes("\t") && s.trim().length > 0;

    if (!hasTabs(lines[i])) {
      out.push(lines[i]);
      i += 1;
      continue;
    }

    // Collect the run
    const run: string[] = [];
    let j = i;
    while (j < lines.length && hasTabs(lines[j])) {
      run.push(lines[j]);
      j += 1;
    }

    const cells = run.map((r) => r.split("\t").map((c) => c.trim()));
    const width = cells[0].length;
    const consistent = run.length >= 2 && cells.every((c) => c.length === width) && width >= 2;

    if (consistent) {
      out.push(`| ${cells[0].join(" | ")} |`);
      out.push(`| ${Array(width).fill("---").join(" | ")} |`);
      for (const row of cells.slice(1)) out.push(`| ${row.join(" | ")} |`);
    } else {
      // Not a clean grid — leave it as-is rather than corrupting it.
      out.push(...run);
    }

    i = j;
  }

  return out;
}

/** Wrap diagram runs in fenced code blocks so whitespace survives. */
function fenceArtBlocks(lines: string[]): string[] {
  const strong = lines.map(isStrongArt);
  const weak = lines.map(isWeakArt);
  const blank = lines.map((l) => !l.trim());
  const inBlock = new Array<boolean>(lines.length).fill(false);

  /** Next non-blank index at or after i. */
  const nextSolid = (i: number) => {
    let k = i;
    while (k < lines.length && blank[k]) k += 1;
    return k;
  };
  const prevSolid = (i: number) => {
    let k = i;
    while (k >= 0 && blank[k]) k -= 1;
    return k;
  };

  for (let i = 0; i < lines.length; i += 1) {
    if (!strong[i]) continue;
    inBlock[i] = true;

    // Downward: absorb contiguous weak lines. Only cross a blank run when
    // the next solid line is itself unambiguous diagram content.
    let k = i + 1;
    while (k < lines.length) {
      if (blank[k]) {
        const n = nextSolid(k);
        if (n < lines.length && strong[n]) {
          for (let b = k; b < n; b += 1) inBlock[b] = true;
          k = n;
          continue;
        }
        break;
      }
      if (!weak[k] && !strong[k]) break;
      inBlock[k] = true;
      k += 1;
    }

    // Upward: same rule, mirrored.
    k = i - 1;
    while (k >= 0) {
      if (blank[k]) {
        const pnb = prevSolid(k);
        if (pnb >= 0 && strong[pnb]) {
          for (let b = pnb + 1; b <= k; b += 1) inBlock[b] = true;
          k = pnb;
          continue;
        }
        break;
      }
      if (!weak[k] && !strong[k]) break;
      inBlock[k] = true;
      k -= 1;
    }
  }

  // Never fence a heading or a section rule, even if it got absorbed.
  for (let i = 0; i < lines.length; i += 1) {
    const t = lines[i].trim();
    if (t.startsWith("#") || /^(-{3,}|_{3,}|\*{3,})$/.test(t)) inBlock[i] = false;
  }

  // Drop blank lines sitting at the edge of a block.
  for (let i = 0; i < lines.length; i += 1) {
    if (!inBlock[i] || lines[i].trim()) continue;
    const prevIn = i > 0 && inBlock[i - 1] && lines[i - 1].trim();
    const nextIn = i < lines.length - 1 && inBlock[i + 1] && lines[i + 1].trim();
    if (!prevIn || !nextIn) inBlock[i] = false;
  }

  // A lone line is not a diagram.
  for (let i = 0; i < lines.length; i += 1) {
    if (!inBlock[i]) continue;
    const prevIn = i > 0 && inBlock[i - 1];
    const nextIn = i < lines.length - 1 && inBlock[i + 1];
    if (!prevIn && !nextIn && !strong[i]) inBlock[i] = false;
  }

  const out: string[] = [];
  let open = false;
  for (let i = 0; i < lines.length; i += 1) {
    if (inBlock[i] && !open) {
      out.push("```text");
      open = true;
    } else if (!inBlock[i] && open) {
      out.push("```");
      open = false;
    }
    out.push(lines[i]);
  }
  if (open) out.push("```");

  return out;
}

/** Promote numbered section titles to real headings. */
function promoteHeadings(lines: string[]): string[] {
  return lines.map((line, i) => {
    const t = line.trim();
    if (!t || t.startsWith("#") || t.startsWith("```")) return line;
    if (t.length > 90) return line;

    const prevBlank = i === 0 || !lines[i - 1].trim();
    const nextBlank = i === lines.length - 1 || !lines[i + 1].trim();
    if (!prevBlank || !nextBlank) return line;

    // "👑 1. EXECUTIVE SUMMARY" / "⚡ 0. WHAT CHANGED SINCE LAST REPORT?"
    if (/^\S*\s*\d{1,2}\.\s+[A-Z0-9]/.test(t)) return `## ${t}`;

    // "🚨 PRIMARY ALPHA" / "😀 PLAN A • CONFIRMED HERO" — short, shouty,
    // free-standing. Sentences (which end in a full stop) are left alone.
    if (t.length <= 60 && !/[.:]$/.test(t) && !BOX_CHARS.test(t) && !t.includes("\t")) {
      const letters = t.replace(/[^\p{L}]/gu, "");
      const upper = t.replace(/[^\p{Lu}]/gu, "");
      if (letters.length >= 4 && upper.length / letters.length >= 0.7) return `### ${t}`;
    }

    return line;
  });
}

/**
 * Turn pasted report text into markdown that renders faithfully.
 * Existing fenced blocks are preserved untouched.
 */
export function normaliseReport(input: string): string {
  const text = input.replace(/\r\n?/g, "\n").trim();

  // Split out any pre-existing fenced blocks so we never double-process them.
  const segments: { fenced: boolean; body: string }[] = [];
  const fenceRe = /```[\s\S]*?```/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = fenceRe.exec(text))) {
    if (m.index > last) segments.push({ fenced: false, body: text.slice(last, m.index) });
    segments.push({ fenced: true, body: m[0] });
    last = m.index + m[0].length;
  }
  if (last < text.length) segments.push({ fenced: false, body: text.slice(last) });

  const processed = segments.map((seg) => {
    if (seg.fenced) return seg.body;

    let lines = seg.body.split("\n").map((l) => (SECTION_RULE.test(l) ? "---" : l));
    lines = tightenArrowChains(lines);
    lines = convertTabTables(lines);
    lines = promoteHeadings(lines); // before fencing, so headings are protected
    lines = fenceArtBlocks(lines);
    return lines.join("\n");
  });

  return processed.join("").replace(/\n{4,}/g, "\n\n\n").trim();
}

/** First non-trivial paragraph, for an auto-suggested excerpt. */
export function suggestExcerpt(input: string, max = 300): string {
  const lines = input.replace(/\r\n?/g, "\n").split("\n");
  for (const line of lines) {
    const t = line.trim();
    if (t.length < 60) continue;
    if (t.includes("\t") || BOX_CHARS.test(t)) continue;
    if (/^(Truth Protocol|v\d)/i.test(t)) continue;
    const clean = t.replace(/^[^\p{L}\p{N}$]+/u, "").trim();
    if (clean.length >= 60) {
      return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
    }
  }
  return "";
}

/** URL-safe slug. */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");
}

/**
 * Cuts a normalised report down to a teaser for non-members.
 *
 * Truncating markdown naively can leave an unclosed code fence, which would
 * swallow the rest of the page into a diagram block, so any odd fence is
 * closed before returning. The cut is also pulled back to the last paragraph
 * break so the teaser doesn't end mid-sentence.
 */
export function previewMarkdown(
  markdown: string,
  maxChars = 1600,
): { preview: string; truncated: boolean } {
  if (markdown.length <= maxChars) return { preview: markdown, truncated: false };

  let cut = markdown.slice(0, maxChars);

  const lastBreak = cut.lastIndexOf("\n\n");
  if (lastBreak > maxChars * 0.5) cut = cut.slice(0, lastBreak);

  // Balance code fences so the teaser can't run away with the layout.
  const fences = (cut.match(/```/g) ?? []).length;
  if (fences % 2 !== 0) cut += "\n```";

  return { preview: cut.trimEnd(), truncated: true };
}
