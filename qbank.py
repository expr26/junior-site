"""KS3 question bank: /question-bank/, /question-bank/<subject>/ and /question-bank/<subject>/<topic>/.

Modelled on the IGCSE question bank at examinerprep.com (hub -> subject -> one page per topic with every question
and filters), but made for ages 9 to 14: each question is marked straight away in the browser (static/js/qbank.js),
with a hint after a first wrong try and a worked answer after the second. No timers.

qbank/subjects.json  the map of every planned topic per subject (live when its file exists)
qbank/<subject>/<topic>.json:
  {
    "slug": "forces", "title": "Forces", "ks3": "Motion and forces: ...",   (what it covers in the KS3 programme of study)
    "art": "forces",                                                        (big picture at the top, see qbank_art.py)
    "intro": "...", "description": "... (for search engines and parents)",
    "subtopics": [{"slug": "types", "title": "Types of force"}, ...],
    "questions": [
      {"id": "forces-01", "sub": "types", "level": 1, "type": "mc", "q": "...", "options": [...], "answer": 0, "hint": "...", "explain": "..."},
      ...
    ]
  }
  level: 1 Warm-up, 2 Core, 3 Challenge.  Question fields are the same as in topics/*.json (see topics.py),
  so the same figures ("fig") and answer types ("mc", "num") work here.
  "id" must never change once live: progress in the browser is saved against it.
The build checks structure only. Check every answer by hand.
"""
import hashlib
import html
import json
from pathlib import Path

import qbank_art
from topics import ContentError, figure, mascot, question_data, rich

HERE = Path(__file__).resolve().parent
SRC = HERE / "qbank"
LEVELS = {1: ("Warm-up", "🌱"), 2: ("Core", "🌿"), 3: ("Challenge", "🌳")}
ROOT = "/question-bank/"
CSS = '<link rel="stylesheet" href="/static/css/qbank.css">'


def _load(path):
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise ContentError(f"{path.relative_to(HERE)}: bad JSON ({e})")


def _need(obj, keys, where):
    for k in keys:
        if obj.get(k) in (None, "", []):
            raise ContentError(f"{where}: missing \"{k}\"")


def load():
    """[(subject, [(plan entry, topic data or None), ...]), ...] with every live topic checked."""
    subjects = _load(SRC / "subjects.json")["subjects"]
    out, ids = [], {}
    for s in subjects:
        _need(s, ("slug", "title", "art", "blurb", "description", "topics"), f"qbank/subjects.json {s.get('slug', '?')}")
        planned = {t["slug"] for t in s["topics"]}
        for f in (SRC / s["slug"]).glob("*.json"):
            if f.stem not in planned:
                raise ContentError(f"{f.relative_to(HERE)}: not listed under {s['slug']} in qbank/subjects.json")
        rows = []
        for plan in s["topics"]:
            f = SRC / s["slug"] / f"{plan['slug']}.json"
            t = _load(f) if f.exists() else None
            if t:
                where = f.relative_to(HERE)
                _need(t, ("slug", "title", "ks3", "art", "intro", "description", "subtopics", "questions"), where)
                if t["slug"] != plan["slug"]:
                    raise ContentError(f"{where}: slug must be {plan['slug']!r} (the file name)")
                subs = {x["slug"] for x in t["subtopics"]}
                for k, q in enumerate(t["questions"], 1):
                    qw = f"{where} question {k} ({q.get('id', 'no id')})"
                    _need(q, ("id", "sub", "level"), qw)
                    if q["id"] in ids:
                        raise ContentError(f"{qw}: id already used in {ids[q['id']]}")
                    ids[q["id"]] = where
                    if q["sub"] not in subs:
                        raise ContentError(f"{qw}: sub {q['sub']!r} is not one of {sorted(subs)}")
                    if q["level"] not in LEVELS:
                        raise ContentError(f"{qw}: level must be 1, 2 or 3")
                    q["_data"] = question_data(q, qw)
                    if q["type"] == "num" and "show" not in q and str(q["answer"]).startswith("-"):
                        q["_data"]["show"] = rich("−" + str(q["answer"])[1:])   # a real minus sign, not a hyphen
                for sub in t["subtopics"]:
                    if not any(q["sub"] == sub["slug"] for q in t["questions"]):
                        raise ContentError(f"{where}: subtopic {sub['slug']!r} has no questions")
                t["_fig"] = qbank_art.art(t["art"], where)
            rows.append((plan, t))
        out.append((s, rows))
    return out


