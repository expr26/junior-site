"""“What is...?” explainer pages for search: /what-is/ lists them, /what-is/<slug>/ explains one idea.

Content: whatis/maths.json and whatis/science.json, a list of
  {slug, icon, name ("a prime number"), title (optional, else "What is <name>?"), short (the answer in one or two sentences),
   fig + fig_note (optional picture from topics.FIGS / EXTRA_FIGS), sections [{h, p}], examples [..], mistake,
   quiz [{q, options, answer, explain}] (2 or 3 questions, shuffled here with a fixed seed), faq [[q, a]],
   practise [label, href], related [glossary slugs]}
Text may use {3/4} fractions and **bold** (topics.rich). Check every fact by hand; the build checks structure only."""
import html
import json
import random
from pathlib import Path

import glossary
import topics
from topics import ContentError

HERE = Path(__file__).resolve().parent
ROOT = "/what-is/"
SUBJECTS = [("maths", "Maths"), ("science", "Science")]
R = topics.rich
E = html.escape


def load():
    out = []
    for subj, _ in SUBJECTS:
        for k, t in enumerate(json.loads((HERE / "whatis" / f"{subj}.json").read_text(encoding="utf-8")), 1):
            where = f"whatis/{subj}.json #{k}"
            for f in ("slug", "icon", "name", "short", "sections", "examples", "mistake", "quiz", "faq", "practise"):
                if not t.get(f):
                    raise ContentError(f"{where}: missing {f!r}")
            for q in t["quiz"]:
                if not 0 <= q["answer"] < len(q["options"]):
                    raise ContentError(f"{where}: quiz answer out of range")
            t["subject"] = subj
            t["title"] = t.get("title") or f"What is {t['name']}?"
            out.append(t)
    slugs = [t["slug"] for t in out]
    if len(slugs) != len(set(slugs)):
        raise ContentError("whatis: a slug is used twice")
    return out


def _quiz(t):
    rnd = random.Random("wi-" + t["slug"])
    items = []
    for i, q in enumerate(t["quiz"]):
        order = list(range(len(q["options"])))
        rnd.shuffle(order)
        btns = "".join(f'<button type="button" class="opt" data-ok="{1 if k == q["answer"] else 0}">{R(q["options"][k])}</button>' for k in order)
        items.append(f'<li class="wi-q card"><p class="q-text">{R(q["q"])}</p><div class="q-options">{btns}</div>'
                     f'<p class="wi-why" hidden>{R(q["explain"])}</p></li>')
    return f'<ol class="wi-quiz plain">{"".join(items)}</ol>'


