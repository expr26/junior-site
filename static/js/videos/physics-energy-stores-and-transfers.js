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

  var BATTERY = '<rect x="-30" y="-50" width="60" height="100" rx="8" fill="#22A06B" stroke="#1E1B3A" stroke-width="3"/><rect x="-12" y="-60" width="24" height="12" rx="3" fill="#1E1B3A"/>' +
    '<rect x="-30" y="10" width="60" height="40" rx="0" fill="#1E1B3A" opacity=".85"/><text x="0" y="-18" ' + F + ' font-size="30" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">+</text>';
  var APPLE = '<path d="M0 -30 C-40 -50 -55 0 -35 30 C-22 50 -8 48 0 42 C8 48 22 50 35 30 C55 0 40 -50 0 -30 Z" fill="#E5484D" stroke="#B42318" stroke-width="3"/>' +
    '<path d="M0 -30 q2 -16 10 -22" stroke="#8A5A2B" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 -42 q16 -14 28 -4 q-14 12 -28 4 Z" fill="#22A06B"/><path d="M-24 -14 q4 -10 14 -12" stroke="#FFB4B6" stroke-width="5" fill="none" stroke-linecap="round"/>';
  var CAN = '<path d="M-34 -40 H18 L34 -24 V50 H-34 Z" fill="#FF8A3D" stroke="#1E1B3A" stroke-width="3"/><rect x="-10" y="-56" width="18" height="16" rx="3" fill="#1E1B3A"/>' +
    '<path d="M-20 -10 H20 M-20 10 H20" stroke="#C2570C" stroke-width="4" stroke-linecap="round"/><text x="0" y="32" ' + F + ' font-size="15" font-weight="700" fill="#1E1B3A" text-anchor="middle">FUEL</text>';
  function car(col) {
    return '<path d="M8 40 Q10 20 34 18 L52 2 Q60 -2 84 2 L104 18 Q126 20 128 40 V52 H8 Z" fill="' + col + '" stroke="#1E1B3A" stroke-width="3"/>' +
      '<path d="M44 18 L56 7 H76 V18 Z M82 18 V7 H90 L100 18 Z" fill="#CFE8FF"/>' +
      '<circle cx="36" cy="54" r="13" fill="#1E1B3A"/><circle cx="36" cy="54" r="5" fill="#C9CED8"/>' +
      '<circle cx="104" cy="54" r="13" fill="#1E1B3A"/><circle cx="104" cy="54" r="5" fill="#C9CED8"/>';
  }
  var BALL = '<circle r="20" fill="#2F80ED" stroke="#1E1B3A" stroke-width="3"/><path d="M-10 -10 q6 -6 14 -6" stroke="#CFE8FF" stroke-width="5" fill="none" stroke-linecap="round"/>';
  function bulb(glow) {
    return (glow ? '<circle r="46" fill="#FFE9A8" opacity=".8"/>' : '') +
      '<circle cy="-8" r="28" fill="#FFF4D6" stroke="#C2570C" stroke-width="3"/><path d="M-9 -2 l5 -10 l4 10 l4 -10 l5 10" stroke="#FF8A3D" stroke-width="3" fill="none"/>' +
      '<rect x="-13" y="18" width="26" height="22" rx="3" fill="#9AA0B4" stroke="#55526E" stroke-width="2"/><path d="M-13 25 H13 M-13 32 H13" stroke="#55526E" stroke-width="2"/>';
  }
  var LED = '<path d="M-22 -4 a22 22 0 0 1 44 0 V16 H-22 Z" fill="#DDF7EE" stroke="#0F9488" stroke-width="3"/><path d="M-12 -2 h24" stroke="#0F9488" stroke-width="3"/>' +
    '<rect x="-13" y="16" width="26" height="22" rx="3" fill="#9AA0B4" stroke="#55526E" stroke-width="2"/><path d="M-13 23 H13 M-13 30 H13" stroke="#55526E" stroke-width="2"/>';
  function heat(n, col) {   // wavy heat lines, rising
    var p = '';
    for (var i = 0; i < n; i++) p += '<path d="M' + (i * 18 - (n - 1) * 9) + ' 0 q-7 -8 0 -16 q7 -8 0 -16" stroke="' + (col || '#E5484D') + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    return p;
  }
  function badge(label, col) {
    return '<rect x="-58" y="-20" width="116" height="40" rx="20" fill="' + col + '"/>' + T(0, 1, label, label.length > 10 ? 15 : 18, '#FFFFFF', { w: 700 });
  }
  var BADGE_X = [72, 196, 320, 444, 568];
  function addBadge(s, k, label, col) { s.add(badge(label, col), { x: BADGE_X[k], y: 326, enter: 'pop', delay: 900 }); }

  /* a jar that shows how full a store is: outline + a fill group that we scale */
  function jar(s, x, y, label, col, name) {
    s.add('<rect x="-4" y="-4" width="98" height="158" rx="14" fill="#FFFFFF" stroke="#1E1B3A" stroke-width="4"/>', { x: x, y: y, enter: 'fade' });
    var f = s.add('<rect x="0" y="0" width="90" height="150" rx="10" fill="' + col + '"/>', { x: x, y: y, enter: 'none', name: name });
    f._inner.style.transformOrigin = '50% 100%';
    s.text(x + 45, y + 178, label, { size: 20, weight: 700, colour: col });
    return f;
  }
  function level(s, f, a, b, ms, delay) { s.anim(f, [{ transform: 'scaleY(' + a + ')' }, { transform: 'scaleY(' + b + ')' }], ms || 1, { delay: delay || 0, easing: 'ease-in-out' }); }

  function turbine(col) {   // blades centred on (0,0); invisible circle keeps the spin centred
    var b = '<circle r="62" fill="none"/>';
    [0, 120, 240].forEach(function (a) { b += '<path d="M0 0 L-7 -10 Q0 -62 4 -60 L7 -10 Z" fill="' + (col || '#FFFFFF') + '" stroke="#55526E" stroke-width="2" transform="rotate(' + a + ')"/>'; });
    return b + '<circle r="7" fill="#55526E"/>';
  }
  var MAST = '<path d="M-5 0 L-9 150 H9 L5 0 Z" fill="#E6E8F0" stroke="#55526E" stroke-width="2"/>';
  var SUN = '<circle r="26" fill="#FFC93C"/><g stroke="#FFC93C" stroke-width="5" stroke-linecap="round">' +
    [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<path d="M0 -34 V-44" transform="rotate(' + a + ')"/>'; }).join('') + '</g>';
  var PANEL = '<path d="M-50 0 L-30 -40 H50 L30 0 Z" fill="#2D1B69" stroke="#1E1B3A" stroke-width="2"/><path d="M-40 -20 H40 M-10 0 L10 -40 M15 0 L35 -40 M-35 0 L-15 -40" stroke="#6C8BF5" stroke-width="2"/><path d="M0 0 V24 M-14 24 H14" stroke="#55526E" stroke-width="4"/>';

  Theory.scenes({
    /* ---------- 1. Energy stores ---------- */
    'intro': function (s) {
      keep(s, s.owl(120, 270, 150));
      keep(s, s.text(400, 90, 'Energy', { size: 64, weight: 700, colour: s.C.fun, enter: 'pop', delay: 300 }));
      keep(s, s.text(400, 160, 'is measured in', { size: 26, colour: s.C.muted, delay: 800 }));
      keep(s, s.add('<rect x="-120" y="-34" width="240" height="68" rx="20" fill="#FFF4D6" stroke="#FFC93C" stroke-width="4"/>' + T(0, 2, 'joules (J)', 34, '#C2570C', { w: 700 }),
        { x: 400, y: 225, enter: 'pop', delay: 1300 }));
      keep(s, s.add('<path d="M10 -40 L-14 6 H4 L-8 40 L22 -8 H4 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="3" stroke-linejoin="round"/>', { x: 560, y: 90, enter: 'pop', delay: 600 }));
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
      keep(s, s.add('<rect x="0" y="0" width="640" height="34" fill="#5A5F73"/><path d="M0 17 H640" stroke="#fff" stroke-width="3" stroke-dasharray="26 20"/>', { y: 236, enter: 'fade' }));
      var c = keep(s, s.add(car('#FF8A3D'), { x: 20, y: 170, enter: 'fade' }));
      var lines = keep(s, s.add('<path d="M0 0 h-40 M6 16 h-56 M0 32 h-40" stroke="#FF8A3D" stroke-width="5" stroke-linecap="round"/>', { x: 20, y: 184, enter: 'fade', delay: 300 }));
      s.move(c, 420, 170, 2200, { delay: 200, easing: 'ease-in' });
      s.move(lines, 420, 184, 2200, { delay: 200, easing: 'ease-in' });
      keep(s, s.text(180, 110, 'moving = kinetic energy', { size: 22, colour: s.C.ink, delay: 1000 }));
      addBadge(s, 1, 'kinetic', s.C.orange);
    },
    'store-gravity': function (s) {
      gone(s);
      keep(s, s.text(320, 40, 'Gravitational store', { size: 34, weight: 700, colour: s.C.blue }));
      keep(s, s.add('<path d="M0 286 H640" stroke="#C9B48E" stroke-width="5"/>' +
        '<rect x="150" y="96" width="12" height="190" fill="#8A5A2B"/><rect x="138" y="96" width="120" height="12" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="2"/>' +
        '<rect x="138" y="206" width="120" height="12" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="2"/>', { enter: 'fade' }));
      keep(s, s.add(BALL, { x: 220, y: 74, enter: 'down', delay: 300 }));
      keep(s, s.add(BALL, { x: 220, y: 184, enter: 'down', delay: 600 }));
      // energy bars, in proportion to the height above the floor (190 and 80)
      keep(s, s.text(420, 74, 'energy in the gravitational store', { size: 17, colour: s.C.muted, delay: 800 }));
      [[100, 190, 'higher: more energy', s.C.blue], [210, 80, 'lower: less', s.C.muted]].forEach(function (r, k) {
        var b = keep(s, s.add('<rect x="0" y="-14" width="' + r[1] + '" height="28" rx="8" fill="#2F80ED"/>', { x: 300, y: r[0], enter: 'none' }));
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
      keep(s, s.add('<rect x="-86" y="-10" width="16" height="90" rx="6" fill="#8A5A2B"/><rect x="70" y="-10" width="16" height="90" rx="6" fill="#8A5A2B"/><circle cx="-78" cy="0" r="10" fill="#55526E"/><circle cx="78" cy="0" r="10" fill="#55526E"/>', { x: 190, y: 120, enter: 'fade' }));
      var band = keep(s, s.add('<path d="M-78 0 L78 0" stroke="#FF5D8F" stroke-width="7" fill="none" stroke-linecap="round"/>', { x: 190, y: 120, enter: 'fade' }));
      keep(s, s.add('<path d="M-78 0 L0 70 L78 0" stroke="#FF5D8F" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><circle cx="0" cy="76" r="11" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/>', { x: 190, y: 120, enter: 'fade', delay: 700 }));
      s.hide(band, { delay: 700 });
      keep(s, s.arrow(190, 206, 26, 'd', { colour: s.C.red, width: 8, delay: 900 }));
      keep(s, s.text(190, 250, 'stretched', { size: 22, colour: s.C.ink, delay: 900 }));
      // a spring that gets squashed
      var d = 'M0 0';
      for (var i = 0; i < 10; i++) d += ' L' + (i % 2 ? -26 : 26) + ' ' + ((i + 1) * 12);
      d += ' L0 126';
      var sp = keep(s, s.add('<path d="' + d + '" stroke="#55526E" stroke-width="5" fill="none" stroke-linejoin="round"/>', { x: 450, y: 98, enter: 'fade', delay: 300 }));
      sp._inner.style.transformOrigin = '50% 100%';
      var top = keep(s, s.add('<rect x="-40" y="-14" width="80" height="14" rx="4" fill="#FF5D8F"/>', { x: 450, y: 98, enter: 'fade', delay: 300 }));
      keep(s, s.add('<rect x="-50" y="0" width="100" height="10" rx="3" fill="#8A5A2B"/>', { x: 450, y: 224, enter: 'fade' }));
      s.anim(sp, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.55)' }], 900, { delay: 1200 });
      s.move(top, 450, 155, 900, { delay: 1200 });
      keep(s, s.arrow(450, 60, 34, 'd', { colour: s.C.red, width: 8, delay: 1200 }));
      keep(s, s.text(450, 250, 'squashed', { size: 22, colour: s.C.ink, delay: 1600 }));
      addBadge(s, 3, 'elastic', s.C.pink);
    },
    'store-thermal': function (s) {
      gone(s);
      keep(s, s.text(320, 40, 'Thermal store', { size: 34, weight: 700, colour: s.C.red }));
      var mug = '<path d="M-40 -40 H40 V30 Q40 50 20 50 H-20 Q-40 50 -40 30 Z" fill="#FF5D8F" stroke="#1E1B3A" stroke-width="3"/><path d="M40 -24 q28 0 28 22 q0 22 -28 22" stroke="#1E1B3A" stroke-width="6" fill="none"/><ellipse cx="0" cy="-38" rx="36" ry="6" fill="#8A5A2B"/>';
      keep(s, s.add(mug, { x: 190, y: 170, enter: 'pop' }));
      var st = keep(s, s.add(heat(3), { x: 190, y: 120, enter: 'up', delay: 400 }));
      s.anim(st, [{ transform: 'translateY(0)', opacity: 1 }, { transform: 'translateY(-8px)', opacity: .5 }, { transform: 'translateY(0)', opacity: 1 }], 1600, { iterations: Infinity, delay: 900 });
      keep(s, s.text(190, 250, 'hot: more energy', { size: 22, colour: s.C.red, delay: 600 }));
      var ice = '<rect x="-34" y="-30" width="60" height="60" rx="10" fill="#CFE8FF" stroke="#2F80ED" stroke-width="3" transform="rotate(-8)"/><path d="M-20 -14 l14 -6" stroke="#fff" stroke-width="5" stroke-linecap="round"/>';
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
      s.add('<path d="M20 306 H280" stroke="#C9B48E" stroke-width="5"/><rect x="40" y="96" width="150" height="14" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="2"/><rect x="40" y="110" width="10" height="196" fill="#8A5A2B"/>', { enter: 'fade' });
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
        '<rect x="-6" y="-26" width="52" height="52" rx="6" fill="#E0A96D" stroke="#8A5A2B" stroke-width="3"/><path d="M-50 0 H-20" stroke="#6C4DF6" stroke-width="10" stroke-linecap="round"/><path d="M-22 -16 L-6 0 L-22 16 Z" fill="#6C4DF6"/>',
        '<rect x="-26" y="-18" width="40" height="36" rx="8" fill="#55526E"/><path d="M14 -8 h16 M14 8 h16" stroke="#55526E" stroke-width="6" stroke-linecap="round"/><path d="M-26 0 H-50" stroke="#55526E" stroke-width="5"/><path d="M-2 -32 L-12 -2 H0 L-6 24 L10 -8 H-2 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="2"/>',
        '<rect x="-40" y="-22" width="80" height="26" rx="6" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/><path d="M-20 30 q-10 -14 0 -24 q2 10 10 6 q-2 -14 10 -20 q14 18 0 38 Z" fill="#FF8A3D" stroke="#E5484D" stroke-width="2"/>' + '<g transform="translate(0 -30)">' + heat(3) + '</g>',
        bulb(true) + '<g transform="translate(44 -30)"><path d="M0 0 V-26 L14 -30 V-6" stroke="#1E1B3A" stroke-width="3" fill="none"/><circle cx="-4" cy="0" r="5" fill="#1E1B3A"/><circle cx="10" cy="-4" r="5" fill="#1E1B3A"/></g>'
      ];
      var labels = [['by a force', '(mechanically)'], ['electrically', ''], ['by heating', ''], ['by light', 'and sound']];
      X.forEach(function (x, k) {
        s.add('<rect x="-70" y="-80" width="140" height="210" rx="18" fill="#FFFFFF" stroke="' + cols[k] + '" stroke-width="4"/>', { x: x, y: 160, enter: 'pop', delay: k * 450 });
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
      s.add('<path d="M130 170 H250" stroke="#55526E" stroke-width="5"/>', { enter: 'fade', delay: 400 });
      s.arrow(140, 145, 100, 'r', { colour: s.C.blue, width: 8, label: 'electrically', size: 17, delay: 500 });
      s.add(bulb(true), { x: 300, y: 172, enter: 'pop', delay: 900 });
      s.add('<g stroke="#FFC93C" stroke-width="5" stroke-linecap="round"><path d="M350 140 L390 116"/><path d="M356 164 L400 160"/><path d="M342 112 L364 84"/></g>', { enter: 'fade', delay: 1300 });
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
      s.add('<rect x="-200" y="-90" width="400" height="180" rx="26" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="4"/>', { x: 410, y: 170, enter: 'pop', delay: 200 });
      s.text(410, 120, 'Energy cannot be', { size: 28, colour: s.C.ink, delay: 500 });
      s.text(410, 165, 'created or destroyed', { size: 32, weight: 700, colour: s.C.fun, delay: 900 });
      s.text(410, 215, 'only transferred', { size: 26, weight: 700, colour: s.C.green, enter: 'pop', delay: 1500 });
    },
    'bulb': function (s) {
      fresh(s);
      s.text(320, 34, 'Filament bulb', { size: 30, weight: 700, colour: s.C.fun });
      s.add(bulb(true), { x: 62, y: 178, enter: 'pop' });
      s.add('<path d="M112 130 H300 V230 H112 Z" fill="#2F80ED"/>', { enter: 'right', delay: 300 });
      s.add(T(206, 170, '100 J in', 24, '#FFFFFF', { w: 700 }), { delay: 600 });
      s.add(T(206, 198, 'electrically', 16, '#FFFFFF'), { delay: 600 });
      s.add('<path d="M300 130 H500 V120 L538 140 L500 160 V150 H300 Z" fill="#FFC93C"/>', { enter: 'right', delay: 1000, name: 'useful' });
      s.text(440, 104, 'light 20 J', { size: 22, weight: 700, colour: '#C2570C', delay: 1300 });
      s.add('<path d="M300 150 Q400 150 400 250 V292 H416 L360 344 L304 292 H320 V250 Q320 230 300 230 Z" fill="#FF8A3D"/>', { enter: 'down', delay: 1700, name: 'waste' });
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
        for (var a = 0; a < 360; a += 360 / n) teeth += '<rect x="-6" y="' + (-r - 14) + '" width="12" height="16" rx="3" fill="#55526E" transform="rotate(' + a + ')"/>';
        return '<circle r="' + r + '" fill="#9AA0B4" stroke="#55526E" stroke-width="6"/>' + teeth + '<circle r="' + (r / 3) + '" fill="#55526E"/><circle r="7" fill="#E6E8F0"/>';
      }
      var g1 = s.add(gear(60, 12), { x: 190, y: 200, enter: 'pop' });
      var g2 = s.add(gear(30, 8), { x: 400, y: 200, enter: 'pop' });
      s.anim(g1, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 6000, { iterations: Infinity, easing: 'linear' });
      s.anim(g2, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 3000, { iterations: Infinity, easing: 'linear' });
      s.add('<path d="M190 128 L400 162 M190 272 L400 238" stroke="#1E1B3A" stroke-width="8" stroke-dasharray="12 6"/>', { enter: 'fade' });
      s.add('<g transform="rotate(30)"><path d="M-30 -20 H30 V30 H-30 Z" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/><path d="M30 -10 L80 -30 L80 -22 L30 6" fill="#9AA0B4" stroke="#1E1B3A" stroke-width="3"/><path d="M-30 -10 q-24 6 -18 30" stroke="#1E1B3A" stroke-width="5" fill="none"/></g>',
        { x: 300, y: 78, enter: 'down', delay: 400 });
      [0, 1, 2].forEach(function (k) {
        var d = s.add('<path d="M0 -8 Q6 2 0 8 Q-6 2 0 -8 Z" fill="#C98A4B"/>', { x: 362, y: 104, enter: 'fade', delay: 900 + k * 500 });
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
      s.add('<rect x="0" y="0" width="400" height="34" rx="10" fill="#FFE3D1" stroke="#1E1B3A" stroke-width="2"/>', { x: 130, y: 114, enter: 'fade', delay: 600 });
      var f = s.add('<rect x="0" y="0" width="80" height="34" rx="10" fill="#FFC93C" stroke="#1E1B3A" stroke-width="2"/>', { x: 130, y: 114, enter: 'none' });
      f._inner.style.transformOrigin = '0% 50%';
      s.anim(f, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 900, { delay: 900 });
      s.text(170, 131, '20%', { size: 18, weight: 700, colour: s.C.ink, delay: 1600 });
      s.text(330, 131, 'wasted 80%', { size: 18, weight: 700, colour: s.C.red, delay: 1800 });
    },
    'eff-motor': function (s) {
      var m = '<rect x="-34" y="-26" width="60" height="52" rx="10" fill="#2F80ED" stroke="#1E1B3A" stroke-width="3"/><rect x="26" y="-6" width="20" height="12" fill="#9AA0B4" stroke="#1E1B3A" stroke-width="2"/><path d="M-20 -10 H12 M-20 4 H12" stroke="#CFE8FF" stroke-width="4"/>';
      s.add(m, { x: 62, y: 250, enter: 'pop' });
      s.text(130, 220, 'Motor:  80 J ÷ 100 J = 0.8 = 80%', { size: 21, weight: 700, colour: s.C.ink, anchor: 'start', delay: 300 });
      s.add('<rect x="0" y="0" width="400" height="34" rx="10" fill="#FFE3D1" stroke="#1E1B3A" stroke-width="2"/>', { x: 130, y: 242, enter: 'fade', delay: 600 });
      var f = s.add('<rect x="0" y="0" width="320" height="34" rx="10" fill="#22A06B" stroke="#1E1B3A" stroke-width="2"/>', { x: 130, y: 242, enter: 'none' });
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
      s.add('<circle r="46" fill="#DDF7EE" opacity=".9"/>' + LED, { x: 460, y: 170, enter: 'pop', delay: 1000 });
      s.add(heat(1, '#FF8A3D'), { x: 460, y: 112, enter: 'up', delay: 1400 });
      s.text(460, 240, 'LED', { size: 24, weight: 700, colour: s.C.sci, delay: 1000 });
      s.text(460, 272, 'much less wasted', { size: 19, colour: s.C.green, delay: 1300 });
      s.text(460, 300, 'more efficient', { size: 22, weight: 700, colour: s.C.green, enter: 'pop', delay: 1800 });
    },
    'eff-max': function (s) {
      fresh(s);
      s.owl(110, 320, 140);
      s.add('<rect x="-190" y="-80" width="380" height="160" rx="26" fill="#FFFFFF" stroke="#E5484D" stroke-width="4"/>', { x: 410, y: 160, enter: 'pop' });
      s.text(410, 110, 'Never more than', { size: 26, colour: s.C.ink, delay: 300 });
      s.text(410, 164, '100%', { size: 56, weight: 700, colour: s.C.red, enter: 'pop', delay: 700 });
      s.text(410, 214, 'you can\'t get out more than you put in', { size: 19, colour: s.C.muted, delay: 1300 });
      s.text(410, 300, 'Energy is never created!', { size: 24, weight: 700, colour: s.C.fun, delay: 1800 });
    },

    /* ---------- 5. Energy resources ---------- */
    'res-intro': function (s) {
      fresh(s);
      s.text(320, 34, 'We need energy resources for…', { size: 28, weight: 700, colour: s.C.fun });
      var pylon = '<path d="M-20 80 L0 -60 L20 80 M-12 20 H12 M-30 -30 H30 M-16 40 L16 0 M16 40 L-16 0" stroke="#55526E" stroke-width="5" fill="none" stroke-linejoin="round"/><path d="M-30 -30 v12 M30 -30 v12" stroke="#55526E" stroke-width="4"/>';
      var house = '<path d="M-50 0 L0 -44 L50 0 Z" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/><rect x="-40" y="0" width="80" height="60" fill="#FFF4D6" stroke="#1E1B3A" stroke-width="3"/><rect x="-12" y="24" width="24" height="36" fill="#8A5A2B"/><rect x="18" y="12" width="16" height="16" fill="#CFE8FF"/>';
      var plane = '<path d="M-60 0 Q-60 -12 -40 -12 H50 Q66 -12 66 0 Q66 10 50 10 H-40 Q-60 10 -60 0 Z" fill="#FFFFFF" stroke="#1E1B3A" stroke-width="3"/><path d="M-10 -10 L10 -44 H24 L14 -10 Z M-10 8 L10 40 H24 L14 8 Z M-54 -8 L-62 -34 H-50 L-38 -12 Z" fill="#2F80ED" stroke="#1E1B3A" stroke-width="2"/>';
      [[pylon, 'electricity', 110, 170], [house, 'heating', 320, 160], [plane, 'transport', 525, 170]].forEach(function (it, k) {
        s.add(it[0], { x: it[2], y: it[3], enter: 'pop', delay: 300 + k * 500 });
        s.text(it[2], 286, it[1], { size: 24, weight: 700, colour: [s.C.blue, s.C.red, s.C.sci][k], delay: 500 + k * 500 });
      });
    },
    'res-fossil': function (s) {
      fresh(s);
      s.text(320, 34, 'Fossil fuels', { size: 32, weight: 700, colour: s.C.ink });
      var coal = '<path d="M-36 10 L-24 -26 L6 -34 L34 -14 L38 18 L10 34 L-26 30 Z" fill="#2B2B33" stroke="#000" stroke-width="2"/><path d="M-10 -20 l12 6" stroke="#6B6B78" stroke-width="4" stroke-linecap="round"/>';
      var oil = '<rect x="-30" y="-40" width="60" height="80" rx="8" fill="#1E1B3A"/><path d="M-30 -14 H30 M-30 14 H30" stroke="#55526E" stroke-width="4"/><path d="M0 -24 Q12 -8 0 4 Q-12 -8 0 -24 Z" fill="#FFC93C"/>';
      var gas = '<path d="M0 -40 Q30 -10 22 14 Q14 36 0 36 Q-14 36 -22 14 Q-30 -10 0 -40 Z" fill="#2F80ED"/><path d="M0 -6 Q14 8 8 22 Q0 32 -8 22 Q-14 8 0 -6 Z" fill="#CFE8FF"/>';
      [[coal, 'coal', 130], [oil, 'oil', 320], [gas, 'natural gas', 510]].forEach(function (it, k) {
        s.add(it[0], { x: it[2], y: 120, enter: 'pop', delay: 200 + k * 400 });
        s.text(it[2], 188, it[1], { size: 22, weight: 700, colour: s.C.ink, delay: 400 + k * 400 });
      });
      s.text(240, 250, 'took millions of years to form', { size: 20, colour: s.C.muted, delay: 1500 });
      s.text(240, 300, 'non-renewable: will run out', { size: 24, weight: 700, colour: s.C.red, delay: 2000 });
      // fuel gauge going down to E
      s.add('<path d="M-50 0 A50 50 0 0 1 50 0" stroke="#1E1B3A" stroke-width="5" fill="#FFFFFF"/>' + T(-40, 14, 'E', 16, '#E5484D', { w: 700 }) + T(40, 14, 'F', 16, '#22A06B', { w: 700 }),
        { x: 530, y: 290, enter: 'pop', delay: 1500 });
      var n = s.add('<path d="M0 0 L0 -42" stroke="#E5484D" stroke-width="5" stroke-linecap="round"/><circle r="6" fill="#1E1B3A"/>', { x: 530, y: 290, enter: 'fade', delay: 1500 });
      n._inner.style.transformBox = 'view-box'; n._inner.style.transformOrigin = '0 0';
      s.anim(n, [{ transform: 'rotate(60deg)' }, { transform: 'rotate(-70deg)' }], 1800, { delay: 1700 });
    },
    'res-co2': function (s) {
      fresh(s);
      s.text(320, 34, 'Burning fossil fuels', { size: 30, weight: 700, colour: s.C.ink });
      s.add('<path d="M-60 0 V-60 H-20 V-140 H10 V-60 H60 V0 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/><rect x="-40" y="-40" width="20" height="20" fill="#FFC93C"/><rect x="20" y="-40" width="20" height="20" fill="#FFC93C"/>',
        { x: 140, y: 320, enter: 'up' });
      [0, 1, 2, 3].forEach(function (k) {
        var b = s.add('<circle r="22" fill="#C9CED8" stroke="#9AA0B4" stroke-width="2"/>' + T(0, 1, 'CO₂', 14, '#1E1B3A', { w: 700 }), { x: 135, y: 170, enter: 'fade', delay: 400 + k * 450 });
        s.move(b, 160 + k * 52, 120 - (k % 2) * 30, 1600, { delay: 400 + k * 450, easing: 'ease-out' });
      });
      s.add('<circle r="70" fill="#2F80ED"/><path d="M-50 -20 q20 -16 40 0 t30 10 M-20 30 q20 -10 40 4" stroke="#22A06B" stroke-width="14" fill="none" stroke-linecap="round"/>', { x: 460, y: 190, enter: 'pop', delay: 1200 });
      s.add('<rect x="-9" y="-70" width="18" height="110" rx="9" fill="#FFFFFF" stroke="#1E1B3A" stroke-width="3"/><circle cy="48" r="16" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/>', { x: 580, y: 170, enter: 'pop', delay: 1500 });
      var m = s.add('<rect x="-4" y="-50" width="8" height="90" rx="4" fill="#E5484D"/>', { x: 580, y: 170, enter: 'none' });
      m._inner.style.transformOrigin = '50% 100%';
      s.anim(m, [{ transform: 'scaleY(.35)' }, { transform: 'scaleY(1)' }], 1400, { delay: 1700 });
      s.text(460, 300, 'global warming', { size: 26, weight: 700, colour: s.C.red, delay: 2000 });
    },
    'res-renewable': function (s) {
      fresh(s);
      s.text(320, 30, 'Renewable: will not run out', { size: 28, weight: 700, colour: s.C.green });
      var wave = '<path d="M-50 10 q12 -24 25 0 t25 0 t25 0 t25 0" stroke="#2F80ED" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-50 30 q12 -24 25 0 t25 0 t25 0 t25 0" stroke="#7FB2F5" stroke-width="7" fill="none" stroke-linecap="round"/>';
      var dam = '<path d="M-50 -30 L-20 -30 L-6 40 H-50 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/><rect x="-50" y="-22" width="28" height="60" fill="#2F80ED" opacity=".6"/><path d="M-6 30 q20 -2 30 10 q14 0 26 -8" stroke="#2F80ED" stroke-width="7" fill="none" stroke-linecap="round"/>';
      var tide = '<circle cx="30" cy="-24" r="16" fill="#C9CED8"/><path d="M-50 14 H50" stroke="#2F80ED" stroke-width="10" stroke-linecap="round"/><path d="M-40 -2 V-30 M-40 -30 l-8 10 M-40 -30 l8 10" stroke="#2F80ED" stroke-width="4" stroke-linecap="round"/><path d="M-50 30 H50" stroke="#C9B48E" stroke-width="8"/>';
      var geo = '<path d="M-56 40 L-24 -14 H24 L56 40 Z" fill="#8A5A2B"/><path d="M-30 40 Q0 10 30 40 Z" fill="#FF8A3D"/><g transform="translate(0 -20)">' + heat(3, '#9AA0B4') + '</g>';
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
      s.add('<rect x="-90" y="-80" width="180" height="170" rx="16" fill="#2D1B69"/><circle cx="40" cy="-40" r="20" fill="#FFF4D6"/><circle cx="50" cy="-46" r="18" fill="#2D1B69"/>' +
        '<circle cx="-50" cy="-50" r="2.5" fill="#fff"/><circle cx="-20" cy="-30" r="2" fill="#fff"/><circle cx="-60" cy="-10" r="2" fill="#fff"/><g transform="translate(0 40)">' + PANEL + '</g>',
        { x: 320, y: 170, enter: 'fade', delay: 800 });
      s.text(320, 296, 'night: no sunlight', { size: 19, weight: 700, colour: s.C.red, delay: 1300 });
      // geothermal
      s.add('<path d="M-80 90 V20 H80 V90 Z" fill="#8A5A2B"/><path d="M-60 90 Q0 30 60 90 Z" fill="#FF8A3D"/><path d="M-30 20 V-30 H30 V20" fill="#E6E8F0" stroke="#55526E" stroke-width="3"/><path d="M-24 -30 L0 -52 L24 -30 Z" fill="#E5484D"/>' +
        '<g transform="translate(0 -60)">' + heat(3, '#9AA0B4') + '</g>', { x: 530, y: 170, enter: 'fade', delay: 1600 });
      s.text(530, 296, 'works in any weather', { size: 19, weight: 700, colour: s.C.green, delay: 2100 });
      s.add('<circle r="20" fill="#22A06B"/><path d="M-9 0 l6 7 l12 -14" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>', { x: 600, y: 90, enter: 'pop', delay: 2300 });
    }
  });
})();
