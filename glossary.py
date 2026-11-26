"""/glossary/: key words for KS3 Maths and Physics, each with a picture (emoji), a one-line meaning, an example
and a link to practise that topic in the question bank. Made for ages 9 to 14 and for search (DefinedTermSet JSON-LD).

glossary/terms.json: [[subject, qbank topic slug, term, emoji, meaning, example], ...]
Check every meaning by hand; the build checks structure only."""
import html
import json
import re
from pathlib import Path

from topics import ContentError

HERE = Path(__file__).resolve().parent
URL = "/glossary/"


def slug(term):
    return re.sub(r"[^a-z0-9]+", "-", term.lower()).strip("-")


def load():
    import qbank
    plan = json.loads((HERE / "qbank" / "subjects.json").read_text(encoding="utf-8"))["subjects"]
    titles = {(s["slug"], t["slug"]): t["title"] for s in plan for t in s["topics"]}
    rows, seen = [], set()
    for k, r in enumerate(json.loads((HERE / "glossary" / "terms.json").read_text(encoding="utf-8")), 1):
        if len(r) != 6 or not all(isinstance(x, str) and x for x in r):
            raise ContentError(f"glossary/terms.json entry {k}: needs 6 non-empty strings")
        subj, topic, term, icon, meaning, example = r
        if (subj, topic) not in titles:
            raise ContentError(f"glossary/terms.json entry {k} ({term}): unknown topic {subj}/{topic}")
        s = slug(term)
        if s in seen:
            raise ContentError(f"glossary/terms.json: {term!r} is listed twice")
        seen.add(s)
        rows.append({"subject": subj, "topic": topic, "topic_title": titles[(subj, topic)], "term": term, "slug": s,
                     "icon": icon, "meaning": meaning, "example": example, "href": f"{qbank.ROOT}{subj}/{topic}/"})
    return rows


def for_topic(subject, topic):
    """Key words for one question-bank topic, as links into the glossary."""
    ws = [r for r in load() if r["subject"] == subject and r["topic"] == topic]
    if not ws:
        return ""
    return ('<p class="gl-keys"><span>Key words:</span> ' + " ".join(
        f'<a class="gl-key" href="{URL}#{r["slug"]}"><span aria-hidden="true">{r["icon"]}</span> {html.escape(r["term"])}</a>' for r in ws) + "</p>")


def _card(r):
    e = html.escape
    return f"""<article class="gl-card {r['subject']}" id="{r['slug']}" data-q="{e((r['term'] + ' ' + r['meaning'] + ' ' + r['topic_title']).lower())}">
  <span class="gl-pic" aria-hidden="true">{r['icon']}</span>
  <div><h3>{e(r['term'])}</h3><p>{e(r['meaning'])}</p><p class="gl-ex"><b>Example:</b> {e(r['example'])}</p>
  <a class="gl-link" href="{r['href']}">Practise {e(r['topic_title'])} →</a></div>
</article>"""


def page():
    rows = load()
    groups = []
    for subj, name in (("maths", "Maths"), ("physics", "Physics")):
        rs = sorted((r for r in rows if r["subject"] == subj), key=lambda r: r["term"].lower())
        groups.append(f'<section class="gl-group" aria-labelledby="gl-{subj}"><h2 id="gl-{subj}">{name} words <span class="small">({len(rs)})</span></h2>'
                      f'<div class="gl-grid">{"".join(_card(r) for r in rs)}</div></section>')
    ld = {"@context": "https://schema.org", "@type": "DefinedTermSet", "name": "KS3 Maths and Physics glossary for ages 9 to 14",
          "hasDefinedTerm": [{"@type": "DefinedTerm", "name": r["term"], "description": r["meaning"], "url": f"{URL}#{r['slug']}"} for r in rows]}
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › Glossary</p>
    <h1>Maths and Science words</h1>
    <p class="lede">{len(rows)} key words from KS3 Maths and Physics, each with a picture, a short meaning and an example. Tap “Practise” to try questions on it.</p>
    <label class="gl-search"><span aria-hidden="true">🔎</span><span class="sr">Find a word</span>
      <input type="search" id="gl-q" placeholder="Find a word, like fraction or force" autocomplete="off"></label>
    <p class="gl-none note" hidden>No words match. Try a shorter word.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap">{"".join(groups)}</div>
</section>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")}</script>
<script>
(function () {{
  var q = document.getElementById('gl-q'), cards = [].slice.call(document.querySelectorAll('.gl-card')), none = document.querySelector('.gl-none');
  q.addEventListener('input', function () {{
    var t = q.value.trim().toLowerCase(), n = 0;
    cards.forEach(function (c) {{ var ok = !t || c.getAttribute('data-q').indexOf(t) >= 0; c.hidden = !ok; if (ok) n++; }});
    document.querySelectorAll('.gl-group').forEach(function (g) {{ g.hidden = !g.querySelector('.gl-card:not([hidden])'); }});
    none.hidden = n > 0;
  }});
}})();
</script>"""
    meta = {"title": "KS3 Maths and Science glossary with pictures (ages 9 to 14)",
            "description": "Key words in KS3 Maths and Physics explained simply, with a picture and an example for each: fractions, factors, forces, energy, circuits and more."}
    return (URL, meta, body, "glossary/terms.json")


def pages():
    return [page()]