def _count(n, word):
    return f"{n} {word}{'' if n == 1 else 's'}"


def _crumbs(*parts):
    links = ['<a href="/">Home</a>']
    for label, href in parts:
        links.append(f'<a href="{href}">{html.escape(label)}</a>' if href else html.escape(label))
    return '<p class="crumbs">' + " › ".join(links) + "</p>"


def _tag(subject):
    return "tag" if subject == "maths" else "tag sci"


def hub_page(data):
    cards = []
    for s, rows in data:
        live = [t for _, t in rows if t]
        nq = sum(len(t["questions"]) for t in live)
        cards.append(f"""
      <a class="card qb-subject {s['slug']}" href="{ROOT}{s['slug']}/" data-qb-subject="{s['slug']}">
        <span class="qb-subject-art">{qbank_art.art(s['art'], 'qbank/subjects.json')}</span>
        <span class="{_tag(s['slug'])}">KS3</span>
        <h2>{html.escape(s['title'])}</h2>
        <p>{html.escape(s['blurb'])}</p>
        <p class="qb-count"><b>{_count(nq, 'question')}</b> · {_count(len(live), 'topic')} ready · {len(rows) - len(live)} on the way</p>
        <span class="qb-done small"></span>
        <span class="go">Open {html.escape(s['title'])} →</span>
      </a>""")
    body = CSS + f"""
<section class="hero qb-hero">
  <div class="wrap hero-grid">
    <div>
      {_crumbs(("Question bank", None))}
      <p class="eyebrow">KS3 · Years 7 to 9 · ages 9 to 14</p>
      <h1>Question bank</h1>
      <p class="lede">Practice questions for every KS3 topic, from easy to tricky. Pick a topic, answer a question and find out straight away if you're right.</p>
      <ul class="qb-levels" aria-label="Three levels">
        {"".join(f'<li><span aria-hidden="true">{ic}</span> {name}</li>' for name, ic in LEVELS.values())}
      </ul>
    </div>
    <div class="hero-art" aria-hidden="true">
      <div class="hero-owl">{{{{mascot}}}}</div>
      <span class="float f1">%</span><span class="float f2">⚡</span><span class="float f3">x</span><span class="float f4">🧲</span><span class="float f5">⭐</span><span class="float f6">π</span>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="wrap">
    <div class="qb-subjects">{"".join(cards)}</div>
  </div>
</section>
<section class="section alt">
  <div class="wrap">
    <h2>How the question bank works</h2>
    <div class="cards three steps">
      <div class="card"><span class="num">1</span><h3>Pick a topic</h3><p>Every topic from the KS3 curriculum, split into small parts. Start with 🌱 Warm-up questions.</p></div>
      <div class="card"><span class="num">2</span><h3>Answer and check</h3><p>Tap an answer or type a number. Wrong? You get a hint and another go, then a worked answer.</p></div>
      <div class="card"><span class="num">3</span><h3>Fix your mistakes</h3><p>Choose "My mistakes" to try the ones you missed again. Fixing a mistake earns stars too.</p></div>
    </div>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <div class="card parents-note">
      <h3>For parents</h3>
      <p>The topics follow the Key Stage 3 national curriculum for England (Years 7 to 9), which also fits Lower Secondary and pre-IGCSE.
      Warm-up questions suit confident 9 to 11 year olds; Challenge questions stretch students towards GCSE and IGCSE.</p>
      <p>There is no timer, no leaderboard and no account. Progress is saved only in this browser.</p>
    </div>
  </div>
</section>"""
    meta = {"title": "KS3 Maths and Physics question bank", "body_class": "qbank",
            "description": "Free KS3 Maths and Physics question bank for ages 9 to 14: hundreds of questions by topic, marked instantly, with hints and worked answers."}
    return (ROOT, meta, body, "qbank/subjects.json")


