# Report automation — setup

## 1. Install the Netlify functions package

```bash
npm i -D @netlify/functions
```

## 2. Database

Run `supabase/automation.sql` in the Supabase SQL editor.

## 3. Prompts

Create `prompts/father-framework.md` and paste the Master Prompt v5.0.
See `prompts/README.md` — in particular, strip any "browse the web"
instruction, since prices now come from real providers.

Add to `.gitignore`:

```
prompts/*.md
!prompts/README.md
```

## 4. Environment variables

See `.env.additions`. Add them to `.env.local` **and** to Netlify.

## 5. Deploy, then test manually before trusting the cron

Scheduled functions only run on published deploys, so test the endpoint
by hand first:

```bash
curl -X POST "https://thefatherintelligence.com/api/generate?desk=markets&slot=full" \
  -H "Authorization: Bearer $GENERATE_API_TOKEN"
```

A good response looks like:

```json
{ "ok": true, "slug": "...", "status": "draft", "verifiedDataPoints": 14, "tookMs": 48210 }
```

Then open `/admin` — the report is waiting as a draft.

**Check `verifiedDataPoints` before trusting anything.** If it is 0 the run
is refused outright; if it is low, a data provider is failing and the
report will be full of ⚪ data-gated markers.

## 6. The schedule (UTC)

| Time | Desk | Slot |
| --- | --- | --- |
| 07:00 Mon–Fri | markets | full Market Universe |
| 09:00 Mon–Fri | markets | live update |
| 11:00 Mon–Fri | markets | live update |
| 12:30 Mon–Fri | markets | data flash (CPI / NFP window) |
| 13:00 Mon–Fri | markets | live update |
| 15:00 Mon–Fri | markets | live update |
| 20:00 Mon–Fri | markets | daily close |
| 10:00 daily   | music   | full report |

Edit the `schedule` in the relevant file under `netlify/functions/`.

## 7. Flipping to auto-publish

Everything lands as a draft while `auto_publish` is `off`. When you are
ready, in Supabase → Table Editor → `site_settings`, set `auto_publish`
to `on`. No deploy needed.

Do not do this on day one. Watch a week of drafts first.
