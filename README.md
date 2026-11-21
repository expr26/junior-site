# Junior site (working name)

Maths and Science practice for students aged 9 to 14 (KS2, KS3, Lower Secondary, IB MYP, pre-IGCSE).
Sister site of [examinerprep.com](https://examinerprep.com), with the same branding (navy/gold, Playfair Display + IBM Plex Sans).

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
`*.pages.dev` addresses are sent with `X-Robots-Tag: noindex` (see `_headers`), so only the real domain is indexed.

## Folders
| Path | What it is |
|---|---|
| `config.py` | Site name, domain, tagline, sister-site link, Cloudflare Web Analytics token. |
| `build.py` | The generator. |
| `pages/` | One `.html` file per page. `pages/a/b.html` becomes `/a/b/`. The first line is a JSON header: `<!-- {"title": "...", "description": "...", "noindex": false} -->`. |
| `partials/` | `layout.html`, `head.html`, `header.html`, `footer.html`. `{{placeholders}}` are filled from `config.py`. |
| `static/` | CSS, fonts and JS, served at `/static/`. Fonts are copied from examinerprep-generator. |
| `_headers`, `_redirects` | Cloudflare Pages headers (strict CSP) and redirects. |

The build stops if a page has no title or description, uses an unknown `{{placeholder}}`, or two pages make the same URL.
