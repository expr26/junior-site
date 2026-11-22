/* Data Detective: small data sets (5 to 7 values) shown as towers of cubes or as bar charts.
   Rules used: mean = total ÷ how many values (the height of the towers when they are levelled out, with no cubes lost);
   median = middle value once the values are in order; mode = most common value; range = largest − smallest.
   With an outlier, the median is usually a better "typical" value than the mean.
   Answers checked by hand:
     R1 towers 2, 6, 3, 5, 4: total 20, 20 ÷ 5 = 4 cubes each when level.
     R2 3, 8, 5, 6, 4, 10: total 36, 36 ÷ 6 = 6.
     R3 6, 2, 9, 4, 7, 3, 8 -> in order 2, 3, 4, 6, 7, 8, 9: median (4th value) = 6.
     R4 5, 3, 8, 3, 6, 4: mode = 3 (appears twice; the largest value 8 appears once).
     R5 4, 9, 2, 7, 6: range = 9 − 2 = 7.
     R6 bar chart apples 6, bananas 4, grapes 8, oranges 3, pears 5: grapes − bananas = 8 − 4 = 4.
     R7 stickers 2, 4, 5, 6, 33: total 50, mean 10; median 5; no mode; range 31. 33 is an outlier, so the median is best.
     R8 3, 5, 4, 6, 2 (total 20, mean 4) plus a new 10: total 30, 30 ÷ 6 = 5. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var PAL = ['#FF5D8F', '#FF8A3D', '#FFC93C', '#34C77B', '#3B82F6', '#6C4DF6', '#0F9488'];
  var ROUNDS = [
    { type: 'level', data: [2, 6, 3, 5, 4], text: 'Level out the towers! Move cubes until every tower is the <b>same height</b>, then press Done.',
      hint: 'Take cubes from the tallest towers and give them to the shortest ones. Keep going until they all match.',
      why: 'The 20 cubes shared equally between 5 towers make 4 each. That level height is the <b>mean</b>: 20 ÷ 5 = 4.' },
    { type: 'num', ask: 'mean', move: true, data: [3, 8, 5, 6, 4, 10], ans: 6, start: 0, text: 'What is the <b>mean</b> number of cubes? Level the towers out, or add them up and divide. Then set your answer.',
      hint: 'Mean = total ÷ how many values. Add up all the cubes, then share them between the 6 towers.', why: '3 + 8 + 5 + 6 + 4 + 10 = 36, and 36 ÷ 6 = 6. Levelled out, every tower would have 6 cubes.' },
    { type: 'median', data: [6, 2, 9, 4, 7, 3, 8], text: 'Find the <b>median</b>. First tap the towers from <b>shortest to tallest</b> to put them in order.',
      hint: 'There are 7 towers in order. The median is the middle one, with 3 towers on each side.', why: 'In order: 2, 3, 4, 6, 7, 8, 9. The middle (4th) value is 6, so the median is 6.' },
    { type: 'mode', data: [5, 3, 8, 3, 6, 4], ans: 3, text: 'Tap a tower that shows the <b>mode</b>.',
      hint: 'The mode is the value that appears most often. Read the numbers under the towers: which one is there twice?', why: '3 appears twice and every other value appears once, so the mode is 3. The mode is the most common value, not the biggest.' },
    { type: 'num', ask: 'range', data: [4, 9, 2, 7, 6], ans: 7, start: 0, text: 'What is the <b>range</b> of these towers?',
      hint: 'Range = largest value − smallest value.', why: 'The largest value is 9 and the smallest is 2, so the range is 9 − 2 = 7.' },
    { type: 'num', ask: 'chart', ans: 4, start: 0, text: 'A class voted for their favourite fruit. How many <b>more</b> children chose grapes 🍇 than bananas 🍌?',
      hint: 'Read the top of each bar across to the scale. Then find the difference: grapes − bananas.', why: '8 children chose grapes and 4 chose bananas. 8 − 4 = 4 more.' },
    { type: 'mc', chart: 'stickers', q: 'Five friends count their stickers. Which average best describes a <b>typical</b> friend?',
      opts: ['The mean, 10, because it uses every value', 'The median, 5, because 33 is an outlier', 'The range, 31'], ans: 1,
      hint: 'Is 10 stickers typical? Only one friend has more than 6. And is the range an average at all?',
      why: '33 is an outlier. It pulls the mean up to 10, which is more than 4 of the 5 friends have. The median, 5, is a better typical value.' },
    { type: 'mc', move: true, data: [3, 5, 4, 6, 2, 10], fresh: 5, q: 'The first 5 towers have a mean of 4. A new tower of <b>10</b> cubes joins them. What is the <b>new mean</b>? (You can level them out to check.)',
      opts: ['4: the mean does not change', '5', '7: halfway between 4 and 10', '6'], ans: 1,
      hint: 'The old total is 5 × 4 = 20. Add the new 10 cubes, then share the new total between 6 towers.',
      why: 'The total is now 20 + 10 = 30 cubes, shared between 6 towers: 30 ÷ 6 = 5. A big new value pulls the mean up.' }
  ];
  var FRUIT = [['🍎', 'Apples', 6], ['🍌', 'Bananas', 4], ['🍇', 'Grapes', 8], ['🍊', 'Oranges', 3], ['🍐', 'Pears', 5]];
  var KIDS = [['Amy', 2], ['Ben', 4], ['Cara', 5], ['Dan', 6], ['Eli', 33]];

  Arcade.game({
    intro: 'Calling all Data Detectives! Stack, level and sort cubes to crack the mean, median, mode and range.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], sel = null, sorted = 0, mark = null, val = R.start || 0, showMean = false, picked = null;
      var towers = (R.data || []).map(function (n, k) { var t = []; for (var c = 0; c < n; c++) t.push(k); return t; });
      var tap = R.type === 'level' || R.move || R.type === 'median' || R.type === 'mode';
      var ctrl = '';
      if (R.type === 'num') ctrl = '<div class="dd-ans"><span class="dd-lab">' + { mean: 'Mean', range: 'Range', chart: 'More' }[R.ask] + ' =</span>' +
        '<button class="btn ghost" type="button" data-d="-1" aria-label="One less">−</button><b class="dd-val" aria-live="polite"></b><button class="btn ghost" type="button" data-d="1" aria-label="One more">+</button>' +
        '<button class="btn" type="button" data-go>Check ✓</button></div>';
      var acts = (R.type === 'level' || R.move ? '<button class="btn ghost" type="button" data-reset>Reset ↺</button>' : '') + (R.type === 'level' ? '<button class="btn" type="button" data-go>Done ✓</button>' : '');
      if (acts) ctrl = '<p class="actions dd-act">' + acts + '</p>' + ctrl;
      if (R.type === 'mc') ctrl += '<div class="q-options"></div>';
      stage.innerHTML = '<p class="q-num">Case ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="dd-svg" viewBox="0 0 400 290" role="img"></svg><p class="dd-out" aria-live="polite"></p>' + ctrl;
      var svg = stage.querySelector('svg'), out = stage.querySelector('.dd-out');
      function locked() { return stage.classList.contains('locked'); }
      function vals() { return towers.map(function (t) { return t.length; }); }

      ui.owl(R.type === 'median' ? 'Tap the shortest tower first, then the next shortest…' : R.type === 'mode' ? 'Mode = the most common value.' :
        tap && R.type !== 'mode' ? 'Tap a tall tower, then tap a short one to move a cube across.' : R.chart || R.ask === 'chart' ? 'Read each bar against the scale on the left.' : 'Read the numbers under the towers.');
      if (tap && R.type !== 'median' && R.type !== 'mode') out.textContent = 'Tap a tower to pick it up.';
      if (R.type === 'median') out.textContent = 'Tap the shortest tower.';

      function drawTowers() {
        var n = towers.length, W = 400 / n, cw = Math.min(40, W - 12), base = 252, c = 20, s = '';
        towers.forEach(function (t, k) {
          var x = W * (k + .5), cls = 'dd-col' + (k === sel ? ' sel' : '') + (mark && mark.indexOf(k) >= 0 ? ' ok' : '') + (k === picked ? ' bad' : '') + (R.type === 'median' && k < sorted ? ' done' : '');
          s += '<g class="' + cls + '" data-k="' + k + '"' + (tap && !locked() ? ' role="button" tabindex="0"' : '') + ' aria-label="Tower ' + (k + 1) + ': ' + t.length + ' cubes' + (k === R.fresh ? ', the new tower' : '') + '">' +
            '<rect x="' + (x - W / 2 + 3) + '" y="16" width="' + (W - 6) + '" height="270" rx="10" class="dd-hit"/>';
          t.forEach(function (col, j) { s += '<rect x="' + (x - cw / 2) + '" y="' + (base - (j + 1) * c) + '" width="' + cw + '" height="' + (c - 2) + '" rx="4" fill="' + PAL[col % PAL.length] + '" class="dd-cube"/>'; });
          s += '<text x="' + x + '" y="' + (base + 24) + '" text-anchor="middle" class="dd-n">' + t.length + '</text>';
          if (k === R.fresh) s += '<text x="' + x + '" y="' + (base - t.length * c - 8) + '" text-anchor="middle" class="dd-tag">new</text>';
          s += '</g>';
        });
        s += '<line x1="6" y1="' + base + '" x2="394" y2="' + base + '" class="dd-base"/>';
        if (showMean) { var m = vals().reduce(function (a, b) { return a + b; }, 0) / n, y = base - m * c; s += '<line x1="6" y1="' + y + '" x2="394" y2="' + y + '" class="dd-mean"/><text x="8" y="' + (y - 6) + '" class="dd-tag">mean = ' + m + '</text>'; }
        if (R.type === 'median' && sorted === n) s += '<text x="200" y="30" text-anchor="middle" class="dd-tag">shortest → tallest</text>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Towers of cubes: ' + vals().join(', ') + '.' + (sel != null ? ' Tower ' + (sel + 1) + ' is picked up.' : ''));
      }

      function drawChart() {
        var rows = R.ask === 'chart' ? FRUIT.map(function (f) { return [f[0], f[1], f[2]]; }) : KIDS.map(function (k) { return ['', k[0], k[1]]; });
        var top = R.ask === 'chart' ? 8 : 35, step = R.ask === 'chart' ? 1 : 5, x0 = 46, xr = R.chart ? 330 : 392, y0 = 236, ht = 200, sc = ht / top, s = '';
        for (var v = 0; v <= top; v += step) { var y = y0 - v * sc; s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + xr + '" y2="' + y + '" class="dd-grid"/><text x="' + (x0 - 8) + '" y="' + (y + 5) + '" text-anchor="end" class="dd-ax">' + v + '</text>'; }
        var bw = (xr - x0) / rows.length;
        rows.forEach(function (r, k) {
          var x = x0 + bw * (k + .5), hh = r[2] * sc;
          s += '<rect x="' + (x - bw * .32) + '" y="' + (y0 - hh) + '" width="' + (bw * .64) + '" height="' + hh + '" rx="5" fill="' + PAL[k] + '" class="dd-bar"/>';
          if (r[0]) s += '<text x="' + x + '" y="' + (y0 + 30) + '" text-anchor="middle" class="dd-emo">' + r[0] + '</text>';
          else s += '<text x="' + x + '" y="' + (y0 - hh - 6) + '" text-anchor="middle" class="dd-n">' + r[2] + '</text><text x="' + x + '" y="' + (y0 + 22) + '" text-anchor="middle" class="dd-ax">' + r[1] + '</text>';
        });
        s += '<line x1="' + x0 + '" y1="' + y0 + '" x2="' + xr + '" y2="' + y0 + '" class="dd-base"/><line x1="' + x0 + '" y1="' + y0 + '" x2="' + x0 + '" y2="' + (y0 - ht - 6) + '" class="dd-base"/>';
        s += '<text x="12" y="' + (y0 - ht / 2) + '" text-anchor="middle" transform="rotate(-90 12 ' + (y0 - ht / 2) + ')" class="dd-ax">' + (R.ask === 'chart' ? 'Number of children' : 'Stickers') + '</text>';
        if (R.chart && showMean) [[10, 'mean 10', 'dd-mean'], [5, 'median 5', 'dd-med']].forEach(function (l) { var y = y0 - l[0] * sc; s += '<line x1="' + x0 + '" y1="' + y + '" x2="' + (xr + 4) + '" y2="' + y + '" class="' + l[2] + '"/><text x="' + (xr + 8) + '" y="' + (y + 5) + '" class="dd-tag">' + l[1] + '</text>'; });
        svg.innerHTML = s;
        svg.setAttribute('aria-label', R.ask === 'chart' ? 'Bar chart of favourite fruit. Apples 6, bananas 4, grapes 8, oranges 3, pears 5.' : 'Bar chart of stickers: Amy 2, Ben 4, Cara 5, Dan 6, Eli 33.');
      }

      function draw() {
        if (R.ask === 'chart' || R.chart) drawChart(); else drawTowers();
        var v = stage.querySelector('.dd-val'); if (v) v.textContent = val;
      }

      function check(ok, o) {
        ui.check(ok, o);
        if (locked()) { sel = null; if (tap && R.type !== 'median' && R.type !== 'mode') out.textContent = ''; draw(); }
      }

      function tapTower(k) {
        if (R.type === 'mode') {
          var v = towers[k].length, ok = v === R.ans;
          picked = ok ? null : k; mark = ok ? [k] : null; draw();
          check(ok, { hint: v === 8 ? '8 is the biggest value, but the mode is the value that appears <b>most often</b>.' : R.hint, why: R.why,
            reveal: function () { picked = null; mark = towers.map(function (t, j) { return t.length === R.ans ? j : -1; }).filter(function (j) { return j >= 0; }); } });
          return;
        }
        if (R.type === 'median') {
          var n = towers.length;
          if (sorted < n) {
            if (k < sorted) return;
            var rest = vals().slice(sorted), min = Math.min.apply(null, rest);
            if (towers[k].length !== min) { out.textContent = 'Not that one yet: look for the shortest tower that is not in order.'; return; }
            var t = towers[sorted]; towers[sorted] = towers[k]; towers[k] = t; sorted++;
            if (sorted === n - 1) sorted = n;
            out.textContent = sorted === n ? 'In order: ' + vals().join(', ') + '. Now tap the median, the middle value!' : 'Good! Now tap the next shortest.';
            draw(); return;
          }
          var ok2 = k === 3; picked = ok2 ? null : k; mark = ok2 ? [k] : null; draw();
          check(ok2, { hint: R.hint, why: R.why, reveal: function () { picked = null; mark = [3]; } });
          return;
        }
        // moving cubes
        if (sel == null) { if (!towers[k].length) { out.textContent = 'That tower is empty. Pick one with cubes.'; return; } sel = k; out.textContent = 'Tower ' + (k + 1) + ' picked. Tap another tower to give it a cube.'; }
        else if (sel === k) { sel = null; out.textContent = 'Put down. Tap a tower to pick it up.'; }
        else if (!towers[sel].length) { out.textContent = 'Tower ' + (sel + 1) + ' has no cubes left. Pick another tower.'; sel = null; }
        else { towers[k].push(towers[sel].pop()); out.textContent = 'Moved a cube from tower ' + (sel + 1) + ' to tower ' + (k + 1) + '. Towers: ' + vals().join(', '); }
        draw();
        var g = svg.querySelector('[data-k="' + k + '"]'); if (g) g.focus({ preventScroll: true });
      }

      svg.addEventListener('click', function (ev) { var g = ev.target.closest('.dd-col'); if (g && tap && !locked()) tapTower(+g.getAttribute('data-k')); });
      svg.addEventListener('keydown', function (ev) { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest('.dd-col')) { ev.preventDefault(); ev.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });

      function level() { var tot = vals().reduce(function (a, b) { return a + b; }, 0), m = tot / towers.length, pool = []; towers.forEach(function (t) { pool = pool.concat(t); }); pool.sort(function (a, b) { return a - b; }); towers = towers.map(function () { return pool.splice(0, m); }); }

      var reset = stage.querySelector('[data-reset]');
      if (reset) reset.addEventListener('click', function () { if (locked()) return; towers = R.data.map(function (n, k) { var t = []; for (var c = 0; c < n; c++) t.push(k); return t; }); sel = null; out.textContent = 'Back to the start.'; draw(); });

      if (R.type === 'level') stage.querySelector('[data-go]').addEventListener('click', function () {
        if (locked()) return;
        var v = vals(), even = v.every(function (x) { return x === v[0]; });
        check(even, { hint: 'Not level yet: the towers are ' + v.join(', ') + '. ' + R.hint, why: R.why, reveal: function () { level(); } });
        if (locked()) { showMean = true; draw(); }
      });
      if (R.type === 'num') {
        stage.querySelectorAll('[data-d]').forEach(function (b) { b.addEventListener('click', function () { if (!locked()) { val = Math.max(0, Math.min(40, val + +b.getAttribute('data-d'))); draw(); } }); });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (locked()) return;
          var hint = R.hint;
          if (R.ask === 'mean' && val === 36) hint = '36 is the <b>total</b>. Now share it equally between the 6 towers.';
          if (R.ask === 'range' && val === 9) hint = '9 is the largest value. The range is how spread out the values are: largest − smallest.';
          if (R.ask === 'range' && val === 11) hint = 'Did you add? Range is a difference, so subtract: largest − smallest.';
          if (R.ask === 'chart' && val === 8) hint = '8 children chose grapes. The question asks how many <b>more</b> than bananas.';
          if (R.ask === 'chart' && val === 12) hint = 'Did you add? "How many more" means find the difference: subtract.';
          check(val === R.ans, { hint: hint, why: R.why, reveal: function () { val = R.ans; if (R.ask === 'mean') level(); } });
          if (locked() && R.ask === 'mean') { level(); showMean = true; draw(); }
        });
      }
      if (R.type === 'mc') {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            if (locked()) { if (R.move) level(); showMean = true; draw(); }
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
