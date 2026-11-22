/* Question bank (qbank.py). On a topic page: makes every question answerable in place, with instant marking,
   a hint after a first wrong try, a second try, then the worked answer. Filters by part, level and "my mistakes".
   On the hub and subject pages: fills the progress bars.
   Progress is kept inside the game state (localStorage "js-game-v1", see game.js) under S.qb:
     S.qb[questionId] = { r: 'good' | 'fixed' | 'missed', t: 'subject/topic' }
   so it is saved with the stars and goes nowhere else. Points come from JG.answer; no timers, nothing rewards speed. */
(function () {
  if (!window.JG) return;
  var S = JG.state(); S.qb = S.qb || {};

  /* ---------- progress bars (hub, subject and topic pages) ---------- */
  function topicDone(key) {
    var done = 0, good = 0;
    for (var id in S.qb) if (S.qb[id].t === key) { done++; if (S.qb[id].r !== 'missed') good++; }
    return { done: done, good: good };
  }
  function bars() {
    document.querySelectorAll('[data-qb-topic]').forEach(function (el) {
      var p = topicDone(el.getAttribute('data-qb-topic')), total = +el.getAttribute('data-qb-total');
      var m = el.querySelector('.qb-meter span'), t = el.querySelector('.qb-done');
      if (m) m.style.width = Math.min(100, Math.round(100 * p.done / total)) + '%';
      if (t) t.textContent = p.done ? p.done + ' of ' + total + ' tried' + (p.done === total ? ' 🎉' : '') : '';
      if (p.done) { el.hidden = false; el.classList.add('started'); }
      if (p.done === total) el.classList.add('complete');
    });
    document.querySelectorAll('[data-qb-subject]').forEach(function (el) {
      var subj = el.getAttribute('data-qb-subject'), n = 0;
      for (var id in S.qb) if ((S.qb[id].t || '').indexOf(subj + '/') === 0) n++;
      var t = el.querySelector('.qb-done');
      if (t && n) t.textContent = '⭐ You have answered ' + n + ' question' + (n === 1 ? '' : 's') + ' here';
    });
  }

  var raw = document.getElementById('qbdata');
  if (!raw) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bars); else bars();
    return;
  }

  var D = JSON.parse(raw.textContent);
  var list = document.getElementById('qb-list');
  var mascotSvg = document.querySelector('.qb-owl .mascot').outerHTML;
  var combo = 0;

  var PRAISE = ['Brilliant!', 'Spot on!', 'Yes, that\'s it!', 'Great thinking!', 'Nailed it!', 'Superb!', 'You got it!'];
  var FIXED = ['You fixed it, well done!', 'Great second try!', 'That\'s the way: learn and fix!'];
  var NEARLY = ['Not quite. Here\'s a hint.', 'Nearly! Have a look at this hint.', 'Good try. This hint should help.'];
  var MISSED = ['That one was tricky. Here\'s how it works.', 'No worries, mistakes help us learn. Here\'s the answer.'];
  var STATUS = { good: '✓ Right first time', fixed: '🛠️ Fixed on the second try', missed: '↻ Have another go later' };
  function save() { try { localStorage.setItem('js-game-v1', JSON.stringify(S)); } catch (e) {} }   // same key as game.js
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- numbers: "3/4", "1 1/2", "12", "2.5" (same rules as practice.js) ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function frac(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n: n / g, d: d / g }; }
  function parse(s) {
    s = String(s).trim().replace(/−/g, '-').replace(/,/g, '').replace(/^£/, '').replace(/\s+/g, ' ');
    var m = s.match(/^(-?\d+) (\d+)\/(\d+)$/);
    if (m) { var w = +m[1], a = +m[2], b = +m[3]; if (!b) return null; var f = frac(Math.abs(w) * b + a, b); if (w < 0) f.n = -f.n; return Object.assign(f, { raw: 'mixed' }); }
    m = s.match(/^(-?\d+)\/(\d+)$/);
    if (m) { if (!+m[2]) return null; return Object.assign(frac(+m[1], +m[2]), { raw: 'frac', rn: +m[1], rd: +m[2] }); }
    m = s.match(/^(-?\d*)\.(\d+)$|^(-?\d+)$/);
    if (m) { if (m[3] != null) return { n: +m[3], d: 1, raw: 'int' }; var dec = m[2], p = Math.pow(10, dec.length);
      var whole = m[1] === '' || m[1] === '-' ? 0 : Math.abs(+m[1]); var f2 = frac(whole * p + +dec, p); if (s[0] === '-') f2.n = -f2.n; return Object.assign(f2, { raw: 'dec' }); }
    return null;
  }
  function same(a, b) { return a.n * b.d === b.n * a.d; }
  function judge(q, input) {
    var got = parse(input), want = parse(q.answer);
    if (!got) return 'unreadable';
    if (!same(got, want)) return 'wrong';
    if (q.simplest && got.raw === 'frac' && got.rd !== want.d) return 'unsimplified';
    return 'right';
  }

  /* ---------- one question card ---------- */
  function say(fb, kind, text, extra) {
    fb.className = 'q-feedback ' + kind;
    fb.innerHTML = '<div class="fb-row"><div class="fb-mascot">' + mascotSvg + '</div><div><p class="fb-title">' + text + '</p>' + (extra || '') + '</div></div>';
  }

  function setStatus(li) {
    var rec = S.qb[li.getAttribute('data-id')], st = li.querySelector('.qb-status');
    li.classList.remove('good', 'fixed', 'missed');
    if (rec) { li.classList.add(rec.r); st.textContent = STATUS[rec.r]; } else st.textContent = '';
  }

  function build(li) {
    var id = li.getAttribute('data-id'), q = D.questions[id];
    var area = li.querySelector('.qb-area'), fb = li.querySelector('.q-feedback');
    var tries = 0, usedHint = false;
    area.innerHTML = ''; fb.innerHTML = ''; fb.className = 'q-feedback';
    li.classList.remove('pop', 'shake');

    function check(ok, el) {
      tries++;
      var before = S.qb[id];
      if (ok) {
        combo++;
        var r = tries === 1 ? 'good' : 'fixed';
        if (!before || before.r !== 'good') S.qb[id] = { r: r, t: D.key };
        el.classList.remove('wrong'); el.classList.add('right'); lock();
        li.classList.add('pop');
        var why = '<details class="why"><summary>Why?</summary><div>' + q.explain + '</div></details>';
        if (before && before.r === 'good') {
          say(fb, 'good', 'Still right! You already had this one.', why);
        } else {
          var pts = JG.answer(tries === 1 ? 'first' : 'second', combo, usedHint, D.subject);
          say(fb, 'good', (tries === 1 ? pick(PRAISE) : pick(FIXED)) + ' <span class="plus">+' + pts + ' ⭐</span>', why);
        }
        if (combo === 3 || combo === 5 || combo === 8 || (combo > 8 && combo % 5 === 0)) { JG.confetti(50); if (combo >= 5) JG.toast('🔥 ' + combo + ' in a row!'); }
        done();
      } else if (tries === 1) {
        combo = 0; usedHint = true;
        el.classList.add('wrong'); if (el.tagName === 'BUTTON') el.disabled = true;
        li.classList.remove('shake'); void li.offsetWidth; li.classList.add('shake');
        say(fb, 'hint', pick(NEARLY), '<div class="hint">💡 ' + q.hint + '</div><p class="small">Have another go!</p>');
        if (el.tagName === 'INPUT') el.select();
      } else {
        combo = 0;
        if (!before || before.r === 'missed') S.qb[id] = { r: 'missed', t: D.key };
        el.classList.add('wrong'); lock();
        if (q.t === 'mc') area.querySelectorAll('.opt').forEach(function (b) { if (+b.getAttribute('data-i') === q.answer) b.classList.add('right'); });
        var pts2 = before && before.r === 'good' ? 0 : JG.answer('missed', 0, usedHint, D.subject);
        say(fb, 'missed', pick(MISSED) + (pts2 ? ' <span class="plus">+' + pts2 + ' ⭐ for trying</span>' : ''),
          (q.t === 'num' ? '<p class="answer">Answer: <b>' + q.show + (q.unit ? ' ' + q.unit : '') + '</b></p>' : '') + '<div class="explain">' + q.explain + '</div>');
        done();
      }
    }
    function lock() { area.querySelectorAll('button, input').forEach(function (x) { x.disabled = true; }); }
    function done() {
      setStatus(li); counts(); bars();
      var again = h('button', 'btn ghost qb-again', 'Try this one again'); again.type = 'button';
      again.addEventListener('click', function () { build(li); });
      fb.appendChild(again);
      var p = topicDone(D.key), total = Object.keys(D.questions).length;
      if (p.done === total && !S.qb['_done_' + D.key]) {
        S.qb['_done_' + D.key] = { r: 'good', t: '' }; save();
        JG.toast('🏆 You have tried every question in this topic!', 't-badge'); JG.confetti(160);
      }
    }

    if (q.t === 'mc') {
      var order = q.options.map(function (_, k) { return k; });
      for (var k = order.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = order[k]; order[k] = order[j]; order[j] = t; }
      var opts = h('div', 'q-options');
      order.forEach(function (idx) {
        var b = h('button', 'opt', q.options[idx]); b.type = 'button'; b.setAttribute('data-i', idx);
        b.addEventListener('click', function () { if (!b.disabled) check(idx === q.answer, b); });
        opts.appendChild(b);
      });
      area.appendChild(opts);
    } else {
      var form = h('form', 'q-num-form'), fid = 'a-' + id;
      var isFrac = /\//.test(q.answer);
      form.innerHTML = '<label class="sr" for="' + fid + '">Your answer</label><input id="' + fid + '" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
        'inputmode="' + (isFrac ? 'text' : 'decimal') + '" placeholder="' + (isFrac ? 'e.g. 3/4' : 'Type a number') + '">' + (q.unit ? '<span class="unit">' + q.unit + '</span>' : '') +
        '<button class="btn" type="submit">Check</button>';
      var inp = form.querySelector('input');
      if (isFrac) form.appendChild(h('p', 'small tip', 'Type a fraction with a slash, like 3/4.'));
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        if (inp.disabled) return;
        var v = judge(q, inp.value);
        if (v === 'unreadable') { say(fb, 'info', 'Type your answer as a number' + (isFrac ? ' or a fraction like 3/4' : '') + '.'); return; }
        if (v === 'unsimplified') { say(fb, 'info', 'That\'s equal to the answer, but can you write it in its simplest form?'); inp.select(); return; }
        check(v === 'right', inp);
      });
      area.appendChild(form);
    }
  }

  /* ---------- filters ---------- */
  var F = { sub: '', level: '', mine: '' };
  var items = [].slice.call(list.querySelectorAll('.qb-q'));
  var box = document.getElementById('qb-filters');

  function counts() {
    var nNew = 0, nMis = 0;
    items.forEach(function (li) { var r = S.qb[li.getAttribute('data-id')]; if (!r) nNew++; else if (r.r !== 'good') nMis++; });
    box.querySelector('[data-f="mine"][data-v="new"] .qb-c').textContent = nNew;
    box.querySelector('[data-f="mine"][data-v="mistakes"] .qb-c').textContent = nMis;
  }
  function apply() {
    var shown = 0, n = 0;
    items.forEach(function (li) {
      var r = S.qb[li.getAttribute('data-id')];
      var ok = (!F.sub || li.getAttribute('data-sub') === F.sub) && (!F.level || li.getAttribute('data-level') === F.level) &&
        (!F.mine || (F.mine === 'new' ? !r : r && r.r !== 'good'));
      li.hidden = !ok;
      if (ok) { shown++; li.querySelector('.qb-n').textContent = ++n; }
    });
    box.querySelector('.qb-shown').textContent = shown === items.length ? 'Showing all ' + shown + ' questions' : 'Showing ' + shown + ' of ' + items.length + ' questions';
    document.querySelector('.qb-empty').hidden = shown > 0;
  }
  box.addEventListener('click', function (e) {
    var b = e.target.closest('.qb-f'); if (!b) return;
    var f = b.getAttribute('data-f');
    F[f] = b.getAttribute('data-v');
    box.querySelectorAll('[data-f="' + f + '"]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
    apply();
  });

  /* ---------- go ---------- */
  document.documentElement.classList.add('qb-live');
  items.forEach(function (li) {
    setStatus(li); build(li);
  });
  box.hidden = false;
  counts(); apply(); bars();
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }
})();
