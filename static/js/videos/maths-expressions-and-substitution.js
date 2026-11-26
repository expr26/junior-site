/* Pictures for the Expressions and substitution theory video (words: videos/maths/expressions-and-substitution.json).
   Stage is 640 x 360; see static/js/theory.js. The 8 cm by 5 cm rectangle is drawn to scale (1 cm = 22 units). */
(function () {
  if (!window.Theory) return;

  /* Soft gradients and highlights, as in the Forces video. Every drawing gets fresh gradient ids from a counter, so no id is used twice on the page. */
  var LINE = 'rgba(30,27,58,.35)', NID = 0;
  function uid() { return 'mBe' + (++NID); }
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

  var BLUE = '#2F80ED', PINK = '#E0437A', GREEN = '#22A06B';
  function col(c, t) { return '<tspan fill="' + c + '">' + t + '</tspan>'; }
  function bag() {   // a bag of sweets, centred on (0, 0)
    var a = uid(), b = uid();
    return '<defs>' + lin(a, '#FFB0C8', '#F2648F') + lin(b, '#FF86AB', '#D9416F') + '</defs>' +
      '<path d="M-46 -40 L-30 -64 H30 L46 -40 Z" fill="url(#' + b + ')" stroke="' + LINE + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<rect x="-56" y="-42" width="112" height="100" rx="22" fill="url(#' + a + ')" stroke="' + LINE + '" stroke-width="2.5"/>' +
      '<path d="M-44 -40 H44" stroke="#C93A68" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="-48" y="-32" width="10" height="76" rx="5" fill="#fff" opacity=".28"/>' +
      '<text y="10" font-family="Fredoka, sans-serif" font-size="54" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle" stroke="#C93A68" stroke-width="3" paint-order="stroke">n</text>';
  }
  function sweet(c) {
    var g = uid();
    return '<defs>' + gloss(g) + '</defs>' +
      '<path d="M-24 0 L-38 -11 Q-41 0 -38 11 Z M24 0 L38 -11 Q41 0 38 11 Z" fill="' + c + '" stroke="' + LINE + '" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<circle r="17" fill="' + c + '"/><circle r="17" fill="url(#' + g + ')" stroke="' + LINE + '" stroke-width="2"/>' +
      '<path d="M-9 -8 Q-3 -13 4 -12" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".85"/>';
  }
  function apple() {
    var g = uid();
    return '<defs>' + gloss(g) + '</defs>' +
      '<path d="M0 -22 q2 -10 8 -14" stroke="#8A5A2B" stroke-width="4" fill="none" stroke-linecap="round"/>' +
      '<path d="M4 -26 q10 -12 22 -8 q-8 12 -22 8 Z" fill="#3CBF7A" stroke="rgba(20,90,50,.45)" stroke-width="1.5"/>' +
      '<circle r="26" fill="#E5484D"/><circle r="26" fill="url(#' + g + ')" stroke="' + LINE + '" stroke-width="2"/>' +
      '<ellipse cx="-11" cy="-12" rx="6" ry="4" fill="#fff" opacity=".45" transform="rotate(-30 -11 -12)"/>' +
      '<text y="3" font-family="Fredoka, sans-serif" font-size="28" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">a</text>';
  }
  function pill(w, fill, stroke, h) { h = h || 60; return card(-w / 2, -h / 2, w, h, '#FFFFFF', fill, { stroke: stroke, sw: 3, rx: Math.min(18, h * .3) }); }
  function taxi() {   // a yellow taxi, the same shape as the cars in the Forces video
    var id = uid(), body = 'M6 42 Q8 22 32 19 L50 4 Q58 -1 86 2 L106 19 Q128 22 130 42 V50 Q130 54 126 54 H10 Q6 54 6 50 Z';
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient></defs>' +
      '<rect x="50" y="-14" width="36" height="15" rx="4" fill="#2A2740"/><rect x="55" y="-10" width="26" height="5" rx="2.5" fill="#FFC93C"/>' +
      '<path d="' + body + '" fill="#FFC93C"/><path d="' + body + '" fill="url(#' + id + ')" stroke="rgba(30,27,58,.55)" stroke-width="2"/>' +
      '<path d="M44 19 L56 8 H76 V19 Z M82 19 V8 H90 L101 19 Z" fill="#D8EEFF" stroke="rgba(30,27,58,.35)" stroke-width="1.5"/>' +
      '<path d="M10 34 H126" stroke="#2A2740" stroke-width="4" stroke-dasharray="6 6" opacity=".55"/>' +
      '<rect x="118" y="26" width="10" height="6" rx="3" fill="#FFF6C7"/><rect x="8" y="26" width="8" height="6" rx="3" fill="#FF8A8A"/>' +
      '<circle cx="36" cy="54" r="13" fill="#2A2740"/><circle cx="36" cy="54" r="6" fill="#D5D9E3"/>' +
      '<circle cx="104" cy="54" r="13" fill="#2A2740"/><circle cx="104" cy="54" r="6" fill="#D5D9E3"/>';
  }
  function answer(s, x, y, w, t, o) {   // green answer box
    o = o || {};
    s.add(pill(w, '#DDF7EE', GREEN, o.h), { x: x, y: y, enter: 'pop', delay: o.delay || 0, name: o.name });
    s.text(x, y + 2, t, { size: o.size || 30, weight: 700, colour: '#0E7A5A', enter: 'pop', delay: o.delay || 0 });
  }
  function tick(s, x, y, delay) { s.text(x, y, '✓', { size: 34, weight: 700, colour: GREEN, enter: 'pop', delay: delay }); }
  function cross(s, x, y, delay) { s.text(x, y, '✗', { size: 34, weight: 700, colour: s.C.red, enter: 'pop', delay: delay }); }

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
    /* ---------- 1. Letters for numbers ---------- */
    'bag-n': function (s) {
      s.text(320, 40, 'A letter stands for a number', { size: 30, weight: 700, colour: s.C.fun });
      s.add(bag(), { x: 320, y: 190, enter: 'pop', delay: 300, name: 'bag' });
      s.text(320, 290, 'n sweets', { size: 28, colour: s.C.ink, delay: 900, name: 'nlabel' });
      s.owl(90, 330, 110, { delay: 600 });
      s.text(110, 180, '?', { size: 48, weight: 700, colour: s.C.sun, enter: 'pop', delay: 1200 });
    },
    'n-plus-3': function (s) {
      s.hide(s.ref.nlabel);
      s.move(s.ref.bag, 220, 190, 700);
      s.text(330, 190, '+', { size: 48, weight: 700, colour: s.C.ink, delay: 600 });
      [['#FFC93C', 0], ['#2F80ED', 1], ['#22A06B', 2]].forEach(function (c) {
        s.add(sweet(c[0]), { x: 400 + c[1] * 90, y: 190, enter: 'pop', delay: 900 + c[1] * 300 });
      });
      s.text(490, 240, '3 more', { size: 22, colour: s.C.muted, delay: 1900 });
      answer(s, 320, 310, 200, 'n + 3', { delay: 2300, size: 36 });
    },
    'five-x': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Leave out the × sign', { size: 30, weight: 700, colour: s.C.fun });
      s.text(190, 160, '5 × ' + col(BLUE, 'x'), { size: 54, weight: 700, colour: s.C.ink, enter: 'pop', delay: 300 });
      s.arrow(280, 160, 90, 'r', { colour: s.C.fun, width: 8, delay: 1000 });
      s.text(450, 160, '5x', { size: 64, weight: 700, colour: BLUE, enter: 'pop', delay: 1500 });
      s.text(320, 260, 'number first, then the letter', { size: 24, colour: s.C.muted, delay: 2100 });
      s.owl(570, 340, 80, { delay: 2400 });
    },
    'more-notation': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'More ways to write things', { size: 30, weight: 700, colour: s.C.fun });
      var rows = [['n − 2', '2 less than n'], ['n ÷ 4', 'n shared into 4 parts'], [col(BLUE, 'x') + ' × ' + col(BLUE, 'x') + ' = ' + col(BLUE, 'x²'), 'x squared']];
      rows.forEach(function (r, i) {
        var y = 120 + i * 80, d = i * 900;
        s.add(pill(210, '#F1ECFF', s.C.fun), { x: 150, y: y, enter: 'pop', delay: d });
        s.text(150, y + 2, r[0], { size: 32, weight: 700, colour: s.C.deep, enter: 'pop', delay: d });
        s.text(285, y, r[1], { size: 24, colour: s.C.ink, anchor: 'start', delay: d + 400 });
      });
    },

    /* ---------- 2. Simplifying ---------- */
    'four-a': function (s) {
      s.text(320, 40, 'Collecting the same letter', { size: 30, weight: 700, colour: s.C.fun });
      for (var i = 0; i < 4; i++) {
        s.add(apple(), { x: 110 + i * 120, y: 150, enter: 'pop', delay: i * 350 });
        if (i < 3) s.text(170 + i * 120, 152, '+', { size: 40, weight: 700, delay: i * 350 + 200 });
      }
      s.text(320, 230, 'four lots of a', { size: 26, colour: s.C.muted, delay: 1700 });
      answer(s, 320, 300, 150, '4a', { delay: 2200, size: 40 });
    },
    'like-terms': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Like terms', { size: 34, weight: 700, colour: s.C.fun });
      s.text(320, 84, 'exactly the same letters', { size: 24, colour: s.C.muted, delay: 300 });
      s.text(220, 160, col(BLUE, '3x') + '  and  ' + col(BLUE, '5x'), { size: 36, weight: 700, delay: 700 });
      tick(s, 360, 160, 1300);
      s.text(470, 160, 'like terms', { size: 24, colour: GREEN, delay: 1300 });
      s.text(220, 250, col(BLUE, '3x') + '  and  ' + col(PINK, '5y'), { size: 36, weight: 700, delay: 2000 });
      cross(s, 360, 250, 2600);
      s.text(490, 250, 'not like terms', { size: 24, colour: s.C.red, delay: 2600 });
      s.owl(570, 350, 70, { delay: 3000 });
    },
    'collect': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Simplify', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 110, col(BLUE, '3x') + ' + ' + col(PINK, '5y') + ' ' + col(BLUE, '− x') + ' ' + col(PINK, '+ 2y'), { size: 42, weight: 700, enter: 'pop', delay: 200 });
      s.text(120, 190, 'x terms:', { size: 26, anchor: 'start', colour: BLUE, delay: 1000 });
      s.text(260, 190, '3x − x = 2x', { size: 30, weight: 700, anchor: 'start', colour: BLUE, delay: 1300 });
      s.text(120, 245, 'y terms:', { size: 26, anchor: 'start', colour: PINK, delay: 2200 });
      s.text(260, 245, '5y + 2y = 7y', { size: 30, weight: 700, anchor: 'start', colour: PINK, delay: 2500 });
    },
    'collect-answer': function (s) {
      answer(s, 320, 315, 220, col(BLUE, '2x') + ' + ' + col(PINK, '7y'), { size: 36 });
      s.owl(540, 350, 80, { delay: 600 });
    },
    'multiply-terms': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Multiplying terms', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 110, '3a × 4b', { size: 48, weight: 700, enter: 'pop', delay: 200 });
      s.text(200, 190, 'numbers:', { size: 24, colour: s.C.muted, delay: 900 });
      s.text(200, 230, '3 × 4 = 12', { size: 30, weight: 700, colour: s.C.orange, delay: 1100 });
      s.text(440, 190, 'letters:', { size: 24, colour: s.C.muted, delay: 1700 });
      s.text(440, 230, 'a × b = ab', { size: 30, weight: 700, colour: BLUE, delay: 1900 });
      answer(s, 320, 310, 180, '12ab', { delay: 2600, size: 38 });
    },

    /* ---------- 3. Substitution ---------- */
    'sub-3a': function (s) {
      s.text(320, 40, 'Substitution', { size: 34, weight: 700, colour: s.C.fun });
      s.text(320, 84, 'put the number in place of the letter', { size: 22, colour: s.C.muted, delay: 300 });
      s.add(pill(120, '#FFF4D6', '#C2570C'), { x: 110, y: 170, enter: 'pop', delay: 600 });
      s.text(110, 172, 'a = 6', { size: 30, weight: 700, colour: s.C.orange, enter: 'pop', delay: 600 });
      s.text(330, 170, '3a', { size: 48, weight: 700, delay: 1000 });
      s.text(330, 250, '3 × 6', { size: 40, weight: 700, colour: s.C.ink, delay: 1700 });
      s.arrow(330, 200, 24, 'd', { colour: s.C.orange, width: 6, delay: 1500 });
      answer(s, 500, 250, 120, '18', { delay: 2400, size: 38 });
      s.owl(560, 150, 80, { delay: 2800 });
    },
    'sub-pq': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'p = 5 and q = 2', { size: 30, weight: 700, colour: s.C.orange });
      s.text(320, 110, '4p − 3q', { size: 44, weight: 700, delay: 300 });
      s.text(320, 180, '= 4 × 5 − 3 × 2', { size: 32, delay: 1000 });
      s.text(320, 240, '= 20 − 6', { size: 32, delay: 1800 });
      answer(s, 320, 310, 140, '= 14', { delay: 2500, size: 34 });
    },
    'sub-square': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'y = 3', { size: 30, weight: 700, colour: s.C.orange });
      s.text(320, 100, 'y² + 2y', { size: 44, weight: 700, delay: 300 });
      s.text(320, 165, 'powers first: y² = 3 × 3 = 9', { size: 28, colour: s.C.fun, delay: 1000 });
      s.text(320, 225, '2y = 2 × 3 = 6', { size: 28, delay: 1800 });
      answer(s, 320, 305, 220, '9 + 6 = 15', { delay: 2500, size: 32 });
    },
    'sub-2x2': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'x = 4', { size: 30, weight: 700, colour: s.C.orange });
      s.text(320, 100, '2' + col(BLUE, 'x²') + ' means 2 × ' + col(BLUE, 'x') + ' × ' + col(BLUE, 'x'), { size: 34, weight: 700, delay: 300 });
      s.text(180, 170, 'Right', { size: 26, weight: 700, colour: GREEN, delay: 1000 });
      s.text(180, 220, '2 × 4²', { size: 30, delay: 1200 });
      s.text(180, 265, '= 2 × 16', { size: 30, delay: 1600 });
      answer(s, 180, 320, 130, '= 32', { delay: 2000, size: 30 });
      s.text(470, 170, 'Not this', { size: 26, weight: 700, colour: s.C.red, delay: 2600 });
      s.text(470, 220, '(2 × 4)² = 8 × 8', { size: 26, colour: s.C.muted, delay: 2800 });
      s.text(470, 265, '= 64', { size: 30, colour: s.C.muted, delay: 3000 });
      cross(s, 470, 315, 3300);
    },
    'sub-negative': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'a = −2', { size: 30, weight: 700, colour: s.C.orange });
      s.text(320, 100, '5 − 3a', { size: 44, weight: 700, delay: 300 });
      s.text(320, 160, '3a = 3 × (−2) = −6', { size: 30, colour: s.C.fun, delay: 1000 });
      s.text(320, 215, '5 − (−6) = 5 + 6', { size: 30, delay: 1800 });
      answer(s, 320, 290, 130, '= 11', { delay: 2500, size: 34 });
      s.text(320, 338, 'taking away a negative is the same as adding', { size: 18, colour: s.C.muted, delay: 3000 });
    },

    /* ---------- 4. Brackets ---------- */
    'bracket-lots': function (s) {
      s.text(320, 50, '3(x + 4)', { size: 52, weight: 700, colour: s.C.deep, enter: 'pop', name: 'br' });
      for (var i = 0; i < 3; i++) {
        var y = 140 + i * 62, d = 600 + i * 400;
        s.add(card(0, -22, 200, 44, '#EEF4FF', '#C4DAFF', { stroke: '#2F80ED', rx: 10 }) +
              '<text x="100" y="2" font-family="Fredoka, sans-serif" font-size="26" font-weight="700" fill="#2F80ED" text-anchor="middle" dominant-baseline="middle">x</text>' +
              card(206, -22, 90, 44, '#FFFAEC', '#FFE3A8', { stroke: '#C2570C', rx: 10 }) +
              '<text x="251" y="2" font-family="Fredoka, sans-serif" font-size="26" font-weight="700" fill="#C2570C" text-anchor="middle" dominant-baseline="middle">4</text>',
              { x: 120, y: y, enter: 'left', delay: d });
      }
      s.text(110, 202, '3 lots', { size: 22, colour: s.C.muted, delay: 1900, anchor: 'end' });
    },
    'expand': function (s) {
      s.add('<path d="M-72 -26 Q-50 -52 -27 -26" fill="none" stroke="#6C4DF6" stroke-width="4" stroke-linecap="round"/>' +
            '<path d="M-72 -26 Q-8 -72 55 -26" fill="none" stroke="#6C4DF6" stroke-width="4" stroke-linecap="round"/>', { x: 320, y: 50, enter: 'fade', delay: 200 });
      s.text(450, 140, '3 ' + col('#1E1B3A', '×') + ' x = 3x', { size: 26, weight: 700, colour: s.C.blue, anchor: 'start', delay: 700 });
      s.text(450, 202, '3 ' + col('#1E1B3A', '×') + ' 4 = 12', { size: 26, weight: 700, colour: '#C2570C', anchor: 'start', delay: 1300 });
      answer(s, 520, 320, 200, '3x + 12', { delay: 2000, size: 32 });
    },
    'expand-area': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Area picture (not to scale)', { size: 24, weight: 700, colour: s.C.fun });
      s.add(card(0, 0, 260, 150, '#EEF4FF', '#C4DAFF', { stroke: '#2F80ED', sw: 3, rx: 6 }) +
            '<text x="130" y="78" font-family="Fredoka, sans-serif" font-size="34" font-weight="700" fill="#2F80ED" text-anchor="middle" dominant-baseline="middle">3x</text>', { x: 120, y: 110, enter: 'pop', delay: 300 });
      s.add(card(0, 0, 110, 150, '#FFFAEC', '#FFE3A8', { stroke: '#C2570C', sw: 3, rx: 6 }) +
            '<text x="55" y="78" font-family="Fredoka, sans-serif" font-size="34" font-weight="700" fill="#C2570C" text-anchor="middle" dominant-baseline="middle">12</text>', { x: 380, y: 110, enter: 'pop', delay: 700 });
      s.text(250, 88, 'x', { size: 28, weight: 700, colour: s.C.blue, delay: 1100 });
      s.text(435, 88, '4', { size: 28, weight: 700, colour: '#C2570C', delay: 1100 });
      s.text(96, 185, '3', { size: 28, weight: 700, colour: s.C.ink, delay: 1300 });
      s.text(320, 310, 'area = 3x + 12', { size: 32, weight: 700, colour: GREEN, delay: 1900 });
    },
    'expand-two': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Expand and simplify', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 100, '2(a + 3) + 4(a − 1)', { size: 38, weight: 700, delay: 300 });
      s.text(320, 170, '= ' + col(BLUE, '2a') + ' + 6 + ' + col(BLUE, '4a') + ' − 4', { size: 34, delay: 1100 });
      s.text(190, 230, 'a terms: 2a + 4a = 6a', { size: 22, colour: s.C.blue, delay: 2000 });
      s.text(460, 230, 'numbers: 6 − 4 = 2', { size: 22, colour: s.C.muted, delay: 2300 });
      answer(s, 320, 300, 180, '6a + 2', { delay: 2700, size: 34 });
    },
    'factorise': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Factorising: brackets back in', { size: 30, weight: 700, colour: s.C.fun });
      s.text(320, 110, '6x + 9', { size: 46, weight: 700, delay: 300 });
      s.text(220, 175, '6x = 3 × 2x', { size: 26, colour: s.C.muted, delay: 1100 });
      s.text(430, 175, '9 = 3 × 3', { size: 26, colour: s.C.muted, delay: 1400 });
      answer(s, 320, 255, 220, '3(2x + 3)', { delay: 1900, size: 34 });
      s.text(320, 325, 'check: expand it and you get 6x + 9 again', { size: 20, colour: s.C.muted, delay: 2600 });
      s.owl(580, 130, 70, { delay: 2200 });
    },

    /* ---------- 5. Formulae ---------- */
    'taxi': function (s) {
      s.text(320, 40, 'A formula for the taxi', { size: 30, weight: 700, colour: s.C.fun });
      s.add(taxi(), { x: 40, y: 110, enter: 'left', name: 'taxi' });
      s.text(380, 110, '£3 to start', { size: 26, delay: 600 });
      s.text(380, 150, '+ £2 for each mile', { size: 26, delay: 1100 });
      s.add(pill(260, '#F1ECFF', s.C.fun), { x: 320, y: 225, enter: 'pop', delay: 1800, name: 'formula' });
      s.text(320, 227, 'C = 3 + 2m', { size: 38, weight: 700, colour: s.C.deep, enter: 'pop', delay: 1800, name: 'ftext' });
      s.text(190, 300, 'C = cost in £', { size: 22, colour: s.C.muted, delay: 2500, name: 'key' });
      s.text(440, 300, 'm = number of miles', { size: 22, colour: s.C.muted, delay: 2700, name: 'key2' });
    },
    'taxi-7': function (s) {
      s.hide(s.ref.key); s.hide(s.ref.key2);
      s.move(s.ref.taxi, 110, 110, 1400);
      s.text(160, 285, 'm = 7', { size: 28, weight: 700, colour: s.C.orange, delay: 300 });
      s.text(400, 285, 'C = 3 + 2 × 7 = 3 + 14', { size: 26, delay: 900 });
      answer(s, 320, 328, 120, '£17', { delay: 1800, size: 28, h: 46 });
    },
    'perimeter': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Rectangle: P = 2(l + w)', { size: 28, weight: 700, colour: s.C.fun });
      s.add(card(0, 0, 176, 110, '#F2FCF8', '#C6EEDC', { stroke: '#22A06B', sw: 4, rx: 2 }), { x: 50, y: 110, enter: 'pop', delay: 300 });
      s.text(138, 90, 'l = 8 cm', { size: 22, weight: 700, colour: s.C.ink, delay: 700 });
      s.text(240, 165, 'w = 5 cm', { size: 22, weight: 700, colour: s.C.ink, anchor: 'start', delay: 900 });
      s.text(138, 260, '(drawn to scale)', { size: 18, colour: s.C.muted, delay: 900 });
      s.text(470, 120, 'bracket first:', { size: 22, colour: s.C.muted, delay: 1400 });
      s.text(470, 160, '8 + 5 = 13', { size: 28, weight: 700, delay: 1600 });
      s.text(470, 215, 'P = 2 × 13', { size: 28, weight: 700, delay: 2200 });
      answer(s, 470, 285, 170, '26 cm', { delay: 2800, size: 32 });
    }
  }));
})();
