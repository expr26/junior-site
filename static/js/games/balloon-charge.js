/* Balloon Charge: static electricity by friction.
   Model: every object starts neutral (the same number of + and − charges). Rubbing a balloon on a wool jumper moves
   electrons (−) from the jumper to the balloon: in this game each rub moves ONE electron (really it is millions).
   So the balloon becomes negative (−n) and the jumper positive (+n) by the same amount. Positive charges (protons)
   never move in solids: only electrons do. Like charges repel, unlike charges attract.
   A charged balloon near a neutral wall or bits of paper pushes their electrons slightly away, so the near side
   becomes slightly positive and is attracted (charging by induction, kept simple). Lightning is a giant spark.
   Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';
  var M = '−';

  var ROUNDS = [
    { view: 'rub', start: 0, needRub: true, q: 'Press <b>Rub</b> a few times to rub the balloon 🎈 on the jumper. Which way did the electrons (−) move?',
      opts: ['From the jumper to the balloon', 'From the balloon to the jumper', 'Nowhere: rubbing made brand-new charges'], ans: 0,
      hint: 'Count the − charges on the balloon before and after you rub. Rubbing never makes new charges: it only moves them.',
      why: 'Electrons moved from the jumper onto the balloon. The charges were already there: rubbing just moved some of them.' },
    { view: 'rub', start: 0, target: 4, task: 'Charge the balloon to exactly <b>' + M + '4</b> (4 more electrons than + charges), then press <b>Done</b>.',
      why: 'Four rubs moved four electrons. The balloon gained 4 (' + M + '4) and the jumper lost 4, so the jumper is now +4.' },
    { view: 'rub', start: 5, tap: 'jumper', task: 'The balloon has been rubbed. <b>Tap</b> the object that is now <b>positively</b> charged.',
      hint: 'Positive means fewer electrons than + charges. The + charges never moved. Which object <b>lost</b> electrons?',
      why: 'The jumper lost 5 electrons, so it has 5 more + charges than − charges: it is positive (+5).' },
    { view: 'two', q: 'Both balloons were rubbed on the jumper, so both have extra electrons. You hold them close and let go. What happens?',
      opts: ['They push apart', 'They pull together', 'Nothing at all'], ans: 0,
      hint: 'Both balloons have the same kind of charge. Do like charges attract or repel?',
      why: 'Both balloons are negative. Like charges repel, so they push each other apart.' },
    { view: 'wall', task: 'Make the balloon <b>stick to the wall</b>: rub it, move it right up to the wall, then press <b>Let go</b>.',
      why: 'The negative balloon pushes the wall\'s electrons a little way back, so the wall\'s surface is slightly positive. Unlike charges attract, so the balloon sticks!' },
    { view: 'paper', tap: 'b', task: 'Which balloon will pick up the tiny bits of paper? Look at the charges and <b>tap</b> it.',
      hint: 'Count the + and − charges on each balloon. A balloon with equal numbers is neutral and has no pull.',
      why: 'Balloon B has extra electrons, so it is charged. It attracts the paper, just like the wall. Balloons A and C are neutral.' },
    { view: 'storm', q: 'Charges build up in a storm cloud: the bottom of the cloud becomes negative. What is lightning?',
      opts: ['A giant spark: charge jumping between the cloud and the ground', 'Sunlight bouncing off the cloud', 'Magnets inside the cloud'], ans: 0,
      hint: 'Think of the tiny crackle you can get from a jumper you take off. Lightning is the same thing, but huge.',
      why: 'Lightning is a giant spark. When enough charge builds up, it jumps through the air between the cloud and the ground (or another cloud).' },
    { view: 'rub', start: 4, noCtrl: true, q: 'When you rub a balloon on a jumper, which charges move from one to the other?',
      opts: ['Only electrons (−)', 'Only positive charges (+)', 'Both + and − charges'], ans: 0,
      hint: 'Look at the picture: did any of the + charges ever move in this game?',
      why: 'Only electrons move. The positive charges are protons, held tightly in the centre of each atom, so in solids they stay put.' }
  ];

  function f(v) { return v.toFixed(1); }
  function q(x, y, s, r) { r = r || 9; return '<g class="bc-q ' + (s > 0 ? 'p' : 'n') + '"><circle cx="' + f(x) + '" cy="' + f(y) + '" r="' + r + '"/><text x="' + f(x) + '" y="' + f(y + r * 0.5) + '" text-anchor="middle" style="font-size:' + (r * 1.75).toFixed(0) + 'px">' + (s > 0 ? '+' : M) + '</text></g>'; }

  /* A balloon centred at (0,0), rx 60, ry 74, with 4 neutral pairs and `extra` extra electrons (0 to 8). */
  var PAIRS = [[-32, -16], [14, -16], [-32, 18], [14, 18]];
  var EXTRA = [[-46, 1], [-22, -48], [-22, 50], [0, -48], [0, 50], [22, -48], [22, 50], [46, 1]];
  function balloon(extra, col, str) {
    var s = '<path d="M0 74 l-7 10 h14 Z" class="bc-knot ' + (col || '') + '"/>' + (str ? '<path d="M0 84 q-10 ' + (str / 2) + ' 0 ' + str + '" class="bc-str"/>' : '') +
      '<ellipse rx="60" ry="74" class="bc-bal ' + (col || '') + '"/><ellipse cx="-42" cy="-40" rx="6" ry="12" class="bc-shine"/>';
    PAIRS.forEach(function (p) { s += q(p[0], p[1], 1) + q(p[0] + 18, p[1], -1); });
    for (var k = 0; k < extra; k++) s += q(EXTRA[k][0], EXTRA[k][1], -1);
    return s;
  }
  function sgn(n) { return n > 0 ? '+' + n : n < 0 ? M + (-n) : '0'; }

  Arcade.game({
    intro: 'Get ready to rub some balloons! Watch the tiny + and − charges, and find out why balloons stick to walls.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], n = R.start || 0, pos = 0, held = true, fell = false, stuck = false, wrongTap = null, rightTap = null, apart = false;
      var ctrl = '';
      if (R.view === 'rub' && !R.tap && !R.noCtrl) ctrl = '<button class="btn" type="button" data-rub>Rub 🧶</button>' + (R.target ? '<button class="btn ghost" type="button" data-reset>Start again</button><button class="btn ghost" type="button" data-done>Done ✓</button>' : '');
      if (R.view === 'wall') ctrl = '<button class="btn" type="button" data-rub>Rub 🧶</button><button class="btn ghost" type="button" data-mv="1">◀ Closer</button><button class="btn ghost" type="button" data-mv="-1">Away ▶</button><button class="btn" type="button" data-go>Let go ✋</button>';
      stage.innerHTML = '<p class="q-num">Charge test ' + (i + 1) + '</p><p class="q-text">' + (R.task || R.q) + '</p>' +
        '<svg class="bc-svg" viewBox="0 0 400 260" role="img"></svg><p class="bc-out" aria-live="polite"></p>' +
        (ctrl ? '<div class="bc-act' + (R.view === 'wall' ? ' four' : '') + '">' + ctrl + '</div>' : '') + (R.q ? '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.bc-out');
      ui.owl(R.view === 'rub' ? (R.tap ? 'The + charges never move. Only the − electrons can hop across.' : 'Every object starts neutral: the same number of + and − charges.') :
        R.view === 'two' ? 'Like charges repel. Unlike charges attract.' : R.view === 'wall' ? 'A balloon with no charge just falls to the floor.' :
        R.view === 'paper' ? 'Neutral means equal numbers of + and −.' : 'A spark is charge jumping across a gap.');

      function locked() { return stage.classList.contains('locked'); }

      function rubView(anim) {
        var s = '<rect x="0" y="236" width="400" height="24" class="bc-floor"/>';
        var cls = 'bc-tapg' + (R.tap ? ' tap' : '');
        s += '<g class="' + cls + (wrongTap === 'jumper' ? ' wrong' : '') + (rightTap === 'jumper' ? ' right' : '') + '" data-k="jumper"' + (R.tap ? ' role="button" tabindex="0" aria-label="Jumper"' : '') + '>' +
          '<path d="M44 58 L82 38 Q102 54 122 38 L160 58 L190 124 L162 136 L162 236 L42 236 L42 136 L14 124 Z" class="bc-jump"/>' +
          '<path d="M82 38 Q102 64 122 38" class="bc-neck"/>';
        var rows = [86, 122, 158, 194], cols = [[60, 80], [112, 132]], lost = 0, lose = n;
        for (var c = 1; c >= 0; c--) rows.forEach(function (y) {
          s += q(cols[c][0], y, 1);
          if (lost < lose) { lost++; s += '<circle cx="' + cols[c][1] + '" cy="' + y + '" r="8" class="bc-gap"/>'; } else s += q(cols[c][1], y, -1);
        });
        s += '<text x="102" y="226" text-anchor="middle" class="bc-lab">Jumper ' + sgn(n) + '</text></g>';
        s += '<g class="' + cls + (wrongTap === 'balloon' ? ' wrong' : '') + (rightTap === 'balloon' ? ' right' : '') + '" data-k="balloon"' + (R.tap ? ' role="button" tabindex="0" aria-label="Balloon"' : '') + '>' +
          '<g transform="translate(296 112)"><g class="bc-mover' + (anim ? ' rub' : '') + '">' + balloon(n, '', 40) + '</g></g>' +
          '<text x="296" y="254" text-anchor="middle" class="bc-lab">Balloon ' + sgn(-n) + '</text></g>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'A wool jumper on the left and a balloon on the right. Jumper charge ' + sgn(n) + ', balloon charge ' + sgn(-n) + '.');
        out.innerHTML = '🧶 Jumper: <b>' + sgn(n) + '</b> · 🎈 Balloon: <b>' + sgn(-n) + '</b>' + (n ? '' : ' (both neutral)');
      }

      function twoView() {
        var th = apart ? 32 : 19, s = '<rect x="150" y="4" width="100" height="10" rx="5" class="bc-bar"/>';
        [['A', 1, 'pk'], ['B', -1, 'bl']].forEach(function (b) {
          s += '<g class="bc-swing" style="transform:rotate(' + (b[1] * th) + 'deg)"><path d="M200 12 V105" class="bc-str"/>' +
            '<g transform="translate(200 172) scale(.8)"><g transform="rotate(180)"><path d="M0 74 l-7 10 h14 Z" class="bc-knot ' + b[2] + '"/><ellipse rx="60" ry="74" class="bc-bal ' + b[2] + '"/></g><ellipse cx="-42" cy="-40" rx="6" ry="12" class="bc-shine"/>';
          PAIRS.forEach(function (p) { s += q(p[0], p[1], 1) + q(p[0] + 18, p[1], -1); });
          [0, 1, 4, 7].forEach(function (k) { s += q(EXTRA[k][0], EXTRA[k][1], -1); });
          s += '</g></g>';
        });
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Two negatively charged balloons hanging on strings from the same point' + (apart ? ', pushed apart.' : ', held close together.'));
        out.innerHTML = apart ? 'Both ' + M + '4: <b>like charges repel</b> ↔' : 'Both balloons: <b>' + M + '4</b>';
      }
      function setApart() { apart = true; var g = svg.querySelectorAll('.bc-swing'); if (!g.length) return; g[0].style.transform = 'rotate(32deg)'; g[1].style.transform = 'rotate(-32deg)'; out.innerHTML = 'Both ' + M + '4: <b>like charges repel</b> ↔'; svg.setAttribute('aria-label', 'Two negatively charged balloons pushed apart.'); }

      var WX = [320, 240, 160, 106];
      function wallView() {
        var s = '<rect x="0" y="0" width="58" height="250" class="bc-wall"/>';
        for (var r = 0; r < 10; r++) s += '<path d="M0 ' + (r * 25) + ' H58 M' + (r % 2 ? 29 : 14) + ' ' + (r * 25) + ' V' + (r * 25 + 25) + (r % 2 ? '' : ' M44 ' + (r * 25) + ' V' + (r * 25 + 25)) + '" class="bc-brick"/>';
        s += '<rect x="0" y="248" width="400" height="12" class="bc-floor"/>';
        var pull = n > 0 && pos >= 2;
        [60, 100, 140, 180].forEach(function (y) { s += q(pull ? 44 : 22, y, 1, 8) + q(pull ? 18 : 40, y, -1, 8); });
        var cx = WX[pos], cy = fell ? 192 : 104, sc = 0.78;
        s += '<g transform="translate(' + cx + ' ' + cy + ') scale(' + sc + ')"><g>' + balloon(n, 'pk', fell ? 0 : 70) + '</g></g>';
        if (held && !fell) s += '<text x="' + cx + '" y="' + (cy + sc * 160 + 6) + '" text-anchor="middle" class="bc-hand">✊</text>';
        svg.innerHTML = s;
        var where = pos === 3 ? 'touching the wall' : pos === 0 ? 'far from the wall' : 'getting closer to the wall';
        svg.setAttribute('aria-label', 'A brick wall on the left and a balloon ' + where + '. Balloon charge ' + sgn(-n) + '.' + (stuck ? ' The balloon is stuck to the wall.' : fell ? ' The balloon fell to the floor.' : ''));
        out.innerHTML = '🎈 Balloon: <b>' + sgn(-n) + '</b> · ' + where + (stuck ? ' · <b>It sticks! 🎉</b>' : fell ? ' · it fell 😮' : '');
      }

      var PB = [{ k: 'a', x: 70, e: 0, c: 'pk' }, { k: 'b', x: 200, e: 5, c: 'bl' }, { k: 'c', x: 330, e: 0, c: 'gr' }];
      function paperView() {
        var s = '<rect x="0" y="232" width="400" height="28" class="bc-table"/>';
        PB.forEach(function (b, j) {
          var hit = rightTap === b.k && locked();
          s += '<g class="bc-tapg tap' + (wrongTap === b.k ? ' wrong' : '') + (rightTap === b.k ? ' right' : '') + '" data-k="' + b.k + '" role="button" tabindex="0" aria-label="Balloon ' + b.k.toUpperCase() + '">' +
            '<rect x="' + (b.x - 58) + '" y="6" width="116" height="224" rx="14" class="bc-hit"/>' +
            '<g transform="translate(' + b.x + ' 92) scale(.74)">' + balloon(b.e, b.c, 0) + '</g>' +
            '<text x="' + b.x + '" y="30" text-anchor="middle" class="bc-lab">' + b.k.toUpperCase() + '</text>';
          for (var p = 0; p < 5; p++) {
            var px = b.x - 26 + p * 13, py = hit ? 152 + (p % 2) * 6 : 224 - (p % 2) * 3;
            s += '<rect x="' + px + '" y="' + py + '" width="9" height="6" rx="1" class="bc-paper" transform="rotate(' + (p * 37 % 50 - 25) + ' ' + (px + 4) + ' ' + (py + 3) + ')"/>';
          }
          s += '</g>';
        });
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Three balloons above bits of paper. Balloon A has 4 plus and 4 minus charges. Balloon B has 4 plus and 9 minus charges. Balloon C has 4 plus and 4 minus charges.');
        out.innerHTML = rightTap && locked() ? 'Balloon B (' + M + '5) lifts the paper! 📄⬆️' : 'Count the + and − charges on each balloon 🔍';
      }

      var bolt = false;
      function stormView() {
        var s = '<rect width="400" height="260" class="bc-sky"/>';
        s += '<path d="M70 92 q-34 -6 -26 -36 q8 -26 40 -18 q12 -32 52 -26 q30 -22 64 0 q36 -12 56 18 q40 -6 46 26 q8 34 -30 36 Z" class="bc-cloud"/>';
        for (var x = 92; x <= 312; x += 30) s += q(x, 82, -1, 9);
        s += '<rect x="0" y="218" width="400" height="42" class="bc-grass"/>';
        for (var x2 = 60; x2 <= 340; x2 += 40) s += q(x2, 240, 1, 9);
        s += '<text x="324" y="216" text-anchor="middle" class="bc-tree">🌳</text><text x="84" y="214" text-anchor="middle" class="bc-tree">🏠</text>';
        if (bolt) s += '<path d="M206 98 L186 140 L210 144 L188 186 L214 190 L198 220" class="bc-bolt"/>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'A storm cloud with negative charges along its bottom, above the ground with positive charges.' + (bolt ? ' A lightning bolt joins them.' : ''));
        out.innerHTML = bolt ? '⚡ <b>Crack!</b> A giant spark' : '☁️ Cloud bottom: <b>' + M + '</b> · Ground: <b>+</b>';
      }

      function draw(anim) {
        if (R.view === 'rub') rubView(anim); else if (R.view === 'two') twoView(); else if (R.view === 'wall') wallView(); else if (R.view === 'paper') paperView(); else stormView();
      }
      function after() {
        if (!locked()) return;
        if (R.view === 'two') setApart();
        if (R.view === 'storm') { bolt = true; draw(); }
      }

      stage.querySelectorAll('[data-rub]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (locked()) return;
          if (n >= 8) { out.innerHTML = 'That\'s plenty of charge! 🎈 Balloon: <b>' + sgn(-n) + '</b>'; return; }
          if (R.view === 'wall') { if (fell) { fell = false; held = true; } pos = 0; }
          n++; draw(!still);
          var tp = stage.querySelector('.bc-tip'); if (tp) tp.remove();
          var o = stage.querySelector('.q-options'); if (o) o.querySelectorAll('.opt').forEach(function (x) { if (!x.classList.contains('wrong')) x.disabled = false; });
        });
      });
      var rs = stage.querySelector('[data-reset]');
      if (rs) rs.addEventListener('click', function () { if (!locked()) { n = 0; draw(); } });
      var dn = stage.querySelector('[data-done]');
      if (dn) dn.addEventListener('click', function () {
        if (locked()) return;
        ui.check(n === R.target, {
          hint: n === 0 ? 'Press <b>Rub</b> first: each rub moves one electron onto the balloon.' : n > R.target ? 'Too many! Each rub moves one more electron. Press <b>Start again</b> and rub exactly ' + R.target + ' times.' : 'Not enough yet. Each rub adds one electron to the balloon. Count them!',
          why: R.why, reveal: function () { n = R.target; draw(); }
        });
      });
      stage.querySelectorAll('[data-mv]').forEach(function (b) {
        b.addEventListener('click', function () { if (locked()) return; if (fell) { fell = false; held = true; } pos = Math.max(0, Math.min(3, pos + +b.getAttribute('data-mv'))); draw(); });
      });
      var go = stage.querySelector('[data-go]');
      if (go) go.addEventListener('click', function () {
        if (locked() || fell) return;
        var ok = n > 0 && pos === 3;
        held = false; if (ok) stuck = true; else fell = true; draw();
        ui.check(ok, {
          hint: n === 0 ? 'The balloon has no charge, so nothing pulls it to the wall. <b>Rub</b> it on the jumper first.' : 'The pull only works when the charged balloon <b>touches</b> the wall. Press <b>Closer</b> until it is right up against it.',
          why: R.why, reveal: function () { if (!n) n = 3; pos = 3; fell = false; stuck = true; draw(); }
        });
      });

      if (R.tap) {
        svg.addEventListener('click', function (ev) {
          var g = ev.target.closest('.bc-tapg.tap'); if (!g || locked()) return;
          var k = g.getAttribute('data-k'), ok = k === R.tap;
          wrongTap = ok ? null : k; rightTap = ok ? k : null;
          ui.check(ok, { hint: R.hint, why: R.why, reveal: function () { wrongTap = null; rightTap = R.tap; } });
          draw();
        });
        svg.addEventListener('keydown', function (ev) { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest('.bc-tapg.tap')) { ev.preventDefault(); ev.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
      }
      if (R.q) {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button'; if (R.needRub) b.disabled = true;
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            after();
          });
          box.appendChild(b);
        });
        if (R.needRub) box.insertAdjacentHTML('beforebegin', '<p class="bc-tip small">Rub at least once to unlock the answers.</p>');
      }
      draw();
    }
  });
})();
