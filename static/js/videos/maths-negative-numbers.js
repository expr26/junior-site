/* Pictures for the Negative numbers theory video (words: videos/maths/negative-numbers.json).
   Stage is 640 x 360; see static/js/theory.js. Number lines, the thermometer and the depth scale are drawn to scale. */
(function () {
  if (!window.Theory) return;

  var FONT = 'Fredoka, Trebuchet MS, sans-serif';
  function T(x, y, str, size, col, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + FONT + '" font-size="' + (size || 26) + '" font-weight="' + (weight || 600) +
      '" fill="' + (col || '#1E1B3A') + '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle"' + (col === '#FFFFFF' ? '' : ' stroke="#FFFDF7" stroke-width="4" paint-order="stroke"') + '>' + str + '</text>';
  }
  function n(v) { return v < 0 ? '−' + (-v) : String(v); }
  /* Number line from lo to hi: integer k sits at X(k) = x0 + (k - lo) * u. */
  function line(lo, hi, x0, u, opts) {
    opts = opts || {};
    var m = '<path d="M' + (x0 - 14) + ' 0 H' + (x0 + (hi - lo) * u + 14) + '" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/>';
    for (var k = lo; k <= hi; k++) {
      var x = x0 + (k - lo) * u, col = k < 0 ? '#2F80ED' : k > 0 ? '#FF8A3D' : '#1E1B3A';
      m += '<path d="M' + x + ' -9 V9" stroke="#1E1B3A" stroke-width="3"/>';
      if (!opts.every || k % opts.every === 0) m += T(x, 30, n(k), opts.size || 18, col, 700);
    }
    return m;
  }
  function hop(x1, x2, y, col, up) {   // one curved hop from x1 to x2, above the line at y
    var mid = (x1 + x2) / 2, h = Math.min(40, Math.abs(x2 - x1) * 0.6 + 10);
    return '<path d="M' + x1 + ' ' + (y - 6) + ' Q' + mid + ' ' + (y - 6 - h) + ' ' + x2 + ' ' + (y - 6) + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>' +
      '<circle cx="' + x2 + '" cy="' + (y - 6) + '" r="4" fill="' + col + '"/>';
  }
  function hops(s, from, count, dir, X, y, col, name, delay) {
    var names = [];
    for (var i = 0; i < count; i++) {
      var a = from + dir * i, b = a + dir;
      s.add(hop(X(a), X(b), y, col), { enter: 'fade', delay: (delay || 0) + i * 260, name: name + i });
      names.push(name + i);
    }
    return names;
  }
  function hideAll(s, names) { names.forEach(function (k) { s.hide(s.ref[k]); }); }
  var BALL = '<circle r="11" fill="#FF5D8F" stroke="#FFFFFF" stroke-width="3"/>';

  /* chapters 1 and 2 use the line from -10 to 6, 32 px per step, -10 at x = 64 */
  var LO = -10, X0 = 64, U = 32;
  function X(k) { return X0 + (k - LO) * U; }

  Theory.scenes({
    /* ---------- 1. Numbers below zero ---------- */
    'neg-thermo': function (s) {
      s.text(400, 40, 'Below zero', { size: 32, weight: 700, colour: s.C.blue });
      /* -10 at y 320 up to 10 at y 80: 12 px per degree, so -4 is at y 248 */
      var m = '<rect x="-16" y="60" width="32" height="270" rx="16" fill="#FFFFFF" stroke="#2D1B69" stroke-width="3"/>' +
        '<circle cx="0" cy="335" r="22" fill="#2F80ED" stroke="#2D1B69" stroke-width="3"/>';
      for (var d = -10; d <= 10; d++) m += '<path d="M16 ' + (200 - d * 12) + ' h' + (d % 5 ? 8 : 16) + '" stroke="#2D1B69" stroke-width="2"/>';
      [10, 5, 0, -5, -10].forEach(function (d) { m += T(-30, 200 - d * 12, n(d), 18, d < 0 ? '#2F80ED' : d > 0 ? '#FF8A3D' : '#1E1B3A', 700, 'end'); });
      m += '<path d="M-24 200 H40" stroke="#E5484D" stroke-width="2" stroke-dasharray="4 4"/>';
      s.add(m, { x: 130, y: 0, enter: 'fade' });
      var liquid = s.add('<rect x="-8" y="0" width="16" height="92" fill="#2F80ED"/>', { x: 130, y: 248, enter: 'none' });
      s.anim(liquid, [{ transform: 'scaleY(0.05)', transformOrigin: '50% 100%' }, { transform: 'scaleY(1)', transformOrigin: '50% 100%' }], 1400, { delay: 400 });
      s.arrow(250, 248, 70, 'l', { colour: s.C.pink, width: 7, delay: 1600 });
      s.text(270, 248, '−4 °C', { size: 34, weight: 700, colour: s.C.blue, anchor: 'start', delay: 1800 });
      s.text(270, 290, '4 degrees below zero', { size: 22, colour: s.C.muted, anchor: 'start', delay: 2200 });
      s.add('<g stroke="#2F80ED" stroke-width="4" stroke-linecap="round"><path d="M0 -22 V22 M-19 -11 L19 11 M-19 11 L19 -11"/></g>', { x: 560, y: 110, enter: 'pop', delay: 800 });
      s.owl(560, 352, 80, { delay: 500 });
    },
    'neg-line': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'The number line', { size: 32, weight: 700, colour: s.C.fun });
      s.add(line(-10, 6, X0, U), { y: 200, enter: 'fade' });
      s.add('<rect x="0" y="-6" width="' + (10 * U) + '" height="12" rx="6" fill="#2F80ED" opacity=".25"/>', { x: X0, y: 200, enter: 'left', delay: 600 });
      s.add('<rect x="0" y="-6" width="' + (6 * U) + '" height="12" rx="6" fill="#FF8A3D" opacity=".3"/>', { x: X(0), y: 200, enter: 'right', delay: 1000 });
      s.text(X(-5), 140, '← negative', { size: 24, weight: 700, colour: s.C.blue, delay: 700, name: 'negw' });
      s.text(X(3), 140, 'positive →', { size: 24, weight: 700, colour: s.C.orange, delay: 1100, name: 'posw' });
      s.text(X(0), 290, '0 is neither negative nor positive', { size: 20, colour: s.C.muted, delay: 1600, name: 'zw' });
    },
    'neg-order': function (s) {
      ['negw', 'posw', 'zw'].forEach(function (k) { s.hide(s.ref[k]); });
      s.add(BALL, { x: X(-8), y: 200, enter: 'pop', name: 'b8' });
      s.add(BALL, { x: X(-3), y: 200, enter: 'pop', delay: 400, name: 'b3' });
      s.text(X(-8), 150, 'colder', { size: 22, weight: 700, colour: s.C.blue, delay: 900, name: 'cw' });
      s.text(X(-3), 150, 'warmer', { size: 22, weight: 700, colour: s.C.orange, delay: 1100, name: 'ww' });
      s.text(320, 290, '−8 &lt; −3', { size: 40, weight: 700, colour: s.C.deep, enter: 'pop', delay: 1600, name: 'lt' });
    },
    'neg-diff': function (s) {
      hideAll(s, ['b8', 'cw', 'ww', 'lt']);
      s.add(BALL, { x: X(5), y: 200, enter: 'pop', delay: 200 });
      hops(s, -3, 3, 1, X, 200, s.C.blue, 'h', 500);
      hops(s, 0, 5, 1, X, 200, s.C.orange, 'k', 1400);
      s.text(X(-1.5), 136, '3', { size: 26, weight: 700, colour: s.C.blue, delay: 1200 });
      s.text(X(2.5), 136, '5', { size: 26, weight: 700, colour: s.C.orange, delay: 2600 });
      s.text(320, 292, '3 + 5 = 8 degrees warmer', { size: 30, weight: 700, colour: s.C.green, delay: 3000 });
    },

    /* ---------- 2. Adding and subtracting ---------- */
    'add-hop': function (s) {
      s.text(320, 36, 'Adding: move right', { size: 30, weight: 700, colour: s.C.green, name: 'title1' });
      s.add(line(-10, 6, X0, U), { y: 210, enter: 'fade' });
      s.add(BALL, { x: X(-2), y: 210, enter: 'pop', delay: 300, name: 'p1' });
      s.text(X(-2), 150, 'start', { size: 20, colour: s.C.muted, delay: 300, name: 's1' });
      var h = hops(s, -2, 6, 1, X, 210, s.C.green, 'a', 800);
      s.add(BALL, { x: X(4), y: 210, enter: 'pop', delay: 2500, name: 'p2' });
      s.text(320, 300, '−2 + 6 = 4', { size: 36, weight: 700, colour: s.C.green, enter: 'pop', delay: 2700, name: 'eq1' });
      s.ref.addHops = h;
      s.owl(590, 140, 70, { delay: 200 });
    },
    'sub-hop': function (s) {
      hideAll(s, ['title1', 'p1', 's1', 'p2', 'eq1'].concat(s.ref.addHops || []));
      s.text(320, 36, 'Subtracting: move left', { size: 30, weight: 700, colour: s.C.red, name: 'title2' });
      s.add(BALL, { x: X(3), y: 210, enter: 'pop', delay: 300, name: 'q1' });
      s.text(X(3), 150, 'start', { size: 20, colour: s.C.muted, delay: 300, name: 's2' });
      s.ref.subHops = hops(s, 3, 7, -1, X, 210, s.C.red, 'b', 800);
      s.add(BALL, { x: X(-4), y: 210, enter: 'pop', delay: 2700, name: 'q2' });
      s.text(320, 300, '3 − 7 = −4', { size: 36, weight: 700, colour: s.C.red, enter: 'pop', delay: 2900, name: 'eq2' });
    },
    'sub-hop-2': function (s) {
      hideAll(s, ['q1', 's2', 'eq2'].concat(s.ref.subHops || []));
      s.text(X(-4), 150, 'start', { size: 20, colour: s.C.muted, delay: 300 });
      hops(s, -4, 5, -1, X, 210, s.C.red, 'c', 800);
      s.add(BALL, { x: X(-9), y: 210, enter: 'pop', delay: 2200 });
      s.text(320, 300, '−4 − 5 = −9', { size: 36, weight: 700, colour: s.C.red, enter: 'pop', delay: 2400 });
    },

    /* ---------- 3. Two signs together ---------- */
    'sign-pattern': function (s) {
      s.text(320, 34, 'Spot the pattern', { size: 30, weight: 700, colour: s.C.fun });
      [['6 − 2', '4'], ['6 − 1', '5'], ['6 − 0', '6'], ['6 − (−1)', '?']].forEach(function (r, i) {
        var y = 90 + i * 62;
        s.text(300, y, r[0], { size: 34, weight: 700, anchor: 'end', delay: i * 500 });
        s.text(330, y, '=', { size: 34, weight: 700, colour: s.C.muted, delay: i * 500 });
        s.text(380, y, r[1], { size: 34, weight: 700, colour: i === 3 ? s.C.pink : s.C.blue, delay: i * 500 + 200, name: 'ans' + i });
        if (i > 0) s.text(450, y - 31, '+1', { size: 22, weight: 700, colour: s.C.green, delay: i * 500 + 300 });
      });
      s.owl(560, 345, 90, { delay: 600 });
    },
    'sign-pattern-end': function (s) {
      s.hide(s.ref.ans3);
      s.text(380, 276, '7', { size: 34, weight: 700, colour: s.C.green, enter: 'pop', delay: 300 });
      s.text(120, 276, '6 + 1', { size: 28, weight: 700, colour: s.C.green, delay: 900 });
      s.add('<rect x="-155" y="-22" width="310" height="44" rx="22" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' + T(0, 1, '− (−) is the same as +', 24, '#0E7A5A', 700), { x: 320, y: 334, enter: 'pop', delay: 1400 });
    },
    'minus-minus': function (s) {
      s.clear(); s.ref = {};
      s.text(170, 40, 'Subtract a negative', { size: 24, weight: 700, colour: s.C.green });
      s.text(170, 110, '6 <tspan fill="#FF5D8F">−</tspan> (<tspan fill="#FF5D8F">−</tspan>3)', { size: 38, weight: 700 });
      s.text(170, 70, 'two minus signs', { size: 18, weight: 700, colour: s.C.pink, delay: 500 });
      s.text(170, 180, '= 6 + 3', { size: 38, weight: 700, colour: s.C.blue, delay: 1100 });
      s.text(170, 250, '= 9', { size: 42, weight: 700, colour: s.C.green, enter: 'pop', delay: 1800 });
      s.owl(320, 352, 70, { delay: 2000 });
    },
    'plus-minus': function (s) {
      s.text(470, 40, 'Add a negative', { size: 24, weight: 700, colour: s.C.red });
      s.text(470, 110, '5 <tspan fill="#E5484D">+ (−</tspan>3)', { size: 38, weight: 700 });
      s.text(470, 180, '= 5 − 3', { size: 38, weight: 700, colour: s.C.blue, delay: 800 });
      s.text(470, 250, '= 2', { size: 42, weight: 700, colour: s.C.green, enter: 'pop', delay: 1500 });
      s.add('<path d="M0 30 V330" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { x: 320, y: 0, enter: 'fade' });
    },

    /* ---------- 4. Multiplying and dividing ---------- */
    'md-title': function (s) {
      s.text(320, 36, 'Multiplying and dividing', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 110, '−6 × 4', { size: 44, weight: 700 });
      s.text(200, 190, '1. the numbers', { size: 24, weight: 700, colour: s.C.blue, delay: 700 });
      s.text(200, 232, '6 × 4 = 24', { size: 30, weight: 700, delay: 1000 });
      s.text(450, 190, '2. the sign', { size: 24, weight: 700, colour: s.C.pink, delay: 1600 });
      s.text(450, 232, '+ or − ?', { size: 30, weight: 700, delay: 1900 });
      s.owl(320, 352, 70, { delay: 400 });
    },
    'md-rules': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect x="-140" y="-100" width="280" height="200" rx="20" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' +
        T(0, -70, 'Same signs', 26, '#0E7A5A', 700) + T(0, -25, 'positive answer', 22, '#0E7A5A', 600) +
        T(0, 25, '+  ×  +  =  +', 30, '#1E1B3A', 700) + T(0, 70, '−  ×  −  =  +', 30, '#1E1B3A', 700), { x: 170, y: 150, enter: 'pop' });
      s.add('<rect x="-140" y="-100" width="280" height="200" rx="20" fill="#FFF0E5" stroke="#FF8A3D" stroke-width="3"/>' +
        T(0, -70, 'Different signs', 26, '#C2570C', 700) + T(0, -25, 'negative answer', 22, '#C2570C', 600) +
        T(0, 25, '+  ×  −  =  −', 30, '#1E1B3A', 700) + T(0, 70, '−  ×  +  =  −', 30, '#1E1B3A', 700), { x: 470, y: 150, enter: 'pop', delay: 900 });
      s.text(320, 300, 'The same rules work for ÷', { size: 24, weight: 700, colour: s.C.deep, delay: 1800 });
    },
    'md-examples': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Check the signs', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 120, '−6 × 4 = −24', { size: 40, weight: 700 });
      s.add('<rect x="-70" y="-18" width="140" height="36" rx="18" fill="#FF8A3D"/>' + T(0, 1, 'different', 20, '#FFFFFF', 700), { x: 320, y: 170, enter: 'pop', delay: 600 });
      s.text(320, 240, '−20 ÷ −5 = 4', { size: 40, weight: 700, delay: 1200 });
      s.add('<rect x="-50" y="-18" width="100" height="36" rx="18" fill="#22A06B"/>' + T(0, 1, 'same', 20, '#FFFFFF', 700), { x: 320, y: 290, enter: 'pop', delay: 1800 });
    },
    'md-square': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M0 30 V330" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { x: 320, y: 0, enter: 'fade' });
      s.text(165, 50, 'Squaring', { size: 24, weight: 700, colour: s.C.fun });
      s.text(165, 120, '(−3)²', { size: 44, weight: 700 });
      s.text(165, 190, '= −3 × −3', { size: 34, weight: 700, colour: s.C.blue, delay: 700 });
      s.text(165, 260, '= 9', { size: 42, weight: 700, colour: s.C.green, enter: 'pop', delay: 1400 });
    },
    'md-three': function (s) {
      s.text(475, 50, 'Three numbers', { size: 24, weight: 700, colour: s.C.fun });
      s.text(475, 120, '−2 × −3 × −1', { size: 34, weight: 700 });
      s.add('<path d="M-110 0 Q-55 26 0 0" fill="none" stroke="#22A06B" stroke-width="4"/>', { x: 498, y: 145, enter: 'fade', delay: 500 });
      s.text(475, 190, '= 6 × −1', { size: 34, weight: 700, colour: s.C.blue, delay: 900 });
      s.text(475, 260, '= −6', { size: 42, weight: 700, colour: s.C.red, enter: 'pop', delay: 1600 });
      s.owl(320, 352, 60, { delay: 1900 });
    },

    /* ---------- 5. Real life ---------- */
    'life-diver': function (s) {
      /* sea level at y 80, 16 px per metre: -12 m at y 272, -7 m at y 192 */
      s.add('<rect x="0" y="80" width="640" height="280" fill="#CFE8FF"/><path d="M0 80 q20 -8 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0" fill="none" stroke="#2F80ED" stroke-width="4"/>', { enter: 'fade' });
      var m = '<path d="M0 80 V320" stroke="#2D1B69" stroke-width="3"/>';
      for (var d = 0; d <= 15; d++) m += '<path d="M0 ' + (80 + d * 16) + ' h' + (d % 5 ? -8 : -16) + '" stroke="#2D1B69" stroke-width="2"/>';
      [0, -5, -10, -15].forEach(function (d) { m += T(-22, 80 - d * 16, n(d) + ' m', 18, '#2D1B69', 700, 'end'); });
      s.add(m, { x: 110, enter: 'fade' });
      s.text(110, 50, 'sea level', { size: 20, weight: 700, colour: s.C.blue });
      var dv = s.add('<ellipse cx="0" cy="0" rx="30" ry="14" fill="#FF8A3D" stroke="#C2570C" stroke-width="3"/><circle cx="34" cy="-2" r="11" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/>' +
        '<rect x="26" y="-8" width="14" height="9" rx="3" fill="#CFE8FF" stroke="#1E1B3A" stroke-width="2"/><path d="M-30 0 l-18 -10 v20 Z" fill="#2F80ED"/>', { x: 200, y: 272, enter: 'pop', delay: 300 });
      s.add('<path d="M-8 0 H8" stroke="#FF5D8F" stroke-width="4"/>', { x: 110, y: 272, enter: 'fade', delay: 300 });
      s.move(dv, 200, 192, 1400, { delay: 1300 });
      s.arrow(265, 272, 80, 'u', { colour: s.C.green, label: 'up 5 m', delay: 1300, size: 20 });
      s.text(470, 150, '−12 + 5 = −7', { size: 34, weight: 700, colour: s.C.deep, delay: 2400 });
      s.text(470, 200, '7 m below sea level', { size: 22, weight: 700, colour: s.C.blue, delay: 2900 });
    },
    'life-bank': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'A bank balance', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<rect x="-120" y="-70" width="240" height="140" rx="18" fill="#2D1B69"/><rect x="-120" y="-40" width="240" height="22" fill="#6C4DF6"/>' +
        T(-90, 20, 'Balance', 20, '#FFFFFF', 600, 'start'), { x: 180, y: 160, enter: 'pop' });
      var a = s.add(T(0, 0, '£15', 40, '#22A06B', 700), { x: 235, y: 196, enter: 'fade', delay: 300 });
      s.text(470, 110, 'spend £22', { size: 28, weight: 700, colour: s.C.red, delay: 900 });
      s.hide(a, { delay: 1800 });
      s.add(T(0, 0, '−£7', 40, '#E5484D', 700), { x: 235, y: 196, enter: 'pop', delay: 2000 });
      s.text(470, 170, '15 − 22 = −7', { size: 32, weight: 700, delay: 2200 });
      s.text(320, 290, '−£7 means £7 is owed to the bank', { size: 24, weight: 700, colour: s.C.deep, delay: 2800 });
      s.owl(590, 352, 60, { delay: 1000 });
    },
    'life-halfway': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Halfway between −6 and 2', { size: 30, weight: 700, colour: s.C.fun });
      /* -6 at x 80, 2 at x 560: 60 px per step, so -2 is at x 320 */
      function Xh(k) { return 80 + (k + 6) * 60; }
      s.add(line(-6, 2, 80, 60, { size: 20 }), { y: 220, enter: 'fade' });
      s.add(BALL, { x: Xh(-6), y: 220, enter: 'pop', delay: 300 });
      s.add(BALL, { x: Xh(2), y: 220, enter: 'pop', delay: 300 });
      s.add('<path d="M80 110 V100 H560 V110" fill="none" stroke="#6C4DF6" stroke-width="3"/>', { enter: 'fade', delay: 800 });
      s.text(320, 80, 'gap = 8', { size: 24, weight: 700, colour: s.C.fun, delay: 900 });
      hops(s, -6, 4, 1, Xh, 220, s.C.green, 'l', 1500);
      hops(s, 2, 4, -1, Xh, 220, s.C.orange, 'r', 1500);
      s.add('<circle r="15" fill="#22A06B" stroke="#FFFFFF" stroke-width="3"/>', { x: Xh(-2), y: 220, enter: 'pop', delay: 2700 });
      s.text(320, 300, '−6 + 4 = −2', { size: 36, weight: 700, colour: s.C.green, enter: 'pop', delay: 2900 });
    }
  });
})();
