/* Pictures for the Place value and rounding theory video (words: videos/maths/place-value-and-rounding.json).
   Stage is 640 x 360; see static/js/theory.js. The rounding number lines are drawn to scale. */
(function () {
  if (!window.Theory) return;

  var FONT = 'Fredoka, Trebuchet MS, sans-serif';
  function T(x, y, str, size, col, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + FONT + '" font-size="' + (size || 26) + '" font-weight="' + (weight || 600) +
      '" fill="' + (col || '#1E1B3A') + '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle">' + str + '</text>';
  }
  /* A number written one digit per slot, so decimal points line up. px = x of the point; L(k) = x of the k-th place left of
     the point (1 = ones), R(k) = x of the k-th decimal place. */
  var G = 16;
  function sw(size) { return Math.max(34, (size || 40) * 0.9); }   // slot width for a font size
  function L(px, k, w) { w = w || 34; return px - G / 2 - w / 2 - (k - 1) * w; }
  function R(px, k, w) { w = w || 34; return px + G / 2 + w / 2 + (k - 1) * w; }
  function digits(str, px, size, col) {
    var p = str.indexOf('.'), whole = p < 0 ? str : str.slice(0, p), dec = p < 0 ? '' : str.slice(p + 1), m = '', w = sw(size);
    for (var i = 0; i < whole.length; i++) m += T(L(px, whole.length - i, w), 0, whole[i], size || 40, col, 700);
    if (p >= 0) m += T(px, 0, '.', size || 40, col, 700);
    for (var j = 0; j < dec.length; j++) m += T(R(px, j + 1, w), 0, dec[j], size || 40, col, 700);
    return m;
  }
  /* Shiny drawing helpers. Every gradient gets its own id (prefix + counter), so no two groups on the page share one. */
  var OL = 'rgba(30,27,58,.35)', uid = 0;
  function gid() { return 'mApv' + (++uid); }
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
  /* a shiny ball with a highlight, centred on 0 0 */
  function ball(r, c1, c2, ring) {
    var id = gid();
    return '<defs><radialGradient id="' + id + '" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="' + c1 + '"/><stop offset="1" stop-color="' + c2 + '"/></radialGradient></defs>' +
      (ring ? '<circle r="' + (r + ring) + '" fill="#FFFFFF" stroke="' + OL + '" stroke-width="1"/>' : '') +
      '<circle r="' + r + '" fill="url(#' + id + ')" stroke="' + OL + '" stroke-width="1.5"/>' +
      '<ellipse cx="' + (-r * 0.3) + '" cy="' + (-r * 0.38) + '" rx="' + (r * 0.34) + '" ry="' + (r * 0.2) + '" fill="#fff" opacity=".6"/>';
  }
  /* a pill label with white text */
  function pill(x, y, w, h, c1, c2, label, size) {
    return panel(x, y, w, h, c1, c2, { rx: h / 2, sheen: 0.35 }) + T(x + w / 2, y + h / 2 + 1, label, size || 20, '#FFFFFF', 700);
  }
  /* a number line track: a soft band behind the line, from x1 to x2 */
  function track(x1, x2, h) { return '<rect x="' + x1 + '" y="' + (-h / 2) + '" width="' + (x2 - x1) + '" height="' + h + '" rx="' + (h / 2) + '" fill="#EDE7FF" stroke="rgba(108,77,246,.18)" stroke-width="1"/>'; }

  /* A place value chart: cols = [[label, centre x], ...]; each column is a card with a coloured header and a digit cell. */
  var HEAD = [['#F3EFFF', '#DCD3FF'], ['#E8FBF4', '#C3EEDC'], ['#FFF9E6', '#FFE6A3'], ['#FFF0F5', '#FFCFDF'], ['#EEF5FF', '#CADDFA'], ['#FAF3E8', '#EAD7B8']];
  function chart(cols, y, w, point) {
    var body = lin('#FFFFFF', '#F3F0FA'), defs = body[0], m = '';
    cols.forEach(function (c, i) {
      var h = lin(HEAD[i % 6][0], HEAD[i % 6][1]), x = c[1] - w / 2 + 1.5, cw = w - 3;
      defs += h[0];
      m += '<rect x="' + x + '" y="' + y + '" width="' + cw + '" height="120" rx="10" fill="' + body[1] + '"/>' +
        '<path d="M' + x + ' ' + (y + 40) + ' V' + (y + 10) + ' Q' + x + ' ' + y + ' ' + (x + 10) + ' ' + y + ' H' + (x + cw - 10) + ' Q' + (x + cw) + ' ' + y + ' ' + (x + cw) + ' ' + (y + 10) + ' V' + (y + 40) + ' Z" fill="' + h[1] + '"/>' +
        '<path d="M' + x + ' ' + (y + 40) + ' H' + (x + cw) + '" stroke="rgba(45,27,105,.3)" stroke-width="1.5"/>' +
        '<rect x="' + (x + 8) + '" y="' + (y + 3) + '" width="' + (cw - 16) + '" height="6" rx="3" fill="#fff" opacity=".6"/>' +
        '<rect x="' + x + '" y="' + y + '" width="' + cw + '" height="120" rx="10" fill="none" stroke="rgba(45,27,105,.55)" stroke-width="2"/>' +
        T(c[1], y + 21, c[0], 18, '#2D1B69', 700).replace('<text ', c[0].length * 9.9 > cw - 12 ? '<text textLength="' + (cw - 12) + '" lengthAdjust="spacingAndGlyphs" ' : '<text ');
    });
    if (point) m += '<g transform="translate(' + point + ' ' + (y + 100) + ')">' + ball(6, '#FF8A8E', '#D6343A') + '</g>';
    return '<defs>' + defs + '</defs>' + m;
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }

  Theory.scenes({
    /* ---------- 1. What each digit is worth ---------- */
    'pv-chart': function (s) {
      s.text(320, 34, 'Place value', { size: 32, weight: 700, colour: s.C.fun });
      var cols = [['thousands', 170], ['hundreds', 270], ['tens', 370], ['ones', 470]];
      s.add(chart(cols, 70, 100), { enter: 'fade', delay: 200 });
      '4735'.split('').forEach(function (d, i) {
        s.text(cols[i][1], 150, d, { size: 52, weight: 700, colour: s.C.ink, enter: 'pop', delay: 600 + i * 300, name: 'd' + i });
      });
      s.owl(585, 350, 90, { delay: 400 });
    },
    'pv-values': function (s) {
      s.add('<rect x="-50" y="-60" width="100" height="120" rx="12" fill="none" stroke="#FF5D8F" stroke-width="6"/><rect x="-44" y="-54" width="88" height="108" rx="8" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>', { x: 270, y: 130, enter: 'pop' });
      s.add(panel(-66, -20, 132, 40, '#FFF0F5', '#FFD6E4', { rx: 20, stroke: 'rgba(226,61,116,.45)' }), { x: 270, y: 226, enter: 'pop', delay: 400 });
      s.text(270, 226, 'worth 700', { size: 24, weight: 700, colour: s.C.pink, delay: 400 });
      s.add(panel(-170, -32, 340, 64, '#FFFFFF', '#F1EDFF'), { x: 320, y: 290, enter: 'up', delay: 1100 });
      s.text(320, 290, '4000 + <tspan fill="#FF5D8F">700</tspan> + 30 + 5', { size: 34, weight: 700, colour: s.C.deep, delay: 1100 });
    },
    'pv-decimals': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Decimals: after the point', { size: 30, weight: 700, colour: s.C.fun });
      var cols = [['ones', 110], ['tenths', 250], ['hundredths', 375], ['thousandths', 500]];
      s.add(chart(cols, 70, 120, 180), { enter: 'fade', delay: 200 });
      [['3', 110], ['4', 250], ['8', 375], ['2', 500]].forEach(function (d, i) {
        s.text(d[1], 150, d[0], { size: 52, weight: 700, enter: 'pop', delay: 600 + i * 300 });
      });
      s.add(panel(-70, -20, 140, 40, '#FFFFFF', '#F1EDFF', { rx: 20 }), { x: 320, y: 236, enter: 'up', delay: 1900 });
      s.text(320, 236, '3 . 4 8 2', { size: 26, colour: s.C.muted, delay: 1900 });
    },
    'pv-decimal-value': function (s) {
      s.add('<rect x="-60" y="-60" width="120" height="120" rx="12" fill="none" stroke="#FF5D8F" stroke-width="6"/><rect x="-54" y="-54" width="108" height="108" rx="8" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/>', { x: 375, y: 130, enter: 'pop' });
      s.add(panel(-160, -30, 320, 60, '#FFF0F5', '#FFD6E4', { stroke: 'rgba(226,61,116,.45)' }), { x: 320, y: 290, enter: 'pop', delay: 600 });
      s.text(320, 290, '8 hundredths = 0.08', { size: 34, weight: 700, colour: s.C.pink, delay: 600 });
      s.owl(70, 350, 80, { delay: 900 });
    },

    /* ---------- 2. Putting numbers in order ---------- */
    'order-line-up': function (s) {
      s.text(320, 34, 'Line up the decimal points', { size: 30, weight: 700, colour: s.C.fun });
      ['0.7', '0.65', '0.605', '0.07'].forEach(function (n, i) {
        s.add(panel(176, -25, 180, 50, '#FFFFFF', '#F1EDFF') + digits(n, 230), { y: 100 + i * 60, enter: 'right', delay: 300 + i * 300, name: 'n' + i });
      });
      s.add('<path d="M0 0 V250" stroke="#FF5D8F" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/>', { x: 230, y: 70, enter: 'fade', delay: 1600, flat: true });
      s.owl(70, 345, 80, { delay: 500 });
    },
    'order-zeros': function (s) {
      var add = [[0, [2, 3]], [1, [3]], [3, [3]]];
      add.forEach(function (a, n) {
        a[1].forEach(function (k, j) {
          s.add(T(R(230, k), 0, '0', 40, '#FF8A3D', 700), { y: 100 + a[0] * 60, enter: 'pop', delay: n * 400 + j * 200 });
        });
      });
    },
    'order-result': function (s) {
      ['700', '650', '605', '70'].forEach(function (n, i) {
        s.text(410, 100 + i * 60, '→ ' + n, { size: 30, weight: 700, colour: s.C.blue, anchor: 'start', delay: i * 300 });
      });
      s.add(pill(0, -18, 104, 36, '#4CC98F', '#1E8F5E', 'biggest'), { x: 520, y: 100, enter: 'pop', delay: 1500 });
      s.add(pill(0, -18, 114, 36, '#B9BECD', '#868CA2', 'smallest'), { x: 515, y: 280, enter: 'pop', delay: 1900 });
    },
    'order-signs': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Comparing signs', { size: 30, weight: 700, colour: s.C.fun });
      s.add(panel(-185, -50, 370, 100, '#FFFFFF', '#F1EDFF', { rx: 22 }), { x: 320, y: 130, enter: 'pop', delay: 200 });
      s.text(320, 130, '3.06 <tspan fill="#FF5D8F">&lt;</tspan> 3.6', { size: 60, weight: 700, enter: 'pop', delay: 200 });
      s.add(ball(24, '#FFFFFF', '#FFD6E4'), { x: 250, y: 225, enter: 'pop', delay: 900 });
      s.add(ball(24, '#FFFFFF', '#CFE2FF'), { x: 250, y: 280, enter: 'pop', delay: 1400 });
      s.text(250, 225, '&lt;', { size: 40, weight: 700, colour: s.C.pink, delay: 900 });
      s.text(285, 225, 'is less than', { size: 24, anchor: 'start', delay: 900 });
      s.text(250, 280, '&gt;', { size: 40, weight: 700, colour: s.C.blue, delay: 1400 });
      s.text(285, 280, 'is greater than', { size: 24, anchor: 'start', delay: 1400 });
      s.owl(90, 345, 90, { delay: 600 });
      s.text(520, 330, 'open side → bigger', { size: 20, colour: s.C.muted, delay: 2000 });
    },

    /* ---------- 3. Rounding (number line: 50 px per unit, 460 at x = 70) ---------- */
    'round-line': function (s) {
      s.text(320, 34, 'Round 467 to the nearest 10', { size: 28, weight: 700, colour: s.C.fun });
      var m = track(52, 588, 14) + '<path d="M60 0 H580" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/>';
      for (var k = 0; k <= 10; k++) m += '<path d="M' + (70 + k * 50) + ' ' + (k % 5 ? -8 : -16) + ' V' + (k % 5 ? 8 : 16) + '" stroke="#1E1B3A" stroke-width="3" stroke-linecap="round"/>';
      m += T(70, 38, '460', 26, '#1E1B3A', 700) + T(570, 38, '470', 26, '#1E1B3A', 700) + T(320, 34, '465', 18, '#55526E', 600);
      s.add(m, { y: 190, enter: 'fade', delay: 200, flat: true });
      s.add(ball(11, '#FF9DBB', '#E23D74', 3), { x: 420, y: 190, enter: 'pop', delay: 900, name: 'pt' });
      s.text(420, 230, '467', { size: 26, weight: 700, colour: s.C.pink, delay: 1000 });
    },
    'round-closer': function (s) {
      s.add('<path d="M420 180 Q495 100 570 180" fill="none" stroke="#22A06B" stroke-width="4" stroke-dasharray="8 6"/>', { enter: 'fade' });
      s.add(panel(-44, -17, 88, 34, '#FFFFFF', '#DDF7EE', { rx: 17, stroke: 'rgba(34,160,107,.6)' }), { x: 495, y: 118, enter: 'pop', delay: 200 });
      s.text(495, 118, '3 away', { size: 22, weight: 700, colour: s.C.green, delay: 200 });
      s.add('<path d="M70 180 Q245 80 420 180" fill="none" stroke="#9AA0B4" stroke-width="4" stroke-dasharray="8 6"/>', { enter: 'fade', delay: 700 });
      s.add(panel(-44, -17, 88, 34, '#FFFFFF', '#ECEEF3', { rx: 17 }), { x: 245, y: 110, enter: 'pop', delay: 900 });
      s.text(245, 110, '7 away', { size: 22, weight: 700, colour: s.C.muted, delay: 900 });
      s.add('<circle r="30" fill="none" stroke="#22A06B" stroke-width="5"/><circle r="26" fill="none" stroke="#fff" stroke-width="1.5" opacity=".8"/>', { x: 570, y: 228, enter: 'pop', delay: 1500 });
      s.add(panel(-110, -32, 220, 64, '#FFFFFF', '#DDF7EE', { stroke: 'rgba(34,160,107,.55)' }), { x: 300, y: 300, enter: 'pop', delay: 1900 });
      s.text(300, 300, '467 → 470', { size: 38, weight: 700, colour: s.C.green, enter: 'pop', delay: 1900 });
      s.owl(70, 352, 70, { delay: 1900 });
    },
    'round-rule': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, '3,850 to the nearest 100', { size: 28, weight: 700, colour: s.C.fun });
      s.add(panel(-140, -48, 280, 96, '#FFFFFF', '#F1EDFF', { rx: 20 }), { x: 320, y: 120, enter: 'fade' });
      s.add(T(-90, 0, '3', 60, '#1E1B3A', 700) + T(-30, 0, '8', 60, '#1E1B3A', 700) + T(30, 0, '5', 60, '#1E1B3A', 700) + T(90, 0, '0', 60, '#1E1B3A', 700) +
        T(-62, 6, ',', 60, '#1E1B3A', 700), { x: 320, y: 120, enter: 'fade' });
      s.add('<rect x="-26" y="-36" width="52" height="72" rx="8" fill="none" stroke="#2F80ED" stroke-width="4"/>', { x: 290, y: 120, enter: 'pop', delay: 500 });
      s.text(200, 180, 'hundreds', { size: 20, weight: 700, colour: s.C.blue, delay: 600 });
      s.add('<circle r="36" fill="none" stroke="#FF5D8F" stroke-width="5"/>', { x: 350, y: 120, enter: 'pop', delay: 1100 });
      s.text(440, 180, 'look here', { size: 20, weight: 700, colour: s.C.pink, delay: 1200 });
      s.text(320, 228, '5 or more: round up', { size: 26, weight: 700, colour: s.C.orange, delay: 1800 });
      s.add(panel(-140, -30, 280, 60, '#FFFFFF', '#DDF7EE', { stroke: 'rgba(34,160,107,.55)' }), { x: 320, y: 285, enter: 'pop', delay: 2400 });
      s.text(320, 285, '3,850 → 3,900', { size: 38, weight: 700, colour: s.C.green, enter: 'pop', delay: 2400 });
      s.text(320, 334, '4 or less: keep it the same', { size: 20, colour: s.C.muted, delay: 2800 });
    },
    'round-dp': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, '6.47 to 1 decimal place', { size: 28, weight: 700, colour: s.C.fun });
      s.add(panel(226, -46, 200, 92, '#FFFFFF', '#F1EDFF', { rx: 20 }) + digits('6.47', 300, 56), { y: 110, enter: 'fade' });
      s.add('<rect x="-22" y="-34" width="44" height="68" rx="8" fill="none" stroke="#2F80ED" stroke-width="4"/>', { x: R(300, 1, sw(56)), y: 110, enter: 'pop', delay: 400 });
      s.add('<circle r="32" fill="none" stroke="#FF5D8F" stroke-width="5"/>', { x: R(300, 2, sw(56)), y: 110, enter: 'pop', delay: 900 });
      s.text(320, 178, '7 is 5 or more: round up', { size: 24, weight: 700, colour: s.C.orange, delay: 1400 });
      s.text(320, 232, '6.47 → 6.5', { size: 36, weight: 700, colour: s.C.green, enter: 'pop', delay: 2000 });
      /* 6.4 to 6.5: 400 px, so 6.47 is at 120 + 0.7 x 400 = 400 */
      var m = track(104, 536, 12) + '<path d="M110 0 H530" stroke="#1E1B3A" stroke-width="3" stroke-linecap="round"/>';
      for (var k = 0; k <= 10; k++) m += '<path d="M' + (120 + k * 40) + ' -7 V7" stroke="#1E1B3A" stroke-width="2" stroke-linecap="round"/>';
      m += T(120, 28, '6.4', 20, '#1E1B3A', 700) + T(520, 28, '6.5', 20, '#1E1B3A', 700);
      s.add(m, { y: 300, enter: 'fade', delay: 2400, flat: true });
      s.add(ball(9, '#FF9DBB', '#E23D74', 2.5), { x: 400, y: 300, enter: 'pop', delay: 2700 });
      s.text(400, 328, '6.47', { size: 18, weight: 700, colour: s.C.pink, delay: 2700 });
    },

    /* ---------- 4. x and / by 10, 100 and 1000 ---------- */
    'times-ten': function (s) {
      s.text(320, 34, '36 × 10', { size: 32, weight: 700, colour: s.C.fun });
      var cols = [['thousands', 170], ['hundreds', 270], ['tens', 370], ['ones', 470]];
      s.add(chart(cols, 64, 100), { enter: 'fade' });
      var a = s.text(370, 144, '3', { size: 52, weight: 700, enter: 'pop', delay: 300 });
      var b = s.text(470, 144, '6', { size: 52, weight: 700, enter: 'pop', delay: 500 });
      s.move(a, 270, 144, 900, { delay: 1300 });
      s.move(b, 370, 144, 900, { delay: 1300 });
      s.text(470, 144, '0', { size: 52, weight: 700, colour: s.C.orange, enter: 'pop', delay: 2300 });
      s.arrow(460, 222, 90, 'l', { colour: s.C.pink, width: 8, delay: 1200 });
      s.text(320, 222, '1 place left', { size: 22, weight: 700, colour: s.C.pink, delay: 1300, anchor: 'end' });
      s.text(320, 290, '36 × 10 = 360', { size: 34, weight: 700, colour: s.C.green, delay: 2600 });
      s.owl(590, 350, 80, { delay: 800 });
    },
    'times-hundred': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, '4.7 × 100', { size: 32, weight: 700, colour: s.C.fun });
      var cols = [['hundreds', 140], ['tens', 240], ['ones', 340], ['tenths', 450]];
      s.add(chart(cols, 64, 100, 395), { enter: 'fade' });
      var a = s.text(340, 144, '4', { size: 52, weight: 700, enter: 'pop', delay: 300 });
      var b = s.text(450, 144, '7', { size: 52, weight: 700, enter: 'pop', delay: 500 });
      s.move(a, 140, 144, 1200, { delay: 1300 });
      s.move(b, 240, 144, 1300, { delay: 1300 });
      s.text(340, 144, '0', { size: 52, weight: 700, colour: s.C.orange, enter: 'pop', delay: 2700 });
      s.text(320, 222, '2 places left', { size: 22, weight: 700, colour: s.C.pink, delay: 1300 });
      s.text(320, 290, '4.7 × 100 = 470', { size: 34, weight: 700, colour: s.C.green, delay: 2900 });
      s.owl(585, 350, 80, { delay: 800 });
    },
    'divide-thousand': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, '52 ÷ 1000', { size: 32, weight: 700, colour: s.C.fun });
      var cols = [['tens', 80], ['ones', 185], ['tenths', 295], ['hundredths', 400], ['thousandths', 505]];
      s.add(chart(cols, 64, 105, 240), { enter: 'fade' });
      var a = s.text(80, 144, '5', { size: 52, weight: 700, enter: 'pop', delay: 300 });
      var b = s.text(185, 144, '2', { size: 52, weight: 700, enter: 'pop', delay: 500 });
      s.move(a, 400, 144, 1500, { delay: 1300 });
      s.move(b, 505, 144, 1500, { delay: 1300 });
      s.text(185, 144, '0', { size: 52, weight: 700, colour: s.C.orange, enter: 'pop', delay: 3000 });
      s.text(295, 144, '0', { size: 52, weight: 700, colour: s.C.orange, enter: 'pop', delay: 3200 });
      s.text(320, 222, '3 places right', { size: 22, weight: 700, colour: s.C.pink, delay: 1300 });
      s.text(320, 290, '52 ÷ 1000 = 0.052', { size: 34, weight: 700, colour: s.C.green, delay: 3400 });
    },
    'count-zeros': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Count the zeros', { size: 32, weight: 700, colour: s.C.fun });
      [['1<tspan fill="#FF8A3D">0</tspan>', '1 place'], ['1<tspan fill="#FF8A3D">00</tspan>', '2 places'], ['1<tspan fill="#FF8A3D">000</tspan>', '3 places']].forEach(function (r, i) {
        s.add(panel(14, -29, 444, 58, '#FFFFFF', i === 0 ? '#F1EDFF' : i === 1 ? '#EAF2FF' : '#FFF4E8'), { y: 110 + i * 70, enter: 'right', delay: i * 600 });
        s.text(230, 110 + i * 70, '× or ÷ ' + r[0], { size: 34, weight: 700, anchor: 'end', delay: i * 600 });
        s.text(260, 110 + i * 70, '→ ' + r[1], { size: 30, weight: 700, colour: s.C.blue, anchor: 'start', delay: i * 600 + 300 });
      });
      s.owl(560, 340, 110, { delay: 1800 });
    },

    /* ---------- 5. Estimating ---------- */
    'sf-title': function (s) {
      s.text(320, 34, 'Significant figures', { size: 32, weight: 700, colour: s.C.fun });
      s.add(panel(178, -46, 296, 92, '#FFFFFF', '#F1EDFF', { rx: 20 }) + digits('0.0382', 250, 56, '#9AA0B4'), { y: 140, enter: 'fade', delay: 300 });
      s.add(T(R(250, 2, sw(56)), 0, '3', 56, '#FF5D8F', 700) + T(R(250, 3, sw(56)), 0, '8', 56, '#1E1B3A', 700) + T(R(250, 4, sw(56)), 0, '2', 56, '#1E1B3A', 700), { y: 140, enter: 'fade', delay: 300 });
      s.add('<circle r="34" fill="none" stroke="#FF5D8F" stroke-width="5"/>', { x: R(250, 2, sw(56)), y: 140, enter: 'pop', delay: 1000 });
      s.text(R(250, 2, sw(56)), 214, 'first significant figure', { size: 22, weight: 700, colour: s.C.pink, delay: 1300 });
      s.text(320, 270, 'Leading zeros do not count.', { size: 22, colour: s.C.muted, delay: 1800 });
      s.owl(560, 350, 90, { delay: 600 });
    },
    'sf-examples': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Round to 1 significant figure', { size: 30, weight: 700, colour: s.C.fun });
      [['49', '50', 170, 120], ['21', '20', 470, 120], ['6.2', '6', 170, 230], ['0.38', '0.4', 470, 230]].forEach(function (r, i) {
        s.add(panel(-130, -40, 260, 80, '#FFFFFF', '#EEE9FF', { rx: 20, stroke: 'rgba(108,77,246,.6)', sw: 2.5 }) +
          T(-50, 2, r[0], 36, '#1E1B3A', 700) + T(10, 2, '→', 32, '#55526E', 700) + T(70, 2, r[1], 36, '#22A06B', 700), { x: r[2], y: r[3], enter: 'pop', delay: i * 500 });
      });
    },
    'estimate-calc': function (s) {
      s.clear(); s.ref = {};
      s.text(200, 34, 'Estimate', { size: 32, weight: 700, colour: s.C.fun });
      s.add(panel(-130, -100, 260, 200, '#FFFFFF', '#F1EDFF', { rx: 22 }), { x: 200, y: 165, enter: 'fade' });
      s.text(200, 100, '49 × 21', { size: 40, weight: 700 });
      s.text(200, 165, '≈ 50 × 20', { size: 36, weight: 700, colour: s.C.blue, delay: 700 });
      s.text(200, 230, '= 1000', { size: 40, weight: 700, colour: s.C.green, enter: 'pop', delay: 1400 });
      s.text(200, 295, 'exact: 1029', { size: 24, colour: s.C.muted, delay: 2100 });
      s.text(200, 330, '≈ means "about"', { size: 20, colour: s.C.muted, delay: 2400 });
    },
    'estimate-check': function (s) {
      var key = lin('#9C86FF', '#5B3FE0');
      s.add(panel(-80, -110, 160, 220, '#4A3699', '#24154F', { rx: 22, sheen: 0.18 }) +
        panel(-62, -92, 124, 50, '#F0FCF6', '#C6EEDB', { rx: 9, sheen: 0.6 }) +
        T(50, -66, '102.9', 30, '#1E1B3A', 700, 'end') + '<defs>' + key[0] + '</defs>' +
        [0, 1, 2].map(function (r) { return [0, 1, 2].map(function (c) { return '<rect x="' + (-60 + c * 44) + '" y="' + (-28 + r * 44) + '" width="32" height="32" rx="8" fill="' + key[1] + '" stroke="rgba(20,10,60,.4)" stroke-width="1.5"/>' +
          '<rect x="' + (-55 + c * 44) + '" y="' + (-25 + r * 44) + '" width="22" height="5" rx="2.5" fill="#fff" opacity=".4"/>'; }).join(''); }).join(''),
        { x: 470, y: 160, enter: 'pop' });
      s.add(ball(24, '#FF8A8E', '#D6343A') + '<path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>', { x: 580, y: 94, enter: 'pop', delay: 900 });
      s.text(450, 300, 'Far from 1000!', { size: 26, weight: 700, colour: s.C.red, delay: 1300 });
      s.owl(598, 352, 60, { delay: 1600 });
    }
  });
})();
