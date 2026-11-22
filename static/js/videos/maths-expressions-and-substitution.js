/* Pictures for the Expressions and substitution theory video (words: videos/maths/expressions-and-substitution.json).
   Stage is 640 x 360; see static/js/theory.js. The 8 cm by 5 cm rectangle is drawn to scale (1 cm = 22 units). */
(function () {
  if (!window.Theory) return;

  var BLUE = '#2F80ED', PINK = '#E0437A', GREEN = '#22A06B';
  function col(c, t) { return '<tspan fill="' + c + '">' + t + '</tspan>'; }
  var BAG = '<path d="M-46 -40 L-30 -64 H30 L46 -40 Z" fill="#FF5D8F" stroke="#B42318" stroke-width="3"/>' +
            '<rect x="-56" y="-42" width="112" height="100" rx="20" fill="#FF8FB1" stroke="#B42318" stroke-width="3"/>' +
            '<text y="10" font-family="Fredoka, sans-serif" font-size="54" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">n</text>';
  function sweet(c) {
    return '<path d="M-26 0 L-38 -10 V10 Z M26 0 L38 -10 V10 Z" fill="' + c + '"/><circle r="17" fill="' + c + '" stroke="#1E1B3A" stroke-width="2"/>' +
      '<path d="M-8 -8 Q0 -14 8 -8" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/>';
  }
  var APPLE = '<circle r="26" fill="#E5484D" stroke="#B42318" stroke-width="3"/><path d="M0 -24 q3 -12 12 -14" stroke="#22A06B" stroke-width="5" fill="none" stroke-linecap="round"/>' +
              '<text y="3" font-family="Fredoka, sans-serif" font-size="28" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">a</text>';
  function pill(w, fill, stroke) {
    return '<rect x="' + (-w / 2) + '" y="-30" width="' + w + '" height="60" rx="18" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3"/>';
  }
  function answer(s, x, y, w, t, o) {   // green answer box
    o = o || {};
    s.add(pill(w, '#DDF7EE', GREEN), { x: x, y: y, enter: 'pop', delay: o.delay || 0, name: o.name });
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
      s.add(BAG, { x: 320, y: 190, enter: 'pop', delay: 300, name: 'bag' });
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
        s.add(APPLE, { x: 110 + i * 120, y: 150, enter: 'pop', delay: i * 350 });
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
        s.add('<rect x="0" y="-22" width="200" height="44" rx="10" fill="#D6E6FF" stroke="#2F80ED" stroke-width="3"/>' +
              '<text x="100" y="2" font-family="Fredoka, sans-serif" font-size="26" font-weight="700" fill="#2F80ED" text-anchor="middle" dominant-baseline="middle">x</text>' +
              '<rect x="206" y="-22" width="90" height="44" rx="10" fill="#FFF4D6" stroke="#C2570C" stroke-width="3"/>' +
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
      s.add('<rect x="0" y="0" width="260" height="150" fill="#D6E6FF" stroke="#2F80ED" stroke-width="3"/>' +
            '<text x="130" y="78" font-family="Fredoka, sans-serif" font-size="34" font-weight="700" fill="#2F80ED" text-anchor="middle" dominant-baseline="middle">3x</text>', { x: 120, y: 110, enter: 'pop', delay: 300 });
      s.add('<rect x="0" y="0" width="110" height="150" fill="#FFF4D6" stroke="#C2570C" stroke-width="3"/>' +
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
      s.add('<path d="M8 40 Q10 20 34 18 L52 2 Q60 -2 84 2 L104 18 Q126 20 128 40 V52 H8 Z" fill="#FFC93C" stroke="#1E1B3A" stroke-width="3"/>' +
            '<rect x="50" y="-14" width="36" height="14" rx="3" fill="#1E1B3A"/>' +
            '<path d="M44 18 L56 7 H76 V18 Z M82 18 V7 H90 L100 18 Z" fill="#CFE8FF"/>' +
            '<circle cx="36" cy="54" r="13" fill="#1E1B3A"/><circle cx="36" cy="54" r="5" fill="#C9CED8"/>' +
            '<circle cx="104" cy="54" r="13" fill="#1E1B3A"/><circle cx="104" cy="54" r="5" fill="#C9CED8"/>', { x: 40, y: 110, enter: 'left', name: 'taxi' });
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
      answer(s, 320, 330, 120, '£17', { delay: 1800, size: 28 });
    },
    'perimeter': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Rectangle: P = 2(l + w)', { size: 28, weight: 700, colour: s.C.fun });
      s.add('<rect x="0" y="0" width="176" height="110" fill="#DDF7EE" stroke="#22A06B" stroke-width="4"/>', { x: 50, y: 110, enter: 'pop', delay: 300 });
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
