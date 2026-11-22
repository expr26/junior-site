# ExaminerPrep Junior

Maths and Science practice for students aged 9 to 14 (KS2, KS3, Lower Secondary, IB MYP, pre-IGCSE).
Sister site of [examinerprep.com](https://examinerprep.com). Its own playful look (owl logo, Fredoka + IBM Plex Sans).

## Build
```bash
python3 build.py      # writes dist/ ; standard library only, no pip install
python3 -m http.server -d dist 8000   # look at it on http://localhost:8000
```

## Deploy (Cloudflare Pages, Git integration)
Set up once in the Cloudflare dashboard: Workers & Pages → Create → Pages → Connect to Git → `expr26/junior-site`.

| Setting | Value |
|---|---|
| Production branch | `main` |
| Framework preset | None |
| Build command | `python3 build.py` |
| Build output directory | `dist` |

Every push to `main` goes live, and every pull request gets its own preview URL.
Unlike ExaminerPrep there is no second repository for the built output: Cloudflare builds from this one.
### Custom domain: junior.examinerprep.com
Pages project → **Custom domains** → **Set up a custom domain** → `junior.examinerprep.com` → Activate.
If examinerprep.com's DNS is managed by Cloudflare, it adds the `CNAME junior → <project>.pages.dev` record and the HTTPS certificate itself
(if the DNS is elsewhere, add that CNAME at your DNS provider). It usually goes live within a few minutes.
`SITE_URL` in `config.py` must match the domain, because canonical links and the sitemap use it.

`*.pages.dev` addresses are sent with `X-Robots-Tag: noindex` (see `_headers`), so only the real domain is indexed.

## Folders
| Path | What it is |
|---|---|
| `config.py` | Site name, domain, tagline, sister-site link, Cloudflare Web Analytics token. |
| `build.py` | The generator. |
| `pages/` | One `.html` file per page. `pages/a/b.html` becomes `/a/b/`. The first line is a JSON header: `<!-- {"title": "...", "description": "...", "noindex": false} -->`. |
| `partials/` | `layout.html`, `head.html`, `header.html`, `footer.html`. `{{placeholders}}` are filled from `config.py`. |
| `topics/*.json` | One file per topic: units with short Learn cards (with pictures) and practice questions. Format at the top of `topics.py`. |
| `topics.py` | Turns topics into `/<subject>/<topic>/` maps and `/<subject>/<topic>/<unit>/` pages, and draws the pictures as inline SVG. |
| `static/js/game.js` | Stars, levels, streaks, badges, toasts and confetti (localStorage only). |
| `static/js/practice.js` | The practice runner on unit pages. |
| `static/` | CSS, fonts and JS, served at `/static/`. Fonts are copied from examinerprep-generator. |
| `_headers`, `_redirects` | Cloudflare Pages headers (strict CSP) and redirects. |

The build stops if a page has no title or description, uses an unknown `{{placeholder}}`, or two pages make the same URL.

## Lessons
There is no lessons form on the junior site (removed 22 Nov 2026). Parents are pointed to ExaminerPrep (IB, IAL, IGCSE, age 15+) in the
parents section and the footer, with `utm_source=junior`. The old D1 table `inquiries` (migrations/0001_inquiries.sql) is no longer written to.
