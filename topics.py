"""
Topic pages from topics/*.json.

Each topic file makes:
  /<subject>/<topic>/           the topic map (units with stars, a picture, where to start)
  /<subject>/<topic>/<unit>/    one unit: short "Learn" cards with pictures, then a practice set (static/js/practice.js)

Optional topic fields:
  "stage": "ks2"   the topic belongs to the 9 to 11 corner (/ks2/, see ks2.py); "icon" and "card" are used for its card there
  "seo_title"      the <title> of the topic map, if the default "<title>: practice for ages 9 to 14" is not good enough
Text fields may use:
  {3/4}       a stacked fraction (read out as "3 over 4")
  **bold**    bold
Figures ("fig") are drawn here as inline SVG, so pages need no images. Types are in FIGS below.

Question types:
  mc    "options": [...], "answer": index of the right option (options are shuffled in the browser)
  num   "answer": "3/4" or "12" or "2.5"; the student can type a fraction, a mixed number (1 1/2), a whole number or a decimal.
        "simplest": true  means only the fraction in its simplest form counts (e.g. {2/4} is not accepted for {1/2})
        "unit": "kg"      shown after the box
Every question needs "hint" (shown after a first wrong try) and "explain" (shown after the answer).
The build stops on a missing field, a bad answer index, or a numeric answer it cannot read.
"""
import html
import json
import math
import re
from fractions import Fraction
from pathlib import Path

HERE = Path(__file__).resolve().parent
TOPICS = HERE / "topics"
SUBJECTS = {"maths": "Maths", "science": "Science"}


class ContentError(Exception):
    pass


