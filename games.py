"""Games and simulations: the /games/ page and one page per live game, from games/games.json.

A live game needs static/js/games/<slug>.js (it runs inside the shared shell in static/js/arcade.js).
The build checks structure only; check the maths and science in every game by hand.
"""
import html
import json
from pathlib import Path

from topics import ContentError, mascot

HERE = Path(__file__).resolve().parent
SRC = HERE / "games" / "games.json"
JS = HERE / "static" / "js" / "games"

SUBJECTS = {"maths": "Maths", "science": "Science"}
KINDS = {"game": "Game", "sim": "Simulation"}
LIVE_NEEDS = ("title", "icon", "subject", "kind", "blurb", "learn", "topic", "topic_title", "curriculum")


def load():
    try:
        games = json.loads(SRC.read_text(encoding="utf-8"))["games"]
    except (json.JSONDecodeError, KeyError) as e:
        raise ContentError(f"games/games.json: bad file ({e})")
    seen = set()
    for g in games:
        where = f"games/games.json game {g.get('slug', '?')}"
        if not g.get("slug") or g["slug"] in seen:
            raise ContentError(f"{where}: needs a unique slug")
        seen.add(g["slug"])
        for key in (LIVE_NEEDS if g.get("live") else ("title", "icon", "subject", "kind", "blurb")):
            if not g.get(key):
                raise ContentError(f"{where}: needs \"{key}\"")
        if g["subject"] not in SUBJECTS or g["kind"] not in KINDS:
            raise ContentError(f"{where}: subject must be maths or science, kind must be game or sim")
        if g.get("live") and not (JS / f"{g['slug']}.js").exists():
            raise ContentError(f"{where}: live, but static/js/games/{g['slug']}.js is missing")
    return games


def card(g):
    e = html.escape
    tags = (f'<span class="g-tags"><span class="tag{" sci" if g["subject"] == "science" else ""}">{SUBJECTS[g["subject"]]}</span> '
            f'<span class="tag kind">{KINDS[g["kind"]]}</span></span>')
    inner = (f'<span class="g-icon" aria-hidden="true">{g["icon"]}</span>{tags}<h3>{e(g["title"])}</h3>'
             f'<p>{e(g["blurb"])}</p>')
    if g.get("live"):
        return (f'<a class="card game-card {g["subject"]}" href="/games/{g["slug"]}/" data-game="{g["slug"]}">{inner}'
                f'<span class="g-stars stars" aria-hidden="true"><i></i><i></i><i></i></span><span class="go">Play →</span></a>')
    return (f'<div class="game-soon"><span class="g-icon" aria-hidden="true">{g["icon"]}</span>'
            f'<b>{e(g["title"])}</b><span class="soon-tag">Coming soon</span></div>')


def hub(games):
    rows = []
    for subj, name in SUBJECTS.items():
        mine = [g for g in games if g["subject"] == subj]
        live = "".join(card(g) for g in mine if g.get("live"))
        soon = "".join(card(g) for g in mine if not g.get("live"))
        rows.append(f'<h2>{name}</h2>' + (f'<div class="game-grid">{live}</div>' if live else '')
                    + (f'<div class="soon-grid">{soon}</div>' if soon else ''))
    body = f"""
<section class="hero games-hero">
  <div class="wrap">
    <p class="eyebrow">Games and simulations</p>
    <h1>Play, try things out, learn</h1>
    <p class="lede">Games and science experiments you can play in your browser. Every game earns stars, and there's never a timer.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap">{"".join(rows)}</div>
</section>"""
    return ("/games/", {"title": "Maths and Science games", "body_class": "games",
                        "description": "Free Maths and Science games and simulations for ages 9 to 14, matched to KS3, IB PYP and IB MYP. No sign-up, no ads, no timers."},
            body, "games/games.json")


def game_page(g):
    e = html.escape
    cur = "".join(f"<li><b>{e(k)}:</b> {e(v)}</li>" for k, v in g["curriculum"].items())
    body = f"""
<section class="hero game-hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="/games/">Games</a> › {e(g["title"])}</p>
    <h1><span aria-hidden="true">{g["icon"]}</span> {e(g["title"])}</h1>
    <p class="lede">{e(g["blurb"])}</p>
  </div>
</section>
<section class="section tight play">
  <div class="wrap narrow">
    <div class="runner arcade" id="arcade" aria-live="polite" data-key="game/{g["slug"]}" data-subject="{g["subject"]}">
      <div class="runner-mascot">{mascot()}<p class="bubble">Loading the game…</p></div>
      <noscript><p class="note">This game needs JavaScript switched on.</p></noscript>
    </div>
  </div>
</section>
<section class="section">
  <div class="wrap narrow two-col">
    <div class="card"><h3>What you learn</h3><p>{e(g["learn"])}</p>
      <p><a href="{e(g["topic"], quote=True)}">Practise more: {e(g["topic_title"])} →</a></p></div>
    <div class="card parents-note"><h3>For parents and teachers</h3><ul class="plain">{cur}</ul></div>
  </div>
</section>
<script src="/static/js/arcade.js" defer></script>
<script src="/static/js/games/{g["slug"]}.js" defer></script>"""
    return (f"/games/{g['slug']}/", {"title": f"{g['title']}: a {SUBJECTS[g['subject']]} {KINDS[g['kind']].lower()}", "body_class": "game",
                                     "description": f"{g['blurb']} Free {SUBJECTS[g['subject']]} {KINDS[g['kind']].lower()} for ages 9 to 14."},
            body, f"games/games.json {g['slug']}")


def pages():
    games = load()
    return [hub(games)] + [game_page(g) for g in games if g.get("live")]
