/* Worksheet maker (/worksheets/): builds a printable worksheet from the question pool (/static/qb-pool.json) in the browser.
   Nothing is saved or sent. Uses the same look as the topic worksheets (static/css/qbank.css, .qb-ws). */
(function () {
  var raw = document.getElementById('wsdata'), form = document.getElementById('ws-form'), out = document.getElementById('ws-out');
  if (!raw || !form) return;
  var D = JSON.parse(raw.textContent), pool = null, subj = D.subjects[0].slug;
  var LV = { 1: ['Warm-up', '🌱'], 2: ['Core', '🌿'], 3: ['Challenge', '🌳'] };
  var msg = form.querySelector('.ws-msg');
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function shuffle(a) { for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }

  function drawSubjects() {
    document.getElementById('ws-subj').innerHTML = D.subjects.map(function (s) {
      return '<label class="ws-chip"><input type="radio" name="subj" value="' + s.slug + '"' + (s.slug === subj ? ' checked' : '') + '> ' + esc(s.title) + '</label>';
    }).join('');
    form.querySelectorAll('[name=subj]').forEach(function (r) { r.addEventListener('change', function () { subj = r.value; drawTopics(); }); });
  }
  function drawTopics() {
    var S = D.subjects.filter(function (s) { return s.slug === subj; })[0];
    document.getElementById('ws-topics').innerHTML = S.topics.map(function (t) {
      return '<details class="ws-topic"><summary><label><input type="checkbox" name="t" value="' + t.k + '"> ' + t.icon + ' ' + esc(t.title) + '</label> <span class="small">(' + t.n + ')</span></summary>' +
        '<div class="ws-parts">' + t.parts.map(function (p) {
          return '<label class="ws-line"><input type="checkbox" name="p" data-t="' + t.k + '" value="' + p.slug + '" checked> ' + esc(p.title) + ' <span class="small">(' + p.n + ')</span></label>';
        }).join('') + '</div></details>';
    }).join('');
  }
  form.addEventListener('click', function (e) {
    var b = e.target.closest('.ws-all'); if (!b) return;
    e.preventDefault();
    form.querySelectorAll('[name=t]').forEach(function (c) { c.checked = b.getAttribute('data-all') === 't'; });
  });
  form.addEventListener('change', function (e) {   // ticking a part ticks its topic
    if (e.target.name === 'p' && e.target.checked) { var t = form.querySelector('[name=t][value="' + e.target.getAttribute('data-t') + '"]'); if (t) t.checked = true; }
  });

  function getPool() {
    if (pool) return Promise.resolve(pool);
    return fetch(D.pool).then(function (r) { return r.json(); }).then(function (p) { pool = p; return p; });
  }

  function make(p) {
    var topics = [].map.call(form.querySelectorAll('[name=t]:checked'), function (c) { return c.value; });
    var parts = {}; form.querySelectorAll('[name=p]').forEach(function (c) { if (c.checked) parts[c.getAttribute('data-t') + '|' + c.value] = 1; });
    var lv = [].map.call(form.querySelectorAll('[name=lv]:checked'), function (c) { return +c.value; });
    var n = +form.querySelector('[name=n]:checked').value;
    if (!topics.length) { msg.textContent = 'Tick at least one topic.'; return; }
    if (!lv.length) { msg.textContent = 'Tick at least one level.'; return; }
    var ids = Object.keys(p).filter(function (id) { var q = p[id]; return topics.indexOf(q.k) >= 0 && parts[q.k + '|' + q.sb] && lv.indexOf(q.lv) >= 0; });
    if (!ids.length) { msg.textContent = 'No questions match. Try more levels or parts.'; return; }
    // spread the choice across the chosen topics, then fill up
    var by = {}; shuffle(ids).forEach(function (id) { (by[p[id].k] = by[p[id].k] || []).push(id); });
    var pick = [], keys = Object.keys(by);
    while (pick.length < n && keys.some(function (k) { return by[k].length; })) keys.forEach(function (k) { if (pick.length < n && by[k].length) pick.push(by[k].shift()); });
    if (form.querySelector('#ws-mix').checked) shuffle(pick); else pick.sort(function (a, b) { return p[a].lv - p[b].lv; });
    msg.textContent = pick.length < n ? 'Only ' + pick.length + ' questions match, so the worksheet has ' + pick.length + '.' : '';
    var title = form.querySelector('#ws-title').value.trim() || (topics.length === 1 ? D.subjects.reduce(function (a, s) { return a.concat(s.topics); }, []).filter(function (t) { return t.k === topics[0]; })[0].title + ' worksheet' : 'KS3 ' + (subj === 'maths' ? 'Maths' : 'Physics') + ' worksheet');
    var qs = [], ans = [];
    pick.forEach(function (id) {
      var d = p[id].d, body, a;
      if (d.t === 'mc') {
        var order = shuffle(d.options.map(function (_, k) { return k; }));
        body = '<ol class="qb-ws-opts" type="A">' + order.map(function (k) { return '<li>' + d.options[k] + '</li>'; }).join('') + '</ol>';
        a = 'ABCD'[order.indexOf(d.answer)] + ': ' + d.options[d.answer];
      } else {
        body = '<p class="qb-ws-line">Answer: <span></span> ' + (d.unit || '') + '</p>';
        a = d.show + (d.unit ? ' ' + d.unit : '');
      }
      qs.push('<li class="qb-ws-q"><span class="qb-ws-lv" title="' + LV[p[id].lv][0] + '">' + LV[p[id].lv][1] + '</span><div class="q-text">' + d.q + '</div>' +
        (d.fig ? '<div class="q-fig">' + d.fig + '</div>' : '') + body + '</li>');
      ans.push('<li><b>' + a + '</b><br><span class="small">' + d.explain + '</span></li>');
    });
    out.hidden = false;
    out.innerHTML = '<p class="qb-ws-tools no-print"><button type="button" class="btn" id="ws-print">🖨️ Print or save as PDF</button> ' +
      '<button type="button" class="btn ghost" id="ws-new">🎲 New questions</button></p>' +
      '<h1>' + esc(title) + '</h1><p class="qb-ws-meta">' + pick.length + ' questions' + (form.querySelector('#ws-ans').checked ? ' · answers on the last page' : '') + '</p>' +
      '<p class="qb-ws-name">Name: <span></span> Date: <span></span></p><p class="small">Levels: 🌱 Warm-up · 🌿 Core · 🌳 Challenge. Show your working.</p>' +
      '<ol class="qb-ws-list">' + qs.join('') + '</ol>' +
      (form.querySelector('#ws-ans').checked ? '<div class="qb-ws-answers"><h2>Answers: ' + esc(title) + '</h2><ol>' + ans.join('') + '</ol></div>' : '') +
      '<p class="small">Made with the free worksheet maker at junior.examinerprep.com</p>';
    out.querySelector('#ws-print').addEventListener('click', function () { window.print(); });
    out.querySelector('#ws-new').addEventListener('click', function () { make(p); });
    out.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault(); msg.textContent = 'Making your worksheet…';
    getPool().then(make).catch(function () { msg.textContent = 'Sorry, the questions could not be loaded. Check your connection and try again.'; });
  });
  drawSubjects(); drawTopics();
})();