# ---------- text ----------
def rich(text):
    """Escape, then allow {a/b} fractions, **bold** and line breaks."""
    t = html.escape(str(text), quote=False)
    t = re.sub(r"\{(\d+)/(\d+)\}",
               lambda m: f'<span class="fr" role="img" aria-label="{m[1]} over {m[2]}"><span>{m[1]}</span><span>{m[2]}</span></span>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", t)
    return t.replace("\n", "<br>")


# ---------- figures (inline SVG) ----------
SHADE, LINE, EMPTY = "var(--gold-lt)", "var(--gold)", "var(--card)"


def _svg(w, h, inner, label, cls="fig"):
    return (f'<svg class="{cls}" viewBox="0 0 {w} {h}" width="{w}" height="{h}" role="img" aria-label="{html.escape(label, quote=True)}">'
            f'{inner}</svg>')


def fig_pie(n, d, size=120, **_):
    r, c = size / 2 - 4, size / 2
    parts = []
    if d == 1:
        parts.append(f'<circle cx="{c}" cy="{c}" r="{r}" fill="{SHADE if n else EMPTY}" stroke="{LINE}" stroke-width="3"/>')
    else:
        for i in range(d):
            a0, a1 = 2 * math.pi * i / d - math.pi / 2, 2 * math.pi * (i + 1) / d - math.pi / 2
            x0, y0, x1, y1 = c + r * math.cos(a0), c + r * math.sin(a0), c + r * math.cos(a1), c + r * math.sin(a1)
            big = 1 if (a1 - a0) > math.pi else 0
            parts.append(f'<path d="M{c} {c} L{x0:.2f} {y0:.2f} A{r} {r} 0 {big} 1 {x1:.2f} {y1:.2f} Z" '
                         f'fill="{SHADE if i < n else EMPTY}" stroke="{LINE}" stroke-width="3" stroke-linejoin="round"/>')
    return _svg(size, size, "".join(parts), f"A circle cut into {d} equal parts with {n} shaded")


def fig_bar(n, d, width=280, height=48, label=None, **_):
    w = (width - 6) / d
    parts = [f'<rect x="{3 + i * w:.2f}" y="3" width="{w:.2f}" height="{height - 6}" fill="{SHADE if i < n else EMPTY}" '
             f'stroke="{LINE}" stroke-width="3"/>' for i in range(d)]
    return _svg(width, height, "".join(parts), label or f"A bar cut into {d} equal parts with {n} shaded")


def fig_bars(rows, width=280, **_):
    """Several bars of the same length, one under another, for comparing. rows: [{"n":1,"d":2,"label":"1/2"}, ...]"""
    h, gap, lab = 40, 14, 56
    parts, desc = [], []
    for k, row in enumerate(rows):
        y = k * (h + gap)
        w = (width - lab - 6) / row["d"]
        for i in range(row["d"]):
            parts.append(f'<rect x="{lab + 3 + i * w:.2f}" y="{y + 3}" width="{w:.2f}" height="{h - 6}" '
                         f'fill="{SHADE if i < row["n"] else EMPTY}" stroke="{LINE}" stroke-width="3"/>')
        parts.append(f'<text x="{lab - 12}" y="{y + h / 2 + 7}" text-anchor="end" font-size="20" font-weight="700" '
                     f'fill="var(--navy)">{html.escape(row.get("label") or "%d/%d" % (row["n"], row["d"]))}</text>')
        desc.append(f'{row["n"]} of {row["d"]} parts')
    return _svg(width, len(rows) * (h + gap) - gap + 2, "".join(parts), "Bars of the same length: " + "; ".join(desc))


def fig_nline(d, mark=None, max=1, width=300, **_):
    """Number line from 0 to max with a tick every 1/d; optional arrow at mark (in d-ths)."""
    x0, x1, y = 20, width - 20, 40
    steps = d * max
    parts = [f'<line x1="{x0}" y1="{y}" x2="{x1}" y2="{y}" stroke="var(--navy)" stroke-width="3"/>']
    for i in range(steps + 1):
        x = x0 + (x1 - x0) * i / steps
        whole = i % d == 0
        parts.append(f'<line x1="{x:.2f}" y1="{y - (12 if whole else 7)}" x2="{x:.2f}" y2="{y + (12 if whole else 7)}" '
                     f'stroke="var(--navy)" stroke-width="{3 if whole else 2}"/>')
        if whole:
            parts.append(f'<text x="{x:.2f}" y="{y + 34}" text-anchor="middle" font-size="18" font-weight="700" fill="var(--navy)">{i // d}</text>')
    label = f"A number line from 0 to {max} split into steps of one {d}th"
    if mark is not None:
        x = x0 + (x1 - x0) * mark / steps
        parts.append(f'<path d="M{x:.2f} {y - 14} l-9 -16 h18 z" fill="var(--fun)"/>')
        label += ", with an arrow at one of the marks"
    return _svg(width, 82, "".join(parts), label)


def fig_dots(total, groups, shade=0, **_):
    """total dots split into equal groups (one row each); the first `shade` groups are coloured."""
    per = total // groups
    r, gx, gy = 11, 30, 34
    width = max(per * gx + 24, 120)
    parts = []
    for g in range(groups):
        y = 20 + g * gy
        parts.append(f'<rect x="4" y="{y - 15}" width="{per * gx + 12}" height="30" rx="15" fill="none" stroke="var(--line)" stroke-width="2"/>')
        for i in range(per):
            on = g < shade
            parts.append(f'<circle cx="{22 + i * gx}" cy="{y}" r="{r}" fill="{"var(--fun)" if on else EMPTY}" stroke="var(--fun)" stroke-width="2.5"/>')
    return _svg(width, groups * gy + 6, "".join(parts),
                f"{total} dots in {groups} equal rows of {per}; {shade} row{'s' if shade != 1 else ''} coloured")


def fig_pies(items, **_):
    """Several small pies side by side: items [[n,d], ...]"""
    return '<span class="fig-row">' + "".join(fig_pie(n, d, size=96) for n, d in items) + "</span>"


FIGS = {"pie": fig_pie, "bar": fig_bar, "bars": fig_bars, "nline": fig_nline, "dots": fig_dots, "pies": fig_pies}
EXTRA_FIGS = {}   # other modules (e.g. science pictures) register here

import science_figs  # noqa: E402
EXTRA_FIGS.update(science_figs.FIGS)
import ks2_figs  # noqa: E402
EXTRA_FIGS.update(ks2_figs.FIGS)


def figure(spec, where):
    if not spec:
        return ""
    kind = spec.get("type")
    fn = FIGS.get(kind) or EXTRA_FIGS.get(kind)
    if not fn:
        raise ContentError(f"{where}: unknown figure type {kind!r}")
    args = {k: v for k, v in spec.items() if k != "type"}
    try:
        return f'<div class="figbox">{fn(**args)}</div>'
    except TypeError as e:
        raise ContentError(f"{where}: figure {kind!r}: {e}")


# ---------- answers ----------
def parse_number(s):
    """'3/4', '1 1/2', '12', '2.5' -> Fraction, or None."""
    s = str(s).strip().replace("−", "-")
    m = re.fullmatch(r"(-?\d+)\s+(\d+)/(\d+)", s)
    if m:
        whole, a, b = int(m[1]), int(m[2]), int(m[3])
        return None if b == 0 else Fraction(whole) + (Fraction(a, b) if whole >= 0 else -Fraction(a, b))
    m = re.fullmatch(r"(-?\d+)/(\d+)", s)
    if m:
        return None if int(m[2]) == 0 else Fraction(int(m[1]), int(m[2]))
    try:
        return Fraction(s)
    except (ValueError, ZeroDivisionError):
        return None


# ---------- pages ----------
def _need(obj, keys, where):
    for k in keys:
        if obj.get(k) in (None, "", []):
            raise ContentError(f"{where}: missing \"{k}\"")


def question_data(q, where):
    _need(q, ("type", "q", "hint", "explain"), where)
    out = {"t": q["type"], "q": rich(q["q"]), "hint": rich(q["hint"]), "explain": rich(q["explain"]),
           "fig": figure(q.get("fig"), where)}
    if q["type"] == "mc":
        _need(q, ("options",), where)
        if not isinstance(q.get("answer"), int) or not 0 <= q["answer"] < len(q["options"]):
            raise ContentError(f"{where}: \"answer\" must be the index of an option (0 to {len(q['options']) - 1})")
        out["options"] = [rich(o) for o in q["options"]]
        out["answer"] = q["answer"]
    elif q["type"] == "num":
        _need(q, ("answer",), where)
        val = parse_number(q["answer"])
        if val is None:
            raise ContentError(f"{where}: cannot read the answer {q['answer']!r}")
        if q.get("simplest") and "/" in str(q["answer"]):
            a, b = str(q["answer"]).split("/")
            if Fraction(int(a), int(b)).denominator != int(b):
                raise ContentError(f"{where}: answer {q['answer']} is marked simplest but is not in simplest form")
        out.update(answer=str(q["answer"]), simplest=bool(q.get("simplest")), unit=html.escape(q.get("unit", "")),
                   show=rich(q.get("show", q["answer"] if "/" not in str(q["answer"]) else "{" + str(q["answer"]) + "}")))
    else:
        raise ContentError(f"{where}: unknown question type {q['type']!r}")
    return out


STARS = '<span class="stars" data-stars="{key}" aria-label="Stars earned"><i></i><i></i><i></i></span>'


def mascot():
    return (HERE / "partials" / "mascot.svg").read_text(encoding="utf-8")


def topic_pages(path):
    t = json.loads(path.read_text(encoding="utf-8"))
    where = path.relative_to(HERE)
    _need(t, ("slug", "subject", "title", "description", "intro", "units"), where)
    if t["subject"] not in SUBJECTS:
        raise ContentError(f"{where}: subject must be one of {list(SUBJECTS)}")
    base = f"/{t['subject']}/{t['slug']}/"
    subject = SUBJECTS[t["subject"]]
    tag = "tag" if t["subject"] == "maths" else "tag sci"
    ks2 = t.get("stage") == "ks2"
    crumb = '<a href="/ks2/">Ages 9 to 11</a>' if ks2 else subject
    pages = []

    # topic map
    cards = []
    for i, u in enumerate(t["units"], 1):
        _need(u, ("slug", "title", "blurb", "learn", "questions"), f"{where} unit {i}")
        key = f"{t['slug']}/{u['slug']}"
        cards.append(f'<li><a class="unit-card" href="{base}{u["slug"]}/" data-unit="{key}">'
                     f'<span class="unit-num">{i}</span><span class="unit-txt"><b>{html.escape(u["title"])}</b>'
                     f'<span>{rich(u["blurb"])}</span></span>{STARS.format(key=key)}</a></li>')
    hub = f"""
<section class="hero topic-hero">
  <div class="wrap hero-grid">
    <div>
      <p class="crumbs"><a href="/">Home</a> › {crumb}</p>
      <span class="{tag}">{subject} · {html.escape(t.get("level", ""))}</span>
      <h1>{html.escape(t["title"])}</h1>
      <p class="lede">{rich(t["intro"])}</p>
      <p class="actions"><a class="btn" href="{base}{t['units'][0]['slug']}/" data-start="{t['slug']}">Start the first unit</a></p>
    </div>
    <div class="hero-art">{figure(t.get("hero_fig"), where)}</div>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <h2>Your path</h2>
    <ol class="unit-path" data-topic="{t['slug']}">{"".join(cards)}</ol>
    <p class="small">Earn up to 3 stars in each unit. You can go back and try again as often as you like.</p>
  </div>
</section>"""
    pages.append((base, {"title": t.get("seo_title") or f"{t['title']}: practice for ages 9 to 14", "description": t["description"],
                         "body_class": "topic", "noindex": t.get("noindex", False)}, hub, where))

    # units
    for i, u in enumerate(t["units"]):
        uw = f"{where} unit {u['slug']}"
        learn = []
        for k, card in enumerate(u["learn"]):
            _need(card, ("h", "p"), f"{uw} learn {k + 1}")
            learn.append(f'<div class="card learn-card"><h3>{rich(card["h"])}</h3>{figure(card.get("fig"), uw)}'
                         f'<p>{rich(card["p"])}</p></div>')
        qs = [question_data(q, f"{uw} question {k + 1}") for k, q in enumerate(u["questions"])]
        nxt = t["units"][i + 1] if i + 1 < len(t["units"]) else None
        data = {"topic": t["slug"], "unit": u["slug"], "key": f"{t['slug']}/{u['slug']}", "subject": t["subject"],
                "title": u["title"], "questions": qs, "units": len(t["units"]), "topicUnits": [x["slug"] for x in t["units"]],
                "next": {"href": f"{base}{nxt['slug']}/", "title": nxt["title"]} if nxt else {"href": base, "title": "Back to the topic map"}}
        blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
        body = f"""
<section class="hero unit-hero">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › {crumb + " › " if ks2 else ""}<a href="{base}">{html.escape(t["title"])}</a> › Unit {i + 1}</p>
    <h1>{html.escape(u["title"])}</h1>
    <p class="lede">{rich(u["blurb"])}</p>
    <p><a class="btn ghost" href="#practise">Skip to practice ↓</a></p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <h2>Learn</h2>
    <div class="learn">{"".join(learn)}</div>
  </div>
</section>
<section class="section practise" id="practise">
  <div class="wrap narrow">
    <h2>Practise</h2>
    <div class="runner" id="runner" aria-live="polite">
      <div class="runner-mascot">{mascot()}<p class="bubble">Ready? {len(qs)} questions. Take your time: there's no timer!</p></div>
      <noscript><p class="note">Practice needs JavaScript switched on.</p></noscript>
    </div>
  </div>
</section>
<script type="application/json" id="qdata">{blob}</script>
<script src="/static/js/practice.js" defer></script>"""
        pages.append((f"{base}{u['slug']}/", {"title": f"{u['title']} ({t['title']})", "description": u.get("description", u["blurb"]),
                                              "body_class": "unit", "noindex": t.get("noindex", False)}, body, uw))
    return pages


def pages():
    out = []
    for path in sorted(TOPICS.glob("*.json")):
        try:
            out += topic_pages(path)
        except json.JSONDecodeError as e:
            raise ContentError(f"{path.relative_to(HERE)}: bad JSON ({e})")
    return out


def index():
    """Topic and unit list for /my-progress/ (written to /static/topics.json)."""
    out = []
    for path in sorted(TOPICS.glob("*.json")):
        t = json.loads(path.read_text(encoding="utf-8"))
        out.append({"slug": t["slug"], "subject": t["subject"], "title": t["title"], "stage": t.get("stage", ""), "href": f"/{t['subject']}/{t['slug']}/",
                    "units": [{"slug": u["slug"], "title": u["title"], "href": f"/{t['subject']}/{t['slug']}/{u['slug']}/"} for u in t["units"]]})
    return out
