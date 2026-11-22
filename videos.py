"""Theory videos: /videos/ and /videos/<subject>/<topic>/, one short animated explainer per KS3 topic.

A "video" here is an animation drawn in the browser (SVG + JS), not a video file: it is sharp on every screen,
tiny to download, needs no third-party player (so no trackers and no CSP change), and every word is also on the
page as text, which search engines can read. The child presses Play; each step shows a picture and a caption,
read aloud by the device's own voice if they want. After each chapter there is a quick check question
(stars, as everywhere else). There is no timer: the child can pause, go back or skip at any point.

videos/<subject>/<topic>.json, where <subject>/<topic> is a topic in qbank/subjects.json:
  {
    "title": "Forces", "description": "... (for search engines and parents)", "intro": "...",
    "chapters": [
      {"title": "What is a force?",
       "steps": [{"say": "Caption shown and read aloud.", "speak": "optional: what the voice says instead", "do": "scene-name"}, ...],
       "check": {"q": "...", "options": ["...", ...], "answer": 0, "hint": "...", "explain": "..."}},
      ...
    ]
  }
  "do" names a scene function in static/js/videos/<subject>-<topic>.js (it draws onto the stage, see static/js/theory.js).
  A video is live when both files exist. Only live videos are listed: nothing shows as "coming soon".
The build checks structure only. Check every fact by hand.
"""
import html
import json
import re
from pathlib import Path

from topics import ContentError, mascot, question_data, rich

HERE = Path(__file__).resolve().parent
SRC = HERE / "videos"
JS = HERE / "static" / "js" / "videos"
PLAN = HERE / "qbank" / "subjects.json"
ROOT = "/videos/"
CSS = '<link rel="stylesheet" href="/static/css/theory.css">'


def _plan():
    out = {}
    for s in json.loads(PLAN.read_text(encoding="utf-8"))["subjects"]:
        for t in s["topics"]:
            out[(s["slug"], t["slug"])] = (s, t)
    return out


def load():
    """[(subject plan, topic plan, video), ...] in the question bank's order."""
    plan = _plan()
    found = {}
    if SRC.exists():
        for f in sorted(SRC.glob("*/*.json")):
            key = (f.parent.name, f.stem)
            where = f.relative_to(HERE)
            if key not in plan:
                raise ContentError(f"{where}: {key[0]}/{key[1]} is not a topic in qbank/subjects.json")
            try:
                v = json.loads(f.read_text(encoding="utf-8"))
            except json.JSONDecodeError as e:
                raise ContentError(f"{where}: bad JSON ({e})")
            js = JS / f"{key[0]}-{key[1]}.js"
            if not js.exists():
                raise ContentError(f"{where}: static/js/videos/{js.name} is missing")
            code = js.read_text(encoding="utf-8")
            for k in ("title", "description", "intro", "chapters"):
                if not v.get(k):
                    raise ContentError(f"{where}: missing \"{k}\"")
            for n, ch in enumerate(v["chapters"], 1):
                cw = f"{where} chapter {n}"
                if not ch.get("title") or not ch.get("steps"):
                    raise ContentError(f"{cw}: needs \"title\" and \"steps\"")
                for m, st in enumerate(ch["steps"], 1):
                    if not st.get("say") or not st.get("do"):
                        raise ContentError(f"{cw} step {m}: needs \"say\" and \"do\"")
                    if not re.search(r"['\"]" + re.escape(st["do"]) + r"['\"]\s*:", code):
                        raise ContentError(f"{cw} step {m}: scene {st['do']!r} is not in static/js/videos/{js.name}")
                if ch.get("check"):
                    ch["_check"] = question_data(dict(ch["check"], type="mc"), f"{cw} check")
            found[key] = v
    return [(plan[k][0], plan[k][1], found[k]) for k in plan if k in found]


def link(subject, topic):
    """The video's URL for a question-bank topic, or None."""
    return f"{ROOT}{subject}/{topic}/" if (SRC / subject / f"{topic}.json").exists() else None


def _minutes(v):
    words = sum(len(st["say"].split()) for ch in v["chapters"] for st in ch["steps"])
    return max(1, round(words / 110 + len(v["chapters"]) * 0.4))


def _tag(subject):
    return "tag" if subject == "maths" else "tag sci"


