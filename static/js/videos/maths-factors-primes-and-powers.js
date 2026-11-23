/* Pictures for the Factors, primes and powers theory video (words: videos/maths/factors-primes-and-powers.json).
   Stage is 640 x 360; see static/js/theory.js. Counter arrays, the bus timeline (8 px per minute) and the square and cube are to scale. */
(function () {
  if (!window.Theory) return;

  var FONT = 'Fredoka, Trebuchet MS, sans-serif';
  function T(x, y, str, size, col, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + FONT + '" font-size="' + (size || 26) + '" font-weight="' + (weight || 600) +
      '" fill="' + (col || '#1E1B3A') + '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle"' + (col === '#FFFFFF' ? '' : ' stroke="#FFFDF7" stroke-width="4" paint-order="stroke"') + '>' + str + '</text>';
  }
  /* Shiny drawing helpers. Every gradient gets its own id (prefix + counter), so no two groups on the page share one. */
  var OL = 'rgba(30,27,58,.35)', uid = 0;
  function gid() { return 'mAfp' + (++uid); }
  function lin(c1, c2) {   // a top-to-bottom gradient: [defs markup, fill url]
    var id = gid();
    return ['<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>', 'url(#' + id + ')'];
  }
  function rad(c1, c2) {   // a ball-like gradient, lit from the top left: [defs markup, fill url]
    var id = gid();
    return ['<radialGradient id="' + id + '" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></radialGradient>', 'url(#' + id + ')'];
  }
  /* a rounded card with a gradient, a white sheen along the top and a thin outline */
  function panel(x, y, w, h, c1, c2, o) {
    o = o || {};
    var g = lin(c1, c2), rx = o.rx == null ? 14 : o.rx, inset = Math.max(8, rx * 0.8);
    return '<defs>' + g[0] + '</defs><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + g[1] + '" stroke="' + (o.stroke || OL) + '" stroke-width="' + (o.sw || 2) + '"/>' +
      '<rect x="' + (x + inset) + '" y="' + (y + 3) + '" width="' + Math.max(0, w - 2 * inset) + '" height="' + Math.min(7, h * 0.16) + '" rx="' + Math.min(3.5, h * 0.08) + '" fill="#fff" opacity="' + (o.sheen || 0.5) + '"/>';
  }
  function pill(x, y, w, h, c1, c2, label, size) {   // a pill label with white text
    return panel(x, y, w, h, c1, c2, { rx: h / 2, sheen: 0.35 }) + T(x + w / 2, y + h / 2 + 1, label, size || 20, '#FFFFFF', 700);
  }
  /* light and dark ends of the ball gradient for each counter colour */
  var BALLS = { '#6C4DF6': ['#A190FF', '#4A2FD0'], '#2F80ED': ['#7DB8FF', '#1F5FC0'], '#FF8A3D': ['#FFB880', '#D9621F'], '#FF5D8F': ['#FFA3C0', '#D93A6E'] };
  function counter(cx, cy, r, fill) {   // one shiny counter
    return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + fill + '" stroke="' + OL + '" stroke-width="1.5"/>' +
      '<ellipse cx="' + (cx - r * 0.3) + '" cy="' + (cy - r * 0.38) + '" rx="' + (r * 0.34) + '" ry="' + (r * 0.2) + '" fill="#fff" opacity=".6"/>';
  }
  function dots(cols, rows, gap, col) {
    var p = BALLS[col || '#6C4DF6'], g = rad(p[0], p[1]), m = '<defs>' + g[0] + '</defs>';
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++) m += counter(c * gap, r * gap, gap * 0.38, g[1]);
    return m;
  }
  function circ(r, fill, stroke) {   // a round token: white at the top left, the given colour at the edge
    var g = rad('#FFFFFF', fill && fill !== '#FFFFFF' ? fill : '#ECEAF4');
    return '<defs>' + g[0] + '</defs><circle r="' + r + '" fill="' + g[1] + '" stroke="' + (stroke || '#2D1B69') + '" stroke-width="3"/>' +
      '<path d="M' + (-r * 0.62) + ' ' + (-r * 0.3) + ' A' + (r * 0.7) + ' ' + (r * 0.7) + ' 0 0 1 ' + (-r * 0.2) + ' ' + (-r * 0.66) + '" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".9"/>';
  }
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
      var hg = rad(BALLS['#6C4DF6'][0], BALLS['#6C4DF6'][1]);
      s.add('<defs>' + hg[0] + '</defs>' + spots.map(function (p) { return counter(p[0], p[1], 12, hg[1]); }).join(''), { x: 320, y: 190, enter: 'pop', delay: 300, name: 'heap' });
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
      s.add(panel(-160, -28, 320, 56, '#FFFFFF', '#F1EDFF', { rx: 28 }), { x: 320, y: 278, enter: 'up' });
      s.text(320, 278, '1, 2, 3, 4, 6, 12', { size: 34, weight: 700, colour: s.C.deep });
      s.add(pill(-80, -20, 160, 40, '#4CC98F', '#1E8F5E', '6 factors', 22), { x: 320, y: 330, enter: 'pop', delay: 800 });
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
      s.add('<rect x="-6" y="-6" width="540" height="112" rx="12" fill="#FFFFFF" stroke="' + OL + '" stroke-width="2"/>' + m, { x: 56, y: 80, enter: 'fade', flat: true });
      [4, 8, 12, 16, 20, 24].forEach(function (k, i) {
        var c = (k - 1) % 12, r = Math.floor((k - 1) / 12);
        s.add(panel(2, 2, 40, 46, '#6FB0FF', '#1F66C9', { rx: 8, sheen: 0.35 }) + T(22, 26, String(k), 22, '#FFFFFF', 700), { x: 56 + c * 44, y: 80 + r * 50, enter: 'pop', delay: 600 + i * 300 });
      });
      s.text(56, 214, 'multiples of 4', { size: 22, weight: 700, colour: s.C.blue, anchor: 'start', delay: 2400 });
    },
    'mul-lcm': function (s) {
      [6, 12, 18, 24].forEach(function (k, i) {
        var c = (k - 1) % 12, r = Math.floor((k - 1) / 12);
        s.add('<rect x="3" y="3" width="38" height="44" rx="6" fill="none" stroke="#FF8A3D" stroke-width="5"/>', { x: 56 + c * 44, y: 80 + r * 50, enter: 'pop', delay: i * 300 });
      });
      s.text(584, 214, 'multiples of 6', { size: 22, weight: 700, colour: s.C.orange, anchor: 'end', delay: 1300 });
      var st = rad('#FFF1B8', '#F5B416');
      s.add('<defs>' + st[0] + '</defs><path d="M0 -14 L4 -4 L15 -4 L6 3 L9 14 L0 7 L-9 14 L-6 3 L-15 -4 L-4 -4 Z" fill="' + st[1] + '" stroke="#C2570C" stroke-width="2" stroke-linejoin="round"/>', { x: 56 + 11 * 44 + 22, y: 64, enter: 'pop', delay: 1800 });
      s.text(320, 285, 'LCM of 4 and 6 = 12', { size: 34, weight: 700, colour: s.C.pink, enter: 'pop', delay: 2200 });
    },
    'mul-bus': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 32, 'When do the buses meet?', { size: 28, weight: 700, colour: s.C.fun });
      /* 0 to 60 minutes: 8 px per minute from x 80 */
      function X(t) { return 80 + t * 8; }
      [[12, 130, '#2F80ED', 'every 12 min'], [18, 220, '#FF8A3D', 'every 18 min']].forEach(function (b, i) {
        s.add('<path d="M' + X(0) + ' 0 H' + X(60) + '" stroke="#1E1B3A" stroke-width="3" stroke-linecap="round"/>', { y: b[1], enter: 'fade', delay: i * 400, flat: true });
        s.text(X(0), b[1] - 30, b[3], { size: 20, weight: 700, colour: b[2], anchor: 'start', delay: i * 400 });
        for (var t = 0, k = 0; t <= 60; t += b[0], k++) {
          s.add(panel(-16, -12, 32, 22, i ? '#FFB273' : '#72B2FF', i ? '#D9621F' : '#1F5FC0', { rx: 5, sheen: 0.4 }) +
            '<rect x="-12" y="-6" width="7" height="6" rx="1.5" fill="#E3F2FF"/><rect x="-3" y="-6" width="7" height="6" rx="1.5" fill="#E3F2FF"/><rect x="6" y="-6" width="7" height="6" rx="1.5" fill="#E3F2FF"/>' +
            '<circle cx="-8" cy="11" r="4" fill="#2A2740"/><circle cx="-8" cy="11" r="1.6" fill="#D5D9E3"/><circle cx="8" cy="11" r="4" fill="#2A2740"/><circle cx="8" cy="11" r="1.6" fill="#D5D9E3"/>', { x: X(t), y: b[1] - 4, enter: 'pop', delay: 600 + i * 400 + k * 300 });
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
      s.add(panel(-120, -22, 240, 44, '#FFF3F7', '#FFCFDF', { rx: 22, stroke: 'rgba(226,61,116,.75)', sw: 2.5 }) + T(0, 1, 'exactly 2: prime!', 24, '#C2185B', 700), { x: 260, y: 270, enter: 'pop', delay: 2200 });
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
      var one = rad(BALLS['#FF8A3D'][0], BALLS['#FF8A3D'][1]);
      s.add('<defs>' + one[0] + '</defs>' + counter(0, 0, 15, one[1]), { x: 520, y: 140, enter: 'pop', delay: 1900 });
      s.text(520, 250, 'only 1 factor', { size: 24, weight: 700, delay: 2300 });
    },
    'prime-grid': function (s) {
      s.clear(); s.ref = {};
      var P = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29], m = '';
      for (var k = 1; k <= 30; k++) {
        var c = (k - 1) % 10, r = Math.floor((k - 1) / 10);
        m += '<rect x="' + c * 52 + '" y="' + r * 56 + '" width="52" height="56" fill="#FFFFFF" stroke="#C9CED8" stroke-width="2"/>' + T(c * 52 + 26, r * 56 + 29, String(k), 22, '#9AA0B4', 600);
      }
      s.add('<rect x="-6" y="-6" width="532" height="180" rx="12" fill="#FFFFFF" stroke="' + OL + '" stroke-width="2"/>' + m, { x: 60, y: 40, enter: 'fade', flat: true });
      P.forEach(function (p, i) {
        var c = (p - 1) % 10, r = Math.floor((p - 1) / 10);
        s.add(panel(3, 3, 46, 50, '#FF9DBB', '#E23D74', { rx: 10, sheen: 0.35 }) + T(26, 29, String(p), 24, '#FFFFFF', 700), { x: 60 + c * 52, y: 40 + r * 56, enter: 'pop', delay: 400 + i * 220 });
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
      var tile = lin('#FFE38A', '#F5B416');
      m = '<defs>' + tile[0] + '</defs>';
      for (var i = 0; i < 16; i++) m += '<rect x="' + (i % 4) * 40 + '" y="' + Math.floor(i / 4) * 40 + '" width="40" height="40" fill="' + tile[1] + '" stroke="#C2570C" stroke-width="3"/>' +
        '<rect x="' + ((i % 4) * 40 + 6) + '" y="' + (Math.floor(i / 4) * 40 + 5) + '" width="28" height="4" rx="2" fill="#fff" opacity=".5"/>';
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
      var top = lin('#F2F9FF', '#BCDBFB'), right = lin('#4A97F5', '#1D5BB8'), left = lin('#9CC6FA', '#5E98E6');
      var m = '<defs>' + top[0] + right[0] + left[0] + '</defs>';
      for (var a = 0; a < 4; a++) for (var b = 0; b < 4; b++) {
        m += quad(P(a, b, 4), P(a + 1, b, 4), P(a + 1, b + 1, 4), P(a, b + 1, 4), top[1]);          // top
        m += quad(P(4, a, b), P(4, a + 1, b), P(4, a + 1, b + 1), P(4, a, b + 1), right[1]);          // right face
        m += quad(P(a, 4, b), P(a + 1, 4, b), P(a + 1, 4, b + 1), P(a, 4, b + 1), left[1]);          // left face
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
      s.add(panel(24, 92, 284, 216, '#FFFFFF', '#EEF5FF', { rx: 20 }), { enter: 'fade', delay: 300 });
      s.add(panel(332, 92, 298, 216, '#FFFFFF', '#EEF5FF', { rx: 20 }), { enter: 'fade', delay: 1800 });
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
        s.add(panel(-42, -44, 84, 88, '#FFFBEC', '#FFE39A', { rx: 16, stroke: 'rgba(214,150,20,.8)', sw: 2.5 }) +
          T(0, -12, String(n * n), 32, '#2D1B69', 700) + T(0, 24, n + '²', 20, '#C2570C', 700), { x: 85 + c * 94, y: 120 + r * 104, enter: 'pop', delay: n * 180 });
      }
      s.owl(320, 356, 60, { delay: 2400 });
    }
  });
})();
