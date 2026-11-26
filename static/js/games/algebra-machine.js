/* Algebra Machine: a function machine. A number goes in, the boxes work in order from left to right, and a number comes out.
   Rules used (all worked out by hand):
     R1  4 → × 3 → + 2:            4 × 3 = 12, 12 + 2 = 14            (trap: + 2 first gives 18)
     R2  5 → + 1 → × 2:            5 + 1 = 6, 6 × 2 = 12              (trap: × 2 first gives 11)
     R3  3a means 3 × a. a = 6:    3 × 6 = 18                          (traps: 36, 9)
     R4  3a + 2 with a = 5:        3 × 5 + 2 = 17                      (trap: 35 + 2 = 37)
     R5  2(x + 1) with x = 6:      2 × (6 + 1) = 14                    (trap: 2 × 6 + 1 = 13)
     R6  2x + 3 + x + 4:           x terms 2x + x = 3x, numbers 3 + 4 = 7, so 3x + 7
     R7  x → + 3 → × 5:            5(x + 3)   (5x + 3 would multiply first)
     R8  5x + 6 − 2x − 1:          5x − 2x = 3x, 6 − 1 = 5, so 3x + 5  (a −x tile and an x tile make zero)
   Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var ROUNDS = [
    { kind: 'run', inp: '4', ops: ['× 3', '+ 2'], steps: ['4 × 3 = 12', '12 + 2 = 14'], mid: 12, ans: 14,
      text: 'The number <b>4</b> goes into the machine. What number comes out? Set your answer and run the machine!',
      hint: 'Work through one box at a time: first 4 × 3, then add 2.', trap: { v: 18, hint: 'The machine works in order, from left to right. Do × 3 first, and only then + 2.' },
      why: '4 × 3 = 12, then 12 + 2 = 14.' },
    { kind: 'run', inp: '5', ops: ['+ 1', '× 2'], steps: ['5 + 1 = 6', '6 × 2 = 12'], mid: 6, ans: 12,
      text: 'New machine! <b>5</b> goes in. What comes out?',
      hint: 'Look at the order of the boxes. This machine adds first.', trap: { v: 11, hint: 'This machine adds 1 <b>first</b>: 5 + 1 = 6. Then it doubles that.' },
      why: '5 + 1 = 6, then 6 × 2 = 12. The order of the boxes matters!' },
    { kind: 'mc', inp: 'a = 6', expr: '3a', text: 'In algebra, <b>3a</b> means 3 × a. If <b>a = 6</b>, what is 3a?', opts: ['18', '36', '9'], ans: 0,
      hint: '3a is not the digits 3 and 6 side by side, and it is not 3 + a. It means 3 lots of a.', why: '3a = 3 × a = 3 × 6 = 18.' },
    { kind: 'run', inp: 'a = 5', expr: '3a + 2', steps: ['3 × 5 = 15', '15 + 2 = 17'], ans: 17,
      text: 'Substitute <b>a = 5</b> into <b>3a + 2</b>. What comes out?',
      hint: 'Replace a with 5. Remember 3a means 3 × a, so do 3 × 5 first, then add 2.', trap: { v: 37, hint: '3a means 3 × a, not 3 and 5 written side by side. So 3a = 3 × 5 = 15. Now add 2.' },
      why: '3a + 2 = 3 × 5 + 2 = 15 + 2 = 17.' },
    { kind: 'run', inp: 'x = 6', expr: '2(x + 1)', steps: ['6 + 1 = 7', '2 × 7 = 14'], ans: 14,
      text: 'Substitute <b>x = 6</b> into <b>2(x + 1)</b>. What comes out?',
      hint: 'Brackets first! Work out x + 1, then multiply the answer by 2.', trap: { v: 13, hint: 'Brackets first! x + 1 = 6 + 1 = 7. The 2 outside multiplies everything inside the bracket.' },
      why: '2(x + 1) = 2 × (6 + 1) = 2 × 7 = 14.' },
    { kind: 'tiles', tiles: ['x', 'x', '1', '1', '1', 'x', '1', '1', '1', '1'], expr: '2x + 3 + x + 4', a: 3, b: 7,
      text: 'Simplify <b>2x + 3 + x + 4</b>. Tap each tile to put it in its group, then set your answer and press Check.',
      hint: 'Count the tall x tiles and the small 1 tiles separately. A single x on its own counts as 1x.', why: '2x + x = 3x and 3 + 4 = 7, so 2x + 3 + x + 4 = 3x + 7. We can\'t add x tiles and 1 tiles together: they are not like terms.' },
    { kind: 'mc', inp: 'x', ops: ['+ 3', '× 5'], text: '<b>x</b> goes into this machine. Which expression shows what comes out?', opts: ['5(x + 3)', '5x + 3', 'x + 15'], ans: 0,
      hint: 'The machine adds 3 <b>first</b>. Which expression keeps x + 3 together before multiplying by 5?', why: 'First x + 3, then all of that is multiplied by 5: 5(x + 3). The bracket shows what to do first.' },
    { kind: 'tiles', tiles: ['x', '1', 'x', '-x', '1', '1', 'x', '-1', '1', 'x', '-x', '1', 'x', '1'], expr: '5x + 6 − 2x − 1', a: 3, b: 5,
      text: 'Red tiles are <b>negative</b>. Simplify <b>5x + 6 − 2x − 1</b>: group the tiles, then set your answer.',
      hint: 'A red −x tile and an x tile cancel out to make zero. Do the same with −1 and 1. What is left?', why: '5x − 2x = 3x and 6 − 1 = 5, so 5x + 6 − 2x − 1 = 3x + 5.' }
  ];

  function v(t) { return String(t).replace(/[a-z]/g, '<tspan class="am-var">$&</tspan>'); }
  function machine(R, out, mid) {
    var s = '<defs><marker id="am-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" class="am-head"/></marker></defs>';
    s += '<rect x="4" y="58" width="74" height="54" rx="27" class="am-in"/><text x="41" y="93" text-anchor="middle" class="am-t' + (R.inp.length > 2 ? ' sm' : '') + '">' + v(R.inp) + '</text>';
    s += '<text x="41" y="48" text-anchor="middle" class="am-cap">IN</text><text x="356" y="48" text-anchor="middle" class="am-cap">OUT</text>';
    var arr = function (x1, x2) { return '<line x1="' + x1 + '" y1="85" x2="' + x2 + '" y2="85" class="am-arr" marker-end="url(#am-ah)"/>'; };
    if (R.ops) {
      s += arr(80, 102) + '<rect x="104" y="50" width="78" height="70" rx="14" class="am-box b1"/><text x="143" y="95" text-anchor="middle" class="am-t w">' + R.ops[0] + '</text>';
      s += arr(184, 210) + '<rect x="212" y="50" width="78" height="70" rx="14" class="am-box b2"/><text x="251" y="95" text-anchor="middle" class="am-t w">' + R.ops[1] + '</text>';
      s += '<text x="143" y="40" text-anchor="middle" class="am-gear">⚙️</text><text x="251" y="40" text-anchor="middle" class="am-gear g2">⚙️</text>';
      if (mid != null) s += '<rect x="174" y="128" width="46" height="30" rx="10" class="am-chip c1"/><text x="197" y="149" text-anchor="middle" class="am-ct">' + mid + '</text>';
    } else {
      s += arr(80, 102) + '<rect x="104" y="50" width="186" height="70" rx="14" class="am-box b3"/><text x="197" y="95" text-anchor="middle" class="am-t w big">' + v(R.expr) + '</text>';
      s += '<text x="150" y="40" text-anchor="middle" class="am-gear">⚙️</text><text x="244" y="40" text-anchor="middle" class="am-gear g2">⚙️</text>';
    }
    s += arr(292, 316) + '<rect x="318" y="58" width="76" height="54" rx="27" class="am-outb' + (out != null && out !== '?' ? ' done' : '') + '"/>' +
      '<text x="356" y="93" text-anchor="middle" class="am-t' + (out != null ? ' c2' + (String(out).length > 5 ? ' xs' : String(out).length > 2 ? ' sm' : '') : '') + '">' + (out == null ? '?' : v(out)) + '</text>';
    return s;
  }

  Arcade.game({
    intro: 'Beep boop! Feed numbers into the Algebra Machine, put numbers into expressions and tidy up algebra tiles.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], guess = 0, a = 0, b = 0;
      var locked = function () { return stage.classList.contains('locked'); };
      var body = '<p class="q-num">Machine ' + (i + 1) + '</p><p class="q-text">' + R.text + '</p>';
      if (R.kind !== 'tiles') body += '<svg class="am-svg" viewBox="0 0 400 165" role="img"></svg>';
      if (R.kind === 'run') body += '<div class="am-pick"><button class="btn ghost" type="button" data-d="-10">−10</button><button class="btn ghost" type="button" data-d="-1">−1</button>' +
        '<b class="am-num" aria-live="polite"></b><button class="btn ghost" type="button" data-d="1">+1</button><button class="btn ghost" type="button" data-d="10">+10</button></div>' +
        '<p class="am-out" aria-live="polite"></p><p class="actions am-act"><button class="btn" type="button" data-run>Run the machine ⚙️</button></p>';
      if (R.kind === 'mc') body += '<div class="q-options"></div>';
      if (R.kind === 'tiles') body += '<div class="am-tray" aria-label="Mixed-up tiles"></div><div class="am-groups"><div class="am-zone"><p>x tiles</p><div class="am-zx"></div></div>' +
        '<div class="am-zone"><p>number tiles</p><div class="am-z1"></div></div></div>' +
        '<div class="am-ans"><div class="am-row"><span class="am-lab"><i>x</i> part</span><button class="btn ghost" type="button" data-a="-1" aria-label="One fewer x">−</button><b class="am-v" data-va></b><button class="btn ghost" type="button" data-a="1" aria-label="One more x">+</button></div>' +
        '<div class="am-row"><span class="am-lab">number part</span><button class="btn ghost" type="button" data-b="-1" aria-label="One less">−</button><b class="am-v" data-vb></b><button class="btn ghost" type="button" data-b="1" aria-label="One more">+</button></div></div>' +
        '<p class="am-out" aria-live="polite"></p><p class="actions am-act"><button class="btn" type="button" data-chk>Check ✓</button></p>';
      stage.innerHTML = body;
      var svg = stage.querySelector('.am-svg'), out = stage.querySelector('.am-out');
      ui.owl(R.kind === 'tiles' ? 'Only like terms can be collected: x tiles with x tiles, number tiles with number tiles.' :
        R.expr && R.kind === 'run' ? 'Substitute means: swap the letter for its number.' : 'The machine always works from left to right.');
      function label(s) { svg.setAttribute('aria-label', s); }

      if (R.kind === 'run') {
        var desc = 'Function machine. In: ' + R.inp + '. ' + (R.ops ? 'Then ' + R.ops.join(', then ') : 'Expression ' + R.expr) + '. Out: ';
        var showNum = function () { stage.querySelector('.am-num').textContent = guess; };
        svg.innerHTML = machine(R); label(desc + 'unknown.'); showNum();
        stage.querySelectorAll('[data-d]').forEach(function (btn) { btn.addEventListener('click', function () {
          if (locked()) return; guess = Math.max(0, Math.min(99, guess + +btn.getAttribute('data-d'))); showNum(); }); });
        var win = function () {
          svg.innerHTML = machine(R, R.ans, R.mid); svg.classList.add('ran'); label(desc + R.ans + '.');
          out.innerHTML = R.steps.map(function (t) { return '<span>' + t + '</span>'; }).join(' → ') + ' ✅';
        };
        stage.querySelector('[data-run]').addEventListener('click', function () {
          if (locked()) return;
          var ok = guess === R.ans;
          if (ok) win(); else out.innerHTML = 'The machine says: <b>not ' + guess + '</b>. 🤔';
          ui.check(ok, { hint: R.trap && guess === R.trap.v ? R.trap.hint : R.hint, why: R.why, reveal: function () { guess = R.ans; showNum(); win(); } });
        });
      }

      if (R.kind === 'mc') {
        svg.innerHTML = machine(R); label('Function machine. In: ' + R.inp + '. ' + (R.ops ? 'Then ' + R.ops.join(', then ') : 'Expression ' + R.expr) + '. Out: unknown.');
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var btn = h('button', 'opt', o); btn.type = 'button';
          btn.addEventListener('click', function () {
            btn.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) btn.disabled = true;
            var fin = function () { svg.innerHTML = machine(R, R.opts[R.ans]); };
            if (k === R.ans) fin();
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); fin(); } });
          });
          box.appendChild(btn);
        });
      }

      if (R.kind === 'tiles') {
        var placed = R.tiles.map(function () { return false; });
        var tray = stage.querySelector('.am-tray'), zx = stage.querySelector('.am-zx'), z1 = stage.querySelector('.am-z1');
        var tileName = function (t) { return t === 'x' ? 'x' : t === '-x' ? '−x' : t === '1' ? '1' : '−1'; };
        var tileHtml = function (t) { return tileName(t).replace('x', '<i>x</i>'); };
        var drawTiles = function () {
          tray.innerHTML = ''; zx.innerHTML = ''; z1.innerHTML = '';
          var zero = { x: 0, '1': 0 }, pos = { x: 0, '1': 0 }, neg = { x: 0, '1': 0 };
          R.tiles.forEach(function (t, k) { if (placed[k]) { var g = t.replace('-', ''); if (t[0] === '-') neg[g]++; else pos[g]++; } });
          zero.x = Math.min(pos.x, neg.x); zero['1'] = Math.min(pos['1'], neg['1']);
          var usedP = { x: 0, '1': 0 }, usedN = { x: 0, '1': 0 };
          R.tiles.forEach(function (t, k) {
            var g = t.replace('-', ''), isNeg = t[0] === '-';
            var cls = 'am-tile ' + (g === 'x' ? 'tx' : 't1') + (isNeg ? ' neg' : '');
            if (placed[k]) {
              var u = isNeg ? usedN : usedP; if (u[g] < zero[g]) cls += ' zero'; u[g]++;
              var sp = h('span', cls, tileHtml(t)); sp.setAttribute('aria-hidden', 'true');
              (g === 'x' ? zx : z1).appendChild(sp);
            } else {
              var btn = h('button', cls, tileHtml(t)); btn.type = 'button'; btn.setAttribute('aria-label', 'Tile ' + tileName(t) + ': move to its group');
              btn.addEventListener('click', function () { if (locked()) return; placed[k] = true; drawTiles(); var nb = tray.querySelector('button'); if (nb) nb.focus({ preventScroll: true }); });
              tray.appendChild(btn);
            }
          });
          if (!tray.children.length) tray.innerHTML = '<p class="am-done">All grouped! ✨' + (zero.x || zero['1'] ? ' Faded pairs cancel out to zero.' : '') + '</p>';
          zx.setAttribute('aria-label', (pos.x + neg.x) + ' tiles in the x group'); z1.setAttribute('aria-label', (pos['1'] + neg['1']) + ' tiles in the number group');
        };
        var showAns = function () {
          stage.querySelector('[data-va]').innerHTML = a + '<i>x</i>';
          stage.querySelector('[data-vb]').textContent = b;
          out.innerHTML = 'Your answer: <b>' + (a === 0 ? '' : (a === 1 ? '<i>x</i>' : a + '<i>x</i>') + ' + ') + b + '</b>';
        };
        drawTiles(); showAns();
        stage.querySelectorAll('[data-a]').forEach(function (btn) { btn.addEventListener('click', function () { if (locked()) return; a = Math.max(0, Math.min(15, a + +btn.getAttribute('data-a'))); showAns(); }); });
        stage.querySelectorAll('[data-b]').forEach(function (btn) { btn.addEventListener('click', function () { if (locked()) return; b = Math.max(0, Math.min(15, b + +btn.getAttribute('data-b'))); showAns(); }); });
        stage.querySelector('[data-chk]').addEventListener('click', function () {
          if (locked()) return;
          var ok = a === R.a && b === R.b, hint = R.hint;
          if (!ok && a === R.a) hint = 'Your x part is right! Now count the number tiles again.' + (R.b === 5 ? ' Remember −1 cancels a 1.' : '');
          else if (!ok && b === R.b) hint = 'Your number part is right! Now count the x tiles again.' + (R.a === 3 && R.b === 7 ? ' The x on its own counts as 1x.' : ' Each −x cancels one x.');
          ui.check(ok, { hint: hint, why: R.why, reveal: function () { placed = placed.map(function () { return true; }); a = R.a; b = R.b; drawTiles(); showAns(); } });
          if (ok) { placed = placed.map(function () { return true; }); drawTiles(); out.innerHTML = R.expr.replace(/x/g, '<i>x</i>') + ' = <b>' + R.a + '<i>x</i> + ' + R.b + '</b> ✅'; }
        });
      }
    }
  });
})();
