"""Level checks from diag/*.json, e.g. /ready-for-year-7/: one question per screen, one try each, no hints and no timer.
At the end each area gets "Ready", "Nearly there" or "Practise this first", with links to free practice.
Questions use the same "mc" and "num" types as topics.py (no "hint" needed). Results are saved in js-game-v1 under S.diag."""
import html
import json
from pathlib import Path

from topics import ContentError, figure, parse_number, rich, mascot

HERE = Path(__file__).resolve().parent


def page(path):
    d = json.loads(path.read_text(encoding="utf-8"))
    where = path.relative_to(HERE)
    qs = []
    for k, q in enumerate(d["questions"], 1):
        w = f"{where} question {k}"
        if q.get("area") not in d["areas"]:
            raise ContentError(f"{w}: unknown area {q.get('area')!r}")
        out = {"a": q["area"], "t": q["type"], "q": rich(q["q"]), "explain": rich(q["explain"]), "fig": figure(q.get("fig"), w)}
        if q["type"] == "mc":
            if not isinstance(q.get("answer"), int) or not 0 <= q["answer"] < len(q["options"]):
                raise ContentError(f"{w}: bad answer index")
            out.update(options=[rich(o) for o in q["options"]], answer=q["answer"])
        elif q["type"] == "num":
            if parse_number(q["answer"]) is None:
                raise ContentError(f"{w}: cannot read the answer {q['answer']!r}")
            a = str(q["answer"])
            out.update(answer=a, unit=html.escape(q.get("unit", "")), show=rich("{" + a + "}" if "/" in a else a))
        else:
            raise ContentError(f"{w}: unknown type {q['type']!r}")
        qs.append(out)
    areas = {k: {"name": v["name"], "icon": v["icon"], "links": v["links"],
                 "n": sum(1 for q in d["questions"] if q["area"] == k)} for k, v in d["areas"].items()}
    blob = json.dumps({"slug": d["slug"], "questions": qs, "areas": areas}, ensure_ascii=False).replace("</", "<\\/")
    area_list = "".join(f'<li><span aria-hidden="true">{v["icon"]}</span> {html.escape(v["name"])}</li>' for v in d["areas"].values())
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="/ks2/">Ages 9 to 11</a> › Ready for Year 7?</p>
    <h1>{html.escape(d["title"])}</h1>
    <p class="lede">{rich(d["intro"])}</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <div class="runner diag" id="diag" aria-live="polite">
      <div class="runner-mascot">{mascot()}<p class="bubble">Ready? {len(qs)} questions, about 20 minutes. If you haven't learned something yet, just tap “I haven't learned this yet”. That's useful to know too!</p></div>
      <noscript><p class="note">The check needs JavaScript switched on.</p></noscript>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow two-col">
    <div class="card"><h3>What it checks</h3><ul class="plain diag-areas">{area_list}</ul></div>
    <div class="card parents-note"><h3>For parents</h3>
      <p>This check covers the Year 6 Maths that secondary schools build on in Year 7 (National Curriculum for England; it also fits the last years of the IB PYP). It is not a test and it doesn't give a grade: it shows where your child is confident and where a little practice will help most.</p>
      <p>Results stay in this browser only. Nothing is sent to us. You can print them at the end, or see them later in the <a href="/parent-report/">report for parents</a>.</p></div>
  </div>
</section>
<script type="application/json" id="ddata">{blob}</script>
<script src="/static/js/diag.js" defer></script>"""
    return (f"/{d['slug']}/", {"title": d["seo_title"], "description": d["description"], "body_class": "diag-page"}, body, str(where))


def pages():
    return [page(p) for p in sorted((HERE / "diag").glob("*.json"))]


def index():
    """Area names and question counts per check, for /parent-report/ (written to /static/diag.json)."""
    out = {}
    for p in sorted((HERE / "diag").glob("*.json")):
        d = json.loads(p.read_text(encoding="utf-8"))
        out[d["slug"]] = {"title": d["title"], "href": f"/{d['slug']}/", "areas": {
            k: {"name": v["name"], "n": sum(1 for q in d["questions"] if q["area"] == k), "links": v["links"]} for k, v in d["areas"].items()}}
    return out
