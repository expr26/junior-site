/* Pictures for the Averages and charts theory video (words: videos/maths/statistics.json). Stage is 640 x 360; see static/js/theory.js.
   Every chart is drawn to scale: bar heights match their values, and pie slices have their real angles. */
(function () {
  if (!window.Theory) return;

  /* Soft gradients (the Forces look). Every call makes fresh ids (prefix mDs), so groups on screen together never share one. */
  var gN = 0, EDGE = 'rgba(30,27,58,.35)';
  function gid() { return 'mDs' + (++gN); }
  function mix(hex, t) {   // t > 0 mixes towards white, t < 0 towards black
    var n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255], to = t > 0 ? 255 : 0, a = Math.abs(t);
    return '#' + c.map(function (v) { return ('0' + Math.round(v + (to - v) * a).toString(16)).slice(-2); }).join('');
  }
  function lin(id, a, b, across) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (across ? 1 : 0) + '" y2="' + (across ? 0 : 1) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>';
  }
  function rad(id, a, b) { return '<radialGradient id="' + id + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></radialGradient>'; }
  function sheen(id) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient>'; }
  /* a solid shape: tag + its geometry attributes, filled with a soft gradient of col, a white sheen on top and a thin outline */
  function solid(tag, geo, col, o) {
    o = o || {};
    var g = gid(), h = gid();
    return '<defs>' + lin(g, o.top || mix(col, .4), col) + sheen(h) + '</defs>' +
      '<' + tag + ' ' + geo + ' fill="url(#' + g + ')"' + (o.op ? ' fill-opacity="' + o.op + '"' : '') + '/>' +
      '<' + tag + ' ' + geo + ' fill="url(#' + h + ')" stroke="' + (o.stroke || EDGE) + '" stroke-width="' + (o.sw || 2.5) + '" stroke-linejoin="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
  }
  /* a shiny ball (dots, counters), centred at cx, cy */
  function ball(cx, cy, r, col, ring) {
    var g = gid();
    return '<defs>' + rad(g, mix(col, .5), mix(col, -.12)) + '</defs><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + g + ')" stroke="' + (ring || '#fff') + '" stroke-width="2"/>' +
      '<ellipse cx="' + (cx - r * .3) + '" cy="' + (cy - r * .38) + '" rx="' + (r * .34) + '" ry="' + (r * .22) + '" fill="#fff" opacity=".55"/>';
  }

  var FONT = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function T(x, y, t, size, col, anchor, weight, extra) {
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + size + '" font-weight="' + (weight || 600) + '" fill="' + col + '" text-anchor="' + (anchor || 'middle') +
      '" dominant-baseline="middle" stroke="#FFFDF7" stroke-width="5" paint-order="stroke"' + (extra || '') + '>' + t + '</text>';
  }
  function frac(x, y, n, d, size, col) {
    var w = Math.max(String(n).length, String(d).length) * size * 0.62 + 8;
    return T(x, y - size * 0.62, n, size, col, 'middle', 700) + '<rect x="' + (x - w / 2) + '" y="' + (y - 1.5) + '" width="' + w + '" height="3" rx="1.5" fill="' + col + '"/>' +
      T(x, y + size * 0.66, d, size, col, 'middle', 700);
  }
  function eq(s, cx, y, parts, o) {   // a line of words and fractions centred on cx: parts are strings or [n, d]
    o = o || {};
    var size = o.size || 26, col = o.colour || '#1E1B3A', gap = size * 0.32;
    var ws = parts.map(function (p) { return typeof p === 'string' ? p.length * size * 0.46 : Math.max(String(p[0]).length, String(p[1]).length) * size * 0.62 + 8; });
    var total = ws.reduce(function (a, b) { return a + b; }, 0) + gap * (parts.length - 1), x = cx - total / 2, m = '';
    parts.forEach(function (p, i) {
      if (typeof p === 'string') m += T(x, y, p, size, col, 'start', 700);
      else m += frac(x + ws[i] / 2, y, p[0], p[1], size * 0.9, o.fcol || '#6C4DF6');
      x += ws[i] + gap;
    });
    return s.add(m, Object.assign({ enter: 'up' }, o));
  }
  function card(v, col) {
    col = col || '#6C4DF6';
    var g = gid();
    return '<defs>' + lin(g, '#FFFFFF', mix(col, .88)) + '</defs><rect x="-34" y="-34" width="68" height="68" rx="14" fill="url(#' + g + ')" stroke="' + col + '" stroke-width="3.5"/>' +
      '<rect x="-26" y="-29" width="52" height="6" rx="3" fill="#fff" opacity=".9"/>' + T(0, 2, v, 32, '#1E1B3A', 'middle', 700);
  }
  function ring(col) { return '<rect x="-44" y="-44" width="88" height="88" rx="20" fill="' + col + '" fill-opacity=".08" stroke="' + col + '" stroke-width="5"/>'; }
  function cards(s, vals, xs, y, o) {
    o = o || {};
    return vals.map(function (v, i) { return s.add(card(v, o.col), { x: xs[i], y: y, enter: 'pop', delay: (o.delay || 0) + i * 150 }); });
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }
  function sector(cx, cy, r, a0, a1, fill, stroke) {   // degrees, clockwise from 12 o'clock
    function pt(a) { a = a * Math.PI / 180; return (cx + r * Math.sin(a)).toFixed(1) + ' ' + (cy - r * Math.cos(a)).toFixed(1); }
    var g = gid();   // lighter towards the middle, so each slice looks rounded
    return '<defs><radialGradient id="' + g + '" gradientUnits="userSpaceOnUse" cx="' + cx + '" cy="' + cy + '" r="' + r + '"><stop offset="0" stop-color="' + mix(fill, .45) + '"/><stop offset="1" stop-color="' + fill + '"/></radialGradient></defs>' +
      '<path d="M' + cx + ' ' + cy + ' L' + pt(a0) + ' A' + r + ' ' + r + ' 0 ' + (a1 - a0 > 180 ? 1 : 0) + ' 1 ' + pt(a1) + ' Z" fill="url(#' + g + ')" stroke="' + (stroke || '#fff') + '" stroke-width="' + (stroke ? 6 : 3) + '" stroke-linejoin="round"/>';
  }
  function polar(cx, cy, r, a) { a = a * Math.PI / 180; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; }

  /* mean towers */
  var TX = [200, 320, 440], BH = 28, BASE = 300, TCOL = ['#FF5D8F', '#2F80ED', '#22A06B'];
  function block(col) { return solid('rect', 'x="0" y="0" width="44" height="' + (BH - 3) + '" rx="5"', col) + '<rect x="5" y="3" width="34" height="4" rx="2" fill="#fff" opacity=".5"/>'; }
  /* a bar of a chart: exact x, y, width and height; soft gradient, a white strip down the left, thin outline */
  function bar(x, y, w, h, col) { return solid('rect', 'x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="5"', col, { top: mix(col, .25) }) + '<rect x="' + (x + 5) + '" y="' + (y + 5) + '" width="6" height="' + Math.max(0, h - 10) + '" rx="3" fill="#fff" opacity=".35"/>'; }
  function axes(d) { return '<path d="' + d + '" fill="none" stroke="#1E1B3A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'; }

  /* book bar chart: 30 px per book */
  var BX0 = 90, BY0 = 300, BU = 30, DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], BOOKS = [3, 6, 2, 5, 4];
  function bx(i) { return 125 + i * 62; }

  /* fruit pie */
  var PC = [170, 195], PR = 120;

  Theory.scenes({
    /* ---------- 1. The mean ---------- */
    'mean-towers': function (s) {
      s.text(320, 30, 'The mean', { size: 30, weight: 700, colour: s.C.fun });
      [4, 6, 8].forEach(function (n, t) {
        for (var k = 0; k < n; k++) s.add(block(TCOL[t]), { x: TX[t] - 22, y: BASE - (k + 1) * BH, enter: 'up', delay: t * 500 + k * 90, name: 'b' + t + '_' + k });
        s.text(TX[t], 322, String(n), { size: 26, weight: 700, colour: TCOL[t], delay: t * 500 + 700, name: 'n' + t });
      });
      s.owl(565, 352, 110, { delay: 1600 });
    },
    'mean-level': function (s) {
      s.move(s.ref.b2_7, TX[0] - 22, BASE - 5 * BH, 1200, { delay: 200 });
      s.move(s.ref.b2_6, TX[0] - 22, BASE - 6 * BH, 1200, { delay: 900 });
      s.add('<path d="M150 ' + (BASE - 6 * BH - 2) + ' H490" stroke="#1E1B3A" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round"/>', { enter: 'fade', delay: 2100, flat: true });
      s.text(90, BASE - 6 * BH - 2, 'mean 6', { size: 22, weight: 700, colour: s.C.deep, delay: 2200 });
      hideAll(s, ['n0', 'n2']);
      s.text(TX[0], 322, '6', { size: 26, weight: 700, colour: TCOL[0], delay: 2000 });
      s.text(TX[2], 322, '6', { size: 26, weight: 700, colour: TCOL[2], delay: 2000 });
    },
    'mean-calc': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Add up, then divide', { size: 30, weight: 700, colour: s.C.fun });
      cards(s, [2, 5, 9, 4], [170, 270, 370, 470], 115);
      s.text(320, 200, '2 + 5 + 9 + 4 = 20', { size: 30, weight: 700, delay: 900 });
      s.text(320, 248, '4 numbers, so', { size: 22, colour: s.C.muted, delay: 1600 });
      s.text(320, 300, '20 ÷ 4 = 5', { size: 36, weight: 700, colour: s.C.fun, enter: 'pop', delay: 2100 });
    },
    'mean-total': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Working backwards', { size: 30, weight: 700, colour: s.C.fun });
      s.text(370, 120, 'total = mean × how many', { size: 30, weight: 700, colour: s.C.deep, delay: 300 });
      s.text(370, 190, '4 numbers with a mean of 6', { size: 24, colour: s.C.muted, delay: 1000 });
      s.text(370, 255, '6 × 4 = 24', { size: 36, weight: 700, colour: s.C.fun, enter: 'pop', delay: 1600 });
      s.owl(80, 352, 100, { delay: 2000 });
    },

    /* ---------- 2. Median and mode ---------- */
    'med-order': function (s) {
      s.text(320, 36, 'Median: the middle', { size: 30, weight: 700, colour: s.C.fun });
      var xs = [120, 220, 320, 420, 520], vals = [5, 1, 9, 3, 7], sorted = vals.slice().sort(function (a, b) { return a - b; });
      var cs = cards(s, vals, xs, 140);
      s.text(320, 80, 'put them in order', { size: 20, colour: s.C.muted, delay: 800 });
      cs.forEach(function (c, i) { s.move(c, xs[sorted.indexOf(vals[i])], 140, 1000, { delay: 1300 }); });
      s.add(ring(s.C.orange), { x: 320, y: 140, enter: 'pop', delay: 2600 });
      s.text(320, 250, 'median = 5', { size: 34, weight: 700, colour: s.C.orange, enter: 'pop', delay: 2900 });
    },
    'med-even': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Two in the middle', { size: 30, weight: 700, colour: s.C.fun });
      var xs = [170, 270, 370, 470], vals = [8, 2, 6, 4], sorted = [2, 4, 6, 8];
      var cs = cards(s, vals, xs, 130);
      cs.forEach(function (c, i) { s.move(c, xs[sorted.indexOf(vals[i])], 130, 1000, { delay: 800 }); });
      s.add(ring(s.C.orange), { x: 270, y: 130, enter: 'pop', delay: 2000 });
      s.add(ring(s.C.orange), { x: 370, y: 130, enter: 'pop', delay: 2000 });
      s.text(320, 230, 'halfway between 4 and 6', { size: 24, colour: s.C.ink, delay: 2300 });
      s.text(320, 290, 'median = 5', { size: 34, weight: 700, colour: s.C.orange, enter: 'pop', delay: 2900 });
    },
    'mode': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Mode: the most common', { size: 30, weight: 700, colour: s.C.fun });
      var xs = [120, 220, 320, 420, 520];
      var cs = cards(s, [3, 7, 7, 2, 9], xs, 140);
      [1, 2].forEach(function (i) {
        s.add(ring(s.C.green), { x: xs[i], y: 140, enter: 'pop', delay: 1200 });
        s.anim(cs[i], [{ transform: 'translateY(0)' }, { transform: 'translateY(-14px)' }, { transform: 'translateY(0)' }], 600, { delay: 1300 });
      });
      s.text(320, 230, '7 comes up twice', { size: 24, colour: s.C.ink, delay: 1600 });
      s.text(320, 290, 'mode = 7', { size: 34, weight: 700, colour: s.C.green, enter: 'pop', delay: 2100 });
    },
    'med-tip': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Remember', { size: 30, weight: 700, colour: s.C.fun });
      s.text(300, 130, '<tspan fill="#22A06B">MO</tspan>de = <tspan fill="#22A06B">MO</tspan>st common', { size: 34, weight: 700, enter: 'left', delay: 300 });
      s.text(300, 220, '<tspan fill="#FF8A3D">MED</tspan>ian: like <tspan fill="#FF8A3D">MED</tspan>ium, the middle', { size: 34, weight: 700, enter: 'left', delay: 1300 });
      s.owl(565, 352, 100, { delay: 2000 });
    },

    /* ---------- 3. Range and choosing an average ---------- */
    'range': function (s) {
      s.text(320, 36, 'Range: how spread out', { size: 30, weight: 700, colour: s.C.fun });
      var xs = [120, 220, 320, 420, 520];
      cards(s, [12, 4, 9, 20, 15], xs, 130);
      s.add(ring(s.C.green), { x: 420, y: 130, enter: 'pop', delay: 1000 });
      s.text(420, 195, 'biggest', { size: 20, colour: s.C.green, weight: 700, delay: 1100 });
      s.add(ring(s.C.red), { x: 220, y: 130, enter: 'pop', delay: 1500 });
      s.text(220, 195, 'smallest', { size: 20, colour: s.C.red, weight: 700, delay: 1600 });
      s.text(320, 260, 'range = 20 − 4 = 16', { size: 34, weight: 700, colour: s.C.deep, enter: 'pop', delay: 2200 });
      s.text(320, 310, 'biggest − smallest', { size: 22, colour: s.C.muted, delay: 2600 });
    },
    'choose-mode': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Shoe shop: pairs sold', { size: 30, weight: 700, colour: s.C.fun });
      var sizes = [4, 5, 6], pairs = [3, 7, 4], U = 25;
      s.add(axes('M70 300 H390'), { enter: 'fade', flat: true });
      sizes.forEach(function (z, i) {
        var x = 130 + i * 100, h = pairs[i] * U;
        var b = s.add(bar(x - 32, 300 - h, 64, h, z === 5 ? '#FF8A3D' : '#B9A4FF'), { enter: 'none' });
        b._inner.style.transformOrigin = 'bottom';
        s.anim(b, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], 700, { delay: 300 + i * 300 });
        s.text(x, 300 - h - 18, String(pairs[i]), { size: 22, weight: 700, delay: 900 + i * 300 });
        s.text(x, 324, 'size ' + z, { size: 20, colour: s.C.ink, delay: 300 + i * 300 });
      });
      s.text(520, 140, 'most popular', { size: 22, colour: s.C.muted, delay: 1800 });
      s.text(520, 185, 'mode = size 5', { size: 28, weight: 700, colour: s.C.orange, enter: 'pop', delay: 2100 });
      s.owl(530, 352, 90, { delay: 2500 });
    },
    'choose-median': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 28, 'Five salaries (drawn to scale)', { size: 26, weight: 700, colour: s.C.fun });
      var pay = [20, 21, 22, 23, 200], k = 1.15, base = 290;
      s.add(axes('M20 ' + base + ' H440'), { enter: 'fade', flat: true });
      pay.forEach(function (p, i) {
        var x = 60 + i * 85, h = p * k;
        var b = s.add(bar(x - 28, base - h, 56, h, i === 2 ? '#22A06B' : '#B9A4FF'), { enter: 'none' });
        b._inner.style.transformOrigin = 'bottom';
        s.anim(b, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], 700, { delay: 200 + i * 250 });
        s.text(x, 312, '£' + p + ',000', { size: 18, colour: s.C.ink, delay: 200 + i * 250 });
      });
      var my = base - 57.2 * k;
      s.add('<path d="M20 ' + my.toFixed(1) + ' H440" stroke="#E5484D" stroke-width="3" stroke-dasharray="8 6" stroke-linecap="round"/>', { enter: 'fade', delay: 1800, flat: true });
      s.text(545, 100, 'mean', { size: 22, colour: s.C.red, delay: 1800 });
      s.text(545, 132, '£57,200', { size: 28, weight: 700, colour: s.C.red, delay: 1900 });
      s.text(545, 200, 'median', { size: 22, colour: s.C.green, delay: 2600 });
      s.text(545, 232, '£22,000', { size: 28, weight: 700, colour: s.C.green, delay: 2700 });
    },
    'choose-tip': function (s) {
      s.text(545, 290, 'one big value', { size: 20, colour: s.C.deep, delay: 200 });
      s.text(545, 318, 'pulls the mean up', { size: 20, colour: s.C.deep, delay: 300 });
    },

    /* ---------- 4. Bar charts and scatter graphs ---------- */
    'bar-draw': function (s) {
      var m = '';
      for (var v = 1; v <= 8; v++) m += '<path d="M' + BX0 + ' ' + (BY0 - v * BU) + ' H430" stroke="#E4E0F2" stroke-width="1.5"/>';
      m += axes('M' + BX0 + ' ' + (BY0 - 8 * BU - 10) + ' V' + BY0 + ' H430');
      for (v = 0; v <= 8; v += 2) m += T(BX0 - 10, BY0 - v * BU, String(v), 18, '#55526E', 'end');
      s.add(m, { enter: 'fade', flat: true });
      s.text(BX0 + 4, 32, 'books', { size: 18, colour: s.C.muted, anchor: 'start' });
      BOOKS.forEach(function (n, i) {
        var b = s.add(bar(bx(i) - 22, BY0 - n * BU, 44, n * BU, i === 1 ? '#2F80ED' : '#8FB8F6'), { enter: 'none' });
        b._inner.style.transformOrigin = 'bottom';
        s.anim(b, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], 700, { delay: 300 + i * 250 });
        s.text(bx(i), 322, DAYS[i], { size: 18, colour: s.C.ink, delay: 300 + i * 250 });
      });
      s.text(535, 60, 'Books', { size: 26, weight: 700, colour: s.C.blue, delay: 500 });
      s.text(535, 92, 'borrowed', { size: 26, weight: 700, colour: s.C.blue, delay: 550 });
    },
    'bar-read': function (s) {
      s.add('<path d="M' + bx(1) + ' ' + (BY0 - 6 * BU) + ' H' + BX0 + '" stroke="#FF8A3D" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>', { enter: 'fade', delay: 200, flat: true });
      s.add('<circle cx="' + (BX0 - 20) + '" cy="' + (BY0 - 6 * BU) + '" r="18" fill="#FF8A3D" fill-opacity=".1" stroke="#FF8A3D" stroke-width="4"/>', { enter: 'pop', delay: 800, flat: true });
      s.text(535, 150, 'Tuesday: 6', { size: 24, weight: 700, colour: s.C.orange, delay: 1000 });
    },
    'bar-total': function (s) {
      s.text(535, 200, 'total', { size: 20, colour: s.C.muted, delay: 200 });
      s.text(535, 228, '3+6+2+5+4 = 20', { size: 22, weight: 700, delay: 300 });
      s.text(535, 275, 'mean', { size: 20, colour: s.C.pink, delay: 1200 });
      s.text(535, 303, '20 ÷ 5 = 4', { size: 24, weight: 700, colour: s.C.pink, delay: 1300 });
      s.add('<path d="M' + BX0 + ' ' + (BY0 - 4 * BU) + ' H430" stroke="#FF5D8F" stroke-width="4" stroke-dasharray="10 6" stroke-linecap="round"/>', { enter: 'fade', delay: 1700, flat: true });
    },
    'scatter-pos': function (s) {
      s.clear(); s.ref = {};
      s.add(axes('M80 50 V300 H390') + T(235, 326, 'height', 20, '#55526E') +
        T(0, 0, 'foot length', 20, '#55526E', 'middle', 600, ' transform="translate(52 175) rotate(-90)"'), { enter: 'fade', flat: true });
      var noise = [8, -14, 4, 18, -9, 12, -16, 6, -4, 15, -11, 3, 10, -7];
      noise.forEach(function (n, i) {
        var x = 105 + i * 19, y = 280 - (x - 100) * 0.72 + n;
        s.add(ball(x, y.toFixed(1), 7, '#22A06B'), { enter: 'pop', delay: 300 + i * 120 });
      });
      s.arrow(110, 285, 300, 'r', { colour: s.C.green, width: 5, delay: 2200 }).style.transform += ' rotate(-35deg)';
      s.text(520, 120, 'Positive', { size: 30, weight: 700, colour: s.C.green, delay: 2400 });
      s.text(520, 156, 'correlation', { size: 30, weight: 700, colour: s.C.green, delay: 2450 });
      s.text(520, 215, 'one goes up,', { size: 22, delay: 2800 });
      s.text(520, 245, 'the other goes up', { size: 22, delay: 2900 });
    },
    'scatter-types': function (s) {
      s.clear(); s.ref = {};
      var noise = [10, -12, 4, 14, -8, 9, -14, 5, -5, 12], none = [[20, 30], [140, 50], [70, 110], [110, 140], [30, 90], [150, 120], [90, 40], [50, 140], [130, 85], [80, 75]];
      [['positive', '#22A06B', 1], ['negative', '#E5484D', -1], ['none', '#55526E', 0]].forEach(function (g, i) {
        var ox = 35 + i * 205, d = i * 900, m = axes('M' + ox + ' 110 V280 H' + (ox + 175));
        s.add(m, { enter: 'fade', delay: d, flat: true });
        s.text(ox + 88, 80, g[0], { size: 26, weight: 700, colour: g[1], delay: d });
        for (var k = 0; k < 10; k++) {
          var x, y;
          if (g[2] === 0) { x = ox + 10 + none[k][0]; y = 115 + none[k][1]; }
          else { x = ox + 15 + k * 16; y = g[2] > 0 ? 255 - k * 14 + noise[k] : 128 + k * 14 + noise[k]; }
          s.add(ball(x, y, 6, g[1]), { enter: 'pop', delay: d + 200 + k * 60 });
        }
        s.text(ox + 88, 310, ['slopes up', 'slopes down', 'no pattern'][i], { size: 20, colour: s.C.ink, delay: d + 600 });
      });
    },

    /* ---------- 5. Pie charts ---------- */
    'pie-whole': function (s) {
      var gd = gid();
      s.add('<defs><radialGradient id="' + gd + '" gradientUnits="userSpaceOnUse" cx="' + PC[0] + '" cy="' + PC[1] + '" r="' + PR + '"><stop offset="0" stop-color="#FBFAFF"/><stop offset="1" stop-color="#DCD4FF"/></radialGradient></defs>' +
        '<circle cx="' + PC[0] + '" cy="' + PC[1] + '" r="' + PR + '" fill="url(#' + gd + ')" stroke="#6C4DF6" stroke-width="4"/>', { enter: 'pop', name: 'disc' });
      s.add(T(PC[0], PC[1], '360°', 44, '#6C4DF6', 'middle', 700), { enter: 'pop', delay: 600, name: 'c360' });
      s.text(470, 150, 'a whole circle', { size: 26, delay: 900, name: 'w1' });
      s.text(470, 195, 'is 360°', { size: 30, weight: 700, colour: s.C.fun, delay: 1100, name: 'w2' });
      s.owl(560, 352, 90, { delay: 1500, name: 'owl' });
    },
    'pie-per': function (s) {
      hideAll(s, ['w1', 'w2']);
      s.text(470, 90, '24 people', { size: 26, weight: 700, delay: 200, name: 'q1' });
      s.text(470, 150, '360° ÷ 24 = 15°', { size: 28, weight: 700, colour: s.C.fun, delay: 800, name: 'q2' });
      s.text(470, 200, '15° for each person', { size: 22, colour: s.C.muted, delay: 1400, name: 'q3' });
    },
    'pie-draw': function (s) {
      hideAll(s, ['q1', 'q2', 'q3', 'c360', 'owl']);
      var parts = [['apples', 12, '#E5484D'], ['bananas', 8, '#FFC93C'], ['grapes', 4, '#8A63D2']], a = 0;
      parts.forEach(function (p, i) {
        var deg = p[1] * 15, mid = a + deg / 2, at = i === 2 ? polar(PC[0], PC[1], PR + 28, mid) : polar(PC[0], PC[1], PR * 0.55, mid);
        s.add(sector(PC[0], PC[1], PR, a, a + deg, p[2]), { enter: 'fade', delay: 300 + i * 900, name: 'sl' + i });
        s.add(T(at[0].toFixed(1), at[1].toFixed(1), p[0], 20, i === 2 ? '#5B3BA8' : '#1E1B3A', 'middle', 700), { enter: 'pop', delay: 500 + i * 900 });
        s.text(470, 95 + i * 50, p[0] + ': ' + p[1] + ' × 15° = ' + deg + '°', { size: 21, colour: s.C.ink, delay: 600 + i * 900, name: 't' + i });
        a += deg;
      });
      s.add('<path d="M340 238 H600" stroke="#1E1B3A" stroke-width="2" stroke-linecap="round"/>', { enter: 'fade', delay: 3000, name: 't3', flat: true });
      s.text(470, 265, 'total: 360°', { size: 24, weight: 700, colour: s.C.fun, delay: 3100, name: 't4' });
    },
    'pie-read': function (s) {
      hideAll(s, ['t0', 't1', 't2', 't3', 't4']);
      s.add(sector(PC[0], PC[1], PR, 180, 300, '#FFC93C', '#FF8A3D'), { enter: 'pop', delay: 200 });
      var bl = polar(PC[0], PC[1], PR * 0.55, 240);
      s.add(T(bl[0].toFixed(1), bl[1].toFixed(1), 'bananas', 20, '#1E1B3A', 'middle', 700), { enter: 'fade', delay: 300 });
      s.text(470, 80, 'bananas: 120°', { size: 26, weight: 700, colour: s.C.orange, delay: 300 });
      eq(s, 470, 160, ['120° is', [1, 3], 'of 360°'], { size: 24, delay: 900 });
      eq(s, 470, 250, [[1, 3], 'of 24 = 8 people'], { size: 24, delay: 1700 });
    }
  });
})();
