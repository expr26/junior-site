/* Practice runner for a unit page. Reads the questions from <script id="qdata">, shows one at a time,
   gives instant feedback, a hint after a first wrong try, a second try, then the worked answer.
   Points and badges come from game.js (window.JG). */
(function () {
  var box = document.getElementById('runner'), raw = document.getElementById('qdata');
  if (!box || !raw || !window.JG) return;
  var D = JSON.parse(raw.textContent), Q = D.questions;
  var mascotSvg = box.querySelector('.mascot').outerHTML;

  var PRAISE = ['Brilliant!', 'Spot on!', 'Yes, that\'s it!', 'Great thinking!', 'Nailed it!', 'Superb!', 'You got it!'];
  var FIXED = ['You fixed it, well done!', 'Great second try!', 'That\'s the way: learn and fix!'];
  var NEARLY = ['Not quite. Here\'s a hint.', 'Nearly! Have a look at this hint.', 'Good try. This hint should help.'];
  var MISSED = ['That one was tricky. Here\'s how it works.', 'No worries, mistakes help us learn. Here\'s the answer.'];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  /* ---------- numbers: "3/4", "1 1/2", "12", "2.5" ---------- */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function frac(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n: n / g, d: d / g }; }
  function parse(s) {
    s = String(s).trim().replace(/−/g, '-').replace(/\s+/g, ' ');
    s = s.replace(/(\d),(?=\d{3}(\D|$))/g, '$1');   // 2,500 → 2500
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
  /* 'right' | 'unsimplified' | 'wrong' | 'unreadable' */
  function judge(q, input) {
    var got = parse(input), want = parse(q.answer);
    if (!got) return 'unreadable';
    if (!same(got, want)) return 'wrong';
    if (q.simplest && got.raw === 'frac' && got.rd !== want.d) return 'unsimplified';
    return 'right';
  }

  /* ---------- run ---------- */
  var i, tries, combo, firstTry, earned, usedHint;
  function start() {
    i = 0; combo = 0; firstTry = 0; earned = 0;
    show();
  }

  function head() {
    var bar = h('div', 'r-head');
    var dots = h('ol', 'r-dots'); dots.setAttribute('aria-label', 'Question ' + (i + 1) + ' of ' + Q.length);
    Q.forEach(function (_, k) { var li = h('li', k < i ? (results[k] || '') : k === i ? 'now' : ''); dots.appendChild(li); });
    bar.appendChild(dots);
    var c = h('span', 'r-combo' + (combo >= 2 ? ' hot' : ''), combo >= 2 ? '🔥 ' + combo + ' in a row' : '');
    bar.appendChild(c);
    bar.appendChild(h('span', 'r-points', '⭐ +' + earned));
    return bar;
  }

  var results = [];
  function show() {
    var q = Q[i]; tries = 0; usedHint = false;
    box.innerHTML = '';
    box.appendChild(head());
    var card = h('div', 'qcard');
    card.appendChild(h('p', 'q-num', 'Question ' + (i + 1) + ' of ' + Q.length));
    card.appendChild(h('div', 'q-text', q.q));
    if (q.fig) card.appendChild(h('div', 'q-fig', q.fig));
    var area = h('div', 'q-area'); card.appendChild(area);
    var fb = h('div', 'q-feedback'); fb.setAttribute('role', 'status'); card.appendChild(fb);
    box.appendChild(card);

    if (q.t === 'mc') {
      var order = q.options.map(function (_, k) { return k; });
      for (var k = order.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = order[k]; order[k] = order[j]; order[j] = t; }
      var list = h('div', 'q-options');
      order.forEach(function (idx) {
        var b = h('button', 'opt', q.options[idx]); b.type = 'button'; b.setAttribute('data-i', idx);
        b.addEventListener('click', function () { if (b.disabled) return; check(idx === q.answer, b, list, fb, card); });
        list.appendChild(b);
      });
      area.appendChild(list);
      list.querySelector('button').focus({ preventScroll: true });
    } else {
      var form = h('form', 'q-num-form');
      form.innerHTML = '<label class="sr" for="ans">Your answer</label><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" ' +
        'inputmode="text" placeholder="' + (/\//.test(q.answer) ? 'e.g. 3/4' : 'Type a number') + '">' + (q.unit ? '<span class="unit">' + q.unit + '</span>' : '') +
        '<button class="btn" type="submit">Check</button>';
      var inp = form.querySelector('input');
      if (/\//.test(q.answer)) form.appendChild(h('p', 'small tip', 'Type a fraction with a slash, like 3/4.'));
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var v = judge(q, inp.value);
        if (v === 'unreadable') { say(fb, 'info', 'Type your answer as a number or a fraction like 3/4.'); return; }
        if (v === 'unsimplified') { say(fb, 'info', 'That\'s equal to the answer, but can you write it in its simplest form?'); inp.select(); return; }
        check(v === 'right', inp, form, fb, card);
      });
      area.appendChild(form);
      inp.focus({ preventScroll: true });
    }
    card.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }

  function say(fb, kind, text, extra) {
    fb.className = 'q-feedback ' + kind;
    fb.innerHTML = '<div class="fb-row"><div class="fb-mascot">' + mascotSvg + '</div><div><p class="fb-title">' + text + '</p>' + (extra || '') + '</div></div>';
  }

  function check(ok, el, area, fb, card) {
    var q = Q[i]; tries++;
    if (ok) {
      combo++;
      var outcome = tries === 1 ? 'first' : 'second';
      if (tries === 1) firstTry++;
      results[i] = tries === 1 ? 'good' : 'fixed';
      var pts = JG.answer(outcome, combo, usedHint, D.subject); earned += pts;
      el.classList.add('right'); lock(area);
      card.classList.add('pop');
      say(fb, 'good', (tries === 1 ? pick(PRAISE) : pick(FIXED)) + ' <span class="plus">+' + pts + ' ⭐</span>',
        '<details class="why"><summary>Why?</summary><div>' + q.explain + '</div></details>');
      if (combo === 3 || combo === 5 || combo === 8) JG.confetti(40);
      next(fb);
    } else if (tries === 1) {
      combo = 0; usedHint = true;
      el.classList.add('wrong'); if (el.tagName === 'BUTTON') el.disabled = true;
      card.classList.remove('shake'); void card.offsetWidth; card.classList.add('shake');
      say(fb, 'hint', pick(NEARLY), '<div class="hint">💡 ' + q.hint + '</div><p class="small">Have another go!</p>');
      if (el.tagName === 'INPUT') el.select();
    } else {
      combo = 0; results[i] = 'missed';
      el.classList.add('wrong'); lock(area);
      if (q.t === 'mc') area.querySelectorAll('.opt').forEach(function (b) { if (+b.getAttribute('data-i') === q.answer) b.classList.add('right'); });
      var pts2 = JG.answer('missed', 0, usedHint, D.subject); earned += pts2;
      say(fb, 'missed', pick(MISSED) + ' <span class="plus">+' + pts2 + ' ⭐ for trying</span>',
        (q.t === 'num' ? '<p class="answer">Answer: <b>' + q.show + (q.unit ? ' ' + q.unit : '') + '</b></p>' : '') + '<div class="explain">' + q.explain + '</div>');
      next(fb);
    }
    var hd = box.querySelector('.r-head'); if (hd) box.replaceChild(head(), hd);
  }

  function lock(area) { area.querySelectorAll('button, input').forEach(function (x) { x.disabled = true; }); }

  function next(fb) {
    var b = h('button', 'btn next', i + 1 < Q.length ? 'Next question →' : 'See my result 🎉'); b.type = 'button';
    b.addEventListener('click', function () { i++; if (i < Q.length) show(); else finish(); });
    fb.appendChild(b); b.focus({ preventScroll: true });
  }

  function finish() {
    var r = JG.finishUnit(D, firstTry, Q.length); earned += r.points;
    var badges = JG.drain();
    box.innerHTML = '';
    var end = h('div', 'endcard');
    var msg = r.stars === 3 ? 'Amazing work!' : r.stars === 2 ? 'Great job!' : 'Well done for finishing!';
    var tip = r.stars < 3 ? '<p>Try again to earn ' + (r.stars === 2 ? 'the third star' : 'more stars') + '. Every go makes you stronger.</p>' : '';
    end.innerHTML = '<div class="end-mascot cheer">' + mascotSvg + '</div>' +
      '<h3>' + msg + '</h3>' +
      '<div class="big-stars" aria-label="' + r.stars + ' out of 3 stars">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= r.stars ? 'on' : '') + '" style="animation-delay:' + (k * .25) + 's"></i>'; }).join('') + '</div>' +
      '<p class="end-score">' + firstTry + ' of ' + Q.length + ' right first time · <b>+' + earned + ' ⭐</b></p>' + tip +
      (badges.length ? '<div class="end-badges"><p><b>New badges</b></p>' + badges.map(function (b) { return '<span class="badge-pill"><span>' + b.icon + '</span>' + b.name + '</span>'; }).join('') + '</div>' : '') +
      '<p class="actions"><a class="btn" href="' + D.next.href + '">' + (D.next.title === 'Back to the topic map' ? 'Back to the topic map' : 'Next: ' + D.next.title + ' →') + '</a>' +
      '<button class="btn ghost" type="button" id="again">Try again</button></p>' +
      '<p class="small"><a href="/my-progress/">See all my stars and badges</a></p>';
    box.appendChild(end);
    end.querySelector('#again').addEventListener('click', function () { results = []; start(); });
    JG.confetti(r.stars === 3 ? 180 : 90);
    end.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  var go = h('button', 'btn', 'Start practising'); go.type = 'button';
  go.addEventListener('click', start);
  box.querySelector('.runner-mascot').appendChild(go);
})();
