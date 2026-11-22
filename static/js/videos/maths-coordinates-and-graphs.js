/* Pictures for the Coordinates and graphs theory video (words: videos/maths/coordinates-and-graphs.json). Stage is 640 x 360; see static/js/theory.js.
   Every grid is drawn to scale: the same number of units per square on both axes (except the real-life graph, which has its own scales). */
(function () {
  if (!window.Theory) return;

  var GREEN = '#22A06B', BLUE = '#2F80ED', PINK = '#E0437A', ORANGE = '#FF8A3D', PURPLE = '#6C4DF6';
  var FONT = 'font-family="Fredoka, Trebuchet MS, sans-serif"';

  /* g = {ox, oy: pixel of the origin; u: pixels per unit; x0, x1, y0, y1: the range; every: label step}. Returns P(x, y) -> [px, py] */
  function grid(s, g, o) {
    o = o || {};
    var m = '', ev = g.every || 1, P = function (x, y) { return [g.ox + x * g.u, g.oy - y * g.u]; };
    for (var x = g.x0; x <= g.x1; x++) m += '<path d="M' + P(x, 0)[0] + ' ' + P(0, g.y0)[1] + ' V' + P(0, g.y1)[1] + '" stroke="#E4DEF5" stroke-width="2"/>';
    for (var y = g.y0; y <= g.y1; y++) m += '<path d="M' + P(g.x0, 0)[0] + ' ' + P(0, y)[1] + ' H' + P(g.x1, 0)[0] + '" stroke="#E4DEF5" stroke-width="2"/>';
    var L = P(g.x0, 0), R = P(g.x1, 0), B = P(0, g.y0), T = P(0, g.y1);
    m += '<path d="M' + L[0] + ' ' + L[1] + ' H' + (R[0] + 14) + ' M' + B[0] + ' ' + B[1] + ' V' + (T[1] - 14) + '" stroke="#1E1B3A" stroke-width="3"/>' +
         '<path d="M' + (R[0] + 16) + ' ' + R[1] + ' l-10 -6 v12 Z M' + T[0] + ' ' + (T[1] - 16) + ' l-6 10 h12 Z" fill="#1E1B3A"/>';
    function lab(px, py, t, anchor) {
      return '<text x="' + px + '" y="' + py + '" ' + FONT + ' font-size="18" font-weight="600" fill="#55526E" text-anchor="' + anchor + '" dominant-baseline="middle" stroke="#FFFDF7" stroke-width="4" paint-order="stroke">' + t + '</text>';
    }
    function num(n) { return n < 0 ? '−' + (-n) : String(n); }
    for (x = g.x0; x <= g.x1; x++) if (x && x % ev === 0) m += lab(P(x, 0)[0], g.oy + 18, num(x), 'middle');
    for (y = g.y0; y <= g.y1; y++) if (y && y % ev === 0) m += lab(g.ox - 9, P(0, y)[1], num(y), 'end');
    if (g.x0 >= 0) m += lab(g.ox - 9, g.oy + 16, '0', 'end');
    m += '<text x="' + (R[0] + 22) + '" y="' + (R[1] - 16) + '" ' + FONT + ' font-size="22" font-weight="700" fill="#1E1B3A" text-anchor="middle">x</text>' +
         '<text x="' + (T[0] + 18) + '" y="' + (T[1] - 10) + '" ' + FONT + ' font-size="22" font-weight="700" fill="#1E1B3A" text-anchor="middle">y</text>';
    s.add(m, { enter: o.enter || 'fade', delay: o.delay || 0, name: o.name });
    return P;
  }
  function at(g) { return function (x, y) { return [g.ox + x * g.u, g.oy - y * g.u]; }; }
  function point(s, p, label, o) {   // a dot at pixel p with a label; o.dx/o.dy move the label
    o = o || {};
    var c = o.colour || PURPLE;
    s.add('<circle r="8" fill="' + c + '" stroke="#fff" stroke-width="3"/>', { x: p[0], y: p[1], enter: 'pop', delay: o.delay || 0, name: o.name });
    if (label) s.text(p[0] + (o.dx === undefined ? 12 : o.dx), p[1] + (o.dy === undefined ? -18 : o.dy), label,
      { size: o.size || 22, weight: 700, colour: c, anchor: o.anchor || 'start', delay: (o.delay || 0) + 150, name: o.name && o.name + 't' });
  }
  function path(s, pts, c, o) {   // a polyline through pixel points
    o = o || {};
    var d = pts.map(function (p, i) { return (i ? 'L' : 'M') + p[0] + ' ' + p[1]; }).join(' ');
    return s.add('<path d="' + d + '" fill="none" stroke="' + c + '" stroke-width="' + (o.width || 4) + '" stroke-linecap="round" stroke-linejoin="round"' +
      (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>', { enter: o.enter || 'fade', delay: o.delay || 0, ms: o.ms || 600, name: o.name });
  }
  function panel(s, x, y, t, o) {
    o = o || {};
    return s.text(x, y, t, Object.assign({ size: 22, weight: 700, colour: s.C.ink }, o));
  }

  var G1 = { ox: 80, oy: 310, u: 40, x0: 0, x1: 6, y0: 0, y1: 6 };
  var G2 = { ox: 190, oy: 185, u: 34, x0: -4, x1: 4, y0: -4, y1: 4 };
  var G3 = { ox: 60, oy: 320, u: 26, x0: 0, x1: 10, y0: 0, y1: 10, every: 2 };
  var G3b = { ox: 70, oy: 315, u: 46, x0: 0, x1: 5, y0: 0, y1: 5 };
  var G4 = { ox: 380, oy: 330, u: 28, x0: 0, x1: 4, y0: 0, y1: 9 };

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
    /* ---------- 1. Reading coordinates ---------- */
    'grid-intro': function (s) {
      grid(s, G1);
      s.add('<circle r="14" fill="none" stroke="#FF8A3D" stroke-width="4"/>', { x: G1.ox, y: G1.oy, enter: 'pop', delay: 1800 });
      panel(s, 490, 90, 'x-axis: across', { colour: BLUE, delay: 600, name: 'r1' });
      panel(s, 490, 140, 'y-axis: up', { colour: PINK, delay: 1100, name: 'r2' });
      panel(s, 490, 190, 'origin = (0, 0)', { colour: ORANGE, delay: 1800, name: 'r3' });
    },
    'walk-23': function (s) {
      var P = at(G1);
      ['r1', 'r2', 'r3'].forEach(function (n) { s.hide(s.ref[n]); });
      var owl = s.owl(P(0, 0)[0], P(0, 0)[1], 56, { delay: 0 });
      s.move(owl, P(2, 0)[0], P(2, 0)[1], 1200, { delay: 500 });
      s.arrow(P(0, 0)[0], P(0, 0)[1], 2 * G1.u, 'r', { colour: ORANGE, width: 8, delay: 500 });
      s.move(owl, P(2, 3)[0], P(2, 3)[1], 1400, { delay: 1900 });
      s.arrow(P(2, 0)[0], P(2, 0)[1], 3 * G1.u, 'u', { colour: ORANGE, width: 8, delay: 1900 });
      s.anim(owl, [{ opacity: 1 }, { opacity: 0 }], 400, { delay: 3500 });
      point(s, P(2, 3), '(2, 3)', { colour: ORANGE, delay: 3400 });
      panel(s, 490, 100, 'along 2 first', { colour: ORANGE, delay: 800 });
      panel(s, 490, 145, 'then up 3', { colour: ORANGE, delay: 2200 });
      panel(s, 490, 200, '(2, 3)', { size: 34, colour: ORANGE, enter: 'pop', delay: 3400 });
    },
    'swap-32': function (s) {
      var P = at(G1);
      path(s, [P(0, 0), P(3, 0), P(3, 2)], BLUE, { dash: '8 7', delay: 200 });
      point(s, P(3, 2), '(3, 2)', { colour: BLUE, delay: 900 });
      panel(s, 490, 260, '(3, 2) is different!', { colour: BLUE, delay: 1300 });
    },

    /* ---------- 2. Four quadrants ---------- */
    'four-quadrants': function (s) {
      s.add('<rect x="' + (G2.ox - 4 * G2.u) + '" y="' + G2.oy + '" width="' + (4 * G2.u) + '" height="' + (4 * G2.u) + '" fill="#FFF1E6"/>' +
            '<rect x="' + (G2.ox - 4 * G2.u) + '" y="' + (G2.oy - 4 * G2.u) + '" width="' + (4 * G2.u) + '" height="' + (4 * G2.u) + '" fill="#FFF8EC"/>' +
            '<rect x="' + G2.ox + '" y="' + G2.oy + '" width="' + (4 * G2.u) + '" height="' + (4 * G2.u) + '" fill="#FFF8EC"/>', { enter: 'fade' });
      grid(s, G2, { enter: 'none' });
      panel(s, 500, 80, '← left: x is negative', { colour: PINK, delay: 700 });
      panel(s, 500, 125, '↓ below: y is negative', { colour: PINK, delay: 1500 });
    },
    'point-p': function (s) {
      var P = at(G2);
      path(s, [P(0, 0), P(-3, 0), P(-3, 2)], ORANGE, { dash: '8 7', width: 5 });
      point(s, P(-3, 2), 'P', { colour: ORANGE, delay: 800, dx: 0, dy: -24, anchor: 'middle' });
      panel(s, 500, 200, 'P = (−3, 2)', { size: 30, colour: ORANGE, enter: 'pop', delay: 1100 });
    },
    'point-q': function (s) {
      var P = at(G2);
      path(s, [P(0, 0), P(2, 0), P(2, -3)], BLUE, { dash: '8 7', width: 5 });
      point(s, P(2, -3), 'Q', { colour: BLUE, delay: 800, dx: 20, dy: 0 });
      panel(s, 500, 260, 'Q = (2, −3)', { size: 30, colour: BLUE, enter: 'pop', delay: 1100 });
      s.owl(560, 355, 60, { delay: 1600 });
    },

    /* ---------- 3. Midpoints and shapes ---------- */
    'mid-points': function (s) {
      var P = grid(s, G3);
      path(s, [P(2, 4), P(8, 10)], PURPLE, { delay: 600 });
      point(s, P(2, 4), 'A', { delay: 300, dx: 14, dy: 10 });
      point(s, P(8, 10), 'B', { delay: 500, dx: -16, dy: 4, anchor: 'end' });
      panel(s, 420, 80, 'A (2, 4)', { colour: PURPLE, delay: 900 });
      panel(s, 545, 80, 'B (8, 10)', { colour: PURPLE, delay: 1100 });
    },
    'mid-answer': function (s) {
      var P = at(G3);
      path(s, [P(5, 0), P(5, 7), P(0, 7)], GREEN, { dash: '6 6', width: 3, delay: 1600 });
      point(s, P(5, 7), 'M', { colour: GREEN, delay: 2200, dx: 14, dy: 12 });
      panel(s, 480, 135, 'x: halfway from 2 to 8 is 5', { size: 20, colour: s.C.ink, delay: 300, name: 'h1' });
      panel(s, 480, 175, 'y: halfway from 4 to 10 is 7', { size: 20, colour: s.C.ink, delay: 1000, name: 'h2' });
      panel(s, 480, 235, 'M = (5, 7)', { size: 34, colour: GREEN, enter: 'pop', delay: 2200 });
    },
    'mid-rule': function (s) {
      s.hide(s.ref.h1); s.hide(s.ref.h2);
      panel(s, 480, 135, '(2 + 8) ÷ 2 = 5', { size: 24, colour: BLUE, delay: 300 });
      panel(s, 480, 175, '(4 + 10) ÷ 2 = 7', { size: 24, colour: PINK, delay: 1000 });
      panel(s, 480, 300, 'add and halve!', { size: 24, colour: s.C.orange, delay: 1600 });
    },
    'square-corner': function (s) {
      s.clear(); s.ref = {};
      var P = grid(s, G3b);
      point(s, P(1, 1), '(1, 1)', { delay: 300, dx: 12, dy: 22 });
      point(s, P(4, 1), '(4, 1)', { delay: 600, dx: 12, dy: -20 });
      point(s, P(4, 4), '(4, 4)', { delay: 900, dx: 12, dy: -20 });
      path(s, [P(1, 1), P(4, 1), P(4, 4)], PURPLE, { delay: 1200 });
      path(s, [P(4, 4), P(1, 4), P(1, 1)], GREEN, { dash: '8 7', delay: 1900 });
      point(s, P(1, 4), '(1, 4)', { colour: GREEN, delay: 2500, dx: 12, dy: -20 });
      panel(s, 490, 120, 'sides are 3 long', { colour: PURPLE, delay: 1400 });
      panel(s, 490, 180, 'missing corner:', { colour: s.C.ink, delay: 2500 });
      panel(s, 490, 225, '(1, 4)', { size: 34, colour: GREEN, enter: 'pop', delay: 2700 });
      s.owl(560, 350, 70, { delay: 3000 });
    },

    /* ---------- 4. Straight-line graphs ---------- */
    'line-table': function (s) {
      grid(s, G4);
      panel(s, 180, 60, 'y = x + 1', { size: 32, colour: PURPLE, delay: 200, name: 't0' });
      var xs = [140, 200, 260, 320];
      s.add('<rect x="30" y="110" width="320" height="100" rx="12" fill="#FFFFFF" stroke="#C9BFF0" stroke-width="3"/><path d="M30 160 H350 M110 110 V210" stroke="#C9BFF0" stroke-width="3"/>', { enter: 'fade', delay: 400, name: 't1' });
      panel(s, 70, 135, 'x', { size: 24, colour: s.C.ink, delay: 400, name: 't2' });
      panel(s, 70, 185, 'y', { size: 24, colour: PURPLE, delay: 400, name: 't3' });
      xs.forEach(function (x, i) {
        panel(s, x, 135, String(i), { size: 24, colour: s.C.ink, delay: 800 + i * 500, name: 'tx' + i });
        panel(s, x, 185, String(i + 1), { size: 24, colour: PURPLE, delay: 1000 + i * 500, name: 'ty' + i });
      });
      panel(s, 190, 250, 'add 1 to x to get y', { size: 20, colour: s.C.muted, delay: 3000, name: 't4' });
    },
    'line-plot': function (s) {
      var P = at(G4);
      [0, 1, 2, 3].forEach(function (x) { point(s, P(x, x + 1), null, { delay: x * 400, name: 'lp' + x }); });
      path(s, [P(0, 1), P(4, 5)], PURPLE, { delay: 1800, ms: 900, name: 'l1' });
      panel(s, P(4, 5)[0] + 10, P(4, 5)[1], 'y = x + 1', { size: 20, colour: PURPLE, anchor: 'start', delay: 2400, name: 'l1t' });
    },
    'line-steeper': function (s) {
      var P = at(G4);
      ['t0', 't1', 't2', 't3', 't4', 'tx0', 'tx1', 'tx2', 'tx3', 'ty0', 'ty1', 'ty2', 'ty3'].forEach(function (n) { s.hide(s.ref[n]); });
      path(s, [P(0, 1), P(4, 9)], PINK, { delay: 300, ms: 900, name: 'l2' });
      panel(s, P(4, 9)[0] + 10, P(4, 9)[1], 'y = 2x + 1', { size: 20, colour: PINK, anchor: 'start', delay: 900, name: 'l2t' });
      path(s, [P(1, 3), P(2, 3), P(2, 5)], ORANGE, { width: 4, delay: 1400, name: 'st' });
      panel(s, P(1.5, 3)[0], P(0, 3)[1] + 16, '1', { size: 18, colour: ORANGE, delay: 1600, name: 'st1' });
      panel(s, P(2, 0)[0] + 6, P(0, 4)[1], '2', { size: 18, colour: ORANGE, anchor: 'start', delay: 1800, name: 'st2' });
      panel(s, 180, 70, 'y = mx + c', { size: 36, colour: s.C.deep, delay: 2200, name: 'k1' });
      panel(s, 180, 130, 'm = gradient (steepness)', { size: 22, colour: PINK, delay: 2800, name: 'k2' });
      panel(s, 180, 175, 'c = where it crosses the y-axis', { size: 20, colour: BLUE, delay: 3400, name: 'k3' });
      point(s, P(0, 1), null, { colour: BLUE, delay: 3400, name: 'cpt' });
      panel(s, 180, 240, 'y = 2x + 1: m = 2, c = 1', { size: 22, colour: s.C.ink, delay: 4000, name: 'k4' });
    },
    'line-flat': function (s) {
      var P = at(G4);
      ['l1', 'l1t', 'l2', 'l2t', 'st', 'st1', 'st2', 'k1', 'k2', 'k3', 'k4', 'lp0', 'lp1', 'lp2', 'lp3', 'cpt'].forEach(function (n) { s.hide(s.ref[n]); });
      path(s, [P(0, 4), P(4, 4)], GREEN, { width: 5, delay: 400 });
      panel(s, 180, 110, 'y = 4: horizontal', { size: 28, colour: GREEN, delay: 600 });
      panel(s, 180, 150, 'every point has y = 4', { size: 20, colour: s.C.muted, delay: 1000 });
      path(s, [P(2, 0), P(2, 9)], ORANGE, { width: 5, delay: 1800 });
      panel(s, 180, 220, 'x = 2: vertical', { size: 28, colour: ORANGE, delay: 2000 });
      panel(s, 180, 260, 'every point has x = 2', { size: 20, colour: s.C.muted, delay: 2400 });
    },

    /* ---------- 5. Real-life graphs (1 minute = 36 px across, 1 litre = 4 px up) ---------- */
    'tank-graph': function (s) {
      var ox = 110, oy = 300, m = '';
      for (var t = 0; t <= 12; t++) m += '<path d="M' + (ox + t * 36) + ' 60 V300" stroke="#E4DEF5" stroke-width="2"/>';
      for (var v = 0; v <= 60; v += 10) m += '<path d="M110 ' + (oy - v * 4) + ' H542" stroke="#E4DEF5" stroke-width="2"/>';
      m += '<path d="M110 300 H556 M110 300 V46" stroke="#1E1B3A" stroke-width="3"/>';
      for (t = 0; t <= 12; t += 2) m += '<text x="' + (ox + t * 36) + '" y="318" ' + FONT + ' font-size="18" font-weight="600" fill="#55526E" text-anchor="middle" dominant-baseline="middle">' + t + '</text>';
      for (v = 10; v <= 60; v += 10) m += '<text x="100" y="' + (oy - v * 4) + '" ' + FONT + ' font-size="18" font-weight="600" fill="#55526E" text-anchor="end" dominant-baseline="middle">' + v + '</text>';
      m += '<text x="326" y="344" ' + FONT + ' font-size="20" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle">time (minutes)</text>' +
           '<text x="20" y="30" ' + FONT + ' font-size="20" font-weight="700" fill="#1E1B3A" dominant-baseline="middle">water (litres)</text>';
      s.add(m, { enter: 'fade' });
      s.add('<rect x="0" y="0" width="80" height="90" rx="8" fill="#FFFFFF" stroke="#55526E" stroke-width="4"/><rect x="4" y="20" width="72" height="66" rx="5" fill="#8EC5FF"/>' +
            '<path d="M80 78 h18 v20" fill="none" stroke="#55526E" stroke-width="6"/><path d="M98 104 v12 M94 124 v8 M102 124 v8" stroke="#2F80ED" stroke-width="3" stroke-linecap="round"/>', { x: 520, y: 46, enter: 'pop', delay: 400 });
      s.text(420, 70, '60 litres', { size: 20, weight: 700, colour: BLUE, delay: 700 });
      s.text(420, 100, '− 5 each minute', { size: 20, weight: 700, colour: PINK, delay: 1000 });
      path(s, [[110, 60], [542, 300]], PURPLE, { width: 5, delay: 1400, ms: 1200 });
      s.add('<circle r="7" fill="#6C4DF6" stroke="#fff" stroke-width="3"/>', { x: 110, y: 60, enter: 'pop', delay: 1300 });
    },
    'tank-read': function (s) {
      var x8 = 110 + 8 * 36, y20 = 300 - 20 * 4;
      path(s, [[x8, 300], [x8, y20], [110, y20]], ORANGE, { dash: '8 6', width: 4, delay: 200 });
      s.add('<circle r="8" fill="#FF8A3D" stroke="#fff" stroke-width="3"/>', { x: x8, y: y20, enter: 'pop', delay: 1000 });
      s.text(x8 + 14, y20 - 30, '20 litres left', { size: 22, weight: 700, colour: '#C2570C', anchor: 'start', delay: 1300 });
      s.text(420, 150, '60 − 5 × 8 = 20', { size: 24, weight: 700, colour: s.C.ink, delay: 1700 });
    },
    'tank-empty': function (s) {
      s.add('<circle r="14" fill="none" stroke="#22A06B" stroke-width="4"/><circle r="7" fill="#22A06B"/>', { x: 542, y: 300, enter: 'pop', delay: 200 });
      s.text(630, 340, 'empty at 12 minutes', { size: 22, weight: 700, colour: GREEN, anchor: 'end', delay: 600 });
      s.owl(605, 290, 50, { delay: 1100 });
    }
  }));
})();
