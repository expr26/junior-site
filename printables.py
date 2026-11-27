"""Free printables for parents and teachers (made at build time, no JavaScript needed to read or print them):

  /printables/                        the list
  /printables/times-tables-chart/     a 12 x 12 multiplication chart and a blank one to fill in
  /printables/<n>-times-table/        one page per table (2 to 12): the facts, a way to remember them, patterns,
                                      a practice sheet (in order, mixed, missing numbers, division) and an answer page
  /printables/<topic>-worksheet/      a ready-made worksheet with answers for each KS2 topic (and Fractions and Missions),
                                      three questions from every unit of topics/<topic>.json

Mixed orders come from a fixed seed, so a page is the same on every build.
Every pattern line below was checked by hand for 1 to 12."""
import html
import json
import random
import re

import topics

E = html.escape
TABLES = range(2, 13)
WORDS = {2: "two", 3: "three", 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten", 11: "eleven", 12: "twelve"}

# How to work it out (same strategies as the Times Table Trainer) and patterns in the answers.
TIP = {
    2: "Times 2 is doubling. 2 × 8 is double 8, which is 16.",
    3: "Work out 2 lots, then add one more lot. 3 × 7: 2 × 7 = 14, and 14 + 7 = 21.",
    4: "Double, then double again. 4 × 6: double 6 is 12, double 12 is 24.",
    5: "Work out 10 lots, then halve it. 5 × 8: 10 × 8 = 80, and half of 80 is 40.",
    6: "Work out 5 lots, then add one more lot. 6 × 7: 5 × 7 = 35, and 35 + 7 = 42.",
    7: "Work out 5 lots and 2 lots, then add them. 7 × 8: 5 × 8 = 40 and 2 × 8 = 16, so 40 + 16 = 56.",
    8: "Double three times. 8 × 6: 6 → 12 → 24 → 48.",
    9: "Work out 10 lots, then take away one lot. 9 × 7: 10 × 7 = 70, and 70 − 7 = 63.",
    10: "The digits move one place to the left, so a 0 goes on the end. 10 × 7 = 70.",
    11: "Work out 10 lots, then add one more lot. 11 × 12: 10 × 12 = 120, and 120 + 12 = 132.",
    12: "Split 12 into 10 and 2. 12 × 7: 10 × 7 = 70 and 2 × 7 = 14, so 70 + 14 = 84.",
}
PATTERN = {
    2: ["Every answer is even: it ends in 0, 2, 4, 6 or 8.", "Each answer is 2 more than the one before."],
    3: ["Add the digits of any answer and you get 3, 6 or 9. For 27: 2 + 7 = 9.", "The answers go odd, even, odd, even."],
    4: ["Every answer is double the answer in the 2 times table.", "The last digits go 4, 8, 2, 6, 0 and then repeat."],
    5: ["The answers end in 5 or 0, taking turns.", "Every answer is half of the answer in the 10 times table."],
    6: ["Every answer is even.", "6 times an even number ends in the same digit as that number: 6 × 4 = 24, 6 × 8 = 48."],
    7: ["The last digits of the first ten answers are 7, 4, 1, 8, 5, 2, 9, 6, 3, 0: every digit once!",
        "If you know your 2 and 5 times tables, you already know all of the 7 times table."],
    8: ["Every answer is even.", "The last digits go 8, 6, 4, 2, 0 and then repeat."],
    9: ["From 9 × 1 to 9 × 10 the tens digit goes up by 1 while the ones digit goes down by 1: 18, 27, 36, 45...",
        "In those answers the two digits always add up to 9."],
    10: ["Every answer ends in 0.", "Each answer is the number you multiplied with a 0 on the end."],
    11: ["Up to 11 × 9 the answer is the digit written twice: 11 × 4 = 44.", "After that come 110, 121 and 132."],
    12: ["Every answer is even.", "The last digits go 2, 4, 6, 8, 0 and then repeat."],
}

CSS = '<link rel="stylesheet" href="/static/css/qbank.css">'


def _crumbs(*parts):
    links = ['<a href="/">Home</a>', '<a href="/printables/">Printables</a>'] + list(parts)
    return '<p class="crumbs">' + " › ".join(links) + "</p>"


def _faq(items):
    qs = "".join(f'<details class="card faq"><summary>{E(q)}</summary><p>{E(a)}</p></details>' for q, a in items)
    ld = json.dumps({"@context": "https://schema.org", "@type": "FAQPage", "mainEntity": [
        {"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in items]},
        ensure_ascii=False).replace("</", "<\\/")
    return (f'<section class="section tight no-print"><div class="wrap narrow"><h2>Questions parents ask</h2><div class="faqs">{qs}</div></div></section>'
            f'<script type="application/ld+json">{ld}</script>')


def _tools(label="🖨️ Print or save as PDF"):
    return f'<p class="qb-ws-tools no-print"><button type="button" class="btn" data-print>{label}</button></p>'


def _name_line():
    return '<p class="qb-ws-name">Name: <span></span> Date: <span></span></p>'


def _gap(text):
    return f'<li class="pt-item">{text}</li>'


GAP = '<span class="pt-gap"></span>'


# ---------- the chart ----------
def chart(blank=False):
    head = "<tr><th scope=\"col\"><span class=\"sr\">times</span>×</th>" + "".join(f'<th scope="col">{b}</th>' for b in range(1, 13)) + "</tr>"
    rows = ""
    for a in range(1, 13):
        cells = "".join(
            f'<td class="{"sq" if a == b else ""}">{"" if blank else a * b}</td>' for b in range(1, 13))
        rows += f'<tr><th scope="row">{a}</th>{cells}</tr>'
    cap = "Blank multiplication grid to fill in" if blank else "Multiplication chart from 1 × 1 to 12 × 12"
    return f'<div class="tt-scroll"><table class="pt-chart{" blank" if blank else ""}"><caption class="sr">{cap}</caption>{head}{rows}</table></div>'


def chart_page():
    body = CSS + f"""
<section class="hero no-print"><div class="wrap narrow">
  {_crumbs("Times tables chart")}
  <p class="eyebrow">Free printable · KS2 · ages 7 to 11</p>
  <h1>Times tables chart 1 to 12</h1>
  <p class="lede">A colourful multiplication chart from 1 × 1 to 12 × 12, and a blank grid for your child to fill in. Print it or save it as a PDF.</p>
</div></section>
<section class="section tight"><div class="wrap narrow qb-ws pt-sheet">
  {_tools()}
  <h2 class="pt-h">Multiplication chart 1 to 12</h2>
  <p class="small">To find 7 × 8, go along the row for 7 and down the column for 8. The shaded squares are the square numbers (1 × 1, 2 × 2, 3 × 3...).</p>
  {chart()}
  <div class="pt-break">
    <h2 class="pt-h">Fill in the grid</h2>
    {_name_line()}
    <p class="small">Start with the tables you know best: 1, 2, 5 and 10. Then use them to work out the others. Remember 3 × 4 is the same as 4 × 3, so every fact you fill in gives you two squares.</p>
    {chart(blank=True)}
  </div>
</div></section>
<section class="section tight no-print"><div class="wrap narrow">
  <h2>Practise one table at a time</h2>
  <ul class="qb-ws-all">{"".join(f'<li><a href="/printables/{n}-times-table/">{n} times table</a></li>' for n in TABLES)}</ul>
  <p>Or practise on screen with the <a href="/games/times-table-trainer/">Times Table Trainer</a>: no timer, and it colours in your own times table map.</p>
</div></section>""" + _faq([
        ("Which times tables should my child know?",
         "In England, children are expected to know all the times tables up to 12 × 12 by the end of Year 4. Most start with 2, 5 and 10, then 3, 4 and 8, then 6, 7, 9, 11 and 12."),
        ("How do I use a multiplication chart?",
         "Find the first number on the left and the second number along the top. The answer is where that row and that column meet. For 6 × 7, go along row 6 to column 7: the answer is 42."),
        ("Why are some squares shaded?",
         "They are the square numbers: a number times itself, such as 4 × 4 = 16. They run in a diagonal line, and the chart is the same on both sides of that line because 3 × 5 is the same as 5 × 3."),
    ]) + '<script src="/static/js/printables.js" defer></script>'
    meta = {"title": "Times tables chart 1 to 12: free printable multiplication grid", "body_class": "qbank qb-ws-page printables",
            "description": "Free printable times tables chart from 1 × 1 to 12 × 12, plus a blank multiplication grid to fill in. For KS2 and ages 7 to 11. Print or save as PDF."}
    return ("/printables/times-tables-chart/", meta, body, "printables.py")


# ---------- one page per table ----------
def table_page(n):
    rnd = random.Random(f"tt-{n}")
    facts = "".join(f'<li><span>{n} × {k}</span> = <b>{n * k}</b></li>' for k in range(1, 13))
    gaps_at = set(rnd.sample(range(1, 13), 8))
    in_order = "".join(_gap(f"{n} × {k} = {GAP if k in gaps_at else n * k}") for k in range(1, 13))
    mixed = rnd.sample(range(1, 13), 12)
    mixed_q = "".join(_gap(f"{k} × {n} = {GAP}" if i % 2 else f"{n} × {k} = {GAP}") for i, k in enumerate(mixed))
    miss = rnd.sample(range(2, 13), 8)
    miss_q = "".join(_gap(f"{GAP} × {n} = {n * k}") for k in miss)
    div = rnd.sample(range(1, 13), 8)
    div_q = "".join(_gap(f"{n * k} ÷ {n} = {GAP}") for k in div)
    ans = (f'<p><b>A.</b> ' + ", ".join(f"{n} × {k} = {n * k}" for k in sorted(gaps_at)) + "</p>"
           f'<p><b>B.</b> ' + ", ".join(str(n * k) for k in mixed) + "</p>"
           f'<p><b>C.</b> ' + ", ".join(str(k) for k in miss) + "</p>"
           f'<p><b>D.</b> ' + ", ".join(str(k) for k in div) + "</p>")
    pats = "".join(f"<li>{E(p)}</li>" for p in PATTERN[n])
    others = "".join(f'<li><a href="/printables/{m}-times-table/">{m} times table</a></li>' for m in TABLES if m != n)
    w = WORDS[n]
    body = CSS + f"""
<section class="hero no-print"><div class="wrap narrow">
  {_crumbs(f"{n} times table")}
  <p class="eyebrow">Free printable · KS2 · ages 7 to 11</p>
  <h1>The {n} times table</h1>
  <p class="lede">All the {w} times table facts up to {n} × 12, an easy way to work them out, the patterns to spot, and a printable practice sheet with answers.</p>
</div></section>
<section class="section tight"><div class="wrap narrow qb-ws pt-sheet">
  {_tools()}
  <h2 class="pt-h">The {n} times table</h2>
  <ol class="pt-facts">{facts}</ol>
  <div class="card pt-tip"><h3>How to work it out</h3><p>{E(TIP[n])}</p>
    <h3>Patterns to spot</h3><ul>{pats}</ul></div>
  <div class="pt-break">
    <h2 class="pt-h">{n} times table practice sheet</h2>
    {_name_line()}
    <h3>A. Fill in the gaps</h3><ol class="pt-grid">{in_order}</ol>
    <h3>B. Mixed up</h3><ol class="pt-grid">{mixed_q}</ol>
    <h3>C. Missing numbers</h3><ol class="pt-grid">{miss_q}</ol>
    <h3>D. Dividing by {n}</h3><p class="small">Use the times table backwards: what times {n} makes the first number?</p><ol class="pt-grid">{div_q}</ol>
  </div>
  <div class="qb-ws-answers"><h2>Answers: {n} times table</h2>{ans}</div>
  <p class="small">Free from junior.examinerprep.com</p>
</div></section>
<section class="section tight no-print"><div class="wrap narrow">
  <h2>Keep practising</h2>
  <p>Practise the {n} times table on screen with the <a href="/games/times-table-trainer/">Times Table Trainer</a> (no timer), or work through the <a href="/maths/times-tables/">Times tables topic</a> with pictures and hints. See every table on the <a href="/printables/times-tables-chart/">times tables chart</a>.</p>
  <ul class="qb-ws-all">{others}</ul>
</div></section>""" + _faq([
        (f"What is the {n} times table up to 12?",
         "; ".join(f"{n} × {k} = {n * k}" for k in range(1, 13)) + "."),
        (f"What is an easy way to learn the {n} times table?",
         TIP[n] + " Practise a few facts each day and say them out loud; little and often works better than one long session."),
        (f"How do I divide by {n}?",
         f"Use the {n} times table backwards. For {n * 7} ÷ {n}, ask: what times {n} makes {n * 7}? The answer is 7, because 7 × {n} = {n * 7}."),
    ]) + '<script src="/static/js/printables.js" defer></script>'
    meta = {"title": f"{n} times table: chart, tips and free printable worksheet", "body_class": "qbank qb-ws-page printables",
            "description": f"The {n} times table up to {n} × 12 with an easy way to remember it, patterns to spot and a free printable {n} times table worksheet with answers. KS2, ages 7 to 11."}
    return (f"/printables/{n}-times-table/", meta, body, "printables.py")


# ---------- topic worksheets ----------
WS_TOPICS = ["times-tables", "place-value", "mental-maths", "telling-the-time", "money", "shapes", "fractions", "missions"]


def _write(q):
    return re.sub(r"(^|\. )Type ", r"\1Write ", q)


def worksheet_page(t):
    rnd = random.Random(f"ws-{t['slug']}")
    items, answers = [], []
    for u in t["units"]:
        qs = u["questions"]
        pick = sorted({0, len(qs) // 2, len(qs) - 1}) if len(qs) >= 3 else range(len(qs))
        for i in pick:
            q = dict(qs[i]); q["q"] = _write(q["q"])
            where = f"printables {t['slug']}/{u['slug']} #{i + 1}"
            d = topics.question_data(q, where)
            if d["t"] == "mc":
                order = list(range(len(d["options"]))); rnd.shuffle(order)
                body = '<ol class="qb-ws-opts" type="A">' + "".join(f"<li>{d['options'][k]}</li>" for k in order) + "</ol>"
                a = "ABCDEF"[order.index(d["answer"])] + ": " + d["options"][d["answer"]]
            else:
                body = f'<p class="qb-ws-line">Answer: <span></span> {d["unit"]}</p>'
                a = d["show"] + (" " + d["unit"] if d["unit"] else "")
            items.append(f'<li class="qb-ws-q"><div class="q-text">{d["q"]}</div>{d["fig"]}{body}</li>')
            answers.append(f'<li><b>{a}</b><br><span class="small">{d["explain"]}</span></li>')
    title = f"{t['title']} worksheet"
    path = f"/{t['subject']}/{t['slug']}/"
    body = CSS + f"""
<section class="hero no-print"><div class="wrap narrow">
  {_crumbs(E(title))}
  <p class="eyebrow">Free printable · {E(t.get("level", "KS2"))}</p>
  <h1>{E(title)} with answers</h1>
  <p class="lede">{len(items)} questions on {E(t["title"].lower())}, from every part of the topic, with an answer page that explains each answer. Print it or save it as a PDF.</p>
</div></section>
<section class="section tight"><div class="wrap narrow qb-ws">
  {_tools()}
  <p class="pt-print-title">{E(title)}</p>
  {_name_line()}
  <p class="small">Show your working. You may draw on the pictures.</p>
  <ol class="qb-ws-list">{"".join(items)}</ol>
  <div class="qb-ws-answers"><h2>Answers: {E(title)}</h2><ol>{"".join(answers)}</ol></div>
  <p class="small">Free from junior.examinerprep.com</p>
</div></section>
<section class="section tight no-print"><div class="wrap narrow">
  <p>Want to practise on screen with hints? Open the <a href="{path}">{E(t["title"])} topic</a>. For KS3 Maths and Science, use the <a href="/worksheets/">worksheet maker</a>.</p>
</div></section>
<script src="/static/js/printables.js" defer></script>"""
    meta = {"title": f"{t['title']} worksheet with answers: free printable", "body_class": "qbank qb-ws-page printables",
            "description": f"Free printable {t['title'].lower()} worksheet with answers for {t.get('level', 'KS2')}: {len(items)} questions with pictures, and an answer page that explains each one."}
    return (f"/printables/{t['slug']}-worksheet/", meta, body, "printables.py"), (t, title, len(items))


def pages():
    out = [chart_page()] + [table_page(n) for n in TABLES]
    sheets = []
    for slug in WS_TOPICS:
        t = json.loads((topics.TOPICS / f"{slug}.json").read_text(encoding="utf-8"))
        page, info = worksheet_page(t)
        out.append(page); sheets.append(info)
    tt = "".join(f'<li><a href="/printables/{n}-times-table/">{n} times table</a></li>' for n in TABLES)
    ws = "".join(f'<a class="card topic" href="/printables/{t["slug"]}-worksheet/"><span class="ks2-ic" aria-hidden="true">{t.get("icon", "📝")}</span>'
                 f'<span class="tag">{E(t.get("level", "KS2"))}</span><h3>{E(title)}</h3><p>{n} questions with answers</p><span class="go">Open and print →</span></a>'
                 for t, title, n in sheets)
    body = CSS + f"""
<section class="hero"><div class="wrap narrow">
  <p class="crumbs"><a href="/">Home</a> › Printables</p>
  <p class="eyebrow">For parents and teachers · free</p>
  <h1>Free printable Maths worksheets</h1>
  <p class="lede">Times tables charts and practice sheets, and ready-made worksheets with answers for KS2 topics. No sign-up: open, print or save as a PDF.</p>
</div></section>
<section class="section tight"><div class="wrap">
  <a class="card ks2-banner" href="/printables/times-tables-chart/"><span class="ks2-ic" aria-hidden="true">🔢</span><span class="tag">1 × 1 to 12 × 12</span>
    <h3>Times tables chart</h3><p>A colourful multiplication chart and a blank grid to fill in.</p><span class="go">Open and print →</span></a>
  <h2>Times tables practice sheets</h2>
  <p>Each sheet has the facts, an easy way to work them out, patterns to spot, four kinds of practice and an answer page.</p>
  <ul class="qb-ws-all">{tt}</ul>
  <h2>Topic worksheets with answers</h2>
  <div class="cards three">{ws}</div>
  <h2>Make your own</h2>
  <p>For KS3 Maths, Physics, Chemistry and Biology, choose the topics and levels in the <a href="/worksheets/">worksheet maker</a>. Teachers will also find a teaching pack for every topic on the <a href="/teachers/">For teachers</a> page.</p>
</div></section>"""
    meta = {"title": "Free printable Maths worksheets with answers for KS2",
            "description": "Free printable times tables charts, times tables worksheets from 2 to 12 and KS2 Maths worksheets with answers: place value, mental maths, time, money, shapes and fractions."}
    return [("/printables/", meta, body, "printables.py")] + out
