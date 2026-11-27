"""Science experiments to do at home: /experiments/ and one page per entry in experiments/experiments.json (HowTo JSON-LD).
Keep every experiment safe with household things, and every explanation accurate."""
import html
import json
from pathlib import Path

from topics import ContentError, rich

HERE = Path(__file__).resolve().parent
e = html.escape
NEED = ("slug", "icon", "title", "topic", "time", "mess", "intro", "need", "safety", "steps", "why", "change", "think", "links")


def page(x):
    for k in NEED:
        if not x.get(k):
            raise ContentError(f"experiments/experiments.json {x.get('slug', '?')}: missing \"{k}\"")
    ul = lambda xs: "<ul>" + "".join(f"<li>{rich(i)}</li>" for i in xs) + "</ul>"
    steps = "".join(f'<li class="card"><p>{rich(s)}</p></li>' for s in x["steps"])
    links = " ".join(f'<a class="btn{" ghost" if i else ""}" href="{e(u, quote=True)}">{e(t)}</a>' for i, (t, u) in enumerate(x["links"]))
    ld = {"@context": "https://schema.org", "@type": "HowTo", "name": x["title"], "description": x["intro"], "totalTime": None,
          "supply": [{"@type": "HowToSupply", "name": n} for n in x["need"]],
          "step": [{"@type": "HowToStep", "text": s.replace("**", "")} for s in x["steps"]]}
    ld.pop("totalTime")
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="/experiments/">Experiments</a> › {e(x["title"])}</p>
    <span class="tag sci">Science · {e(x["topic"])}</span>
    <h1><span aria-hidden="true">{x["icon"]}</span> {e(x["title"])}</h1>
    <p class="lede">{rich(x["intro"])}</p>
    <p class="ex-meta"><span>⏱️ {e(x["time"])}</span> <span>🧽 Mess: {e(x["mess"])}</span></p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <div class="card note ex-safe"><h2>⚠️ Stay safe</h2><p>{rich(x["safety"])}</p><p class="small">Always ask an adult before you start.</p></div>
    <div class="card"><h2>You need</h2>{ul(x["need"])}</div>
    <h2>What to do</h2>
    <ol class="pg-acts">{steps}</ol>
    <details class="card ex-why"><summary><b>What happened, and why?</b> <span class="small">(guess first, then open!)</span></summary><p>{rich(x["why"])}</p></details>
    <div class="card"><h2>Be a scientist: change one thing</h2><p>Change just <b>one</b> thing at a time and keep everything else the same. That makes it a <b>fair test</b>.</p>{ul(x["change"])}</div>
    <div class="card"><h2>Think about it</h2>{ul(x["think"])}</div>
    <h2>Learn more</h2>
    <p class="actions">{links}</p>
  </div>
</section>
<script type="application/ld+json">{json.dumps(ld, ensure_ascii=False).replace("</", "<\\/")}</script>"""
    meta = {"title": f"{x['title']}: a science experiment to do at home (ages 9 to 14)", "body_class": "experiment",
            "description": f"{x['intro']} Easy, safe science experiment with everyday things, with a simple explanation of the science ({x['topic']})."}
    return (f"/experiments/{x['slug']}/", meta, body, "experiments/experiments.json")


def hub(xs):
    cards = "".join(f'<a class="card topic" href="/experiments/{x["slug"]}/"><span class="ks2-ic" aria-hidden="true">{x["icon"]}</span>'
                    f'<span class="tag sci">{e(x["topic"])}</span><h3>{e(x["title"])}</h3><p>{e(x["intro"])}</p>'
                    f'<span class="go">⏱️ {e(x["time"])} · Try it →</span></a>' for x in xs)
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › Experiments</p>
    <p class="eyebrow">Science at home</p>
    <h1>Experiments you can do at home</h1>
    <p class="lede">Real science with things from the kitchen and the recycling box. Guess what will happen, try it, then find out why.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap">
    <div class="cards three">{cards}</div>
    <div class="card parents-note"><h3>For parents</h3><p>Every experiment uses everyday household things, with no flames, no hot liquids and no strong chemicals. Each page has a safety note: please read it first and stay nearby, especially for anything with scissors, glass or vinegar. These activities match KS2 and KS3 Science topics, and each one links to practice on this site.</p></div>
  </div>
</section>"""
    meta = {"title": "Easy science experiments to do at home for kids (ages 9 to 14)", "body_class": "experiments",
            "description": "Safe, easy science experiments for kids with everyday things: balloon rockets, paper helicopters, bending water, a fizzy volcano and more, each with a simple explanation."}
    return ("/experiments/", meta, body, "experiments/experiments.json")


def pages():
    try:
        xs = json.loads((HERE / "experiments" / "experiments.json").read_text(encoding="utf-8"))["experiments"]
    except json.JSONDecodeError as err:
        raise ContentError(f"experiments/experiments.json: bad JSON ({err})")
    return [hub(xs)] + [page(x) for x in xs]
