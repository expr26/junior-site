/* Pictures for the Solving equations theory video (words: videos/maths/equations.json). Stage is 640 x 360; see static/js/theory.js.
   The balance: a purple bag holds x, each yellow block is 1. The triangle in part 5 is drawn to scale (30°, 60°, 90°). */
(function () {
  if (!window.Theory) return;

  var GREEN = '#22A06B', RED = '#E5484D', BLUE = '#2F80ED';
  var BAG = '<rect x="0" y="0" width="34" height="34" rx="9" fill="#6C4DF6" stroke="#2D1B69" stroke-width="2"/>' +
            '<text x="17" y="18" font-family="Fredoka, sans-serif" font-size="22" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">x</text>';
  function block(x, y) { return '<rect x="' + x + '" y="' + y + '" width="24" height="24" rx="4" fill="#FFC93C" stroke="#C2570C" stroke-width="2"/>'; }
  function pill(w, fill, stroke) { return '<rect x="' + (-w / 2) + '" y="-26" width="' + w + '" height="52" rx="16" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3"/>'; }
  function answer(s, x, y, w, t, o) {
    o = o || {};
    s.add(pill(w, '#DDF7EE', GREEN), { x: x, y: y, enter: 'pop', delay: o.delay || 0, name: o.name });
    s.text(x, y + 2, t, { size: o.size || 30, weight: 700, colour: '#0E7A5A', enter: 'pop', delay: o.delay || 0, name: o.name && o.name + 't' });
  }

  /* the balance: a level beam with two plates, left centred at x = 180, right at x = 460, plate top at y = 298 */
  function balance(s, o) {
    o = o || {};
    s.add('<path d="M320 306 L292 346 H348 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/>' +
          '<rect x="40" y="298" width="560" height="10" rx="5" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/>' +
          '<rect x="60" y="292" width="240" height="8" rx="4" fill="#E9DFCB"/><rect x="340" y="292" width="240" height="8" rx="4" fill="#E9DFCB"/>',
          { enter: o.enter || 'up', delay: o.delay || 0, name: 'beam' });
  }
  /* load one plate: bags in rows of 6 at the bottom, blocks in rows of 8 above them.
     bagGroups / blockGroups are lists of counts; each count becomes its own group named pfx + 'b' + i / pfx + 'k' + i */
  function plate(s, cx, bagGroups, blockGroups, pfx, delay) {
    var nb = bagGroups.reduce(function (a, b) { return a + b; }, 0), nk = blockGroups.reduce(function (a, b) { return a + b; }, 0);
    var k = 0;
    bagGroups.forEach(function (n, gi) {
      var m = '';
      for (var j = 0; j < n; j++, k++) {
        var row = Math.floor(k / 6), cnt = Math.min(6, nb - row * 6), c = k % 6;
        m += '<g transform="translate(' + (cx - (cnt * 40 - 6) / 2 + c * 40) + ',' + (292 - 34 - row * 40) + ')">' + BAG + '</g>';
      }
      s.add(m, { enter: 'pop', delay: (delay || 0) + gi * 150, name: pfx + 'b' + gi });
    });
    var base = 292 - Math.ceil(nb / 6) * 40;
    k = 0;
    blockGroups.forEach(function (n, gi) {
      var m = '';
      for (var j = 0; j < n; j++, k++) {
        var row = Math.floor(k / 8), cnt = Math.min(8, nk - row * 8), c = k % 8;
        m += block(cx - (cnt * 27 - 3) / 2 + c * 27, base - 24 - row * 27);
      }
      s.add(m, { enter: 'pop', delay: (delay || 0) + 300 + gi * 150, name: pfx + 'k' + gi });
    });
  }
  function takeAway(s, g, delay) {   // lift a group off the plate and fade it out
    if (!g) return;
    s.move(g, g._x, g._y - 50, 700, { delay: delay });
    s.hide(g, { delay: delay + 300, ms: 400 });
  }
  function both(s, y, t, delay) {   // the same operation written on both sides
    s.text(180, y, t, { size: 26, weight: 700, colour: RED, enter: 'pop', delay: delay });
    s.text(460, y, t, { size: 26, weight: 700, colour: RED, enter: 'pop', delay: delay });
  }
  /* a line of working with the = sign lined up at x = 300, and an optional note on the right */
  function row(s, y, left, right, o) {
    o = o || {};
    var c = o.colour || s.C.ink, sz = o.size || 32;
    s.text(282, y, left, { size: sz, weight: 700, colour: c, anchor: 'end', delay: o.delay || 0, name: o.name && o.name + 'l' });
    s.text(300, y, '=', { size: sz, weight: 700, colour: c, delay: o.delay || 0, name: o.name && o.name + 'e' });
    s.text(318, y, right, { size: sz, weight: 700, colour: c, anchor: 'start', delay: o.delay || 0, name: o.name && o.name + 'r' });
    if (o.note) s.text(470, y, o.note, { size: 22, weight: 700, colour: RED, anchor: 'start', delay: (o.delay || 0) - 300 });
  }

  /* Fredoka's × looks a lot like the letter x, so every × in s.text is drawn in a plainer font. */
  function timesFix(map) {
    Object.keys(map).forEach(function (k) {
      var f = map[k];
      map[k] = function (s) {
        if (!s._timesFix) {
          var t = s.text;
          s.text = function (x, y, txt, o) { return t(x, y, String(txt).replace(/×/g, '<tspan font-family="Arial, Helvetica, sans-serif" font-weight="700">×</tspan>'), o); };
          s._timesFix = true;
        }
        return f(s);
      };
    });
    return map;
  }

  Theory.scenes(timesFix({
    /* ---------- 1. What is an equation? ---------- */
    'eq-intro': function (s) {
      s.text(320, 40, 'An equation: two things are equal', { size: 28, weight: 700, colour: s.C.fun });
      s.text(320, 150, '<tspan fill="#6C4DF6">x</tspan> + 7 = 12', { size: 64, weight: 700, enter: 'pop', delay: 300, name: 'big' });
      s.arrow(215, 240, 50, 'u', { colour: s.C.fun, width: 7, delay: 1100, name: 'm1' });
      s.text(215, 270, 'mystery number', { size: 22, colour: s.C.fun, delay: 1300, name: 'm2' });
      s.owl(540, 340, 100, { delay: 1600, name: 'owl' });
    },
    'balance': function (s) {
      ['big', 'm1', 'm2', 'owl'].forEach(function (n) { s.hide(s.ref[n]); });
      s.text(320, 90, 'x + 7 = 12', { size: 40, weight: 700, colour: s.C.deep, delay: 300 });
      balance(s, { delay: 300 });
      plate(s, 180, [1], [7], 'L', 700);
      plate(s, 460, [], [12], 'R', 1200);
      s.text(320, 150, 'level = both sides the same', { size: 20, colour: s.C.muted, delay: 2200, name: 'lv' });
    },
    'golden-rule': function (s) {
      s.hide(s.ref.lv);
      s.add(pill(470, '#FFF4D6', '#FFC93C'), { x: 320, y: 165, enter: 'pop' });
      s.text(320, 167, 'Do the same to both sides!', { size: 28, weight: 700, colour: s.C.orange, enter: 'pop' });
      s.owl(600, 150, 70, { delay: 500 });
    },

    /* ---------- 2. One-step equations ---------- */
    'take-7': function (s) {
      s.text(320, 40, 'x + 7 = 12', { size: 36, weight: 700, colour: s.C.deep });
      balance(s, { enter: 'fade' });
      plate(s, 180, [1], [7], 'L', 0);
      plate(s, 460, [], [5, 7], 'R', 0);
      both(s, 150, '− 7', 1100);
      takeAway(s, s.ref.Lk0, 1500);
      takeAway(s, s.ref.Rk1, 1500);
      s.move(s.ref.Rk0, 40.5, 0, 500, { delay: 2300 });
      answer(s, 320, 100, 150, 'x = 5', { delay: 2600, size: 30 });
    },
    'check-5': function (s) {
      s.text(320, 200, 'check: 5 + 7 = 12 ✓', { size: 28, weight: 700, colour: GREEN, enter: 'pop' });
    },
    'divide-4': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, '4x means 4 × x', { size: 30, weight: 700, colour: s.C.fun });
      row(s, 120, '4x', '28', { size: 40 });
      row(s, 200, '4x ÷ 4', '28 ÷ 4', { size: 32, delay: 1000, note: '÷ 4 both sides' });
      answer(s, 300, 285, 150, 'x = 7', { delay: 2000, size: 32 });
      s.text(510, 285, 'check: 4 × 7 = 28', { size: 22, colour: GREEN, delay: 2600 });
    },
    'inverse': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Opposites undo each other', { size: 30, weight: 700, colour: s.C.fun });
      [['+', '−', 0], ['×', '÷', 1]].forEach(function (p) {
        var x = 190 + p[2] * 260, d = p[2] * 700;
        s.add('<circle cx="-50" r="30" fill="#D6E6FF" stroke="#2F80ED" stroke-width="3"/><circle cx="50" r="30" fill="#FFE1EB" stroke="#E0437A" stroke-width="3"/>' +
              '<path d="M-14 -6 H14 M8 -12 L14 -6 L8 0 M14 6 H-14 M-8 0 L-14 6 L-8 12" stroke="#55526E" stroke-width="3" fill="none" stroke-linecap="round"/>', { x: x, y: 110, enter: 'pop', delay: d });
        s.text(x - 50, 112, p[0], { size: 36, weight: 700, colour: BLUE, enter: 'pop', delay: d });
        s.text(x + 50, 112, p[1], { size: 36, weight: 700, colour: '#E0437A', enter: 'pop', delay: d });
      });
      s.text(320, 200, 'x − 9 = 3  →  add 9  →  x = 12', { size: 26, weight: 700, delay: 1600 });
      s.text(320, 260, 'x ÷ 5 = 6  →  multiply by 5  →  x = 30', { size: 26, weight: 700, delay: 2600 });
      s.owl(590, 350, 70, { delay: 3200 });
    },

    /* ---------- 3. Two-step equations ---------- */
    'two-start': function (s) {
      s.text(320, 40, '3x + 2 = 14', { size: 36, weight: 700, colour: s.C.deep });
      balance(s, { delay: 200 });
      plate(s, 180, [3], [2], 'L', 500);
      plate(s, 460, [], [12, 2], 'R', 900);
    },
    'two-step-1': function (s) {
      both(s, 150, '− 2', 0);
      takeAway(s, s.ref.Lk0, 400);
      takeAway(s, s.ref.Rk1, 400);
      s.text(320, 95, '3x = 12', { size: 32, weight: 700, colour: s.C.fun, enter: 'pop', delay: 1400, name: 'e2' });
    },
    'two-step-2': function (s) {
      s.hide(s.ref.Rk0, { ms: 300 });
      var m = '';
      for (var g = 0; g < 3; g++) for (var j = 0; j < 4; j++) m += block(375 + g * 60 + (j % 2) * 27, 241 + Math.floor(j / 2) * 27);
      s.add(m, { enter: 'pop', delay: 400 });
      s.add('<path d="M160 230 V290 M200 230 V290 M430 230 V290 M490 230 V290" stroke="#55526E" stroke-width="3" stroke-dasharray="6 6"/>', { enter: 'fade', delay: 1000 });
      both(s, 200, '÷ 3', 1300);
      answer(s, 320, 200, 150, 'x = 4', { delay: 2000, size: 30 });
      s.text(530, 95, '3 × 4 + 2 = 14 ✓', { size: 20, weight: 700, colour: GREEN, delay: 2800 });
    },
    'two-step-neg': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Negative answers are fine', { size: 30, weight: 700, colour: s.C.fun });
      row(s, 110, '2x + 9', '3', { size: 36 });
      row(s, 180, '2x', '−6', { size: 36, delay: 1000, note: '− 9' });
      answer(s, 300, 260, 160, 'x = −3', { delay: 2000, size: 32 });
      s.text(470, 260, '÷ 2', { size: 22, weight: 700, colour: RED, anchor: 'start', delay: 1700 });
      s.text(320, 330, 'check: 2 × (−3) + 9 = −6 + 9 = 3 ✓', { size: 22, colour: GREEN, delay: 2700 });
    },

    /* ---------- 4. Brackets and both sides ---------- */
    'bracket-eq': function (s) {
      s.text(320, 36, 'Way 1: divide first', { size: 28, weight: 700, colour: s.C.fun });
      row(s, 105, '3(x − 2)', '18', { size: 36 });
      row(s, 180, 'x − 2', '6', { size: 36, delay: 1100, note: '÷ 3' });
      answer(s, 300, 265, 150, 'x = 8', { delay: 2200, size: 32 });
      s.text(470, 265, '+ 2', { size: 22, weight: 700, colour: RED, anchor: 'start', delay: 1900 });
    },
    'bracket-expand': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Way 2: expand first', { size: 28, weight: 700, colour: s.C.fun });
      row(s, 100, '3(x − 2)', '18', { size: 32 });
      row(s, 160, '3x − 6', '18', { size: 32, delay: 900, note: 'expand' });
      row(s, 220, '3x', '24', { size: 32, delay: 1800, note: '+ 6' });
      answer(s, 300, 295, 150, 'x = 8', { delay: 2800, size: 32 });
      s.text(470, 295, '÷ 3', { size: 22, weight: 700, colour: RED, anchor: 'start', delay: 2500 });
      s.text(110, 295, 'Same answer!', { size: 24, weight: 700, colour: s.C.orange, delay: 3300 });
    },
    'both-sides': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, '5x + 3 = 2x + 15', { size: 34, weight: 700, colour: s.C.deep });
      balance(s, { delay: 100 });
      plate(s, 180, [3, 2], [3], 'L', 300);
      plate(s, 460, [2], [3, 12], 'R', 600);
      both(s, 140, '− 2x', 1700);
      takeAway(s, s.ref.Lb1, 2100);
      takeAway(s, s.ref.Rb0, 2100);
      s.move(s.ref.Rk0, 0, 40, 600, { delay: 2900 });
      s.move(s.ref.Rk1, 0, 40, 600, { delay: 2900 });
      s.text(320, 90, '3x + 3 = 15', { size: 30, weight: 700, colour: s.C.fun, enter: 'pop', delay: 3300 });
    },
    'both-sides-2': function (s) {
      both(s, 185, '− 3', 0);
      takeAway(s, s.ref.Lk0, 400);
      takeAway(s, s.ref.Rk0, 400);
      s.text(320, 140, '3x = 12', { size: 30, weight: 700, colour: s.C.fun, enter: 'pop', delay: 1300 });
      answer(s, 320, 200, 150, 'x = 4', { delay: 2000, size: 30 });
    },

    /* ---------- 5. Writing equations ---------- */
    'think-number': function (s) {
      s.text(320, 36, 'Think of a number…', { size: 30, weight: 700, colour: s.C.fun });
      var steps = [['n', s.C.fun], ['× 3', BLUE], ['− 5', '#E0437A'], ['16', GREEN]];
      steps.forEach(function (st, i) {
        var x = 110 + i * 140, d = i * 700;
        s.add('<rect x="-48" y="-30" width="96" height="60" rx="14" fill="#FFFFFF" stroke="' + st[1] + '" stroke-width="4"/>', { x: x, y: 115, enter: 'pop', delay: d });
        s.text(x, 117, st[0], { size: 32, weight: 700, colour: st[1], enter: 'pop', delay: d });
        if (i < 3) s.arrow(x + 52, 115, 36, 'r', { colour: s.C.grey, width: 6, delay: d + 400 });
      });
      s.owl(585, 340, 80, { delay: 2400 });
      s.add('<circle cx="-30" cy="0" r="6" fill="#fff" stroke="#9AA0B4" stroke-width="2"/><circle cx="-14" cy="-16" r="9" fill="#fff" stroke="#9AA0B4" stroke-width="2"/>' +
            '<ellipse cx="18" cy="-46" rx="30" ry="24" fill="#fff" stroke="#9AA0B4" stroke-width="2"/>' +
            '<text x="18" y="-44" font-family="Fredoka, sans-serif" font-size="30" font-weight="700" fill="#6C4DF6" text-anchor="middle" dominant-baseline="middle">?</text>', { x: 550, y: 255, enter: 'pop', delay: 2900 });
    },
    'think-solve': function (s) {
      row(s, 200, '3n − 5', '16', { size: 32 });
      row(s, 250, '3n', '21', { size: 32, delay: 900, note: '+ 5' });
      s.text(470, 312, '÷ 3', { size: 22, weight: 700, colour: RED, anchor: 'start', delay: 1600 });
      answer(s, 300, 310, 140, 'n = 7', { delay: 1900, size: 30 });
    },
    'triangle': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Angles in a triangle add up to 180°', { size: 26, weight: 700, colour: s.C.fun });
      // right angle at A (90, 310); B (350, 310) has 30°; C (90, 160) has 60°. AC = AB × tan 30° = 260 × 0.577 = 150
      s.add('<path d="M90 310 L350 310 L90 160 Z" fill="#F1ECFF" stroke="#6C4DF6" stroke-width="4" stroke-linejoin="round"/>' +
            '<path d="M90 290 H110 V310" fill="none" stroke="#6C4DF6" stroke-width="3"/>', { enter: 'pop', delay: 200 });
      s.text(130, 285, '3x', { size: 24, weight: 700, colour: s.C.deep, delay: 700, name: 'a1' });
      s.text(288, 296, 'x', { size: 24, weight: 700, colour: s.C.deep, delay: 900, name: 'a2' });
      s.text(110, 210, '2x', { size: 24, weight: 700, colour: s.C.deep, delay: 1100, name: 'a3' });
      s.text(505, 110, 'x + 2x + 3x = 180', { size: 24, weight: 700, delay: 1500, name: 'w1' });
      s.text(505, 160, '6x = 180', { size: 26, weight: 700, delay: 2200, name: 'w2' });
      s.text(505, 210, 'x = 180 ÷ 6', { size: 26, weight: 700, delay: 2800, name: 'w3' });
      answer(s, 505, 275, 150, 'x = 30', { delay: 3400, size: 30, name: 'w4' });
    },
    'triangle-check': function (s) {
      ['a1', 'a2', 'a3', 'w1', 'w2', 'w3'].forEach(function (n) { s.hide(s.ref[n]); });
      s.text(130, 285, '90°', { size: 24, weight: 700, colour: GREEN, enter: 'pop', delay: 300 });
      s.text(285, 296, '30°', { size: 22, weight: 700, colour: GREEN, enter: 'pop', delay: 500 });
      s.text(112, 210, '60°', { size: 24, weight: 700, colour: GREEN, enter: 'pop', delay: 700 });
      s.text(505, 120, '30 + 60 + 90', { size: 26, weight: 700, delay: 1200 });
      s.text(505, 170, '= 180 ✓', { size: 28, weight: 700, colour: GREEN, delay: 1800 });
      s.owl(600, 355, 60, { delay: 2300 });
    }
  }));
})();