def subject_page(s, rows):
    cards = []
    for n, (plan, t) in enumerate(rows, 1):
        title = html.escape(plan["title"])
        if t:
            levels = sorted({q["level"] for q in t["questions"]})
            cards.append(f"""
      <li><a class="qb-topic" href="{ROOT}{s['slug']}/{plan['slug']}/" data-qb-topic="{s['slug']}/{plan['slug']}" data-qb-total="{len(t['questions'])}">
        <span class="qb-topic-art">{t['_fig']}</span>
        <span class="qb-topic-txt"><span class="qb-strand">{html.escape(plan['ks3'])}</span><b>{title}</b>
        <span>{_count(len(t['questions']), 'question')} · {"".join(LEVELS[l][1] for l in levels)}</span>
        <span class="qb-meter" aria-hidden="true"><span></span></span><span class="qb-done small"></span></span>
      </a></li>""")
        else:
            cards.append(f'<li><div class="qb-topic soon"><span class="qb-topic-icon" aria-hidden="true">{plan["icon"]}</span>'
                         f'<span class="qb-topic-txt"><span class="qb-strand">{html.escape(plan["ks3"])}</span><b>{title}</b>'
                         f'<span class="soon-tag">Coming soon</span></span></div></li>')
    other = "physics" if s["slug"] == "maths" else "maths"
    body = CSS + f"""
<section class="hero qb-hero {s['slug']}">
  <div class="wrap hero-grid">
    <div>
      {_crumbs(("Question bank", ROOT), (s['title'], None))}
      <span class="{_tag(s['slug'])}">KS3 {html.escape(s['title'])}</span>
      <h1>{html.escape(s['title'])} question bank</h1>
      <p class="lede">{html.escape(s['blurb'])} Pick a topic to start.</p>
    </div>
    <div class="qb-hero-art" aria-hidden="true">{qbank_art.art(s['art'], 'qbank/subjects.json')}</div>
  </div>
</section>
<section class="section tight">
  <div class="wrap">
    <ol class="qb-topics">{"".join(cards)}</ol>
    <p class="small">The topics follow the KS3 national curriculum for England. New topics are added often.</p>
    <p><a class="btn ghost" href="{ROOT}{other}/">Try {other.title()} questions →</a></p>
  </div>
</section>"""
    meta = {"title": f"KS3 {s['title']} question bank: practice by topic", "description": s["description"], "body_class": f"qbank {s['slug']}"}
    return (f"{ROOT}{s['slug']}/", meta, body, "qbank/subjects.json")


def _question_html(n, q, subs):
    d = q["_data"]
    name, icon = LEVELS[q["level"]]
    if d["t"] == "mc":
        order = sorted(range(len(d["options"])), key=lambda k: hashlib.md5(f"{q['id']}/{k}".encode()).hexdigest())   # fixed mix, so A is not always right
        static = '<ol class="qb-static-opts" type="A">' + "".join(f"<li>{d['options'][k]}</li>" for k in order) + "</ol>"
        answer = f'<p>Answer: <b>{d["options"][d["answer"]]}</b></p>'
    else:
        static = ""
        answer = f'<p>Answer: <b>{d["show"]}{(" " + d["unit"]) if d["unit"] else ""}</b></p>'
    return f"""
<li class="qb-q" id="{q['id']}" data-id="{q['id']}" data-sub="{q['sub']}" data-level="{q['level']}">
  <div class="qb-q-head">
    <span class="qb-n">{n}</span>
    <span class="qb-chip">{html.escape(subs[q['sub']])}</span>
    <span class="qb-chip lv{q['level']}"><span aria-hidden="true">{icon}</span> {name}</span>
    <span class="qb-status" aria-live="polite"></span>
  </div>
  <div class="q-text">{d['q']}</div>
  {f'<div class="q-fig">{d["fig"]}</div>' if d["fig"] else ""}
  <div class="qb-area">{static}</div>
  <details class="qb-static-ans"><summary>Show the answer</summary>{answer}<div class="explain">{d['explain']}</div></details>
  <div class="q-feedback" role="status"></div>
</li>"""