def page(t, by_slug, gl):
    sec = "".join(f'<div class="card learn-card"><h3>{E(s["h"])}</h3><p>{R(s["p"])}</p></div>' for s in t["sections"])
    fig = ""
    if t.get("fig"):
        fig = topics.figure(t["fig"], f"whatis {t['slug']}") + (f'<p class="small wi-note">{R(t["fig_note"])}</p>' if t.get("fig_note") else "")
    ex = "".join(f"<li>{R(x)}</li>" for x in t["examples"])
    rel = []
    for s in t.get("related", []):
        if s in by_slug and s != t["slug"]:
            rel.append(f'<a class="gl-key" href="{ROOT}{s}/"><span aria-hidden="true">{by_slug[s]["icon"]}</span> {E(by_slug[s]["title"])}</a>')
        elif s in gl:
            rel.append(f'<a class="gl-key" href="{glossary.URL}#{s}"><span aria-hidden="true">{gl[s]["icon"]}</span> {E(gl[s]["term"])}</a>')
        else:
            raise ContentError(f"whatis {t['slug']}: related {s!r} is not a what-is page or a glossary word")
    faq = "".join(f'<details class="card faq"><summary>{E(q)}</summary><p>{R(a)}</p></details>' for q, a in t["faq"])
    ld = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a.replace("{", "").replace("}", "").replace("**", "")}}
        for q, a in [(t["title"], t["short"])] + [tuple(x) for x in t["faq"]]]}, ensure_ascii=False).replace("</", "<\\/")
    subj = dict(SUBJECTS)[t["subject"]]
    body = f"""
<section class="hero wi-hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="{ROOT}">What is...?</a> › {E(t["title"])}</p>
    <p class="eyebrow">{subj} explained · ages 9 to 14</p>
    <h1><span aria-hidden="true">{t["icon"]}</span> {E(t["title"])}</h1>
    <p class="lede wi-short">{R(t["short"])}</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    {fig}
    <div class="learn">{sec}</div>
    <h2>Examples</h2>
    <ul class="wi-ex">{ex}</ul>
    <div class="card wi-mistake"><h3>⚠️ A common mistake</h3><p>{R(t["mistake"])}</p></div>
    <h2>Quick check</h2>
    <p class="small">Tap an answer. There's no timer and no score: it's just to see if it makes sense.</p>
    {_quiz(t)}
    <p class="actions"><a class="btn" href="{t["practise"][1]}">{E(t["practise"][0])} →</a></p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <h2>Questions</h2><div class="faqs">{faq}</div>
    {f'<h2>Related</h2><p class="gl-keys">{" ".join(rel)}</p>' if rel else ""}
    <p class="small">More words with pictures in the <a href="{glossary.URL}">Maths and Science glossary</a>.</p>
  </div>
</section>
<script type="application/ld+json">{ld}</script>
<script src="/static/js/whatis.js" defer></script>"""
    plain = t["short"].replace("{", "").replace("}", "").replace("**", "")
    meta = {"title": f"{t['title']} Explained for kids, with examples", "body_class": "whatis",
            "description": plain if len(plain) <= 160 else plain[:157].rsplit(" ", 1)[0] + "..."}
    return (f"{ROOT}{t['slug']}/", meta, body, f"whatis/{t['subject']}.json")


def pages():
    items = load()
    by_slug = {t["slug"]: t for t in items}
    gl = {r["slug"]: r for r in glossary.load()}
    out = [page(t, by_slug, gl) for t in items]
    groups = ""
    for subj, name in SUBJECTS:
        cards = "".join(f'<a class="card wi-card" href="{ROOT}{t["slug"]}/"><span class="ks2-ic" aria-hidden="true">{t["icon"]}</span>'
                        f'<h3>{E(t["title"])}</h3><p>{R(t["short"].split(". ")[0].rstrip("."))}.</p></a>'
                        for t in sorted((t for t in items if t["subject"] == subj), key=lambda t: t["title"].lower()))
        groups += f'<h2>{name}</h2><div class="cards three">{cards}</div>'
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › What is...?</p>
    <p class="eyebrow">Maths and Science explained · ages 9 to 14</p>
    <h1>What is...?</h1>
    <p class="lede">Big ideas in Maths and Science explained simply: what they mean, examples, a common mistake to avoid and a quick check. Free, with no sign-up.</p>
  </div>
</section>
<section class="section tight"><div class="wrap">{groups}
  <p class="small">Looking for a word that isn't here? Try the <a href="{glossary.URL}">glossary</a> of {len(gl)} words.</p>
</div></section>"""
    meta = {"title": "What is...? Maths and Science explained simply for ages 9 to 14",
            "description": "Simple explanations of key Maths and Science ideas with examples and a quick check: prime numbers, fractions, percentages, forces, gravity, density, photosynthesis and more."}
    return [(ROOT, meta, body, "whatis.py")] + out


def slugs():
    """What-is slugs, so the glossary can link its cards to them."""
    return {t["slug"] for t in load()}


# glossary words that a page explains, besides its own slug (so the glossary card can link to it)
COVERS = {"mean-median-mode-range": ["mean", "median", "mode", "range"], "angle-types": ["acute-angle", "obtuse-angle", "right-angle"],
          "mass-and-weight": ["mass", "weight"], "series-and-parallel-circuits": ["series-circuit", "parallel-circuit"]}


def glossary_links():
    """{glossary slug: what-is url}"""
    out = {}
    for s in slugs():
        for g in [s] + COVERS.get(s, []):
            out[g] = f"{ROOT}{s}/"
    return out
