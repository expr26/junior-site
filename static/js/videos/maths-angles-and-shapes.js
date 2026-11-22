/* Pictures for the Angles and shapes theory video (words: videos/maths/angles-and-shapes.json).
   Stage is 640 x 360; see static/js/theory.js. Every angle is drawn at its true size: angles here are in degrees,
   measured anticlockwise from "pointing right", like a protractor (the stage's y axis points down, so y uses minus). */
(function () {
  if (!window.Theory) return;

  var F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  var R = Math.PI / 180;
  function pt(v, r, a) { return [v[0] + r * Math.cos(a * R), v[1] - r * Math.sin(a * R)]; }
  function dir(a, b) { var d = Math.atan2(-(b[1] - a[1]), b[0] - a[0]) / R; return (d + 360) % 360; }
  function n1(x) { return Math.round(x * 10) / 10; }
  function seg(a, b, col, w, dash) {
    return '<path d="M' + n1(a[0]) + ' ' + n1(a[1]) + ' L' + n1(b[0]) + ' ' + n1(b[1]) + '" stroke="' + col + '" stroke-width="' + (w || 4) + '" stroke-linecap="round"' + (dash ? ' stroke-dasharray="8 7"' : '') + ' fill="none"/>';
  }
  function ray(v, a, len, col, w) { return seg(v, pt(v, len, a), col || '#1E1B3A', w || 5); }
  function label(p, text, col, size) {
    return '<text x="' + n1(p[0]) + '" y="' + n1(p[1]) + '" ' + F + ' font-size="' + (size || 22) + '" font-weight="700" fill="' + col +
      '" text-anchor="middle" dominant-baseline="middle" stroke="#FFFDF7" stroke-width="5" paint-order="stroke">' + text + '</text>';
  }
  /* the angle from direction a0 anticlockwise to a1 at vertex v: a shaded sector (or a square for 90°), with an optional label */
  function mark(v, a0, a1, o) {
    o = o || {};
    var r = o.r || 40, col = o.colour || '#6C4DF6', fill = o.fill || 'rgba(108,77,246,.16)', out = '';
    while (a1 <= a0) a1 += 360;
    if (Math.abs(a1 - a0 - 90) < 0.01 && !o.arc) {
      var q = 20, p0 = pt(v, q, a0), p1 = pt(v, q, a1), c = [p0[0] + p1[0] - v[0], p0[1] + p1[1] - v[1]];
      out = '<path d="M' + n1(p0[0]) + ' ' + n1(p0[1]) + ' L' + n1(c[0]) + ' ' + n1(c[1]) + ' L' + n1(p1[0]) + ' ' + n1(p1[1]) + '" fill="' + fill + '" stroke="' + col + '" stroke-width="3"/>';
    } else {
      var s0 = pt(v, r, a0), s1 = pt(v, r, a1), big = a1 - a0 > 180 ? 1 : 0;
      out = '<path d="M' + n1(v[0]) + ' ' + n1(v[1]) + ' L' + n1(s0[0]) + ' ' + n1(s0[1]) + ' A' + r + ' ' + r + ' 0 ' + big + ' 0 ' + n1(s1[0]) + ' ' + n1(s1[1]) + ' Z" fill="' + fill + '" stroke="none"/>' +
        '<path d="M' + n1(s0[0]) + ' ' + n1(s0[1]) + ' A' + r + ' ' + r + ' 0 ' + big + ' 0 ' + n1(s1[0]) + ' ' + n1(s1[1]) + '" fill="none" stroke="' + col + '" stroke-width="3"/>';
    }
    if (o.label) out += label(pt(v, o.lr || r + 24, (a0 + a1) / 2), o.label, col, o.size);
    return out;
  }
  function poly(pts, fill, stroke, w) {
    return '<path d="M' + pts.map(function (p) { return n1(p[0]) + ' ' + n1(p[1]); }).join(' L') + ' Z" fill="' + fill + '" stroke="' + (stroke || '#1E1B3A') + '" stroke-width="' + (w || 4) + '" stroke-linejoin="round"/>';
  }
  function regular(c, r, n, start) { var p = []; for (var k = 0; k < n; k++) p.push(pt(c, r, start + k * 360 / n)); return p; }
  function tick(a, b, n) {   // n small dashes across the middle of side ab: "these sides are equal"
    var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = dir(a, b), out = '';
    for (var k = 0; k < n; k++) { var c = pt(m, (k - (n - 1) / 2) * 7, d); out += seg(pt(c, 9, d + 90), pt(c, 9, d - 90), '#FF5D8F', 3); }
    return out;
  }
  function chev(a, b, n) {   // n arrow heads on side ab: "these sides are parallel"
    var m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], d = dir(a, b), out = '';
    for (var k = 0; k < n; k++) { var c = pt(m, k * 10 - (n - 1) * 5 + 5, d); out += seg(pt(c, 11, d + 150), c, '#FF8A3D', 3) + seg(pt(c, 11, d - 150), c, '#FF8A3D', 3); }
    return out;
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }
  function title(s, t, col, size) { return s.text(320, 36, t, { size: size || 28, weight: 700, colour: col || s.C.fun }); }

  /* chapter 3: a line crosses two parallel lines at 55° */
  var T = 55, P1 = [362, 130], P2 = [278, 250];

  /* chapter 4: one regular hexagon, vertices anticlockwise */
  var HC = [190, 195], HEX = regular(HC, 100, 6, 0);

  Theory.scenes({
    /* ---------- 1. Types of angle ---------- */
    'turn': function (s) {
      title(s, 'One full turn = 360°');
      var v = [320, 200];
      s.add('<circle cx="320" cy="200" r="110" fill="none" stroke="#C9CED8" stroke-width="3" stroke-dasharray="8 8"/>' + ray(v, 0, 110, '#1E1B3A') + '<circle cx="320" cy="200" r="7" fill="#1E1B3A"/>', { enter: 'fade' });
      var arm = s.add('<circle r="110" fill="none"/><path d="M0 0 H110" stroke="#6C4DF6" stroke-width="7" stroke-linecap="round"/><circle cx="110" r="9" fill="#6C4DF6"/>', { x: 320, y: 200, enter: 'fade', delay: 300 });
      s.anim(arm, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-360deg)' }], 2600, { delay: 600, easing: 'ease-in-out' });
      s.text(520, 200, '360°', { size: 40, weight: 700, colour: s.C.fun, enter: 'pop', delay: 3200 });
      s.owl(80, 345, 110, { delay: 200 });
    },
    'right': function (s) {
      s.clear(); s.ref = {};
      title(s, 'A right angle is 90°', s.C.green);
      var v = [230, 290];
      s.add(ray(v, 0, 190) + ray(v, 90, 190), { enter: 'fade' });
      s.add(mark(v, 0, 90, { colour: s.C.green, fill: 'rgba(34,160,107,.2)' }) + label(pt(v, 52, 45), '90°', s.C.green, 26), { enter: 'pop', delay: 500 });
      s.text(500, 160, 'a quarter turn', { size: 26, weight: 700, colour: s.C.deep, delay: 1000 });
      s.text(500, 200, 'the little square', { size: 20, colour: s.C.muted, delay: 1600 });
      s.text(500, 228, 'means exactly 90°', { size: 20, colour: s.C.muted, delay: 1700 });
    },
    'acute-obtuse': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M320 20 V340" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { enter: 'fade' });
      var a = [90, 280], o = [450, 280];
      s.text(165, 50, 'acute', { size: 32, weight: 700, colour: s.C.blue });
      s.text(165, 86, 'less than 90°', { size: 20, colour: s.C.muted, delay: 200 });
      s.add(ray(a, 0, 160) + ray(a, 40, 160) + mark(a, 0, 40, { r: 50, colour: s.C.blue, fill: 'rgba(47,128,237,.18)', label: '40°' }), { enter: 'fade', delay: 400 });
      s.text(475, 50, 'obtuse', { size: 32, weight: 700, colour: s.C.orange, delay: 1300 });
      s.text(475, 86, 'between 90° and 180°', { size: 20, colour: s.C.muted, delay: 1500 });
      s.add(ray(o, 0, 150) + ray(o, 130, 150) + mark(o, 0, 130, { r: 40, colour: s.C.orange, fill: 'rgba(255,138,61,.2)', label: '130°' }), { enter: 'fade', delay: 1700 });
    },
    'straight-reflex': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M320 20 V340" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { enter: 'none' });
      var a = [160, 230], o = [470, 200];
      s.text(160, 50, 'straight line', { size: 30, weight: 700, colour: s.C.deep });
      s.text(160, 86, 'exactly 180°', { size: 20, colour: s.C.muted, delay: 200 });
      s.add(ray(a, 0, 130) + ray(a, 180, 130) + mark(a, 0, 180, { r: 42, label: '180°' }) + '<circle cx="160" cy="230" r="6" fill="#1E1B3A"/>', { enter: 'fade', delay: 400 });
      s.text(475, 50, 'reflex', { size: 32, weight: 700, colour: s.C.pink, delay: 1300 });
      s.text(475, 86, 'more than 180°', { size: 20, colour: s.C.muted, delay: 1500 });
      s.add(ray(o, 0, 130) + ray(o, 240, 130) + mark(o, 0, 240, { r: 38, colour: s.C.pink, fill: 'rgba(255,93,143,.18)', label: '240°', lr: 62 }), { enter: 'fade', delay: 1700 });
    },

    /* ---------- 2. Angle rules ---------- */
    'line-rule': function (s) {
      title(s, 'Angles on a straight line add up to 180°', s.C.fun, 24);
      var v = [320, 240];
      s.add(seg([110, 240], [530, 240], '#1E1B3A', 5) + ray(v, 65, 170), { enter: 'fade' });
      s.add(mark(v, 65, 180, { r: 44, colour: s.C.blue, fill: 'rgba(47,128,237,.18)', label: '115°', lr: 74 }), { enter: 'pop', delay: 500 });
      s.add(mark(v, 0, 65, { r: 50, colour: s.C.green, fill: 'rgba(34,160,107,.2)', label: 'x', lr: 76, size: 26 }), { enter: 'pop', delay: 1000 });
      s.text(320, 312, 'x = 180° − 115° = 65°', { size: 30, weight: 700, colour: s.C.green, delay: 1800 });
    },
    'point-rule': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Angles round a point add up to 360°', s.C.fun, 24);
      var v = [200, 205];
      s.add(ray(v, 90, 125) + ray(v, 190, 125) + ray(v, 330, 125) + '<circle cx="200" cy="205" r="6" fill="#1E1B3A"/>', { enter: 'fade' });
      s.add(mark(v, 90, 190, { colour: s.C.blue, fill: 'rgba(47,128,237,.18)', label: '100°', lr: 72 }), { enter: 'pop', delay: 400 });
      s.add(mark(v, 190, 330, { colour: s.C.orange, fill: 'rgba(255,138,61,.2)', label: '140°', lr: 72 }), { enter: 'pop', delay: 800 });
      s.add(mark(v, 330, 450, { colour: s.C.green, fill: 'rgba(34,160,107,.2)', label: 'y', lr: 70, size: 26 }), { enter: 'pop', delay: 1200 });
      s.text(475, 140, '100° + 140° = 240°', { size: 24, weight: 700, delay: 1800 });
      s.text(475, 190, 'y = 360° − 240°', { size: 24, weight: 700, delay: 2600 });
      s.text(475, 245, 'y = 120°', { size: 32, weight: 700, colour: s.C.green, enter: 'pop', delay: 3200 });
    },
    'triangle-rule': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Angles in a triangle add up to 180°', s.C.fun, 24);
      var A = [70, 300], B = [370, 300], ac = 300 * Math.sin(75 * R) / Math.sin(65 * R), C = pt(A, ac, 40);   // drawn to scale
      s.add(poly([A, B, C], '#FFF4D6', '#1E1B3A', 4), { enter: 'fade' });
      s.add(mark(A, 0, 40, { r: 46, colour: s.C.blue, fill: 'rgba(47,128,237,.2)', label: '40°', lr: 76 }), { enter: 'pop', delay: 400 });
      s.add(mark(B, 105, 180, { r: 40, colour: s.C.orange, fill: 'rgba(255,138,61,.22)', label: '75°', lr: 66 }), { enter: 'pop', delay: 800 });
      s.add(mark(C, dir(C, A), dir(C, B), { r: 36, colour: s.C.green, fill: 'rgba(34,160,107,.22)', label: 'x', lr: 60, size: 26 }), { enter: 'pop', delay: 1200 });
      s.text(515, 140, '40° + 75° = 115°', { size: 24, weight: 700, delay: 1800 });
      s.text(515, 190, 'x = 180° − 115°', { size: 24, weight: 700, delay: 2600 });
      s.text(515, 245, 'x = 65°', { size: 32, weight: 700, colour: s.C.green, enter: 'pop', delay: 3200 });
    },
    'quad-rule': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Angles in a quadrilateral add up to 360°', s.C.fun, 24);
      var A = [90, 290], B = [360, 305], C = [330, 105], D = [140, 135];
      s.add(poly([A, B, C], '#D6E6FF', '#1E1B3A', 4), { enter: 'fade' });
      s.add(poly([A, C, D], '#FFE2C7', '#1E1B3A', 4), { enter: 'fade', delay: 200 });
      s.add(seg(A, C, '#6C4DF6', 5, true), { enter: 'fade', delay: 800 });
      s.text(268, 240, '180°', { size: 26, weight: 700, colour: s.C.blue, enter: 'pop', delay: 1300 });
      s.text(190, 180, '180°', { size: 26, weight: 700, colour: s.C.orange, enter: 'pop', delay: 1700 });
      s.text(510, 160, 'two triangles', { size: 24, weight: 700, colour: s.C.deep, delay: 2200 });
      s.text(510, 210, '2 × 180° = 360°', { size: 28, weight: 700, colour: s.C.green, enter: 'pop', delay: 2700 });
      s.owl(560, 345, 90, { delay: 2900 });
    },

    /* ---------- 3. Crossing and parallel lines ---------- */
    'cross': function (s) {
      title(s, 'Vertically opposite angles are equal', s.C.fun, 26);
      var v = [320, 195];
      s.add(seg(pt(v, 200, 210), pt(v, 200, 30), '#1E1B3A', 5) + seg(pt(v, 200, 330), pt(v, 200, 150), '#1E1B3A', 5), { enter: 'fade' });
      s.add(mark(v, 30, 150, { r: 38, colour: s.C.blue, fill: 'rgba(47,128,237,.2)', label: '120°', lr: 62 }), { enter: 'pop', delay: 500 });
      s.add(mark(v, 210, 330, { r: 38, colour: s.C.blue, fill: 'rgba(47,128,237,.2)', label: '120°', lr: 62 }), { enter: 'pop', delay: 1000 });
      s.add(mark(v, 150, 210, { r: 38, colour: s.C.orange, fill: 'rgba(255,138,61,.22)', label: '60°', lr: 70 }), { enter: 'pop', delay: 1700 });
      s.add(mark(v, 330, 390, { r: 38, colour: s.C.orange, fill: 'rgba(255,138,61,.22)', label: '60°', lr: 70 }), { enter: 'pop', delay: 2200 });
    },
    'parallel': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Parallel lines never meet');
      s.add(seg([50, 130], [590, 130], '#1E1B3A', 5) + chev([500, 130], [560, 130], 1), { enter: 'left' });
      s.add(seg([50, 250], [590, 250], '#1E1B3A', 5) + chev([500, 250], [560, 250], 1), { enter: 'left', delay: 400 });
      s.text(300, 190, 'same direction, always the same gap', { size: 22, colour: s.C.muted, delay: 1000, name: 'p1' });
      s.add(seg([575, 140], [575, 240], '#9AA0B4', 3, true), { enter: 'fade', delay: 1300, name: 'p2' });
      s.owl(80, 120, 70, { delay: 1500, name: 'p3' });
    },
    'z-angles': function (s) {
      hideAll(s, ['p1', 'p2', 'p3']);
      var d = [Math.cos(T * R), -Math.sin(T * R)];
      s.add(seg([P2[0] - 75 * d[0], P2[1] - 75 * d[1]], [P1[0] + 75 * d[0], P1[1] + 75 * d[1]], '#1E1B3A', 5), { enter: 'fade' });
      s.add('<path d="M' + (P1[0] - 120) + ' 130 L' + P1[0] + ' 130 L' + P2[0] + ' 250 L' + (P2[0] + 120) + ' 250" fill="none" stroke="#FFC93C" stroke-width="16" stroke-linejoin="round" stroke-linecap="round" opacity=".7"/>', { enter: 'fade', delay: 600, name: 'z' });
      s.add(mark(P1, 180, 180 + T, { r: 40, colour: s.C.fun, label: '55°', lr: 66 }), { enter: 'pop', delay: 1200, name: 'z1' });
      s.add(mark(P2, 0, T, { r: 40, colour: s.C.fun, label: '55°', lr: 66 }), { enter: 'pop', delay: 1600, name: 'z2' });
      s.text(530, 320, 'Z: equal', { size: 28, weight: 700, colour: s.C.fun, enter: 'pop', delay: 2200, name: 'z3' });
    },
    'f-angles': function (s) {
      hideAll(s, ['z', 'z1', 'z2', 'z3']);
      var d = [Math.cos(T * R), -Math.sin(T * R)];
      s.add('<path d="M' + P1[0] + ' 130 L' + (P2[0] - 60 * d[0]) + ' ' + (250 - 60 * d[1]) + ' M' + P1[0] + ' 130 H' + (P1[0] + 120) + ' M' + P2[0] + ' 250 H' + (P2[0] + 120) + '" fill="none" stroke="#7DE3C8" stroke-width="16" stroke-linecap="round" opacity=".8"/>', { enter: 'fade', delay: 300, name: 'f' });
      s.add(mark(P1, 180 + T, 360, { r: 36, colour: s.C.sci, fill: 'rgba(15,148,136,.18)', label: '125°', lr: 62 }), { enter: 'pop', delay: 900, name: 'f1' });
      s.add(mark(P2, 180 + T, 360, { r: 36, colour: s.C.sci, fill: 'rgba(15,148,136,.18)', label: '125°', lr: 62 }), { enter: 'pop', delay: 1300, name: 'f2' });
      s.text(530, 320, 'F: equal', { size: 28, weight: 700, colour: s.C.sci, enter: 'pop', delay: 1900, name: 'f3' });
    },
    'c-angles': function (s) {
      hideAll(s, ['f', 'f1', 'f2', 'f3']);
      s.add('<path d="M' + (P1[0] + 120) + ' 130 H' + P1[0] + ' L' + P2[0] + ' 250 H' + (P2[0] + 120) + '" fill="none" stroke="#FFB3C9" stroke-width="16" stroke-linejoin="round" stroke-linecap="round" opacity=".8"/>', { enter: 'fade', delay: 300 });
      s.add(mark(P1, 180 + T, 360, { r: 36, colour: s.C.pink, fill: 'rgba(255,93,143,.18)', label: '125°', lr: 62 }), { enter: 'pop', delay: 900 });
      s.add(mark(P2, 0, T, { r: 40, colour: s.C.pink, fill: 'rgba(255,93,143,.18)', label: '55°', lr: 66 }), { enter: 'pop', delay: 1300 });
      s.text(500, 320, '55° + 125° = 180°', { size: 26, weight: 700, colour: s.C.pink, enter: 'pop', delay: 1900 });
    },

    /* ---------- 4. Polygons ---------- */
    'polygon-names': function (s) {
      title(s, 'Polygons have straight sides');
      var cols = ['#FF8A3D', '#2F80ED', '#22A06B', '#6C4DF6', '#FF5D8F'];
      [['triangle', 3, 90], ['quadrilateral', 4, 45], ['pentagon', 5, 90], ['hexagon', 6, 0], ['octagon', 8, 22.5]].forEach(function (p, k) {
        var x = 72 + k * 124, dl = k * 600;
        s.add(poly(regular([x, 145], 46, p[1], p[2]), cols[k], '#1E1B3A', 3), { enter: 'pop', delay: dl });
        s.text(x, 222, p[0], { size: 19, weight: 700, colour: s.C.deep, delay: dl + 200 });
        s.text(x, 252, p[1] + ' sides', { size: 20, colour: s.C.muted, delay: dl + 300 });
      });
      s.owl(320, 350, 80, { delay: 3200 });
    },
    'regular': function (s) {
      s.clear(); s.ref = {};
      var c = [170, 180], P = regular(c, 95, 5, 90), Q = [[400, 260], [560, 270], [600, 160], [510, 95], [430, 150]], m = '';
      for (var k = 0; k < 5; k++) m += tick(P[k], P[(k + 1) % 5], 1);
      s.add(poly(P, '#DDF7EE', '#22A06B', 4) + m, { enter: 'pop' });
      s.text(170, 312, 'regular', { size: 28, weight: 700, colour: s.C.green, delay: 300 });
      s.text(170, 342, 'equal sides, equal angles', { size: 19, colour: s.C.muted, delay: 500 });
      s.add(poly(Q, '#FFE2C7', '#FF8A3D', 4), { enter: 'pop', delay: 1200 });
      s.text(500, 312, 'not regular', { size: 28, weight: 700, colour: s.C.orange, delay: 1500 });
      s.text(500, 342, 'sides and angles differ', { size: 19, colour: s.C.muted, delay: 1700 });
    },
    'hexagon': function (s) {
      s.clear(); s.ref = {};
      var m = '';
      for (var k = 0; k < 6; k++) {
        var V = HEX[k], nx = HEX[(k + 1) % 6], pv = HEX[(k + 5) % 6];
        m += mark(V, dir(V, nx), dir(V, pv), { r: 22, colour: s.C.fun, fill: 'rgba(108,77,246,.2)' }) + label(pt(V, 48, dir(V, HC)), '120°', s.C.fun, 18);
      }
      s.add(poly(HEX, '#F1ECFF', '#1E1B3A', 4), { enter: 'pop' });
      s.add(m, { enter: 'fade', delay: 600 });
      s.text(480, 120, 'regular hexagon', { size: 26, weight: 700, colour: s.C.deep, delay: 300, name: 't0' });
      s.text(480, 165, 'angles add to 720°', { size: 22, delay: 1000, name: 't1' });
      s.text(480, 205, '6 equal angles', { size: 22, delay: 1600, name: 't2' });
      s.text(480, 255, '720° ÷ 6 = 120°', { size: 28, weight: 700, colour: s.C.fun, enter: 'pop', delay: 2300, name: 't3' });
    },
    'exterior': function (s) {
      hideAll(s, ['t1', 't2', 't3']);
      var m = '';
      for (var k = 0; k < 6; k++) {
        var V = HEX[k], pv = HEX[(k + 5) % 6], nx = HEX[(k + 1) % 6], e = dir(pv, V);
        m += seg(V, pt(V, 58, e), '#FF8A3D', 4, true) + mark(V, e, dir(V, nx), { r: 26, colour: s.C.orange, fill: 'rgba(255,138,61,.25)', label: '60°', lr: 44, size: 18 });
      }
      s.add(m, { enter: 'fade', delay: 200 });
      s.text(480, 165, 'exterior angles', { size: 24, weight: 700, colour: s.C.orange, delay: 900, name: 'e1' });
      s.text(480, 205, 'add to 360°', { size: 22, delay: 1300, name: 'e2' });
      s.text(480, 255, '360° ÷ 6 = 60°', { size: 28, weight: 700, colour: s.C.orange, enter: 'pop', delay: 2000, name: 'e3' });
    },
    'int-ext': function (s) {
      hideAll(s, ['e1', 'e2', 'e3']);
      var V = HEX[0], pv = HEX[5];
      s.add(seg(pv, pt(V, 60, dir(pv, V)), '#E5484D', 7), { enter: 'fade', delay: 200 });
      s.text(480, 165, 'on a straight line:', { size: 22, colour: s.C.red, delay: 600 });
      s.text(480, 215, '120° + 60° = 180°', { size: 28, weight: 700, colour: s.C.red, enter: 'pop', delay: 1200 });
      s.owl(560, 348, 90, { delay: 1600 });
    },

    /* ---------- 5. Properties of shapes ---------- */
    'triangles': function (s) {
      var E = [[35, 255], [185, 255], [110, 255 - 75 * Math.sqrt(3)]], I = [[270, 255], [370, 255], [320, 105]], S = [[450, 255], [615, 255], [490, 140]];
      s.add(poly(E, '#D6E6FF', '#1E1B3A', 4) + tick(E[0], E[1], 1) + tick(E[1], E[2], 1) + tick(E[2], E[0], 1), { enter: 'pop' });
      s.add(poly(I, '#FFE2C7', '#1E1B3A', 4) + tick(I[1], I[2], 1) + tick(I[2], I[0], 1), { enter: 'pop', delay: 1200 });
      s.add(poly(S, '#DDF7EE', '#1E1B3A', 4), { enter: 'pop', delay: 2400 });
      s.text(110, 292, 'equilateral', { size: 24, weight: 700, colour: s.C.blue, delay: 200 });
      s.text(110, 324, '3 equal sides', { size: 19, colour: s.C.muted, delay: 400 });
      s.text(320, 292, 'isosceles', { size: 24, weight: 700, colour: s.C.orange, delay: 1400 });
      s.text(320, 324, '2 equal sides', { size: 19, colour: s.C.muted, delay: 1600 });
      s.text(532, 292, 'scalene', { size: 24, weight: 700, colour: s.C.green, delay: 2600 });
      s.text(532, 324, 'no equal sides', { size: 19, colour: s.C.muted, delay: 2800 });
      s.text(320, 40, 'pink marks show equal sides', { size: 20, colour: s.C.pink, delay: 600 });
    },
    'quads1': function (s) {
      s.clear(); s.ref = {};
      var Sq = [[45, 255], [175, 255], [175, 125], [45, 125]], Re = [[230, 255], [410, 255], [410, 145], [230, 145]],
        Rh = [[455, 255], [565, 255], [615, 157], [505, 157]], sqm = '', rem = '', k;
      for (k = 0; k < 4; k++) {
        sqm += tick(Sq[k], Sq[(k + 1) % 4], 1) + mark(Sq[k], dir(Sq[k], Sq[(k + 1) % 4]), dir(Sq[k], Sq[(k + 3) % 4]), { colour: s.C.green, fill: 'rgba(34,160,107,.2)' });
        rem += mark(Re[k], dir(Re[k], Re[(k + 1) % 4]), dir(Re[k], Re[(k + 3) % 4]), { colour: s.C.green, fill: 'rgba(34,160,107,.2)' });
      }
      s.add(poly(Sq, '#D6E6FF', '#1E1B3A', 4) + sqm, { enter: 'pop' });
      s.add(poly(Re, '#FFE2C7', '#1E1B3A', 4) + rem + tick(Re[0], Re[1], 2) + tick(Re[2], Re[3], 2) + tick(Re[1], Re[2], 1) + tick(Re[3], Re[0], 1), { enter: 'pop', delay: 1300 });
      s.add(poly(Rh, '#FFD6E3', '#1E1B3A', 4) + tick(Rh[0], Rh[1], 1) + tick(Rh[1], Rh[2], 1) + tick(Rh[2], Rh[3], 1) + tick(Rh[3], Rh[0], 1), { enter: 'pop', delay: 2600 });
      s.text(110, 292, 'square', { size: 24, weight: 700, colour: s.C.blue, delay: 200 });
      s.text(320, 292, 'rectangle', { size: 24, weight: 700, colour: s.C.orange, delay: 1500 });
      s.text(535, 292, 'rhombus', { size: 24, weight: 700, colour: s.C.pink, delay: 2800 });
      s.text(320, 40, 'green squares show right angles', { size: 20, colour: s.C.green, delay: 600 });
    },
    'quads2': function (s) {
      s.clear(); s.ref = {};
      var Pa = [[60, 255], [250, 255], [300, 145], [110, 145]], Tr = [[370, 255], [610, 255], [540, 145], [440, 145]];
      s.add(poly(Pa, '#DDF7EE', '#1E1B3A', 4) + chev(Pa[0], Pa[1], 1) + chev(Pa[3], Pa[2], 1) + chev(Pa[0], Pa[3], 2) + chev(Pa[1], Pa[2], 2), { enter: 'pop' });
      s.text(180, 292, 'parallelogram', { size: 24, weight: 700, colour: s.C.green, delay: 200 });
      s.text(180, 324, '2 pairs of parallel sides', { size: 19, colour: s.C.muted, delay: 400 });
      s.add(poly(Tr, '#F1ECFF', '#1E1B3A', 4) + chev(Tr[0], Tr[1], 1) + chev(Tr[3], Tr[2], 1), { enter: 'pop', delay: 1500 });
      s.text(490, 292, 'trapezium', { size: 24, weight: 700, colour: s.C.fun, delay: 1700 });
      s.text(490, 324, 'exactly 1 pair', { size: 19, colour: s.C.muted, delay: 1900 });
      s.text(320, 40, 'orange arrows show parallel sides', { size: 20, colour: s.C.orange, delay: 600 });
    },
    'symmetry': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Lines of symmetry');
      s.add(poly([[90, 250], [230, 250], [230, 110], [90, 110]], '#D6E6FF', '#1E1B3A', 4), { enter: 'pop' });
      [[[160, 90], [160, 270]], [[70, 180], [250, 180]], [[75, 95], [245, 265]], [[245, 95], [75, 265]]].forEach(function (l, k) {
        s.add(seg(l[0], l[1], '#E5484D', 3, true), { enter: 'fade', delay: 500 + k * 450 });
      });
      s.text(160, 305, '4 lines', { size: 26, weight: 700, colour: s.C.red, delay: 2400 });
      s.add(poly([[370, 235], [590, 235], [590, 125], [370, 125]], '#FFE2C7', '#1E1B3A', 4), { enter: 'pop', delay: 2600 });
      [[[480, 100], [480, 260]], [[350, 180], [610, 180]]].forEach(function (l, k) {
        s.add(seg(l[0], l[1], '#E5484D', 3, true), { enter: 'fade', delay: 3000 + k * 450 });
      });
      s.text(480, 305, '2 lines', { size: 26, weight: 700, colour: s.C.red, delay: 3800 });
    },
    'prism': function (s) {
      s.clear(); s.ref = {};
      title(s, 'Triangular prism', s.C.sci);
      var A = [90, 290], B = [270, 290], C = [180, 145], o = [150, -70];
      function b(p) { return [p[0] + o[0], p[1] + o[1]]; }
      s.add(poly([B, b(B), b(C), C], '#9EE6D4', '#1E1B3A', 3) + poly([A, B, C], '#5CC8B0', '#1E1B3A', 3) +
        seg(b(A), b(C), '#1E1B3A', 3, true) + seg(b(A), b(B), '#1E1B3A', 3, true) + seg(A, b(A), '#1E1B3A', 3, true), { enter: 'pop' });
      var dots = '';
      [A, B, C, b(A), b(B), b(C)].forEach(function (p) { dots += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="7" fill="#FF5D8F" stroke="#fff" stroke-width="2"/>'; });
      s.add(dots, { enter: 'fade', delay: 2400 });
      s.text(545, 140, '5 faces', { size: 28, weight: 700, colour: s.C.sci, delay: 700 });
      s.text(545, 190, '9 edges', { size: 28, weight: 700, colour: s.C.deep, delay: 1500 });
      s.text(545, 240, '6 vertices', { size: 28, weight: 700, colour: s.C.pink, delay: 2400 });
      s.text(545, 285, 'dashed = hidden', { size: 18, colour: s.C.muted, delay: 3000 });
    }
  });
})();
