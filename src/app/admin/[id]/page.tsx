import Link from "next/link";
import { notFound } from "next/navigation";
import ReportForm from "@/components/ReportForm";
import { getById } from "@/lib/db";

export default async function EditReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const report = await getById(id);
  if (!report) notFound();

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
          Edit report
        </h1>
        <p className="font-mono mt-2 text-[11px] text-muted">/{report.slug}</p>
      </div>

      <ReportForm report={report} />
    </div>
  );
}
