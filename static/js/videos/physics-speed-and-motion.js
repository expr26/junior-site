/* Pictures for the Speed and motion theory video (words: videos/physics/speed-and-motion.json). Stage is 640 x 360; see static/js/theory.js.
   Distances along a road are to scale inside each picture; the distance-time graph uses 10 units per second and 2 units per metre. */
(function () {
  if (!window.Theory) return;

  var F = 'Fredoka, Trebuchet MS, sans-serif';
  function T(x, y, t, size, fill, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (size || 18) + '" font-weight="' + (weight || 600) + '" fill="' + (fill || '#1E1B3A') +
      '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle">' + t + '</text>';
  }
  function car(col, tag) {   // 8..128 wide, roof at -2, wheels touch y = 67
    return '<path d="M8 40 Q10 20 34 18 L52 2 Q60 -2 84 2 L104 18 Q126 20 128 40 V52 H8 Z" fill="' + col + '" stroke="#1E1B3A" stroke-width="3"/>' +
      '<path d="M44 18 L56 7 H76 V18 Z M82 18 V7 H90 L100 18 Z" fill="#CFE8FF"/>' +
      '<circle cx="36" cy="54" r="13" fill="#1E1B3A"/><circle cx="36" cy="54" r="5" fill="#C9CED8"/>' +
      '<circle cx="104" cy="54" r="13" fill="#1E1B3A"/><circle cx="104" cy="54" r="5" fill="#C9CED8"/>' +
      (tag ? T(68, 33, tag, 17, '#FFFFFF', 700) : '');
  }
  function road(y, h) {
    h = h || 80;
    return '<rect x="0" y="' + y + '" width="640" height="' + h + '" fill="#5A5F73"/><path d="M0 ' + (y + h / 2) + ' H640" stroke="#fff" stroke-width="4" stroke-dasharray="30 24"/>';
  }
  var SNAIL = '<path d="M0 0 Q-6 -10 4 -12 L46 -12 Q56 -12 58 0 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="2"/>' +
    '<path d="M50 -10 L56 -26 M44 -10 L46 -26" stroke="#C2570C" stroke-width="2"/><circle cx="56" cy="-27" r="3" fill="#1E1B3A"/><circle cx="46" cy="-27" r="3" fill="#1E1B3A"/>' +
    '<circle cx="24" cy="-24" r="18" fill="#FF8A3D" stroke="#C2570C" stroke-width="3"/><path d="M24 -24 m-8 0 a8 8 0 1 0 8 -8" fill="none" stroke="#C2570C" stroke-width="3"/>';
  function stopwatch() {
    return '<rect x="-8" y="-52" width="16" height="12" rx="3" fill="#2D1B69"/><circle r="38" fill="#FFFFFF" stroke="#2D1B69" stroke-width="5"/>';
  }
  function flag(label) {   // pole foot at (0, 0)
    return '<path d="M0 0 V-62" stroke="#55526E" stroke-width="4"/><path d="M0 -62 L30 -54 L0 -46 Z" fill="#E5484D"/>' + T(0, -76, label, 17, '#55526E', 700);
  }
  function dim(x1, x2, y, label, col) {   // a measuring line with end ticks and a label in the middle
    col = col || '#55526E';
    return '<path d="M' + x1 + ' ' + (y - 8) + ' V' + (y + 8) + ' M' + x2 + ' ' + (y - 8) + ' V' + (y + 8) + ' M' + x1 + ' ' + y + ' H' + x2 + '" stroke="' + col + '" stroke-width="3" fill="none"/>' +
      '<rect x="' + ((x1 + x2) / 2 - 38) + '" y="' + (y - 13) + '" width="76" height="26" rx="8" fill="#FFFDF7"/>' + T((x1 + x2) / 2, y + 1, label, 18, col, 700);
  }
  function pill(text, col, w) {
    w = w || 300;
    return '<rect x="' + (-w / 2) + '" y="-28" width="' + w + '" height="56" rx="18" fill="#DDF7EE" stroke="' + (col || '#22A06B') + '" stroke-width="3"/>' + T(0, 2, text, 28, '#0E7A5A', 700);
  }
  function BIKE() {   // rear wheel centre at (0, 0)
    return '<circle cx="0" cy="0" r="16" fill="none" stroke="#1E1B3A" stroke-width="4"/><circle cx="56" cy="0" r="16" fill="none" stroke="#1E1B3A" stroke-width="4"/>' +
      '<path d="M0 0 L22 -24 L48 -24 L56 0 M22 -24 L28 0 L0 0 M48 -24 L46 -34 H54" fill="none" stroke="#E5484D" stroke-width="4" stroke-linejoin="round"/>' +
      '<path d="M22 -26 L30 -56 L46 -36" fill="none" stroke="#2F80ED" stroke-width="6" stroke-linecap="round"/><circle cx="32" cy="-66" r="10" fill="#FFC93C"/>' +
      '<path d="M22 -70 Q32 -84 42 -70 Z" fill="#6C4DF6"/>';
  }
  function train(col, label, face) {   // 0..200 wide, body -64..0, wheels to +12; face 'r' or 'l'
    var nose = face === 'l' ? 'M30 -64 H200 V0 H0 V-30 Q0 -64 30 -64 Z' : 'M0 -64 H170 Q200 -64 200 -30 V0 H0 Z';
    var w = '';
    for (var i = 0; i < 4; i++) w += '<rect x="' + (face === 'l' ? 52 + i * 36 : 14 + i * 36) + '" y="-54" width="26" height="20" rx="4" fill="#CFE8FF"/>';
    return '<path d="' + nose + '" fill="' + col + '" stroke="#1E1B3A" stroke-width="3"/>' + w +
      '<circle cx="40" cy="2" r="10" fill="#1E1B3A"/><circle cx="100" cy="2" r="10" fill="#1E1B3A"/><circle cx="160" cy="2" r="10" fill="#1E1B3A"/>' +
      (label ? T(100, -16, label, 17, '#FFFFFF', 700) : '');
  }
  function line(s, d, col, delay, ms, o) {   // a line that draws itself
    o = o || {};
    var g = s.add('<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (o.width || 6) + '" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="' + (o.dash ? '0.03 0.03' : '1') + '" stroke-dashoffset="' + (o.dash ? 0 : 1) + '"/>',
      { enter: o.dash ? 'fade' : 'none', delay: delay, name: o.name });
    if (o.dash) return g;
    var p = g.querySelector('path');
    if (p.animate && !s.fast) p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: ms || 1200, delay: delay || 0, fill: 'both' });
    else p.setAttribute('stroke-dashoffset', '0');
    return g;
  }
  function tri(H, W) {   // formula triangle, apex at (0, 0)
    var hy = H * 0.54;
    return '<path d="M0 0 L' + W + ' ' + H + ' H' + (-W) + ' Z" fill="#FFFFFF" stroke="#2D1B69" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M' + (-W * hy / H) + ' ' + hy + ' H' + (W * hy / H) + ' M0 ' + hy + ' V' + H + '" stroke="#2D1B69" stroke-width="4"/>' +
      T(0, H * 0.38, 'distance', H * 0.105, '#2F80ED', 700) + T(-W * 0.45, H * 0.78, 'speed', H * 0.105, '#22A06B', 700) + T(W * 0.45, H * 0.78, 'time', H * 0.105, '#FF8A3D', 700);
  }
  function cover(w, h, rot) {
    return '<g transform="rotate(' + (rot || -4) + ')"><rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="10" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/>' +
      T(0, 2, '?', h * 0.6, '#2D1B69', 700) + '</g>';
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }

  /* the distance-time graph: origin (90, 300), 10 units per second, 2 units per metre */
  var GX = 90, GY = 300;
  function gx(t) { return GX + t * 10; }
  function gy(d) { return GY - d * 2; }

  Theory.scenes({
    /* ---------- 1. What is speed? ---------- */
    'race': function (s) {
      s.text(320, 36, 'Who is faster?', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<rect x="0" y="80" width="640" height="80" fill="#CDEFD9"/>' + road(190, 90) +
        '<path d="M40 80 V280" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="10 8"/>', { enter: 'fade' });
      var sn = s.add(SNAIL, { x: 40, y: 140, enter: 'pop', delay: 200 });
      var c = s.add(car('#E5484D'), { x: 30, y: 206, enter: 'pop', delay: 300 });
      s.move(sn, 100, 140, 3000, { delay: 800, easing: 'linear' });
      s.move(c, 480, 206, 3000, { delay: 800, easing: 'linear' });
      s.text(190, 120, 'a short way: slow', { size: 22, anchor: 'start', colour: s.C.muted, delay: 3800 });
      s.text(320, 318, 'a long way in the same time: fast', { size: 22, colour: s.C.red, weight: 700, delay: 4000 });
    },
    'journey': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'A car on a journey', { size: 30, weight: 700, colour: s.C.fun });
      s.add(road(230) + dim(150, 600, 334, '100 m', '#2D1B69'), { enter: 'fade' });
      s.add(flag('start'), { x: 150, y: 230, enter: 'up', delay: 200 });
      s.add(flag('finish'), { x: 600, y: 230, enter: 'up', delay: 300 });
      var c = s.add(car('#2F80ED'), { x: 22, y: 222, enter: 'pop', delay: 300, name: 'car' });
      s.add(stopwatch(), { x: 320, y: 120, enter: 'pop', delay: 400, name: 'sw' });
      s.text(320, 122, '0 s', { size: 26, weight: 700, colour: s.C.deep, enter: 'fade', delay: 400, name: 'sw0' });
      s.move(c, 472, 222, 3000, { delay: 900, easing: 'linear' });
      s.hide(s.ref.sw0, { delay: 3900, ms: 1 });
      s.text(320, 122, '20 s', { size: 26, weight: 700, colour: s.C.red, enter: 'pop', delay: 3900, name: 'sw20' });
    },
    'per-second': function (s) {
      hideAll(s, ['sw', 'sw20']);
      var ticks = '';
      for (var k = 0; k <= 20; k++) ticks += '<path d="M' + (150 + k * 22.5) + ' 232 V246" stroke="#FFC93C" stroke-width="3"/>';
      s.add(ticks, { enter: 'fade', delay: 200 });
      s.text(330, 210, '20 gaps of 5 m: one gap each second', { size: 18, colour: s.C.muted, delay: 500 });
      s.text(320, 96, '5 m every second', { size: 30, weight: 700, colour: s.C.deep, delay: 900 });
      s.add(pill('= 5 m/s', '#22A06B', 200), { x: 320, y: 148, enter: 'pop', delay: 1600 });
    },
    'formula': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect x="-250" y="-44" width="500" height="88" rx="22" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="4"/>' + T(0, 2, 'speed = distance ÷ time', 34, '#2D1B69', 700),
        { x: 320, y: 100, enter: 'pop' });
      s.text(300, 200, '= 100 m ÷ 20 s', { size: 30, colour: s.C.ink, delay: 900 });
      s.text(300, 262, '= 5 m/s', { size: 40, weight: 700, colour: s.C.green, enter: 'pop', delay: 1700 });
      s.owl(560, 345, 100, { delay: 2200 });
    },

    /* ---------- 2. The formula triangle ---------- */
    'triangle': function (s) {
      s.text(320, 28, 'The formula triangle', { size: 26, weight: 700, colour: s.C.fun });
      s.add(tri(250, 190), { x: 210, y: 60, enter: 'pop', delay: 200, name: 'tri' });
      s.owl(530, 330, 110, { delay: 800 });
    },
    'cover-d': function (s) {
      s.add(cover(130, 62), { x: 210, y: 155, enter: 'down', name: 'cov' });
      s.add('<circle r="15" fill="#FFFFFF" stroke="#2D1B69" stroke-width="3"/>' + T(0, 1, '×', 24, '#2D1B69', 700), { x: 210, y: 255, enter: 'pop', delay: 600 });
      s.text(525, 110, 'distance =', { size: 26, weight: 700, colour: s.C.blue, delay: 900 });
      s.text(525, 150, 'speed × time', { size: 26, weight: 700, colour: s.C.deep, delay: 1300 });
    },
    'car-distance': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'distance = speed × time', { size: 28, weight: 700, colour: s.C.deep });
      s.add(road(240) + dim(148, 598, 340, '300 m', '#2D1B69'), { enter: 'fade' });
      var c = s.add(car('#FF8A3D', '20 m/s'), { x: 20, y: 232, enter: 'pop', delay: 200 });
      s.add(stopwatch(), { x: 140, y: 130, enter: 'pop', delay: 300 });
      s.text(140, 132, '15 s', { size: 26, weight: 700, colour: s.C.red, enter: 'fade', delay: 300 });
      s.move(c, 470, 232, 3000, { delay: 800, easing: 'linear' });
      s.text(420, 120, '20 × 15', { size: 28, colour: s.C.ink, delay: 1200 });
      s.add(pill('= 300 m', '#22A06B', 200), { x: 420, y: 172, enter: 'pop', delay: 3600 });
    },
    'cover-t': function (s) {
      s.clear(); s.ref = {};
      s.add(tri(175, 133), { x: 140, y: 40, enter: 'fade' });
      s.add(cover(76, 46, 5), { x: 200, y: 177, enter: 'down', delay: 300 });
      s.text(440, 60, 'time = distance ÷ speed', { size: 24, weight: 700, colour: s.C.orange, delay: 800 });
      s.add('<rect x="290" y="262" width="330" height="18" rx="9" fill="#FF8A8A"/><path d="M300 271 H610" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 8"/>', { enter: 'fade', delay: 900 });
      var o = s.owl(310, 266, 70, { delay: 1000 });
      s.move(o, 595, 266, 3000, { delay: 1500, easing: 'linear' });
      s.text(455, 306, '400 m at 8 m/s', { size: 20, colour: s.C.muted, delay: 1200 });
      s.text(440, 120, '400 ÷ 8', { size: 28, colour: s.C.ink, delay: 1800 });
      s.add(pill('= 50 s', '#22A06B', 180), { x: 440, y: 172, enter: 'pop', delay: 4200 });
    },

    /* ---------- 3. Units of speed ---------- */
    'units-signs': function (s) {
      s.text(320, 34, 'Units of speed', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<circle r="78" fill="#EEE9FF" stroke="#6C4DF6" stroke-width="5"/>' + T(0, 2, 'm/s', 46, '#2D1B69', 700), { x: 180, y: 160, enter: 'pop', delay: 200 });
      s.text(180, 268, 'metres per second', { size: 22, colour: s.C.ink, delay: 600 });
      s.add('<circle r="78" fill="#DDF7EE" stroke="#0F9488" stroke-width="5"/>' + T(0, 2, 'km/h', 46, '#0E5C55', 700), { x: 460, y: 160, enter: 'pop', delay: 1200 });
      s.text(460, 268, 'kilometres per hour', { size: 22, colour: s.C.ink, delay: 1600 });
      s.text(320, 322, 'a distance ÷ a time', { size: 22, weight: 700, colour: s.C.muted, delay: 2200 });
    },
    'cyclist': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'A bike ride', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<rect x="0" y="250" width="640" height="110" fill="#CDEFD9"/><rect x="0" y="246" width="640" height="8" fill="#C9B48E"/>' +
        '<rect x="14" y="200" width="56" height="46" fill="#FFF4D6" stroke="#8A5A2B" stroke-width="3"/><path d="M6 202 L42 172 L78 202 Z" fill="#E5484D" stroke="#8A5A2B" stroke-width="3"/><rect x="34" y="220" width="16" height="26" fill="#8A5A2B"/>' +
        '<rect x="572" y="150" width="30" height="96" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/><rect x="600" y="180" width="30" height="66" fill="#C9CED8" stroke="#55526E" stroke-width="3"/>' +
        '<path d="M580 165 h14 M580 185 h14 M580 205 h14 M608 195 h14 M608 215 h14" stroke="#FFF4D6" stroke-width="6"/>' +
        dim(42, 600, 282, '30 km', '#2D1B69'), { enter: 'fade' });
      var b = s.add(BIKE(), { x: 90, y: 230, enter: 'pop', delay: 200 });
      s.move(b, 490, 230, 3000, { delay: 700, easing: 'linear' });
      s.add('<circle r="34" fill="#FFFFFF" stroke="#2D1B69" stroke-width="5"/><path d="M0 0 V-22 M0 0 L16 8" stroke="#2D1B69" stroke-width="4" stroke-linecap="round"/>', { x: 250, y: 110, enter: 'pop', delay: 400 });
      s.text(300, 110, '2 hours', { size: 28, weight: 700, colour: s.C.red, anchor: 'start', delay: 600 });
      s.add(pill('30 ÷ 2 = 15 km/h', '#22A06B', 320), { x: 320, y: 324, enter: 'pop', delay: 3800 });
    },
    'convert': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Check the units match', { size: 30, weight: 700, colour: s.C.fun });
      [['1 km = 1000 m', 170, 120, '#2F80ED'], ['1 minute = 60 s', 470, 120, '#FF8A3D'], ['1 hour = 60 minutes', 170, 230, '#FF8A3D'], ['1 hour = 3600 s', 470, 230, '#E5484D']].forEach(function (c, i) {
        s.add('<rect x="-135" y="-38" width="270" height="76" rx="18" fill="#FFFFFF" stroke="' + c[3] + '" stroke-width="4"/>' + T(0, 2, c[0], 26, '#1E1B3A', 700),
          { x: c[1], y: c[2], enter: 'pop', delay: 300 + i * 700 });
      });
      s.text(320, 318, '60 × 60 = 3600', { size: 22, colour: s.C.muted, delay: 3200 });
    },
    'train': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, '150 km in 1 hour 30 minutes', { size: 26, weight: 700, colour: s.C.fun });
      s.add('<path d="M0 182 H640" stroke="#55526E" stroke-width="5"/><path d="M0 190 H640" stroke="#9AA0B4" stroke-width="8" stroke-dasharray="6 18"/>', { enter: 'fade' });
      var t = s.add(train('#6C4DF6', '', 'r'), { x: 20, y: 170, enter: 'pop', delay: 200 });
      s.move(t, 420, 170, 3000, { delay: 600, easing: 'ease-in-out' });
      s.text(290, 240, '1 hour 30 minutes = 1.5 hours', { size: 24, colour: s.C.ink, delay: 1000 });
      s.text(482, 241, '(not 1.3!)', { size: 20, weight: 700, colour: s.C.red, anchor: 'start', delay: 1800 });
      s.add(pill('150 ÷ 1.5 = 100 km/h', '#22A06B', 360), { x: 300, y: 312, enter: 'pop', delay: 2600 });
    },

    /* ---------- 4. Distance-time graphs ---------- */
    'dt-axes': function (s) {
      var g = '';
      for (var t = 10; t <= 30; t += 10) g += '<path d="M' + gx(t) + ' ' + gy(120) + ' V' + GY + '" stroke="#EAE2D6" stroke-width="2"/><path d="M' + gx(t) + ' ' + GY + ' v7" stroke="#1E1B3A" stroke-width="2"/>' + T(gx(t), GY + 20, t, 15, '#55526E', 600);
      for (var d = 20; d <= 120; d += 20) g += '<path d="M' + GX + ' ' + gy(d) + ' H' + gx(30) + '" stroke="#EAE2D6" stroke-width="2"/><path d="M' + GX + ' ' + gy(d) + ' h-7" stroke="#1E1B3A" stroke-width="2"/>' + T(GX - 12, gy(d), d, 14, '#55526E', 600, 'end');
      s.add('<rect x="' + GX + '" y="' + gy(120) + '" width="300" height="240" fill="#FFFFFF"/>' + g + T(GX - 12, GY + 14, '0', 14, '#55526E', 600, 'end') +
        '<path d="M' + GX + ' ' + (gy(120) - 14) + ' V' + GY + ' H' + (gx(30) + 14) + '" fill="none" stroke="#1E1B3A" stroke-width="3"/>' +
        T(240, 344, 'time (s)', 17, '#1E1B3A', 700) +
        '<text x="0" y="0" font-family="' + F + '" font-size="17" font-weight="700" fill="#1E1B3A" text-anchor="middle" dominant-baseline="middle" transform="translate(28 180) rotate(-90)">distance (m)</text>',
        { enter: 'fade' });
      s.text(525, 60, 'Distance-time graph', { size: 22, weight: 700, colour: s.C.fun, delay: 300 });
      s.text(525, 140, 'along: time', { size: 22, colour: s.C.orange, weight: 700, delay: 900, name: 'a1' });
      s.text(525, 180, 'up: distance', { size: 22, colour: s.C.blue, weight: 700, delay: 1500, name: 'a2' });
    },
    'dt-steady': function (s) {
      hideAll(s, ['a1', 'a2']);
      s.add('<path d="M' + GX + ' ' + gy(50) + ' H' + gx(10) + ' V' + GY + '" fill="none" stroke="#2F80ED" stroke-width="2" stroke-dasharray="5 5"/>' + T(GX + 14, gy(50) - 10, '50', 14, '#2F80ED', 700), { enter: 'fade', delay: 1400 });
      line(s, 'M' + gx(0) + ' ' + gy(0) + ' L' + gx(10) + ' ' + gy(50), '#2F80ED', 300, 1200);
      s.text(525, 130, 'sloping line:', { size: 22, weight: 700, colour: s.C.blue, delay: 1400, name: 'r1' });
      s.text(525, 166, 'steady speed', { size: 22, weight: 700, colour: s.C.blue, delay: 1500, name: 'r2' });
      s.text(525, 212, '50 m in 10 s', { size: 22, delay: 2000, name: 'r3' });
      s.text(525, 254, '= 5 m/s', { size: 30, weight: 700, colour: s.C.green, enter: 'pop', delay: 2600, name: 'r4' });
    },
    'dt-stop': function (s) {
      hideAll(s, ['r1', 'r2', 'r3', 'r4']);
      line(s, 'M' + gx(10) + ' ' + gy(50) + ' L' + gx(20) + ' ' + gy(50), '#FF8A3D', 300, 1000);
      s.text(240, gy(50) + 20, 'stopped', { size: 17, weight: 700, colour: s.C.orange, delay: 1300 });
      s.text(525, 130, 'flat line:', { size: 22, weight: 700, colour: s.C.orange, delay: 1200, name: 'r1' });
      s.text(525, 176, 'distance stays', { size: 22, delay: 1700, name: 'r2' });
      s.text(525, 206, 'at 50 m', { size: 22, delay: 1800, name: 'r3' });
      s.text(525, 254, 'not moving', { size: 28, weight: 700, colour: s.C.orange, enter: 'pop', delay: 2400, name: 'r4' });
    },
    'dt-steep': function (s) {
      hideAll(s, ['r1', 'r2', 'r3', 'r4']);
      s.add('<path d="M' + GX + ' ' + gy(120) + ' H' + gx(30) + '" fill="none" stroke="#E5484D" stroke-width="2" stroke-dasharray="5 5"/>', { enter: 'fade', delay: 1300 });
      line(s, 'M' + gx(20) + ' ' + gy(50) + ' L' + gx(30) + ' ' + gy(120), '#E5484D', 300, 1100);
      s.text(525, 130, 'steeper line:', { size: 22, weight: 700, colour: s.C.red, delay: 1300, name: 'r1' });
      s.text(525, 176, '50 m to 120 m', { size: 22, delay: 1700, name: 'r2' });
      s.text(525, 206, '70 m in 10 s', { size: 22, delay: 2100, name: 'r3' });
      s.text(525, 254, '= 7 m/s, faster!', { size: 26, weight: 700, colour: s.C.green, enter: 'pop', delay: 2700, name: 'r4' });
    },
    'dt-average': function (s) {
      hideAll(s, ['r1', 'r2', 'r3', 'r4']);
      s.add('<path d="M' + gx(0) + ' ' + gy(0) + ' L' + gx(30) + ' ' + gy(120) + '" stroke="#6C4DF6" stroke-width="3" stroke-dasharray="8 7"/>', { enter: 'fade', delay: 300 });
      s.text(525, 130, 'whole trip:', { size: 22, weight: 700, colour: s.C.fun, delay: 800 });
      s.text(525, 176, '120 m ÷ 30 s', { size: 24, delay: 1300 });
      s.text(525, 230, 'average speed', { size: 20, colour: s.C.muted, delay: 1900 });
      s.text(525, 266, '= 4 m/s', { size: 32, weight: 700, colour: s.C.green, enter: 'pop', delay: 2200 });
    },

    /* ---------- 5. Relative motion ---------- */
    'rel-cars': function (s) {
      s.text(320, 40, 'Same direction', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<rect x="0" y="150" width="640" height="160" fill="#5A5F73"/><path d="M0 230 H640" stroke="#fff" stroke-width="4" stroke-dasharray="30 24"/>' +
        '<path d="M0 154 H640 M0 306 H640" stroke="#FFC93C" stroke-width="3"/><path d="M40 150 V310" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 6"/>', { enter: 'fade' });
      s.add(car('#E5484D', '30 m/s'), { x: 32, y: 160, enter: 'pop', delay: 300, name: 'fast' });
      s.add(car('#2F80ED', '25 m/s'), { x: 32, y: 238, enter: 'pop', delay: 600, name: 'slow' });
      s.arrow(200, 105, 90, 'r', { label: 'both this way', colour: s.C.fun, width: 7, size: 17, delay: 1000 });
    },
    'rel-gap': function (s) {
      s.move(s.ref.fast, 32 + 330, 160, 2200, { easing: 'linear' });   // 11 units per metre, for 1 second
      s.move(s.ref.slow, 32 + 275, 238, 2200, { easing: 'linear' });
      s.add('<path d="M' + (32 + 128 + 275) + ' 150 V310 M' + (32 + 128 + 330) + ' 150 V310" stroke="#FFC93C" stroke-width="3" stroke-dasharray="6 5"/>', { enter: 'fade', delay: 2300 });
      s.text(320, 336, 'after 1 second, the red car is 5 m ahead', { size: 20, weight: 700, colour: s.C.orange, delay: 2400 });
      s.add(pill('30 − 25 = 5 m/s', '#22A06B', 300), { x: 480, y: 100, enter: 'pop', delay: 2800 });
    },
    'rel-trains': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Towards each other', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<path d="M0 162 H640 M0 282 H640" stroke="#55526E" stroke-width="5"/><path d="M0 170 H640 M0 290 H640" stroke="#9AA0B4" stroke-width="8" stroke-dasharray="6 18"/>', { enter: 'fade' });
      var a = s.add(train('#E5484D', '40 m/s →', 'r'), { x: 10, y: 150, enter: 'pop', delay: 200 });
      var b = s.add(train('#2F80ED', '← 35 m/s', 'l'), { x: 430, y: 270, enter: 'pop', delay: 400 });
      s.move(a, 10 + 120, 150, 2200, { delay: 900, easing: 'linear' });   // 3 units per metre, for 1 second
      s.move(b, 430 - 105, 270, 2200, { delay: 900, easing: 'linear' });
      s.add(pill('40 + 35 = 75 m/s', '#22A06B', 300), { x: 320, y: 328, enter: 'pop', delay: 3300 });
    },
    'rel-seat': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect x="0" y="290" width="640" height="70" fill="#CDEFD9"/><path d="M0 285 H640" stroke="#55526E" stroke-width="5"/>' +
        [30, 250, 470, 600].map(function (x) { return '<rect x="' + (x - 5) + '" y="245" width="10" height="40" fill="#8A5A2B"/><circle cx="' + x + '" cy="236" r="22" fill="#22A06B"/>'; }).join(''), { enter: 'fade' });
      s.text(320, 34, 'Next to each other: still', { size: 26, weight: 700, colour: s.C.fun, delay: 2600 });
      var car_ = s.add('<rect x="0" y="0" width="430" height="190" rx="24" fill="#FF8A3D" stroke="#1E1B3A" stroke-width="3"/><rect x="40" y="22" width="350" height="120" rx="14" fill="#CFE8FF" stroke="#1E1B3A" stroke-width="3"/>' +
        '<circle cx="80" cy="198" r="12" fill="#1E1B3A"/><circle cx="350" cy="198" r="12" fill="#1E1B3A"/>', { x: 20, y: 78, enter: 'pop' });
      var o1 = s.owl(150, 218, 90, { delay: 300 }), o2 = s.owl(290, 218, 90, { delay: 400 });
      [car_, o1, o2].forEach(function (g) { s.move(g, g._x + 150, g._y, 3500, { delay: 900, easing: 'linear' }); });
      s.arrow(170, 322, 260, 'r', { label: 'compared with the ground: moving', labelSide: 'below', colour: s.C.red, width: 8, size: 17, delay: 2000 });
    }
  });
})();
