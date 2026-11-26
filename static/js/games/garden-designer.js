/* Garden Designer: plots on a square grid where 1 square is 1 m by 1 m (an area of 1 m²).
   Rules used: perimeter of a rectangle = length + width + length + width = 2 × (length + width);
   area of a rectangle = length × width; a right-angled triangle cut corner to corner from a rectangle is half of it,
   so its area = length × width ÷ 2; a compound L-shape is split into two rectangles and the areas added;
   volume of a cuboid = length × width × height, counted in 1 cm cubes (1 cm³ each).
   Answers worked out by hand (length from 1 to 10, width from 1 to 7 on the plot grid):
   R1 fence 18 m: 1×8, 2×7, 3×6, 4×5 (either way round).  R2 turf 12 m²: 2×6, 3×4, 4×3, 6×2 (12×1 does not fit).
   R3 area 12 m² with less fence than 6 m × 2 m (16 m): only 4×3 or 3×4 (14 m).
   R4 4 m × 4 m needs 16 m of fence, 8 m × 2 m needs 20 m: the 8 m × 2 m plot needs more.
   R5 triangle 10 m² means a 20 m² rectangle: 4×5, 5×4 or 10×2.
   R6 L-shape: a 6 m × 5 m rectangle with a 3 m × 2 m corner missing: 6×3 + 3×2 = 18 + 6 = 24 m² (30 − 6 = 24).
   R7 18 cubes (length 1–6, width 1–4, height 1–4): e.g. 3×3×2, 3×2×3, 6×3×1, 6×1×3, 2×3×3.
   R8 pond 4 m × 3 m × 2 m = 24 m³. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var ROUNDS = [
    { kind: 'plot', show: 'fence', l: 1, w: 1, text: 'Farmer Fern has <b>18 m</b> of fence 🪵. Build a rectangular plot that uses <b>all</b> of it, then press <b>Check</b>.',
      owl: 'Each square on the grid is 1 m long. The fence goes all the way round the edge.',
      ok: function (s) { return 2 * (s.l + s.w) === 18; },
      diag: function (s) { var P = 2 * (s.l + s.w); return s.l * s.w === 18 ? 'Your plot has 18 squares <b>inside</b>: that is its area. The fence goes round the <b>outside</b>. Add all four sides.' :
        'Add all four sides: ' + s.l + ' + ' + s.w + ' + ' + s.l + ' + ' + s.w + ' = ' + P + ' m. You need 18 m. (Length + width must make 9.)'; },
      fix: { l: 5, w: 4 }, res: function (s) { return 'Fence: ' + s.l + ' + ' + s.w + ' + ' + s.l + ' + ' + s.w + ' = <b>' + 2 * (s.l + s.w) + ' m</b>'; },
      why: 'Perimeter is the distance all the way round: length + width + length + width. For 18 m, length + width must be 9, like 5 m and 4 m.' },
    { kind: 'plot', show: 'turf', l: 1, w: 1, text: 'You have <b>12</b> squares of turf 🌱, each 1 m². Build a lawn that uses <b>all 12</b>, then press <b>Check</b>.',
      owl: 'Area is the space inside. Each grid square is 1 square metre (1 m²).',
      ok: function (s) { return s.l * s.w === 12; },
      diag: function (s) { var A = s.l * s.w; return 2 * (s.l + s.w) === 12 ? 'You made the <b>fence</b> 12 m long. Area counts the squares <b>inside</b>: length × width.' :
        'Count the squares inside, or multiply length × width: ' + s.l + ' × ' + s.w + ' = ' + A + ' m². You need 12 m².'; },
      fix: { l: 4, w: 3 }, res: function (s) { return 'Turf: ' + s.l + ' × ' + s.w + ' = <b>' + s.l * s.w + ' m²</b>'; },
      why: 'Area of a rectangle = length × width. 4 × 3 = 12, 6 × 2 = 12 and 2 × 6 = 12 all use exactly 12 squares.' },
    { kind: 'plot', show: 'turf', old: [6, 2], l: 6, w: 2, text: 'The old plot (dotted) is 6 m × 2 m: area <b>12 m²</b> and <b>16 m</b> of fence. Build a plot with the <b>same area</b> but <b>less fence</b>.',
      owl: 'Same number of squares inside, shorter fence round the outside. Try different shapes!',
      ok: function (s) { return s.l * s.w === 12 && 2 * (s.l + s.w) < 16; },
      diag: function (s) { return s.l * s.w !== 12 ? 'Keep the area at 12 m²: length × width must make 12. Yours is ' + s.l + ' × ' + s.w + ' = ' + s.l * s.w + ' m².' :
        'Same area, but this fence is still ' + 2 * (s.l + s.w) + ' m. Try a shape closer to a square.'; },
      fix: { l: 4, w: 3 }, res: function (s) { return 'Turf: <b>' + s.l * s.w + ' m²</b> · Fence: <b>' + 2 * (s.l + s.w) + ' m</b>'; },
      why: 'A 4 m × 3 m plot still has an area of 12 m², but needs only 14 m of fence. Shapes closer to a square need less fence for the same area.' },
    { kind: 'two', q: 'Plot A is 4 m × 4 m. Plot B is 8 m × 2 m. Both have an area of 16 m². Which needs <b>more fence</b>?',
      owl: 'Same area does not always mean the same perimeter!',
      opts: ['Plot B (8 m × 2 m)', 'Plot A (4 m × 4 m)', 'The same: same area means the same fence'], ans: 0,
      hint: 'Work out each perimeter: add all four sides of A, then all four sides of B.',
      why: 'A needs 4 + 4 + 4 + 4 = 16 m of fence. B needs 8 + 2 + 8 + 2 = 20 m. Same area, different perimeter.' },
    { kind: 'plot', show: 'tri', l: 2, w: 2, text: 'A triangular flower bed 🌷 is cut corner to corner across your plot. Build a plot so the <b>triangle</b> has an area of <b>10 m²</b>.',
      owl: 'Look: two of these triangles fit together to make the whole rectangle.',
      ok: function (s) { return s.l * s.w === 20; },
      diag: function (s) { var A = s.l * s.w; return A === 10 ? 'The <b>rectangle</b> is 10 m², so the triangle is only half of that: 5 m². The rectangle needs to be twice as big.' :
        'The triangle is half the rectangle: ' + s.l + ' × ' + s.w + ' ÷ 2 = ' + String(A / 2) + ' m². You need 10 m², so the rectangle must be 20 m².'; },
      fix: { l: 5, w: 4 }, res: function (s) { return 'Triangle: ' + s.l + ' × ' + s.w + ' ÷ 2 = <b>' + String(s.l * s.w / 2) + ' m²</b>'; },
      why: 'A triangle cut corner to corner is half of its rectangle. 5 × 4 = 20 m², and half of 20 is 10 m².' },
    { kind: 'L', v: 0, text: 'How much turf 🌱 does this L-shaped lawn need? Set the area, then press <b>Check</b>.',
      owl: 'Tip: split the L into two rectangles. Find each area, then add them.',
      ok: function (s) { return s.v === 24; },
      diag: function (s) { return s.v === 30 ? '30 m² is the whole 6 m × 5 m rectangle. Take away the missing corner (3 m × 2 m).' :
        s.v === 22 ? '22 m is the <b>perimeter</b>: the distance round the edge. Area is the space inside.' :
        'Split the L into two rectangles: the bottom part is 6 m × 3 m. How tall is the top part? (5 m − 3 m.)'; },
      fix: { v: 24 }, res: function () { return 'Lawn: 18 + 6 = <b>24 m²</b>'; },
      why: 'Bottom part: 6 × 3 = 18 m². Top part: 3 × 2 = 6 m². Total: 18 + 6 = 24 m². (Or 6 × 5 − 3 × 2 = 30 − 6 = 24 m².)' },
    { kind: 'cube', l: 1, w: 1, h: 1, text: 'Build a model planter 🪴 from 1&nbsp;cm cubes. It must hold <b>exactly 18 cubes</b> of soil. Then press <b>Check</b>.',
      owl: 'Volume is the space inside a 3D shape. Each cube is 1 cm³.',
      ok: function (s) { return s.l * s.w * s.h === 18; },
      diag: function (s) { var V = s.l * s.w * s.h; return 'Don\'t just count the cubes you can see: some are hidden inside. Multiply length × width × height: ' +
        s.l + ' × ' + s.w + ' × ' + s.h + ' = ' + V + ' cm³. You need 18 cm³.'; },
      fix: { l: 3, w: 3, h: 2 }, res: function (s) { return 'Volume: ' + s.l + ' × ' + s.w + ' × ' + s.h + ' = <b>' + s.l * s.w * s.h + ' cm³</b>'; },
      why: 'Volume of a cuboid = length × width × height. For example 3 × 3 × 2 = 18 cm³: two layers of 9 cubes.' },
    { kind: 'pond', l: 4, w: 3, h: 2, q: 'A pond 🐟 is 4 m long, 3 m wide and 2 m deep. What is its volume?',
      owl: 'Picture the water as layers of 1 m cubes.',
      opts: ['24 m³', '9 m³', '24 m²', '18 m³'], ans: 0,
      hint: 'Multiply, don\'t add: length × width × depth. Volume is measured in cubic units (m³).',
      why: 'Each layer has 4 × 3 = 12 cubes, and there are 2 layers: 4 × 3 × 2 = 24 m³. Volume uses cubic units.' }
  ];

  var COLS = 10, ROWS = 7, C = 30, X0 = 40, Y0 = 232;
  var LIM = { plot: { l: 10, w: 7 }, cube: { l: 6, w: 4, h: 4 } };
  function f(v) { return (+v).toFixed(1); }
  function X(c) { return X0 + c * C; } function Y(r) { return Y0 - r * C; }
  function ln(x1, y1, x2, y2, cls) { return '<line x1="' + f(x1) + '" y1="' + f(y1) + '" x2="' + f(x2) + '" y2="' + f(y2) + '" class="' + cls + '"/>'; }
  function tx(x, y, t, cls, anc) { return '<text x="' + f(x) + '" y="' + f(y) + '" text-anchor="' + (anc || 'middle') + '" class="' + (cls || 'gdn-lab') + '">' + t + '</text>'; }

  function grid() {
    var s = '<rect x="' + X0 + '" y="' + Y(ROWS) + '" width="' + COLS * C + '" height="' + ROWS * C + '" class="gdn-bg"/>';
    for (var c = 0; c <= COLS; c++) s += ln(X(c), Y(ROWS), X(c), Y0, 'gdn-gl');
    for (var r = 0; r <= ROWS; r++) s += ln(X0, Y(r), X(COLS), Y(r), 'gdn-gl');
    return s;
  }
  function rectPlot(x, y, l, w, cls, lines) {
    var s = '<rect x="' + X(x) + '" y="' + Y(y + w) + '" width="' + l * C + '" height="' + w * C + '" class="' + cls + '"/>';
    if (lines) {
      for (var c = 1; c < l; c++) s += ln(X(x + c), Y(y + w), X(x + c), Y(y), 'gdn-tl');
      for (var r = 1; r < w; r++) s += ln(X(x), Y(y + r), X(x + l), Y(y + r), 'gdn-tl');
    }
    return s;
  }
  function posts(l, w) {
    var s = '';
    for (var c = 0; c <= l; c++) for (var r = 0; r <= w; r++) if (c === 0 || r === 0 || c === l || r === w) s += '<circle cx="' + X(c) + '" cy="' + Y(r) + '" r="4" class="gdn-post"/>';
    return s;
  }
  function sizes(l, w) { return tx(X(l / 2), Y0 + 24, l + ' m') + tx(X0 - 8, Y(w / 2) + 5, w + ' m', 'gdn-lab', 'end'); }

  /* isometric unit cubes: (x, y, z) -> screen; x runs down-right, y down-left, z up */
  function iso(l, w, hh, theme, unit) {
    var IC = Math.min(34, 215 / ((l + w) / 2 + hh), 290 / ((l + w) * 0.866)), IA = IC * Math.cos(Math.PI / 6), IB = IC / 2;
    var ox = 180 - (l - w) * IA / 2, oy = 128 - ((l + w) * IB - hh * IC) / 2;
    function P(x, y, z) { return [ox + (x - y) * IA, oy + (x + y) * IB - z * IC]; }
    function poly(pts, cls) { return '<polygon points="' + pts.map(function (p) { var q = P(p[0], p[1], p[2]); return f(q[0]) + ',' + f(q[1]); }).join(' ') + '" class="' + cls + '"/>'; }
    function L(a, b) { var p = P(a[0], a[1], a[2]), q = P(b[0], b[1], b[2]); return ln(p[0], p[1], q[0], q[1], 'gdn-cl'); }
    var s = poly([[0, 0, hh], [l, 0, hh], [l, w, hh], [0, w, hh]], 'gdn-top ' + theme) +
      poly([[l, 0, 0], [l, w, 0], [l, w, hh], [l, 0, hh]], 'gdn-right ' + theme) +
      poly([[0, w, 0], [l, w, 0], [l, w, hh], [0, w, hh]], 'gdn-left ' + theme), i;
    for (i = 1; i < l; i++) { s += L([i, 0, hh], [i, w, hh]) + L([i, w, 0], [i, w, hh]); }
    for (i = 1; i < w; i++) { s += L([0, i, hh], [l, i, hh]) + L([l, i, 0], [l, i, hh]); }
    for (i = 1; i < hh; i++) { s += L([0, w, i], [l, w, i]) + L([l, 0, i], [l, w, i]); }
    var a = P(l / 2, w, 0), b = P(l, w / 2, 0), c = P(0, w, hh / 2);
    s += tx(a[0] - 14, a[1] + 22, l + ' ' + unit, 'gdn-lab', 'end') + tx(b[0] + 14, b[1] + 22, w + ' ' + unit, 'gdn-lab', 'start') + tx(c[0] - 10, c[1] + 5, hh + ' ' + unit, 'gdn-lab', 'end');
    return s;
  }

  Arcade.game({
    intro: 'Welcome, garden designer! 🌻 Build plots on the grid to practise perimeter, area and volume.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], s = { l: R.l, w: R.w, h: R.h, v: R.v }, solved = false;
      var ctl = '';
      function row(k, name, unit) {
        return '<div class="gdn-ctrl"><span class="gdn-name">' + name + '</span><button class="btn ghost" type="button" data-k="' + k + '" data-d="-1" aria-label="' + name + ' down">−</button>' +
          '<b class="gdn-val" data-v="' + k + '"></b><button class="btn ghost" type="button" data-k="' + k + '" data-d="1" aria-label="' + name + ' up">+</button></div>';
      }
      if (R.kind === 'plot') ctl = row('l', 'Length') + row('w', 'Width');
      if (R.kind === 'cube') ctl = row('l', 'Length') + row('w', 'Width') + row('h', 'Height');
      if (R.kind === 'L') ctl = '<div class="gdn-step"><button class="btn ghost" type="button" data-s="-5">−5</button><button class="btn ghost" type="button" data-s="-1">−1</button>' +
        '<b class="gdn-val" data-v="v"></b><button class="btn ghost" type="button" data-s="1">+1</button><button class="btn ghost" type="button" data-s="5">+5</button></div>';
      stage.innerHTML = '<p class="q-num">Garden job ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="gdn-svg" viewBox="0 0 360 268" role="img"></svg><p class="gdn-out" aria-live="polite"></p>' +
        (R.opts ? '<div class="q-options"></div>' : ctl + '<p class="actions gdn-act"><button class="btn" type="button" data-check>Check ✓</button></p>');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.gdn-out');
      ui.owl(R.owl);

      function draw() {
        var g = '', label = '';
        if (R.kind === 'plot') {
          g = grid();
          if (R.old) g += rectPlot(0, 0, R.old[0], R.old[1], 'gdn-old');
          if (R.show === 'tri') {
            g += rectPlot(0, 0, s.l, s.w, 'gdn-turf', true) +
              '<polygon points="' + X(0) + ',' + Y(0) + ' ' + X(s.l) + ',' + Y(0) + ' ' + X(0) + ',' + Y(s.w) + '" class="gdn-bed"/>' +
              '<rect x="' + X(0) + '" y="' + Y(s.w) + '" width="' + s.l * C + '" height="' + s.w * C + '" class="gdn-edge"/>';
            if (s.l * s.w >= 4) g += tx(X(s.l / 3), Y(s.w / 3) + 8, '🌷', 'gdn-emo');
          } else {
            g += rectPlot(0, 0, s.l, s.w, 'gdn-turf', R.show === 'turf') + '<rect x="' + X(0) + '" y="' + Y(s.w) + '" width="' + s.l * C + '" height="' + s.w * C + '" class="gdn-fence"/>';
            if (R.show === 'fence') g += posts(s.l, s.w);
          }
          g += sizes(s.l, s.w);
          label = 'Plot ' + s.l + ' metres long and ' + s.w + ' metres wide on a square grid.' + (R.show === 'tri' ? ' A triangle is cut corner to corner across it.' : '') + (R.old ? ' The old plot, 6 by 2 metres, is dotted.' : '');
          out.innerHTML = solved ? R.res(s) : 'Length <b>' + s.l + ' m</b> · Width <b>' + s.w + ' m</b>';
        } else if (R.kind === 'two') {
          g = grid() + rectPlot(0, 0, 4, 4, 'gdn-turf', true) + '<rect x="' + X(0) + '" y="' + Y(4) + '" width="' + 4 * C + '" height="' + 4 * C + '" class="gdn-fence"/>' +
            rectPlot(0, 5, 8, 2, 'gdn-turf b', true) + '<rect x="' + X(0) + '" y="' + Y(7) + '" width="' + 8 * C + '" height="' + 2 * C + '" class="gdn-fence"/>' +
            tx(X(2), Y(2) + 9, 'A', 'gdn-big') + tx(X(4), Y(6) + 9, 'B', 'gdn-big') + tx(X(2), Y0 + 24, '4 m') + tx(X0 - 8, Y(2) + 5, '4 m', 'gdn-lab', 'end') +
            tx(X(8) + 8, Y(6) + 5, '2 m', 'gdn-lab', 'start') + tx(X(4), Y(5) + 20, '8 m');
          label = 'Plot A is a 4 by 4 metre square. Plot B is an 8 by 2 metre rectangle.';
        } else if (R.kind === 'L') {
          g = grid() + '<polygon points="' + [[0, 0], [6, 0], [6, 3], [3, 3], [3, 5], [0, 5]].map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' ') + '" class="gdn-turf gdn-lshape"/>';
          if (solved) g += ln(X(0), Y(3), X(3), Y(3), 'gdn-split') + tx(X(3), Y(1.5) + 6, '18 m²', 'gdn-in') + tx(X(1.5), Y(4) + 6, '6 m²', 'gdn-in');
          g += tx(X(3), Y0 + 24, '6 m') + tx(X0 - 8, Y(2.5) + 5, '5 m', 'gdn-lab', 'end') + tx(X(1.5), Y(5) - 9, '3 m') + tx(X(6) + 8, Y(1.5) + 5, '3 m', 'gdn-lab', 'start');
          label = 'An L-shaped lawn. Bottom edge 6 metres, left edge 5 metres, top edge 3 metres, right edge 3 metres.';
          stage.querySelector('[data-v="v"]').textContent = s.v + ' m²';
          out.innerHTML = solved ? R.res(s) : '';
        } else {
          var cube = R.kind === 'cube';
          g = iso(s.l, s.w, s.h, cube ? 'soil' : 'water', cube ? 'cm' : 'm');
          label = (cube ? 'Planter made of 1 centimetre cubes: ' : 'Pond made of 1 metre cubes: ') + s.l + ' long, ' + s.w + ' wide and ' + s.h + ' high.';
          if (cube) out.innerHTML = solved ? R.res(s) : 'Length <b>' + s.l + '</b> · Width <b>' + s.w + '</b> · Height <b>' + s.h + '</b> (cm)';
        }
        svg.innerHTML = g;
        svg.setAttribute('aria-label', label);
        ['l', 'w', 'h'].forEach(function (k) { var e = stage.querySelector('[data-v="' + k + '"]'); if (e) e.textContent = s[k] + (R.kind === 'cube' ? ' cm' : ' m'); });
      }

      function locked() { return stage.classList.contains('locked'); }
      stage.querySelectorAll('[data-k]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (locked()) return; var k = b.getAttribute('data-k'), lim = LIM[R.kind][k];
          s[k] = Math.max(1, Math.min(lim, s[k] + +b.getAttribute('data-d'))); draw();
        });
      });
      stage.querySelectorAll('[data-s]').forEach(function (b) {
        b.addEventListener('click', function () { if (locked()) return; s.v = Math.max(0, Math.min(60, s.v + +b.getAttribute('data-s'))); draw(); });
      });
      var chk = stage.querySelector('[data-check]');
      if (chk) chk.addEventListener('click', function () {
        if (locked()) return;
        var ok = R.ok(s);
        if (ok) solved = true;
        ui.check(ok, { hint: ok ? '' : R.diag(s), why: R.why, reveal: function () { for (var k in R.fix) s[k] = R.fix[k]; solved = true; } });
        draw();
      });
      if (R.opts) {
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
      draw();
    }
  });
})();
