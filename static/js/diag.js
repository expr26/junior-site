/* Level check runner (/ready-for-year-7/). One try per question, no hints, no timer, and an
   "I haven't learned this yet" button. After each answer the child sees the right answer and why.
   At the end every area gets Ready / Nearly there / Practise this first, with links.
   Saved in js-game-v1 under S.diag[slug] = { at, areas: { key: right } }. Stars come from game.js like everywhere else. */
(function () {
  var box = document.getElementById('diag'), raw = document.getElementById('ddata');
  if (!box || !raw || !window.JG) return;
  var D = JSON.parse(raw.textContent), Q = D.questions, A = D.areas;
  var mascotSvg = box.querySelector('.mascot').outerHTML;
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  /* numbers: same rules as practice.js */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { var t = b; b = a % b; a = t; } return a || 1; }
  function frac(n, d) { if (d < 0) { n = -n; d = -d; } var g = gcd(n, d); return { n: n / g, d: d / g }; }
  function parse(s) {
    s = String(s).trim().replace(/−/g, '-').replace(/\s+/g, ' ').replace(/(\d),(?=\d{3}(\D|$))/g, '$1').replace(/^£/, '');
    var m = s.match(/^(-?\d+) (\d+)\/(\d+)$/);
    if (m) { if (!+m[3]) return null; var f = frac(Math.abs(+m[1]) * +m[3] + +m[2], +m[3]); if (+m[1] < 0) f.n = -f.n; return f; }
    m = s.match(/^(-?\d+)\/(\d+)$/);
    if (m) return +m[2] ? frac(+m[1], +m[2]) : null;
    m = s.match(/^(-?\d*)\.(\d+)$|^(-?\d+)$/);
    if (!m) return null;
    if (m[3] != null) return { n: +m[3], d: 1 };
    var p = Math.pow(10, m[2].length), w = m[1] === '' || m[1] === '-' ? 0 : Math.abs(+m[1]), f2 = frac(w * p + +m[2], p);
    if (s[0] === '-') f2.n = -f2.n; return f2;
  }

  var PRAISE = ['Spot on!', 'Yes!', 'Nice one!', 'Correct!', 'Great!'];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  var i, right, results, earned;

  function head() {
    var bar = h('div', 'r-head');
    var dots = h('ol', 'r-dots'); dots.setAttribute('aria-label', 'Question ' + (i + 1) + ' of ' + Q.length);
    Q.forEach(function (_, k) { dots.appendChild(h('li', k < i ? results[k] : k === i ? 'now' : '')); });
    bar.appendChild(dots); bar.appendChild(h('span', 'r-points', '⭐ +' + earned));
    return bar;
  }

  function show() {
    var q = Q[i];
    box.innerHTML = '';
    box.appendChild(head());
    var card = h('div', 'qcard');
    card.appendChild(h('p', 'q-num', A[q.a].icon + ' ' + esc(A[q.a].name) + ' · ' + (i + 1) + ' of ' + Q.length));
    card.appendChild(h('div', 'q-text', q.q));
    if (q.fig) card.appendChild(h('div', 'q-fig', q.fig));
    var area = h('div', 'q-area'); card.appendChild(area);
    var fb = h('div', 'q-feedback'); fb.setAttribute('role', 'status');
    var skip = h('button', 'btn ghost diag-skip', 'I haven\'t learned this yet'); skip.type = 'button';
    skip.addEventListener('click', function () { done('skip'); });
    if (q.t === 'mc') {
      var order = q.options.map(function (_, k) { return k; });
      for (var k = order.length - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)), t = order[k]; order[k] = order[j]; order[j] = t; }
      var list = h('div', 'q-options');
      order.forEach(function (idx) {
        var b = h('button', 'opt', q.options[idx]); b.type = 'button'; b.setAttribute('data-i', idx);
        b.addEventListener('click', function () { b.classList.add(idx === q.answer ? 'right' : 'wrong'); done(idx === q.answer ? 'good' : 'missed'); });
        list.appendChild(b);
      });
      area.appendChild(list);
    } else {
      var form = h('form', 'q-num-form');
      form.innerHTML = '<label class="sr" for="ans">Your answer</label><input id="ans" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="' +
        (/\//.test(q.answer) ? 'text' : 'decimal') + '" placeholder="' + (/\//.test(q.answer) ? 'e.g. 3/4' : 'Type a number') + '">' +
        (q.unit ? '<span class="unit">' + q.unit + '</span>' : '') + '<button class="btn" type="submit">Check</button>';
      var inp = form.querySelector('input');
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var got = parse(inp.value), want = parse(q.answer);
        if (!got) { fb.className = 'q-feedback info'; fb.innerHTML = '<p class="fb-title">Type your answer as a number' + (/\//.test(q.answer) ? ' or a fraction like 3/4' : '') + '.</p>'; return; }
        var ok = got.n * want.d === want.n * got.d;
        inp.classList.add(ok ? 'right' : 'wrong');
        done(ok ? 'good' : 'missed');
      });
      area.appendChild(form);
      setTimeout(function () { inp.focus({ preventScroll: true }); }, 30);
    }
    card.appendChild(skip);
    card.appendChild(fb);
    box.appendChild(card);
    if (i > 0) box.scrollIntoView({ block: 'start', behavior: 'smooth' });

    function done(r) {
      card.querySelectorAll('button, input').forEach(function (x) { x.disabled = true; });
      skip.remove();
      results[i] = r === 'skip' ? 'missed' : r;
      if (r === 'good') right[q.a] = (right[q.a] || 0) + 1;
      earned += JG.answer(r === 'good' ? 'first' : 'missed', 0, false, 'maths');
      if (q.t === 'mc') area.querySelectorAll('.opt').forEach(function (b) { if (+b.getAttribute('data-i') === q.answer) b.classList.add('right'); });
      var title = r === 'good' ? pick(PRAISE) : r === 'skip' ? 'Thanks for being honest! Here\'s how it works.' : 'Not this time. Here\'s how it works.';
      fb.className = 'q-feedback ' + (r === 'good' ? 'good' : 'missed');
      fb.innerHTML = '<div class="fb-row"><div class="fb-mascot">' + mascotSvg + '</div><div><p class="fb-title">' + title + '</p>' +
        (q.t === 'num' && r !== 'good' ? '<p class="answer">Answer: <b>' + q.show + (q.unit ? ' ' + q.unit : '') + '</b></p>' : '') +
        '<div class="explain">' + q.explain + '</div></div></div>';
      var nx = h('button', 'btn next', i + 1 < Q.length ? 'Next question →' : 'See my results 🎉'); nx.type = 'button';
      nx.addEventListener('click', function () { i++; if (i < Q.length) show(); else finish(); });
      fb.appendChild(nx); nx.focus({ preventScroll: true });
      var hd = box.querySelector('.r-head'); if (hd) box.replaceChild(head(), hd);
    }
  }

  function level(k) {
    var n = A[k].n, r = right[k] || 0;
    return r === n ? 'ready' : r >= n - 1 && n > 1 ? 'nearly' : 'practise';
  }
  var LABEL = { ready: '✅ Ready', nearly: '🌱 Nearly there', practise: '🎯 Practise this first' };

  function finish() {
    var S = JG.state();
    S.diag = S.diag || {};
    S.diag[D.slug] = { at: JG.today(), areas: right };
    JG.award('level-check');
    JG.save();
    var badges = JG.drain();
    var keys = Object.keys(A);
    var order = { practise: 0, nearly: 1, ready: 2 };
    keys.sort(function (a, b) { return order[level(a)] - order[level(b)]; });
    var nReady = keys.filter(function (k) { return level(k) === 'ready'; }).length;
    var rows = keys.map(function (k) {
      var lv = level(k), links = lv === 'ready' ? '' : '<span class="diag-links">' + A[k].links.map(function (l) { return '<a href="' + l[1] + '">' + esc(l[0]) + ' →</a>'; }).join(' ') + '</span>';
      return '<li class="diag-row ' + lv + '"><span class="diag-ic" aria-hidden="true">' + A[k].icon + '</span><span class="diag-name"><b>' + esc(A[k].name) + '</b>' + links +
        '</span><span class="diag-lv">' + LABEL[lv] + '</span></li>';
    }).join('');
    box.innerHTML = '';
    var end = h('div', 'endcard diag-end');
    end.innerHTML = '<div class="end-mascot cheer">' + mascotSvg + '</div><h3>You finished the check!</h3>' +
      '<p>' + (nReady === keys.length ? 'Wow: you\'re ready in every area. Secondary school Maths, here you come!' :
        nReady ? 'You\'re ready in ' + nReady + ' of ' + keys.length + ' areas. Start with the 🎯 ones at the top: a little practice there will help the most.' :
        'Great effort! Now you know exactly where to start. Pick one 🎯 area and have a go at the practice.') + '</p>' +
      '<ul class="plain diag-list">' + rows + '</ul>' +
      '<p class="end-score"><b>+' + earned + ' ⭐</b> for finishing</p>' +
      (badges.length ? '<div class="end-badges"><p><b>New badges</b></p>' + badges.map(function (b) { return '<span class="badge-pill"><span>' + b.icon + '</span>' + b.name + '</span>'; }).join('') + '</div>' : '') +
      '<p class="actions no-print"><button class="btn" type="button" data-print>Print for my parent 🖨️</button><button class="btn ghost" type="button" id="again">Do the check again</button></p>' +
      '<p class="small">Saved on this device only. Your parent can also see it in the <a href="/parent-report/">report for parents</a>.</p>';
    box.appendChild(end);
    end.querySelector('[data-print]').addEventListener('click', function () { window.print(); });
    end.querySelector('#again').addEventListener('click', start);
    JG.confetti(120);
    end.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function start() { i = 0; right = {}; results = []; earned = 0; show(); }
  var go = h('button', 'btn', 'Start the check'); go.type = 'button';
  go.addEventListener('click', start);
  box.querySelector('.runner-mascot').appendChild(go);
})();
