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
  /* Shiny drawing helpers. Every gradient gets its own id (prefix + counter), so no two groups on the page share one. */
  var OL = 'rgba(30,27,58,.35)', uid = 0;
  function gid() { return 'mAfd' + (++uid); }
  function lin(c1, c2) {   // a top-to-bottom gradient: [defs markup, fill url]
    var id = gid();
    return ['<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></linearGradient>', 'url(#' + id + ')'];
  }
  /* a rounded card with a gradient, a white sheen along the top and a thin outline */
  function panel(x, y, w, h, c1, c2, o) {
    o = o || {};
    var g = lin(c1, c2), rx = o.rx == null ? 14 : o.rx, inset = Math.max(8, rx * 0.8);
    return '<defs>' + g[0] + '</defs><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + rx + '" fill="' + g[1] + '" stroke="' + (o.stroke || OL) + '" stroke-width="' + (o.sw || 2) + '"/>' +
      '<rect x="' + (x + inset) + '" y="' + (y + 3) + '" width="' + Math.max(0, w - 2 * inset) + '" height="' + Math.min(7, h * 0.16) + '" rx="' + Math.min(3.5, h * 0.08) + '" fill="#fff" opacity="' + (o.sheen || 0.5) + '"/>';
  }
  /* light and dark ends of the gradient for each flat colour used in bars and grids */
  var SHADE = { '#FFC93C': ['#FFE58F', '#F5B416'], '#FF8A3D': ['#FFB273', '#EC7026'], '#2F80ED': ['#72B2FF', '#1F6AD3'], '#6C4DF6': ['#957DFF', '#5136D8'], '#FFFFFF': ['#FFFFFF', '#F1EEF8'] };
  function shade(c) { var p = SHADE[c] || [c, c]; return lin(p[0], p[1]); }
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
  function bar(x, y, w, h, parts, shaded, cols) {   // shaded = number of shaded parts from the left
    var m = '', defs = '', pw = w / parts, G = {};
    function fill(c) { if (!G[c]) { var g = shade(c); defs += g[0]; G[c] = g[1]; } return G[c]; }
    for (var i = 0; i < parts; i++) m += '<rect x="' + (x + i * pw) + '" y="' + y + '" width="' + pw + '" height="' + h + '" fill="' + fill(i < shaded ? (cols ? cols[i] : SH) : EMPTY) + '" stroke="' + LN + '" stroke-width="3"/>';
    m += '<rect x="' + (x + 5) + '" y="' + (y + 4) + '" width="' + Math.max(0, w - 10) + '" height="' + Math.min(6, h * 0.12) + '" rx="3" fill="#fff" opacity=".45"/>';
    return '<defs>' + defs + '</defs>' + m;
  }
  function slice(r, i, d) {
    var a0 = 2 * Math.PI * i / d - Math.PI / 2, a1 = 2 * Math.PI * (i + 1) / d - Math.PI / 2;
    return 'M0 0 L' + (r * Math.cos(a0)).toFixed(2) + ' ' + (r * Math.sin(a0)).toFixed(2) + ' A' + r + ' ' + r + ' 0 0 1 ' + (r * Math.cos(a1)).toFixed(2) + ' ' + (r * Math.sin(a1)).toFixed(2) + ' Z';
  }
  function hideAll(s, names) { names.forEach(function (k) { s.hide(s.ref[k]); }); }

  Theory.scenes({
    /* ---------- 1. What a fraction means ---------- */
    'fr-pizza': function (s) {
      var crust = gid(), cheese = gid();
      var m = '<defs><radialGradient id="' + crust + '" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#F6CF98"/><stop offset="1" stop-color="#C8874A"/></radialGradient>' +
        '<radialGradient id="' + cheese + '" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="105"><stop offset="0" stop-color="#FFFBEA"/><stop offset="1" stop-color="#FFE7A6"/></radialGradient></defs>' +
        '<circle r="118" fill="url(#' + crust + ')" stroke="rgba(110,60,20,.6)" stroke-width="3"/>' +
        '<path d="M-96 -46 A106 106 0 0 1 -30 -104" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".35"/>';
      for (var i = 0; i < 8; i++) m += '<path d="' + slice(105, i, 8) + '" fill="url(#' + cheese + ')" stroke="#C2570C" stroke-width="3" stroke-linejoin="round"/>';
      s.add(m, { x: 190, y: 185, enter: 'pop' });
      s.text(470, 120, '8 equal parts', { size: 30, weight: 700, colour: s.C.deep, delay: 700 });
      s.text(470, 165, 'the bottom number', { size: 22, colour: s.C.muted, delay: 1000 });
      s.owl(560, 352, 80, { delay: 500, name: 'owl' });
    },
    'fr-pizza-label': function (s) {
      s.hide(s.ref.owl);
      for (var i = 0; i < 3; i++) {
        var g = gid();
        s.add('<defs><radialGradient id="' + g + '" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="105"><stop offset="0" stop-color="#FFB273"/><stop offset="1" stop-color="' + SH2 + '"/></radialGradient></defs>' +
          '<path d="' + slice(105, i, 8) + '" fill="url(#' + g + ')" stroke="#C2570C" stroke-width="3" stroke-linejoin="round"/>', { x: 190, y: 185, enter: 'fade', delay: i * 400, flat: true });
      }
      s.add(panel(-34, -66, 68, 132, '#FFFFFF', '#F1EDFF', { rx: 16 }) + F(0, 0, '3', '8', 48, '#2D1B69'), { x: 400, y: 245, enter: 'pop', delay: 1400 });
      s.text(440, 212, '← shaded', { size: 20, weight: 700, colour: s.C.orange, anchor: 'start', delay: 1800 });
      s.text(440, 282, '← parts in all', { size: 20, weight: 700, colour: s.C.deep, anchor: 'start', delay: 2100 });
    },
    'fr-line': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Fractions on a number line', { size: 30, weight: 700, colour: s.C.fun });
      /* 0 at x 80, 1 at x 560: each fifth is 96 px, so 3/5 is at x 368 */
      var m = '<rect x="62" y="-7" width="516" height="14" rx="7" fill="#EDE7FF" stroke="rgba(108,77,246,.18)" stroke-width="1"/><path d="M70 0 H570" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/>';
      for (var k = 0; k <= 5; k++) m += '<path d="M' + (80 + k * 96) + ' -12 V12" stroke="#1E1B3A" stroke-width="3" stroke-linecap="round"/>';
      m += T(80, 40, '0', 26, '#1E1B3A', 700) + T(560, 40, '1', 26, '#1E1B3A', 700);
      s.add(m, { y: 220, enter: 'fade', flat: true });
      for (var j = 0; j < 5; j++) s.add('<path d="M6 0 H90" stroke="#6C4DF6" stroke-width="6" stroke-linecap="round"/>', { x: 80 + j * 96, y: 220, enter: 'left', delay: 500 + j * 250 });
      s.arrow(368, 100, 100, 'd', { colour: s.C.pink, width: 8, delay: 2000 });
      s.add(panel(-30, -46, 60, 92, '#FFFFFF', '#FFE8F0', { rx: 14, stroke: 'rgba(226,61,116,.45)' }) + F(0, 0, '3', '5', 30, '#FF5D8F'), { x: 420, y: 125, enter: 'pop', delay: 2400 });
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
      s.add(panel(-56, -62, 112, 124, '#FFFFFF', '#F1EDFF', { rx: 20 }) + F(0, 0, '2', '5', 48), { x: 200, y: 190, enter: 'pop' });
      s.text(320, 190, '=', { size: 48, weight: 700, delay: 400 });
      s.add(panel(-56, -62, 112, 124, '#FFFFFF', '#E6F8F0', { rx: 20 }) + F(0, 0, '8', '20', 48), { x: 440, y: 190, enter: 'pop', delay: 1700 });
      s.add('<path d="M215 125 Q320 70 420 125" fill="none" stroke="#22A06B" stroke-width="4"/><path d="M420 125 l-16 -2 l8 -12 Z" fill="#22A06B"/>', { enter: 'fade', delay: 800 });
      s.text(320, 80, '× 4', { size: 26, weight: 700, colour: s.C.green, delay: 900 });
      s.add('<path d="M215 255 Q320 310 420 255" fill="none" stroke="#22A06B" stroke-width="4"/><path d="M420 255 l-16 2 l8 12 Z" fill="#22A06B"/>', { enter: 'fade', delay: 1200 });
      s.text(320, 305, '× 4', { size: 26, weight: 700, colour: s.C.green, delay: 1300 });
    },
    'eq-simplify': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Simplifying', { size: 30, weight: 700, colour: s.C.fun });
      s.add(panel(-56, -62, 112, 124, '#FFFFFF', '#F1EDFF', { rx: 20 }) + F(0, 0, '18', '24', 48), { x: 200, y: 185, enter: 'pop' });
      s.text(320, 185, '=', { size: 48, weight: 700, delay: 400 });
      s.add(panel(-56, -62, 112, 124, '#FFFFFF', '#E6F8F0', { rx: 20 }) + F(0, 0, '3', '4', 48), { x: 440, y: 185, enter: 'pop', delay: 1700 });
      s.add('<path d="M225 120 Q320 75 420 120" fill="none" stroke="#2F80ED" stroke-width="4"/><path d="M420 120 l-16 -2 l8 -12 Z" fill="#2F80ED"/>', { enter: 'fade', delay: 800 });
      s.text(320, 80, '÷ 6', { size: 26, weight: 700, colour: s.C.blue, delay: 900 });
      s.add('<path d="M225 250 Q320 295 420 250" fill="none" stroke="#2F80ED" stroke-width="4"/><path d="M420 250 l-16 2 l8 12 Z" fill="#2F80ED"/>', { enter: 'fade', delay: 1200 });
      s.text(320, 293, '÷ 6', { size: 26, weight: 700, colour: s.C.blue, delay: 1300 });
    },
    'eq-simplest': function (s) {
      s.add(panel(-120, -22, 240, 44, '#F0FCF7', '#C9EEDC', { rx: 22, stroke: 'rgba(34,160,107,.75)', sw: 2.5 }) + T(0, 1, 'simplest form!', 24, '#0E7A5A', 700), { x: 490, y: 333, enter: 'pop' });
      s.owl(80, 352, 80, { delay: 400 });
      s.text(560, 185, 'only 1 divides', { size: 18, weight: 700, colour: s.C.green, delay: 700 });
      s.text(560, 209, '3 and 4', { size: 18, weight: 700, colour: s.C.green, delay: 700 });
    },

    /* ---------- 3. Fractions, decimals and percentages ---------- */
    'fdp-grid': function (s) {
      /* 10 x 10 grid of 24 px squares; 25 coloured */
      var m = '';
      var card = shade('#FFFFFF');
      m = '<defs>' + card[0] + '</defs><rect x="-8" y="-8" width="256" height="256" rx="14" fill="' + card[1] + '" stroke="' + OL + '" stroke-width="2"/>';
      for (var i = 0; i < 100; i++) m += '<rect x="' + (i % 10) * 24 + '" y="' + Math.floor(i / 10) * 24 + '" width="24" height="24" fill="#FFFFFF" stroke="#2D1B69" stroke-width="1.5"/>';
      s.add(m, { x: 60, y: 60, enter: 'fade' });
      for (var r = 0; r < 3; r++) {
        var n = r < 2 ? 10 : 5, sq = shade('#6C4DF6'), mm = '<defs>' + sq[0] + '</defs>';
        for (var c = 0; c < n; c++) mm += '<rect x="' + c * 24 + '" y="' + r * 24 + '" width="24" height="24" fill="' + sq[1] + '" stroke="#2D1B69" stroke-width="1.5"/><rect x="' + (c * 24 + 4) + '" y="' + (r * 24 + 3) + '" width="16" height="3" rx="1.5" fill="#fff" opacity=".4"/>';
        s.add(mm, { x: 60, y: 60, enter: 'fade', delay: 500 + r * 500, flat: true });
      }
      s.text(450, 110, '25 out of 100', { size: 30, weight: 700, colour: s.C.fun, delay: 2000 });
      s.text(450, 180, '= 25%', { size: 48, weight: 700, colour: s.C.pink, enter: 'pop', delay: 2500 });
      s.text(450, 240, 'per cent = out of 100', { size: 22, colour: s.C.muted, delay: 3000 });
      s.owl(560, 352, 70, { delay: 1000 });
    },
    'fdp-same': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Three ways, one amount', { size: 30, weight: 700, colour: s.C.fun });
      s.add(panel(-50, -58, 100, 116, '#FFFFFF', '#F1EDFF', { rx: 20 }) + F(0, 0, '1', '2', 44, '#2D1B69'), { x: 140, y: 140, enter: 'pop' });
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
        s.add(panel(40, -32, 460, 64, '#FFFFFF', i % 2 ? '#F6F3FF' : '#EFEAFF'), { y: y, enter: 'fade', delay: d });
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
        var cn = gid(), m = (g < 3 ? panel(0, 0, 280, 50, '#FFFBEE', '#FFE6B8', { rx: 12, stroke: '#FF8A3D', sw: 3 }) : panel(0, 0, 280, 50, '#FFFFFF', '#EEF0F5', { rx: 12, stroke: '#9AA0B4', sw: 3 })) +
          '<defs><radialGradient id="' + cn + '" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#7DB8FF"/><stop offset="1" stop-color="#1F5FC0"/></radialGradient></defs>';
        for (var d = 0; d < 5; d++) m += '<circle cx="' + (36 + d * 52) + '" cy="25" r="14" fill="url(#' + cn + ')" stroke="' + OL + '" stroke-width="1.5"/><ellipse cx="' + (32 + d * 52) + '" cy="20" rx="5" ry="3" fill="#fff" opacity=".6"/>';
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
      s.add('<path d="M80 150 V140 H560 V150" fill="none" stroke="#2D1B69" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>', { enter: 'fade', delay: 400, flat: true });
      s.text(320, 122, '36', { size: 26, weight: 700, delay: 400 });
      s.add(bar(80, 160, 480, 60, 2, 1), { enter: 'left', delay: 800 });
      s.text(200, 190, '18', { size: 30, weight: 700, delay: 1500 });
      s.text(440, 190, '18', { size: 30, weight: 700, colour: s.C.muted, delay: 1500 });
      s.text(320, 285, '36 ÷ 2 = 18', { size: 38, weight: 700, colour: s.C.green, enter: 'pop', delay: 2000 });
    },
    'amt-10': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M70 120 V110 H570 V120" fill="none" stroke="#2D1B69" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>', { enter: 'fade', flat: true });
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
