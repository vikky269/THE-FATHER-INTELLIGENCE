-- Adds the auto-publish switch. Run once in the Supabase SQL editor.
-- 'off' means generated reports land as drafts for review.

insert into site_settings (key, value) values
  ('auto_publish', 'off')
on conflict (key) do nothing;
