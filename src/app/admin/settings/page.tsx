import Link from "next/link";
import SettingsForm from "@/components/SettingsForm";
import { getSettings } from "@/lib/settings";

export default async function AdminSettingsPage() {
  const settings = await getSettings(["youtube_url", "youtube_title"]);

  return (
    <div className="max-w-2xl space-y-8">
      <div>
        <Link
          href="/admin"
          className="font-mono text-[10px] tracking-[0.18em] text-muted uppercase hover:text-gold"
        >
          ← All reports
        </Link>
        <h1 className="font-display mt-5 text-2xl font-bold tracking-[0.06em] text-fg">
          Landing page video
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Paste the walkthrough video link here. It appears on the public landing page and updates
          straight away — no redeploy needed.
        </p>
      </div>

      <div className="card px-6 py-7">
        <SettingsForm
          youtubeUrl={settings.youtube_url}
          youtubeTitle={settings.youtube_title || "How The Father Intelligence works"}
        />
      </div>
    </div>
  );
}