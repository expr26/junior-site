/* Rounding Rollercoaster: a car stops on a hill between two "stations" (the two possible rounded values).
   The hill's top is exactly halfway between the stations. The child sends the car to the NEAREST station.
   Rules used: look at the digit just after the place you round to; 0-4 rounds down, 5-9 rounds up.
   Exactly halfway (a 5 with nothing after it) rounds UP, so a car on the very top goes to the bigger station.
   Answers checked by hand: 47 -> 50; 342 -> 300; 650 -> 700; 7,815 -> 8,000; 2.36 -> 2.4 (1 d.p.); 3,962 -> 4,000.
   Place value: in 6,284 the 2 is worth 200; 58 / 10 = 5.8. Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';

  var ROUNDS = [
    { lo: 40, hi: 50, v: 47, ans: 1, text: 'Round <b>47</b> to the <b>nearest 10</b>. Send the car to the nearest station!',
      hint: 'The top of the hill is halfway: 45. Is 47 before or after the top?', why: '47 is past the halfway point (45), so it is nearer 50. 47 rounds to 50.' },
    { lo: 300, hi: 400, v: 342, ans: 0, text: 'Round <b>342</b> to the <b>nearest 100</b>.',
      hint: 'Rounding to the nearest 100, look at the tens digit. In 342 it is 4, and 4 is less than 5.', why: '342 is before the halfway point (350), so it is nearer 300. 342 rounds to 300.' },
    { q: 'In the number <b>6,284</b>, what is the value of the digit <b>2</b>?', opts: ['200', '20', '2', '2,000'], ans: 0,
      pv: { cols: ['Th', 'H', 'T', 'O'], digits: ['6', '2', '8', '4'], mark: 1 },
      hint: 'Count the places from the right: ones, tens, hundreds, thousands. Which column is the 2 in?', why: '6,284 is 6 thousands, 2 hundreds, 8 tens and 4 ones, so the 2 is worth 200.' },
    { lo: 600, hi: 700, v: 650, ans: 1, text: 'Round <b>650</b> to the <b>nearest 100</b>. Oh! The car has stopped right on top of the hill!',
      hint: 'When a number is exactly halfway, there is a rule: halfway rounds <b>up</b>.', why: '650 is exactly halfway between 600 and 700. The rule is that halfway rounds up, so 650 rounds to 700.' },
    { lo: 7000, hi: 8000, v: 7815, ans: 1, text: 'Round <b>7,815</b> to the <b>nearest 1000</b>.',
      hint: 'Rounding to the nearest 1000, look at the hundreds digit. In 7,815 it is 8, and 5 or more rounds up.', why: '7,815 is past the halfway point (7,500), so it rounds up to 8,000.' },
    { lo: 2.3, hi: 2.4, v: 2.36, ans: 1, dp: 2, text: 'Round <b>2.36</b> to <b>1 decimal place</b>.',
      hint: '1 decimal place means the nearest tenth. Look at the next digit, the hundredths: 6. Is that 5 or more?', why: '2.36 is between 2.3 and 2.4, past halfway (2.35), so it rounds up to 2.4.' },
    { q: 'What is <b>58 ÷ 10</b>?', opts: ['5.8', '580', '0.58', '58.0'], ans: 0,
      pv: { cols: ['H', 'T', 'O', '•', 't'], digits: ['', '5', '8', '', ''], after: ['', '', '5', '•', '8'] },
      hint: 'Dividing by 10 makes a number 10 times smaller: every digit moves one place to the right. (58.0 is still 58!)', why: '58 ÷ 10 = 5.8. The 5 tens become 5 ones, and the 8 ones become 8 tenths.' },
    { lo: 3900, hi: 4000, v: 3962, ans: 1, text: 'Last ride! Round <b>3,962</b> to the <b>nearest 100</b>.',
      hint: 'The tens digit is 6, so round up. One hundred more than 3,900 is 4,000.', why: '3,962 is past halfway (3,950), so it rounds up to the next hundred: 4,000.' }
  ];

  var X0 = 56, X1 = 344, BASE = 196, TOP = 104;
  function f(v) { return v.toFixed(1); }
  function fmt(n, dp) { return dp ? n.toFixed(dp) : n.toLocaleString('en-GB'); }
  function pos(t) { return [X0 + (X1 - X0) * t, BASE - (BASE - TOP) * Math.sin(Math.PI * t)]; }
  function slope(t) { return Math.atan2(-(BASE - TOP) * Math.PI * Math.cos(Math.PI * t), X1 - X0) * 180 / Math.PI; }

  Arcade.game({
    intro: 'All aboard the Rounding Rollercoaster! 🎢 The car stops on a hill between two stations. Send it to the <b>nearest</b> station.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], busy = false, wrong = -1, arrived = -1, t0 = R.q ? 0 : (R.v - R.lo) / (R.hi - R.lo), t = t0, shown = false;
      var dp = R.dp ? 1 : 0, L = R.q ? '' : fmt(R.lo, dp), H = R.q ? '' : fmt(R.hi, dp), V = R.q ? '' : fmt(R.v, R.dp), M = R.q ? '' : fmt((R.lo + R.hi) / 2, R.dp);
      stage.innerHTML = '<p class="q-num">Ride ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="rr-svg" viewBox="0 0 400 ' + (R.q ? (R.pv.after ? 168 : 106) : 260) + '" role="img"></svg><p class="rr-out" aria-live="polite"></p>' +
        (R.q ? '<div class="q-options"></div>' :
          '<div class="rr-ctrl"><button class="btn ghost" type="button" data-s="0">◀ ' + L + '</button><button class="btn ghost" type="button" data-s="1">' + H + ' ▶</button></div>');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.rr-out');
      ui.owl(R.q ? 'Place value: each column is worth 10 times the one on its right.' :
        i === 0 ? 'The top of the hill is exactly halfway. The car rolls down to the side it is on.' : 'Find the halfway point first, then decide which side the car is on.');

      function pvChart() {
        var P = R.pv, n = P.cols.length, w = 64, x0 = 200 - n * w / 2, s = '';
        P.cols.forEach(function (c, k) {
          var x = x0 + k * w, dot = c === '•';
          s += '<rect x="' + (x + 3) + '" y="8" width="' + (w - 6) + '" height="30" rx="8" class="rr-pvh' + (dot ? ' dot' : '') + '"/>' +
            '<text x="' + (x + w / 2) + '" y="29" text-anchor="middle" class="rr-pvl">' + (dot ? '' : c) + '</text>';
          var d = P.digits[k], mk = P.mark === k && shown;
          s += '<rect x="' + (x + 3) + '" y="46" width="' + (w - 6) + '" height="52" rx="10" class="rr-pvc' + (mk ? ' mark' : '') + (dot ? ' dot' : '') + '"/>' +
            '<text x="' + (x + w / 2) + '" y="83" text-anchor="middle" class="rr-pvd">' + (dot ? '' : d) + '</text>';
          if (P.after) {
            var a = P.after[k];
            s += '<rect x="' + (x + 3) + '" y="108" width="' + (w - 6) + '" height="52" rx="10" class="rr-pvc' + (shown && a ? ' mark' : '') + (dot ? ' dot' : '') + '"/>' +
              '<text x="' + (x + w / 2) + '" y="' + 145 + '" text-anchor="middle" class="rr-pvd">' + (shown ? a : (k === 2 ? '?' : '')) + '</text>';
          }
        });
        if (P.after) s += '<text x="' + (x0 - 8) + '" y="83" text-anchor="end" class="rr-pvs">58</text><text x="' + (x0 - 8) + '" y="145" text-anchor="end" class="rr-pvs">÷10</text>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', P.after ? 'Place value chart: 58 is 5 tens and 8 ones. The answer row is ' + (shown ? '5 ones and 8 tenths.' : 'empty.') :
          'Place value chart for 6,284: 6 thousands, 2 hundreds, 8 tens, 4 ones.');
        out.innerHTML = shown ? (P.after ? '58 ÷ 10 = <b>5.8</b> ➡️ each digit moved one place right' : 'The 2 is in the <b>hundreds</b> column: it is worth <b>200</b>') : '';
      }

      function draw() {
        if (R.pv) { pvChart(); return; }
        var s = '<rect x="0" y="0" width="400" height="260" rx="16" class="rr-sky"/><text x="330" y="40" class="rr-cloud">☁️</text><text x="40" y="52" class="rr-cloud">☁️</text>';
        var d = 'M' + X0 + ' ' + BASE;
        for (var k = 1; k <= 40; k++) { var p = pos(k / 40); d += ' L' + f(p[0]) + ' ' + f(p[1]); }
        for (var k2 = 1; k2 < 10; k2++) { var q = pos(k2 / 10); s += '<line x1="' + f(q[0]) + '" y1="' + f(q[1]) + '" x2="' + f(q[0]) + '" y2="' + BASE + '" class="rr-strut"/>'; }
        s += '<path d="' + d + '" class="rr-rail"/><path d="' + d + '" class="rr-ties"/>';
        s += '<line x1="' + X0 + '" y1="' + (BASE + 18) + '" x2="' + X1 + '" y2="' + (BASE + 18) + '" class="rr-nl"/>';
        for (var k3 = 0; k3 <= 10; k3++) { var x = X0 + (X1 - X0) * k3 / 10; s += '<line x1="' + f(x) + '" y1="' + (BASE + (k3 % 5 ? 13 : 9)) + '" x2="' + f(x) + '" y2="' + (BASE + 23) + '" class="rr-tick"/>'; }
        var mid = pos(0.5);
        s += '<text x="' + f(mid[0]) + '" y="' + (BASE + 40) + '" text-anchor="middle" class="rr-mid">halfway ' + M + '</text>';
        [[X0, L, 0], [X1, H, 1]].forEach(function (st) {
          var cls = 'rr-st' + (arrived === st[2] ? ' ok' : '') + (wrong === st[2] ? ' no' : '');
          s += '<rect x="' + (st[0] - 44) + '" y="' + (BASE - 4) + '" width="88" height="16" rx="5" class="' + cls + '"/>' +
            '<text x="' + st[0] + '" y="' + (BASE + 52) + '" text-anchor="middle" class="rr-stl">' + st[1] + '</text>' +
            '<text x="' + st[0] + '" y="' + (BASE - 66) + '" text-anchor="middle" class="rr-sign">' + (arrived === st[2] ? '🎉' : wrong === st[2] ? '❌' : '🚉') + '</text>';
        });
        var c = pos(t), ang = slope(t) * Math.min(1, Math.min(t, 1 - t) * 8);
        s += '<g transform="translate(' + f(c[0]) + ' ' + f(c[1]) + ') rotate(' + f(ang) + ')"><rect x="-22" y="-24" width="44" height="20" rx="7" class="rr-car"/>' +
          '<circle cx="-12" cy="-3" r="5" class="rr-wheel"/><circle cx="12" cy="-3" r="5" class="rr-wheel"/><text x="0" y="-26" text-anchor="middle" class="rr-rider">🦉</text></g>';
        var tag = pos(t0);
        var tx = Math.min(Math.max(tag[0], 38), 362);
        if (t === t0) s += '<g><rect x="' + f(tx - 34) + '" y="' + f(tag[1] - 82) + '" width="68" height="28" rx="14" class="rr-tag"/>' +
          '<text x="' + f(tx) + '" y="' + f(tag[1] - 62) + '" text-anchor="middle" class="rr-tagt">' + V + '</text></g>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Roller-coaster hill from station ' + L + ' to station ' + H + '. The top of the hill is halfway, ' + M + '. The car is at ' + V + '.');
        out.innerHTML = arrived >= 0 ? V + ' rounds to <b>' + (arrived ? H : L) + '</b> 🎢' : wrong >= 0 ? 'Whoops, that station is further away!' : 'The car is at <b>' + V + '</b>. Which station is nearer?';
      }

      function roll(to, then) {
        if (still) { t = to; draw(); then(); return; }
        var from = t, start = performance.now();
        (function go(now) { var p = Math.min(1, (now - start) / 650), e = p * p * (3 - 2 * p); t = from + (to - from) * e; draw(); if (p < 1) requestAnimationFrame(go); else then(); })(start);
      }

      if (R.q) {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            if (stage.classList.contains('locked')) { shown = true; draw(); }
          });
          box.appendChild(b);
        });
      } else {
        stage.querySelectorAll('[data-s]').forEach(function (b) {
          b.addEventListener('click', function () {
            if (busy || stage.classList.contains('locked')) return;
            var s = +b.getAttribute('data-s'), ok = s === R.ans; busy = true; wrong = -1;
            roll(s, function () {
              busy = false;
              if (ok) arrived = s; else { wrong = s; t = t0; }
              draw();
              ui.check(ok, { hint: R.hint, why: R.why, reveal: function () { wrong = -1; arrived = R.ans; t = R.ans; draw(); } });
            });
          });
        });
      }
      draw();
    }
  });
})();
