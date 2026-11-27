"""Pages for teachers: /teachers/ (hub) and a free teaching pack per question-bank topic at /teachers/<subject>/<topic>/,
put together from what the site already has (video, game, worksheet with answers, questions, key words) with a 30-minute lesson outline.
No student accounts are needed for anything here."""
import html
import json
from pathlib import Path

import glossary

HERE = Path(__file__).resolve().parent
e = html.escape

GAME = {  # question-bank topic -> the game or simulation for it (games/games.json)
    "maths/place-value-and-rounding": "rounding-rollercoaster", "maths/negative-numbers": "frog-jump",
    "maths/fractions-decimals-percentages": "pizza-fractions", "maths/factors-primes-and-powers": "factor-forest",
    "maths/expressions-and-substitution": "algebra-machine", "maths/equations": "balance-scale", "maths/sequences": "pattern-machine",
    "maths/coordinates-and-graphs": "treasure-map", "maths/ratio-and-proportion": "smoothie-mixer", "maths/angles-and-shapes": "angle-cannon",
    "maths/perimeter-area-and-volume": "garden-designer", "maths/transformations": "shape-shifter", "maths/probability": "spinner-lab",
    "maths/statistics": "data-detective",
    "physics/forces": "ramp-lab", "physics/speed-and-motion": "race-track", "physics/pressure-and-moments": "seesaw-balance",
    "physics/energy-stores-and-transfers": "energy-coaster", "physics/energy-bills-and-power": "power-house", "physics/sound": "sound-studio",
    "physics/light": "mirror-maze", "physics/circuits": "circuit-builder", "physics/static-electricity": "balloon-charge",
    "physics/magnets-and-electromagnets": "magnet-sandbox", "physics/particles-and-density": "float-or-sink", "physics/space": "day-night-seasons", "biology/ecosystems": "food-web-island",
}


def _topics():
    subs = json.loads((HERE / "qbank" / "subjects.json").read_text(encoding="utf-8"))["subjects"]
    games = {g["slug"]: g for g in json.loads((HERE / "games" / "games.json").read_text(encoding="utf-8"))["games"]}
    out = []
    for s in subs:
        for t in s["topics"]:
            f = HERE / "qbank" / s["slug"] / f"{t['slug']}.json"
            if not f.exists():
                continue
            d = json.loads(f.read_text(encoding="utf-8"))
            g = games.get(GAME.get(f"{s['slug']}/{t['slug']}", ""))
            v = HERE / "videos" / s["slug"] / f"{t['slug']}.json"
            vd = json.loads(v.read_text(encoding="utf-8")) if v.exists() else None
            out.append({"s": s, "t": t, "d": d, "game": g if g and g.get("live") else None, "video": vd})
    return out


def pack(x):
    s, t, d, g, v = x["s"], x["t"], x["d"], x["game"], x["video"]
    qb = f"/question-bank/{s['slug']}/{t['slug']}/"
    vurl = f"/videos/{s['slug']}/{t['slug']}/"
    nq = len(d["questions"])
    levels = sorted({q.get("level", 2) for q in d["questions"]})
    subs = "".join(f"<li>{e(p['title'])}</li>" for p in d.get("subtopics", []))
    res = []
    if v:
        chap = len(v.get("chapters", []))
        res.append(f'<li><b>🎬 <a href="{vurl}">Theory video</a></b>: an animated explainer{f" in {chap} chapters" if chap else ""}, narrated, with a quick check after each chapter. Use <b>Big screen</b> to show it on the board.</li>')
    if g:
        res.append(f'<li><b>{g["icon"]} <a href="/games/{g["slug"]}/">{e(g["title"])}</a></b>: {e(g["blurb"])}</li>')
    res.append(f'<li><b>🖨️ <a href="{qb}worksheet/">Printable worksheet with answers</a></b>: all {nq} questions by part, with space to write and an answer page you can keep back.</li>')
    res.append(f'<li><b>✅ <a href="{qb}">Online questions</a></b>: marked instantly with a hint and a worked answer. Filter by part and by level (🌱 Warm-up, 🌿 Core, 🌳 Challenge), or press 🎲 Quick quiz for 10 random questions.</li>')
    keys = glossary.for_topic(s["slug"], t["slug"])
    plan = [("Starter", "5 min", f'Show the first chapter of the <a href="{vurl}">video</a> on the big screen and pause on its quick check. Students answer on mini whiteboards.' if v else
             f'Put a 🌱 Warm-up question from the <a href="{qb}">question bank</a> on the board. Students answer on mini whiteboards.'),
            ("Explain", "10 min", "Play the rest of the video chapter by chapter, stopping to ask “Why?” before each answer is revealed." if v else
             "Teach the key idea using the worked answers in the question bank as examples."),
            ("Practise", "10 min", f'Hand out the <a href="{qb}worksheet/">worksheet</a> (or set the 🌿 Core questions on tablets). Early finishers move to 🌳 Challenge.'),
            ("Check", "5 min", (f'Play a round of <a href="/games/{g["slug"]}/">{e(g["title"])}</a> as a class on the big screen, or press 🎲 Quick quiz.' if g else
                                f'Press 🎲 Quick quiz in the <a href="{qb}">question bank</a> and go through 3 questions together.'))]
    rows = "".join(f'<li class="card"><h3>{e(a)} <small>{e(b)}</small></h3><p>{c}</p></li>' for a, b, c in plan)
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="/teachers/">For teachers</a> › {e(t['title'])}</p>
    <p class="eyebrow">Free teaching pack · KS3 {e(s['title'])}</p>
    <h1><span aria-hidden="true">{t['icon']}</span> {e(t['title'])}: teaching pack</h1>
    <p class="lede">Everything on {e(t['title'].lower())} in one place, ready for the classroom: a video for the board, a game, a printable worksheet with answers and {nq} questions marked instantly.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <div class="card"><h2>What it covers</h2><ul>{subs}</ul>{keys}</div>
    <h2>Resources</h2>
    <ul class="plain tp-res">{"".join(res)}</ul>
    <h2>A 30-minute lesson outline</h2>
    <ol class="pg-acts">{rows}</ol>
    <p class="small">Homework idea: students do the 🌿 Core questions at home. No login: progress saves on their own device, and they can print a report for you or their parents.</p>
    <div class="card parents-note"><h3>Privacy</h3><p>Students don't need accounts and nothing they do here is sent to us: no names, no emails and no tracking cookies. There is no chat and there are no adverts.</p></div>
  </div>
