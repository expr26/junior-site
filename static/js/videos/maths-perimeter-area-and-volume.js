/* Pictures for the Perimeter, area and volume theory video (words: videos/maths/perimeter-area-and-volume.json).
   Stage is 640 x 360; see static/js/theory.js. Flat shapes are drawn to scale inside each picture
   (30 units = 1 cm, or 25 units = 1 cm for the L shape). The single 1 cm square and 1 cm cube are drawn bigger, and say so. */
(function () {
  if (!window.Theory) return;

  var F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  /* soft gradients: every id starts mCp and is numbered, so no two drawings on the page share one */
  var GN = 0;
  function mix(hex, t) {   // t > 0 lightens towards white, t < 0 darkens towards black
    var n = parseInt(hex.slice(1), 16), c = [n >> 16, n >> 8 & 255, n & 255], to = t < 0 ? 0 : 255, k = Math.abs(t);
    return '#' + c.map(function (v) { return ('0' + Math.round(v + (to - v) * k).toString(16)).slice(-2); }).join('');
  }
  function lg(a, b, x2, y2) {   // a linear gradient (top to bottom unless told), as { def, url }
    var id = 'mCp' + (++GN);
    return { def: '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="' + (x2 || 0) + '" y2="' + (y2 == null ? 1 : y2) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient></defs>', url: 'url(#' + id + ')' };
  }
  function disc(col) {   // a soft radial fill for circles: lighter in the middle
    var id = 'mCp' + (++GN);
    return { def: '<defs><radialGradient id="' + id + '" cx=".42" cy=".38" r=".7"><stop offset="0" stop-color="' + mix(col, .6) + '"/><stop offset="1" stop-color="' + mix(col, -.04) + '"/></radialGradient></defs>', url: 'url(#' + id + ')' };
  }
  function path(pts, fill, stroke, w, dash) {   // a closed shape; a plain colour fill becomes a soft top-lit gradient (corners unchanged)
    var g = /^#/.test(fill) ? lg(mix(fill, .45), mix(fill, -.06)) : null;
    return (g ? g.def : '') + '<path d="M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') + ' Z" fill="' + (g ? g.url : fill) + '" stroke="' + (stroke || '#1E1B3A') + '" stroke-width="' + (w || 4) +
      '" stroke-linejoin="round"' + (dash ? ' stroke-dasharray="9 7"' : '') + '/>';
  }
  function line(a, b, col, w, dash) {
    return '<path d="M' + a[0] + ' ' + a[1] + ' L' + b[0] + ' ' + b[1] + '" stroke="' + col + '" stroke-width="' + (w || 4) + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="8 7"' : '') + ' fill="none"/>';
  }
  function draw(s, g, ms, delay) {   // draw a stroked path (with pathLength="1") from start to end
    var p = g.querySelector('path');
    if (p.animate && !s.fast) p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: ms, delay: delay || 0, fill: 'both' });
    else p.setAttribute('stroke-dashoffset', '0');
  }
  function trace(pts, col, closed) {
    return '<path d="M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') + (closed ? ' Z' : '') + '" fill="none" stroke="' + col +
      '" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1" opacity=".85"/>';
  }
  function rightAngle(x, y, sx, sy) { return '<path d="M' + (x + 14 * sx) + ' ' + y + ' V' + (y + 14 * sy) + ' H' + x + '" fill="none" stroke="#1E1B3A" stroke-width="2.5"/>'; }
  /* an oblique cube: (x, y) is its front bottom left corner, side a */
  function cube(x, y, a, c) {
    var dx = a * 0.5, dy = a * 0.4, E = 'rgba(30,27,58,.6)', sd = lg(mix(c[2], .2), mix(c[2], -.12), 1, 0);
    return path([[x, y], [x + a, y], [x + a, y - a], [x, y - a]], c[0], E, 2) +
      path([[x, y - a], [x + dx, y - a - dy], [x + a + dx, y - a - dy], [x + a, y - a]], c[1], E, 2) +
      sd.def + '<path d="M' + [[x + a, y], [x + a + dx, y - dy], [x + a + dx, y - a - dy], [x + a, y - a]].map(function (p) { return p[0] + ' ' + p[1]; }).join(' L') +
      ' Z" fill="' + sd.url + '" stroke="' + E + '" stroke-width="2" stroke-linejoin="round"/>' +
      '<rect x="' + (x + a * 0.1) + '" y="' + (y - a * 0.9) + '" width="' + (a * 0.8) + '" height="' + Math.max(2, a * 0.07) + '" rx="' + Math.max(1, a * 0.035) + '" fill="#fff" opacity=".4"/>';
  }
  var BLUE = ['#6FA8F5', '#B8D6FF', '#3F7FD6'], GOLD = ['#FFC93C', '#FFE59A', '#E0A400'];
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }
  function title(s, t, col) { return s.text(320, 36, t, { size: 28, weight: 700, colour: col || s.C.fun }); }

  /* the 7 cm by 4 cm rectangle (30 units = 1 cm) */
  var RX = 80, RY = 110, RW = 210, RH = 120;
  /* the L shape: a 9 cm by 7 cm rectangle with a 4 cm by 3 cm corner missing (25 units = 1 cm) */
  function L(x, y) { return [100 + 25 * x, 300 - 25 * y]; }
  var LP = [L(0, 0), L(9, 0), L(9, 4), L(5, 4), L(5, 7), L(0, 7)];

  Theory.scenes({
    /* ---------- 1. Perimeter ---------- */
    'walk-round': function (s) {
      title(s, 'Perimeter: all the way round');
      var X = 215, Y = 110;
      s.add(path([[X, Y], [X + RW, Y], [X + RW, Y + RH], [X, Y + RH]], '#FFF4D6', '#1E1B3A', 4), { enter: 'pop' });
      var t = s.add(trace([[X, Y], [X + RW, Y], [X + RW, Y + RH], [X, Y + RH]], '#FF8A3D', true), { enter: 'none', flat: true });
      draw(s, t, 4000, 600);
      var owl = s.owl(X, Y + 4, 56, { delay: 200 });
      s.anim(owl, [{ transform: 'translate(0px,0px)' }, { transform: 'translate(' + RW + 'px,0px)', offset: 210 / 660 },
        { transform: 'translate(' + RW + 'px,' + RH + 'px)', offset: 330 / 660 }, { transform: 'translate(0px,' + RH + 'px)', offset: 540 / 660 },
        { transform: 'translate(0px,0px)' }], 4000, { delay: 600, easing: 'linear' });
    },
    'rect-perimeter': function (s) {
      var X = 215, Y = 110;
      s.text(X + RW / 2, Y - 20, '7 cm', { size: 22, weight: 700, colour: s.C.blue, delay: 100 });
      s.text(X + RW + 12, Y + RH / 2, '4 cm', { size: 22, weight: 700, colour: s.C.pink, anchor: 'start', delay: 500 });
      s.text(X + RW / 2, Y + RH + 22, '7 cm', { size: 22, weight: 700, colour: s.C.blue, delay: 900 });
      s.text(X - 12, Y + RH / 2, '4 cm', { size: 22, weight: 700, colour: s.C.pink, anchor: 'end', delay: 1300 });
      s.text(320, 310, '7 + 4 + 7 + 4 = 22 cm', { size: 32, weight: 700, colour: s.C.green, enter: 'pop', delay: 2000 });
    },
    'l-missing': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Perimeter of an L shape');
      s.add(path(LP, '#D6E6FF', '#1E1B3A', 4), { enter: 'pop' });
      s.text(212, 322, '9 cm', { size: 20, weight: 700, delay: 200 });
      s.text(88, 212, '7 cm', { size: 20, weight: 700, anchor: 'end', delay: 300 });
      s.text(290, 186, '4 cm', { size: 20, weight: 700, delay: 400 });
      s.text(235, 150, '3 cm', { size: 20, weight: 700, anchor: 'start', delay: 500 });
      s.text(162, 108, '?', { size: 26, weight: 700, colour: s.C.red, enter: 'pop', delay: 900, name: 'q1' });
      s.text(337, 250, '?', { size: 26, weight: 700, colour: s.C.red, anchor: 'start', enter: 'pop', delay: 900, name: 'q2' });
      s.text(490, 150, 'top: 9 − 4 = 5 cm', { size: 24, weight: 700, colour: s.C.fun, delay: 1600, name: 'w1' });
      s.text(490, 210, 'right: 7 − 3 = 4 cm', { size: 24, weight: 700, colour: s.C.fun, delay: 3000, name: 'w2' });
      s.hide(s.ref.q1, { delay: 2300 });
      s.text(162, 108, '5 cm', { size: 20, weight: 700, colour: s.C.fun, enter: 'pop', delay: 2400 });
      s.hide(s.ref.q2, { delay: 3700 });
      s.text(337, 250, '4 cm', { size: 20, weight: 700, colour: s.C.fun, anchor: 'start', enter: 'pop', delay: 3800 });
    },
    'l-perimeter': function (s) {
      hideAll(s, ['w1', 'w2']);
      var t = s.add(trace(LP, '#FF8A3D', true), { enter: 'none', flat: true });
      draw(s, t, 3000, 200);
      s.text(490, 160, '9 + 4 + 4 + 3 + 5 + 7', { size: 24, weight: 700, delay: 800 });
      s.text(490, 215, '= 32 cm', { size: 36, weight: 700, colour: s.C.green, enter: 'pop', delay: 3200 });
    },

    /* ---------- 2. Area of rectangles ---------- */
    'unit-square': function (s) {
      title(s, 'Area is counted in squares');
      var us = lg('#DCEBFF', '#A3C8FA');
      s.add(us.def + '<rect x="0" y="0" width="130" height="130" rx="4" fill="' + us.url + '" stroke="#1E1B3A" stroke-width="4"/><rect x="8" y="7" width="114" height="8" rx="4" fill="#fff" opacity=".55"/>' +
        '<text x="65" y="68" ' + F + ' font-size="34" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle">1 cm²</text>', { x: 255, y: 105, enter: 'pop', delay: 200 });
      s.text(320, 88, '1 cm', { size: 22, weight: 700, colour: s.C.blue, delay: 700 });
      s.text(397, 170, '1 cm', { size: 22, weight: 700, colour: s.C.blue, anchor: 'start', delay: 900 });
      s.text(320, 270, 'one square centimetre', { size: 22, weight: 700, colour: s.C.deep, delay: 1300 });
      s.text(320, 302, '(drawn bigger than real life)', { size: 18, colour: s.C.muted, delay: 1600 });
      s.owl(90, 345, 110, { delay: 400 });
    },
    'rect-area': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Area of a rectangle');
      for (var r = 0; r < 4; r++) for (var c = 0; c < 7; c++) {
        var sq = lg('#D6E8FF', '#A9CBFA');
        s.add(sq.def + '<rect x="0" y="0" width="30" height="30" fill="' + sq.url + '" stroke="#2F80ED" stroke-width="1.5"/><rect x="3" y="2.5" width="24" height="3" rx="1.5" fill="#fff" opacity=".5"/>', { x: RX + c * 30, y: RY + r * 30, enter: 'pop', delay: 200 + r * 450 + c * 50, flat: true });
      }
      s.add('<rect x="0" y="0" width="' + RW + '" height="' + RH + '" fill="none" stroke="#1E1B3A" stroke-width="4"/>', { x: RX, y: RY, enter: 'fade', delay: 200, flat: true });
      s.text(RX + RW / 2, RY - 18, '7 cm', { size: 22, weight: 700, colour: s.C.blue, delay: 300 });
      s.text(RX - 10, RY + RH / 2, '4 cm', { size: 22, weight: 700, colour: s.C.blue, anchor: 'end', delay: 400 });
      s.text(470, 140, '4 rows of 7', { size: 26, weight: 700, colour: s.C.deep, delay: 2200, name: 'a1' });
      s.text(470, 195, '7 × 4 = 28 cm²', { size: 32, weight: 700, colour: s.C.blue, enter: 'pop', delay: 2800, name: 'a2' });
    },
    'p-vs-a': function (s) {
      hideAll(s, ['a1', 'a2']);
      s.add('<rect x="0" y="0" width="' + RW + '" height="' + RH + '" fill="none" stroke="#FF8A3D" stroke-width="8" stroke-linejoin="round"/>', { x: RX, y: RY, enter: 'fade', delay: 300, flat: true });
      s.text(470, 130, 'perimeter = 22 cm', { size: 26, weight: 700, colour: s.C.orange, delay: 500 });
      s.text(470, 162, 'the edge', { size: 20, colour: s.C.muted, delay: 700 });
      s.text(470, 220, 'area = 28 cm²', { size: 26, weight: 700, colour: s.C.blue, delay: 1500 });
      s.text(470, 252, 'the inside', { size: 20, colour: s.C.muted, delay: 1700 });
      s.owl(560, 350, 80, { delay: 2000 });
    },
    'l-area': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Area of an L shape');
      s.add(path([L(0, 0), L(9, 0), L(9, 7), L(0, 7)], 'none', '#9AA0B4', 3, true), { enter: 'fade', flat: true });
      s.add(path(LP, '#B8D6FF', '#1E1B3A', 4), { enter: 'pop', delay: 200 });
      s.add(path([L(5, 4), L(9, 4), L(9, 7), L(5, 7)], 'rgba(229,72,77,.15)', '#E5484D', 3, true), { enter: 'fade', delay: 1400, flat: true });
      s.text(212, 322, '9 cm', { size: 20, weight: 700, delay: 300 });
      s.text(88, 212, '7 cm', { size: 20, weight: 700, anchor: 'end', delay: 400 });
      s.text(275, 112, '4 cm', { size: 20, weight: 700, colour: s.C.red, delay: 1500 });
      s.text(337, 162, '3 cm', { size: 20, weight: 700, colour: s.C.red, anchor: 'start', delay: 1600 });
      s.text(500, 120, '9 × 7 = 63 cm²', { size: 24, weight: 700, delay: 800 });
      s.text(500, 170, '4 × 3 = 12 cm²', { size: 24, weight: 700, colour: s.C.red, delay: 1800 });
      s.text(500, 230, '63 − 12 = 51 cm²', { size: 28, weight: 700, colour: s.C.green, enter: 'pop', delay: 2800 });
    },

    /* ---------- 3. Triangles and other shapes (30 units = 1 cm) ---------- */
    'tri-half': function (s) {
      title(s, 'A triangle is half a rectangle');
      s.add(path([[80, 100], [320, 100], [320, 250], [80, 250]], 'none', '#9AA0B4', 3, true), { enter: 'fade', flat: true });
      s.add(path([[80, 250], [320, 250], [80, 100]], '#FFE2C7', '#1E1B3A', 4) + rightAngle(80, 250, 1, -1), { enter: 'pop', delay: 400 });
      s.text(200, 274, 'base 8 cm', { size: 20, weight: 700, delay: 800 });
      s.text(68, 175, '5 cm', { size: 20, weight: 700, anchor: 'end', delay: 1000 });
      s.text(490, 130, 'rectangle: 8 × 5 = 40', { size: 22, weight: 700, colour: s.C.muted, delay: 1500 });
      s.text(490, 180, 'half: 40 ÷ 2', { size: 24, weight: 700, delay: 2300 });
      s.text(490, 235, '= 20 cm²', { size: 34, weight: 700, colour: s.C.orange, enter: 'pop', delay: 3000 });
    },
    'tri-height': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Use the perpendicular height');
      s.add(path([[100, 270], [340, 270], [260, 120]], '#DDF7EE', '#1E1B3A', 4), { enter: 'pop' });
      s.add(line([260, 120], [260, 270], '#22A06B', 4, true) + rightAngle(260, 270, -1, -1), { enter: 'fade', delay: 700, flat: true });
      s.text(252, 205, 'height', { size: 20, weight: 700, colour: s.C.green, anchor: 'end', delay: 900 });
      s.text(220, 294, 'base', { size: 20, weight: 700, delay: 500 });
      s.text(490, 120, 'height meets the base', { size: 22, weight: 700, colour: s.C.green, delay: 1400 });
      s.text(490, 150, 'at a right angle', { size: 22, weight: 700, colour: s.C.green, delay: 1500 });
      s.text(490, 210, 'not the slanted side', { size: 22, weight: 700, colour: s.C.red, delay: 2300 });
      s.add(line([314, 210], [378, 210], '#E5484D', 3), { enter: 'fade', delay: 2300 });
    },
    'para': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Parallelogram to rectangle');
      s.add(path([[160, 280], [340, 280], [400, 160], [160, 160]], '#F1ECFF', '#1E1B3A', 4), { enter: 'pop' });
      var tri = s.add(path([[100, 280], [160, 280], [160, 160]], '#D9CCFF', '#1E1B3A', 4), { enter: 'pop' });
      s.add(line([160, 160], [160, 280], '#6C4DF6', 4, true) + rightAngle(160, 280, 1, -1), { enter: 'fade', delay: 600, flat: true });
      s.text(148, 220, '4 cm', { size: 20, weight: 700, colour: s.C.fun, anchor: 'end', delay: 700 });
      s.text(250, 304, 'base 8 cm', { size: 20, weight: 700, delay: 800 });
      s.move(tri, 240, 0, 1600, { delay: 1600 });
      s.text(530, 180, '8 × 4', { size: 28, weight: 700, delay: 3400 });
      s.text(530, 230, '= 32 cm²', { size: 34, weight: 700, colour: s.C.fun, enter: 'pop', delay: 3900 });
    },
    'trap': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Area of a trapezium');
      s.add(path([[100, 290], [310, 290], [240, 170], [150, 170]], '#FFD6E3', '#1E1B3A', 4), { enter: 'pop' });
      s.add(line([195, 170], [195, 290], '#FF5D8F', 4, true) + rightAngle(195, 290, 1, -1), { enter: 'fade', delay: 500, flat: true });
      s.text(195, 150, '3 cm', { size: 20, weight: 700, colour: s.C.blue, delay: 300 });
      s.text(205, 312, '7 cm', { size: 20, weight: 700, colour: s.C.blue, delay: 400 });
      s.text(203, 240, '4 cm', { size: 20, weight: 700, colour: s.C.pink, anchor: 'start', delay: 600 });
      s.text(490, 130, 'add the parallel sides', { size: 20, colour: s.C.muted, delay: 1000 });
      s.text(490, 165, '(3 + 7) ÷ 2 = 5', { size: 26, weight: 700, delay: 1300 });
      s.text(490, 215, 'times the height', { size: 20, colour: s.C.muted, delay: 2200 });
      s.text(490, 255, '5 × 4 = 20 cm²', { size: 30, weight: 700, colour: s.C.pink, enter: 'pop', delay: 2600 });
    },

    /* ---------- 4. Circles ---------- */
    'circle-parts': function (s) {
      var cp = disc('#FFE7B0');
      s.add(cp.def + '<circle cx="200" cy="190" r="120" fill="' + cp.url + '" stroke="#1E1B3A" stroke-width="4"/><path d="M118 130 A100 100 0 0 1 170 96" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="200" cy="190" r="6" fill="#1E1B3A"/>', { enter: 'pop' });
      s.text(192, 210, 'centre', { size: 18, colour: s.C.muted, anchor: 'end', delay: 300 });
      s.add(line([200, 190], [320, 190], '#E5484D', 6), { enter: 'fade', delay: 700 });
      s.text(262, 172, 'radius', { size: 22, weight: 700, colour: s.C.red, delay: 800 });
      s.add(line([200, 70], [200, 310], '#2F80ED', 6), { enter: 'fade', delay: 1600 });
      s.text(190, 115, 'diameter', { size: 22, weight: 700, colour: s.C.blue, anchor: 'end', delay: 1700 });
      s.text(490, 160, 'diameter =', { size: 28, weight: 700, colour: s.C.blue, delay: 2400 });
      s.text(490, 205, '2 × radius', { size: 28, weight: 700, colour: s.C.red, delay: 2700 });
      s.owl(560, 348, 90, { delay: 3000 });
    },
    'unroll': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Unroll the circumference');
      var d = 90, C = Math.PI * d, x0 = 180;   // the unrolled line is pi times the diameter, to scale
      var cu = disc('#FFE7B0');
      var circ = s.add(cu.def + '<circle cx="90" cy="170" r="45" fill="' + cu.url + '" stroke="#FF8A3D" stroke-width="6"/>' + line([45, 170], [135, 170], '#2F80ED', 4), { enter: 'pop' });
      s.text(90, 236, 'diameter', { size: 18, weight: 700, colour: s.C.blue, delay: 200 });
      var t = s.add('<path d="M' + x0 + ' 150 H' + (x0 + C).toFixed(1) + '" stroke="#FF8A3D" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>', { enter: 'none' });
      draw(s, t, 1800, 500);
      s.text(x0 + C / 2, 124, 'circumference', { size: 20, weight: 700, colour: s.C.orange, delay: 1200 });
      [0, 1, 2].forEach(function (k) {
        var bc = k % 2 ? '#B8D6FF' : '#6FA8F5', bg = lg(mix(bc, .35), mix(bc, -.08));
        s.add(bg.def + '<rect x="0" y="0" width="' + d + '" height="24" fill="' + bg.url + '" stroke="rgba(30,27,58,.6)" stroke-width="2"/><rect x="3" y="2.5" width="' + (d - 6) + '" height="4" rx="2" fill="#fff" opacity=".5"/>' +
          '<text x="' + (d / 2) + '" y="13" ' + F + ' font-size="18" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle">' + (k + 1) + '</text>', { x: x0 + k * d, y: 172, enter: 'pop', delay: 2400 + k * 500 });
      });
      var pk = lg('#FF9DBB', '#F0457A');
      s.add(pk.def + '<rect x="0" y="0" width="' + (C - 3 * d).toFixed(1) + '" height="24" fill="' + pk.url + '" stroke="rgba(30,27,58,.6)" stroke-width="2"/>', { x: x0 + 3 * d, y: 172, enter: 'pop', delay: 4000 });
      s.text(x0 + C + 14, 186, 'a bit', { size: 18, weight: 700, colour: s.C.pink, anchor: 'start', delay: 4100 });
      s.text(380, 270, 'just over 3 diameters', { size: 24, weight: 700, colour: s.C.deep, delay: 4500 });
      s.text(380, 312, 'about 3.14 times: this is π (pi)', { size: 24, weight: 700, colour: s.C.fun, delay: 5100 });
    },
    'circumference': function (s) {
      s.clear(); s.ref = {};
      var cc = disc('#FFE7B0');
      s.add(cc.def + '<circle cx="190" cy="190" r="120" fill="' + cc.url + '" stroke="#FF8A3D" stroke-width="6"/><path d="M108 130 A100 100 0 0 1 160 96" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".7"/><circle cx="190" cy="190" r="5" fill="#1E1B3A"/>', { enter: 'pop', name: 'disc' });
      s.add(line([70, 190], [310, 190], '#2F80ED', 5) + '<text x="190" y="172" ' + F + ' font-size="22" font-weight="700" fill="#2F80ED" text-anchor="middle" stroke="#FFF4D6" stroke-width="5" paint-order="stroke">20 cm</text>', { enter: 'fade', delay: 400, name: 'dia' });
      s.text(490, 110, 'circumference', { size: 22, colour: s.C.orange, weight: 700, delay: 800, name: 'c0' });
      s.text(490, 150, '= π × diameter', { size: 26, weight: 700, delay: 1200, name: 'c1' });
      s.text(490, 200, '= 3.14 × 20', { size: 26, weight: 700, delay: 2000, name: 'c2' });
      s.text(490, 255, '= 62.8 cm', { size: 34, weight: 700, colour: s.C.green, enter: 'pop', delay: 2800, name: 'c3' });
    },
    'circle-area': function (s) {
      hideAll(s, ['dia', 'c0', 'c1', 'c2', 'c3']);
      var ca = disc('#A9CBFA');
      s.add(ca.def + '<circle cx="190" cy="190" r="117" fill="' + ca.url + '" opacity=".9"/><path d="M110 132 A98 98 0 0 1 160 99" stroke="#fff" stroke-width="7" fill="none" stroke-linecap="round" opacity=".6"/>', { enter: 'fade', delay: 300, flat: true });
      s.add(line([190, 190], [275, 105], '#E5484D', 5) + '<circle cx="190" cy="190" r="5" fill="#1E1B3A"/>', { enter: 'fade', delay: 700 });
      s.text(258, 162, '10 cm', { size: 22, weight: 700, colour: s.C.red, anchor: 'start', delay: 800 });
      s.text(490, 110, 'area = π × r × r', { size: 26, weight: 700, delay: 1200 });
      s.text(490, 160, '= 3.14 × 10 × 10', { size: 26, weight: 700, delay: 2000 });
      s.text(490, 215, '= 314 cm²', { size: 34, weight: 700, colour: s.C.blue, enter: 'pop', delay: 2800 });
      s.text(490, 270, 'use the radius!', { size: 22, weight: 700, colour: s.C.red, delay: 3400 });
    },

    /* ---------- 5. Volume and surface area ---------- */
    'unit-cube': function (s) {
      title(s, 'Volume is counted in cubes');
      s.add(cube(260, 280, 120, BLUE) + '<text x="320" y="222" ' + F + ' font-size="34" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle">1 cm³</text>', { enter: 'pop', delay: 200 });
      s.text(320, 302, '1 cm', { size: 20, weight: 700, colour: s.C.blue, delay: 700 });
      s.text(250, 220, '1 cm', { size: 20, weight: 700, colour: s.C.blue, anchor: 'end', delay: 800 });
      s.text(432, 268, '1 cm', { size: 20, weight: 700, colour: s.C.blue, anchor: 'start', delay: 900 });
      s.text(320, 336, 'one cubic centimetre (drawn bigger)', { size: 20, colour: s.C.muted, delay: 1400 });
      s.owl(90, 345, 110, { delay: 400 });
    },
    'cuboid-volume': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Volume of a cuboid');
      var a = 44, X = 90, Y = 300;
      for (var h = 0; h < 2; h++) for (var d = 2; d >= 0; d--) for (var i = 0; i < 4; i++) {
        s.add(cube(X + i * a + d * a * 0.5, Y - h * a - d * a * 0.4, a, h ? GOLD : BLUE), { enter: 'pop', delay: 200 + h * 1800 + ((2 - d) * 4 + i) * 60 });
      }
      s.text(X + 2 * a, Y + 22, '4 cm', { size: 20, weight: 700, delay: 500 });
      s.text(X - 10, Y - a, '2 cm', { size: 20, weight: 700, anchor: 'end', delay: 2400 });
      s.text(X + 4 * a + 48, Y - 4, '3 cm', { size: 20, weight: 700, anchor: 'start', delay: 700 });
      s.text(500, 120, 'layer: 4 × 3 = 12 cubes', { size: 22, weight: 700, colour: s.C.blue, delay: 1200 });
      s.text(500, 165, '2 layers', { size: 22, weight: 700, colour: s.C.orange, delay: 2600 });
      s.text(500, 215, '4 × 3 × 2 = 24 cm³', { size: 28, weight: 700, colour: s.C.green, enter: 'pop', delay: 3200 });
    },
    'surface-area': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Surface area: add up all 6 faces');
      var x = 50, y = 270, l = 120, h = 60, dx = 45, dy = 36;   // 4 cm by 3 cm by 2 cm, 30 units = 1 cm (depth drawn slanted)
      s.add(path([[x, y], [x + l, y], [x + l, y - h], [x, y - h]], '#6FA8F5', '#1E1B3A', 3) +
        path([[x, y - h], [x + dx, y - h - dy], [x + l + dx, y - h - dy], [x + l, y - h]], '#7DD3A8', '#1E1B3A', 3) +
        path([[x + l, y], [x + l + dx, y - dy], [x + l + dx, y - h - dy], [x + l, y - h]], '#FFB067', '#1E1B3A', 3), { enter: 'pop' });
      s.text(x + l / 2, y + 22, '4 cm', { size: 20, weight: 700, delay: 300 });
      s.text(x - 8, y - h / 2, '2 cm', { size: 20, weight: 700, anchor: 'end', delay: 400 });
      s.text(x + l + dx / 2 + 12, y - dy / 2 + 8, '3 cm', { size: 20, weight: 700, anchor: 'start', delay: 500 });
      [['#7DD3A8', 'top and bottom: 4 × 3 = 12'], ['#6FA8F5', 'front and back: 4 × 2 = 8'], ['#FFB067', 'two sides: 3 × 2 = 6']].forEach(function (r, k) {
        var sw = lg(mix(r[0], .45), mix(r[0], -.06));
        s.add(sw.def + '<rect x="0" y="-12" width="24" height="24" rx="6" fill="' + sw.url + '" stroke="rgba(30,27,58,.6)" stroke-width="2"/><rect x="4" y="-9" width="16" height="4" rx="2" fill="#fff" opacity=".5"/>', { x: 262, y: 100 + k * 46, enter: 'pop', delay: 900 + k * 900 });
        s.text(298, 100 + k * 46, r[1], { size: 22, weight: 700, anchor: 'start', delay: 900 + k * 900 });
      });
      s.text(430, 260, '2 × (12 + 8 + 6)', { size: 26, weight: 700, delay: 3800 });
      s.text(430, 310, '= 2 × 26 = 52 cm²', { size: 30, weight: 700, colour: s.C.green, enter: 'pop', delay: 4500 });
    },
    'units': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Watch the units');
      var um = lg('#F2FCF8', '#C4EEDD');
      s.add(um.def + '<rect x="0" y="0" width="160" height="160" fill="' + um.url + '" stroke="#1E1B3A" stroke-width="4"/><rect x="8" y="7" width="144" height="8" rx="4" fill="#fff" opacity=".6"/>' +
        '<text x="80" y="82" ' + F + ' font-size="34" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle">1 m²</text>', { x: 40, y: 95, enter: 'pop' });
      s.text(120, 78, '1 m = 100 cm', { size: 20, weight: 700, colour: s.C.green, delay: 400 });
      s.text(212, 175, '100 cm', { size: 20, weight: 700, colour: s.C.green, anchor: 'start', delay: 600 });
      s.text(450, 100, '1 m² = 100 cm × 100 cm', { size: 22, weight: 700, delay: 1000 });
      s.text(450, 145, '= 10,000 cm²', { size: 30, weight: 700, colour: s.C.green, enter: 'pop', delay: 1700 });
      s.text(450, 200, 'not 100!', { size: 22, weight: 700, colour: s.C.red, delay: 2300 });
      s.text(450, 250, '1 litre = 1000 cm³', { size: 26, weight: 700, colour: s.C.blue, delay: 3000 });
      s.text(380, 310, 'book: cm²', { size: 20, weight: 700, colour: s.C.fun, delay: 3800 });
      s.text(530, 310, 'football pitch: m²', { size: 20, weight: 700, colour: s.C.fun, delay: 4200 });
      s.owl(120, 350, 70, { delay: 2000 });
    }
  });
})();
