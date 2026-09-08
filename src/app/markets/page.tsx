import DeskArchive from "@/components/DeskArchive";

export const revalidate = 300;

export const metadata = {
  title: "Markets",
  description:
    "Every published Market Universe briefing — gold, FX, rates, energy, equities and crypto. Macro and market analytics for traders and institutions.",
  alternates: { canonical: "/markets" },
};

export default function MarketsPage() {
  return (
    <DeskArchive
      category="markets"
      title="Markets"
      kicker="Every published Market Universe briefing, newest first. Members-only reports open with a preview."
    />
  );
}