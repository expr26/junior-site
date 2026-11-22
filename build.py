"""
Static site generator for the junior Maths and Science site (ages 9 to 14).

    python3 build.py        -> dist/   (Cloudflare Pages runs this on every push)

Same approach as examinerprep-generator, kept small on purpose:
  pages/*.html       one file per page; the first line is a JSON header comment, the rest is the page body
  partials/*.html    shared head, header and footer, with {{placeholders}}
  static/            CSS, fonts and JS, copied to /static/
The build stops with an error if a page is missing its title or description, or if two pages share a URL.
Standard library only: no pip install needed.
"""
import html
import json
import re
import shutil
import sys
from datetime import date
from pathlib import Path

import config

HERE = Path(__file__).resolve().parent
PAGES = HERE / "pages"
PARTIALS = HERE / "partials"
STATIC = HERE / "static"
DIST = HERE / "dist"

HEADER_RE = re.compile(r"\A\s*<!--\s*(\{.*?\})\s*-->\s*", re.S)


def fail(msg):
    print(f"BUILD FAILED: {msg}", file=sys.stderr)
    sys.exit(1)


def partial(name):
    return (PARTIALS / name).read_text(encoding="utf-8")


def fill(template, values):
    def sub(m):
        key = m.group(1)
        if key not in values:
            fail(f"unknown placeholder {{{{{key}}}}}")
        return values[key]
    return re.sub(r"\{\{(\w+)\}\}", sub, template)


def url_for(src):
    """pages/index.html -> /, pages/404.html -> /404.html, pages/a/b.html -> /a/b/"""
    rel = src.relative_to(PAGES).with_suffix("")
    if rel.as_posix() == "index":
        return "/"
    if rel.as_posix() == "404":
        return "/404.html"
    if rel.name == "index":
        rel = rel.parent
    return f"/{rel.as_posix()}/"


def out_path(url):
    if url.endswith(".html"):
        return DIST / url.lstrip("/")
    return DIST / url.lstrip("/") / "index.html"


def read_page(src):
    text = src.read_text(encoding="utf-8")
    m = HEADER_RE.match(text)
    if not m:
        fail(f"{src.relative_to(HERE)}: first line must be a JSON header comment, e.g. <!-- {{\"title\": \"...\", \"description\": \"...\"}} -->")
    try:
        meta = json.loads(m.group(1))
    except json.JSONDecodeError as e:
        fail(f"{src.relative_to(HERE)}: bad JSON header ({e})")
    for key in ("title", "description"):
        if not meta.get(key):
            fail(f"{src.relative_to(HERE)}: header needs a non-empty \"{key}\"")
    return meta, text[m.end():]


def beacon():
    if not config.CF_BEACON_TOKEN:
        return ""
    data = html.escape(json.dumps({"token": config.CF_BEACON_TOKEN}), quote=True)
    return (f'<script defer src="https://static.cloudflareinsights.com/beacon.min.js" '
            f'data-cf-beacon="{data}"></script>')


def render(meta, body, url):
    full_title = meta["title"] if meta.get("title_exact") else f'{meta["title"]} | {config.SITE_NAME}'
    canonical = config.SITE_URL.rstrip("/") + ("/" if url == "/" else url)
    values = {
        "lang": config.LANG,
        "title": html.escape(full_title),
        "description": html.escape(meta["description"], quote=True),
        "canonical": html.escape(canonical, quote=True),
        "robots": "noindex" if meta.get("noindex") else "index,follow",
        "site_name": html.escape(config.SITE_NAME),
        "tagline": html.escape(config.TAGLINE),
        "sister_name": html.escape(config.SISTER_NAME),
        "sister_url": config.SISTER_URL,
        "year": str(date.today().year),
        "beacon": beacon(),
        "contact_email": html.escape(config.CONTACT_EMAIL),
    }
    page = fill(partial("layout.html"), {
        "head": fill(partial("head.html"), values),
        "header": fill(partial("header.html"), values),
        "footer": fill(partial("footer.html"), values),
        "body": fill(body, values),
        "lang": values["lang"],
        "body_class": html.escape(meta.get("body_class", ""), quote=True),
    })
    return page


def write_sitemap(urls):
    base = config.SITE_URL.rstrip("/")
    today = date.today().isoformat()
    rows = "".join(f"  <url><loc>{html.escape(base + u)}</loc><lastmod>{today}</lastmod></url>\n" for u in urls)
    (DIST / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + rows + "</urlset>\n", encoding="utf-8")
    (DIST / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {base}/sitemap.xml\n", encoding="utf-8")


def main():
    if DIST.exists():
        shutil.rmtree(DIST)
    DIST.mkdir()
    shutil.copytree(STATIC, DIST / "static")
    for name in ("_headers", "_redirects"):
        if (HERE / name).exists():
            shutil.copy(HERE / name, DIST / name)

    seen, sitemap = {}, []
    for src in sorted(PAGES.rglob("*.html")):
        meta, body = read_page(src)
        url = url_for(src)
        if url in seen:
            fail(f"{src.relative_to(HERE)} and {seen[url]} both make {url}")
        seen[url] = src.relative_to(HERE)
        dest = out_path(url)
        dest.parent.mkdir(parents=True, exist_ok=True)
        dest.write_text(render(meta, body, url), encoding="utf-8")
        if not meta.get("noindex") and url != "/404.html":
            sitemap.append(url)

    write_sitemap(sitemap)
    print(f"built {len(seen)} pages into dist/ ({len(sitemap)} in sitemap)")


if __name__ == "__main__":
    main()
