"""/worksheets/: a worksheet maker for teachers and parents. Pick topics, parts and levels from the KS3 question bank and how many
questions; the page builds a printable worksheet with an answer page, in the browser (static/js/ws.js, data from the question pool)."""
import html
import json

import qbank


def pages():
    e = html.escape
    data = qbank.load()
    subjects = []
    for s, rows in data:
        ts = [{"k": f"{s['slug']}/{t['slug']}", "title": t["title"], "icon": plan.get("icon", ""),
               "parts": [{"slug": x["slug"], "title": x["title"], "n": sum(1 for q in t["questions"] if q["sub"] == x["slug"])} for x in t["subtopics"]],
               "n": len(t["questions"])} for plan, t in rows if t]
        subjects.append({"slug": s["slug"], "title": s["title"], "topics": ts})
    blob = json.dumps({"pool": qbank.POOL_URL, "subjects": subjects}, ensure_ascii=False).replace("</", "<\\/")
    total = sum(t["n"] for s in subjects for t in s["topics"])
    body = qbank.CSS + f"""
<section class="hero no-print">
  <div class="wrap narrow">
    <p class="crumbs"><a href="/">Home</a> › <a href="/teachers/">For teachers</a> › Worksheet maker</p>
    <p class="eyebrow">For teachers and parents</p>
    <h1>Worksheet maker</h1>
    <p class="lede">Make your own printable KS3 Maths or Physics worksheet in seconds: choose the topics, the levels and how many questions. The answers come on a separate page.</p>
  </div>
</section>
<section class="section tight">
  <div class="wrap narrow">
    <form class="card ws-form no-print" id="ws-form">
      <fieldset><legend>Subject</legend><div class="ws-row" id="ws-subj"></div></fieldset>
      <fieldset><legend>Topics <button type="button" class="ws-all" data-all="t">all</button> <button type="button" class="ws-all" data-all="none">none</button></legend><div class="ws-topics" id="ws-topics"></div></fieldset>
      <fieldset><legend>Levels</legend><div class="ws-row">
        <label class="ws-chip"><input type="checkbox" name="lv" value="1" checked> 🌱 Warm-up</label>
        <label class="ws-chip"><input type="checkbox" name="lv" value="2" checked> 🌿 Core</label>
        <label class="ws-chip"><input type="checkbox" name="lv" value="3"> 🌳 Challenge</label></div></fieldset>
      <fieldset><legend>How many questions?</legend><div class="ws-row">
        {"".join(f'<label class="ws-chip"><input type="radio" name="n" value="{n}"{" checked" if n == 12 else ""}> {n}</label>' for n in (6, 12, 20, 30))}</div></fieldset>
      <fieldset><legend>Options</legend>
        <label class="ws-line">Title <input type="text" id="ws-title" maxlength="80" placeholder="e.g. Year 7 homework: equations"></label>
        <label class="ws-line"><input type="checkbox" id="ws-ans" checked> Answer page with worked answers</label>
        <label class="ws-line"><input type="checkbox" id="ws-mix" checked> Mix the order (otherwise easiest first)</label></fieldset>
      <p class="ws-msg" aria-live="polite"></p>
      <p class="actions"><button class="btn" type="submit">Make my worksheet</button></p>
    </form>
    <div id="ws-out" class="qb-ws" hidden></div>
    <p class="small no-print">{total} questions to choose from. Every question is checked by hand. Nothing you choose here is saved or sent anywhere.</p>
  </div>
</section>
<script type="application/json" id="wsdata">{blob}</script>
<script src="/static/js/ws.js" defer></script>"""
    meta = {"title": "Free KS3 Maths and Physics worksheet maker with answers", "body_class": "qbank qb-ws-page worksheets",
            "description": "Make free printable KS3 Maths and Physics worksheets with answers: choose topics, levels and the number of questions, then print or save as PDF."}
    return [("/worksheets/", meta, body, "worksheets.py")]
