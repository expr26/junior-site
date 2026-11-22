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
  /* A place value chart: cols = [[label, centre x], ...], a header row and a digit row. */
  function chart(cols, y, w, point) {
    var m = '';
    cols.forEach(function (c, i) {
      m += '<rect x="' + (c[1] - w / 2) + '" y="' + y + '" width="' + w + '" height="40" fill="' + ['#EDE7FF', '#DDF7EE', '#FFF4D6', '#FFE3EC', '#E3EEFF', '#F3E8D6'][i % 6] + '" stroke="#2D1B69" stroke-width="2"/>' +
        '<rect x="' + (c[1] - w / 2) + '" y="' + (y + 40) + '" width="' + w + '" height="80" fill="#FFFFFF" stroke="#2D1B69" stroke-width="2"/>' +
        T(c[1], y + 21, c[0], 18, '#2D1B69', 700);
    });
    if (point) m += '<circle cx="' + point + '" cy="' + (y + 100) + '" r="6" fill="#E5484D"/>';
    return m;
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
      s.add('<rect x="-50" y="-60" width="100" height="120" rx="8" fill="none" stroke="#FF5D8F" stroke-width="6"/>', { x: 270, y: 130, enter: 'pop' });
      s.text(270, 226, 'worth 700', { size: 24, weight: 700, colour: s.C.pink, delay: 400 });
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
      s.text(320, 236, '3 . 4 8 2', { size: 26, colour: s.C.muted, delay: 1900 });
    },
    'pv-decimal-value': function (s) {
      s.add('<rect x="-60" y="-60" width="120" height="120" rx="8" fill="none" stroke="#FF5D8F" stroke-width="6"/>', { x: 375, y: 130, enter: 'pop' });
      s.text(320, 290, '8 hundredths = 0.08', { size: 34, weight: 700, colour: s.C.pink, delay: 600 });
      s.owl(70, 350, 80, { delay: 900 });
    },

    /* ---------- 2. Putting numbers in order ---------- */
    'order-line-up': function (s) {
      s.text(320, 34, 'Line up the decimal points', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<path d="M0 0 V250" stroke="#FF5D8F" stroke-width="3" stroke-dasharray="6 6"/>', { x: 230, y: 70, enter: 'fade', delay: 1600 });
      ['0.7', '0.65', '0.605', '0.07'].forEach(function (n, i) {
        s.add(digits(n, 230), { y: 100 + i * 60, enter: 'right', delay: 300 + i * 300, name: 'n' + i });
      });
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
      s.add('<rect x="0" y="-18" width="104" height="36" rx="18" fill="#22A06B"/>' + T(52, 1, 'biggest', 20, '#FFFFFF', 700), { x: 520, y: 100, enter: 'pop', delay: 1500 });
      s.add('<rect x="0" y="-18" width="114" height="36" rx="18" fill="#9AA0B4"/>' + T(57, 1, 'smallest', 20, '#FFFFFF', 700), { x: 515, y: 280, enter: 'pop', delay: 1900 });
    },
    'order-signs': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Comparing signs', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 130, '3.06 <tspan fill="#FF5D8F">&lt;</tspan> 3.6', { size: 60, weight: 700, enter: 'pop', delay: 200 });
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
      var m = '<path d="M60 0 H580" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/>';
      for (var k = 0; k <= 10; k++) m += '<path d="M' + (70 + k * 50) + ' ' + (k % 5 ? -8 : -16) + ' V' + (k % 5 ? 8 : 16) + '" stroke="#1E1B3A" stroke-width="3"/>';
      m += T(70, 38, '460', 26, '#1E1B3A', 700) + T(570, 38, '470', 26, '#1E1B3A', 700) + T(320, 34, '465', 18, '#55526E', 600);
      s.add(m, { y: 190, enter: 'fade', delay: 200 });
      s.add('<circle r="11" fill="#FF5D8F" stroke="#FFFFFF" stroke-width="3"/>', { x: 420, y: 190, enter: 'pop', delay: 900, name: 'pt' });
      s.text(420, 230, '467', { size: 26, weight: 700, colour: s.C.pink, delay: 1000 });
    },
    'round-closer': function (s) {
      s.add('<path d="M420 180 Q495 100 570 180" fill="none" stroke="#22A06B" stroke-width="4" stroke-dasharray="8 6"/>', { enter: 'fade' });
      s.text(495, 118, '3 away', { size: 22, weight: 700, colour: s.C.green, delay: 200 });
      s.add('<path d="M70 180 Q245 80 420 180" fill="none" stroke="#9AA0B4" stroke-width="4" stroke-dasharray="8 6"/>', { enter: 'fade', delay: 700 });
      s.text(245, 110, '7 away', { size: 22, weight: 700, colour: s.C.muted, delay: 900 });
      s.add('<circle r="30" fill="none" stroke="#22A06B" stroke-width="5"/>', { x: 570, y: 228, enter: 'pop', delay: 1500 });
      s.text(300, 300, '467 → 470', { size: 38, weight: 700, colour: s.C.green, enter: 'pop', delay: 1900 });
      s.owl(70, 352, 70, { delay: 1900 });
    },
    'round-rule': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, '3,850 to the nearest 100', { size: 28, weight: 700, colour: s.C.fun });
      s.add(T(-90, 0, '3', 60, '#1E1B3A', 700) + T(-30, 0, '8', 60, '#1E1B3A', 700) + T(30, 0, '5', 60, '#1E1B3A', 700) + T(90, 0, '0', 60, '#1E1B3A', 700) +
        T(-62, 6, ',', 60, '#1E1B3A', 700), { x: 320, y: 120, enter: 'fade' });
      s.add('<rect x="-26" y="-36" width="52" height="72" rx="8" fill="none" stroke="#2F80ED" stroke-width="4"/>', { x: 290, y: 120, enter: 'pop', delay: 500 });
      s.text(200, 180, 'hundreds', { size: 20, weight: 700, colour: s.C.blue, delay: 600 });
      s.add('<circle r="36" fill="none" stroke="#FF5D8F" stroke-width="5"/>', { x: 350, y: 120, enter: 'pop', delay: 1100 });
      s.text(440, 180, 'look here', { size: 20, weight: 700, colour: s.C.pink, delay: 1200 });
      s.text(320, 228, '5 or more: round up', { size: 26, weight: 700, colour: s.C.orange, delay: 1800 });
      s.text(320, 285, '3,850 → 3,900', { size: 38, weight: 700, colour: s.C.green, enter: 'pop', delay: 2400 });
      s.text(320, 334, '4 or less: keep it the same', { size: 20, colour: s.C.muted, delay: 2800 });
    },
    'round-dp': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, '6.47 to 1 decimal place', { size: 28, weight: 700, colour: s.C.fun });
      s.add(digits('6.47', 300, 56), { y: 110, enter: 'fade' });
      s.add('<rect x="-22" y="-34" width="44" height="68" rx="8" fill="none" stroke="#2F80ED" stroke-width="4"/>', { x: R(300, 1, sw(56)), y: 110, enter: 'pop', delay: 400 });
      s.add('<circle r="32" fill="none" stroke="#FF5D8F" stroke-width="5"/>', { x: R(300, 2, sw(56)), y: 110, enter: 'pop', delay: 900 });
      s.text(320, 178, '7 is 5 or more: round up', { size: 24, weight: 700, colour: s.C.orange, delay: 1400 });
      s.text(320, 232, '6.47 → 6.5', { size: 36, weight: 700, colour: s.C.green, enter: 'pop', delay: 2000 });
      /* 6.4 to 6.5: 400 px, so 6.47 is at 120 + 0.7 x 400 = 400 */
      var m = '<path d="M110 0 H530" stroke="#1E1B3A" stroke-width="3"/>';
      for (var k = 0; k <= 10; k++) m += '<path d="M' + (120 + k * 40) + ' -7 V7" stroke="#1E1B3A" stroke-width="2"/>';
      m += T(120, 28, '6.4', 20, '#1E1B3A', 700) + T(520, 28, '6.5', 20, '#1E1B3A', 700);
      s.add(m, { y: 300, enter: 'fade', delay: 2400 });
      s.add('<circle r="9" fill="#FF5D8F" stroke="#fff" stroke-width="2"/>', { x: 400, y: 300, enter: 'pop', delay: 2700 });
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
        s.text(230, 110 + i * 70, '× or ÷ ' + r[0], { size: 34, weight: 700, anchor: 'end', delay: i * 600 });
        s.text(260, 110 + i * 70, '→ ' + r[1], { size: 30, weight: 700, colour: s.C.blue, anchor: 'start', delay: i * 600 + 300 });
      });
      s.owl(560, 340, 110, { delay: 1800 });
    },

    /* ---------- 5. Estimating ---------- */
    'sf-title': function (s) {
      s.text(320, 34, 'Significant figures', { size: 32, weight: 700, colour: s.C.fun });
      s.add(digits('0.0382', 250, 56, '#9AA0B4'), { y: 140, enter: 'fade', delay: 300 });
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
        s.add('<rect x="-130" y="-40" width="260" height="80" rx="18" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="3"/>' +
          T(-50, 2, r[0], 36, '#1E1B3A', 700) + T(10, 2, '→', 32, '#55526E', 700) + T(70, 2, r[1], 36, '#22A06B', 700), { x: r[2], y: r[3], enter: 'pop', delay: i * 500 });
      });
    },
    'estimate-calc': function (s) {
      s.clear(); s.ref = {};
      s.text(200, 34, 'Estimate', { size: 32, weight: 700, colour: s.C.fun });
      s.text(200, 100, '49 × 21', { size: 40, weight: 700 });
      s.text(200, 165, '≈ 50 × 20', { size: 36, weight: 700, colour: s.C.blue, delay: 700 });
      s.text(200, 230, '= 1000', { size: 40, weight: 700, colour: s.C.green, enter: 'pop', delay: 1400 });
      s.text(200, 295, 'exact: 1029', { size: 24, colour: s.C.muted, delay: 2100 });
      s.text(200, 330, '≈ means "about"', { size: 20, colour: s.C.muted, delay: 2400 });
    },
    'estimate-check': function (s) {
      s.add('<rect x="-80" y="-110" width="160" height="220" rx="20" fill="#2D1B69"/><rect x="-62" y="-92" width="124" height="50" rx="8" fill="#DDF7EE"/>' +
        T(50, -66, '102.9', 30, '#1E1B3A', 700, 'end') +
        [0, 1, 2].map(function (r) { return [0, 1, 2].map(function (c) { return '<rect x="' + (-60 + c * 44) + '" y="' + (-28 + r * 44) + '" width="32" height="32" rx="7" fill="#6C4DF6"/>'; }).join(''); }).join(''),
        { x: 470, y: 160, enter: 'pop' });
      s.add('<circle r="24" fill="#E5484D"/><path d="M-10 -10 L10 10 M10 -10 L-10 10" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>', { x: 580, y: 94, enter: 'pop', delay: 900 });
      s.text(450, 300, 'Far from 1000!', { size: 26, weight: 700, colour: s.C.red, delay: 1300 });
      s.owl(598, 352, 60, { delay: 1600 });
    }
  });
})();
