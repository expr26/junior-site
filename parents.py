"""Pages for parents: /parents/ (hub), one help-at-home guide per entry in parents/guides.json, and
/parents/curriculum/ (what children learn in Years 5 to 9, from parents/curriculum.json). Written for parents."""
import html
import json
from pathlib import Path

from topics import ContentError, rich

HERE = Path(__file__).resolve().parent
e = html.escape


def _load(name):
    try:
        return json.loads((HERE / "parents" / name).read_text(encoding="utf-8"))
    except json.JSONDecodeError as err:
        raise ContentError(f"parents/{name}: bad JSON ({err})")


def guide_page(g):
    for k in ("slug", "icon", "title", "short", "description", "years", "why", "learn", "activities", "mistakes", "links"):
        if not g.get(k):
            raise ContentError(f"parents/guides.json {g.get('slug', '?')}: missing \"{k}\"")
    acts = "".join(f'<li class="card"><h3>{e(a[0])}</h3><p>{rich(a[1])}</p></li>' for a in g["activities"])
    links = " ".join(f'<a class="btn{" ghost" if i else ""}" href="{e(u, quote=True)}">{e(t)}</a>' for i, (t, u) in enumerate(g["links"]))
    ld = {"@context": "https://schema.org", "@type": "HowTo", "name": g["title"], "description": g["description"],
          "step": [{"@type": "HowToStep", "name": a[0], "text": a[1].replace("{", "").replace("}", "")} for a in g["activities"]]}
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="/parents/">For parents</a> › {e(g["short"])}</p>
    <p class="eyebrow">For parents · {e(g["years"])}</p>
    <h1><span aria-hidden="true">{g["icon"]}</span> {e(g["title"])}</h1>
    <p class="lede">{rich(g["why"])}</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <div class="card"><h2>What your child learns</h2><ul>{"".join(f"<li>{rich(x)}</li>" for x in g["learn"])}</ul></div>
    <h2>Five things to try at home</h2>
    <ol class="pg-acts">{acts}</ol>
    <div class="card note"><h2>Common mistakes to look out for</h2><ul>{"".join(f"<li>{rich(x)}</li>" for x in g["mistakes"])}</ul>
      <p>When your child makes a mistake, ask them to explain how they got their answer. Spotting the step that went wrong is more useful than being told the right answer, and it keeps mistakes a normal part of learning.</p></div>
    <h2>Free practice on this site</h2>
    <p class="actions">{links}</p>
    <p class="small">No sign-up, no ads, no timers. Progress is saved only in your browser. See it any time in the <a href="/parent-report/">report for parents</a>.</p>
  </div>
</section>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")}</script>"""
    return (f"/parents/{g['slug']}/", {"title": g["title"], "description": g["description"], "body_class": "parents"}, body, "parents/guides.json")


def curriculum_page(c):
    blocks = []
    for st in c["stages"]:
        def lst(rows):
            return "<ul class='cm-list'>" + "".join(
                f'<li>{e(t)}' + (f' <a href="{e(u, quote=True)}" class="cm-go">Practise →</a>' if u else "") + "</li>" for t, u in rows) + "</ul>"
        blocks.append(f"""<section class="card cm-stage" id="{st['id']}">
  <h2>{e(st['name'])} <small>{e(st['age'])} · {e(st['stage'])}</small></h2>
  <div class="cm-cols"><div><h3><span class="tag">Maths</span></h3>{lst(st['maths'])}</div>
  <div><h3><span class="tag sci">Science</span></h3>{lst(st['science'])}</div></div>
</section>""")
    jump = " · ".join(f'<a href="#{st["id"]}">{e(st["name"])}</a>' for st in c["stages"])
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="/parents/">For parents</a> › What they learn</p>
    <p class="eyebrow">For parents</p>
    <h1>What your child learns in Maths and Science, Years 5 to 9</h1>
    <p class="lede">A plain-English map of the National Curriculum for England from Year 5 to Year 9, with links to free practice for each part.</p>
    <p>Jump to: {jump}</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap">{"".join(blocks)}
    <div class="card parents-note"><h3>IB PYP families</h3><p>{e(c['pyp'])}</p></div>
    <p class="small">Years 5 and 6 follow the year-by-year programme of study. Key Stage 3 is a single programme for Years 7 to 9, and each school chooses the order, so your child's school may teach these topics in a different year. Topics without a link are not on this site yet.</p>
  </div>
</section>"""
    return ("/parents/curriculum/", {"title": "What children learn in Maths and Science, Years 5 to 9 (KS2 and KS3)",
                                     "description": "A plain-English guide for parents to the Maths and Science National Curriculum in Years 5, 6 and KS3 (Years 7 to 9), with free practice for each topic.",
                                     "body_class": "parents"}, body, "parents/curriculum.json")


def hub(guides):
    cards = "".join(f'<a class="card topic" href="/parents/{g["slug"]}/"><span class="ks2-ic" aria-hidden="true">{g["icon"]}</span>'
                    f'<h3>{e(g["short"])}</h3><p>{e(g["description"])}</p><span class="go">Read the guide →</span></a>' for g in guides)
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › For parents</p>
    <p class="eyebrow">For parents</p>
    <h1>Helping your child at home</h1>
    <p class="lede">Short, practical guides for parents of 9 to 14 year olds: what your child learns, simple things to try at home, and the mistakes to look out for. No Maths degree needed!</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap">
    <div class="cards three">
      <a class="card topic ks2-banner" href="/parents/curriculum/"><span class="ks2-ic" aria-hidden="true">🗺️</span><h3>What they learn, Years 5 to 9</h3>
        <p>The Maths and Science curriculum in plain English, year by year, with practice links.</p><span class="go">See the map →</span></a>
      <a class="card topic ks2-banner" href="/ready-for-year-7/"><span class="ks2-ic" aria-hidden="true">🧭</span><h3>Ready for Year 7?</h3>
        <p>A friendly 24-question check for Year 6 that shows what your child is ready for.</p><span class="go">Start the check →</span></a>
      <a class="card topic ks2-banner" href="/parent-report/"><span class="ks2-ic" aria-hidden="true">📄</span><h3>Progress report</h3>
        <p>A printable summary of your child's practice on this device.</p><span class="go">Open the report →</span></a>
    </div>
    <h2>Help-at-home guides</h2>
    <div class="cards three">{cards}</div>
    <div class="card parents-note"><h3>Reading help</h3><p>Dyslexia-friendly letters, bigger text, calm mode and questions read aloud work on every page. <a href="/reading-help/">How reading help works</a>.</p></div>
  </div>
</section>"""
    return ("/parents/", {"title": "For parents: helping your child with Maths and Science at home (ages 9 to 14)",
                          "description": "Practical guides for parents of 9 to 14 year olds: times tables, fractions, place value, telling the time, money, shapes and Science at home, plus a Year 5 to 9 curriculum map."
                          , "body_class": "parents"}, body, "parents/guides.json")


def pages():
    guides = _load("guides.json")["guides"]
    return [hub(guides), curriculum_page(_load("curriculum.json"))] + [guide_page(g) for g in guides]
