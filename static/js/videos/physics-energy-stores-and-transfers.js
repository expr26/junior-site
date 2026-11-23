/* Pictures for the Energy stores and transfers theory video (words: videos/physics/energy-stores-and-transfers.json).
   Stage is 640 x 360; see static/js/theory.js. In the Sankey diagram 1 J = 1 unit of band width. */
(function () {
  if (!window.Theory) return;

  var F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function T(x, y, str, size, col, o) {   // a text element inside a drawing
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '" font-weight="' + (o.w || 600) + '" fill="' + col +
      '" text-anchor="' + (o.a || 'middle') + '" dominant-baseline="middle">' + str + '</text>';
  }
  // things drawn for one step only: put them in s.ref.cur so the next step can hide them
  function keep(s, g) { (s.ref.cur = s.ref.cur || []).push(g); return g; }
  function gone(s) { (s.ref.cur || []).forEach(function (g) { s.hide(g); }); s.ref.cur = []; }
  function fresh(s) { s.clear(); s.ref = {}; }

  /* gradients: every id starts with "est" (ids are shared, so each drawing that needs one defines it again, always the same) */
  function stops(st) { return st.map(function (p) { return '<stop offset="' + p[0] + '" stop-color="' + p[1] + '"' + (p[2] != null ? ' stop-opacity="' + p[2] + '"' : '') + '/>'; }).join(''); }
  function lin(id, st, dir) {
    var c = dir === 'h' ? 'x1="0" y1="0" x2="1" y2="0"' : dir === 'd' ? 'x1="0" y1="0" x2="1" y2="1"' : 'x1="0" y1="0" x2="0" y2="1"';
    return '<linearGradient id="' + id + '" ' + c + '>' + stops(st) + '</linearGradient>';
  }
  function rad(id, st, cx, cy, r) { return '<radialGradient id="' + id + '" cx="' + (cx || .38) + '" cy="' + (cy || .32) + '" r="' + (r || .75) + '">' + stops(st) + '</radialGradient>'; }
  function defs() { return '<defs>' + [].join.call(arguments, '') + '</defs>'; }
  var LINE = 'rgba(30,27,58,.5)', SOFT = 'rgba(30,27,58,.35)';
  var G = {
    metal: lin('estMetal', [[0, '#7A7F96'], [.38, '#E6E9F2'], [.7, '#A9AEC0'], [1, '#6B7086']], 'h'),
    woodV: lin('estWoodV', [[0, '#E0A86A'], [1, '#B8773A']]),
    woodH: lin('estWoodH', [[0, '#9A6532'], [.4, '#D99A5B'], [1, '#A86E38']], 'h'),
    ball: rad('estBall', [[0, '#9CC5FA'], [.5, '#2F80ED'], [1, '#1B5FC0']]),
    glow: rad('estGlow', [[0, '#FFE9A8', 1], [.6, '#FFE9A8', .75], [1, '#FFE9A8', 0]], .5, .5, .5),
    glass: rad('estGlass', [[0, '#FFFFFF'], [.55, '#FFF4D6'], [1, '#FFD978']], .4, .35, .7),
    shine: lin('estShine', [[0, '#FFFFFF', .4], [.5, '#FFFFFF', 0], [1, '#000000', .12]])
  };

  var BATTERY = defs(lin('estBat', [[0, '#178A55'], [.35, '#4FD48F'], [1, '#147A4B']], 'h'), lin('estBatD', [[0, '#24213A'], [.35, '#4A4668'], [1, '#1E1B30']], 'h'), G.metal) +
    '<rect x="-12" y="-60" width="24" height="14" rx="4" fill="url(#estMetal)" stroke="' + SOFT + '" stroke-width="2"/>' +
    '<rect x="-30" y="-50" width="60" height="100" rx="10" fill="url(#estBat)"/><path d="M-30 10 H30 V40 Q30 50 20 50 H-20 Q-30 50 -30 40 Z" fill="url(#estBatD)"/>' +
    '<rect x="-30" y="-50" width="60" height="100" rx="10" fill="none" stroke="' + LINE + '" stroke-width="2.5"/><rect x="-22" y="-43" width="7" height="48" rx="3.5" fill="#fff" opacity=".3"/>' +
    '<text x="0" y="-18" ' + F + ' font-size="30" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">+</text>';
  var LEAF = lin('estLeaf', [[0, '#5CD18F'], [1, '#178A55']], 'd');
  var APPLE = defs(rad('estApple', [[0, '#FF9A9C'], [.45, '#E5484D'], [1, '#A3201A']], .35, .3, .8), LEAF) +
    '<path d="M0 -30 C-40 -50 -55 0 -35 30 C-22 50 -8 48 0 42 C8 48 22 50 35 30 C55 0 40 -50 0 -30 Z" fill="url(#estApple)" stroke="#A3201A" stroke-width="2"/>' +
    '<path d="M0 -30 q2 -16 10 -22" stroke="#8A5A2B" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 -42 q16 -14 28 -4 q-14 12 -28 4 Z" fill="url(#estLeaf)"/>' +
    '<path d="M-26 -12 q4 -12 16 -14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".55"/>';
  var CAN = defs(lin('estCan', [[0, '#FFB27A'], [.45, '#FF8A3D'], [1, '#D9661E']], 'h'), lin('estCap', [[0, '#55526E'], [1, '#2A2740']])) +
    '<rect x="-10" y="-56" width="18" height="18" rx="4" fill="url(#estCap)"/>' +
    '<path d="M-34 -36 Q-34 -40 -30 -40 H18 L34 -24 V44 Q34 50 28 50 H-28 Q-34 50 -34 44 Z" fill="url(#estCan)" stroke="#B5541A" stroke-width="2.5" stroke-linejoin="round"/>' +
    '<path d="M-22 -26 H-2 V-16 H-22 Z" fill="none" stroke="#B5541A" stroke-width="4" stroke-linejoin="round"/>' +
    '<path d="M-26 -4 H26 M-26 8 H26" stroke="#E0702A" stroke-width="3" stroke-linecap="round"/><rect x="-28" y="-34" width="6" height="76" rx="3" fill="#fff" opacity=".25"/>' +
    '<rect x="-22" y="20" width="44" height="22" rx="6" fill="#FFF4D6"/><text x="0" y="31.5" ' + F + ' font-size="14" font-weight="700" fill="#2D1B69" text-anchor="middle" dominant-baseline="middle">FUEL</text>';
  function car(col) {   // the same car as in the Forces video
    var id = 'estCar' + col.replace('#', '');
    return defs(lin(id, [[0, '#fff', .45], [.45, '#fff', 0], [1, '#000', .18]])) +
      '<path d="M6 42 Q8 22 32 19 L50 4 Q58 -1 86 2 L106 19 Q128 22 130 42 V50 Q130 54 126 54 H10 Q6 54 6 50 Z" fill="' + col + '"/>' +
      '<path d="M6 42 Q8 22 32 19 L50 4 Q58 -1 86 2 L106 19 Q128 22 130 42 V50 Q130 54 126 54 H10 Q6 54 6 50 Z" fill="url(#' + id + ')" stroke="rgba(30,27,58,.55)" stroke-width="2"/>' +
      '<path d="M44 19 L56 8 H76 V19 Z M82 19 V8 H90 L101 19 Z" fill="#D8EEFF" stroke="' + SOFT + '" stroke-width="1.5"/>' +
      '<rect x="118" y="30" width="10" height="6" rx="3" fill="#FFE08A"/><rect x="8" y="30" width="8" height="6" rx="3" fill="#FF8A8A"/>' +
      '<circle cx="36" cy="54" r="13" fill="#2A2740"/><circle cx="36" cy="54" r="6" fill="#D5D9E3"/><circle cx="104" cy="54" r="13" fill="#2A2740"/><circle cx="104" cy="54" r="6" fill="#D5D9E3"/>';
  }
  var BALL = defs(G.ball) + '<circle r="20" fill="url(#estBall)" stroke="' + SOFT + '" stroke-width="2"/><ellipse cx="-7" cy="-8" rx="6" ry="4" fill="#fff" opacity=".6" transform="rotate(-30 -7 -8)"/>';
  var BASE = '<path d="M-11 12 H11 L13 18 H-13 Z" fill="#C9CED8"/><rect x="-13" y="18" width="26" height="22" rx="4" fill="url(#estMetal)" stroke="' + SOFT + '" stroke-width="1.5"/>' +
    '<path d="M-13 25 H13 M-13 32 H13" stroke="rgba(30,27,58,.25)" stroke-width="2"/><path d="M-6 40 H6 Q6 46 0 46 Q-6 46 -6 40 Z" fill="#4A4668"/>';
  function bulb(glow) {
    return defs(G.glow, G.glass, G.metal) + (glow ? '<circle r="52" fill="url(#estGlow)"/>' : '') +
      '<path d="M-10 14 Q-11 8 -17 1 A24 24 0 1 1 17 1 Q11 8 10 14 Z" fill="url(#estGlass)" stroke="#D9962E" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M-5 14 L-9 -2 M5 14 L9 -2" stroke="#B5B9C8" stroke-width="1.5"/><path d="M-9 -2 l5 -10 l4 10 l4 -10 l5 10" stroke="#FF8A3D" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="M-17 -18 q4 -12 15 -14" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>' + BASE;
  }
  var LED = defs(lin('estLed', [[0, '#F4FFFB'], [1, '#A7EBD9']]), G.metal) +
    '<path d="M-22 -4 a22 22 0 0 1 44 0 V12 Q22 16 18 16 H-18 Q-22 16 -22 12 Z" fill="url(#estLed)" stroke="#0F9488" stroke-width="2.5"/>' +
    '<rect x="-8" y="-6" width="16" height="8" rx="2" fill="#FFC93C" stroke="#C2570C" stroke-width="1.5"/><path d="M-14 -12 q2 -8 10 -10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<rect x="-13" y="16" width="26" height="22" rx="4" fill="url(#estMetal)" stroke="' + SOFT + '" stroke-width="1.5"/><path d="M-13 23 H13 M-13 30 H13" stroke="rgba(30,27,58,.25)" stroke-width="2"/><path d="M-6 38 H6 Q6 44 0 44 Q-6 44 -6 38 Z" fill="#4A4668"/>';
  function heat(n, col) {   // wavy heat lines, rising
    var p = '';
    for (var i = 0; i < n; i++) p += '<path d="M' + (i * 18 - (n - 1) * 9) + ' 0 q-7 -8 0 -16 q7 -8 0 -16" stroke="' + (col || '#E5484D') + '" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>';
    return p;
  }
  function badge(label, col) {
    return defs(G.shine) + '<rect x="-58" y="-20" width="116" height="40" rx="20" fill="' + col + '"/><rect x="-58" y="-20" width="116" height="40" rx="20" fill="url(#estShine)" stroke="rgba(30,27,58,.18)" stroke-width="1.5"/>' +
      T(0, 1, label, label.length > 10 ? 15 : 18, '#FFFFFF', { w: 700 });
  }
  var BADGE_X = [72, 196, 320, 444, 568];
  function addBadge(s, k, label, col) { s.add(badge(label, col), { x: BADGE_X[k], y: 326, enter: 'pop', delay: 900 }); }

  /* a glass jar that shows how full a store is: jar + a fill group that we scale + the glass shine on top */
  function jar(s, x, y, label, col, name) {
    s.add('<rect x="-4" y="-4" width="98" height="158" rx="14" fill="#FFFFFF" stroke="' + LINE + '" stroke-width="3"/>' +
      '<path d="M78 30 H90 M78 66 H90 M78 102 H90" stroke="rgba(30,27,58,.18)" stroke-width="2" stroke-linecap="round"/>', { x: x, y: y, enter: 'fade' });
    var f = s.add(defs(lin('estJarFill', [[0, '#FFFFFF', .3], [.35, '#FFFFFF', .08], [1, '#000000', .14]], 'h')) +
      '<rect x="0" y="0" width="90" height="150" rx="10" fill="' + col + '"/><rect x="0" y="0" width="90" height="150" rx="10" fill="url(#estJarFill)"/>', { x: x, y: y, enter: 'none', name: name, flat: true });
    f._inner.style.transformOrigin = '50% 100%';
    s.add('<rect x="8" y="8" width="9" height="134" rx="4.5" fill="#fff" opacity=".45"/>', { x: x, y: y, enter: 'fade', flat: true });
    s.text(x + 45, y + 178, label, { size: 20, weight: 700, colour: col });
    return f;
  }
  function level(s, f, a, b, ms, delay) { s.anim(f, [{ transform: 'scaleY(' + a + ')' }, { transform: 'scaleY(' + b + ')' }], ms || 1, { delay: delay || 0, easing: 'ease-in-out' }); }

  function turbine(col) {   // blades centred on (0,0); invisible circle keeps the spin centred
    var b = defs(lin('estBlade', [[0, '#FFFFFF'], [1, '#D5D9E3']], 'h')) + '<circle r="62" fill="none"/>';
    [0, 120, 240].forEach(function (a) { b += '<path d="M0 0 L-7 -10 Q-2 -62 4 -60 Q8 -40 7 -10 Z" fill="' + (col || 'url(#estBlade)') + '" stroke="#7A7F96" stroke-width="1.5" stroke-linejoin="round" transform="rotate(' + a + ')"/>'; });
    return b + '<circle r="8" fill="#7A7F96"/><circle r="3.5" fill="#D5D9E3"/>';
  }
  var MAST = defs(lin('estMast', [[0, '#C9CED8'], [.4, '#FFFFFF'], [1, '#B5B9C8']], 'h')) + '<path d="M-5 0 L-9 150 H9 L5 0 Z" fill="url(#estMast)" stroke="#9AA0B4" stroke-width="1.5"/>';
  var SUN = defs(rad('estSun', [[0, '#FFF1B8'], [.6, '#FFC93C'], [1, '#FFAA2B']], .45, .4, .7)) + '<g stroke="#FFC93C" stroke-width="5" stroke-linecap="round">' +
    [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<path d="M0 -34 V-44" transform="rotate(' + a + ')"/>'; }).join('') + '</g><circle r="26" fill="url(#estSun)"/>';
  var PANEL = defs(lin('estPanel', [[0, '#5A7BEA'], [1, '#2D1B69']], 'd')) +
    '<path d="M0 0 V24" stroke="#9AA0B4" stroke-width="5" stroke-linecap="round"/><path d="M-14 24 H14" stroke="#7A7F96" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M-50 0 L-30 -40 H50 L30 0 Z" fill="url(#estPanel)" stroke="#1E1B3A" stroke-opacity=".5" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M-40 -20 H40 M-10 0 L10 -40 M15 0 L35 -40 M-35 0 L-15 -40" stroke="#A9BDF8" stroke-width="1.5" opacity=".8"/><path d="M-26 -36 H20" stroke="#fff" stroke-width="2" opacity=".5" stroke-linecap="round"/>';

  Theory.scenes({
    /* ---------- 1. Energy stores ---------- */
    'intro': function (s) {
      keep(s, s.owl(120, 270, 150));
      keep(s, s.text(400, 90, 'Energy', { size: 64, weight: 700, colour: s.C.fun, enter: 'pop', delay: 300 }));
      keep(s, s.text(400, 160, 'is measured in', { size: 26, colour: s.C.muted, delay: 800 }));
      keep(s, s.add(defs(lin('estJ', [[0, '#FFFBEE'], [1, '#FFE9A8']])) + '<rect x="-120" y="-34" width="240" height="68" rx="22" fill="url(#estJ)" stroke="#FFC93C" stroke-width="3.5"/><rect x="-104" y="-27" width="208" height="7" rx="3.5" fill="#fff" opacity=".7"/>' + T(0, 2, 'joules (J)', 34, '#C2570C', { w: 700 }),
        { x: 400, y: 225, enter: 'pop', delay: 1300 }));
      keep(s, s.add(defs(lin('estBolt', [[0, '#FFE27A'], [1, '#FFAA2B']])) + '<path d="M10 -40 L-14 6 H4 L-8 40 L22 -8 H4 Z" fill="url(#estBolt)" stroke="#D9862E" stroke-width="2.5" stroke-linejoin="round"/><path d="M6 -30 L-6 -2" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>', { x: 560, y: 90, enter: 'pop', delay: 600 }));
    },
    'store-chemical': function (s) {
      gone(s);
      keep(s, s.text(320, 40, 'Chemical store', { size: 34, weight: 700, colour: s.C.green }));
      [[BATTERY, 'batteries', 160], [APPLE, 'food', 320], [CAN, 'fuels', 480]].forEach(function (it, k) {
        keep(s, s.add(it[0], { x: it[2], y: 160, enter: 'pop', delay: 300 + k * 350 }));
        keep(s, s.text(it[2], 250, it[1], { size: 22, colour: s.C.ink, delay: 500 + k * 350 }));
      });
      addBadge(s, 0, 'chemical', s.C.green);
    },
    'store-kinetic': function (s) {
      gone(s);
      keep(s, s.text(320, 40, 'Kinetic store', { size: 34, weight: 700, colour: s.C.orange }));
      keep(s, s.add(defs(lin('estRoad', [[0, '#6B7086'], [1, '#4A4E63']])) + '<rect x="0" y="-4" width="640" height="6" fill="#7ACB7E"/><rect x="0" y="0" width="640" height="34" fill="url(#estRoad)"/><rect x="0" y="0" width="640" height="3" fill="#C9CED8"/>' +
        '<path d="M0 18 H640" stroke="#F4F4F8" stroke-width="3" stroke-dasharray="26 20" stroke-linecap="round" opacity=".9"/>', { y: 236, enter: 'fade', flat: true }));
      var c = keep(s, s.add(car('#FF8A3D'), { x: 20, y: 170, enter: 'fade' }));
      var lines = keep(s, s.add('<path d="M0 0 h-40 M6 16 h-56 M0 32 h-40" stroke="#FF8A3D" stroke-width="5" stroke-linecap="round" opacity=".7"/>', { x: 20, y: 184, enter: 'fade', delay: 300 }));
      s.move(c, 420, 170, 2200, { delay: 200, easing: 'ease-in' });
      s.move(lines, 420, 184, 2200, { delay: 200, easing: 'ease-in' });
      keep(s, s.text(180, 110, 'moving = kinetic energy', { size: 22, colour: s.C.ink, delay: 1000 }));
      addBadge(s, 1, 'kinetic', s.C.orange);
    },
    'store-gravity': function (s) {
      gone(s);
      keep(s, s.text(320, 40, 'Gravitational store', { size: 34, weight: 700, colour: s.C.blue }));
      var gr = keep(s, s.ground(286)); s.svg.insertBefore(gr, s.svg.firstChild);   // behind the store badges
      keep(s, s.add(defs(G.woodV, G.woodH) + '<rect x="150" y="96" width="12" height="192" rx="3" fill="url(#estWoodH)"/>' +
        '<rect x="138" y="96" width="120" height="12" rx="5" fill="url(#estWoodV)" stroke="#9A6532" stroke-width="1.5"/><path d="M146 100 H200" stroke="#F4CF9E" stroke-width="2" stroke-linecap="round" opacity=".8"/>' +
        '<rect x="138" y="206" width="120" height="12" rx="5" fill="url(#estWoodV)" stroke="#9A6532" stroke-width="1.5"/><path d="M146 210 H200" stroke="#F4CF9E" stroke-width="2" stroke-linecap="round" opacity=".8"/>', { enter: 'fade' }));
      keep(s, s.add(BALL, { x: 220, y: 74, enter: 'down', delay: 300 }));
      keep(s, s.add(BALL, { x: 220, y: 184, enter: 'down', delay: 600 }));
      // energy bars, in proportion to the height above the floor (190 and 80)
      keep(s, s.text(420, 74, 'energy in the gravitational store', { size: 17, colour: s.C.muted, delay: 800 }));
      [[100, 190, 'higher: more energy', s.C.blue], [210, 80, 'lower: less', s.C.muted]].forEach(function (r, k) {
        var b = keep(s, s.add(defs(lin('estBarB', [[0, '#6FA8F5'], [1, '#2266D0']])) + '<rect x="0" y="-14" width="' + r[1] + '" height="28" rx="9" fill="url(#estBarB)" stroke="rgba(30,27,58,.25)" stroke-width="1.5"/><rect x="6" y="-10" width="' + (r[1] - 12) + '" height="5" rx="2.5" fill="#fff" opacity=".35"/>', { x: 300, y: r[0], enter: 'none' }));
        b._inner.style.transformOrigin = '0% 50%';
        s.anim(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 700, { delay: 900 + k * 300 });
        keep(s, s.text(300, r[0] + 32, r[2], { size: 19, weight: 700, colour: r[3], anchor: 'start', delay: 1300 + k * 300 }));
      });
      addBadge(s, 2, 'gravitational', s.C.blue);
    },
    'store-elastic': function (s) {
      gone(s);
      keep(s, s.text(320, 40, 'Elastic store', { size: 34, weight: 700, colour: s.C.pink }));
      // a rubber band between two pegs, pulled back by a finger
      keep(s, s.add(defs(G.woodH, rad('estPeg', [[0, '#C9CED8'], [1, '#55526E']])) + '<rect x="-86" y="-10" width="16" height="90" rx="6" fill="url(#estWoodH)"/><rect x="70" y="-10" width="16" height="90" rx="6" fill="url(#estWoodH)"/><circle cx="-78" cy="0" r="10" fill="url(#estPeg)"/><circle cx="78" cy="0" r="10" fill="url(#estPeg)"/>', { x: 190, y: 120, enter: 'fade' }));
      var band = keep(s, s.add('<path d="M-78 0 L78 0" stroke="#E8457A" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-74 -1.5 L74 -1.5" stroke="#FFB3CB" stroke-width="2" fill="none" stroke-linecap="round"/>', { x: 190, y: 120, enter: 'fade' }));
      keep(s, s.add(defs(rad('estStone', [[0, '#FFE9A8'], [1, '#E0A12B']])) + '<path d="M-78 0 L0 70 L78 0" stroke="#E8457A" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M-74 -2 L0 66 L74 -2" stroke="#FFB3CB" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="0" cy="76" r="11" fill="url(#estStone)" stroke="#C2570C" stroke-opacity=".6" stroke-width="2"/>', { x: 190, y: 120, enter: 'fade', delay: 700 }));
      s.hide(band, { delay: 700 });
      keep(s, s.arrow(190, 206, 26, 'd', { colour: s.C.red, width: 8, delay: 900 }));
      keep(s, s.text(190, 250, 'stretched', { size: 22, colour: s.C.ink, delay: 900 }));
      // a spring that gets squashed
      var d = 'M0 0';
      for (var i = 0; i < 10; i++) d += ' L' + (i % 2 ? -26 : 26) + ' ' + ((i + 1) * 12);
      d += ' L0 126';
      var sp = keep(s, s.add('<path d="' + d + '" stroke="#7A7F96" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/><path d="' + d + '" stroke="#E6E9F2" stroke-width="1.5" fill="none" stroke-linejoin="round" opacity=".8"/>', { x: 450, y: 98, enter: 'fade', delay: 300 }));
      sp._inner.style.transformOrigin = '50% 100%';
      var top = keep(s, s.add(defs(lin('estPlate', [[0, '#FF9CBB'], [1, '#E8457A']])) + '<rect x="-40" y="-14" width="80" height="14" rx="5" fill="url(#estPlate)" stroke="#C23366" stroke-opacity=".6" stroke-width="1.5"/><rect x="-34" y="-11" width="68" height="3" rx="1.5" fill="#fff" opacity=".5"/>', { x: 450, y: 98, enter: 'fade', delay: 300 }));
      keep(s, s.add(defs(G.woodV) + '<rect x="-50" y="0" width="100" height="12" rx="5" fill="url(#estWoodV)" stroke="#9A6532" stroke-width="1.5"/>', { x: 450, y: 224, enter: 'fade' }));
      s.anim(sp, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.55)' }], 900, { delay: 1200 });
      s.move(top, 450, 155, 900, { delay: 1200 });
      s.move(keep(s, s.arrow(450, 50, 34, 'd', { colour: s.C.red, width: 8, delay: 1200 })), 450, 107, 900, { delay: 1200 });
      keep(s, s.text(450, 250, 'squashed', { size: 22, colour: s.C.ink, delay: 1600 }));
      addBadge(s, 3, 'elastic', s.C.pink);
    },
    'store-thermal': function (s) {
      gone(s);
      keep(s, s.text(320, 40, 'Thermal store', { size: 34, weight: 700, colour: s.C.red }));
      var mug = defs(lin('estMug', [[0, '#FF9CBB'], [.4, '#FF5D8F'], [1, '#D93F72']], 'h'), lin('estTea', [[0, '#A8693A'], [1, '#6E4220']])) +
        '<path d="M40 -24 q28 0 28 22 q0 22 -28 22" stroke="#D93F72" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M40 -24 q28 0 28 22 q0 22 -28 22" stroke="#FF9CBB" stroke-width="3" fill="none" stroke-linecap="round"/>' +
        '<path d="M-40 -40 H40 V30 Q40 50 20 50 H-20 Q-40 50 -40 30 Z" fill="url(#estMug)" stroke="#B8305E" stroke-width="2.5" stroke-linejoin="round"/><ellipse cx="0" cy="-38" rx="36" ry="6" fill="url(#estTea)"/>' +
        '<rect x="-31" y="-26" width="8" height="60" rx="4" fill="#fff" opacity=".3"/>';
      keep(s, s.add(mug, { x: 190, y: 170, enter: 'pop' }));
      var st = keep(s, s.add(heat(3), { x: 190, y: 120, enter: 'up', delay: 400 }));
      s.anim(st, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-8px)', opacity: .5 }, { transform: 'translateY(0)', opacity: 1 }], 1600, { iterations: Infinity, delay: 900 });
      keep(s, s.text(190, 250, 'hot: more energy', { size: 22, colour: s.C.red, delay: 600 }));
      var ice = defs(lin('estIce', [[0, '#F2F9FF'], [1, '#A9D3FA']], 'd')) + '<g transform="rotate(-8)"><rect x="-34" y="-30" width="60" height="60" rx="12" fill="url(#estIce)" stroke="#5E9CEB" stroke-width="2.5"/>' +
        '<path d="M-24 -20 h22" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="M-24 -10 v14" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/><path d="M14 18 l6 -6" stroke="#7FB2F5" stroke-width="2.5" stroke-linecap="round"/></g>' +
        '<path d="M34 -36 v10 M29 -31 h10" stroke="#7FB2F5" stroke-width="2.5" stroke-linecap="round"/>';
      keep(s, s.add(ice, { x: 450, y: 180, enter: 'pop', delay: 700 }));
      keep(s, s.text(450, 250, 'cold: less energy', { size: 22, colour: s.C.blue, delay: 1000 }));
      keep(s, s.text(320, 286, 'Also: magnetic, electrostatic and nuclear stores', { size: 18, colour: s.C.muted, delay: 1800 }));
      addBadge(s, 4, 'thermal', s.C.red);
    },

    /* ---------- 2. Energy transfers ---------- */
    'transfer-intro': function (s) {
      fresh(s);
      s.text(320, 36, 'Energy transfer', { size: 34, weight: 700, colour: s.C.fun });
      var a = jar(s, 110, 80, 'one store', s.C.green, 'ja');
      var b = jar(s, 440, 80, 'another store', s.C.orange, 'jb');
      level(s, a, 1, 1); level(s, b, 0, 0);
      s.arrow(225, 155, 190, 'r', { colour: s.C.fun, label: 'transfer', delay: 500 });
      level(s, a, 1, 0.3, 1600, 900); level(s, b, 0, 0.7, 1600, 900);
    },
    'transfer-fall': function (s) {
      fresh(s);
      s.add(defs(lin('estSoil', [[0, '#F3E6CC'], [1, '#E2CFA8']])) + '<path d="M20 304 H290 V326 Q290 340 276 340 H34 Q20 340 20 326 Z" fill="url(#estSoil)"/><rect x="20" y="300" width="270" height="9" rx="4.5" fill="#7ACB7E"/><rect x="20" y="300" width="270" height="3" rx="1.5" fill="#A6E3A1"/>', { enter: 'fade', flat: true });
      s.add(defs(G.woodV, G.woodH) + '<rect x="40" y="108" width="11" height="196" rx="3" fill="url(#estWoodH)"/><rect x="40" y="96" width="150" height="14" rx="5" fill="url(#estWoodV)" stroke="#9A6532" stroke-width="1.5"/><path d="M48 100 H150" stroke="#F4CF9E" stroke-width="2" stroke-linecap="round" opacity=".8"/>', { enter: 'fade' });
      var ball = s.add(BALL, { x: 160, y: 74, enter: 'pop' });
      s.move(ball, 220, 284, 1500, { delay: 700, easing: 'cubic-bezier(.5,0,1,1)' });
      var g = jar(s, 320, 80, 'gravitational', s.C.blue, 'jg');
      var k = jar(s, 480, 80, 'kinetic', s.C.orange, 'jk');
      level(s, g, 0.9, 0.9); level(s, k, 0, 0);
      level(s, g, 0.9, 0.04, 1500, 700); level(s, k, 0, 0.86, 1500, 700);
      s.text(320, 30, 'Falling: gravitational to kinetic', { size: 26, weight: 700, colour: s.C.fun });
    },
    'transfer-ways': function (s) {
      fresh(s);
      s.text(320, 36, 'Four ways to transfer energy', { size: 30, weight: 700, colour: s.C.fun });
      var X = [87, 242, 397, 552], cols = ['#6C4DF6', '#2F80ED', '#E5484D', '#FF8A3D'];
      var icons = [
        defs(lin('estCrate', [[0, '#F2C08A'], [1, '#D99A5B']])) + '<rect x="-6" y="-26" width="52" height="52" rx="7" fill="url(#estCrate)" stroke="#9A6532" stroke-width="2"/><path d="M-3 -8 H43" stroke="#B57A40" stroke-width="2"/><rect x="-3" y="-23" width="46" height="4" rx="2" fill="#fff" opacity=".3"/>' +
          '<path d="M-50 0 H-20" stroke="#6C4DF6" stroke-width="10" stroke-linecap="round"/><path d="M-22 -16 L-6 0 L-22 16 Z" fill="#6C4DF6" stroke="#6C4DF6" stroke-width="3" stroke-linejoin="round"/>',
        defs(lin('estPlug', [[0, '#6B6788'], [1, '#2F2C48']]), G.metal) + '<path d="M-26 0 H-54" stroke="#55526E" stroke-width="6" stroke-linecap="round"/><path d="M14 -8 h16 M14 8 h16" stroke="url(#estMetal)" stroke-width="6" stroke-linecap="round"/>' +
          '<rect x="-26" y="-18" width="40" height="36" rx="9" fill="url(#estPlug)"/><rect x="-21" y="-14" width="30" height="5" rx="2.5" fill="#fff" opacity=".25"/>' +
          '<path d="M-2 -32 L-12 -2 H0 L-6 24 L10 -8 H-2 Z" fill="#FFC93C" stroke="#D9862E" stroke-width="2" stroke-linejoin="round"/>',
        defs(lin('estHeater', [[0, '#C9CED8'], [1, '#8A8FA8']]), lin('estFlame', [[0, '#FFC93C'], [1, '#FF6A2B']])) + '<rect x="-40" y="-22" width="80" height="26" rx="8" fill="url(#estHeater)" stroke="' + SOFT + '" stroke-width="2"/><path d="M-30 -9 H30" stroke="#E5484D" stroke-width="4" stroke-linecap="round" opacity=".8"/>' +
          '<path d="M-20 30 q-10 -14 0 -24 q2 10 10 6 q-2 -14 10 -20 q14 18 0 38 Z" fill="url(#estFlame)" stroke="#E5484D" stroke-width="1.5" stroke-linejoin="round"/>' + '<g transform="translate(0 -30)">' + heat(3) + '</g>',
        bulb(true) + '<g transform="translate(44 -30)"><path d="M0 0 V-26 L14 -30 V-6" stroke="#2D1B69" stroke-width="3" fill="none" stroke-linejoin="round"/><circle cx="-4" cy="0" r="5" fill="#2D1B69"/><circle cx="10" cy="-4" r="5" fill="#2D1B69"/></g>'
      ];
      var labels = [['by a force', '(mechanically)'], ['electrically', ''], ['by heating', ''], ['by light', 'and sound']];
      X.forEach(function (x, k) {
        s.add('<rect x="-70" y="-80" width="140" height="210" rx="18" fill="#FFFFFF" stroke="' + cols[k] + '" stroke-width="3.5"/><circle cx="0" cy="-20" r="50" fill="' + cols[k] + '" opacity=".08"/>', { x: x, y: 160, enter: 'pop', delay: k * 450 });
        s.add(icons[k], { x: x, y: 140, enter: 'pop', delay: k * 450 + 150 });
        s.text(x, 230, labels[k][0], { size: 20, weight: 700, colour: cols[k], delay: k * 450 + 250 });
        if (labels[k][1]) s.text(x, 256, labels[k][1], { size: 16, colour: s.C.muted, delay: k * 450 + 300 });
      });
    },
    'transfer-torch': function (s) {
      fresh(s);
      s.text(320, 36, 'A torch', { size: 32, weight: 700, colour: s.C.fun });
      s.add(BATTERY, { x: 90, y: 170, enter: 'pop' });
      s.text(90, 258, 'chemical store', { size: 18, weight: 700, colour: s.C.green, delay: 200 });
      s.add('<path d="M126 170 H262" stroke="#55526E" stroke-width="6" stroke-linecap="round"/><path d="M128 168.5 H260" stroke="#9AA0B4" stroke-width="1.5" stroke-linecap="round"/>', { enter: 'fade', delay: 400 });
      s.arrow(140, 145, 100, 'r', { colour: s.C.blue, width: 8, label: 'electrically', size: 17, delay: 500 });
      s.add(bulb(true), { x: 300, y: 172, enter: 'pop', delay: 900 });
      s.add('<g stroke="#FFC93C" stroke-width="5" stroke-linecap="round" opacity=".9"><path d="M350 140 L382 121"/><path d="M356 164 L392 161"/><path d="M342 112 L360 88"/></g>', { enter: 'fade', delay: 1300 });
      s.arrow(400, 120, 80, 'r', { colour: s.C.sun, width: 8, delay: 1500 });
      s.text(500, 120, 'light', { size: 22, weight: 700, colour: '#C2570C', anchor: 'start', delay: 1700 });
      s.add(heat(3), { x: 300, y: 260, enter: 'up', delay: 2000 });
      s.arrow(340, 240, 100, 'r', { colour: s.C.red, width: 8, delay: 2100 });
      s.text(450, 230, 'heating the', { size: 20, weight: 700, colour: s.C.red, anchor: 'start', delay: 2300 });
      s.text(450, 254, 'surroundings', { size: 20, weight: 700, colour: s.C.red, anchor: 'start', delay: 2300 });
    },

    /* ---------- 3. Energy is never used up ---------- */
    'rule': function (s) {
      fresh(s);
      s.owl(110, 300, 150);
      s.add(defs(lin('estCard', [[0, '#FFFFFF'], [1, '#F4F0FF']])) + '<rect x="-200" y="-90" width="400" height="180" rx="26" fill="url(#estCard)" stroke="#6C4DF6" stroke-width="3.5"/>', { x: 410, y: 170, enter: 'pop', delay: 200 });
      s.text(410, 120, 'Energy cannot be', { size: 28, colour: s.C.ink, delay: 500 });
      s.text(410, 165, 'created or destroyed', { size: 32, weight: 700, colour: s.C.fun, delay: 900 });
      s.text(410, 215, 'only transferred', { size: 26, weight: 700, colour: s.C.green, enter: 'pop', delay: 1500 });
    },
    'bulb': function (s) {
      fresh(s);
      s.text(320, 34, 'Filament bulb', { size: 30, weight: 700, colour: s.C.fun });
      s.add(bulb(true), { x: 62, y: 178, enter: 'pop' });
      s.add(defs(lin('estIn', [[0, '#5B9BF2'], [1, '#2266D0']])) + '<path d="M112 130 H300 V230 H112 Z" fill="url(#estIn)"/><path d="M112 133 H300" stroke="#fff" stroke-width="3" opacity=".3"/>', { enter: 'right', delay: 300 });
      s.add(T(206, 170, '100 J in', 24, '#FFFFFF', { w: 700 }), { delay: 600 });
      s.add(T(206, 198, 'electrically', 16, '#FFFFFF'), { delay: 600 });
      s.add(defs(lin('estUse', [[0, '#FFDB6E'], [1, '#F5B21E']])) + '<path d="M300 130 H500 V120 L538 140 L500 160 V150 H300 Z" fill="url(#estUse)" stroke="#F5B21E" stroke-width="1" stroke-linejoin="round"/><path d="M300 133 H496" stroke="#fff" stroke-width="2.5" opacity=".45"/>', { enter: 'right', delay: 1000, name: 'useful' });
      s.text(440, 104, 'light 20 J', { size: 22, weight: 700, colour: '#C2570C', delay: 1300 });
      s.add(defs(lin('estWaste', [[0, '#FFA867'], [1, '#F2701F']], 'h')) + '<path d="M300 150 Q400 150 400 250 V292 H416 L360 344 L304 292 H320 V250 Q320 230 300 230 Z" fill="url(#estWaste)" stroke="#F2701F" stroke-width="1" stroke-linejoin="round"/>', { enter: 'down', delay: 1700, name: 'waste' });
      s.text(424, 300, 'heating the room 80 J', { size: 20, weight: 700, colour: s.C.red, anchor: 'start', delay: 2000 });
    },
    'bulb-total': function (s) {
      s.add('<rect x="-104" y="-28" width="208" height="56" rx="16" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' + T(0, 1, '20 J + 80 J = 100 J', 21, '#0E7A5A', { w: 700 }),
        { x: 524, y: 212, enter: 'pop', name: 'total' });
    },
    'bulb-wasted': function (s) {
      s.text(440, 76, 'useful', { size: 22, weight: 700, colour: s.C.green, enter: 'pop' });
      s.text(424, 330, 'wasted', { size: 22, weight: 700, colour: s.C.red, anchor: 'start', enter: 'pop', delay: 600 });
      var h = s.add('<g transform="scale(.7)">' + heat(4, '#FF8A3D') + '</g>', { x: 560, y: 344, enter: 'up', delay: 900 });
      s.anim(h, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-10px)', opacity: .3 }], 1400, { iterations: Infinity, delay: 1400 });
    },
    'oil': function (s) {
      fresh(s);
      s.text(320, 34, 'Waste less energy', { size: 30, weight: 700, colour: s.C.fun });
      function gear(r, n) {
        var teeth = '';
        for (var a = 0; a < 360; a += 360 / n) teeth += '<rect x="-6" y="' + (-r - 14) + '" width="12" height="17" rx="3" fill="#7A7F96" transform="rotate(' + a + ')"/>';
        return defs(rad('estGear', [[0, '#E6E9F2'], [.7, '#A9AEC0'], [1, '#7A7F96']], .4, .35, .8)) + teeth + '<circle r="' + r + '" fill="url(#estGear)" stroke="#6B7086" stroke-width="4"/>' +
          '<circle r="' + (r * .62) + '" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/><circle r="' + (r / 3) + '" fill="#6B7086"/><circle r="7" fill="#E6E8F0"/>';
      }
      var g1 = s.add(gear(60, 12), { x: 190, y: 200, enter: 'pop' });
      var g2 = s.add(gear(30, 8), { x: 400, y: 200, enter: 'pop' });
      s.anim(g1, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 6000, { iterations: Infinity, easing: 'linear' });
      s.anim(g2, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 3000, { iterations: Infinity, easing: 'linear' });
      s.add('<path d="M190 128 L400 162 M190 272 L400 238" stroke="#4A4668" stroke-width="8" stroke-dasharray="12 5" stroke-linecap="round"/><path d="M190 128 L400 162 M190 272 L400 238" stroke="#9AA0B4" stroke-width="2" stroke-dasharray="6 11"/>', { enter: 'fade' });
      s.add(defs(lin('estOilCan', [[0, '#FF7D80'], [1, '#C8323A']]), G.metal) + '<g transform="rotate(30)"><path d="M-30 -10 q-24 6 -18 30" stroke="#55526E" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M30 -10 L80 -30 L80 -22 L30 6 Z" fill="url(#estMetal)" stroke="' + SOFT + '" stroke-width="1.5" stroke-linejoin="round"/>' +
          '<rect x="-30" y="-20" width="60" height="50" rx="8" fill="url(#estOilCan)" stroke="#A3201A" stroke-width="2"/><rect x="-24" y="-15" width="7" height="40" rx="3.5" fill="#fff" opacity=".3"/><rect x="-12" y="-2" width="30" height="16" rx="4" fill="#FFF4D6"/>' +
          '<text x="3" y="6.5" ' + F + ' font-size="11" font-weight="700" fill="#A3201A" text-anchor="middle" dominant-baseline="middle">OIL</text></g>',
        { x: 300, y: 78, enter: 'down', delay: 400 });
      [0, 1, 2].forEach(function (k) {
        var d = s.add('<path d="M0 -8 Q6 2 0 8 Q-6 2 0 -8 Z" fill="#E0A12B" stroke="#B5791A" stroke-width="1"/>', { x: 362, y: 104, enter: 'fade', delay: 900 + k * 500 });
        s.move(d, 362, 150, 400, { delay: 900 + k * 500, easing: 'ease-in' });
      });
      s.text(470, 300, 'oil = less friction', { size: 22, weight: 700, colour: s.C.sci, delay: 1500 });
      s.text(470, 332, 'less wasted heating', { size: 20, colour: s.C.muted, delay: 1900 });
    },

    /* ---------- 4. Efficiency ---------- */
    'eff-formula': function (s) {
      fresh(s);
      s.owl(80, 330, 110);
      s.text(320, 50, 'Efficiency', { size: 40, weight: 700, colour: s.C.fun, enter: 'pop' });
      s.text(250, 170, 'efficiency =', { size: 28, weight: 700, colour: s.C.ink, anchor: 'end', delay: 500 });
      s.text(410, 136, 'useful energy out', { size: 26, weight: 700, colour: s.C.green, delay: 900 });
      s.add('<path d="M270 170 H550" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/>', { enter: 'fade', delay: 900 });
      s.text(410, 204, 'total energy in', { size: 26, weight: 700, colour: s.C.blue, delay: 1300 });
      s.text(380, 280, '× 100 to get a percentage', { size: 22, colour: s.C.muted, delay: 2000 });
    },
    'eff-bulb': function (s) {
      fresh(s);
      s.text(320, 34, 'How efficient?', { size: 30, weight: 700, colour: s.C.fun });
      s.add(bulb(true), { x: 64, y: 120, enter: 'pop' });
      s.text(130, 92, 'Filament bulb:  20 J ÷ 100 J = 0.2 = 20%', { size: 21, weight: 700, colour: s.C.ink, anchor: 'start', delay: 300 });
      s.add('<rect x="0" y="0" width="400" height="34" rx="11" fill="#FFE3D1" stroke="' + SOFT + '" stroke-width="2"/>', { x: 130, y: 114, enter: 'fade', delay: 600 });
      var f = s.add(defs(lin('estBarY', [[0, '#FFDB6E'], [1, '#F5B21E']])) + '<rect x="0" y="0" width="80" height="34" rx="11" fill="url(#estBarY)" stroke="#D9962E" stroke-width="1.5"/><rect x="6" y="4" width="68" height="6" rx="3" fill="#fff" opacity=".45"/>', { x: 130, y: 114, enter: 'none', flat: true });
      f._inner.style.transformOrigin = '0% 50%';
      s.anim(f, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 900, { delay: 900 });
      s.text(170, 131, '20%', { size: 18, weight: 700, colour: s.C.ink, delay: 1600 });
      s.text(330, 131, 'wasted 80%', { size: 18, weight: 700, colour: s.C.red, delay: 1800 });
    },
    'eff-motor': function (s) {
      var m = defs(lin('estMotor', [[0, '#6FA8F5'], [1, '#1F5FC4']]), G.metal) + '<rect x="24" y="-6" width="22" height="12" rx="3" fill="url(#estMetal)" stroke="' + SOFT + '" stroke-width="1.5"/>' +
        '<rect x="-34" y="-26" width="60" height="52" rx="11" fill="url(#estMotor)" stroke="#1B4FA3" stroke-width="2"/><path d="M-22 -12 H14 M-22 0 H14 M-22 12 H14" stroke="#CFE8FF" stroke-width="3" stroke-linecap="round" opacity=".75"/>' +
        '<path d="M-30 26 L-36 34 H28 L22 26" fill="#55526E"/>';
      s.add(m, { x: 62, y: 250, enter: 'pop' });
      s.text(130, 220, 'Motor:  80 J ÷ 100 J = 0.8 = 80%', { size: 21, weight: 700, colour: s.C.ink, anchor: 'start', delay: 300 });
      s.add('<rect x="0" y="0" width="400" height="34" rx="11" fill="#FFE3D1" stroke="' + SOFT + '" stroke-width="2"/>', { x: 130, y: 242, enter: 'fade', delay: 600 });
      var f = s.add(defs(lin('estBarG', [[0, '#3CC47F'], [1, '#178A55']])) + '<rect x="0" y="0" width="320" height="34" rx="11" fill="url(#estBarG)" stroke="#147A4B" stroke-width="1.5"/><rect x="6" y="4" width="308" height="6" rx="3" fill="#fff" opacity=".35"/>', { x: 130, y: 242, enter: 'none', flat: true });
      f._inner.style.transformOrigin = '0% 50%';
      s.anim(f, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 1200, { delay: 900 });
      s.add(T(290, 259, '80% useful', 18, '#FFFFFF', { w: 700 }), { delay: 2000 });
      s.text(490, 259, '20%', { size: 16, weight: 700, colour: s.C.red, delay: 2200 });
      s.text(588, 259, 'more', { size: 20, weight: 700, colour: s.C.green, delay: 2400 });
      s.text(588, 283, 'efficient', { size: 20, weight: 700, colour: s.C.green, delay: 2400 });
    },
    'eff-led': function (s) {
      fresh(s);
      s.text(320, 34, 'Filament or LED?', { size: 30, weight: 700, colour: s.C.fun });
      s.add(bulb(true), { x: 180, y: 170, enter: 'pop' });
      var h1 = s.add(heat(5), { x: 180, y: 110, enter: 'up', delay: 400 });
      s.anim(h1, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-10px)', opacity: .4 }], 1200, { iterations: Infinity, delay: 900 });
      s.text(180, 240, 'filament', { size: 24, weight: 700, colour: s.C.orange, delay: 400 });
      s.text(180, 272, 'lots of wasted heating', { size: 19, colour: s.C.red, delay: 700 });
      s.add(defs(rad('estLedGlow', [[0, '#DDF7EE', 1], [.65, '#DDF7EE', .8], [1, '#DDF7EE', 0]], .5, .5, .5)) + '<circle r="52" fill="url(#estLedGlow)"/>' + LED, { x: 460, y: 170, enter: 'pop', delay: 1000 });
      s.add(heat(1, '#FF8A3D'), { x: 460, y: 112, enter: 'up', delay: 1400 });
      s.text(460, 240, 'LED', { size: 24, weight: 700, colour: s.C.sci, delay: 1000 });
      s.text(460, 272, 'much less wasted', { size: 19, colour: s.C.green, delay: 1300 });
      s.text(460, 300, 'more efficient', { size: 22, weight: 700, colour: s.C.green, enter: 'pop', delay: 1800 });
    },
    'eff-max': function (s) {
      fresh(s);
      s.owl(110, 320, 140);
      s.add(defs(lin('estCardR', [[0, '#FFFFFF'], [1, '#FFF1F1']])) + '<rect x="-190" y="-80" width="380" height="160" rx="26" fill="url(#estCardR)" stroke="#E5484D" stroke-width="3.5"/>', { x: 410, y: 160, enter: 'pop' });
      s.text(410, 110, 'Never more than', { size: 26, colour: s.C.ink, delay: 300 });
      s.text(410, 164, '100%', { size: 56, weight: 700, colour: s.C.red, enter: 'pop', delay: 700 });
      s.text(410, 214, 'you can\'t get out more than you put in', { size: 19, colour: s.C.muted, delay: 1300 });
      s.text(410, 300, 'Energy is never created!', { size: 24, weight: 700, colour: s.C.fun, delay: 1800 });
    },

    /* ---------- 5. Energy resources ---------- */
    'res-intro': function (s) {
      fresh(s);
      s.text(320, 34, 'We need energy resources for…', { size: 28, weight: 700, colour: s.C.fun });
      var pylon = '<path d="M-20 80 L0 -60 L20 80 M-12 20 H12 M-16 40 L16 0 M16 40 L-16 0 M-8 -10 L8 -10" stroke="#6B7086" stroke-width="5" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
        '<path d="M-34 -30 H34 M-24 -6 H24" stroke="#6B7086" stroke-width="5" stroke-linecap="round"/><path d="M-30 -30 v12 M30 -30 v12 M-20 -6 v10 M20 -6 v10" stroke="#9AA0B4" stroke-width="3" stroke-linecap="round"/>' +
        '<circle cx="-30" cy="-16" r="3.5" fill="#FFC93C"/><circle cx="30" cy="-16" r="3.5" fill="#FFC93C"/><path d="M-26 80 H26" stroke="#9AA0B4" stroke-width="4" stroke-linecap="round"/>';
      var house = defs(lin('estRoof', [[0, '#FF7D80'], [1, '#C8323A']]), lin('estWall', [[0, '#FFFBEE'], [1, '#F5E3BC']]), G.woodV) +
        '<rect x="-40" y="-6" width="80" height="66" rx="3" fill="url(#estWall)" stroke="' + SOFT + '" stroke-width="2"/><rect x="22" y="-40" width="12" height="26" rx="2" fill="#B8773A"/>' +
        '<path d="M-54 2 L0 -46 L54 2 Z" fill="url(#estRoof)" stroke="#A3201A" stroke-width="2" stroke-linejoin="round"/><path d="M-40 -6 L0 -40" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".35"/>' +
        '<rect x="-12" y="24" width="24" height="36" rx="4" fill="url(#estWoodV)" stroke="#9A6532" stroke-width="1.5"/><circle cx="6" cy="43" r="2" fill="#FFC93C"/>' +
        '<rect x="16" y="12" width="18" height="18" rx="3" fill="#FFE08A" stroke="' + SOFT + '" stroke-width="1.5"/><path d="M25 12 V30 M16 21 H34" stroke="#fff" stroke-width="2"/>' +
        '<rect x="-34" y="12" width="18" height="18" rx="3" fill="#CFE8FF" stroke="' + SOFT + '" stroke-width="1.5"/><path d="M-25 12 V30 M-34 21 H-16" stroke="#fff" stroke-width="2"/>';
      var plane = defs(lin('estPlane', [[0, '#FFFFFF'], [1, '#D5DCEA']]), lin('estWing', [[0, '#6FA8F5'], [1, '#1F5FC4']])) +
        '<path d="M-10 -10 L10 -44 H24 L14 -10 Z M-54 -8 L-62 -34 H-50 L-38 -12 Z" fill="url(#estWing)" stroke="#1B4FA3" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M-60 0 Q-60 -12 -40 -12 H50 Q66 -12 66 0 Q66 10 50 10 H-40 Q-60 10 -60 0 Z" fill="url(#estPlane)" stroke="' + LINE + '" stroke-width="2"/>' +
        '<path d="M46 -8 Q58 -8 60 -2 H46 Z" fill="#9CC5FA"/>' + [-32, -20, -8, 4, 16, 28].map(function (x) { return '<circle cx="' + x + '" cy="-3" r="2.6" fill="#9CC5FA"/>'; }).join('') +
        '<path d="M-10 8 L10 40 H24 L14 8 Z" fill="url(#estWing)" stroke="#1B4FA3" stroke-width="1.5" stroke-linejoin="round"/>';
      [[pylon, 'electricity', 110, 170], [house, 'heating', 320, 160], [plane, 'transport', 525, 170]].forEach(function (it, k) {
        s.add(it[0], { x: it[2], y: it[3], enter: 'pop', delay: 300 + k * 500 });
        s.text(it[2], 286, it[1], { size: 24, weight: 700, colour: [s.C.blue, s.C.red, s.C.sci][k], delay: 500 + k * 500 });
      });
    },
    'res-fossil': function (s) {
      fresh(s);
      s.text(320, 34, 'Fossil fuels', { size: 32, weight: 700, colour: s.C.ink });
      var coal = defs(rad('estCoal', [[0, '#6B6B78'], [.6, '#34323F'], [1, '#1E1D26']], .35, .3, .8)) +
        '<path d="M-36 10 L-24 -26 L6 -34 L34 -14 L38 18 L10 34 L-26 30 Z" fill="url(#estCoal)" stroke="#1E1D26" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M-24 -26 L-4 -4 L6 -34 M-4 -4 L34 -14 M-4 -4 L-26 30 M-4 -4 L10 34" stroke="#8A8A98" stroke-width="1.2" opacity=".45" fill="none"/><path d="M-14 -20 l12 6" stroke="#A9A9B5" stroke-width="4" stroke-linecap="round" opacity=".8"/>';
      var oil = defs(lin('estBarrel', [[0, '#1E1B3A'], [.35, '#4A4668'], [1, '#14122A']], 'h')) +
        '<rect x="-30" y="-40" width="60" height="80" rx="9" fill="url(#estBarrel)"/><path d="M-30 -14 H30 M-30 14 H30" stroke="#6B6788" stroke-width="4"/><ellipse cx="0" cy="-39" rx="27" ry="3" fill="#6B6788" opacity=".7"/>' +
        '<rect x="-23" y="-34" width="5" height="68" rx="2.5" fill="#fff" opacity=".15"/><path d="M0 -24 Q12 -8 0 4 Q-12 -8 0 -24 Z" fill="#FFC93C"/>';
      var gas = defs(lin('estGas', [[0, '#7FB2F5'], [1, '#1F5FC4']])) + '<path d="M0 -40 Q30 -10 22 14 Q14 36 0 36 Q-14 36 -22 14 Q-30 -10 0 -40 Z" fill="url(#estGas)" stroke="#1B4FA3" stroke-width="1.5"/>' +
        '<path d="M0 -6 Q14 8 8 22 Q0 32 -8 22 Q-14 8 0 -6 Z" fill="#E4F1FF"/><path d="M-12 -12 q-6 10 -4 20" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".55"/>';
      [[coal, 'coal', 130], [oil, 'oil', 320], [gas, 'natural gas', 510]].forEach(function (it, k) {
        s.add(it[0], { x: it[2], y: 120, enter: 'pop', delay: 200 + k * 400 });
        s.text(it[2], 188, it[1], { size: 22, weight: 700, colour: s.C.ink, delay: 400 + k * 400 });
      });
      s.text(240, 250, 'took millions of years to form', { size: 20, colour: s.C.muted, delay: 1500 });
      s.text(240, 300, 'non-renewable: will run out', { size: 24, weight: 700, colour: s.C.red, delay: 2000 });
      // fuel gauge going down to E
      s.add('<path d="M-50 0 A50 50 0 0 1 50 0 Z" fill="#FFFFFF" stroke="#55526E" stroke-width="4" stroke-linejoin="round"/><path d="M-40 0 A40 40 0 0 1 -28 -28" stroke="#E5484D" stroke-width="6" fill="none"/><path d="M28 -28 A40 40 0 0 1 40 0" stroke="#22A06B" stroke-width="6" fill="none"/>' +
        T(-40, 14, 'E', 16, '#E5484D', { w: 700 }) + T(40, 14, 'F', 16, '#22A06B', { w: 700 }),
        { x: 530, y: 290, enter: 'pop', delay: 1500 });
      var n = s.add('<path d="M0 0 L0 -42" stroke="#E5484D" stroke-width="5" stroke-linecap="round"/><circle r="6" fill="#2D1B69"/>', { x: 530, y: 290, enter: 'fade', delay: 1500 });
      n._inner.style.transformBox = 'view-box'; n._inner.style.transformOrigin = '0 0';
      s.anim(n, [{ transform: 'rotate(60deg)' }, { transform: 'rotate(-70deg)' }], 1800, { delay: 1700 });
    },
    'res-co2': function (s) {
      fresh(s);
      s.text(320, 34, 'Burning fossil fuels', { size: 30, weight: 700, colour: s.C.ink });
      s.add(defs(lin('estPlant', [[0, '#C9CED8'], [1, '#8A8FA8']]), lin('estChim', [[0, '#8A8FA8'], [.4, '#C9CED8'], [1, '#7A7F96']], 'h')) +
        '<path d="M-20 -60 V-140 Q-20 -144 -16 -144 H6 Q10 -144 10 -140 V-60 Z" fill="url(#estChim)" stroke="' + SOFT + '" stroke-width="2"/><path d="M-20 -128 H10 M-20 -116 H10" stroke="#E5484D" stroke-width="6" opacity=".85"/>' +
        '<path d="M-60 0 V-56 Q-60 -60 -56 -60 H56 Q60 -60 60 -56 V0 Z" fill="url(#estPlant)" stroke="' + SOFT + '" stroke-width="2"/><rect x="-54" y="-56" width="108" height="5" rx="2.5" fill="#fff" opacity=".4"/>' +
        '<rect x="-40" y="-40" width="20" height="20" rx="3" fill="#FFD966" stroke="#D9962E" stroke-width="1.5"/><rect x="20" y="-40" width="20" height="20" rx="3" fill="#FFD966" stroke="#D9962E" stroke-width="1.5"/><rect x="-8" y="-26" width="16" height="26" rx="3" fill="#6B7086"/>',
        { x: 140, y: 320, enter: 'up' });
      [0, 1, 2, 3].forEach(function (k) {
        var b = s.add(defs(rad('estSmoke', [[0, '#F2F3F7'], [1, '#B5B9C8']])) + '<circle r="22" fill="url(#estSmoke)" stroke="#9AA0B4" stroke-width="1.5"/>' + T(0, 1, 'CO₂', 14, '#1E1B3A', { w: 700 }), { x: 135, y: 170, enter: 'fade', delay: 400 + k * 450 });
        s.move(b, 160 + k * 52, 120 - (k % 2) * 30, 1600, { delay: 400 + k * 450, easing: 'ease-out' });
      });
      s.add(defs(rad('estSea', [[0, '#7FB2F5'], [.6, '#2F80ED'], [1, '#1B4FA3']], .38, .32, .8), rad('estAtmos', [[.8, '#9CC5FA', 0], [.92, '#9CC5FA', .5], [1, '#9CC5FA', 0]], .5, .5, .5)) +
        '<circle r="82" fill="url(#estAtmos)"/><circle r="70" fill="url(#estSea)"/>' +
        '<path d="M-56 -26 Q-40 -46 -14 -38 Q4 -30 -6 -14 Q-20 -2 -40 -6 Q-58 -10 -56 -26 Z M10 14 Q30 4 50 14 Q60 30 44 44 Q24 52 14 38 Q4 26 10 14 Z M24 -52 Q40 -54 46 -40 Q34 -34 24 -52 Z" fill="#3CC47F" stroke="#178A55" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M-40 -46 Q-20 -62 4 -60" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>', { x: 460, y: 190, enter: 'pop', delay: 1200 });
      s.add(defs(rad('estBulbT', [[0, '#FF9A9C'], [1, '#C8323A']], .38, .32, .8)) + '<rect x="-10" y="-71" width="20" height="112" rx="10" fill="#FFFFFF" stroke="' + LINE + '" stroke-width="2.5"/><circle cy="48" r="17" fill="url(#estBulbT)" stroke="#A3201A" stroke-width="2"/>' +
        '<path d="M10 -50 h6 M10 -30 h6 M10 -10 h6 M10 10 h6" stroke="rgba(30,27,58,.35)" stroke-width="2" stroke-linecap="round"/><ellipse cx="-6" cy="42" rx="4" ry="3" fill="#fff" opacity=".55"/>', { x: 580, y: 170, enter: 'pop', delay: 1500 });
      var m = s.add('<rect x="-4" y="-50" width="8" height="90" rx="4" fill="#E5484D"/>', { x: 580, y: 170, enter: 'none' });
      m._inner.style.transformOrigin = '50% 100%';
      s.anim(m, [{ transform: 'scaleY(.35)' }, { transform: 'scaleY(1)' }], 1400, { delay: 1700 });
      s.text(460, 300, 'global warming', { size: 26, weight: 700, colour: s.C.red, delay: 2000 });
    },
    'res-renewable': function (s) {
      fresh(s);
      s.text(320, 30, 'Renewable: will not run out', { size: 28, weight: 700, colour: s.C.green });
      var wave = defs(lin('estSea2', [[0, '#7FB2F5'], [1, '#2F80ED']])) + '<path d="M-50 10 q12 -24 25 0 t25 0 t25 0 t25 0 V44 H-50 Z" fill="url(#estSea2)" opacity=".35"/>' +
        '<path d="M-50 10 q12 -24 25 0 t25 0 t25 0 t25 0" stroke="#2F80ED" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-50 30 q12 -24 25 0 t25 0 t25 0 t25 0" stroke="#7FB2F5" stroke-width="7" fill="none" stroke-linecap="round"/>';
      var dam = defs(lin('estDam', [[0, '#C9CED8'], [1, '#8A8FA8']], 'h'), lin('estLake', [[0, '#7FB2F5'], [1, '#2F80ED']])) +
        '<path d="M-56 -20 H-36 L-30 40 H-56 Z" fill="url(#estLake)"/><path d="M-36 -30 H-20 L-6 40 H-40 Z" fill="url(#estDam)" stroke="' + SOFT + '" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M-6 30 q20 -2 30 10 q14 0 26 -8" stroke="#2F80ED" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-4 28 q18 -2 26 6" stroke="#CFE8FF" stroke-width="2" fill="none" stroke-linecap="round"/>';
      var tide = defs(rad('estMoon', [[0, '#F2F3F7'], [1, '#A9AEC0']])) + '<path d="M-50 22 H50 V36 Q50 40 46 40 H-46 Q-50 40 -50 36 Z" fill="#E2CFA8"/><path d="M-50 14 H50" stroke="#2F80ED" stroke-width="10" stroke-linecap="round"/><path d="M-46 12 H46" stroke="#9CC5FA" stroke-width="2.5" stroke-linecap="round"/>' +
        '<circle cx="30" cy="-24" r="16" fill="url(#estMoon)"/><circle cx="26" cy="-28" r="3" fill="#9AA0B4" opacity=".6"/><path d="M-40 -2 V-30 M-40 -30 l-8 10 M-40 -30 l8 10" stroke="#2F80ED" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';
      var geo = defs(lin('estRock', [[0, '#B8773A'], [1, '#7A4A22']]), rad('estMagma', [[0, '#FFE08A'], [.5, '#FF8A3D'], [1, '#E5484D']], .5, .9, .9)) +
        '<path d="M-56 40 L-28 -12 Q-24 -16 -20 -16 H20 Q24 -16 28 -12 L56 40 Z" fill="url(#estRock)" stroke="#6E4220" stroke-width="1.5" stroke-linejoin="round"/><path d="M-30 40 Q0 10 30 40 Z" fill="url(#estMagma)"/><g transform="translate(0 -20)">' + heat(3, '#9AA0B4') + '</g>';
      var items = [
        ['wind', 120, 110, null], ['solar', 320, 110, SUN + '<g transform="translate(14 44)">' + PANEL + '</g>'], ['hydroelectric', 520, 110, dam],
        ['tides', 120, 240, tide], ['waves', 320, 240, wave], ['geothermal', 520, 240, geo]
      ];
      items.forEach(function (it, k) {
        var dl = k * 300;
        if (!it[3]) {
          s.add('<g transform="scale(.4)">' + MAST + '</g>', { x: it[1], y: it[2] - 34, enter: 'pop', delay: dl });
          var bl = s.add('<g transform="scale(.6)">' + turbine() + '</g>', { x: it[1], y: it[2] - 34, enter: 'pop', delay: dl });
          bl._inner.style.transformOrigin = '50% 50%';
          s.anim(bl, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 2200, { iterations: Infinity, easing: 'linear', delay: dl + 500 });
        } else s.add('<g transform="scale(.8)">' + it[3] + '</g>', { x: it[1], y: it[2] - 18, enter: 'pop', delay: dl });
        s.text(it[1], it[2] + 50, it[0], { size: 20, weight: 700, colour: s.C.sci, delay: dl + 150 });
      });
    },
    'res-weather': function (s) {
      fresh(s);
      s.text(320, 30, 'Does it need the weather?', { size: 28, weight: 700, colour: s.C.fun });
      // still turbine
      s.add(MAST, { x: 110, y: 120, enter: 'up' });
      s.add(turbine(), { x: 110, y: 120, enter: 'pop' });
      s.text(110, 296, 'no wind, no spin', { size: 19, weight: 700, colour: s.C.red, delay: 600 });
      // solar panel at night
      s.add(defs(lin('estNight', [[0, '#1E1550'], [1, '#3B2A8F']])) + '<rect x="-90" y="-80" width="180" height="170" rx="18" fill="url(#estNight)"/><path d="M-90 60 Q-40 44 0 56 T90 50 V72 Q90 90 72 90 H-72 Q-90 90 -90 72 Z" fill="#2A1F6B"/><circle cx="40" cy="-40" r="20" fill="#FFF4D6"/><circle cx="50" cy="-46" r="18" fill="#251B5E"/>' +
        '<circle cx="-50" cy="-50" r="2.5" fill="#fff"/><circle cx="-20" cy="-30" r="2" fill="#fff"/><circle cx="-60" cy="-10" r="2" fill="#fff"/><g transform="translate(0 40)">' + PANEL + '</g>',
        { x: 320, y: 170, enter: 'fade', delay: 800 });
      s.text(320, 296, 'night: no sunlight', { size: 19, weight: 700, colour: s.C.red, delay: 1300 });
      // geothermal
      s.add(defs(lin('estRock2', [[0, '#B8773A'], [1, '#6E4220']]), rad('estMagma', [[0, '#FFE08A'], [.5, '#FF8A3D'], [1, '#E5484D']], .5, .9, .9), lin('estHut', [[0, '#FFFFFF'], [1, '#D5DCEA']]), lin('estRoof', [[0, '#FF7D80'], [1, '#C8323A']])) +
        '<path d="M-80 90 V24 Q-80 20 -76 20 H76 Q80 20 80 24 V90 Z" fill="url(#estRock2)"/><rect x="-80" y="16" width="160" height="8" rx="4" fill="#7ACB7E"/><rect x="-80" y="16" width="160" height="3" rx="1.5" fill="#A6E3A1"/><path d="M-60 90 Q0 30 60 90 Z" fill="url(#estMagma)"/>' +
        '<path d="M-30 18 V-30 H30 V18 Z" fill="url(#estHut)" stroke="' + SOFT + '" stroke-width="2"/><rect x="-8" y="-6" width="16" height="24" rx="3" fill="#6B7086"/><path d="M-30 -28 L0 -54 L30 -28 Z" fill="url(#estRoof)" stroke="#A3201A" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<g transform="translate(0 -60)">' + heat(3, '#9AA0B4') + '</g>', { x: 530, y: 170, enter: 'fade', delay: 1600 });
      s.text(530, 296, 'works in any weather', { size: 19, weight: 700, colour: s.C.green, delay: 2100 });
      s.add(defs(lin('estTick', [[0, '#3CC47F'], [1, '#178A55']])) + '<circle r="20" fill="url(#estTick)" stroke="#147A4B" stroke-width="1.5"/><path d="M-9 0 l6 7 l12 -14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>', { x: 600, y: 90, enter: 'pop', delay: 2300 });
    }
  });
})();
