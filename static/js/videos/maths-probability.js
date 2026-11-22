/* Pictures for the Probability theory video (words: videos/maths/probability.json). Stage is 640 x 360; see static/js/theory.js.
   Bars and spinners are drawn to scale (e.g. the 0.3 part of the bar is 0.3 of its length; spinner parts are equal). */
(function () {
  if (!window.Theory) return;

  var FONT = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function T(x, y, t, size, col, anchor, weight) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (weight || 600) + '" fill="' + col + '" text-anchor="' + (anchor || 'middle') +
      '" dominant-baseline="middle" stroke="#FFFDF7" stroke-width="5" paint-order="stroke">' + t + '</text>';
  }
  function frac(x, y, n, d, size, col) {   // a stacked fraction centred at (x, y)
    var w = Math.max(String(n).length, String(d).length) * size * 0.62 + 8;
    return T(x, y - size * 0.62, n, size, col, 'middle', 700) + '<rect x="' + (x - w / 2) + '" y="' + (y - 1.5) + '" width="' + w + '" height="3" rx="1.5" fill="' + col + '"/>' +
      T(x, y + size * 0.66, d, size, col, 'middle', 700);
  }
  /* a line of words and fractions, centred on cx: parts are strings or [numerator, denominator] */
  function eq(s, cx, y, parts, o) {
    o = o || {};
    var size = o.size || 28, col = o.colour || '#1E1B3A', gap = size * 0.32;
    var ws = parts.map(function (p) { return typeof p === 'string' ? p.length * size * 0.46 : Math.max(String(p[0]).length, String(p[1]).length) * size * 0.62 + 8; });
    var total = ws.reduce(function (a, b) { return a + b; }, 0) + gap * (parts.length - 1), x = cx - total / 2, m = '';
    parts.forEach(function (p, i) {
      if (typeof p === 'string') m += T(x, y, p, size, col, 'start', 700);
      else m += frac(x + ws[i] / 2, y, p[0], p[1], size * 0.9, o.fcol || '#6C4DF6');
      x += ws[i] + gap;
    });
    return s.add(m, Object.assign({ enter: 'up' }, o));
  }
  function die(n, size, hi) {   // a dice face centred on 0, 0
    var h = size / 2, r = size * 0.09, q = size * 0.26, P = { 1: [[0, 0]], 2: [[-q, -q], [q, q]], 3: [[-q, -q], [0, 0], [q, q]], 4: [[-q, -q], [q, -q], [-q, q], [q, q]],
      5: [[-q, -q], [q, -q], [0, 0], [-q, q], [q, q]], 6: [[-q, -q], [q, -q], [-q, 0], [q, 0], [-q, q], [q, q]] }[n];
    return '<rect x="' + (-h) + '" y="' + (-h) + '" width="' + size + '" height="' + size + '" rx="' + size * 0.18 + '" fill="' + (hi ? '#FFF4D6' : '#FFFFFF') + '" stroke="' + (hi ? '#FF8A3D' : '#2D1B69') + '" stroke-width="' + (hi ? 5 : 3) + '"/>' +
      P.map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + r + '" fill="#2D1B69"/>'; }).join('');
  }
  function coin(letter, r, col) {
    col = col || (letter === 'H' ? '#FFC93C' : '#C9CED8');
    return '<circle r="' + r + '" fill="' + col + '" stroke="#B7791F" stroke-width="3"/><circle r="' + (r * 0.78) + '" fill="none" stroke="#fff" stroke-opacity=".6" stroke-width="2"/>' +
      T(0, 2, letter, r, '#2D1B69', 'middle', 700);
  }
  var RED = '#E5484D', BLUE = '#2F80ED', GREEN = '#22A06B';
  function counter(col, r) { return '<circle r="' + (r || 20) + '" fill="' + col + '" stroke="#fff" stroke-width="3"/><circle cx="-6" cy="-6" r="5" fill="#fff" opacity=".45"/>'; }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }
  function sector(cx, cy, r, a0, a1, fill) {   // angles in degrees, clockwise from 12 o'clock
    function pt(a) { a = a * Math.PI / 180; return (cx + r * Math.sin(a)).toFixed(1) + ' ' + (cy - r * Math.cos(a)).toFixed(1); }
    return '<path d="M' + cx + ' ' + cy + ' L' + pt(a0) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + pt(a1) + ' Z" fill="' + fill + '" stroke="#fff" stroke-width="3"/>';
  }

  Theory.scenes({
    /* ---------- 1. How likely? ---------- */
    'pw-words': function (s) {
      s.text(320, 40, 'How likely?', { size: 36, weight: 700, colour: s.C.fun });
      s.owl(80, 150, 90, { name: 'owl', delay: 200 });
      s.add('<defs><linearGradient id="pwg" x1="0" x2="1"><stop offset="0" stop-color="#E5484D"/><stop offset=".5" stop-color="#FFC93C"/><stop offset="1" stop-color="#22A06B"/></linearGradient></defs>' +
        '<rect x="60" y="194" width="520" height="12" rx="6" fill="url(#pwg)"/>', { enter: 'fade', delay: 300 });
      ['impossible', 'unlikely', 'even chance', 'likely', 'certain'].forEach(function (w, i) {
        var x = 60 + i * 130;
        s.add('<circle cx="' + x + '" cy="200" r="9" fill="#fff" stroke="#1E1B3A" stroke-width="3"/>', { enter: 'pop', delay: 600 + i * 400 });
        s.text(x, 234, w, { size: 20, colour: s.C.ink, delay: 650 + i * 400 });
      });
    },
    'pw-examples': function (s) {
      s.hide(s.ref.owl);
      s.add(die(6, 46) + T(30, -26, '7?', 22, RED, 'middle', 700), { x: 60, y: 118, enter: 'pop', delay: 200 });
      s.text(60, 165, 'roll a 7', { size: 18, colour: s.C.red, delay: 300 });
      s.add(coin('H', 28), { x: 320, y: 118, enter: 'pop', delay: 1000 });
      s.text(320, 165, 'heads', { size: 18, colour: s.C.orange, delay: 1100 });
      s.add('<circle r="20" fill="#FFC93C"/>' + [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) {
        return '<path d="M0 -26 V-34" stroke="#FFC93C" stroke-width="4" stroke-linecap="round" transform="rotate(' + a + ')"/>';
      }).join(''), { x: 580, y: 116, enter: 'pop', delay: 1800 });
      s.text(580, 165, 'Sun rises', { size: 18, colour: s.C.green, delay: 1900 });
    },
    'pw-scale': function (s) {
      s.add(T(60, 282, '0', 30, '#E5484D', 'middle', 700), { enter: 'pop' });
      s.add(frac(296, 282, 1, 2, 24, '#B7791F') + T(316, 282, '= 0.5', 24, '#B7791F', 'start', 700), { enter: 'pop', delay: 500 });
      s.add(T(580, 282, '1', 30, '#22A06B', 'middle', 700), { enter: 'pop', delay: 1000 });
      s.text(320, 336, 'every probability is from 0 to 1', { size: 20, colour: s.C.muted, delay: 1500 });
    },

    /* ---------- 2. Working out probabilities ---------- */
    'ps-formula': function (s) {
      s.text(320, 40, 'Working it out', { size: 34, weight: 700, colour: s.C.fun });
      s.text(30, 160, 'probability =', { size: 28, weight: 700, anchor: 'start', colour: s.C.deep, delay: 300 });
      s.add(T(410, 132, 'number of ways it can happen', 22, '#6C4DF6', 'middle', 700) + '<rect x="240" y="158" width="340" height="4" rx="2" fill="#1E1B3A"/>' +
        T(410, 188, 'total number of outcomes', 22, '#FF8A3D', 'middle', 700), { enter: 'up', delay: 800 });
      s.owl(90, 350, 100, { delay: 1400 });
      s.text(400, 270, '(when all outcomes are', { size: 20, colour: s.C.muted, delay: 1600 });
      s.text(400, 298, 'equally likely)', { size: 20, colour: s.C.muted, delay: 1650 });
    },
    'ps-dice': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'A fair dice', { size: 32, weight: 700, colour: s.C.fun });
      for (var i = 1; i <= 6; i++) {
        s.add(die(i, 64, false), { x: 70 + (i - 1) * 100, y: 120, enter: 'pop', delay: i * 150 });
        s.add(die(i, 64, true), { x: 70 + (i - 1) * 100, y: 120, enter: 'none', name: 'hi' + i }).style.opacity = 0;
      }
      s.ref.hi6.style.opacity = 1; s.anim(s.ref.hi6, [{ opacity: 0, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(1.12)' }, { opacity: 1, transform: 'scale(1)' }], 700, { delay: 1300 });
      s.text(320, 185, '6 outcomes, all equally likely', { size: 20, colour: s.C.muted, delay: 1100, name: 'six' });
      eq(s, 320, 262, ['P(6) =', [1, 6]], { delay: 1800, name: 'e1' });
      s.text(320, 330, 'P(6) means the probability of a 6', { size: 18, colour: s.C.muted, delay: 2400, name: 'pmean' });
    },
    'ps-bigger': function (s) {
      hideAll(s, ['e1', 'pmean', 'six']);
      s.ref.hi5.style.opacity = 1; s.anim(s.ref.hi5, [{ opacity: 0, transform: 'scale(1)' }, { opacity: 1, transform: 'scale(1.12)' }, { opacity: 1, transform: 'scale(1)' }], 700, { delay: 300 });
      s.text(320, 185, 'greater than 4: a 5 or a 6', { size: 22, colour: s.C.orange, weight: 700, delay: 500 });
      eq(s, 320, 270, ['P(greater than 4) =', [2, 6], '=', [1, 3]], { size: 26, delay: 1200 });
    },
    'ps-bag': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M70 120 Q60 100 90 92 L250 92 Q280 100 270 120 Q320 200 290 300 Q170 340 50 300 Q20 200 70 120 Z" fill="#F3E6CF" stroke="#C98A4B" stroke-width="4"/>' +
        '<path d="M90 92 Q170 70 250 92" fill="none" stroke="#C98A4B" stroke-width="4"/>', { enter: 'pop' });
      var cols = [RED, RED, RED, BLUE, BLUE, BLUE, BLUE, BLUE, GREEN, GREEN], spots = [[110, 150], [170, 145], [230, 150], [90, 205], [145, 200], [200, 200], [255, 205], [120, 260], [180, 258], [235, 262]];
      cols.forEach(function (c, i) { s.add(counter(c, 22), { x: spots[i][0], y: spots[i][1], enter: 'pop', delay: 300 + i * 120 }); });
      s.text(460, 60, '3 red', { size: 22, colour: s.C.red, weight: 700, delay: 1600 });
      s.text(460, 92, '5 blue', { size: 22, colour: s.C.blue, weight: 700, delay: 1750 });
      s.text(460, 124, '2 green', { size: 22, colour: s.C.green, weight: 700, delay: 1900 });
      s.text(460, 166, '10 counters', { size: 24, weight: 700, delay: 2200 });
      eq(s, 465, 250, ['P(blue) =', [5, 10], '=', [1, 2]], { size: 26, delay: 2800 });
    },

    /* ---------- 3. Not happening ---------- */
    'pn-total': function (s) {
      s.text(320, 40, 'It happens, or it doesn\'t', { size: 32, weight: 700, colour: s.C.fun });
      s.add('<rect x="70" y="120" width="500" height="70" rx="12" fill="#E8E3FF" stroke="#6C4DF6" stroke-width="3"/>' + T(320, 156, 'all the chances together = 1', 22, '#2D1B69', 'middle', 700), { enter: 'left', delay: 300, name: 'whole' });
      s.text(320, 260, 'happens + doesn\'t happen = 1', { size: 26, weight: 700, colour: s.C.deep, delay: 1100, name: 'rule' });
      s.owl(570, 352, 80, { delay: 1500, name: 'owl' });
    },
    'pn-rain': function (s) {
      hideAll(s, ['whole', 'rule']);
      s.add('<rect x="70" y="120" width="150" height="70" rx="12" fill="#BFDBFF" stroke="#2F80ED" stroke-width="3"/>' + T(145, 155, 'rain 0.3', 22, '#1E4FA0', 'middle', 700), { enter: 'left', delay: 300 });
      s.add('<rect x="220" y="120" width="350" height="70" rx="12" fill="#FFF4D6" stroke="#FFC93C" stroke-width="3"/>' + T(395, 155, 'no rain 0.7', 22, '#8A5A00', 'middle', 700), { enter: 'right', delay: 900 });
      s.add('<path d="M70 205 V215 H570 V205" fill="none" stroke="#55526E" stroke-width="3"/>' + T(320, 236, '1', 24, '#55526E', 'middle', 700), { enter: 'fade', delay: 1300 });
      s.text(300, 300, '1 − 0.3 = 0.7', { size: 34, weight: 700, colour: s.C.deep, enter: 'pop', delay: 1700 });
    },
    'pn-bag': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Not green', { size: 32, weight: 700, colour: s.C.green });
      var cols = [RED, RED, RED, BLUE, BLUE, BLUE, BLUE, BLUE, GREEN, GREEN];
      cols.forEach(function (c, i) { s.add(counter(c, 22), { x: 72 + i * 55, y: 110, enter: 'pop', delay: i * 100 }); });
      [8, 9].forEach(function (i) { s.add('<path d="M-22 -22 L22 22 M22 -22 L-22 22" stroke="#1E1B3A" stroke-width="5" stroke-linecap="round"/>', { x: 72 + i * 55, y: 110, enter: 'pop', delay: 1200 }); });
      s.add('<path d="M50 150 V160 H490 V150" fill="none" stroke="#6C4DF6" stroke-width="3"/>' + T(270, 182, '8 are not green', 20, '#6C4DF6', 'middle', 700), { enter: 'fade', delay: 1600 });
      eq(s, 320, 270, ['1 −', [2, 10], '=', [8, 10], '=', [4, 5]], { size: 30, delay: 2200 });
    },

    /* ---------- 4. Expected results ---------- */
    'pe-expect': function (s) {
      s.text(320, 40, 'Expected results', { size: 34, weight: 700, colour: s.C.fun });
      s.text(380, 130, 'expected number =', { size: 30, weight: 700, colour: s.C.deep, delay: 300 });
      s.text(380, 190, 'probability × number of tries', { size: 26, weight: 700, colour: s.C.fun, delay: 900 });
      s.owl(90, 350, 110, { delay: 1300 });
    },
    'pe-coin': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Flip a coin 200 times', { size: 30, weight: 700, colour: s.C.fun });
      var c = s.add(coin('H', 60), { x: 130, y: 180, enter: 'pop' });
      s.anim(c, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(-1)' }, { transform: 'scaleX(1)' }], 900, { delay: 400, iterations: 2 });
      s.text(130, 270, 'P(heads) = ½', { size: 22, colour: s.C.orange, weight: 700, delay: 500 });
      eq(s, 430, 170, [[1, 2], '× 200 = 100'], { size: 32, delay: 1200 });
      s.text(430, 260, 'about 100 heads', { size: 28, weight: 700, colour: s.C.green, delay: 2000 });
    },
    'pe-spinner': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Spin it 80 times', { size: 30, weight: 700, colour: s.C.fun });
      s.add(sector(150, 195, 100, 0, 90, RED) + sector(150, 195, 100, 90, 180, '#FFC93C') + sector(150, 195, 100, 180, 270, '#2F80ED') + sector(150, 195, 100, 270, 360, '#22A06B') +
        '<circle cx="150" cy="195" r="100" fill="none" stroke="#2D1B69" stroke-width="4"/>', { enter: 'pop' });
      var arm = s.add('<path d="M0 0 L0 -70" stroke="#1E1B3A" stroke-width="7" stroke-linecap="round"/><path d="M-11 -62 L0 -84 L11 -62 Z" fill="#1E1B3A"/><circle r="10" fill="#1E1B3A"/>', { x: 150, y: 195, enter: 'fade', delay: 200 });
      arm._inner.style.transformBox = 'view-box'; arm._inner.style.transformOrigin = '0 0';
      s.anim(arm, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(765deg)' }], 2200, { delay: 400, easing: 'cubic-bezier(.2,.7,.3,1)' });
      s.text(150, 322, '1 of 4 equal parts is red', { size: 18, colour: s.C.muted, delay: 600 });
      eq(s, 450, 170, [[1, 4], '× 80 = 20'], { size: 32, delay: 1400 });
      s.text(450, 260, 'about 20 reds', { size: 28, weight: 700, colour: s.C.red, delay: 2200 });
    },
    'pe-memory': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'A coin has no memory', { size: 30, weight: 700, colour: s.C.fun });
      for (var i = 0; i < 5; i++) s.add(coin('H', 30), { x: 70 + i * 75, y: 120, enter: 'pop', delay: i * 250 });
      s.add('<circle r="30" fill="#fff" stroke="#6C4DF6" stroke-width="4" stroke-dasharray="6 5"/>' + T(0, 2, '?', 32, '#6C4DF6', 'middle', 700), { x: 540, y: 120, enter: 'pop', delay: 1500 });
      s.text(540, 175, 'next flip', { size: 18, colour: s.C.fun, delay: 1600 });
      eq(s, 320, 255, ['P(heads) is still', [1, 2]], { size: 30, delay: 2100 });
      s.owl(580, 352, 80, { delay: 2600 });
    },

    /* ---------- 5. Two events ---------- */
    'pc-list': function (s) {
      s.text(320, 40, 'Two coins', { size: 32, weight: 700, colour: s.C.fun });
      ['HH', 'HT', 'TH', 'TT'].forEach(function (o, i) {
        var cx = 110 + i * 140;
        s.add(coin(o[0], 26) + '<g transform="translate(58 0)">' + coin(o[1], 26) + '</g>', { x: cx - 29, y: 140, enter: 'pop', delay: 300 + i * 600 });
        s.text(cx, 200, o, { size: 26, weight: 700, colour: s.C.deep, delay: 400 + i * 600 });
      });
      s.text(320, 260, '4 equally likely outcomes', { size: 24, colour: s.C.muted, delay: 2800 });
    },
    'pc-hh': function (s) {
      s.add('<rect x="-75" y="-45" width="150" height="130" rx="18" fill="none" stroke="#FF8A3D" stroke-width="5"/>', { x: 110, y: 160, enter: 'pop' });
      eq(s, 320, 318, ['P(two heads) =', [1, 4]], { size: 28, delay: 600 });
    },
    'pc-grid': function (s) {
      s.clear(); s.ref = {};
      var x0 = 160, w = 75, y0 = 30, h = 60;
      var m = '<rect x="' + x0 + '" y="' + y0 + '" width="' + 6 * w + '" height="' + h * 0.7 + '" fill="#E8E3FF"/>';
      for (var i = 0; i < 6; i++) m += T(x0 + w * (i + 0.5), y0 + h * 0.35, String(i + 1), 22, '#2D1B69', 'middle', 700);
      m += '<rect x="' + (x0 - 60) + '" y="' + (y0 + h * 0.7) + '" width="60" height="' + 2 * h + '" fill="#FFF4D6"/>' +
        T(x0 - 30, y0 + h * 0.7 + h / 2, 'H', 24, '#B7791F', 'middle', 700) + T(x0 - 30, y0 + h * 0.7 + 1.5 * h, 'T', 24, '#55526E', 'middle', 700);
      for (var r = 0; r <= 2; r++) m += '<path d="M' + (x0 - 60) + ' ' + (y0 + h * 0.7 + r * h) + ' H' + (x0 + 6 * w) + '" stroke="#C9C3E6" stroke-width="2"/>';
      for (var c = 0; c <= 6; c++) m += '<path d="M' + (x0 + c * w) + ' ' + y0 + ' V' + (y0 + h * 0.7 + 2 * h) + '" stroke="#C9C3E6" stroke-width="2"/>';
      s.add(m, { enter: 'fade' });
      s.text(x0 - 30, y0 + 21, 'coin', { size: 18, colour: s.C.muted, delay: 200 });
      s.text(x0 + 3 * w, 13, 'dice', { size: 18, colour: s.C.muted, delay: 200 });
      ['H', 'T'].forEach(function (cn, r) {
        for (var k = 1; k <= 6; k++) {
          s.text(x0 + w * (k - 0.5), y0 + h * 0.7 + h * (r + 0.5), cn + k, { size: 22, weight: 700, colour: r ? s.C.muted : '#B7791F', enter: 'pop', delay: 500 + (r * 6 + k) * 150 });
        }
      });
    },
    'pc-count': function (s) {
      var x0 = 160, w = 75, y0 = 30, h = 60;
      s.add('<rect x="' + (x0 + 5 * w + 4) + '" y="' + (y0 + h * 0.7 + 4) + '" width="' + (w - 8) + '" height="' + (h - 8) + '" rx="10" fill="none" stroke="#FF8A3D" stroke-width="5"/>', { enter: 'pop', delay: 1200 });
      s.text(320, 238, '2 × 6 = 12 outcomes', { size: 30, weight: 700, colour: s.C.deep, delay: 200 });
      eq(s, 320, 310, ['P(heads and a 6) =', [1, 12]], { size: 26, delay: 1400 });
    }
  });
})();
