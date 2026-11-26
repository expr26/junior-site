/* Seesaw Balance: moments and pressure.
   Model: a giant seesaw pivoted at its centre, with hooks 1 m apart (1 to 5 m from the pivot) on each side.
   The beam is uniform and pivoted at its middle, so its own weight has no turning effect and is left out.
   Moment = force (N) × perpendicular distance from the pivot (m), in N m. Weights on the left turn it anticlockwise,
   weights on the right turn it clockwise. It balances when the total clockwise moment = the total anticlockwise moment.
   Pressure = force ÷ area (here in N/cm²).
   Answers checked by hand: R1 20 × 3 = 60 → 20 N at 3 m. R2 30 × 2 = 60 → 20 N at 3 m. R3 10 × 4 = 40 N m.
   R4 40 × 1 = 40 → 10 N at 4 m. R5 10 × 5 + 20 × 2 = 90 → 30 N at 3 m. R6 50 × 2 = 100 → 50 N at 2 m or 20 N at 5 m
   (weights 10–60 N). R7 400 N ÷ 400 cm² = 1 N/cm², 400 N ÷ 2000 cm² = 0.2 N/cm². R8 10 N ÷ 0.01 cm² = 1000 N/cm²
   (head: 10 N ÷ 1 cm² = 10 N/cm²). */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';

  var ROUNDS = [
    { left: [[3, 20]], w: 20, d: 1, free: 'd',
      text: 'Hang your <b>20 N</b> weight on a hook on the right so the seesaw balances. Then press <b>Let go</b>.',
      hint: 'Your weight is the same as the one on the left, so it needs to be the same distance from the pivot.',
      why: 'Anticlockwise: 20 N × 3 m = 60 N m. Clockwise: 20 N × 3 m = 60 N m. Equal moments, so it balances!' },
    { left: [[2, 30]], w: 20, d: 1, free: 'd',
      text: 'Now the left weight is <b>30 N</b>. Where should your <b>20 N</b> weight go to balance it?',
      hint: 'Work out the moment on the left: 30 N × 2 m. Your 20 N weight needs the same moment. 20 N × ? m = that.',
      why: '30 N × 2 m = 60 N m on the left, and 20 N × 3 m = 60 N m on the right. A lighter weight balances by being further out.' },
    { q: 'A <b>10 N</b> weight hangs <b>4 m</b> from the pivot. What is its moment (turning effect)?', show: [4, 10],
      opts: ['40 N m', '14 N m', '2.5 N m'], ans: 0,
      hint: 'Moment = force × distance. Don\'t add them: multiply!',
      why: 'Moment = 10 N × 4 m = 40 N m. It turns the seesaw clockwise.' },
    { left: [[1, 40]], w: 40, d: 4, free: 'w',
      text: 'Your hook is fixed at <b>4 m</b>. Choose the weight that balances <b>40 N</b> at 1 m.',
      hint: 'The same weight would be far too strong 4 times further out. The left moment is 40 N × 1 m = 40 N m. What times 4 m makes 40?',
      why: '40 N × 1 m = 40 N m, and 10 N × 4 m = 40 N m. Four times the distance needs only a quarter of the force.' },
    { left: [[5, 10], [2, 20]], w: 30, d: 1, free: 'd',
      text: 'Two weights on the left this time! Where should your <b>30 N</b> weight go?',
      hint: 'Add up both moments on the left: (10 N × 5 m) + (20 N × 2 m). Then find where 30 N gives the same total.',
      why: 'Left: 10 × 5 + 20 × 2 = 50 + 40 = 90 N m. Right: 30 N × 3 m = 90 N m. Balanced!' },
    { left: [[2, 50]], w: 10, d: 1, free: 'both',
      text: 'You choose the weight <b>and</b> the hook! Balance <b>50 N</b> at 2 m. (There\'s more than one way.)',
      hint: 'The left moment is 50 N × 2 m = 100 N m. Find a weight and a distance that multiply to 100.',
      why: 'The left moment is 100 N m. Both 50 N × 2 m and 20 N × 5 m make 100 N m, so either one balances.' },
    { press: 'snow', q: 'Sam weighs <b>400 N</b>. His boots touch <b>400 cm²</b> of snow; his snowshoes touch <b>2000 cm²</b>. Using pressure = force ÷ area, which is right?',
      opts: ['Boots 1 N/cm², snowshoes 0.2 N/cm²', 'Boots 1 N/cm², snowshoes 5 N/cm²', 'The same: Sam weighs the same in both', 'Boots 0.2 N/cm², snowshoes 1 N/cm²'], ans: 0,
      hint: 'Sam\'s weight (the force) stays 400 N, but the area changes. Work out 400 ÷ 400 and 400 ÷ 2000. A bigger area gives a smaller pressure.',
      why: '400 N ÷ 400 cm² = 1 N/cm² in boots, but 400 N ÷ 2000 cm² = 0.2 N/cm² on snowshoes. Less pressure, so Sam doesn\'t sink.' },
    { press: 'pin', q: 'A thumb pushes a drawing pin with <b>10 N</b>. The point touches just <b>0.01 cm²</b> of the board. What is the pressure under the point?',
      opts: ['1000 N/cm²', '10 N/cm²', '0.1 N/cm²', '0.001 N/cm²'], ans: 0,
      hint: 'Pressure = force ÷ area: 10 ÷ 0.01. Dividing by a tiny number gives a big answer!',
      why: '10 N ÷ 0.01 cm² = 1000 N/cm². On the 1 cm² head it\'s only 10 N/cm², so the point goes in but your thumb doesn\'t hurt.' }
  ];

  var PX = 200, PY = 70, U = 34;
  function f(v) { return (+v).toFixed(1); }
  function mom(list) { return list.reduce(function (s, p) { return s + p[0] * p[1]; }, 0); }
  function sum(list) { return list.map(function (p) { return p[1] + ' N × ' + p[0] + ' m'; }).join(' + '); }

  Arcade.game({
    intro: 'Welcome to the giant seesaw! Hang weights on the hooks to balance it, then squash some snow with pressure.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], w = R.w || 0, d = R.d || 0, ang = R.show ? 10 : 0, held = !R.show, busy = false;
      var ctrl = '';
      if (R.free) {
        ctrl = '<div class="sb-ctrl">' +
          (R.free !== 'd' ? '<span class="sb-lbl">Weight</span><button class="btn ghost" type="button" data-w="-10" aria-label="Lighter by 10 N">−10 N</button><b class="sb-val" data-wv></b><button class="btn ghost" type="button" data-w="10" aria-label="Heavier by 10 N">+10 N</button>' : '') +
          (R.free !== 'w' ? '<span class="sb-lbl">Hook</span><button class="btn ghost" type="button" data-h="-1" aria-label="Move nearer the pivot">◀ in</button><b class="sb-val" data-hv></b><button class="btn ghost" type="button" data-h="1" aria-label="Move further from the pivot">out ▶</button>' : '') +
          '</div><p class="actions sb-act"><button class="btn" type="button" data-go>Let go ✋</button></p>';
      }
      stage.innerHTML = '<p class="q-num">Challenge ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="sb-svg" viewBox="0 0 400 ' + (R.press ? 200 : 220) + '" role="img"></svg><p class="sb-out" aria-live="polite"></p>' + ctrl +
        (R.opts ? '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.sb-out');
      ui.owl(R.press ? 'Pressure = force ÷ area. Same force on a smaller area means more pressure.' :
        R.q ? 'Moment = force × distance from the pivot.' : R.free === 'both' ? 'Change the weight and the hook. Moment = force × distance.' :
        'Left side turns it anticlockwise ↺, right side turns it clockwise ↻.');

      function hook(n, a) { var t = a * Math.PI / 180; return [PX + n * U * Math.cos(t), PY + n * U * Math.sin(t)]; }
      function block(n, N, a, mine) {
        var p = hook(n, a), bh = 16 + N * 0.5, top = p[1] + 18;
        return '<line x1="' + f(p[0]) + '" y1="' + f(p[1] + 4) + '" x2="' + f(p[0]) + '" y2="' + f(top) + '" class="sb-str"/>' +
          '<rect x="' + f(p[0] - 17) + '" y="' + f(top) + '" width="34" height="' + f(bh) + '" rx="5" class="sb-blk' + (mine ? ' mine' : '') + '"/>' +
          '<text x="' + f(p[0]) + '" y="' + f(top + bh / 2 + 4) + '" text-anchor="middle" class="sb-bt">' + N + ' N</text>';
      }

      function seesaw() {
        var s = '<rect x="0" y="200" width="400" height="20" class="sb-grass"/><path d="M' + PX + ' ' + (PY + 4) + ' L' + (PX - 26) + ' 200 H' + (PX + 26) + ' Z" class="sb-piv"/>';
        s += '<text x="' + PX + '" y="190" text-anchor="middle" class="sb-pl">pivot</text>';
        s += '<g transform="rotate(' + f(ang) + ' ' + PX + ' ' + PY + ')"><rect x="' + (PX - 186) + '" y="' + (PY - 5) + '" width="372" height="10" rx="5" class="sb-beam"/>';
        for (var n = 1; n <= 5; n++) [-n, n].forEach(function (m) {
          s += '<circle cx="' + (PX + m * U) + '" cy="' + PY + '" r="3.5" class="sb-hk"/><text x="' + (PX + m * U) + '" y="' + (PY - 11) + '" text-anchor="middle" class="sb-hn">' + n + '</text>';
        });
        s += '</g><circle cx="' + PX + '" cy="' + PY + '" r="6" class="sb-pin"/>';
        (R.left || []).forEach(function (p) { s += block(-p[0], p[1], ang); });
        if (R.show) s += block(R.show[0], R.show[1], ang, true);
        else if (R.free) s += block(d, w, ang, true);
        if (R.free && R.free !== 'w' && held) for (var k = 1; k <= 5; k++) {
          s += '<rect x="' + (PX + k * U - 17) + '" y="' + (PY - 26) + '" width="34" height="120" class="sb-tap' + (k === d ? ' on' : '') + '" data-k="' + k + '" role="button" tabindex="0" aria-label="Hook ' + k + ' m on the right"/>';
        }
        if (held && R.free) s += '<text x="' + PX + '" y="' + (PY + 46) + '" text-anchor="middle" class="sb-held">🔒</text>';
        s += '<text x="8" y="192" class="sb-dir">↺ anticlockwise</text><text x="392" y="192" text-anchor="end" class="sb-dir">clockwise ↻</text>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Seesaw. Left: ' + ((R.left || []).map(function (p) { return p[1] + ' newtons at ' + p[0] + ' metres'; }).join(' and ') || 'nothing') +
          '. Right: ' + (R.show ? R.show[1] + ' newtons at ' + R.show[0] + ' metres' : w + ' newtons at ' + d + ' metres') + '. ' +
          (held ? 'Held level.' : ang > 0 ? 'Tipped down on the right.' : ang < 0 ? 'Tipped down on the left.' : 'Balanced.'));
        var wv = stage.querySelector('[data-wv]'), hv = stage.querySelector('[data-hv]');
        if (wv) wv.textContent = w + ' N'; if (hv) hv.textContent = d + ' m';
      }

      function pressure() {
        var s = '';
        if (R.press === 'snow') {
          s += '<rect x="0" y="120" width="400" height="80" class="sb-snow"/>';
          [[100, 'boots 🥾', '400 cm²', 34, 24], [300, 'snowshoes', '2000 cm²', 6, 96]].forEach(function (c) {
            var x = c[0], sink = c[3], hw = c[4] / 2;
            s += '<rect x="' + (x - hw - 6) + '" y="120" width="' + (c[4] + 12) + '" height="' + (sink + 4) + '" class="sb-hole"/>' +
              '<rect x="' + (x - hw) + '" y="' + (114 + sink) + '" width="' + c[4] + '" height="8" rx="4" class="sb-shoe"/>' +
              '<text x="' + x + '" y="' + (108 + sink) + '" text-anchor="middle" class="sb-kid">🧍</text>' +
              '<path d="M' + (x + 36) + ' 30 V' + (84 + sink) + '" class="sb-arr"/><path d="M' + (x + 30) + ' ' + (80 + sink) + ' l6 10 l6 -10 Z" class="sb-arrh"/>' +
              '<text x="' + (x + 44) + ' " y="44" class="sb-pt">400 N</text>' +
              '<text x="' + x + '" y="178" text-anchor="middle" class="sb-pt">' + c[1] + '</text><text x="' + x + '" y="194" text-anchor="middle" class="sb-ps">area ' + c[2] + '</text>';
          });
          svg.setAttribute('aria-label', 'Sam weighs 400 newtons. In boots, touching 400 square centimetres, he sinks deep into the snow. On snowshoes, touching 2000 square centimetres, he hardly sinks.');
        } else {
          s += '<rect x="276" y="20" width="44" height="160" rx="4" class="sb-board"/>' +
            '<text x="138" y="110" text-anchor="middle" class="sb-thumb">👍</text>' +
            '<rect x="170" y="70" width="14" height="70" rx="4" class="sb-head"/><path d="M184 100 H262 L276 105 L262 110 H184 Z" class="sb-shaft"/>' +
            '<path d="M60 105 H118" class="sb-arr"/><path d="M114 99 l10 6 l-10 6 Z" class="sb-arrh"/><text x="60" y="94" class="sb-pt">10 N</text>' +
            '<text x="177" y="160" text-anchor="middle" class="sb-ps">head: 1 cm²</text><text x="234" y="68" text-anchor="middle" class="sb-ps">point: 0.01 cm²</text>' +
            '<path d="M272 104 L262 76" class="sb-lead"/><text x="298" y="196" text-anchor="middle" class="sb-pt">cork board</text>';
          svg.setAttribute('aria-label', 'A thumb pushes a drawing pin with 10 newtons. The flat head has an area of 1 square centimetre and the point has an area of 0.01 square centimetres.');
        }
        svg.innerHTML = s;
      }

      function tip(cb) {
        var target = Math.max(-10, Math.min(10, (w * d - mom(R.left)) * 10)), a0 = ang;
        held = false;
        if (still) { ang = target; seesaw(); cb(); return; }
        busy = true; var t0 = performance.now();
        (function go(t) {
          var p = Math.min(1, (t - t0) / 700), e = 1 - Math.pow(1 - p, 3);
          ang = a0 + (target - a0) * e; seesaw();
          if (p < 1) requestAnimationFrame(go); else { busy = false; cb(); }
        })(t0);
      }
      function locked() { return stage.classList.contains('locked'); }
      function change() { if (busy || locked()) return false; held = true; ang = 0; out.textContent = ''; return true; }

      if (R.free) {
        stage.querySelectorAll('[data-w]').forEach(function (b) { b.addEventListener('click', function () { if (change()) { w = Math.max(10, Math.min(60, w + +b.getAttribute('data-w'))); seesaw(); } }); });
        stage.querySelectorAll('[data-h]').forEach(function (b) { b.addEventListener('click', function () { if (change()) { d = Math.max(1, Math.min(5, d + +b.getAttribute('data-h'))); seesaw(); } }); });
        svg.addEventListener('click', function (ev) { var r = ev.target.closest('.sb-tap'); if (r && change()) { d = +r.getAttribute('data-k'); seesaw(); } });
        svg.addEventListener('keydown', function (ev) { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest('.sb-tap')) { ev.preventDefault(); ev.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (busy || locked()) return;
          tip(function () {
            var L = mom(R.left), C = w * d, ok = L === C;
            out.innerHTML = '↺ ' + sum(R.left) + ' = <b>' + L + ' N m</b><br>↻ ' + w + ' N × ' + d + ' m = <b>' + C + ' N m</b><br>' +
              (ok ? 'Balanced! ⚖️' : C > L ? 'The right side goes down.' : 'The left side goes down.');
            ui.check(ok, { hint: R.hint + (C > L ? ' (Your side went down: your moment is too big.)' : ' (The left went down: your moment is too small.)'), why: R.why,
              reveal: function () {
                if (R.free === 'both') { if (L % w || L / w > 5) { w = 20; d = 5; } else d = L / w; } else if (R.free === 'd') d = L / w; else w = L / d;
                held = true; ang = 0; tip(function () { out.innerHTML = '↺ ' + L + ' N m = ↻ ' + w + ' N × ' + d + ' m = <b>' + w * d + ' N m</b>. Balanced! ⚖️'; });
              } });
          });
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
          });
          box.appendChild(b);
        });
      }
      if (R.press) pressure(); else seesaw();
    }
  });
})();
