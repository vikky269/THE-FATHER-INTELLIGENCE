# Framework prompts

Two files, both git-ignored. These are the product's actual IP — anyone
holding them can reproduce the service.

| File | Used by |
| --- | --- |
| `father-framework.md` | markets desk (`desk=markets`) |
| `music-framework.md`  | music desk (`desk=music`) |

Paste the Master Prompt v5.0 text into `father-framework.md`. For the music
desk, paste whichever prompt produces the Afrobeats reports.

## What to check in the prompt

Remove any instruction telling the model to browse the web for prices. The
API version injects verified data from real providers instead, and leaving
a browse instruction in causes the model to mix fetched numbers with
recalled ones — which is exactly the failure the data layer exists to
prevent.

Keep everything else: the section list, the Truth Protocol markers, the
writing style, the Intelligence Integrity rules.
