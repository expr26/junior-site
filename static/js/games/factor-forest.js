/* Factor Forest: N trees are planted in equal rows. If the number of rows divides N exactly, the trees make a
   rectangle (an array): rows × trees-per-row = N, so the two numbers are a factor pair of N.
   A number with exactly two factors (1 and itself) is prime: its trees only make 1 × N. 1 is not prime.
   A square orchard (rows = trees per row) shows a square number, e.g. 16 = 4 × 4 = 4².
   Powers: 2³ = 2 × 2 × 2 = 8 (drawn as two 2 × 2 blocks).
   Answers checked by hand: 12 -> 1×12, 2×6, 3×4 (factors 1, 2, 3, 4, 6, 12); 7 is prime; 15 = 3 × 5 (rows 3 or 5);
   16 -> 4 rows of 4; 30 is the multiple of 6 (6 × 5); 23 is prime (21 = 3 × 7, 25 = 5 × 5, 27 = 3 × 9).
   Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var ROUNDS = [
    { n: 12, all: true, text: 'Plant <b>12</b> trees in equal rows. Try different numbers of rows to find <b>every rectangle</b> (factor pair), then press <b>Done</b>.',
      hint: 'Try every number of rows, from 1 row up to 12 rows. Rectangles like 3 × 4 and 4 × 3 are the same pair.',
      why: '12 makes 1 × 12, 2 × 6 and 3 × 4. Those are its three factor pairs.' },
    { q: 'So, what are <b>all the factors</b> of 12?', opts: ['1, 2, 3, 4, 6, 12', '2, 3, 4, 6', '12, 24, 36, 48', '1, 2, 3, 4, 5, 6'], ans: 0,
      hint: 'Use the numbers in your factor pairs: 1 × 12, 2 × 6, 3 × 4. Don\'t forget 1 and 12 themselves!',
      why: 'A factor divides into 12 exactly. From the pairs 1 × 12, 2 × 6 and 3 × 4 we get 1, 2, 3, 4, 6 and 12. (12, 24, 36… are multiples, not factors.)' },
    { n: 7, prime: true, text: 'Now plant <b>7</b> trees. Try the rows, then decide: is 7 a <b>prime number</b>?', opts: ['Prime: only 1 × 7 works', 'Not prime: another rectangle works'], ans: 0,
      hint: 'Try 2, 3, 4, 5 and 6 rows. Does any of them make a full rectangle with no spare trees?',
      why: '7 trees only make one rectangle: 1 × 7. Its only factors are 1 and 7, so 7 is prime.' },
    { n: 15, goal: function (r) { return r === 3 || r === 5; }, text: 'Plant <b>15</b> trees in a rectangle with <b>more than one row</b> and more than one tree in each row. Then press <b>Done</b>.',
      hint: '15 is odd, so 2 rows won\'t work. Numbers ending in 5 can be split into groups of 5…',
      why: '15 = 3 × 5, so 15 trees make 3 rows of 5 (or 5 rows of 3). That means 15 is not prime.' },
    { n: 16, goal: function (r) { return r === 4; }, square: true, text: 'Plant <b>16</b> trees in a <b>square</b> orchard: the same number of rows as trees in each row. Then press <b>Done</b>.',
      hint: 'A square has equal sides. Which number times itself makes 16? 2 × 8 is a rectangle, not a square.',
      why: '4 rows of 4 make a square: 4 × 4 = 16. That is why 16 is a square number: 16 = 4².' },
    { q: 'Every row in an orchard has <b>6</b> trees. Which of these could be the total number of trees? (It must be a <b>multiple</b> of 6.)', opts: ['3', '16', '30', '20'], ans: 2,
      hint: 'Multiples of 6 are in the 6 times table: 6, 12, 18, 24… 3 is a factor of 6, not a multiple.',
      why: '30 = 6 × 5, so 5 rows of 6 trees make 30. 30 is a multiple of 6.' },
    { count: 8, text: 'Plant <b>2³</b> trees. Use the buttons to choose how many, then press <b>Done</b>.',
      hint: '2³ does not mean 2 × 3. It means three 2s multiplied: 2 × 2 × 2.',
      why: '2³ = 2 × 2 × 2 = 8. Here it is as 2 blocks of 2 × 2 trees.' },
    { q: 'Last one! Which of these numbers is <b>prime</b>?', opts: ['21', '27', '23', '25'], ans: 2,
      hint: 'Try to make an orchard in your head. 21 = 3 × 7, so it is not prime. Check the others the same way.',
      why: '23 can only be made as 1 × 23, so it is prime. 21 = 3 × 7, 25 = 5 × 5 and 27 = 3 × 9.' }
  ];

  function pairs(n) { var p = []; for (var r = 1; r * r <= n; r++) if (n % r === 0) p.push(r + ' × ' + (n / r)); return p; }

  Arcade.game({
    intro: 'Welcome to Factor Forest! 🌳 Plant trees in neat rectangles to discover factors, primes and square numbers.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], rows = 1, n = R.count ? 1 : R.n, found = [], all = R.n ? pairs(R.n) : [], shown = false;
      var ctrl = R.q ? '<div class="q-options"></div>' :
        '<div class="ff-ctrl"><button class="btn ghost" type="button" data-d="-1">' + (R.count ? '− tree' : '− row') + '</button>' +
        '<b class="ff-val" aria-live="polite"></b><button class="btn ghost" type="button" data-d="1">' + (R.count ? '+ tree' : '+ row') + '</button></div>' +
        (R.prime ? '<div class="q-options ff-opts"></div>' : '<p class="actions ff-act"><button class="btn" type="button" data-done>Done ✓</button></p>');
      stage.innerHTML = '<p class="q-num">Clearing ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        (R.q ? '' : '<svg class="ff-svg" viewBox="0 0 400 230" role="img"></svg><p class="ff-out" aria-live="polite"></p>' +
          (R.all ? '<p class="ff-found" aria-live="polite"></p>' : '')) + ctrl;
      var svg = stage.querySelector('svg'), out = stage.querySelector('.ff-out'), fnd = stage.querySelector('.ff-found'), val = stage.querySelector('.ff-val');
      ui.owl(R.q ? 'Factors fit exactly into a number. Multiples are in its times table.' : R.count ? 'A power tells you how many of a number to multiply together.' :
        'If the trees fill every row with none spare, you have found a rectangle!');

      function tree(x, y, s, cls) { return '<text x="' + x.toFixed(1) + '" y="' + (y + s * 0.36).toFixed(1) + '" text-anchor="middle" font-size="' + (s * 0.9).toFixed(1) + '" class="' + (cls || 'ff-tree') + '">🌳</text>'; }

      function drawRows() {
        var cols = Math.ceil(n / rows), ok = n % rows === 0, cell = Math.min(40, 340 / cols, 196 / rows), s = '';
        var w = cols * cell, hgt = rows * cell, x0 = 200 - w / 2, y0 = 115 - hgt / 2;
        s += '<rect x="' + (x0 - 8).toFixed(1) + '" y="' + (y0 - 8).toFixed(1) + '" width="' + (w + 16).toFixed(1) + '" height="' + (hgt + 16).toFixed(1) + '" rx="10" class="ff-plot' + (ok ? ' ok' : '') + (ok && R.square && rows === cols ? ' sq' : '') + '"/>';
        for (var k = 0; k < rows * cols; k++) {
          var x = x0 + (k % cols + 0.5) * cell, y = y0 + (Math.floor(k / cols) + 0.5) * cell;
          s += k < n ? tree(x, y, cell) : '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (cell * 0.32).toFixed(1) + '" class="ff-gap"/>';
        }
        svg.innerHTML = s;
        var full = Math.floor(n / rows), spare = n % rows;
        var msg = ok ? '✅ <b>' + rows + ' row' + (rows > 1 ? 's' : '') + ' of ' + cols + '</b>: ' + rows + ' × ' + cols + ' = ' + n + (rows === cols ? ': a square! 🟧' : '') :
          '❌ Not a rectangle: ' + n + ' ÷ ' + rows + ' = ' + full + ' remainder ' + spare + '. The last row is short.';
        out.innerHTML = msg;
        val.textContent = rows + (rows > 1 ? ' rows' : ' row');
        svg.setAttribute('aria-label', n + ' trees planted in ' + rows + ' rows. ' + (ok ? 'They make a rectangle, ' + rows + ' by ' + cols + '.' : 'They do not make a rectangle.'));
        if (R.all) {
          if (ok) { var key = Math.min(rows, cols) + ' × ' + Math.max(rows, cols); if (found.indexOf(key) < 0) { found.push(key); out.innerHTML += ' 🎉 New pair!'; } }
          var list = shown ? all : all.filter(function (p) { return found.indexOf(p) >= 0; });
          fnd.innerHTML = 'Factor pairs found: ' + (list.length ? list.map(function (p) { return '<span class="ff-chip">' + p + '</span>'; }).join('') : '<i>none yet</i>');
        }
      }

      function drawCount() {
        var s = '', cell = 34, blocks = Math.ceil(n / 4), bw = 2 * cell + 18, x0 = 200 - (blocks * bw - 18) / 2;
        for (var k = 0; k < n; k++) {
          var b = Math.floor(k / 4), j = k % 4, x = x0 + b * bw + (j % 2 + 0.5) * cell, y = 82 + (Math.floor(j / 2) + 0.5) * cell;
          if (j === 0) s += '<rect x="' + (x0 + b * bw - 6).toFixed(1) + '" y="76" width="' + (2 * cell + 12) + '" height="' + (2 * cell + 12) + '" rx="10" class="ff-plot' + (n >= (b + 1) * 4 ? ' ok' : '') + '"/>';
          s += tree(x, y, cell);
        }
        svg.innerHTML = s;
        val.textContent = n + (n > 1 ? ' trees' : ' tree');
        out.innerHTML = n === 8 && shown ? '2³ = 2 × 2 × 2 = <b>8</b> 🌳' : 'Blocks of 2 × 2 trees: <b>' + Math.floor(n / 4) + '</b> full' + (n % 4 ? ', plus ' + (n % 4) + ' more' : '');
        svg.setAttribute('aria-label', n + ' trees planted in blocks of 4.');
      }
      function draw() { if (R.count) drawCount(); else if (!R.q) drawRows(); }

      stage.querySelectorAll('[data-d]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          var d = +b.getAttribute('data-d');
          if (R.count) n = Math.max(1, Math.min(12, n + d)); else rows = Math.max(1, Math.min(R.n, rows + d));
          draw();
        });
      });

      var done = stage.querySelector('[data-done]');
      if (done) done.addEventListener('click', function () {
        if (stage.classList.contains('locked')) return;
        var ok, hint = R.hint;
        if (R.all) { ok = found.length === all.length; hint = 'You have found ' + found.length + ' of ' + all.length + ' factor pairs. ' + R.hint; }
        else if (R.count) { ok = n === R.count; if (n === 6) hint = 'You planted 6, which is 2 × 3. ' + R.hint; else if (n === 9) hint = '9 is 3². ' + R.hint; }
        else { ok = n % rows === 0 && R.goal(rows); if (rows === 1 || rows === R.n) hint = 'One long line is the 1 × ' + R.n + ' rectangle. ' + R.hint; }
        ui.check(ok, { hint: hint, why: R.why, reveal: function () {
          shown = true;
          if (R.count) n = R.count; else if (!R.all) rows = R.square ? 4 : 3;
          draw();
        } });
        if (ok) { shown = true; draw(); }
      });

      var box = stage.querySelector('.q-options');
      if (box) R.opts.forEach(function (o, k) {
        var b = h('button', 'opt', o); b.type = 'button';
        b.addEventListener('click', function () {
          b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
          ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
          if (R.prime && stage.classList.contains('locked')) { rows = 1; draw(); }
        });
        box.appendChild(b);
      });
      draw();
    }
  });
})();
