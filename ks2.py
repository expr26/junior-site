"""The KS2 corner for ages 9 to 11: /ks2/ lists every topic in topics/*.json with "stage": "ks2", plus the KS2 games.
Each KS2 topic file may add "icon" (an emoji) and "card" (one line for its card here)."""
import html
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent
GAMES = ["times-table-trainer", "clock-fixer", "bar-builder", "roman-code-breaker"]   # games from games/games.json shown in the corner


def pages():
    e = html.escape
    topics = [json.loads(p.read_text(encoding="utf-8")) for p in sorted((HERE / "topics").glob("*.json"))]
    topics = [t for t in topics if t.get("stage") == "ks2"]
    order = ["times-tables", "place-value", "mental-maths", "written-methods", "decimals-and-percentages", "measurement", "telling-the-time", "roman-numerals", "money", "shapes", "graphs-and-data"]
    topics.sort(key=lambda t: order.index(t["slug"]) if t["slug"] in order else 99)
    games = {g["slug"]: g for g in json.loads((HERE / "games" / "games.json").read_text(encoding="utf-8"))["games"]}
    cards = "".join(
        f'<a class="card topic ks2-card" href="/{t["subject"]}/{t["slug"]}/"><span class="ks2-ic" aria-hidden="true">{t.get("icon", "⭐")}</span>'
        f'<span class="tag">{e(t.get("level", "KS2"))}</span><h3>{e(t["title"])}</h3><p>{e(t.get("card", t["intro"]))}</p>'
        f'<span class="go">{len(t["units"])} units · Start →</span></a>' for t in topics)
    play = "".join(
        f'<a class="card game-card maths" href="/games/{s}/" data-game="{s}"><span class="g-icon" aria-hidden="true">{games[s]["icon"]}</span>'
        f'<h3>{e(games[s]["title"])}</h3><p>{e(games[s]["blurb"])}</p><span class="g-stars stars" aria-hidden="true"><i></i><i></i><i></i></span>'
        f'<span class="go">Play →</span></a>' for s in GAMES if games.get(s, {}).get("live"))
    body = f"""
<section class="hero ks2-hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › Ages 9 to 11</p>
    <p class="eyebrow">KS2 · Years 4 to 6 · IB PYP</p>
    <h1>The 9 to 11 corner</h1>
    <p class="lede">Times tables, place value, mental maths, decimals and percentages, measuring, time, money and shapes: the number skills that make secondary school Maths much easier. Short explanations with pictures, then practice with hints. No timer, ever.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap">
    <a class="card ks2-banner" href="/ready-for-year-7/"><span class="ks2-ic" aria-hidden="true">🧭</span><span class="tag">Year 6 · 24 questions</span>
      <h3>Ready for Year 7?</h3><p>A friendly check of the Maths you'll need at secondary school. No timer. See what you're ready for and where to practise.</p><span class="go">Start the check →</span></a>
    <h2>Topics</h2>
    <div class="cards three">{cards}</div>
  </div>
</section>
<section class="section tight">
  <div class="wrap">
    <h2>Play and practise</h2>
    <div class="game-grid">{play}</div>
    <p class="small">Prefer paper? Print a <a href="/printables/times-tables-chart/">times tables chart</a>, a sheet for <a href="/printables/7-times-table/">each times table</a> or a <a href="/printables/">topic worksheet with answers</a>.</p>
    <p class="small">Ready for more? Try the <a href="/maths/fractions/">Fractions</a> path or the <a href="/question-bank/maths/">KS3 Maths questions</a>.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <div class="card parents-note"><h3>For parents</h3>
      <p>These topics follow the National Curriculum for England in Years 4 to 6 and the number strand of the IB Primary Years Programme. Progress is saved only in this browser, with no account and no data sent to us. You can print a summary from the <a href="/parent-report/">report for parents</a>.</p></div>
  </div>
</section>"""
    meta = {"title": "KS2 Maths practice for ages 9 to 11: times tables, place value and more",
            "description": "Free KS2 Maths for Years 4 to 6 and IB PYP: times tables up to 12 × 12, place value, mental maths, telling the time, money and shapes. Pictures, hints and no timer.",
            "body_class": "ks2"}
    return [("/ks2/", meta, body, "ks2.py")]