def topic_page(s, plan, t, prev, nxt):
    subs = {x["slug"]: x["title"] for x in t["subtopics"]}
    qs = t["questions"]
    key = f"{s['slug']}/{t['slug']}"
    sub_chips = "".join(
        f'<button type="button" class="qb-f" data-f="sub" data-v="{x["slug"]}" aria-pressed="false">{html.escape(x["title"])} '
        f'<span class="qb-c">{sum(q["sub"] == x["slug"] for q in qs)}</span></button>' for x in t["subtopics"])
    lvl_chips = "".join(
        f'<button type="button" class="qb-f" data-f="level" data-v="{n}" aria-pressed="false"><span aria-hidden="true">{ic}</span> {name} '
        f'<span class="qb-c">{sum(q["level"] == n for q in qs)}</span></button>' for n, (name, ic) in LEVELS.items()
        if any(q["level"] == n for q in qs))
    data = {"key": key, "subject": "maths" if s["slug"] == "maths" else "science",
            "questions": {q["id"]: q["_data"] for q in qs}}
    blob = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")
    nav = []
    if prev:
        nav.append(f'<a class="btn ghost" href="{ROOT}{s["slug"]}/{prev["slug"]}/">← {html.escape(prev["title"])}</a>')
    nav.append(f'<a class="btn ghost" href="{ROOT}{s["slug"]}/">All {html.escape(s["title"])} topics</a>')
    if nxt:
        nav.append(f'<a class="btn" href="{ROOT}{s["slug"]}/{nxt["slug"]}/">{html.escape(nxt["title"])} →</a>')
    body = CSS + f"""
<section class="hero qb-hero {s['slug']}">
  <div class="wrap hero-grid">
    <div>
      {_crumbs(("Question bank", ROOT), (s['title'], f"{ROOT}{s['slug']}/"), (t['title'], None))}
      <span class="{_tag(s['slug'])}">KS3 {html.escape(s['title'])} · {html.escape(plan['ks3'])}</span>
      <h1>{html.escape(t['title'])}</h1>
      <p class="lede">{rich(t['intro'])}</p>
      <p class="qb-count"><b>{_count(len(qs), 'question')}</b> · {_count(len(t['subtopics']), 'part')} · no timer</p>
      <div class="qb-progress" data-qb-topic="{key}" data-qb-total="{len(qs)}" hidden>
        <span class="qb-meter"><span></span></span><span class="qb-done small"></span>
      </div>
    </div>
    <div class="qb-hero-art" aria-hidden="true">{t['_fig']}</div>
  </div>
</section>
<section class="section tight qb-main">
  <div class="wrap narrow">
    <div class="qb-filters" id="qb-filters" hidden>
      <div class="qb-frow" role="group" aria-label="Part of the topic">
        <button type="button" class="qb-f" data-f="sub" data-v="" aria-pressed="true">All parts <span class="qb-c">{len(qs)}</span></button>{sub_chips}
      </div>
      <div class="qb-frow" role="group" aria-label="Level">
        <button type="button" class="qb-f" data-f="level" data-v="" aria-pressed="true">All levels</button>{lvl_chips}
      </div>
      <div class="qb-frow" role="group" aria-label="Which questions">
        <button type="button" class="qb-f" data-f="mine" data-v="" aria-pressed="true">All questions</button>
        <button type="button" class="qb-f" data-f="mine" data-v="new" aria-pressed="false">Not tried yet <span class="qb-c"></span></button>
        <button type="button" class="qb-f" data-f="mine" data-v="mistakes" aria-pressed="false">My mistakes <span class="qb-c"></span></button>
      </div>
      <p class="qb-shown small" aria-live="polite"></p>
    </div>
    <div class="runner-mascot qb-owl">{mascot()}<p class="bubble">Take your time: there's no timer. Got one wrong? You get a hint and another go.</p></div>
    <ol class="qb-list" id="qb-list">{"".join(_question_html(n, q, subs) for n, q in enumerate(qs, 1))}</ol>
    <p class="qb-empty note" hidden>No questions match these filters. Try "All questions".</p>
    <p class="actions qb-nav">{"".join(nav)}</p>
  </div>
</section>
<script type="application/json" id="qbdata">{blob}</script>
<script src="/static/js/qbank.js" defer></script>"""
    meta = {"title": f"{t['title']}: KS3 {s['title']} questions", "description": t["description"], "body_class": f"qbank qb-topic-page {s['slug']}",
            "noindex": t.get("noindex", False)}
    return (f"{ROOT}{s['slug']}/{t['slug']}/", meta, body, f"qbank/{s['slug']}/{t['slug']}.json")


def pages():
    data = load()
    out = [hub_page(data)]
    for s, rows in data:
        out.append(subject_page(s, rows))
        live = [(plan, t) for plan, t in rows if t]
        for i, (plan, t) in enumerate(live):
            prev = live[i - 1][1] if i else None
            nxt = live[i + 1][1] if i + 1 < len(live) else None
            out.append(topic_page(s, plan, t, prev, nxt))
    return out
