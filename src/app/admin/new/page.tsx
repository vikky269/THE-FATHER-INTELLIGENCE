import Link from "next/link";
import ReportForm from "@/components/ReportForm";

export default function NewReportPage() {
  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/admin"
          className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase hover:text-gold"
        >
          ← All reports
        </Link>
        <h1 className="font-display mt-5 text-2xl font-bold tracking-[0.06em] text-fg">
          New report
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
          Paste the briefing exactly as it comes out of ChatGPT. Formatting is handled for you.
        </p>
      </div>

      <ReportForm />
    </div>
  );
}
