/* Pictures for the Light theory video (words: videos/physics/light.json). Stage is 640 x 360; see static/js/theory.js.
   Angles in the reflection and refraction pictures are drawn true: 40° reflection, and 45° into glass bending to 28°
   (glass refractive index 1.5). */
(function () {
  if (!window.Theory) return;

  var FONT = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function T(x, y, txt, o) {   // plain text markup, for use inside s.add
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (o.size || 18) + '" font-weight="' + (o.weight || 600) + '" fill="' + (o.colour || '#1E1B3A') +
      '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="middle" stroke="#FFFDF7" stroke-width="4" paint-order="stroke">' + txt + '</text>';
  }
  function head(x, y, ang, col, k) {   // an arrowhead at (x, y) pointing at angle ang (radians)
    k = k || 1;
    return '<path d="M' + (-10 * k) + ' ' + (-8 * k) + ' L' + (9 * k) + ' 0 L' + (-10 * k) + ' ' + (8 * k) + ' Z" fill="' + col + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (ang * 180 / Math.PI).toFixed(1) + ')"/>';
  }
  /* ray(s, [[x, y], ...], {colour, width, delay, ms, arrows, name, opacity}): a light ray that draws itself along the points,
     with an arrowhead in the middle of each piece */
  function ray(s, pts, o) {
    o = o || {};
    var col = o.colour || '#FFB300', w = o.width || 5, d = 'M' + pts[0][0] + ' ' + pts[0][1], heads = '';
    for (var i = 1; i < pts.length; i++) {
      d += ' L' + pts[i][0] + ' ' + pts[i][1];
      if (o.arrows !== false) {
        var a = pts[i - 1], b = pts[i];
        heads += head((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, Math.atan2(b[1] - a[1], b[0] - a[0]), col, w / 5);
      }
    }
    var g = s.add('<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + (o.opacity || 1) +
      '" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>', { enter: 'none', name: o.name });
    var p = g.querySelector('path'), ms = o.ms || 900;
    if (p.animate && !s.fast) p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: ms, delay: o.delay || 0, fill: 'both', easing: 'linear' });
    else p.setAttribute('stroke-dashoffset', '0');
    if (heads) s.add(heads, { enter: 'fade', delay: (o.delay || 0) + ms * 0.5, ms: 200, name: o.name ? o.name + '-h' : undefined });
    return g;
  }
  function sun(r) {
    var rays = '';
    for (var k = 0; k < 12; k++) {
      var a = k * Math.PI / 6;
      rays += '<path d="M' + (Math.cos(a) * (r + 8)).toFixed(1) + ' ' + (Math.sin(a) * (r + 8)).toFixed(1) + ' L' + (Math.cos(a) * (r + 22)).toFixed(1) + ' ' + (Math.sin(a) * (r + 22)).toFixed(1) + '" stroke="#FFB300" stroke-width="5" stroke-linecap="round"/>';
    }
    return rays + '<circle r="' + r + '" fill="#FFC93C" stroke="#F59E0B" stroke-width="4"/><circle cx="' + (-r / 3) + '" cy="' + (-r / 3) + '" r="' + (r / 4) + '" fill="#FFE7A0"/>';
  }
  var BULB = '<circle r="44" fill="#FFF3B0" opacity=".6"/><circle r="30" fill="#FFE066" stroke="#F59E0B" stroke-width="3"/>' +
    '<path d="M-8 6 q4 -10 8 0 q4 -10 8 0" fill="none" stroke="#C2570C" stroke-width="2.5"/>' +
    '<rect x="-14" y="26" width="28" height="22" rx="4" fill="#9AA0B4" stroke="#55526E" stroke-width="2"/><path d="M-14 33 H14 M-14 40 H14" stroke="#55526E" stroke-width="2"/>';
  var CANDLE = '<ellipse cx="0" cy="-58" rx="22" ry="28" fill="#FFF3B0" opacity=".7"/><path d="M0 -80 Q14 -58 0 -42 Q-14 -58 0 -80 Z" fill="#FF8A3D"/><path d="M0 -68 Q6 -56 0 -46 Q-6 -56 0 -68 Z" fill="#FFE066"/>' +
    '<path d="M0 -42 V-34" stroke="#1E1B3A" stroke-width="3"/><rect x="-18" y="-34" width="36" height="84" rx="6" fill="#FF5D8F" stroke="#B42318" stroke-width="3"/>';
  var MOON = '<circle r="36" fill="#D7DBE6" stroke="#9AA0B4" stroke-width="3"/><circle cx="-12" cy="-8" r="7" fill="#B9BFCF"/><circle cx="12" cy="10" r="9" fill="#B9BFCF"/><circle cx="10" cy="-16" r="4" fill="#B9BFCF"/>';
  var TORCH = '<rect x="-60" y="-14" width="58" height="28" rx="8" fill="#2F80ED" stroke="#1E1B3A" stroke-width="3"/><path d="M-2 -14 L18 -24 V24 L-2 14 Z" fill="#9AA0B4" stroke="#1E1B3A" stroke-width="3"/>' +
    '<rect x="-44" y="-6" width="14" height="12" rx="3" fill="#FFC93C"/>';
  function apple(fill) {
    return '<path d="M0 -30 C-34 -48 -56 -12 -44 14 C-34 38 -14 44 0 36 C14 44 34 38 44 14 C56 -12 34 -48 0 -30 Z" fill="' + fill + '" stroke="#1E1B3A" stroke-width="3"/>' +
      '<path d="M0 -30 Q2 -44 8 -52" stroke="#8A5A2B" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 -46 Q24 -58 34 -44 Q18 -38 6 -46 Z" fill="#22A06B"/>';
  }
  function arc(cx, cy, r, a0, a1, col) {   // arc from angle a0 to a1 (degrees)
    var p = function (a) { return (cx + r * Math.cos(a * Math.PI / 180)).toFixed(1) + ' ' + (cy + r * Math.sin(a * Math.PI / 180)).toFixed(1); };
    return '<path d="M' + p(a0) + ' A' + r + ' ' + r + ' 0 0 ' + (a1 > a0 ? 1 : 0) + ' ' + p(a1) + '" fill="none" stroke="' + col + '" stroke-width="4"/>';
  }
  var SPECTRUM = ['#E5484D', '#FF8A3D', '#FFC93C', '#22A06B', '#2F80ED', '#4B3FB5', '#8E44DD'];

  /* shadow geometry: lamp at (LX, LY), ball radius BR, screen at SX */
  var LX = 70, LY = 180, BR = 32, SX = 548;
  function shadowAt(s, bx, o) {
    var d = bx - LX, t = Math.tan(Math.asin(BR / d)), h = t * (SX - LX);
    var top = LY - h, bot = LY + h;
    s.add('<path d="M' + bx + ' ' + (LY - BR) + ' L' + SX + ' ' + top.toFixed(1) + ' V' + bot.toFixed(1) + ' L' + bx + ' ' + (LY + BR) + ' Z" fill="#2D1B69" opacity=".22"/>' +
      '<rect x="' + (SX - 4) + '" y="' + top.toFixed(1) + '" width="8" height="' + (bot - top).toFixed(1) + '" fill="#1E1B3A"/>', Object.assign({ enter: 'fade' }, o));
    ray(s, [[LX, LY], [SX, top - 2]], { width: 3, delay: o.delay - 600, ms: 600, arrows: false, name: o.name + 'r1' });
    ray(s, [[LX, LY], [SX, bot + 2]], { width: 3, delay: o.delay - 600, ms: 600, arrows: false, name: o.name + 'r2' });
  }

  Theory.scenes({
    /* ---------- 1. How light travels ---------- */
    'sources': function (s) {
      s.text(320, 40, 'Light sources give out their own light', { size: 26, weight: 700, colour: s.C.deep });
      var sn = s.add(sun(44), { x: 130, y: 180, enter: 'pop', delay: 300 });
      s.text(130, 290, 'the Sun', { size: 22, delay: 500 });
      s.add(BULB, { x: 320, y: 170, enter: 'pop', delay: 1000 });
      s.text(320, 290, 'a lamp', { size: 22, delay: 1200 });
      s.add(CANDLE, { x: 510, y: 210, enter: 'pop', delay: 1700 });
      s.text(510, 290, 'a candle', { size: 22, delay: 1900 });
      s.anim(sn, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(30deg)' }], 3000, { delay: 600, iterations: 2 });
    },
    'moon': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'The Moon only reflects light', { size: 28, weight: 700, colour: s.C.deep });
      s.add(sun(34), { x: 80, y: 130, enter: 'pop' });
      s.add(MOON, { x: 400, y: 110, enter: 'pop', delay: 300 });
      s.owl(560, 340, 110, { delay: 500 });
      ray(s, [[124, 128], [360, 112]], { delay: 900 });
      ray(s, [[420, 140], [536, 262]], { delay: 1900 });
      s.text(320, 165, 'not a light source', { size: 18, colour: s.C.muted, delay: 2600 });
      s.text(160, 250, 'light from the Sun', { size: 20, colour: '#C2570C', delay: 1200 });
      s.text(160, 280, 'bounces off the Moon', { size: 20, colour: '#C2570C', delay: 2200 });
    },
    'rays': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Light travels in straight lines', { size: 28, weight: 700, colour: s.C.deep });
      s.add(TORCH, { x: 110, y: 190, enter: 'pop' });
      s.add('<path d="M130 166 L600 110 V270 L130 214 Z" fill="#FFF3B0" opacity=".55"/>', { enter: 'fade', delay: 300 });
      ray(s, [[134, 172], [600, 116]], { delay: 500 });
      ray(s, [[134, 190], [600, 190]], { delay: 800 });
      ray(s, [[134, 208], [600, 264]], { delay: 1100 });
      s.add(T(470, 166, 'a ray', { size: 22, weight: 700, colour: '#C2570C' }), { enter: 'fade', delay: 1900 });
      s.text(320, 320, 'Straight lines with arrows show where light goes', { size: 20, colour: s.C.muted, delay: 2400 });
    },
    'fast': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 60, 'about 300,000 km', { size: 44, weight: 700, colour: s.C.fun, enter: 'pop' });
      s.text(320, 110, 'every second!', { size: 28, colour: s.C.deep, delay: 500 });
      s.add(sun(30), { x: 80, y: 240, enter: 'pop', delay: 900 });
      s.add('<circle r="36" fill="#2F80ED"/><path d="M-26 -10 q14 -12 26 0 t20 4 M-14 18 q12 -6 24 4" stroke="#22A06B" stroke-width="9" fill="none" stroke-linecap="round"/>', { x: 560, y: 240, enter: 'pop', delay: 1100 });
      s.add('<path d="M120 240 H516" stroke="#9AA0B4" stroke-width="3" stroke-dasharray="4 10"/>', { enter: 'fade', delay: 1300 });
      var dot = s.add('<circle r="9" fill="#FFC93C" stroke="#F59E0B" stroke-width="3"/>', { x: 120, y: 240, enter: 'fade', delay: 1500, ms: 100 });
      s.move(dot, 516, 240, 1200, { delay: 1600, easing: 'linear' });
      s.text(320, 300, 'Sun to Earth: about 8 minutes', { size: 24, weight: 700, colour: '#C2570C', delay: 2600 });
    },
    'seeing': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 32, 'How we see things', { size: 28, weight: 700, colour: s.C.deep });
      s.add(BULB, { x: 90, y: 110, enter: 'pop' });
      s.add('<rect x="-150" y="0" width="300" height="14" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><rect x="-130" y="14" width="14" height="80" fill="#8A5A2B"/><rect x="116" y="14" width="14" height="80" fill="#8A5A2B"/>',
        { x: 290, y: 270, enter: 'up', delay: 200 });
      s.add('<rect x="-50" y="-26" width="100" height="26" rx="4" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/><rect x="-42" y="-20" width="84" height="5" fill="#FFD2D4"/>', { x: 290, y: 270, enter: 'down', delay: 400 });
      s.owl(540, 330, 130, { delay: 600 });   // eyes at about (523, 258) and (557, 258)
      ray(s, [[124, 136], [270, 244]], { delay: 1200 });
      ray(s, [[310, 244], [518, 258]], { delay: 2200 });
      s.text(190, 70 + 0, '1. light leaves the lamp', { size: 18, anchor: 'start', colour: '#C2570C', delay: 1400 });
      s.text(190, 100, '2. bounces off the book', { size: 18, anchor: 'start', colour: '#C2570C', delay: 2200 });
      s.text(190, 130, '3. goes into the eye', { size: 18, anchor: 'start', colour: '#C2570C', delay: 3000 });
    },

    /* ---------- 2. Materials and shadows ---------- */
    'transparent': function (s) {
      s.text(320, 30, 'What happens when light hits a material?', { size: 24, weight: 700, colour: s.C.deep });
      s.add(TORCH, { x: 90, y: 105, enter: 'pop' });
      s.add('<path d="M110 92 L250 84 V126 L110 118 Z" fill="#FFF3B0"/><path d="M264 84 L410 76 V134 L264 126 Z" fill="#FFF3B0"/>', { enter: 'left', delay: 300 });
      s.add('<rect x="250" y="70" width="14" height="70" rx="3" fill="#CFE8FF" stroke="#2F80ED" stroke-width="3" opacity=".9"/>', { enter: 'pop', delay: 100 });
      s.add(T(430, 92, 'Transparent', { size: 24, weight: 700, colour: s.C.blue, anchor: 'start' }) + T(430, 120, 'clear glass', { size: 18, colour: '#55526E', anchor: 'start' }), { enter: 'fade', delay: 800 });
    },
    'translucent': function (s) {
      s.add(TORCH, { x: 90, y: 195, enter: 'pop' });
      s.add('<path d="M110 182 L250 174 V216 L110 208 Z" fill="#FFF3B0"/><path d="M264 174 L410 150 V240 L264 216 Z" fill="#FFF3B0" opacity=".45"/>' +
        '<path d="M264 186 l40 -14 M264 196 l44 2 M264 206 l40 16" stroke="#FFC93C" stroke-width="3" stroke-linecap="round" opacity=".8"/>', { enter: 'left', delay: 300 });
      s.add('<rect x="250" y="160" width="14" height="70" rx="3" fill="#F2EEE4" stroke="#B9AE96" stroke-width="3"/>', { enter: 'pop', delay: 100 });
      s.add(T(430, 182, 'Translucent', { size: 24, weight: 700, colour: s.C.sci, anchor: 'start' }) + T(430, 210, 'tracing paper', { size: 18, colour: '#55526E', anchor: 'start' }), { enter: 'fade', delay: 800 });
    },
    'opaque': function (s) {
      s.add(TORCH, { x: 90, y: 285, enter: 'pop' });
      s.add('<path d="M110 272 L250 264 V306 L110 298 Z" fill="#FFF3B0"/>', { enter: 'left', delay: 300 });
      s.add('<rect x="250" y="250" width="14" height="70" rx="3" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/>', { enter: 'pop', delay: 100 });
      s.add(T(340, 285, 'no light', { size: 16, colour: '#9AA0B4' }), { enter: 'fade', delay: 900 });
      s.add(T(430, 272, 'Opaque', { size: 24, weight: 700, colour: '#8A5A2B', anchor: 'start' }) + T(430, 300, 'wood, metal, card', { size: 18, colour: '#55526E', anchor: 'start' }), { enter: 'fade', delay: 800 });
    },
    'shadow': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'Shadows', { size: 28, weight: 700, colour: s.C.deep });
      s.add('<circle r="34" fill="#FFF3B0" opacity=".7"/><circle r="18" fill="#FFE066" stroke="#F59E0B" stroke-width="3"/>', { x: LX, y: LY, enter: 'pop' });
      s.add('<rect x="' + (SX - 4) + '" y="24" width="16" height="312" rx="3" fill="#FFFFFF" stroke="#9AA0B4" stroke-width="3"/>', { enter: 'fade', delay: 200 });
      s.add(T(600, 180, 'screen', { size: 16, colour: '#55526E' }), { enter: 'fade', delay: 300 });
      shadowAt(s, 290, { delay: 1600, name: 'sh1' });
      s.add('<circle r="' + BR + '" fill="#2F80ED" stroke="#1E1B3A" stroke-width="3"/><circle cx="-10" cy="-10" r="8" fill="#9CC6FF"/>', { x: 290, y: LY, enter: 'pop', delay: 400, name: 'ball' });
      s.add(T(440, 180, 'shadow', { size: 20, weight: 700, colour: s.C.deep }), { enter: 'fade', delay: 2000, name: 'shlabel' });
    },
    'shadow-bigger': function (s) {
      ['sh1', 'sh1r1', 'sh1r1-h', 'sh1r2', 'sh1r2-h', 'shlabel'].forEach(function (n) { s.hide(s.ref[n], { ms: 300 }); });
      s.move(s.ref.ball, 180, LY, 1200, { delay: 300 });
      shadowAt(s, 180, { delay: 2100, name: 'sh2' });
      svgToFront(s.ref.ball);
      s.add(T(400, 180, 'bigger shadow', { size: 20, weight: 700, colour: '#FFFFFF' }).replace('stroke="#FFFDF7"', 'stroke="#2D1B69"'), { enter: 'fade', delay: 2400 });
    },

    /* ---------- 3. Reflection: mirror along y = 290, ray hits at (320, 290), angle of incidence 40° ---------- */
    'mirror': function (s) {
      s.text(320, 30, 'Reflection', { size: 30, weight: 700, colour: s.C.deep });
      var hatch = '';
      for (var x = 130; x < 510; x += 16) hatch += '<path d="M' + x + ' 296 l-10 14" stroke="#55526E" stroke-width="2"/>';
      s.add('<rect x="120" y="284" width="400" height="10" rx="3" fill="#CFE8FF" stroke="#2F80ED" stroke-width="3"/>' + hatch, { enter: 'up' });
      s.add(T(560, 290, 'mirror', { size: 18, colour: s.C.blue, anchor: 'start' }), { enter: 'fade', delay: 200 });
      ray(s, [[172, 114], [320, 288]], { delay: 500 });
      ray(s, [[320, 288], [468, 114]], { delay: 1400 });
      s.add(T(150, 94, 'ray in', { size: 18, weight: 700, colour: '#C2570C' }), { enter: 'fade', delay: 800 });
      s.add(T(490, 94, 'ray out', { size: 18, weight: 700, colour: '#C2570C' }), { enter: 'fade', delay: 1800 });
    },
    'normal': function (s) {
      s.add('<path d="M320 80 V284" stroke="#2D1B69" stroke-width="3" stroke-dasharray="9 7"/><path d="M320 270 h14 v14" fill="none" stroke="#2D1B69" stroke-width="2"/>', { enter: 'down' });
      s.add(T(320, 66, 'normal', { size: 20, weight: 700, colour: s.C.deep }), { enter: 'fade', delay: 400 });
    },
    'angle-i': function (s) {
      s.add(arc(320, 288, 70, -90, -130, s.C.pink), { enter: 'fade' });
      s.add(T(290, 192, '40°', { size: 20, weight: 700, colour: s.C.pink }), { enter: 'pop', delay: 300 });
      s.add(T(140, 230, 'angle of', { size: 18, colour: s.C.pink }) + T(140, 252, 'incidence', { size: 18, weight: 700, colour: s.C.pink }), { enter: 'fade', delay: 600 });
    },
    'angle-r': function (s) {
      s.add(arc(320, 288, 70, -90, -50, s.C.green), { enter: 'fade' });
      s.add(T(352, 192, '40°', { size: 20, weight: 700, colour: s.C.green }), { enter: 'pop', delay: 300 });
      s.add(T(500, 230, 'angle of', { size: 18, colour: s.C.green }) + T(500, 252, 'reflection', { size: 18, weight: 700, colour: s.C.green }), { enter: 'fade', delay: 600 });
      s.add('<rect x="-200" y="-20" width="400" height="40" rx="20" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="3"/>' + T(0, 1, 'angle of incidence = angle of reflection', { size: 19, weight: 700, colour: s.C.fun }),
        { x: 320, y: 334, enter: 'pop', delay: 1200 });
    },
    'scatter': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'Smooth or rough?', { size: 28, weight: 700, colour: s.C.deep });
      s.add('<path d="M320 60 V340" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { enter: 'fade' });
      s.add('<rect x="40" y="270" width="240" height="10" rx="3" fill="#CFE8FF" stroke="#2F80ED" stroke-width="3"/>', { enter: 'up' });
      [0, 1, 2].forEach(function (k) {
        var hx = 120 + k * 40;
        ray(s, [[hx - 80, 110], [hx, 268]], { width: 4, delay: 300 + k * 200, ms: 600, arrows: true });
        ray(s, [[hx, 268], [hx + 80, 110]], { colour: '#FF8A3D', width: 4, delay: 900 + k * 200, ms: 600, arrows: true });
      });
      s.add(T(160, 312, 'smooth mirror', { size: 20, weight: 700, colour: s.C.blue }) + T(160, 338, 'neat reflection: an image', { size: 16, colour: '#55526E' }), { enter: 'fade', delay: 1600 });
      var bump = 'M360 274';
      for (var x = 360; x < 600; x += 20) bump += ' q5 -12 10 0 q5 10 10 0';
      s.add('<path d="' + bump + ' V284 H360 Z" fill="#F2EEE4" stroke="#B9AE96" stroke-width="3"/>', { enter: 'up', delay: 1800 });
      var outs = [[-110, -50], [110, -70], [10, -150]];
      [0, 1, 2].forEach(function (k) {
        var hx = 440 + k * 40;
        ray(s, [[hx - 80, 110], [hx, 270]], { width: 4, delay: 2100 + k * 200, ms: 600 });
        ray(s, [[hx, 270], [hx + outs[k][0], 270 + outs[k][1]]], { colour: '#FF8A3D', width: 4, delay: 2700 + k * 200, ms: 500 });
      });
      s.add(T(480, 312, 'rough paper', { size: 20, weight: 700, colour: '#8A5A2B' }) + T(480, 338, 'light scattered everywhere', { size: 16, colour: '#55526E' }), { enter: 'fade', delay: 3300 });
    },

    /* ---------- 4. Refraction: block from x 170 to 430, y 140 to 260; ray in at 45°, inside at 28° ---------- */
    'block': function (s) {
      s.text(320, 30, 'Refraction', { size: 30, weight: 700, colour: s.C.deep });
      s.add('<rect x="170" y="140" width="260" height="120" rx="4" fill="#CFE8FF" fill-opacity=".75" stroke="#2F80ED" stroke-width="3"/><path d="M180 150 l30 30 M190 150 l50 50" stroke="#FFFFFF" stroke-width="4" opacity=".8"/>', { enter: 'up' });
      s.add(T(90, 120, 'air', { size: 22, weight: 700, colour: s.C.muted }) + T(215, 240, 'glass', { size: 22, weight: 700, colour: s.C.blue }), { enter: 'fade', delay: 300 });
      s.add(T(540, 96, 'light slows down', { size: 18, colour: s.C.ink }) + T(540, 120, 'in glass', { size: 18, colour: s.C.ink }), { enter: 'fade', delay: 900 });
    },
    'bend': function (s) {
      ray(s, [[150, 40], [250, 140]], { delay: 100 });
      s.add('<path d="M250 140 L340 230" stroke="#9AA0B4" stroke-width="3" stroke-dasharray="6 7"/>', { enter: 'fade', delay: 1000 });
      s.add(T(348, 240, 'if it went straight', { size: 14, colour: '#9AA0B4', anchor: 'start' }), { enter: 'fade', delay: 1100 });
      ray(s, [[250, 140], [314, 260]], { delay: 1000, ms: 700 });
      ray(s, [[314, 260], [394, 340]], { delay: 1700, ms: 700 });
    },
    'normals': function (s) {
      s.add('<path d="M250 80 V200" stroke="#2D1B69" stroke-width="3" stroke-dasharray="8 6"/>', { enter: 'down' });
      s.add('<path d="M314 200 V330" stroke="#2D1B69" stroke-width="3" stroke-dasharray="8 6"/>', { enter: 'down', delay: 200 });
      s.add(T(250, 66, 'normal', { size: 16, weight: 700, colour: s.C.deep }), { enter: 'fade', delay: 400 });
      s.add('<rect x="-102" y="-30" width="204" height="60" rx="14" fill="#FFFFFF" stroke="#22A06B" stroke-width="3"/>' + T(0, -10, 'into glass: bends', { size: 17, colour: s.C.green }) + T(0, 12, 'towards the normal', { size: 17, weight: 700, colour: s.C.green }),
        { x: 110, y: 310, enter: 'pop', delay: 800 });
      s.add('<rect x="-102" y="-30" width="204" height="60" rx="14" fill="#FFFFFF" stroke="#FF5D8F" stroke-width="3"/>' + T(0, -10, 'out into air: bends', { size: 17, colour: s.C.pink }) + T(0, 12, 'away from the normal', { size: 17, weight: 700, colour: s.C.pink }),
        { x: 520, y: 310, enter: 'pop', delay: 1800 });
    },
    'straw': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'The bent straw', { size: 28, weight: 700, colour: s.C.deep });
      s.add('<rect x="230" y="160" width="190" height="168" fill="#CFE8FF" opacity=".8"/><path d="M230 160 H420" stroke="#2F80ED" stroke-width="3"/>', { enter: 'fade' });
      // real straw: straight from (400, 70) to (262, 310); it meets the water surface at (342, 160)
      s.add('<path d="M342 160 L262 310" stroke="#E5484D" stroke-width="10" stroke-linecap="round" opacity=".25" stroke-dasharray="10 8"/>', { enter: 'fade', delay: 2600 });
      s.add('<path d="M400 70 L342 160" stroke="#E5484D" stroke-width="10" stroke-linecap="round"/><path d="M342 160 L262 270" stroke="#E5484D" stroke-width="10" stroke-linecap="round"/>', { enter: 'fade', delay: 300 });
      s.add('<path d="M220 60 V330 Q220 340 230 340 H420 Q430 340 430 330 V60" fill="none" stroke="#55526E" stroke-width="4"/>', { enter: 'fade' });
      s.add(T(110, 230, 'what you see', { size: 18, weight: 700, colour: s.C.red }) + '<path d="M162 236 L262 264" stroke="#E5484D" stroke-width="2"/>', { enter: 'fade', delay: 1200 });
      s.add(T(530, 300, 'where it', { size: 16, colour: s.C.muted }) + T(530, 320, 'really is', { size: 16, colour: s.C.muted }) + '<path d="M484 306 L300 296" stroke="#9AA0B4" stroke-width="2"/>', { enter: 'fade', delay: 2800 });
      s.add(T(530, 160, 'water surface', { size: 16, colour: s.C.blue }), { enter: 'fade', delay: 1800 });
      s.owl(100, 150, 90, { delay: 600 });
    },

    /* ---------- 5. Colour ---------- */
    'prism': function (s) {
      s.text(320, 30, 'White light is a mix of colours', { size: 26, weight: 700, colour: s.C.deep });
      s.add('<path d="M320 80 L425 280 H215 Z" fill="#E7F3FF" fill-opacity=".85" stroke="#2F80ED" stroke-width="4" stroke-linejoin="round"/>', { enter: 'pop', name: 'prism' });
      s.add('<path d="M40 236 L264 196" stroke="#9AA0B4" stroke-width="14" stroke-linecap="round"/>', { enter: 'fade', delay: 300 });
      ray(s, [[40, 236], [264, 196]], { colour: '#FFFFFF', width: 8, delay: 400, arrows: false });
      s.add(head(150, 216.4, Math.atan2(-40, 224), '#9AA0B4', 1.6), { enter: 'fade', delay: 900 });
      s.add(T(130, 196, 'white light', { size: 20, weight: 700, colour: s.C.muted }), { enter: 'fade', delay: 800 });
      s.add('<path d="M264 196 L366 168 L378 196 Z" fill="#FFF3B0" opacity=".9"/>', { enter: 'fade', delay: 1300 });
      SPECTRUM.forEach(function (c, k) {
        var ex = 366 + k * 2, ey = 168 + k * 4.6;
        ray(s, [[ex, ey], [560, 214 + k * 18]], { colour: c, width: 6, arrows: false, delay: 1500 + k * 120, ms: 700 });
      });
      ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].forEach(function (n, k) {
        s.add(T(570, 214 + k * 18, n, { size: 14, weight: 700, colour: SPECTRUM[k], anchor: 'start' }), { enter: 'fade', delay: 2400 + k * 100 });
      });
    },
    'prism-bend': function (s) {
      s.add('<rect x="-90" y="-22" width="180" height="44" rx="22" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="3"/>' + T(0, 1, 'dispersion', { size: 24, weight: 700, colour: s.C.fun }), { x: 120, y: 90, enter: 'pop' });
      s.add(T(140, 290, 'red bends least', { size: 18, weight: 700, colour: SPECTRUM[0] }), { enter: 'fade', delay: 800 });
      s.add(T(140, 318, 'violet bends most', { size: 18, weight: 700, colour: SPECTRUM[6] }), { enter: 'fade', delay: 1400 });
    },
    'apple': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'Why a red apple looks red', { size: 26, weight: 700, colour: s.C.deep });
      s.add(sun(26), { x: 70, y: 110, enter: 'pop' });
      s.add(apple('#E5484D'), { x: 300, y: 250, enter: 'pop', delay: 200, name: 'apple' });
      ray(s, [[100, 124], [262, 228]], { colour: '#E5484D', width: 5, delay: 600 });
      ray(s, [[96, 136], [258, 240]], { colour: '#22A06B', width: 5, delay: 750 });
      ray(s, [[92, 148], [254, 252]], { colour: '#2F80ED', width: 5, delay: 900 });
      s.add(T(110, 230, 'white light in', { size: 18, weight: 700, colour: s.C.muted }), { enter: 'fade', delay: 1300 });
      s.owl(560, 340, 110, { delay: 300 });
      ray(s, [[336, 222], [538, 268]], { colour: '#E5484D', width: 6, delay: 1800 });
      s.add(T(440, 205, 'red reflected', { size: 18, weight: 700, colour: s.C.red }), { enter: 'fade', delay: 2200 });
      s.add(T(300, 330, 'green and blue absorbed', { size: 18, weight: 700, colour: s.C.muted }), { enter: 'fade', delay: 2700 });
    },
    'white-black': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M320 50 V340" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { enter: 'fade' });
      var shirt = function (fill, stroke) { return '<path d="M-30 -50 L-60 -36 L-76 -6 L-52 4 L-46 -10 V50 H46 V-10 L52 4 L76 -6 L60 -36 L30 -50 Q0 -34 -30 -50 Z" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3" stroke-linejoin="round"/>'; };
      s.text(160, 40, 'White', { size: 28, weight: 700, colour: s.C.muted });
      s.add(shirt('#FFFFFF', '#55526E'), { x: 160, y: 260, enter: 'pop' });
      s.text(480, 40, 'Black', { size: 28, weight: 700, colour: s.C.ink, delay: 1400 });
      s.add(shirt('#1E1B3A', '#1E1B3A'), { x: 480, y: 260, enter: 'pop', delay: 1400 });
      ['#E5484D', '#22A06B', '#2F80ED'].forEach(function (c, k) {
        ray(s, [[60 + k * 14, 80], [130 + k * 14, 214]], { colour: c, width: 5, delay: 300 + k * 120, ms: 600 });
        ray(s, [[150 + k * 14, 214], [230 + k * 14, 80]], { colour: c, width: 5, delay: 1000 + k * 120, ms: 600 });
        ray(s, [[380 + k * 14, 80], [450 + k * 14, 214]], { colour: c, width: 5, delay: 1700 + k * 120, ms: 600 });
      });
      s.text(160, 340, 'reflects all colours', { size: 18, weight: 700, colour: s.C.muted, delay: 1300 });
      s.text(480, 340, 'absorbs all colours', { size: 18, weight: 700, colour: s.C.ink, delay: 2600 });
    },
    'filter': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'A red filter', { size: 28, weight: 700, colour: s.C.deep });
      s.add(TORCH, { x: 90, y: 180, enter: 'pop' });
      ['#E5484D', '#22A06B', '#2F80ED'].forEach(function (c, k) {
        ray(s, [[114, 166 + k * 14], [300, 166 + k * 14]], { colour: c, width: 6, delay: 300 + k * 100, ms: 700 });
      });
      s.add('<rect x="300" y="110" width="22" height="140" rx="4" fill="#E5484D" fill-opacity=".8" stroke="#B42318" stroke-width="3"/>', { enter: 'pop', delay: 100 });
      ray(s, [[324, 166], [580, 166]], { colour: '#E5484D', width: 6, delay: 1300 });
      s.add(T(200, 230, 'white light', { size: 18, weight: 700, colour: s.C.muted }), { enter: 'fade', delay: 900 });
      s.add(T(450, 140, 'only red gets through', { size: 18, weight: 700, colour: s.C.red }), { enter: 'fade', delay: 1900 });
      s.add(T(311, 290, 'green and blue', { size: 18, colour: s.C.muted }) + T(311, 314, 'absorbed by the filter', { size: 18, colour: s.C.muted }), { enter: 'fade', delay: 2400 });
    },
    'apple-blue': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'A red apple in blue light', { size: 26, weight: 700, colour: s.C.deep });
      s.add('<rect x="0" y="0" width="640" height="360" fill="#1B2A6B" opacity=".18"/>', { enter: 'fade' });
      s.add(TORCH, { x: 90, y: 110, enter: 'pop' });
      s.add('<rect x="-6" y="-26" width="10" height="52" rx="3" fill="#2F80ED" stroke="#1E1B3A" stroke-width="2"/>', { x: 126, y: 110, enter: 'pop' });
      var red = s.add(apple('#E5484D'), { x: 320, y: 240, enter: 'pop', delay: 200 });
      ray(s, [[134, 116], [282, 214]], { colour: '#2F80ED', width: 6, delay: 700 });
      s.add(apple('#2A1E2E'), { x: 320, y: 240, enter: 'fade', delay: 1600, ms: 900 });
      s.hide(red, { delay: 2600, ms: 1 });
      s.add(T(470, 220, 'blue absorbed', { size: 18, weight: 700, colour: s.C.blue }) + T(470, 250, 'no red to reflect', { size: 18, weight: 700, colour: s.C.red }), { enter: 'fade', delay: 2200 });
      s.add('<rect x="-90" y="-22" width="180" height="44" rx="22" fill="#FFFFFF" stroke="#1E1B3A" stroke-width="3"/>' + T(0, 1, 'looks black', { size: 24, weight: 700, colour: s.C.ink }), { x: 320, y: 330, enter: 'pop', delay: 2900 });
    }
  });

  function svgToFront(g) { if (g && g.parentNode) g.parentNode.appendChild(g); }
})();
