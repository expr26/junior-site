/* Pictures for the Sequences theory video (words: videos/maths/sequences.json). Stage is 640 x 360; see static/js/theory.js. */
(function () {
  if (!window.Theory) return;

  /* Soft gradients and highlights, as in the Forces video. Every drawing gets fresh gradient ids from a counter, so no id is used twice on the page. */
  var LINE = 'rgba(30,27,58,.35)', NID = 0;
  function uid() { return 'mBs' + (++NID); }
  function lin(id, a, b) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>'; }
  function gloss(id) {   // a white shine at the top left fading to a soft shade, laid over any colour
    return '<radialGradient id="' + id + '" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1E1B3A" stop-opacity=".14"/></radialGradient>';
  }
  /* a rounded card with top left (x, y), w by h: a gradient from a (top) to b (bottom), an outline and a white sheen along the top */
  function card(x, y, w, h, a, b, o) {
    o = o || {};
    var id = uid(), r = o.rx === undefined ? Math.min(18, h / 3) : o.rx, ins = Math.max(6, r * .7);
    return '<defs>' + lin(id, a, b) + '</defs><rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + r + '" fill="url(#' + id + ')" stroke="' + (o.stroke || LINE) + '" stroke-width="' + (o.sw || 2.5) + '"/>' +
      '<rect x="' + (x + ins) + '" y="' + (y + 4) + '" width="' + Math.max(0, w - 2 * ins) + '" height="' + Math.max(3, Math.round(h * .14)) + '" rx="' + Math.max(1.5, h * .07) + '" fill="#fff" opacity=".55"/>';
  }

  var GREEN = '#22A06B', BLUE = '#2F80ED', PINK = '#E0437A', PURPLE = '#6C4DF6';
  var FONT = 'font-family="Fredoka, sans-serif" font-weight="700" text-anchor="middle" dominant-baseline="middle"';
  function xsFor(n, sp) { var a = []; for (var i = 0; i < n; i++) a.push(320 + (i - (n - 1) / 2) * sp); return a; }
  function bubble(s, x, y, t, o) {   // one term in a circle
    o = o || {};
    var fill = o.fill || '#E6DEFF', stroke = o.stroke || PURPLE, size = String(t).length > 2 ? 24 : 28, r = o.r || 32, id = uid();
    return s.add('<defs><radialGradient id="' + id + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="' + fill + '"/></radialGradient></defs>' +
      '<circle r="' + r + '" fill="url(#' + id + ')" stroke="' + stroke + '" stroke-width="3"/>' +
      '<ellipse cx="' + (-r * .38) + '" cy="' + (-r * .5) + '" rx="' + (r * .3) + '" ry="' + (r * .16) + '" fill="#fff" opacity=".8" transform="rotate(-25 ' + (-r * .38) + ' ' + (-r * .5) + ')"/>' +
      '<text y="2" ' + FONT + ' font-size="' + size + '" fill="#1E1B3A">' + t + '</text>', { x: x, y: y, enter: 'pop', delay: o.delay || 0, name: o.name });
  }
  function row(s, nums, y, sp, o) {
    o = o || {};
    var xs = xsFor(nums.length, sp);
    nums.forEach(function (t, i) { if (t !== null) bubble(s, xs[i], y, t, { delay: (o.delay || 0) + i * (o.step || 250), fill: o.fill, stroke: o.stroke, name: o.name && o.name + i }); });
    return xs;
  }
  /* curved jumps between neighbouring terms: above (up = true) or below */
  function jump(s, x1, x2, y, label, colour, delay, below) {
    var h = below ? 34 : -34, mid = (x1 + x2) / 2;
    s.add('<path d="M' + (x1 + 8) + ' ' + y + ' Q' + mid + ' ' + (y + h * 1.6) + ' ' + (x2 - 8) + ' ' + y + '" fill="none" stroke="' + colour + '" stroke-width="3" stroke-linecap="round"/>' +
          '<path d="M' + (x2 - 8) + ' ' + y + ' l-10 ' + (below ? 2 : -2) + ' M' + (x2 - 8) + ' ' + y + ' l-1 ' + (below ? 10 : -10) + '" stroke="' + colour + '" stroke-width="3" stroke-linecap="round"/>', { enter: 'fade', delay: delay });
    s.text(mid, y + h * 1.25, label, { size: 22, weight: 700, colour: colour, enter: 'pop', delay: delay + 200 });
  }
  function jumps(s, xs, y, labels, colour, delay, below) {
    labels.forEach(function (l, i) { jump(s, xs[i], xs[i + 1], y + (below ? 34 : -34), l, colour, delay + i * 400, below); });
  }
  function pill(w, fill, stroke) { return card(-w / 2, -26, w, 52, '#FFFFFF', fill, { stroke: stroke, sw: 3, rx: 16 }); }
  function answer(s, x, y, w, t, o) {
    o = o || {};
    s.add(pill(w, '#DDF7EE', GREEN), { x: x, y: y, enter: 'pop', delay: o.delay || 0 });
    s.text(x, y + 2, t, { size: o.size || 30, weight: 700, colour: '#0E7A5A', enter: 'pop', delay: o.delay || 0 });
  }
  /* a 26 by 26 tile; gl is a shine gradient defined once in the group (glossDefs) */
  function glossDefs(gl) { return '<defs><linearGradient id="' + gl + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".6"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#1E1B3A" stop-opacity=".1"/></linearGradient></defs>'; }
  function sq(x, y, c, gl) {
    return '<rect x="' + x + '" y="' + y + '" width="26" height="26" rx="4" fill="' + c + '"/>' +
      '<rect x="' + x + '" y="' + y + '" width="26" height="26" rx="4" fill="url(#' + gl + ')" stroke="rgba(45,27,105,.55)" stroke-width="1.5"/>';
  }
  /* growing L pattern n: a corner square, n squares going up, n squares going right; bottom-left at (x, y) */
  function lShape(n, x, y, cCorner, cArm, cNew) {
    var gl = uid(), m = glossDefs(gl) + sq(x, y - 26, cCorner, gl);
    for (var k = 1; k <= n; k++) {
      var c = (k === n && cNew) ? cNew : cArm;
      m += sq(x, y - 26 - k * 26, c, gl) + sq(x + k * 26, y - 26, c, gl);
    }
    return m;
  }
  /* a counter (r = 6) with a shine; gl is a gloss gradient defined once in the group (dotDefs) */
  function dotDefs(gl) { return '<defs>' + gloss(gl) + '</defs>'; }
  function dot(x, y, c, gl) { return '<circle cx="' + x + '" cy="' + y + '" r="6" fill="' + c + '"/><circle cx="' + x + '" cy="' + y + '" r="6" fill="url(#' + gl + ')"/>'; }

  /* Fredoka's × looks a lot like the letter x, so every × in s.text is drawn in a plainer font. */
  function timesFix(map) {
    Object.keys(map).forEach(function (k) {
      var f = map[k];
      map[k] = function (s) {
        if (!s._timesFix) {
          var t = s.text;
          s.text = function (x, y, txt, o) { return t(x, y, String(txt).replace(/×/g, '<tspan font-family="Arial, Helvetica, sans-serif" font-weight="700">×</tspan>'), o); };
          s._timesFix = true;
        }
        return f(s);
      };
    });
    return map;
  }

  Theory.scenes(timesFix({
    /* ---------- 1. Spotting the rule ---------- */
    'seq-intro': function (s) {
      s.text(320, 40, 'A sequence follows a rule', { size: 30, weight: 700, colour: s.C.fun });
      var xs = row(s, [4, 9, 14, 19, null], 180, 110, { delay: 300, name: 't' });
      s.text(xs[4], 182, '…', { size: 40, weight: 700, colour: s.C.muted, delay: 1300, name: 'dots' });
      ['1st', '2nd', '3rd', '4th'].forEach(function (l, i) { s.text(xs[i], 236, l + ' term', { size: 18, colour: s.C.muted, delay: 1500 + i * 150 }); });
      s.owl(580, 350, 70, { delay: 1900 });
    },
    'seq-jumps': function (s) {
      var xs = xsFor(5, 110);
      jumps(s, xs.slice(0, 4), 180, ['+5', '+5', '+5'], s.C.orange, 0);
      s.add(pill(330, '#FFF4D6', '#FFC93C'), { x: 320, y: 300, enter: 'pop', delay: 1500 });
      s.text(320, 302, 'term-to-term rule: add 5', { size: 26, weight: 700, colour: '#C2570C', enter: 'pop', delay: 1500 });
    },
    'seq-next': function (s) {
      var xs = xsFor(5, 110);
      s.hide(s.ref.dots);
      jump(s, xs[3], xs[4], 146, '+5', s.C.orange, 0);
      bubble(s, xs[4], 180, 24, { fill: '#C2EEDB', stroke: GREEN, delay: 600 });
    },
    'seq-down': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Going down', { size: 30, weight: 700, colour: s.C.fun });
      var xs = row(s, [50, 44, 38, 32, null], 170, 110, { delay: 200 });
      jumps(s, xs, 170, ['−6', '−6', '−6', '−6'], PINK, 1200);
      bubble(s, xs[4], 170, 26, { fill: '#C2EEDB', stroke: GREEN, delay: 3000 });
      s.text(320, 300, '32 − 6 = 26', { size: 30, weight: 700, colour: GREEN, delay: 3200 });
    },

    /* ---------- 2. Multiplying rules ---------- */
    'doubling': function (s) {
      s.text(320, 40, 'Rules can multiply', { size: 30, weight: 700, colour: s.C.fun });
      var xs = row(s, [3, 6, 12, 24], 170, 130, { delay: 200 });
      jumps(s, xs, 170, ['× 2', '× 2', '× 2'], BLUE, 1200);
    },
    'doubling-gaps': function (s) {
      var xs = xsFor(4, 130);
      jumps(s, xs, 170, ['+3', '+6', '+12'], s.C.grey, 0, true);
      s.text(320, 320, 'gaps not the same, so not adding', { size: 24, weight: 700, colour: s.C.muted, delay: 1500 });
    },
    'triple': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Multiply by 3', { size: 30, weight: 700, colour: s.C.fun });
      var xs = xsFor(6, 102);
      row(s, [2, 6, 18, 54, null, null], 170, 102, { delay: 200 });
      jumps(s, xs.slice(0, 4), 170, ['× 3', '× 3', '× 3'], BLUE, 1100);
      jump(s, xs[3], xs[4], 136, '× 3', BLUE, 2600);
      bubble(s, xs[4], 170, 162, { fill: '#C2EEDB', stroke: GREEN, delay: 2900 });
      jump(s, xs[4], xs[5], 136, '× 3', BLUE, 3400);
      bubble(s, xs[5], 170, 486, { fill: '#C2EEDB', stroke: GREEN, delay: 3700 });
      s.text(xs[4], 230, '5th', { size: 18, colour: s.C.muted, delay: 3000 });
      s.text(xs[5], 230, '6th', { size: 18, colour: s.C.muted, delay: 3800 });
      s.text(200, 300, '54 × 3 = 162', { size: 26, weight: 700, colour: GREEN, delay: 4100 });
      s.text(440, 300, '162 × 3 = 486', { size: 26, weight: 700, colour: GREEN, delay: 4300 });
    },

    /* ---------- 3. Special sequences ---------- */
    'squares': function (s) {
      s.text(320, 40, 'Square numbers', { size: 30, weight: 700, colour: s.C.fun });
      [60, 150, 265, 400, 550].forEach(function (cx, i) {
        var n = i + 1, gl = uid(), m = dotDefs(gl);
        for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) m += dot(cx + (c - (n - 1) / 2) * 18, 200 - (n - 1 - r) * 18, PURPLE, gl);
        s.add(m, { enter: 'pop', delay: i * 450 });
        s.text(cx, 240, String(n * n), { size: 30, weight: 700, colour: s.C.deep, delay: i * 450 + 200 });
        s.text(cx, 280, n + ' × ' + n, { size: 20, colour: s.C.muted, delay: i * 450 + 300 });
      });
    },
    'triangles': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Triangle numbers', { size: 30, weight: 700, colour: s.C.fun });
      var xs = [60, 160, 270, 400, 550], tri = [1, 3, 6, 10, 15];
      xs.forEach(function (cx, i) {
        var n = i + 1, gl = uid(), m = dotDefs(gl);
        for (var r = 0; r < n; r++) for (var c = 0; c <= r; c++) m += dot(cx + (c - r / 2) * 18, 200 - (n - 1 - r) * 18, s.C.orange, gl);
        s.add(m, { enter: 'pop', delay: i * 450 });
        s.text(cx, 240, String(tri[i]), { size: 30, weight: 700, colour: s.C.deep, delay: i * 450 + 200 });
        if (i) s.text((xs[i - 1] + cx) / 2, 285, '+' + (i + 1), { size: 22, weight: 700, colour: PINK, enter: 'pop', delay: i * 450 + 400 });
      });
      s.text(320, 330, 'the gaps grow by 1 each time', { size: 20, colour: s.C.muted, delay: 2600 });
    },
    'fibonacci': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Fibonacci: add the two before', { size: 30, weight: 700, colour: s.C.fun });
      var xs = xsFor(7, 86);
      row(s, [1, 1, 2, 3, 5, 8, null], 150, 86, { delay: 0, step: 200 });
      s.add('<path d="M' + xs[4] + ' 186 V206 H' + xs[5] + ' V186 M' + ((xs[4] + xs[5]) / 2) + ' 206 V226 H' + xs[6] + ' V188" fill="none" stroke="#FF8A3D" stroke-width="3" stroke-linejoin="round"/>', { enter: 'fade', delay: 1500 });
      bubble(s, xs[6], 150, 13, { fill: '#C2EEDB', stroke: GREEN, delay: 2100 });
      s.text(320, 280, '5 + 8 = 13', { size: 32, weight: 700, colour: GREEN, delay: 2300 });
      s.owl(80, 350, 70, { delay: 2700 });
    },

    /* ---------- 4. Growing patterns ---------- */
    'pattern-draw': function (s) {
      s.text(320, 36, 'A growing pattern', { size: 30, weight: 700, colour: s.C.fun });
      [[1, 80], [2, 230], [3, 410]].forEach(function (p, i) {
        s.add(lShape(p[0], p[1], 250, '#B9A8FF', '#D6E6FF'), { enter: 'pop', delay: i * 600, name: 'p' + p[0] });
        s.text(p[1] + 13 + p[0] * 13, 280, 'Pattern ' + p[0], { size: 20, weight: 700, colour: s.C.deep, delay: i * 600 + 200 });
        s.text(p[1] + 13 + p[0] * 13, 312, (2 * p[0] + 1) + ' squares', { size: 20, colour: s.C.muted, delay: i * 600 + 300 });
      });
    },
    'pattern-add': function (s) {
      [[2, 230], [3, 410]].forEach(function (p, i) {
        s.add(lShape(p[0], p[1], 250, '#B9A8FF', '#D6E6FF', '#FFC93C'), { enter: 'fade', delay: i * 700 });
        s.text(p[1] - 30, 140, '+2', { size: 26, weight: 700, colour: '#C2570C', enter: 'pop', delay: i * 700 + 300 });
      });
      s.owl(580, 260, 70, { delay: 1600 });
    },
    'pattern-10': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Jump to Pattern 10', { size: 30, weight: 700, colour: s.C.fun });
      s.text(95, 110, 'Pattern', { size: 22, weight: 700, colour: s.C.muted });
      s.text(95, 175, 'Squares', { size: 22, weight: 700, colour: s.C.muted });
      var cols = [190, 270, 350, 430, 510, 590], top = ['1', '2', '3', '4', '…', '10'], bot = ['3', '5', '7', '9', '…', '21'];
      cols.forEach(function (x, i) {
        s.text(x, 110, top[i], { size: 28, weight: 700, colour: s.C.deep, delay: 300 + i * 250 });
        s.text(x, 175, bot[i], { size: 28, weight: 700, colour: i === 5 ? GREEN : s.C.ink, delay: 300 + i * 250 });
        if (i && i < 4) s.text(x - 40, 212, '+2', { size: 20, weight: 700, colour: '#C2570C', delay: 600 + i * 250 });
      });
      s.text(320, 265, 'Pattern 1, then 9 more jumps of 2', { size: 24, colour: s.C.ink, delay: 2200 });
      answer(s, 320, 320, 270, '3 + 9 × 2 = 21', { delay: 2900, size: 28 });
    },
    'pattern-rule': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Pattern n = 2n + 1 squares', { size: 30, weight: 700, colour: s.C.fun });
      // Pattern 3, colour-coded: corner purple, up arm blue, right arm pink
      var gl = uid(), m = glossDefs(gl) + sq(80, 284, '#B9A8FF', gl);
      for (var k = 1; k <= 3; k++) m += sq(80, 284 - k * 26, '#BFD8FF', gl) + sq(80 + k * 26, 284, '#FFC2D6', gl);
      s.add(m, { enter: 'pop', delay: 200 });
      s.text(60, 245, 'n', { size: 24, weight: 700, colour: BLUE, delay: 700 });
      s.text(145, 332, 'n', { size: 24, weight: 700, colour: PINK, delay: 900 });
      s.text(93, 340, '1', { size: 22, weight: 700, colour: PURPLE, delay: 1100 });
      s.text(450, 120, '<tspan fill="#2F80ED">n</tspan> + <tspan fill="#E0437A">n</tspan> + <tspan fill="#6C4DF6">1</tspan> = 2n + 1', { size: 30, weight: 700, delay: 1400 });
      s.text(450, 190, 'Pattern 10:', { size: 24, colour: s.C.muted, delay: 2200 });
      answer(s, 450, 245, 260, '2 × 10 + 1 = 21', { delay: 2600, size: 28 });
    },

    /* ---------- 5. The nth term ---------- */
    'nth-table': function (s) {
      s.text(320, 36, 'nth term: 3n + 1', { size: 30, weight: 700, colour: s.C.fun });
      s.text(100, 110, 'position n', { size: 22, weight: 700, colour: s.C.muted });
      s.text(100, 185, 'term', { size: 22, weight: 700, colour: s.C.muted });
      [[230, 1, 4], [320, 2, 7], [410, 3, 10]].forEach(function (c, i) {
        s.text(c[0], 110, String(c[1]), { size: 30, weight: 700, colour: s.C.deep, delay: 300 + i * 700 });
        bubble(s, c[0], 185, c[2], { delay: 500 + i * 700 });
      });
      s.text(230, 250, '3 × 1 + 1', { size: 20, colour: s.C.muted, delay: 700 });
    },
    'nth-10': function (s) {
      s.text(490, 110, '…', { size: 30, weight: 700, colour: s.C.muted });
      s.text(490, 185, '…', { size: 30, weight: 700, colour: s.C.muted });
      s.text(570, 110, '10', { size: 30, weight: 700, colour: s.C.deep, delay: 400 });
      bubble(s, 570, 185, 31, { fill: '#C2EEDB', stroke: GREEN, delay: 900 });
      s.text(530, 250, '3 × 10 + 1 = 31', { size: 22, weight: 700, colour: GREEN, delay: 1300 });
      s.owl(320, 350, 70, { delay: 1800 });
    },
    'find-nth': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Find the nth term', { size: 30, weight: 700, colour: s.C.fun });
      s.text(90, 110, 'sequence', { size: 22, weight: 700, colour: s.C.muted });
      s.text(90, 210, '3n', { size: 26, weight: 700, colour: BLUE });
      var xs = [220, 320, 420, 520];
      [5, 8, 11, 14].forEach(function (t, i) { bubble(s, xs[i], 110, t, { delay: 200 + i * 200 }); });
      [3, 6, 9, 12].forEach(function (t, i) { bubble(s, xs[i], 210, t, { fill: '#C4DAFF', stroke: BLUE, delay: 1200 + i * 200 }); });
      xs.forEach(function (x, i) { s.text(x, 160, '+2', { size: 20, weight: 700, colour: '#C2570C', delay: 2200 + i * 200 }); });
      answer(s, 320, 300, 170, '3n + 2', { delay: 3200, size: 32 });
    },
    'find-nth-down': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Going down by 2', { size: 30, weight: 700, colour: s.C.fun });
      s.text(90, 110, 'sequence', { size: 22, weight: 700, colour: s.C.muted });
      s.text(90, 210, '−2n', { size: 26, weight: 700, colour: BLUE });
      var xs = [220, 320, 420, 520];
      [10, 8, 6, 4].forEach(function (t, i) { bubble(s, xs[i], 110, t, { delay: 200 + i * 200 }); });
      ['−2', '−4', '−6', '−8'].forEach(function (t, i) { bubble(s, xs[i], 210, t, { fill: '#C4DAFF', stroke: BLUE, delay: 1200 + i * 200 }); });
      xs.forEach(function (x, i) { s.text(x, 160, '+12', { size: 20, weight: 700, colour: '#C2570C', delay: 2200 + i * 200 }); });
      answer(s, 320, 300, 170, '12 − 2n', { delay: 3200, size: 32 });
    },
    'is-term': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Is 50 a term of 4n + 1?', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 100, '4n + 1 = 50', { size: 32, weight: 700, delay: 300 });
      s.text(320, 150, '4n = 49', { size: 32, weight: 700, delay: 1000 });
      s.text(320, 200, 'n = 49 ÷ 4 = 12.25', { size: 32, weight: 700, delay: 1700 });
      s.text(320, 255, 'not a whole number, so no!', { size: 28, weight: 700, colour: s.C.red, enter: 'pop', delay: 2500 });
      s.text(320, 315, '12th term = 49, 13th term = 53', { size: 22, colour: s.C.muted, delay: 3200 });
    }
  }));
})();
