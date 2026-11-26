/* Spinner Lab: probability with fair spinners (equal-sized sections) and bags of counters (picked without looking).
   Rules used: P(event) = number of ways it can happen ÷ total number of equally likely outcomes; every probability is
   between 0 (impossible) and 1 (certain); P(not A) = 1 − P(A).
   Probability words used on the scale: impossible = 0, unlikely = between 0 and 1/2, even chance = 1/2,
   likely = between 1/2 and 1, certain = 1.
   Answers checked by hand:
     R1 bag 6 red + 2 blue: P(red) = 6/8 = 3/4 -> likely.   R2 spinner 4 yellow of 8: P(yellow) = 4/8 = 1/2 -> even chance.
     R3 spinner 3 red, 2 blue, 3 yellow (8): P(red) = 3/8.  R4 bag 4 red, 6 blue, 2 green (12): P(blue) = 6/12 = 1/2.
     R5 design: 4 red sections of 8 gives P(red) = 1/2.     R6 P(rain) = 3/10, so P(not rain) = 1 − 3/10 = 7/10.
     R7 1.2 is more than 1, so it cannot be a probability.
     R8 experiment: spins use Math.random(), but the question (more trials usually get the relative frequency closer to
        the theoretical probability 1/4) does not depend on the random results. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';

  var COL = { r: ['#E5484D', 'red', 'R'], b: ['#3B82F6', 'blue', 'B'], y: ['#FFC93C', 'yellow', 'Y'], g: ['#34C77B', 'green', 'G'], w: ['#FFFFFF', 'white', ''] };
  var WORDS = ['Impossible', 'Unlikely', 'Even chance', 'Likely', 'Certain'];
  // tap zones on the scale (x from 0 to 400, the line runs from x=30 (0) to x=370 (1))
  var ZONES = [[0, 60, 30], [60, 170, 115], [170, 230, 200], [230, 340, 285], [340, 400, 370]];

  var ROUNDS = [
    { type: 'scale', bag: 'rrrrrrbb', ans: 3, text: 'A bag holds 6 red and 2 blue counters. You pick one without looking. Where does <b>picking red</b> go on the probability scale?',
      hints: { 4: 'Could you ever pick a blue counter? If so, red is not certain.', 2: 'Even chance means half and half. Are half of the counters red?' },
      hint: 'Most of the counters are red. Is that more or less than half?', why: '6 of the 8 counters are red, so P(red) = 6/8 = 3/4. That is more than 1/2 but less than 1, so it is likely.' },
    { type: 'scale', spin: 'ybyrybyb', ans: 2, text: 'This fair spinner has 8 equal sections. Where does <b>landing on yellow</b> go on the probability scale?',
      hints: { 1: 'There are 3 colours, but they are not equally likely. Count the yellow sections out of 8.' },
      hint: 'Count the yellow sections. What fraction of the 8 sections is that?', why: '4 of the 8 equal sections are yellow, so P(yellow) = 4/8 = 1/2: an even chance.' },
    { type: 'frac', spin: 'rbyrybry', target: [3, 8], text: 'Spin this fair spinner once. What is the probability that it lands on <b>red</b>? Set the fraction, then press Check.',
      hint: 'Top number: how many red sections? Bottom number: how many sections altogether?', why: '3 of the 8 equal sections are red, so P(red) = 3/8.' },
    { type: 'mc', bag: 'rrrrbbbbbbgg', q: 'This bag has 4 red, 6 blue and 2 green counters. You pick one without looking. What is P(blue)?',
      opts: ['6/6', '6/12, which is 1/2', '1/3, because there are 3 colours'], ans: 1,
      hint: 'Probability = number of blue counters ÷ number of counters altogether. Count every counter in the bag.', why: 'There are 6 blue counters out of 12 altogether, so P(blue) = 6/12 = 1/2.' },
    { type: 'design', n: 8, want: 4, text: 'Design a spinner! Tap sections to colour them red so that <b>P(red) = 1/2</b>. Then press Done.',
      hint: 'Half of the 8 sections need to be red. How many is half of 8?', why: '4 red sections out of 8 equal sections gives P(red) = 4/8 = 1/2. It doesn\'t matter where the red sections are.' },
    { type: 'not', target: [7, 10], text: 'The weather app says the probability of <b>rain</b> tomorrow is <b>3/10</b>. What is the probability that it does <b>not</b> rain?',
      hint: 'Rain and no rain together are certain, so they add up to 1. Work out 1 − 3/10 (1 is the same as 10/10).', why: 'P(not rain) = 1 − 3/10 = 7/10. P(A) and P(not A) always add up to 1.' },
    { type: 'mc', scale: true, q: 'Which of these could <b>not</b> be a probability?', opts: ['0.5', '0', '1.2', '1'], ans: 2,
      hint: 'Probabilities go from 0 (impossible) to 1 (certain). Can anything be more likely than certain?', why: 'Every probability is between 0 and 1. 1.2 is bigger than 1, so it can\'t be a probability.' },
    { type: 'exp', spin: 'rbbb', q: 'This fair spinner has P(red) = 1/4. Spin it as many times as you like. If you did <b>hundreds</b> of spins, what usually happens to the fraction of spins that land on red?',
      opts: ['It will be exactly 1/4 every time you check', 'It usually gets closer to 1/4', 'After lots of blues, red is "due", so red becomes more likely'], ans: 1,
      hint: 'With only a few spins the fraction jumps about a lot. Keep spinning: does it settle down? (A spinner has no memory.)',
      why: 'With more trials, the relative frequency usually gets closer to the theoretical probability, 1/4. It is rarely exactly 1/4, and the spinner can\'t remember past spins.' }
  ];

  function f(v) { return v.toFixed(1); }
  function pt(cx, cy, r, deg) { var t = deg * Math.PI / 180; return [cx + r * Math.sin(t), cy - r * Math.cos(t)]; }
  function count(s, c) { return s.split('').filter(function (x) { return x === c; }).length; }

  // A spinner with equal sections, drawn clockwise from the top. tap = true makes each section a button.
  function spinner(secs, cx, cy, r, tap, ptr) {
    var n = secs.length, s = '';
    for (var k = 0; k < n; k++) {
      var a0 = k * 360 / n, a1 = (k + 1) * 360 / n, p0 = pt(cx, cy, r, a0), p1 = pt(cx, cy, r, a1), lp = pt(cx, cy, r * 0.62, (a0 + a1) / 2), c = COL[secs[k]];
      var d = n === 1 ? 'M' + (cx - r) + ' ' + cy + ' a' + r + ' ' + r + ' 0 1 0 ' + (2 * r) + ' 0 a' + r + ' ' + r + ' 0 1 0 ' + (-2 * r) + ' 0' :
        'M' + cx + ' ' + cy + ' L' + f(p0[0]) + ' ' + f(p0[1]) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + f(p1[0]) + ' ' + f(p1[1]) + ' Z';
      s += '<g' + (tap ? ' class="sl-sec" role="button" tabindex="0" data-k="' + k + '" aria-label="Section ' + (k + 1) + ', ' + c[1] + '"' : '') + '>' +
        '<path d="' + d + '" fill="' + c[0] + '" class="sl-wedge"/>' + (c[2] ? '<text x="' + f(lp[0]) + '" y="' + f(lp[1] + 6) + '" text-anchor="middle" class="sl-let">' + c[2] + '</text>' : '') + '</g>';
    }
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="sl-rim"/>';
    if (ptr != null) s += '<g class="sl-ptr" style="transform:rotate(' + ptr + 'deg);transform-origin:' + cx + 'px ' + cy + 'px"><path d="M' + (cx - 6) + ' ' + cy + ' L' + cx + ' ' + (cy - r + 12) + ' L' + (cx + 6) + ' ' + cy + ' Z" class="sl-arrow"/></g>';
    s += '<circle cx="' + cx + '" cy="' + cy + '" r="8" class="sl-hub"/>';
    return s;
  }

  function bag(cs, cx, cy) {
    var s = '<path d="M' + (cx - 70) + ' ' + (cy - 58) + ' Q' + (cx - 120) + ' ' + (cy + 70) + ' ' + cx + ' ' + (cy + 72) + ' Q' + (cx + 120) + ' ' + (cy + 70) + ' ' + (cx + 70) + ' ' + (cy - 58) + ' Z" class="sl-bag"/>' +
      '<path d="M' + (cx - 74) + ' ' + (cy - 60) + ' H' + (cx + 74) + '" class="sl-bagtop"/>';
    var cols = 4, rows = Math.ceil(cs.length / cols);
    cs.split('').forEach(function (c, k) {
      var row = Math.floor(k / cols), col = k % cols, inRow = Math.min(cols, cs.length - row * cols);
      var x = cx + (col - (inRow - 1) / 2) * 38, y = cy - 22 + row * 36 + (rows < 3 ? 14 : 0);
      s += '<circle cx="' + x + '" cy="' + y + '" r="15" fill="' + COL[c][0] + '" class="sl-ctr"/><text x="' + x + '" y="' + (y + 5) + '" text-anchor="middle" class="sl-let sm">' + COL[c][2] + '</text>';
    });
    return s;
  }

  function scale(y, chosen, right) {
    var s = '';
    ZONES.forEach(function (z, k) {
      var cls = 'sl-zone' + (k === chosen ? ' on' : '') + (k === right ? ' ok' : '');
      s += '<g class="' + cls + '" data-z="' + k + '" role="button" tabindex="0" aria-label="' + WORDS[k] + '">' +
        '<rect x="' + (z[0] + 2) + '" y="' + (y - 22) + '" width="' + (z[1] - z[0] - 4) + '" height="72" rx="10" class="sl-zr"/></g>';
    });
    s += '<line x1="30" y1="' + y + '" x2="370" y2="' + y + '" class="sl-line"/>';
    [[30, '0'], [200, '1/2'], [370, '1']].forEach(function (t) { s += '<line x1="' + t[0] + '" y1="' + (y - 8) + '" x2="' + t[0] + '" y2="' + (y + 8) + '" class="sl-line"/><text x="' + t[0] + '" y="' + (y - 30) + '" text-anchor="middle" class="sl-num">' + t[1] + '</text>'; });
    var lab = [[4, 'start', 'Impossible'], [115, 'middle', 'Unlikely'], [200, 'middle', 'Even chance'], [285, 'middle', 'Likely'], [396, 'end', 'Certain']];
    lab.forEach(function (l, k) { s += '<text x="' + l[0] + '" y="' + (y + (k % 2 ? 27 : 43)) + '" text-anchor="' + l[1] + '" class="sl-word">' + l[2] + '</text>'; });
    var mark = right != null ? right : chosen;
    if (mark != null) s += '<text x="' + ZONES[mark][2] + '" y="' + (y + 7) + '" text-anchor="middle" class="sl-pin">📍</text>';
    return s;
  }

  function stepper(label, key) {
    return '<div class="sl-frac" role="group" aria-label="' + label + '">' +
      '<div class="sl-row"><button class="btn ghost" type="button" data-s="n" data-d="-1" aria-label="Top number down">−</button><b class="sl-n" data-v="n"></b><button class="btn ghost" type="button" data-s="n" data-d="1" aria-label="Top number up">+</button></div>' +
      '<div class="sl-bar"></div>' +
      '<div class="sl-row"><button class="btn ghost" type="button" data-s="d" data-d="-1" aria-label="Bottom number down">−</button><b class="sl-n" data-v="d"></b><button class="btn ghost" type="button" data-s="d" data-d="1" aria-label="Bottom number up">+</button></div></div>';
  }

  Arcade.game({
    intro: 'Welcome to Spinner Lab! Spin spinners and dip into bags of counters to find out how likely things are.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], chosen = null, right = null, secs = R.type === 'design' ? 'wwwwwwww' : R.spin, frac = { n: 1, d: 2 };
      var spins = 0, reds = 0, ptr = 0;
      var H = R.type === 'scale' ? 300 : R.type === 'exp' ? 262 : R.type === 'not' ? 150 : R.scale ? 116 : 200;
      var ctrl = '';
      if (R.type === 'scale') ctrl = '<p class="actions sl-act"><button class="btn" type="button" data-go>Place it 📍</button></p>';
      if (R.type === 'frac' || R.type === 'not') ctrl = '<div class="sl-fwrap">' + stepper('Your fraction') + '<button class="btn" type="button" data-go>Check ✓</button></div>';
      if (R.type === 'design') ctrl = '<p class="actions sl-act"><button class="btn ghost" type="button" data-clear>Clear</button><button class="btn" type="button" data-go>Done ✓</button></p>';
      if (R.type === 'exp') ctrl = '<p class="actions sl-act"><button class="btn" type="button" data-spin>Spin 10 times 🌀</button></p>';
      if (R.type === 'mc' || R.type === 'exp') ctrl += '<div class="q-options"></div>';
      stage.innerHTML = '<p class="q-num">Experiment ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="sl-svg" viewBox="0 0 400 ' + H + '" role="img"></svg><p class="sl-out" aria-live="polite"></p>' + ctrl;
      var svg = stage.querySelector('svg'), out = stage.querySelector('.sl-out');
      function locked() { return stage.classList.contains('locked'); }

      ui.owl({ scale: 'Tap a place on the scale, then press Place it.', frac: 'Probability = ways it can happen ÷ all the equally likely outcomes.',
        mc: 'Think it through, then pick an answer.', design: 'Tap a section to colour it red. Tap again to make it white.',
        not: 'Something either happens or it doesn\'t!', exp: 'Press Spin 10 times as often as you like and watch the tally.' }[R.type]);

      function draw() {
        var s = '', label = '';
        if (R.type === 'scale') {
          s += R.bag ? bag(R.bag, 200, 82) : spinner(secs, 200, 88, 78, false, null);
          s += scale(244, chosen, right);
          label = (R.bag ? 'A bag of 6 red and 2 blue counters' : 'A spinner with 8 equal sections: 4 yellow, 3 blue and 1 red') + ', above a probability scale from 0 to 1.' + (chosen != null ? ' You chose ' + WORDS[chosen] + '.' : '');
        } else if (R.type === 'frac' || (R.type === 'mc' && R.spin)) {
          s += spinner(secs, 200, 100, 90, false, null); label = 'A spinner with 8 equal sections: 3 red, 2 blue and 3 yellow.';
        } else if (R.type === 'mc' && R.bag) {
          s += bag(R.bag, 200, 100); label = 'A bag with 4 red, 6 blue and 2 green counters.';
        } else if (R.scale) {
          s += scale(60, null, null).replace(/ role="button" tabindex="0"/g, ''); label = 'A probability scale from 0 (impossible) to 1 (certain).';
        } else if (R.type === 'design') {
          s += spinner(secs, 200, 100, 94, !locked(), null);
          var red = count(secs, 'r'); label = 'Your spinner has ' + red + ' red sections out of 8.';
          out.innerHTML = 'Red: <b>' + red + ' of 8</b> sections → P(red) = <b>' + red + '/8</b>';
        } else if (R.type === 'not') {
          for (var k = 0; k < 10; k++) {
            var rain = k < 3, x = 22 + k * 36;
            s += '<rect x="' + x + '" y="40" width="32" height="44" rx="8" class="sl-cell' + (rain ? ' rain' : '') + '"/><text x="' + (x + 16) + '" y="70" text-anchor="middle" class="sl-emo">' + (rain ? '🌧️' : '☀️') + '</text>';
          }
          s += '<text x="22" y="28" class="sl-num" text-anchor="start">rain: 3 out of 10</text><text x="378" y="28" class="sl-num" text-anchor="end">not rain: ?</text>' +
            '<text x="200" y="118" text-anchor="middle" class="sl-word">Think of 10 equally likely tomorrows</text>';
          label = 'A strip of 10 boxes: 3 rainy and 7 sunny.';
        } else if (R.type === 'exp') {
          s += spinner(secs, 200, 92, 82, false, ptr);
          var rf = spins ? reds / spins : 0, bx = 30, bw = 340, y = 222;
          s += '<rect x="' + bx + '" y="' + (y - 12) + '" width="' + bw + '" height="24" rx="12" class="sl-track"/>';
          if (spins) s += '<rect x="' + bx + '" y="' + (y - 12) + '" width="' + f(Math.max(12, bw * rf)) + '" height="24" rx="12" class="sl-fill"/>';
          s += '<line x1="' + (bx + bw / 4) + '" y1="' + (y - 22) + '" x2="' + (bx + bw / 4) + '" y2="' + (y + 22) + '" class="sl-theory"/>' +
            '<text x="' + (bx + bw / 4 + 6) + '" y="' + (y - 18) + '" class="sl-num" text-anchor="start">1/4 (theory)</text>' +
            '<text x="' + bx + '" y="' + (y + 36) + '" class="sl-num" text-anchor="middle">0</text><text x="' + (bx + bw) + '" y="' + (y + 36) + '" class="sl-num" text-anchor="middle">1</text>' +
            '<text x="200" y="' + (y + 36) + '" class="sl-num" text-anchor="middle">fraction of spins on red</text>';
          label = 'A spinner with 1 red and 3 blue equal sections. ' + spins + ' spins so far, ' + reds + ' on red.';
          out.innerHTML = spins ? 'Spins: <b>' + spins + '</b> · Red: <b>' + reds + '</b> · Relative frequency of red = ' + reds + '/' + spins + ' ≈ <b>' + rf.toFixed(2) + '</b>' : 'No spins yet. Theory says P(red) = 1/4 = 0.25.';
        }
        svg.innerHTML = s;
        svg.setAttribute('aria-label', label);
        stage.querySelectorAll('[data-v]').forEach(function (b) { b.textContent = frac[b.getAttribute('data-v')]; });
      }

      function opts() {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            if (locked() && R.type === 'exp') stage.querySelector('[data-spin]').disabled = false;
          });
          box.appendChild(b);
        });
      }

      function key(sel, fn) {
        svg.addEventListener('click', function (ev) { var g = ev.target.closest(sel); if (g && !locked()) fn(g); });
        svg.addEventListener('keydown', function (ev) { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest(sel)) { ev.preventDefault(); ev.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
      }
      function refocus(sel) { var el = svg.querySelector(sel); if (el) el.focus({ preventScroll: true }); }

      if (R.type === 'scale') {
        key('.sl-zone', function (g) { chosen = +g.getAttribute('data-z'); draw(); refocus('[data-z="' + chosen + '"]'); out.textContent = 'You chose: ' + WORDS[chosen]; });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (locked()) return;
          if (chosen == null) { out.textContent = 'Tap a place on the scale first.'; return; }
          ui.check(chosen === R.ans, { hint: R.hints[chosen] || R.hint, why: R.why, reveal: function () { right = R.ans; chosen = null; draw(); out.textContent = 'Answer: ' + WORDS[R.ans]; } });
          if (locked()) { right = R.ans; draw(); }
        });
      }
      if (R.type === 'frac' || R.type === 'not') {
        stage.querySelectorAll('[data-s]').forEach(function (b) { b.addEventListener('click', function () {
          if (locked()) return; var s = b.getAttribute('data-s'); frac[s] = Math.max(s === 'n' ? 0 : 1, Math.min(12, frac[s] + +b.getAttribute('data-d'))); draw(); }); });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (locked()) return;
          var t = R.target, ok = frac.n * t[1] === t[0] * frac.d, hint = R.hint;
          if (R.type === 'frac' && frac.d === 3) hint = 'The bottom number is not the number of colours. Count all the equal sections. ' + R.hint;
          if (R.type === 'frac' && frac.d === 5) hint = 'The bottom number must count <b>all</b> the sections, red ones too. ' + R.hint;
          if (R.type === 'not' && frac.n === 3 && frac.d === 10) hint = '3/10 is the chance that it <b>does</b> rain. Not raining is all the other outcomes. ' + R.hint;
          ui.check(ok, { hint: hint, why: R.why, reveal: function () { frac.n = t[0]; frac.d = t[1]; draw(); } });
          if (locked()) out.innerHTML = 'P = <b>' + t[0] + '/' + t[1] + '</b>';
        });
      }
      if (R.type === 'design') {
        key('.sl-sec', function (g) { var k = +g.getAttribute('data-k'); secs = secs.slice(0, k) + (secs[k] === 'r' ? 'w' : 'r') + secs.slice(k + 1); draw(); refocus('[data-k="' + k + '"]'); });
        stage.querySelector('[data-clear]').addEventListener('click', function () { if (!locked()) { secs = 'wwwwwwww'; draw(); } });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (locked()) return;
          var red = count(secs, 'r'), hint = R.hint;
          if (red > R.want) hint = 'Too much red! ' + red + '/8 is more than a half. ' + R.hint;
          else if (red < R.want) hint = (red ? 'Not enough red yet: ' + red + '/8 is less than a half. ' : 'There is no red yet, so P(red) = 0. ') + R.hint;
          ui.check(red === R.want, { hint: hint, why: R.why, reveal: function () { secs = 'rwrwrwrw'; } });
          draw();
        });
      }
      if (R.type === 'exp') {
        var arrow = function () { return svg.querySelector('.sl-ptr'); };
        stage.querySelector('[data-spin]').addEventListener('click', function () {
          var last = 0;
          for (var k = 0; k < 10; k++) { last = Math.random() * 360; spins++; if (last < 90) reds++; }
          // sections: red is the first quarter (0° to 90° clockwise from the top)
          var target = Math.floor(ptr / 360) * 360 + 720 + last;
          if (still) { ptr = target; draw(); return; }
          draw(); var a = arrow(); void a.getBoundingClientRect(); ptr = target; a.style.transform = 'rotate(' + ptr + 'deg)';
        });
      }
      if (R.type === 'mc' || R.type === 'exp') opts();
      draw();
    }
  });
})();
