/* Pictures for the Fractions, decimals and percentages theory video (words: videos/maths/fractions-decimals-percentages.json).
   Stage is 640 x 360; see static/js/theory.js. Pies, bars, grids and number lines are split into exactly equal parts, to scale. */
(function () {
  if (!window.Theory) return;

  var FONT = 'Fredoka, Trebuchet MS, sans-serif';
  var SH = '#FFC93C', SH2 = '#FF8A3D', LN = '#2D1B69', EMPTY = '#FFFFFF';
  function T(x, y, str, size, col, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + FONT + '" font-size="' + (size || 26) + '" font-weight="' + (weight || 600) +
      '" fill="' + (col || '#1E1B3A') + '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle"' + (col === '#FFFFFF' ? '' : ' stroke="#FFFDF7" stroke-width="4" paint-order="stroke"') + '>' + str + '</text>';
  }
  function tw(str, size) { return String(str).length * size * 0.58; }
  /* a stacked fraction centred at (x, y) */
  function F(x, y, a, b, size, col) {
    size = size || 30; col = col || '#1E1B3A';
    var w = Math.max(tw(a, size), tw(b, size)) + 8;
    return T(x, y - size * 0.62, a, size, col, 700) + '<rect x="' + (x - w / 2) + '" y="' + (y - 2) + '" width="' + w + '" height="4" rx="2" fill="' + col + '"/>' + T(x, y + size * 0.66, b, size, col, 700);
  }
  /* a row of items centred at x: strings, or [top, bottom] fractions */
  function row(items, x, y, size, col) {
    var gap = size * 0.35, ws = items.map(function (it) { return Array.isArray(it) ? Math.max(tw(it[0], size), tw(it[1], size)) + 8 : tw(it, size); });
    var total = ws.reduce(function (p, w) { return p + w; }, 0) + gap * (items.length - 1), cx = x - total / 2, m = '';
    items.forEach(function (it, i) {
      var c = cx + ws[i] / 2;
      m += Array.isArray(it) ? F(c, y, it[0], it[1], size, col) : T(c, y, it, size, col, 700);
      cx += ws[i] + gap;
    });
    return m;
  }
  function bar(x, y, w, h, parts, shade, cols) {   // shade = number of shaded parts from the left
    var m = '', pw = w / parts;
    for (var i = 0; i < parts; i++) m += '<rect x="' + (x + i * pw) + '" y="' + y + '" width="' + pw + '" height="' + h + '" fill="' + (i < shade ? (cols ? cols[i] : SH) : EMPTY) + '" stroke="' + LN + '" stroke-width="3"/>';
    return m;
  }
  function slice(r, i, d) {
    var a0 = 2 * Math.PI * i / d - Math.PI / 2, a1 = 2 * Math.PI * (i + 1) / d - Math.PI / 2;
    return 'M0 0 L' + (r * Math.cos(a0)).toFixed(2) + ' ' + (r * Math.sin(a0)).toFixed(2) + ' A' + r + ' ' + r + ' 0 0 1 ' + (r * Math.cos(a1)).toFixed(2) + ' ' + (r * Math.sin(a1)).toFixed(2) + ' Z';
  }
  function hideAll(s, names) { names.forEach(function (k) { s.hide(s.ref[k]); }); }

  Theory.scenes({
    /* ---------- 1. What a fraction means ---------- */
    'fr-pizza': function (s) {
      var m = '<circle r="118" fill="#E0A96D" stroke="#8A5A2B" stroke-width="4"/>';
      for (var i = 0; i < 8; i++) m += '<path d="' + slice(105, i, 8) + '" fill="#FFF4D6" stroke="#C2570C" stroke-width="3"/>';
      s.add(m, { x: 190, y: 185, enter: 'pop' });
      s.text(470, 120, '8 equal parts', { size: 30, weight: 700, colour: s.C.deep, delay: 700 });
      s.text(470, 165, 'the bottom number', { size: 22, colour: s.C.muted, delay: 1000 });
      s.owl(560, 352, 80, { delay: 500, name: 'owl' });
    },
    'fr-pizza-label': function (s) {
      s.hide(s.ref.owl);
      for (var i = 0; i < 3; i++) s.add('<path d="' + slice(105, i, 8) + '" fill="' + SH2 + '" stroke="#C2570C" stroke-width="3"/>', { x: 190, y: 185, enter: 'fade', delay: i * 400 });
      s.add(F(0, 0, '3', '8', 48, '#2D1B69'), { x: 400, y: 245, enter: 'pop', delay: 1400 });
      s.text(440, 212, '← shaded', { size: 20, weight: 700, colour: s.C.orange, anchor: 'start', delay: 1800 });
      s.text(440, 282, '← parts in all', { size: 20, weight: 700, colour: s.C.deep, anchor: 'start', delay: 2100 });
    },
    'fr-line': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Fractions on a number line', { size: 30, weight: 700, colour: s.C.fun });
      /* 0 at x 80, 1 at x 560: each fifth is 96 px, so 3/5 is at x 368 */
      var m = '<path d="M70 0 H570" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/>';
      for (var k = 0; k <= 5; k++) m += '<path d="M' + (80 + k * 96) + ' -12 V12" stroke="#1E1B3A" stroke-width="3"/>';
      m += T(80, 40, '0', 26, '#1E1B3A', 700) + T(560, 40, '1', 26, '#1E1B3A', 700);
      s.add(m, { y: 220, enter: 'fade' });
      for (var j = 0; j < 5; j++) s.add('<path d="M6 0 H90" stroke="#6C4DF6" stroke-width="6" stroke-linecap="round"/>', { x: 80 + j * 96, y: 220, enter: 'left', delay: 500 + j * 250 });
      s.arrow(368, 100, 100, 'd', { colour: s.C.pink, width: 8, delay: 2000 });
      s.add(F(0, 0, '3', '5', 30, '#FF5D8F'), { x: 420, y: 125, enter: 'pop', delay: 2400 });
      s.owl(590, 352, 60, { delay: 900 });
    },
    'fr-compare': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Same length bars', { size: 30, weight: 700, colour: s.C.fun });
      /* both bars 480 px: 2/3 is 320 px, 3/5 is 288 px */
      s.add(F(0, 0, '2', '3', 26), { x: 50, y: 125, enter: 'fade' });
      s.add(bar(90, 100, 480, 50, 3, 2), { enter: 'left', delay: 200 });
      s.add(F(0, 0, '3', '5', 26), { x: 50, y: 225, enter: 'fade', delay: 700 });
      s.add(bar(90, 200, 480, 50, 5, 3, [SH2, SH2, SH2]), { enter: 'left', delay: 900 });
      s.add('<path d="M410 85 V265" stroke="#E5484D" stroke-width="3" stroke-dasharray="6 6"/>', { enter: 'fade', delay: 1700 });
      s.add(row([['2', '3'], '&gt;', ['3', '5']], 0, 0, 28, '#22A06B'), { x: 320, y: 315, enter: 'pop', delay: 2200 });
    },

    /* ---------- 2. Equivalent fractions ---------- */
    'eq-bars': function (s) {
      [[1, 2, 60], [2, 4, 150], [4, 8, 240]].forEach(function (r, i) {
        s.add(F(0, 0, String(r[0]), String(r[1]), 24), { x: 90, y: r[2] + 24, enter: 'fade', delay: i * 600 });
        s.add(bar(140, r[2], 400, 48, r[1], r[0]), { enter: 'left', delay: i * 600 });
      });
      s.add('<path d="M340 45 V305" stroke="#E5484D" stroke-width="3" stroke-dasharray="6 6"/>', { enter: 'fade', delay: 2000 });
      s.text(340, 330, 'the same amount', { size: 22, weight: 700, colour: s.C.red, delay: 2200 });
    },
    'eq-multiply': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Equivalent fractions', { size: 30, weight: 700, colour: s.C.fun });
      s.add(F(0, 0, '2', '5', 48), { x: 200, y: 190, enter: 'pop' });
      s.text(320, 190, '=', { size: 48, weight: 700, delay: 400 });
      s.add(F(0, 0, '8', '20', 48), { x: 440, y: 190, enter: 'pop', delay: 1700 });
      s.add('<path d="M215 125 Q320 70 420 125" fill="none" stroke="#22A06B" stroke-width="4"/><path d="M420 125 l-16 -2 l8 -12 Z" fill="#22A06B"/>', { enter: 'fade', delay: 800 });
      s.text(320, 80, '× 4', { size: 26, weight: 700, colour: s.C.green, delay: 900 });
      s.add('<path d="M215 255 Q320 310 420 255" fill="none" stroke="#22A06B" stroke-width="4"/><path d="M420 255 l-16 2 l8 12 Z" fill="#22A06B"/>', { enter: 'fade', delay: 1200 });
      s.text(320, 305, '× 4', { size: 26, weight: 700, colour: s.C.green, delay: 1300 });
    },
    'eq-simplify': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Simplifying', { size: 30, weight: 700, colour: s.C.fun });
      s.add(F(0, 0, '18', '24', 48), { x: 200, y: 185, enter: 'pop' });
      s.text(320, 185, '=', { size: 48, weight: 700, delay: 400 });
      s.add(F(0, 0, '3', '4', 48), { x: 440, y: 185, enter: 'pop', delay: 1700 });
      s.add('<path d="M225 120 Q320 75 420 120" fill="none" stroke="#2F80ED" stroke-width="4"/><path d="M420 120 l-16 -2 l8 -12 Z" fill="#2F80ED"/>', { enter: 'fade', delay: 800 });
      s.text(320, 80, '÷ 6', { size: 26, weight: 700, colour: s.C.blue, delay: 900 });
      s.add('<path d="M225 250 Q320 295 420 250" fill="none" stroke="#2F80ED" stroke-width="4"/><path d="M420 250 l-16 2 l8 12 Z" fill="#2F80ED"/>', { enter: 'fade', delay: 1200 });
      s.text(320, 293, '÷ 6', { size: 26, weight: 700, colour: s.C.blue, delay: 1300 });
    },
    'eq-simplest': function (s) {
      s.add('<rect x="-120" y="-22" width="240" height="44" rx="22" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' + T(0, 1, 'simplest form!', 24, '#0E7A5A', 700), { x: 490, y: 333, enter: 'pop' });
      s.owl(80, 352, 80, { delay: 400 });
      s.text(560, 185, 'only 1 divides', { size: 18, weight: 700, colour: s.C.green, delay: 700 });
      s.text(560, 209, '3 and 4', { size: 18, weight: 700, colour: s.C.green, delay: 700 });
    },

    /* ---------- 3. Fractions, decimals and percentages ---------- */
    'fdp-grid': function (s) {
      /* 10 x 10 grid of 24 px squares; 25 coloured */
      var m = '';
      for (var i = 0; i < 100; i++) m += '<rect x="' + (i % 10) * 24 + '" y="' + Math.floor(i / 10) * 24 + '" width="24" height="24" fill="#FFFFFF" stroke="#2D1B69" stroke-width="1.5"/>';
      s.add(m, { x: 60, y: 60, enter: 'fade' });
      for (var r = 0; r < 3; r++) {
        var n = r < 2 ? 10 : 5, mm = '';
        for (var c = 0; c < n; c++) mm += '<rect x="' + c * 24 + '" y="' + r * 24 + '" width="24" height="24" fill="#6C4DF6" stroke="#2D1B69" stroke-width="1.5"/>';
        s.add(mm, { x: 60, y: 60, enter: 'fade', delay: 500 + r * 500 });
      }
      s.text(450, 110, '25 out of 100', { size: 30, weight: 700, colour: s.C.fun, delay: 2000 });
      s.text(450, 180, '= 25%', { size: 48, weight: 700, colour: s.C.pink, enter: 'pop', delay: 2500 });
      s.text(450, 240, 'per cent = out of 100', { size: 22, colour: s.C.muted, delay: 3000 });
      s.owl(560, 352, 70, { delay: 1000 });
    },
    'fdp-same': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Three ways, one amount', { size: 30, weight: 700, colour: s.C.fun });
      s.add(F(0, 0, '1', '2', 44, '#2D1B69'), { x: 140, y: 140, enter: 'pop' });
      s.text(230, 140, '=', { size: 44, weight: 700, delay: 400 });
      s.text(320, 140, '0.5', { size: 48, weight: 700, colour: s.C.blue, enter: 'pop', delay: 600 });
      s.text(410, 140, '=', { size: 44, weight: 700, delay: 1000 });
      s.text(510, 140, '50%', { size: 48, weight: 700, colour: s.C.pink, enter: 'pop', delay: 1200 });
      s.add(bar(80, 240, 480, 50, 2, 1), { enter: 'left', delay: 1800 });
      s.text(200, 315, 'half', { size: 22, weight: 700, colour: s.C.orange, delay: 2300 });
    },
    'fdp-convert': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Make the bottom 100', { size: 30, weight: 700, colour: s.C.fun });
      s.add(F(0, 0, '3', '5', 44), { x: 110, y: 170, enter: 'pop' });
      s.text(190, 170, '=', { size: 44, weight: 700, delay: 300 });
      s.add(F(0, 0, '60', '100', 44), { x: 290, y: 170, enter: 'pop', delay: 1500 });
      s.text(395, 170, '=', { size: 44, weight: 700, delay: 2000 });
      s.text(500, 170, '60%', { size: 48, weight: 700, colour: s.C.pink, enter: 'pop', delay: 2200 });
      s.text(200, 92, '× 20', { size: 24, weight: 700, colour: s.C.green, delay: 800 });
      s.text(200, 250, '× 20', { size: 24, weight: 700, colour: s.C.green, delay: 1000 });
      s.text(320, 315, 'and as a decimal: 0.6', { size: 28, weight: 700, colour: s.C.blue, delay: 2800 });
    },
    'fdp-table': function (s) {
      s.clear(); s.ref = {};
      var X = [110, 270, 430];
      ['fraction', 'decimal', 'percentage'].forEach(function (h, i) { s.text(X[i], 34, h, { size: 22, weight: 700, colour: s.C.fun }); });
      s.add('<path d="M40 56 H500" stroke="#6C4DF6" stroke-width="3"/>', { enter: 'fade' });
      [['1', '4', '0.25', '25%'], ['3', '4', '0.75', '75%'], ['1', '10', '0.1', '10%'], ['1', '5', '0.2', '20%']].forEach(function (r, i) {
        var y = 98 + i * 66, d = 300 + i * 500;
        s.add(F(0, 0, r[0], r[1], 24), { x: X[0], y: y, enter: 'fade', delay: d });
        s.text(X[1], y, r[2], { size: 30, weight: 700, colour: s.C.blue, delay: d + 150 });
        s.text(X[2], y, r[3], { size: 30, weight: 700, colour: s.C.pink, delay: d + 300 });
      });
      s.owl(580, 352, 80, { delay: 2400 });
    },

    /* ---------- 4. Adding and multiplying fractions ---------- */
    'add-same': function (s) {
      s.text(320, 36, 'Same bottom number', { size: 30, weight: 700, colour: s.C.fun });
      /* 7 parts of 60 px */
      s.add(bar(110, 90, 420, 60, 7, 0), { enter: 'fade' });
      s.add(bar(110, 90, 120, 60, 2, 2, ['#2F80ED', '#2F80ED']), { enter: 'left', delay: 400 });
      s.add(bar(230, 90, 180, 60, 3, 3, [SH2, SH2, SH2]), { enter: 'left', delay: 1200 });
      s.add(row([['2', '7'], '+', ['3', '7'], '=', ['5', '7']], 0, 0, 36), { x: 320, y: 250, enter: 'pop', delay: 2000 });
      s.owl(585, 352, 70, { delay: 600 });
    },
    'add-diff': function (s) {
      s.clear(); s.ref = {};
      /* bars 300 px wide */
      s.add(F(0, 0, '1', '2', 22), { x: 50, y: 85, enter: 'fade' });
      s.add(bar(90, 60, 300, 50, 2, 1, ['#2F80ED']), { enter: 'left' });
      s.add('<path d="M165 60 V110 M315 60 V110" stroke="#2D1B69" stroke-width="3" stroke-dasharray="5 4"/>', { enter: 'fade', delay: 900 });
      s.add(F(0, 0, '1', '4', 22), { x: 50, y: 175, enter: 'fade', delay: 500 });
      s.add(bar(90, 150, 300, 50, 4, 1, [SH2]), { enter: 'left', delay: 500 });
      s.add(F(0, 0, '3', '4', 22), { x: 50, y: 275, enter: 'fade', delay: 2600 });
      s.add(bar(90, 250, 300, 50, 4, 3, ['#2F80ED', '#2F80ED', SH2]), { enter: 'left', delay: 2600 });
      s.add(row([['1', '2'], '+', ['1', '4']], 0, 0, 28), { x: 520, y: 85, enter: 'fade', delay: 300 });
      s.add(row(['=', ['2', '4'], '+', ['1', '4']], 0, 0, 28), { x: 520, y: 175, enter: 'fade', delay: 1200 });
      s.add(row(['=', ['3', '4']], 0, 0, 28, '#22A06B'), { x: 520, y: 275, enter: 'pop', delay: 2900 });
    },
    'sub-diff': function (s) {
      s.clear(); s.ref = {};
      s.add(row([['2', '3'], '−', ['1', '4']], 0, 0, 32), { x: 320, y: 70, enter: 'fade' });
      s.add(row(['=', ['8', '12'], '−', ['3', '12']], 0, 0, 32, '#2F80ED'), { x: 320, y: 165, enter: 'fade', delay: 900 });
      s.add(row(['=', ['5', '12']], 0, 0, 32, '#22A06B'), { x: 320, y: 260, enter: 'pop', delay: 1900 });
      s.text(540, 165, '12 is in the 3', { size: 18, colour: s.C.muted, delay: 1200 });
      s.text(540, 189, 'and 4 times tables', { size: 18, colour: s.C.muted, delay: 1200 });
      s.owl(90, 352, 70, { delay: 2200 });
    },
    'mult': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'Multiplying fractions', { size: 28, weight: 700, colour: s.C.fun });
      s.add(row([['3', '4'], '×', ['2', '5']], 0, 0, 32), { x: 320, y: 100, enter: 'fade' });
      s.add(row(['=', ['3 × 2', '4 × 5']], 0, 0, 30, '#2F80ED'), { x: 320, y: 190, enter: 'fade', delay: 900 });
      s.add(row(['=', ['6', '20'], '=', ['3', '10']], 0, 0, 32, '#22A06B'), { x: 320, y: 285, enter: 'pop', delay: 1900 });
      s.text(320, 342, '÷ 2 on the top and the bottom', { size: 18, colour: s.C.muted, delay: 2500 });
    },

    /* ---------- 5. Parts of amounts ---------- */
    'amt-frac': function (s) {
      s.add(row([['3', '4'], 'of 20'], 0, 0, 30, '#6C4DF6'), { x: 210, y: 40, enter: 'fade' });
      for (var g = 0; g < 4; g++) {
        var m = '<rect x="0" y="0" width="280" height="50" rx="12" fill="' + (g < 3 ? '#FFF4D6' : '#FFFFFF') + '" stroke="' + (g < 3 ? '#FF8A3D' : '#9AA0B4') + '" stroke-width="3"/>';
        for (var d = 0; d < 5; d++) m += '<circle cx="' + (36 + d * 52) + '" cy="25" r="14" fill="#2F80ED"/>';
        s.add(m, { x: 70, y: 90 + g * 62, enter: 'left', delay: 300 + g * 300 });
      }
      for (var h = 0; h < 3; h++) s.add('<rect x="0" y="0" width="280" height="50" rx="12" fill="none" stroke="#FF8A3D" stroke-width="5"/>', { x: 70, y: 90 + h * 62, enter: 'pop', delay: 2200 + h * 200 });
      s.text(500, 120, '20 ÷ 4 = 5', { size: 30, weight: 700, colour: s.C.blue, delay: 1200 });
      s.text(500, 190, '5 × 3 = 15', { size: 30, weight: 700, colour: s.C.orange, delay: 2200 });
      s.text(500, 260, '= 15', { size: 40, weight: 700, colour: s.C.green, enter: 'pop', delay: 2900 });
    },
    'amt-50': function (s) {
      s.clear(); s.ref = {};
      s.add(row(['50% =', ['1', '2']], 0, 0, 32, '#6C4DF6'), { x: 320, y: 60, enter: 'fade' });
      s.add('<path d="M80 150 V140 H560 V150" fill="none" stroke="#2D1B69" stroke-width="3"/>', { enter: 'fade', delay: 400 });
      s.text(320, 122, '36', { size: 26, weight: 700, delay: 400 });
      s.add('<rect x="80" y="160" width="240" height="60" fill="' + SH + '" stroke="#2D1B69" stroke-width="3"/><rect x="320" y="160" width="240" height="60" fill="#FFFFFF" stroke="#2D1B69" stroke-width="3"/>', { enter: 'left', delay: 800 });
      s.text(200, 190, '18', { size: 30, weight: 700, delay: 1500 });
      s.text(440, 190, '18', { size: 30, weight: 700, colour: s.C.muted, delay: 1500 });
      s.text(320, 285, '36 ÷ 2 = 18', { size: 38, weight: 700, colour: s.C.green, enter: 'pop', delay: 2000 });
    },
    'amt-10': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M70 120 V110 H570 V120" fill="none" stroke="#2D1B69" stroke-width="3"/>', { enter: 'fade' });
      s.text(320, 90, '£45 = 100%', { size: 26, weight: 700 });
      s.add(bar(70, 130, 500, 60, 10, 0), { enter: 'left', delay: 300 });
      s.add(bar(70, 130, 50, 60, 1, 1, ['#2F80ED']), { enter: 'pop', delay: 1200, name: 'p10' });
      s.text(95, 220, '10%', { size: 20, weight: 700, colour: s.C.blue, delay: 1400, name: 't10' });
      s.text(320, 290, '10% of £45 = £45 ÷ 10 = £4.50', { size: 28, weight: 700, colour: s.C.green, delay: 1900, name: 'eq10' });
      s.owl(600, 100, 60, { delay: 800 });
    },
    'amt-build': function (s) {
      hideAll(s, ['eq10', 't10']);
      s.add(bar(120, 130, 100, 60, 2, 2, ['#2F80ED', '#2F80ED']), { enter: 'pop', delay: 200 });
      s.text(145, 220, '30%', { size: 20, weight: 700, colour: s.C.blue, delay: 600 });
      s.text(320, 268, '30% = 3 × £4.50 = £13.50', { size: 28, weight: 700, colour: s.C.green, delay: 1000 });
      s.text(320, 322, '25% of 80 kg = 80 ÷ 4 = 20 kg', { size: 26, weight: 700, colour: s.C.fun, delay: 2200 });
    }
  });
})();
