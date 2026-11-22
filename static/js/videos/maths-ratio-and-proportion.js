/* Pictures for the Ratio and proportion theory video (words: videos/maths/ratio-and-proportion.json).
   Stage is 640 x 360; see static/js/theory.js. Bar models use equal boxes for equal parts. */
(function () {
  if (!window.Theory) return;

  var F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function sweet(col, dark) {
    return '<circle r="20" fill="' + col + '" stroke="' + dark + '" stroke-width="3"/><path d="M-9 -8 q6 -6 12 -4" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>';
  }
  function block(col) { return '<rect x="0" y="0" width="22" height="22" rx="4" fill="' + col + '" stroke="#1E1B3A" stroke-width="1.5"/>'; }
  function frac(n, d, col) {   // a fraction centred on (0, 0)
    return '<text x="0" y="-18" ' + F + ' font-size="28" font-weight="700" fill="' + col + '" text-anchor="middle" dominant-baseline="middle">' + n + '</text>' +
      '<path d="M-18 0 H18" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/>' +
      '<text x="0" y="20" ' + F + ' font-size="28" font-weight="700" fill="' + col + '" text-anchor="middle" dominant-baseline="middle">' + d + '</text>';
  }
  function box(w, col, label) {   // one part of a bar model
    return '<rect x="0" y="0" width="' + w + '" height="44" rx="6" fill="' + col + '" stroke="#1E1B3A" stroke-width="2"/>' +
      (label ? '<text x="' + (w / 2) + '" y="23" ' + F + ' font-size="20" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle">' + label + '</text>' : '');
  }
  function down(s, x, y, len, label, col, delay) {   // a small arrow between two rows, with its step written beside it
    s.arrow(x, y, len, 'd', { colour: col, width: 6, label: label, size: 20, delay: delay });
  }
  /* rows of a "find one first" ladder: [text, colour], with an operation between each pair of rows */
  function ladder(s, x, y0, gap, rows, ops, opCol) {
    rows.forEach(function (r, k) {
      s.text(x, y0 + k * gap, r[0], { size: 26, weight: 700, colour: r[1], delay: k * 1300, anchor: 'start' });
      if (k < rows.length - 1) down(s, x + 30, y0 + k * gap + 20, gap - 40, ops[k], opCol, k * 1300 + 650);
    });
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }

  Theory.scenes({
    /* ---------- 1. What is a ratio? ---------- */
    'sweets': function (s) {
      s.text(320, 36, 'A ratio compares amounts', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<path d="M0 0 Q-10 110 30 130 H370 Q410 110 400 0 Z" fill="#FFF4D6" stroke="#C2570C" stroke-width="3"/>', { x: 120, y: 70, enter: 'fade' });
      for (var i = 0; i < 4; i++) s.add(sweet('#E5484D', '#B42318'), { x: 170 + i * 50, y: 130, enter: 'pop', delay: 300 + i * 250 });
      for (var j = 0; j < 3; j++) s.add(sweet('#22A06B', '#156B47'), { x: 385 + j * 50, y: 130, enter: 'pop', delay: 1400 + j * 250 });
      s.text(245, 182, '4 red', { size: 24, weight: 700, colour: s.C.red, delay: 1300 });
      s.text(435, 182, '3 green', { size: 24, weight: 700, colour: s.C.green, delay: 2200 });
      s.owl(70, 340, 100, { delay: 200, name: 'owl' });
    },
    'ratio-write': function (s) {
      s.text(340, 250, 'red : green = 4 : 3', { size: 38, weight: 700, colour: s.C.deep, enter: 'pop', name: 'r1' });
      s.text(340, 296, 'say it: "4 to 3"', { size: 22, colour: s.C.muted, delay: 700, name: 'r2' });
      s.text(340, 334, 'green : red = 3 : 4', { size: 24, weight: 700, colour: s.C.green, delay: 1600, name: 'r3' });
    },
    'ratio-fraction': function (s) {
      hideAll(s, ['r1', 'r2', 'r3']);
      s.text(340, 236, '4 + 3 = 7 sweets', { size: 30, weight: 700, colour: s.C.deep, delay: 300 });
      s.text(230, 306, 'red:', { size: 24, weight: 700, colour: s.C.red, delay: 1000, anchor: 'end' });
      s.add(frac(4, 7, s.C.red), { x: 262, y: 304, enter: 'pop', delay: 1100 });
      s.text(440, 306, 'green:', { size: 24, weight: 700, colour: s.C.green, delay: 1700, anchor: 'end' });
      s.add(frac(3, 7, s.C.green), { x: 472, y: 304, enter: 'pop', delay: 1800 });
    },

    /* ---------- 2. Equivalent ratios and simplest form ---------- */
    'equiv': function (s) {
      s.text(320, 36, 'Equivalent ratios', { size: 30, weight: 700, colour: s.C.fun });
      [[1, 4, 110], [2, 8, 180], [3, 12, 250]].forEach(function (r, k) {
        var dl = k * 1100;
        s.text(80, r[2] + 11, r[0] + ' : ' + r[1], { size: 26, weight: 700, colour: s.C.deep, delay: dl });
        for (var i = 0; i < r[0] + r[1]; i++) {
          s.add(block(i < r[0] ? '#E5484D' : '#2F80ED'), { x: 160 + i * 26 + (i >= r[0] ? 12 : 0), y: r[2], enter: 'pop', delay: dl + 200 + i * 40 });
        }
      });
      s.text(320, 320, 'same ratio: for every 1 red, 4 blue', { size: 22, weight: 700, colour: s.C.muted, delay: 3000 });
    },
    'simplify': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Simplify: divide both parts', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 110, '8 : 12', { size: 50, weight: 700, colour: s.C.deep, enter: 'pop', name: 's1' });
      s.add('<path d="M-60 0 q-50 60 0 120" fill="none" stroke="#FF8A3D" stroke-width="5" stroke-linecap="round"/><path d="M-60 120 l-4 -18 l18 6 Z" fill="#FF8A3D"/>' +
        '<path d="M60 0 q50 60 0 120" fill="none" stroke="#FF8A3D" stroke-width="5" stroke-linecap="round"/><path d="M60 120 l4 -18 l-18 6 Z" fill="#FF8A3D"/>', { x: 320, y: 135, enter: 'fade', delay: 700, name: 's2' });
      s.text(205, 195, '÷ 4', { size: 26, weight: 700, colour: s.C.orange, delay: 900, name: 's3' });
      s.text(435, 195, '÷ 4', { size: 26, weight: 700, colour: s.C.orange, delay: 900, name: 's4' });
      s.text(320, 285, '2 : 3', { size: 50, weight: 700, colour: s.C.green, enter: 'pop', delay: 1700, name: 's5' });
    },
    'simplify-three': function (s) {
      hideAll(s, ['s1', 's2', 's3', 's4', 's5']);
      s.text(320, 100, '12 : 18 : 30', { size: 44, weight: 700, colour: s.C.deep, enter: 'pop', delay: 300 });
      s.arrow(320, 135, 80, 'd', { colour: s.C.orange, width: 8, label: '÷ 6', size: 26, delay: 900 });
      s.text(320, 255, '2 : 3 : 5', { size: 44, weight: 700, colour: s.C.green, enter: 'pop', delay: 1600 });
      s.add('<rect x="-110" y="-22" width="220" height="44" rx="22" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' +
        '<text ' + F + ' font-size="22" font-weight="700" fill="#0E7A5A" text-anchor="middle" dominant-baseline="middle">simplest form!</text>', { x: 320, y: 318, enter: 'pop', delay: 2300 });
      s.owl(560, 340, 110, { delay: 2300 });
    },

    /* ---------- 3. Sharing in a ratio (bar model: every box is one equal part) ---------- */
    'share-parts': function (s) {
      s.text(320, 36, 'Share £35 in the ratio 2 : 5', { size: 30, weight: 700, colour: s.C.fun });
      s.text(110, 122, 'Mia', { size: 26, weight: 700, colour: s.C.pink, anchor: 'end' });
      s.text(110, 192, 'Leo', { size: 26, weight: 700, colour: s.C.blue, anchor: 'end' });
      for (var i = 0; i < 2; i++) s.add(box(60, '#FFD6E3'), { x: 130 + i * 64, y: 100, enter: 'pop', delay: 300 + i * 200, name: 'm' + i });
      for (var j = 0; j < 5; j++) s.add(box(60, '#D6E6FF'), { x: 130 + j * 64, y: 170, enter: 'pop', delay: 800 + j * 200, name: 'l' + j });
      s.text(320, 270, '2 + 5 = 7 parts', { size: 30, weight: 700, colour: s.C.deep, delay: 2000, name: 'parts' });
    },
    'share-one': function (s) {
      s.hide(s.ref.parts);
      s.text(320, 270, 'one part = £35 ÷ 7 = £5', { size: 30, weight: 700, colour: s.C.deep, delay: 200 });
      for (var i = 0; i < 2; i++) s.text(160 + i * 64, 123, '£5', { size: 20, weight: 700, enter: 'pop', delay: 900 + i * 150 });
      for (var j = 0; j < 5; j++) s.text(160 + j * 64, 193, '£5', { size: 20, weight: 700, enter: 'pop', delay: 1200 + j * 150 });
    },
    'share-answer': function (s) {
      s.add('<path d="M0 0 H12 V44 H0" fill="none" stroke="#FF5D8F" stroke-width="3"/>', { x: 262, y: 100, enter: 'fade', delay: 200 });
      s.text(290, 122, '2 × £5 = £10', { size: 24, weight: 700, colour: s.C.pink, anchor: 'start', delay: 300 });
      s.add('<path d="M0 0 H12 V44 H0" fill="none" stroke="#2F80ED" stroke-width="3"/>', { x: 454, y: 170, enter: 'fade', delay: 1100 });
      s.text(482, 192, '5 × £5 = £25', { size: 22, weight: 700, colour: s.C.blue, anchor: 'start', delay: 1200 });
      s.text(320, 326, 'check: £10 + £25 = £35 ✓', { size: 24, colour: s.C.green, weight: 700, delay: 2200 });
    },
    'share-known': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'squash : water = 2 : 5', { size: 30, weight: 700, colour: s.C.fun });
      s.text(118, 122, 'squash', { size: 22, weight: 700, colour: s.C.orange, anchor: 'end' });
      s.text(118, 192, 'water', { size: 22, weight: 700, colour: s.C.blue, anchor: 'end' });
      for (var i = 0; i < 2; i++) s.add(box(60, '#FFE2C7'), { x: 130 + i * 64, y: 100, enter: 'pop', delay: 200 + i * 150 });
      for (var j = 0; j < 5; j++) s.add(box(60, '#D6E6FF'), { x: 130 + j * 64, y: 170, enter: 'pop', delay: 500 + j * 150 });
      s.add('<path d="M0 0 H12 V44 H0" fill="none" stroke="#FF8A3D" stroke-width="3"/>', { x: 262, y: 100, enter: 'fade', delay: 1000 });
      s.text(290, 122, '2 parts = 60 ml', { size: 24, weight: 700, colour: s.C.orange, anchor: 'start', delay: 1000 });
      s.text(320, 262, '1 part = 60 ÷ 2 = 30 ml', { size: 26, weight: 700, colour: s.C.deep, delay: 2000 });
      for (var k = 0; k < 2; k++) s.text(160 + k * 64, 123, '30', { size: 20, weight: 700, enter: 'pop', delay: 2600 + k * 120 });
      for (var m = 0; m < 5; m++) s.text(160 + m * 64, 193, '30', { size: 20, weight: 700, enter: 'pop', delay: 2900 + m * 120 });
      s.text(320, 316, 'water = 5 × 30 = 150 ml', { size: 28, weight: 700, colour: s.C.blue, delay: 3600 });
    },

    /* ---------- 4. Proportion and best buys ---------- */
    'rubbers': function (s) {
      s.text(320, 36, 'Direct proportion', { size: 30, weight: 700, colour: s.C.fun });
      var R = '<rect x="-30" y="-16" width="60" height="32" rx="8" fill="#FF5D8F" stroke="#B42318" stroke-width="3"/><rect x="6" y="-16" width="24" height="32" rx="6" fill="#2F80ED"/>';
      for (var i = 0; i < 3; i++) s.add(R, { x: 400 + i * 74, y: 100, enter: 'pop', delay: 200 + i * 200 });
      s.add('<path d="M0 0 H60 L76 20 L60 40 H0 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/><circle cx="62" cy="20" r="4" fill="#C2570C"/>' +
        '<text x="30" y="21" ' + F + ' font-size="22" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle">45p</text>', { x: 440, y: 140, enter: 'pop', delay: 900 });
      s.text(60, 100, '3 rubbers = 45p', { size: 26, weight: 700, colour: s.C.deep, anchor: 'start', delay: 500 });
      s.owl(560, 345, 100, { delay: 1300 });
    },
    'rubbers-one': function (s) {
      down(s, 90, 120, 62, '÷ 3', s.C.orange, 0);
      s.text(60, 210, '1 rubber = 15p', { size: 26, weight: 700, colour: s.C.deep, anchor: 'start', delay: 800 });
      down(s, 90, 230, 62, '× 5', s.C.orange, 1600);
      s.text(60, 320, '5 rubbers = 75p', { size: 28, weight: 700, colour: s.C.green, anchor: 'start', delay: 2400 });
    },
    'recipe': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Scaling a recipe', { size: 30, weight: 700, colour: s.C.fun });
      ladder(s, 60, 100, 110, [['4 people: 300 g', s.C.deep], ['1 person: 75 g', s.C.deep], ['6 people: 450 g', s.C.green]], ['÷ 4', '× 6'], s.C.orange);
      s.add('<path d="M-70 0 H70 Q66 60 0 64 Q-66 60 -70 0 Z" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><ellipse cx="0" cy="0" rx="70" ry="12" fill="#FFF4D6" stroke="#8A5A2B" stroke-width="3"/>' +
        '<path d="M30 -10 L80 -70" stroke="#8A5A2B" stroke-width="8" stroke-linecap="round"/>', { x: 490, y: 220, enter: 'pop', delay: 300 });
      s.text(490, 316, 'flour', { size: 22, colour: s.C.muted, delay: 500 });
    },
    'best-buy': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Best buy: compare 100 g', { size: 30, weight: 700, colour: s.C.fun });
      function pack(col, g) {
        return '<rect x="-70" y="-60" width="140" height="120" rx="14" fill="' + col + '" stroke="#1E1B3A" stroke-width="3"/><rect x="-50" y="-36" width="100" height="40" rx="8" fill="#fff"/>' +
          '<text y="-15" ' + F + ' font-size="24" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle">' + g + '</text>';
      }
      s.add(pack('#FFC93C', '400 g'), { x: 170, y: 130, enter: 'pop', delay: 100 });
      s.text(170, 165, '£2.00', { size: 26, weight: 700, delay: 300 });
      s.add(pack('#9AD0FF', '300 g'), { x: 470, y: 130, enter: 'pop', delay: 500 });
      s.text(470, 165, '£1.80', { size: 26, weight: 700, delay: 700 });
      s.text(170, 236, '£2.00 ÷ 4', { size: 22, colour: s.C.muted, delay: 1300 });
      s.text(170, 272, '50p per 100 g', { size: 24, weight: 700, colour: s.C.green, delay: 1700 });
      s.text(470, 236, '£1.80 ÷ 3', { size: 22, colour: s.C.muted, delay: 2200 });
      s.text(470, 272, '60p per 100 g', { size: 24, weight: 700, colour: s.C.red, delay: 2600 });
      s.add('<rect x="-90" y="-20" width="180" height="40" rx="20" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' +
        '<text ' + F + ' font-size="22" font-weight="700" fill="#0E7A5A" text-anchor="middle" dominant-baseline="middle">better value!</text>', { x: 170, y: 322, enter: 'pop', delay: 3300 });
    },
    'inverse': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Inverse proportion', { size: 30, weight: 700, colour: s.C.fun });
      ladder(s, 50, 100, 110, [['3 builders: 8 days', s.C.deep], ['1 builder: 24 days', s.C.deep], ['4 builders: 6 days', s.C.green]], ['× 3', '÷ 4'], s.C.orange);
      var B = '<rect x="-14" y="-14" width="28" height="22" rx="3" fill="#E5484D" stroke="#8A2B2B" stroke-width="2"/>';
      for (var r = 0; r < 4; r++) for (var c = 0; c < 4 - (r % 2); c++) s.add(B, { x: 470 + c * 30 + (r % 2) * 15, y: 250 - r * 24, enter: 'up', delay: 300 + (r * 4 + c) * 80 });
      s.text(515, 300, 'more builders,', { size: 22, colour: s.C.muted, delay: 2600 });
      s.text(515, 328, 'fewer days', { size: 22, weight: 700, colour: s.C.muted, delay: 2700 });
    },

    /* ---------- 5. Maps and scales ---------- */
    'map-scale': function (s) {
      s.add('<rect x="0" y="0" width="300" height="220" rx="12" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' +
        '<path d="M0 190 Q80 168 140 200 T300 182" fill="none" stroke="#2F80ED" stroke-width="12" stroke-linecap="round"/>' +
        '<path d="M20 60 H280" stroke="#C9CED8" stroke-width="8" stroke-linecap="round"/>', { x: 20, y: 70, enter: 'fade', name: 'map' });
      s.add('<rect x="-16" y="-14" width="32" height="28" fill="#FF8A3D" stroke="#1E1B3A" stroke-width="2"/><path d="M-20 -14 L0 -30 L20 -14 Z" fill="#E5484D" stroke="#1E1B3A" stroke-width="2"/>', { x: 70, y: 110, enter: 'pop', delay: 300 });
      s.add('<circle r="18" fill="#22A06B" stroke="#156B47" stroke-width="3"/><rect x="-3" y="14" width="6" height="12" fill="#8A5A2B"/>', { x: 270, y: 110, enter: 'pop', delay: 500 });
      s.text(70, 162, 'school', { size: 18, weight: 700, colour: s.C.deep, delay: 300 });
      s.text(270, 162, 'park', { size: 18, weight: 700, colour: s.C.deep, delay: 500 });
      s.text(480, 90, 'scale', { size: 24, colour: s.C.muted, delay: 800 });
      s.text(480, 134, '1 : 25,000', { size: 36, weight: 700, colour: s.C.fun, enter: 'pop', delay: 1000 });
      s.text(480, 200, '1 cm on the map', { size: 22, weight: 700, delay: 1700, name: 'k1' });
      s.text(480, 232, '=', { size: 22, weight: 700, delay: 1900, name: 'k2' });
      s.text(480, 264, '25,000 cm for real', { size: 22, weight: 700, colour: s.C.green, delay: 2100, name: 'k3' });
    },
    'map-calc': function (s) {
      s.add('<rect x="0" y="0" width="200" height="22" fill="#FFF4D6" stroke="#C2570C" stroke-width="2"/>' +
        [0, 1, 2, 3, 4].map(function (k) { return '<path d="M' + (k * 50) + ' 0 v12" stroke="#C2570C" stroke-width="2"/>'; }).join(''), { x: 70, y: 178, enter: 'up', delay: 200 });
      s.text(170, 220, '4 cm on the map', { size: 20, weight: 700, colour: s.C.orange, delay: 500 });
      s.add('<rect x="-150" y="-26" width="300" height="52" rx="14" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="3"/>', { x: 170, y: 322, enter: 'pop', delay: 1300 });
      s.text(170, 324, '4 × 25,000 = 100,000 cm', { size: 22, weight: 700, colour: s.C.fun, delay: 1400 });
    },
    'map-units': function (s) {
      hideAll(s, ['k1', 'k2', 'k3']);
      s.add('<rect x="0" y="0" width="300" height="190" rx="14" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="3"/>', { x: 330, y: 166, enter: 'fade' });
      s.text(480, 196, '100,000 cm', { size: 24, weight: 700, delay: 200 });
      s.text(360, 232, '÷ 100', { size: 20, weight: 700, colour: s.C.orange, delay: 700, anchor: 'start' });
      s.text(480, 268, '1000 m', { size: 24, weight: 700, delay: 900 });
      s.text(360, 302, '÷ 1000', { size: 20, weight: 700, colour: s.C.orange, delay: 1600, anchor: 'start' });
      s.text(480, 334, '1 km', { size: 30, weight: 700, colour: s.C.green, enter: 'pop', delay: 1800 });
    },
    'model-boat': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Model scale 1 : 30', { size: 30, weight: 700, colour: s.C.fun });
      function boat(k) {
        return '<g transform="scale(' + k + ')"><path d="M-50 0 H50 L36 22 H-36 Z" fill="#E5484D" stroke="#1E1B3A" stroke-width="' + (3 / k) + '"/><path d="M0 0 V-60 L36 -10 Z" fill="#FFFFFF" stroke="#1E1B3A" stroke-width="' + (3 / k) + '"/></g>';
      }
      s.add(boat(0.6), { x: 110, y: 160, enter: 'pop', delay: 200 });
      s.text(110, 200, 'model', { size: 22, weight: 700, colour: s.C.muted, delay: 300 });
      s.text(110, 234, '15 cm', { size: 26, weight: 700, colour: s.C.deep, delay: 500 });
      s.arrow(190, 200, 120, 'r', { colour: s.C.orange, width: 8, label: '× 30', size: 24, delay: 1000 });
      s.add('<rect x="-170" y="0" width="340" height="80" fill="#9AD0FF"/>', { x: 470, y: 280, enter: 'fade', delay: 1400 });
      s.add(boat(1.9), { x: 470, y: 240, enter: 'pop', delay: 1500 });
      s.text(470, 302, 'real: 15 × 30 = 450 cm', { size: 22, weight: 700, colour: s.C.deep, delay: 2200 });
      s.text(470, 336, '= 4.5 m', { size: 26, weight: 700, colour: s.C.green, enter: 'pop', delay: 2800 });
    }
  });
})();
