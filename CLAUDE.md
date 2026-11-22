# Rules for this repository
- Site text is in English (UK spelling), friendly for ages 9 to 14. Parent-facing pages speak to parents.
- Maths and Science must be accurate. If unsure about a fact, flag it in the PR instead of guessing.
- Child safety and GDPR: accounts only through a parent, minimum data about children, no chat between children, no ads or ad trackers.
- Plenty of gamification (stars, levels, streaks, badges, celebrations, the owl mascot), as the owner asked on 22 Nov 2026. Still: no leaderboards or comparisons between students, no timers, and reward effort and fixing mistakes, not speed. Progress lives in localStorage (`js-game-v1`, see `static/js/game.js`) until parent accounts exist.
- Content lives in `topics/*.json` (format at the top of `topics.py`). Check every answer by hand; the build checks structure only.
- Pricing, branding and student-facing content are approved by the owner before they go live.
- No phone number as visible text. Keep the CSP in `_headers` strict; add a host only when a feature needs it.
- Small pull requests. Mobile first.