def hub(rows):
    e = html.escape
    groups = []
    for subj in ("maths", "physics"):
        mine = [r for r in rows if r[0]["slug"] == subj]
        if not mine:
            continue
        cards = "".join(f"""
      <a class="card tv-card {subj}" href="{ROOT}{s['slug']}/{t['slug']}/" data-tv="{s['slug']}/{t['slug']}">
        <span class="tv-thumb" aria-hidden="true"><span class="tv-icon">{t['icon']}</span><span class="tv-thumb-play">▶</span></span>
        <span class="{_tag(subj)}">KS3 {e(s['title'])}</span>
        <h3>{e(v['title'])}</h3>
        <p>{e(v['intro'])}</p>
        <p class="small">{_minutes(v)} min · {len(v['chapters'])} chapters · quick checks</p>
        <span class="g-stars stars" aria-hidden="true"><i></i><i></i><i></i></span><span class="go">Watch →</span>
      </a>""" for s, t, v in mine)
        groups.append(f'<h2>{e(mine[0][0]["title"])}</h2><div class="tv-grid">{cards}</div>')
    body = CSS + f"""
<section class="hero tv-hero">
  <div class="wrap">
    <p class="crumbs"><a href="/">Home</a> › Videos</p>
    <p class="eyebrow">Theory videos</p>
    <h1>Watch, think, try</h1>
    <p class="lede">Short animated lessons with the owl. Press play, pause whenever you like, and answer a quick question after each part to earn stars.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap">{"".join(groups)}
    <div class="card parents-note"><h3>For parents</h3>
      <p>Each video explains one KS3 topic in small steps, with a quick check after each part and the full text on the page.
      The voice is your device's own reading voice; nothing is sent anywhere. No ads, no autoplay of the next video.</p></div>
  </div>
</section>"""
    return (ROOT, {"title": "KS3 Maths and Physics theory videos", "body_class": "videos",
                   "description": "Free animated KS3 Maths and Physics lessons for ages 9 to 14: short steps, quick checks and stars. No ads, no sign-up."},
            body, "videos/")


def page(s, t, v):
    e = html.escape
    key = f"{s['slug']}/{t['slug']}"
    data = {"key": key, "subject": "maths" if s["slug"] == "maths" else "science",
            "chapters": [{"title": ch["title"],
                          "steps": [{"say": rich(st["say"]), "speak": st.get("speak", ""), "do": st["do"]} for st in ch["steps"]],
                          "check": ch.get("_check")} for ch in v["chapters"]]}
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    chips = "".join(f'<li><button type="button" class="tv-ch" data-ch="{n}"><span class="tv-ch-n">{n + 1}</span> {e(ch["title"])}</button></li>'
                    for n, ch in enumerate(v["chapters"]))
    text = "".join(
        f'<h3>{n}. {e(ch["title"])}</h3>' + "".join(f"<p>{rich(st['say'])}</p>" for st in ch["steps"])
        + (f'<p class="tv-tq"><b>Quick check:</b> {ch["_check"]["q"]} '
           f'<span class="small">(Answer: {ch["_check"]["options"][ch["_check"]["answer"]]})</span></p>' if ch.get("_check") else "")
        for n, ch in enumerate(v["chapters"], 1))
    qb = f"/question-bank/{s['slug']}/{t['slug']}/"
    has_qb = (HERE / "qbank" / s["slug"] / f"{t['slug']}.json").exists()
    body = CSS + f"""
<section class="hero tv-hero {s['slug']}">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="{ROOT}">Videos</a> › {e(v['title'])}</p>
    <span class="{_tag(s['slug'])}">KS3 {e(s['title'])} · {e(t['ks3'])}</span>
    <h1><span aria-hidden="true">{t['icon']}</span> {e(v['title'])}</h1>
    <p class="lede">{rich(v['intro'])}</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <div class="tv" id="tv">
      <div class="tv-screen">
        <svg class="tv-stage" viewBox="0 0 640 360" role="img" aria-label="Animation for this step"></svg>
        <div class="tv-cover">
          <div class="tv-cover-owl">{mascot()}</div>
          <button type="button" class="btn tv-start">▶ Play the video</button>
          <p class="small">{_minutes(v)} minutes · {len(v['chapters'])} chapters · pause any time</p>
        </div>
      </div>
      <div class="tv-bar" role="group" aria-label="Video controls">
        <button type="button" class="tv-b tv-back" aria-label="Back one step">⏮</button>
        <button type="button" class="tv-b tv-play" aria-label="Pause">⏸</button>
        <button type="button" class="tv-b tv-next" aria-label="Next step">⏭</button>
        <span class="tv-seg" aria-hidden="true"></span>
        <button type="button" class="tv-b tv-voice" aria-pressed="true" aria-label="Read aloud">🔊</button>
      </div>
      <p class="tv-cap" aria-live="polite"></p>
      <div class="tv-check" hidden></div>
      <noscript><p class="note">The video needs JavaScript. You can read the whole lesson below.</p></noscript>
    </div>
    <ol class="tv-chapters" aria-label="Chapters">{chips}</ol>
    <p class="actions">{f'<a class="btn" href="{qb}">Practise {e(t["title"])} questions →</a>' if has_qb else ''}<a class="btn ghost" href="{ROOT}">More videos</a></p>
  </div>
</section>
<section class="section alt">
  <div class="wrap narrow">
    <details class="card tv-text"><summary><b>Read the lesson as text</b></summary>{text}</details>
  </div>
</section>
<script type="application/json" id="tvdata">{blob}</script>
<script src="/static/js/theory.js" defer></script>
<script src="/static/js/videos/{s['slug']}-{t['slug']}.js" defer></script>"""
    return (f"{ROOT}{s['slug']}/{t['slug']}/",
            {"title": f"{v['title']}: KS3 {s['title']} video lesson", "description": v["description"], "body_class": "videos tv-page"},
            body, f"videos/{s['slug']}/{t['slug']}.json")


def pages():
    rows = load()
    if not rows:
        return []
    return [hub(rows)] + [page(*r) for r in rows]