</section>"""
    meta = {"title": f"KS3 {t['title']} teaching pack: free video, game and worksheet", "body_class": "teachers",
            "description": f"Free KS3 {s['title']} teaching resources on {t['title'].lower()}: animated video, interactive game, printable worksheet with answers, {nq} marked questions and a 30-minute lesson outline."}
    return (f"/teachers/{s['slug']}/{t['slug']}/", meta, body, f"qbank/{s['slug']}/{t['slug']}.json")


def hub(xs):
    groups = []
    for subj in ("maths", "physics", "chemistry", "biology"):
        mine = [x for x in xs if x["s"]["slug"] == subj]
        if not mine:
            continue
        cards = "".join(f'<a class="card tp-card" href="/teachers/{x["s"]["slug"]}/{x["t"]["slug"]}/"><span aria-hidden="true">{x["t"]["icon"]}</span> '
                        f'<b>{e(x["t"]["title"])}</b><small>{"🎬 " if x["video"] else ""}{"🎮 " if x["game"] else ""}🖨️ ✅</small></a>' for x in mine)
        groups.append(f'<h2>KS3 {e(mine[0]["s"]["title"])}</h2><div class="tp-grid">{cards}</div>')
    body = f"""
<section class="hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › For teachers</p>
    <p class="eyebrow">For teachers</p>
    <h1>Free classroom resources for KS2 and KS3</h1>
    <p class="lede">Videos for the board, games, printable worksheets with answers and instantly marked questions. No logins, no adverts, nothing to set up.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap">
    <div class="cards three">
      <div class="card"><h3>📽️ Big screen mode</h3><p>On any game, video or question page, press <b>Big screen</b> (on a laptop or desktop) to hide everything else and make it large for a projector or interactive whiteboard. Press Esc to go back.</p></div>
      <div class="card"><h3>🖨️ Worksheets with answers</h3><p>Every KS3 topic has a printable worksheet, with the answers on a separate page you can keep back. Or make your own mix with the <a href="/worksheets/">worksheet maker</a>. For KS2 there are <a href="/printables/">times tables sheets and topic worksheets</a>.</p></div>
      <div class="card"><h3>🔒 No student data</h3><p>Students use everything without accounts. Nothing they do is sent to us, so there's nothing to sign off with your data protection lead.</p></div>
    </div>
    <h2>Teaching packs by topic</h2>
    <p class="small">🎬 video · 🎮 game · 🖨️ worksheet with answers · ✅ online questions</p>
    {"".join(groups)}
    <h2>Ages 9 to 11</h2>
    <p>The <a href="/ks2/">9 to 11 corner</a> has six KS2 topics with explanations and practice, the <a href="/games/times-table-trainer/">Times Table Trainer</a> (no timer), and the <a href="/ready-for-year-7/">Ready for Year 7?</a> check, useful for transition.</p>
  </div>
</section>"""
    meta = {"title": "Free KS2 and KS3 Maths and Science teaching resources", "body_class": "teachers",
            "description": "Free teaching packs for KS3 Maths, Physics, Chemistry and Biology: animated videos for the board, games, printable worksheets with answers and marked questions. No logins, no ads, no student data."}
    return ("/teachers/", meta, body, "teachers.py")


def pages():
    xs = _topics()
    return [hub(xs)] + [pack(x) for x in xs]
