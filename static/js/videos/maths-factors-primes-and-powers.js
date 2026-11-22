/* Pictures for the Factors, primes and powers theory video (words: videos/maths/factors-primes-and-powers.json).
   Stage is 640 x 360; see static/js/theory.js. Counter arrays, the bus timeline (8 px per minute) and the square and cube are to scale. */
(function () {
  if (!window.Theory) return;

  var FONT = 'Fredoka, Trebuchet MS, sans-serif';
  function T(x, y, str, size, col, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + FONT + '" font-size="' + (size || 26) + '" font-weight="' + (weight || 600) +
      '" fill="' + (col || '#1E1B3A') + '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle"' + (col === '#FFFFFF' ? '' : ' stroke="#FFFDF7" stroke-width="4" paint-order="stroke"') + '>' + str + '</text>';
  }
  function dots(cols, rows, gap, col) {
    var m = '';
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) m += '<circle cx="' + c * gap + '" cy="' + r * gap + '" r="' + (gap * 0.38) + '" fill="' + (col || '#6C4DF6') + '"/>';
    return m;
  }
  function circ(r, fill, stroke) { return '<circle r="' + r + '" fill="' + (fill || '#FFFFFF') + '" stroke="' + (stroke || '#2D1B69') + '" stroke-width="3"/>'; }
  /* a root sign drawn as a path, with the number under it; index = '3' for a cube root */
  function root(num, size, index) {
    var w = String(num).length * size * 0.6 + 10, h = size * 1.1;
    var m = '<path d="M0 ' + (-h * 0.1) + ' L' + (size * 0.18) + ' ' + (-h * 0.22) + ' L' + (size * 0.38) + ' ' + (h * 0.45) + ' L' + (size * 0.62) + ' ' + (-h * 0.55) + ' H' + (size * 0.62 + w) + '" fill="none" stroke="#1E1B3A" stroke-width="' + Math.max(3, size / 12) + '" stroke-linejoin="round" stroke-linecap="round"/>';
    if (index) m += T(size * 0.12, -h * 0.5, index, Math.max(18, size * 0.42), '#1E1B3A', 700);
    return m + T(size * 0.62 + w / 2, 2, num, size, '#1E1B3A', 700);
  }
  function hideAll(s, names) { names.forEach(function (k) { s.hide(s.ref[k]); }); }

  Theory.scenes({
    /* ---------- 1. Factors ---------- */
    'fac-arrays': function (s) {
      s.text(320, 36, 'Factors of 12', { size: 32, weight: 700, colour: s.C.fun });
      var spots = [[-60, -30], [-20, -50], [25, -40], [65, -20], [-75, 10], [-30, -5], [15, 0], [55, 20], [-50, 45], [-5, 40], [40, 55], [80, 60]];
      s.add(spots.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="12" fill="#6C4DF6"/>'; }).join(''), { x: 320, y: 190, enter: 'pop', delay: 300, name: 'heap' });
      s.text(320, 290, '12 counters', { size: 24, colour: s.C.muted, delay: 800, name: 'heapt' });
      s.owl(560, 352, 90, { delay: 500, name: 'owl' });
    },
    'fac-pairs': function (s) {
      hideAll(s, ['heap', 'heapt', 'owl']);
      s.add(dots(12, 1, 28), { x: 60, y: 92, enter: 'left', delay: 200 });
      s.text(480, 92, '1 × 12', { size: 30, weight: 700, colour: s.C.fun, delay: 500 });
      s.add(dots(6, 2, 28, '#2F80ED'), { x: 60, y: 160, enter: 'left', delay: 1000 });
      s.text(290, 174, '2 × 6', { size: 30, weight: 700, colour: s.C.blue, delay: 1300 });
      s.add(dots(4, 3, 28, '#FF8A3D'), { x: 410, y: 160, enter: 'left', delay: 1800 });
      s.text(560, 188, '3 × 4', { size: 30, weight: 700, colour: s.C.orange, delay: 2100 });
    },
    'fac-list': function (s) {
      s.text(320, 278, '1, 2, 3, 4, 6, 12', { size: 34, weight: 700, colour: s.C.deep });
      s.add('<rect x="-80" y="-20" width="160" height="40" rx="20" fill="#22A06B"/>' + T(0, 1, '6 factors', 22, '#FFFFFF', 700), { x: 320, y: 330, enter: 'pop', delay: 800 });
    },
    'fac-hcf': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Highest common factor', { size: 30, weight: 700, colour: s.C.fun });
      var A = [1, 2, 3, 4, 6, 8, 12, 24], B = [1, 2, 3, 4, 6, 9, 12, 18, 36];
      [[A, '24', 110], [B, '36', 200]].forEach(function (r, ri) {
        s.text(60, r[2], r[1] + ':', { size: 26, weight: 700, colour: s.C.deep, delay: ri * 800 });
        r[0].forEach(function (v, i) {
          var common = A.indexOf(v) >= 0 && B.indexOf(v) >= 0;
          s.add(circ(23, '#FFFFFF', '#9AA0B4') + T(0, 1, String(v), 22, '#1E1B3A', 700), { x: 120 + i * 58, y: r[2], enter: 'pop', delay: ri * 800 + i * 80 });
          if (common) s.add(circ(23, '#DDF7EE', '#22A06B') + T(0, 1, String(v), 22, '#0E7A5A', 700), { x: 120 + i * 58, y: r[2], enter: 'fade', delay: 2000 + i * 100 });
        });
      });
      s.add('<circle r="30" fill="none" stroke="#FF5D8F" stroke-width="5"/>', { x: 120 + 6 * 58, y: 110, enter: 'pop', delay: 2900 });
      s.add('<circle r="30" fill="none" stroke="#FF5D8F" stroke-width="5"/>', { x: 120 + 6 * 58, y: 200, enter: 'pop', delay: 2900 });
      s.text(300, 290, 'HCF of 24 and 36 = 12', { size: 32, weight: 700, colour: s.C.pink, delay: 3300 });
      s.owl(590, 352, 60, { delay: 1500 });
    },

    /* ---------- 2. Multiples ---------- */
    'mul-list': function (s) {
      s.text(320, 36, 'Multiples', { size: 32, weight: 700, colour: s.C.fun });
      var m = '';
      for (var k = 1; k <= 24; k++) {
        var c = (k - 1) % 12, r = Math.floor((k - 1) / 12);
        m += '<rect x="' + (c * 44) + '" y="' + (r * 50) + '" width="44" height="50" fill="#FFFFFF" stroke="#C9CED8" stroke-width="2"/>' + T(c * 44 + 22, r * 50 + 26, String(k), 20, '#55526E', 600);
      }
      s.add(m, { x: 56, y: 80, enter: 'fade' });
      [4, 8, 12, 16, 20, 24].forEach(function (k, i) {
        var c = (k - 1) % 12, r = Math.floor((k - 1) / 12);
        s.add('<rect x="2" y="2" width="40" height="46" rx="6" fill="#2F80ED"/>' + T(22, 26, String(k), 22, '#FFFFFF', 700), { x: 56 + c * 44, y: 80 + r * 50, enter: 'pop', delay: 600 + i * 300 });
      });
      s.text(56, 214, 'multiples of 4', { size: 22, weight: 700, colour: s.C.blue, anchor: 'start', delay: 2400 });
    },
    'mul-lcm': function (s) {
      [6, 12, 18, 24].forEach(function (k, i) {
        var c = (k - 1) % 12, r = Math.floor((k - 1) / 12);
        s.add('<rect x="3" y="3" width="38" height="44" rx="6" fill="none" stroke="#FF8A3D" stroke-width="5"/>', { x: 56 + c * 44, y: 80 + r * 50, enter: 'pop', delay: i * 300 });
      });
      s.text(584, 214, 'multiples of 6', { size: 22, weight: 700, colour: s.C.orange, anchor: 'end', delay: 1300 });
      s.add('<path d="M0 -14 L4 -4 L15 -4 L6 3 L9 14 L0 7 L-9 14 L-6 3 L-15 -4 L-4 -4 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="2"/>', { x: 56 + 11 * 44 + 22, y: 64, enter: 'pop', delay: 1800 });
      s.text(320, 285, 'LCM of 4 and 6 = 12', { size: 34, weight: 700, colour: s.C.pink, enter: 'pop', delay: 2200 });
    },
    'mul-bus': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 32, 'When do the buses meet?', { size: 28, weight: 700, colour: s.C.fun });
      /* 0 to 60 minutes: 8 px per minute from x 80 */
      function X(t) { return 80 + t * 8; }
      [[12, 130, '#2F80ED', 'every 12 min'], [18, 220, '#FF8A3D', 'every 18 min']].forEach(function (b, i) {
        s.add('<path d="M' + X(0) + ' 0 H' + X(60) + '" stroke="#1E1B3A" stroke-width="3"/>', { y: b[1], enter: 'fade', delay: i * 400 });
        s.text(X(0), b[1] - 30, b[3], { size: 20, weight: 700, colour: b[2], anchor: 'start', delay: i * 400 });
        for (var t = 0, k = 0; t <= 60; t += b[0], k++) {
          s.add('<rect x="-16" y="-12" width="32" height="22" rx="5" fill="' + b[2] + '"/><circle cx="-8" cy="11" r="4" fill="#1E1B3A"/><circle cx="8" cy="11" r="4" fill="#1E1B3A"/>', { x: X(t), y: b[1] - 4, enter: 'pop', delay: 600 + i * 400 + k * 300 });
          s.text(X(t), b[1] + 28, String(t), { size: 18, colour: s.C.muted, delay: 600 + i * 400 + k * 300 });
        }
      });
      s.add('<rect x="-26" y="-14" width="52" height="134" rx="12" fill="none" stroke="#FF5D8F" stroke-width="4" stroke-dasharray="7 5"/>', { x: X(36), y: 110, enter: 'pop', delay: 2800 });
      s.text(X(0), 285, '9:00', { size: 22, weight: 700, delay: 3000 });
      s.text(X(36), 285, '9:36', { size: 22, weight: 700, colour: s.C.pink, delay: 3000 });
      s.text(320, 330, 'LCM of 12 and 18 = 36', { size: 28, weight: 700, colour: s.C.pink, delay: 3300 });
    },

    /* ---------- 3. Prime numbers ---------- */
    'prime-def': function (s) {
      s.text(320, 36, 'Prime numbers', { size: 32, weight: 700, colour: s.C.fun });
      s.add(dots(7, 1, 40, '#FF5D8F'), { x: 80, y: 120, enter: 'left', delay: 300 });
      s.text(480, 120, '1 × 7', { size: 32, weight: 700, colour: s.C.pink, delay: 900 });
      s.text(260, 200, 'factors of 7:  1  and  7', { size: 28, weight: 700, delay: 1500 });
      s.add('<rect x="-120" y="-22" width="240" height="44" rx="22" fill="#FFE3EC" stroke="#FF5D8F" stroke-width="3"/>' + T(0, 1, 'exactly 2: prime!', 24, '#C2185B', 700), { x: 260, y: 270, enter: 'pop', delay: 2200 });
      s.owl(560, 352, 90, { delay: 600 });
    },
    'prime-not': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M0 20 V340" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { x: 400, enter: 'fade' });
      s.text(200, 40, '9 is not prime', { size: 28, weight: 700, colour: s.C.blue });
      s.add(dots(3, 3, 40, '#2F80ED'), { x: 160, y: 100, enter: 'pop', delay: 300 });
      s.text(200, 250, '3 × 3', { size: 28, weight: 700, colour: s.C.blue, delay: 700 });
      s.text(200, 300, 'factors: 1, 3, 9', { size: 24, weight: 700, delay: 1000 });
      s.text(520, 40, '1 is not prime', { size: 28, weight: 700, colour: s.C.orange, delay: 1600 });
      s.add('<circle r="15" fill="#FF8A3D"/>', { x: 520, y: 140, enter: 'pop', delay: 1900 });
      s.text(520, 250, 'only 1 factor', { size: 24, weight: 700, delay: 2300 });
    },
    'prime-grid': function (s) {
      s.clear(); s.ref = {};
      var P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29], m = '';
      for (var k = 1; k <= 30; k++) {
        var c = (k - 1) % 10, r = Math.floor((k - 1) / 10);
        m += '<rect x="' + c * 52 + '" y="' + r * 56 + '" width="52" height="56" fill="#FFFFFF" stroke="#C9CED8" stroke-width="2"/>' + T(c * 52 + 26, r * 56 + 29, String(k), 22, '#9AA0B4', 600);
      }
      s.add(m, { x: 60, y: 40, enter: 'fade' });
      P.forEach(function (p, i) {
        var c = (p - 1) % 10, r = Math.floor((p - 1) / 10);
        s.add('<rect x="3" y="3" width="46" height="50" rx="10" fill="#FF5D8F"/>' + T(26, 29, String(p), 24, '#FFFFFF', 700), { x: 60 + c * 52, y: 40 + r * 56, enter: 'pop', delay: 400 + i * 220 });
      });
      s.add('<circle r="34" fill="none" stroke="#FFC93C" stroke-width="5"/>', { x: 60 + 52 + 26, y: 69, enter: 'pop', delay: 3000 });
      s.text(60, 250, '2 is the only even prime', { size: 26, weight: 700, colour: s.C.orange, anchor: 'start', delay: 3200 });
      s.text(60, 300, '10 primes up to 30', { size: 24, weight: 700, colour: s.C.pink, anchor: 'start', delay: 3600 });
      s.owl(570, 352, 90, { delay: 1000 });
    },

    /* ---------- 4. Prime factor trees ---------- */
    'tree-start': function (s) {
      s.add(circ(30, '#EDE7FF', '#6C4DF6') + T(0, 1, '60', 28, '#2D1B69', 700), { x: 320, y: 60, enter: 'pop' });
      s.add('<path d="M300 84 L215 128 M340 84 L425 128" stroke="#2D1B69" stroke-width="4" stroke-linecap="round"/>', { enter: 'fade', delay: 600 });
      s.add(circ(26) + T(0, 1, '6', 26, '#1E1B3A', 700), { x: 200, y: 150, enter: 'pop', delay: 900 });
      s.add(circ(26) + T(0, 1, '10', 26, '#1E1B3A', 700), { x: 440, y: 150, enter: 'pop', delay: 1100 });
      s.text(320, 150, '×', { size: 30, weight: 700, colour: s.C.muted, delay: 1300 });
      s.owl(580, 352, 80, { delay: 400 });
    },
    'tree-grow': function (s) {
      s.add('<path d="M185 172 L150 218 M215 172 L250 218 M425 172 L390 218 M455 172 L490 218" stroke="#2D1B69" stroke-width="4" stroke-linecap="round"/>', { enter: 'fade' });
      [[140, '2'], [260, '3'], [380, '2'], [500, '5']].forEach(function (p, i) {
        s.add(circ(26, '#FFE3EC', '#FF5D8F') + T(0, 1, p[1], 26, '#C2185B', 700), { x: p[0], y: 240, enter: 'pop', delay: 400 + i * 300 });
      });
      s.text(200, 240, '×', { size: 26, weight: 700, colour: s.C.muted, delay: 900 });
      s.text(440, 240, '×', { size: 26, weight: 700, colour: s.C.muted, delay: 1500 });
      s.text(565, 140, 'primes', { size: 20, weight: 700, colour: s.C.pink, delay: 1900 });
      s.text(565, 164, 'have a ring', { size: 20, weight: 700, colour: s.C.pink, delay: 1900 });
    },
    'tree-answer': function (s) {
      s.text(320, 300, '60 = 2 × 2 × 3 × 5', { size: 30, weight: 700, colour: s.C.deep });
      s.text(320, 338, '= 2² × 3 × 5', { size: 28, weight: 700, colour: s.C.green, enter: 'pop', delay: 1200 });
    },

    /* ---------- 5. Powers and roots ---------- */
    'sq': function (s) {
      /* 4 by 4 square of 40 px tiles */
      var m = '';
      for (var i = 0; i < 16; i++) m += '<rect x="' + (i % 4) * 40 + '" y="' + Math.floor(i / 4) * 40 + '" width="40" height="40" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/>';
      s.add(m, { x: 90, y: 110, enter: 'pop' });
      s.text(170, 84, '4', { size: 26, weight: 700, colour: s.C.orange, delay: 500 });
      s.text(64, 190, '4', { size: 26, weight: 700, colour: s.C.orange, delay: 500 });
      s.text(450, 130, '4² = 4 × 4', { size: 38, weight: 700, delay: 900 });
      s.text(450, 200, '= 16', { size: 44, weight: 700, colour: s.C.green, enter: 'pop', delay: 1600 });
      s.text(450, 260, '16 small squares', { size: 22, colour: s.C.muted, delay: 2000 });
      s.text(320, 36, 'Square numbers', { size: 30, weight: 700, colour: s.C.fun });
    },
    'cube': function (s) {
      s.clear(); s.ref = {};
      s.text(450, 36, 'Cube numbers', { size: 30, weight: 700, colour: s.C.fun });
      /* isometric 4 x 4 x 4 cube: P(i, j, k) = O + i(26, 15) + j(-26, 15) + k(0, -30) */
      var O = [170, 200];
      function P(i, j, k) { return (O[0] + 26 * i - 26 * j) + ' ' + (O[1] + 15 * i + 15 * j - 30 * k); }
      function quad(a, b, c, d, fill) { return '<path d="M' + a + ' L' + b + ' L' + c + ' L' + d + ' Z" fill="' + fill + '" stroke="#2D1B69" stroke-width="2" stroke-linejoin="round"/>'; }
      var m = '';
      for (var a = 0; a < 4; a++) for (var b = 0; b < 4; b++) {
        m += quad(P(a, b, 4), P(a + 1, b, 4), P(a + 1, b + 1, 4), P(a, b + 1, 4), '#CFE8FF');          // top
        m += quad(P(4, a, b), P(4, a + 1, b), P(4, a + 1, b + 1), P(4, a, b + 1), '#2F80ED');          // right face
        m += quad(P(a, 4, b), P(a + 1, 4, b), P(a + 1, 4, b + 1), P(a, 4, b + 1), '#6FA8F5');          // left face
      }
      s.add(m, { enter: 'pop' });
      s.text(450, 130, '4³ = 4 × 4 × 4', { size: 36, weight: 700, delay: 800 });
      s.text(450, 200, '= 64', { size: 44, weight: 700, colour: s.C.green, enter: 'pop', delay: 1600 });
      s.text(450, 260, '64 small cubes', { size: 22, colour: s.C.muted, delay: 2000 });
    },
    'roots': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Roots go backwards', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<path d="M0 70 V330" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { x: 320, enter: 'fade' });
      s.add(root('81', 44) + T(110, 2, '= 9', 44, '#22A06B', 700, 'start'), { x: 50, y: 140, enter: 'pop', delay: 300 });
      s.text(165, 230, 'because 9 × 9 = 81', { size: 24, weight: 700, colour: s.C.muted, delay: 1000 });
      s.text(165, 280, 'square root', { size: 22, weight: 700, colour: s.C.blue, delay: 1200 });
      s.add(root('125', 44, '3') + T(132, 2, '= 5', 44, '#22A06B', 700, 'start'), { x: 360, y: 140, enter: 'pop', delay: 1800 });
      s.text(480, 230, 'because 5 × 5 × 5 = 125', { size: 22, weight: 700, colour: s.C.muted, delay: 2500 });
      s.text(480, 280, 'cube root', { size: 22, weight: 700, colour: s.C.blue, delay: 2700 });
    },
    'sq-list': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Square numbers to learn', { size: 30, weight: 700, colour: s.C.fun });
      for (var n = 1; n <= 12; n++) {
        var c = (n - 1) % 6, r = Math.floor((n - 1) / 6);
        s.add('<rect x="-42" y="-44" width="84" height="88" rx="16" fill="#FFF4D6" stroke="#FFC93C" stroke-width="3"/>' +
          T(0, -12, String(n * n), 32, '#2D1B69', 700) + T(0, 24, n + '²', 20, '#C2570C', 700), { x: 85 + c * 94, y: 120 + r * 104, enter: 'pop', delay: n * 180 });
      }
      s.owl(320, 356, 60, { delay: 2400 });
    }
  });
})();
