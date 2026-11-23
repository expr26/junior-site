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
    return '<path d="M' + (-10 * k) + ' ' + (-8 * k) + ' L' + (9 * k) + ' 0 L' + (-10 * k) + ' ' + (8 * k) + ' Z" fill="' + col + '" stroke="' + col + '" stroke-width="2" stroke-linejoin="round" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (ang * 180 / Math.PI).toFixed(1) + ')"/>';
  }
  /* ray(s, [[x, y], ...], {colour, width, delay, ms, arrows, name, opacity, glow}): a light ray with a soft glow that draws itself along the points,
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
    var line = function (sw, op) {
      return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + sw + '" stroke-linecap="round" stroke-linejoin="round" opacity="' + op +
        '" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>';
    };
    var g = s.add((o.glow === false ? '' : line(w * 2.8, 0.2 * (o.opacity || 1))) + line(w, o.opacity || 1), { enter: 'none', name: o.name, flat: true });
    var ms = o.ms || 900;
    g.querySelectorAll('path').forEach(function (p) {
      if (p.animate && !s.fast) p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: ms, delay: o.delay || 0, fill: 'both', easing: 'linear' });
      else p.setAttribute('stroke-dashoffset', '0');
    });
    if (heads) s.add(heads, { enter: 'fade', delay: (o.delay || 0) + ms * 0.5, ms: 200, name: o.name ? o.name + '-h' : undefined, flat: true });
    return g;
  }

  /* ---- drawings: soft gradients, a light highlight, thin darker outlines (gradient ids start with lgt) ---- */
  var GLOW = '<radialGradient id="lgtGlow"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset=".55" stop-color="#FFE58A" stop-opacity=".45"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></radialGradient>';
  var METAL = '<linearGradient id="lgtMetal" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8C91A8"/><stop offset=".4" stop-color="#E4E7EF"/><stop offset=".7" stop-color="#A7ADC0"/><stop offset="1" stop-color="#6E7389"/></linearGradient>';
  var WOOD = '<linearGradient id="lgtWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0A86A"/><stop offset="1" stop-color="#B8773A"/></linearGradient>';
  function sun(r) {
    var rays = '';
    for (var k = 0; k < 12; k++) {
      var a = k * Math.PI / 6, r1 = r + (k % 2 ? 18 : 24);
      rays += '<path d="M' + (Math.cos(a) * (r + 8)).toFixed(1) + ' ' + (Math.sin(a) * (r + 8)).toFixed(1) + ' L' + (Math.cos(a) * r1).toFixed(1) + ' ' + (Math.sin(a) * r1).toFixed(1) + '"/>';
    }
    return '<defs>' + GLOW + '<radialGradient id="lgtSun" cx=".38" cy=".35" r=".7"><stop offset="0" stop-color="#FFF6C9"/><stop offset=".5" stop-color="#FFD54A"/><stop offset="1" stop-color="#F7A21B"/></radialGradient></defs>' +
      '<circle r="' + (r + 30) + '" fill="url(#lgtGlow)"/>' +
      '<g stroke="#FFB300" stroke-width="5.5" stroke-linecap="round">' + rays + '</g>' +
      '<circle r="' + r + '" fill="url(#lgtSun)" stroke="rgba(194,87,12,.45)" stroke-width="2.5"/>' +
      '<ellipse cx="' + (-r * .36) + '" cy="' + (-r * .4) + '" rx="' + (r * .3) + '" ry="' + (r * .17) + '" fill="#FFFFFF" opacity=".55" transform="rotate(-35 ' + (-r * .36) + ' ' + (-r * .4) + ')"/>';
  }
  var BULB = '<defs>' + GLOW + METAL + '<radialGradient id="lgtBulb" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFDF0"/><stop offset=".55" stop-color="#FFE680"/><stop offset="1" stop-color="#FFC93C"/></radialGradient></defs>' +
    '<circle r="52" fill="url(#lgtGlow)"/>' +
    '<path d="M-13 25 Q-30 12 -30 -4 A30 30 0 1 1 30 -4 Q30 12 13 25 Z" fill="url(#lgtBulb)" stroke="rgba(194,87,12,.5)" stroke-width="2"/>' +
    '<path d="M-5 25 L-8 6 M5 25 L8 6" stroke="#B9AE96" stroke-width="1.5"/><path d="M-8 6 q4 -10 8 0 q4 -10 8 0" fill="none" stroke="#E8590C" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M-20 -14 A20 20 0 0 1 -6 -25" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".75"/>' +
    '<rect x="-14" y="24" width="28" height="24" rx="4" fill="url(#lgtMetal)" stroke="rgba(30,27,58,.45)" stroke-width="1.5"/><path d="M-14 31 H14 M-14 38 H14" stroke="rgba(30,27,58,.3)" stroke-width="2"/>' +
    '<path d="M-7 48 H7 L4 53 H-4 Z" fill="#55526E"/>';
  var CANDLE = '<defs>' + GLOW + METAL + '<radialGradient id="lgtFlame" cx=".5" cy=".7" r=".7"><stop offset="0" stop-color="#FFFBE0"/><stop offset=".45" stop-color="#FFD43B"/><stop offset="1" stop-color="#FF8A3D"/></radialGradient>' +
    '<linearGradient id="lgtWax" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF9DBB"/><stop offset=".55" stop-color="#FF6B98"/><stop offset="1" stop-color="#DE4A78"/></linearGradient></defs>' +
    '<circle cy="-60" r="38" fill="url(#lgtGlow)"/><path d="M0 -82 Q15 -58 0 -42 Q-15 -58 0 -82 Z" fill="url(#lgtFlame)"/>' +
    '<path d="M0 -42 V-34" stroke="#3A3350" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M-30 46 H30 Q28 57 0 57 Q-28 57 -30 46 Z" fill="url(#lgtMetal)" stroke="rgba(30,27,58,.35)" stroke-width="1.5"/>' +
    '<rect x="-18" y="-34" width="36" height="84" rx="7" fill="url(#lgtWax)" stroke="rgba(150,30,70,.4)" stroke-width="2"/>' +
    '<ellipse cy="-32" rx="15" ry="3.5" fill="#FFC2D3"/><path d="M7 -32 V-18 a3.5 3.5 0 0 0 7 0 V-32 Z" fill="#FFC2D3"/>' +
    '<rect x="-13" y="-24" width="5" height="64" rx="2.5" fill="#FFFFFF" opacity=".35"/>';
  var MOON = '<defs><radialGradient id="lgtMoon" cx=".38" cy=".35" r=".75"><stop offset="0" stop-color="#F6F7FB"/><stop offset=".6" stop-color="#D7DBE6"/><stop offset="1" stop-color="#A9AFC2"/></radialGradient></defs>' +
    '<circle r="36" fill="url(#lgtMoon)" stroke="rgba(85,82,110,.45)" stroke-width="2"/>' +
    '<g fill="#BCC2D2" stroke="rgba(85,82,110,.3)" stroke-width="1"><circle cx="-12" cy="-8" r="7"/><circle cx="12" cy="10" r="9"/><circle cx="10" cy="-16" r="4"/><circle cx="-14" cy="16" r="3.5"/></g>' +
    '<ellipse cx="-14" cy="-20" rx="9" ry="5" fill="#FFFFFF" opacity=".5" transform="rotate(-30 -14 -20)"/>';
  var TORCH = '<defs>' + METAL + '<linearGradient id="lgtTorch" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6FB0FF"/><stop offset=".55" stop-color="#2F80ED"/><stop offset="1" stop-color="#1D5FC0"/></linearGradient>' +
    '<linearGradient id="lgtTorchHead" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4E7EF"/><stop offset=".5" stop-color="#A7ADC0"/><stop offset="1" stop-color="#7A8098"/></linearGradient></defs>' +
    '<rect x="-38" y="-19" width="14" height="8" rx="3" fill="#FFC93C" stroke="rgba(194,87,12,.55)" stroke-width="1.5"/>' +
    '<rect x="-60" y="-14" width="60" height="28" rx="9" fill="url(#lgtTorch)" stroke="rgba(30,27,58,.5)" stroke-width="2"/>' +
    '<path d="M-52 -13 V13 M-47 -13 V13" stroke="rgba(30,27,58,.18)" stroke-width="2"/><rect x="-55" y="-10" width="50" height="5" rx="2.5" fill="#FFFFFF" opacity=".35"/>' +
    '<path d="M-2 -14 L17 -24 Q20 -25 20 -22 V22 Q20 25 17 24 L-2 14 Z" fill="url(#lgtTorchHead)" stroke="rgba(30,27,58,.5)" stroke-width="2" stroke-linejoin="round"/>' +
    '<rect x="16" y="-21" width="5" height="42" rx="2.5" fill="#FFF3B0"/>';
  function apple(fill) {
    var body = 'M0 -30 C-34 -48 -56 -12 -44 14 C-34 38 -14 44 0 36 C14 44 34 38 44 14 C56 -12 34 -48 0 -30 Z';
    return '<defs><radialGradient id="lgtAppleSh" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".45"/><stop offset=".45" stop-color="#FFFFFF" stop-opacity="0"/><stop offset="1" stop-color="#000000" stop-opacity=".25"/></radialGradient>' +
      '<linearGradient id="lgtLeaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5CD18F"/><stop offset="1" stop-color="#178A55"/></linearGradient></defs>' +
      '<path d="' + body + '" fill="' + fill + '"/><path d="' + body + '" fill="url(#lgtAppleSh)" stroke="rgba(30,27,58,.45)" stroke-width="2"/>' +
      '<ellipse cx="-24" cy="-14" rx="6" ry="11" fill="#FFFFFF" opacity=".4" transform="rotate(25 -24 -14)"/>' +
      '<path d="M0 -30 Q2 -44 8 -52" stroke="#8A5A2B" stroke-width="5" fill="none" stroke-linecap="round"/><path d="M6 -46 Q24 -58 34 -44 Q18 -38 6 -46 Z" fill="url(#lgtLeaf)"/><path d="M8 -46 Q20 -48 30 -45" stroke="#C7F0D6" stroke-width="1.2" fill="none"/>';
  }
  var EARTH = '<defs><radialGradient id="lgtEarth" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#7DB8FF"/><stop offset=".6" stop-color="#2F80ED"/><stop offset="1" stop-color="#1B5BB5"/></radialGradient></defs>' +
    '<circle r="36" fill="url(#lgtEarth)" stroke="rgba(30,27,58,.35)" stroke-width="2"/>' +
    '<path d="M-24 -14 q8 -12 22 -8 q8 2 6 10 q-10 4 -14 12 q-8 2 -12 -4 Z M8 8 q12 -6 20 2 q2 10 -8 16 q-10 2 -12 -6 Z M10 -26 q8 -4 14 2 q-4 4 -12 2 Z" fill="#3CB878" stroke="rgba(15,100,60,.35)" stroke-width="1"/>' +
    '<ellipse cx="-14" cy="-20" rx="10" ry="5" fill="#FFFFFF" opacity=".35" transform="rotate(-30 -14 -20)"/>';
  function pane(kind) {   // a thin sheet 14 wide, 70 tall, top-left at (0, 0)
    var f = { glass: ['lgtPaneG', '#EEF7FF', '#B9DAFF', 'rgba(47,128,237,.75)'], paper: ['lgtPaneP', '#FFFDF6', '#E6DECB', 'rgba(140,120,80,.55)'], wood: ['lgtPaneW', '#E0A86A', '#A86A30', 'rgba(110,60,20,.55)'] }[kind];
    return '<defs><linearGradient id="' + f[0] + '" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="' + f[1] + '"/><stop offset="1" stop-color="' + f[2] + '"/></linearGradient></defs>' +
      '<rect width="14" height="70" rx="4" fill="url(#' + f[0] + ')" stroke="' + f[3] + '" stroke-width="2"/>' +
      (kind === 'wood' ? '<path d="M5 8 V30 M9 38 V62" stroke="#8A5A2B" stroke-width="1.2" opacity=".5" stroke-linecap="round"/>' : '<rect x="3" y="5" width="3" height="60" rx="1.5" fill="#FFFFFF" opacity=".7"/>');
  }
  var BEAM = '<defs><linearGradient id="lgtBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFF0A0" stop-opacity=".95"/><stop offset="1" stop-color="#FFF3B0" stop-opacity=".6"/></linearGradient></defs>';
  function shirt(dark) {
    var d = 'M-30 -50 L-60 -36 L-76 -6 L-52 4 L-46 -10 V50 H46 V-10 L52 4 L76 -6 L60 -36 L30 -50 Q0 -34 -30 -50 Z', id = dark ? 'lgtShirtB' : 'lgtShirtW';
    var c = dark ? ['#45406A', '#1E1B3A'] : ['#FFFFFF', '#E3E6F0'];
    return '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + c[0] + '"/><stop offset="1" stop-color="' + c[1] + '"/></linearGradient></defs>' +
      '<path d="' + d + '" fill="url(#' + id + ')" stroke="' + (dark ? 'rgba(10,8,30,.6)' : 'rgba(85,82,110,.55)') + '" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M-30 -50 Q0 -28 30 -50" fill="none" stroke="' + (dark ? '#5A5480' : '#C9CED8') + '" stroke-width="3"/>' +
      '<path d="M-46 -8 V46 M46 -8 V46" stroke="' + (dark ? '#5A5480' : '#D5D9E3') + '" stroke-width="1.5" opacity=".7"/>' +
      '<path d="M-62 -30 L-70 -10" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity="' + (dark ? '.18' : '.9') + '"/>';
  }
  function arc(cx, cy, r, a0, a1, col) {   // arc from angle a0 to a1 (degrees)
    var p = function (a) { return (cx + r * Math.cos(a * Math.PI / 180)).toFixed(1) + ' ' + (cy + r * Math.sin(a * Math.PI / 180)).toFixed(1); };
    return '<path d="M' + p(a0) + ' A' + r + ' ' + r + ' 0 0 ' + (a1 > a0 ? 1 : 0) + ' ' + p(a1) + '" fill="none" stroke="' + col + '" stroke-width="4" stroke-linecap="round"/>';
  }
  function pill(w, col, inner) { return '<rect x="' + (-w / 2) + '" y="-21" width="' + w + '" height="42" rx="21" fill="#FFFFFF" stroke="' + col + '" stroke-width="3"/>' + inner; }
  var SPECTRUM = ['#E5484D', '#FF8A3D', '#FFC93C', '#22A06B', '#2F80ED', '#4B3FB5', '#8E44DD'];
  var MIRROR = '<linearGradient id="lgtMirror" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4FAFF"/><stop offset="1" stop-color="#A9D0FA"/></linearGradient>';

  /* shadow geometry: lamp at (LX, LY), ball radius BR, screen at SX */
  var LX = 70, LY = 180, BR = 32, SX = 548;
  function shadowAt(s, bx, o) {
    var d = bx - LX, t = Math.tan(Math.asin(BR / d)), h = t * (SX - LX);
    var top = LY - h, bot = LY + h;
    s.add('<defs><linearGradient id="lgtShade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#2D1B69" stop-opacity=".3"/><stop offset="1" stop-color="#2D1B69" stop-opacity=".18"/></linearGradient></defs>' +
      '<path d="M' + bx + ' ' + (LY - BR) + ' L' + SX + ' ' + top.toFixed(1) + ' V' + bot.toFixed(1) + ' L' + bx + ' ' + (LY + BR) + ' Z" fill="url(#lgtShade)"/>' +
      '<rect x="' + (SX - 3) + '" y="' + top.toFixed(1) + '" width="7" height="' + (bot - top).toFixed(1) + '" rx="2" fill="#2D2A4A"/>', Object.assign({ enter: 'fade', flat: true }, o));
    ray(s, [[LX, LY], [SX, top - 2]], { width: 3, delay: o.delay - 600, ms: 600, arrows: false, name: o.name + 'r1' });
    ray(s, [[LX, LY], [SX, bot + 2]], { width: 3, delay: o.delay - 600, ms: 600, arrows: false, name: o.name + 'r2' });
  }
  var BALL = '<defs><radialGradient id="lgtBall" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#9CC8FF"/><stop offset=".55" stop-color="#2F80ED"/><stop offset="1" stop-color="#1B5BB5"/></radialGradient></defs>' +
    '<circle r="' + BR + '" fill="url(#lgtBall)" stroke="rgba(30,27,58,.45)" stroke-width="2"/><ellipse cx="-11" cy="-13" rx="9" ry="5.5" fill="#FFFFFF" opacity=".55" transform="rotate(-35 -11 -13)"/>';

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
      s.add(BEAM + '<path d="M130 166 L600 110 V270 L130 214 Z" fill="url(#lgtBeam)" opacity=".6"/>', { enter: 'fade', delay: 300, flat: true });
      s.add(TORCH, { x: 110, y: 190, enter: 'pop' });
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
      s.add(EARTH, { x: 560, y: 240, enter: 'pop', delay: 1100 });
      s.add('<path d="M120 240 H516" stroke="#B9BED0" stroke-width="3" stroke-dasharray="2 10" stroke-linecap="round"/>', { enter: 'fade', delay: 1300, flat: true });
      var dot = s.add('<circle r="15" fill="#FFE58A" opacity=".5"/><circle r="8" fill="#FFC93C" stroke="rgba(194,87,12,.5)" stroke-width="2"/><circle cx="-2.5" cy="-2.5" r="2.5" fill="#FFFFFF" opacity=".8"/>',
        { x: 120, y: 240, enter: 'fade', delay: 1500, ms: 100, flat: true });
      s.move(dot, 516, 240, 1200, { delay: 1600, easing: 'linear' });
      s.text(320, 300, 'Sun to Earth: about 8 minutes', { size: 24, weight: 700, colour: '#C2570C', delay: 2600 });
    },
    'seeing': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 32, 'How we see things', { size: 28, weight: 700, colour: s.C.deep });
      s.add(BULB, { x: 90, y: 110, enter: 'pop' });
      s.add('<defs>' + WOOD + '</defs><rect x="-136" y="10" width="13" height="74" rx="3" fill="#9A6532"/><rect x="123" y="10" width="13" height="74" rx="3" fill="#9A6532"/>' +
        '<rect x="-150" y="0" width="300" height="15" rx="5" fill="url(#lgtWood)" stroke="rgba(110,60,20,.45)" stroke-width="1.5"/><path d="M-136 5 H-30 M20 9 H130" stroke="#F4CF9E" stroke-width="2" stroke-linecap="round" opacity=".7"/>',
        { x: 290, y: 270, enter: 'up', delay: 200 });
      s.add('<defs><linearGradient id="lgtBook" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A7E"/><stop offset="1" stop-color="#D93A40"/></linearGradient></defs>' +
        '<rect x="-50" y="-26" width="100" height="26" rx="4" fill="url(#lgtBook)" stroke="rgba(120,20,30,.45)" stroke-width="1.5"/>' +
        '<rect x="-44" y="-18" width="92" height="11" rx="2" fill="#FFF8EC"/><path d="M-42 -14.5 H46 M-42 -10.5 H46" stroke="#E9DFCB" stroke-width="1"/><rect x="-46" y="-24" width="70" height="3" rx="1.5" fill="#FFFFFF" opacity=".4"/>',
        { x: 290, y: 270, enter: 'down', delay: 400 });
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
      s.add(BEAM + '<path d="M110 92 L250 84 V126 L110 118 Z" fill="url(#lgtBeam)"/><path d="M264 84 L410 76 V134 L264 126 Z" fill="url(#lgtBeam)"/>', { enter: 'left', delay: 300, flat: true });
      s.add(TORCH, { x: 90, y: 105, enter: 'pop' });
      s.add(pane('glass'), { x: 250, y: 70, enter: 'pop', delay: 100 });
      s.add(T(430, 92, 'Transparent', { size: 24, weight: 700, colour: s.C.blue, anchor: 'start' }) + T(430, 120, 'clear glass', { size: 18, colour: '#55526E', anchor: 'start' }), { enter: 'fade', delay: 800 });
    },
    'translucent': function (s) {
      s.add(BEAM + '<path d="M110 182 L250 174 V216 L110 208 Z" fill="url(#lgtBeam)"/><path d="M264 174 L410 150 V240 L264 216 Z" fill="url(#lgtBeam)" opacity=".45"/>' +
        '<path d="M264 186 l40 -14 M264 196 l44 2 M264 206 l40 16" stroke="#FFC93C" stroke-width="3" stroke-linecap="round" opacity=".8"/>', { enter: 'left', delay: 300, flat: true });
      s.add(TORCH, { x: 90, y: 195, enter: 'pop' });
      s.add(pane('paper'), { x: 250, y: 160, enter: 'pop', delay: 100 });
      s.add(T(430, 182, 'Translucent', { size: 24, weight: 700, colour: s.C.sci, anchor: 'start' }) + T(430, 210, 'tracing paper', { size: 18, colour: '#55526E', anchor: 'start' }), { enter: 'fade', delay: 800 });
    },
    'opaque': function (s) {
      s.add(BEAM + '<path d="M110 272 L250 264 V306 L110 298 Z" fill="url(#lgtBeam)"/>', { enter: 'left', delay: 300, flat: true });
      s.add(TORCH, { x: 90, y: 285, enter: 'pop' });
      s.add(pane('wood'), { x: 250, y: 250, enter: 'pop', delay: 100 });
      s.add(T(340, 285, 'no light', { size: 16, colour: '#9AA0B4' }), { enter: 'fade', delay: 900 });
      s.add(T(430, 272, 'Opaque', { size: 24, weight: 700, colour: '#8A5A2B', anchor: 'start' }) + T(430, 300, 'wood, metal, card', { size: 18, colour: '#55526E', anchor: 'start' }), { enter: 'fade', delay: 800 });
    },
    'shadow': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'Shadows', { size: 28, weight: 700, colour: s.C.deep });
      s.add('<defs>' + GLOW + '<radialGradient id="lgtLamp" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFDF0"/><stop offset=".6" stop-color="#FFE066"/><stop offset="1" stop-color="#FFB300"/></radialGradient></defs>' +
        '<circle r="40" fill="url(#lgtGlow)"/><circle r="18" fill="url(#lgtLamp)" stroke="rgba(194,87,12,.5)" stroke-width="2"/><circle cx="-6" cy="-6" r="4" fill="#FFFFFF" opacity=".8"/>', { x: LX, y: LY, enter: 'pop', flat: true });
      s.add('<defs><linearGradient id="lgtScreen" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E3E6F0"/></linearGradient></defs>' +
        '<rect x="' + (SX - 4) + '" y="24" width="16" height="312" rx="4" fill="url(#lgtScreen)" stroke="rgba(85,82,110,.5)" stroke-width="2"/>', { enter: 'fade', delay: 200 });
      s.add(T(600, 180, 'screen', { size: 16, colour: '#55526E' }), { enter: 'fade', delay: 300 });
      shadowAt(s, 290, { delay: 1600, name: 'sh1' });
      s.add(BALL, { x: 290, y: LY, enter: 'pop', delay: 400, name: 'ball' });
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
      for (var x = 130; x < 510; x += 16) hatch += '<path d="M' + x + ' 296 l-10 14" stroke="#9AA0B4" stroke-width="2" stroke-linecap="round"/>';
      s.add('<defs>' + MIRROR + '</defs>' + hatch + '<rect x="120" y="284" width="400" height="10" rx="4" fill="url(#lgtMirror)" stroke="rgba(47,128,237,.8)" stroke-width="2"/><rect x="126" y="286" width="388" height="2.5" rx="1.2" fill="#FFFFFF" opacity=".9"/>', { enter: 'up' });
      s.add(T(560, 290, 'mirror', { size: 18, colour: s.C.blue, anchor: 'start' }), { enter: 'fade', delay: 200 });
      ray(s, [[172, 114], [320, 288]], { delay: 500 });
      ray(s, [[320, 288], [468, 114]], { delay: 1400 });
      s.add(T(150, 94, 'ray in', { size: 18, weight: 700, colour: '#C2570C' }), { enter: 'fade', delay: 800 });
      s.add(T(490, 94, 'ray out', { size: 18, weight: 700, colour: '#C2570C' }), { enter: 'fade', delay: 1800 });
    },
    'normal': function (s) {
      s.add('<path d="M320 80 V284" stroke="#2D1B69" stroke-width="2.5" stroke-dasharray="9 7" stroke-linecap="round"/><path d="M320 270 h14 v14" fill="none" stroke="#2D1B69" stroke-width="2"/>', { enter: 'down', flat: true });
      s.add(T(320, 66, 'normal', { size: 20, weight: 700, colour: s.C.deep }), { enter: 'fade', delay: 400 });
    },
    'angle-i': function (s) {
      s.add(arc(320, 288, 70, -90, -130, s.C.pink), { enter: 'fade', flat: true });
      s.add(T(290, 192, '40°', { size: 20, weight: 700, colour: s.C.pink }), { enter: 'pop', delay: 300 });
      s.add(T(140, 230, 'angle of', { size: 18, colour: s.C.pink }) + T(140, 252, 'incidence', { size: 18, weight: 700, colour: s.C.pink }), { enter: 'fade', delay: 600 });
    },
    'angle-r': function (s) {
      s.add(arc(320, 288, 70, -90, -50, s.C.green), { enter: 'fade', flat: true });
      s.add(T(352, 192, '40°', { size: 20, weight: 700, colour: s.C.green }), { enter: 'pop', delay: 300 });
      s.add(T(500, 230, 'angle of', { size: 18, colour: s.C.green }) + T(500, 252, 'reflection', { size: 18, weight: 700, colour: s.C.green }), { enter: 'fade', delay: 600 });
      s.add('<rect x="-200" y="-20" width="400" height="40" rx="20" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="3"/>' + T(0, 1, 'angle of incidence = angle of reflection', { size: 19, weight: 700, colour: s.C.fun }),
        { x: 320, y: 334, enter: 'pop', delay: 1200 });
    },
    'scatter': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'Smooth or rough?', { size: 28, weight: 700, colour: s.C.deep });
      s.add('<path d="M320 60 V340" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { enter: 'fade', flat: true });
      s.add('<defs>' + MIRROR + '</defs><rect x="40" y="270" width="240" height="10" rx="4" fill="url(#lgtMirror)" stroke="rgba(47,128,237,.8)" stroke-width="2"/><rect x="46" y="272" width="228" height="2.5" rx="1.2" fill="#FFFFFF" opacity=".9"/>', { enter: 'up' });
      [0, 1, 2].forEach(function (k) {
        var hx = 120 + k * 40;
        ray(s, [[hx - 80, 110], [hx, 268]], { width: 4, delay: 300 + k * 200, ms: 600, arrows: true });
        ray(s, [[hx, 268], [hx + 80, 110]], { colour: '#FF8A3D', width: 4, delay: 900 + k * 200, ms: 600, arrows: true });
      });
      s.add(T(160, 312, 'smooth mirror', { size: 20, weight: 700, colour: s.C.blue }) + T(160, 338, 'neat reflection: an image', { size: 16, colour: '#55526E' }), { enter: 'fade', delay: 1600 });
      var bump = 'M360 274';
      for (var x = 360; x < 600; x += 20) bump += ' q5 -12 10 0 q5 10 10 0';
      s.add('<defs><linearGradient id="lgtRough" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFDF6"/><stop offset="1" stop-color="#E2D8C2"/></linearGradient></defs>' +
        '<path d="' + bump + ' V286 H360 Z" fill="url(#lgtRough)" stroke="rgba(140,120,80,.6)" stroke-width="2" stroke-linejoin="round"/>', { enter: 'up', delay: 1800 });
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
      s.add('<defs><linearGradient id="lgtBlock" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF7FF" stop-opacity=".95"/><stop offset="1" stop-color="#B5D6FB" stop-opacity=".85"/></linearGradient></defs>' +
        '<rect x="170" y="140" width="260" height="120" rx="6" fill="url(#lgtBlock)" stroke="rgba(47,128,237,.75)" stroke-width="2.5"/>' +
        '<rect x="176" y="146" width="248" height="4" rx="2" fill="#FFFFFF" opacity=".8"/><path d="M184 158 l26 26 M196 158 l40 40 M404 226 l14 14" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".7"/>', { enter: 'up' });
      s.add(T(90, 120, 'air', { size: 22, weight: 700, colour: s.C.muted }) + T(215, 240, 'glass', { size: 22, weight: 700, colour: s.C.blue }), { enter: 'fade', delay: 300 });
      s.add(T(540, 96, 'light slows down', { size: 18, colour: s.C.ink }) + T(540, 120, 'in glass', { size: 18, colour: s.C.ink }), { enter: 'fade', delay: 900 });
    },
    'bend': function (s) {
      ray(s, [[150, 40], [250, 140]], { delay: 100 });
      s.add('<path d="M250 140 L370 260" stroke="#9AA0B4" stroke-width="3" stroke-dasharray="6 7" stroke-linecap="round"/>', { enter: 'fade', delay: 1000, flat: true });
      s.add(T(380, 272, 'if it went straight', { size: 14, colour: '#8A90A8', anchor: 'start' }), { enter: 'fade', delay: 1100 });
      ray(s, [[250, 140], [314, 260]], { delay: 1000, ms: 700 });
      ray(s, [[314, 260], [394, 340]], { delay: 1700, ms: 700 });
    },
    'normals': function (s) {
      s.add('<path d="M250 80 V200" stroke="#2D1B69" stroke-width="2.5" stroke-dasharray="8 6" stroke-linecap="round"/>', { enter: 'down', flat: true });
      s.add('<path d="M314 200 V330" stroke="#2D1B69" stroke-width="2.5" stroke-dasharray="8 6" stroke-linecap="round"/>', { enter: 'down', delay: 200, flat: true });
      s.add(T(250, 66, 'normal', { size: 16, weight: 700, colour: s.C.deep }), { enter: 'fade', delay: 400 });
      s.add('<rect x="-102" y="-30" width="204" height="60" rx="14" fill="#FFFFFF" stroke="#22A06B" stroke-width="3"/>' + T(0, -10, 'into glass: bends', { size: 17, colour: s.C.green }) + T(0, 12, 'towards the normal', { size: 17, weight: 700, colour: s.C.green }),
        { x: 110, y: 310, enter: 'pop', delay: 800 });
      s.add('<rect x="-102" y="-30" width="204" height="60" rx="14" fill="#FFFFFF" stroke="#FF5D8F" stroke-width="3"/>' + T(0, -10, 'out into air: bends', { size: 17, colour: s.C.pink }) + T(0, 12, 'away from the normal', { size: 17, weight: 700, colour: s.C.pink }),
        { x: 520, y: 310, enter: 'pop', delay: 1800 });
    },
    'straw': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'The bent straw', { size: 28, weight: 700, colour: s.C.deep });
      s.add('<defs><linearGradient id="lgtWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE6FF"/><stop offset="1" stop-color="#94C4FA"/></linearGradient>' +
        '<linearGradient id="lgtJar" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".7"/><stop offset=".3" stop-color="#EEF5FF" stop-opacity=".3"/><stop offset="1" stop-color="#DCEAFB" stop-opacity=".5"/></linearGradient></defs>' +
        '<path d="M222 60 V330 Q222 338 230 338 H420 Q428 338 428 330 V60 Z" fill="url(#lgtJar)"/>' +
        '<path d="M224 160 H426 V330 Q426 336 420 336 H230 Q224 336 224 330 Z" fill="url(#lgtWater)" opacity=".9"/><path d="M224 160 H426" stroke="#2F80ED" stroke-width="2.5"/><path d="M228 164 H422" stroke="#FFFFFF" stroke-width="2" opacity=".7"/>', { enter: 'fade', flat: true });
      // real straw: straight from (400, 70) to (262, 310); it meets the water surface at (342, 160)
      s.add('<path d="M342 160 L262 310" stroke="#E5484D" stroke-width="10" stroke-linecap="round" opacity=".25" stroke-dasharray="10 8"/>', { enter: 'fade', delay: 2600, flat: true });
      s.add('<path d="M400 70 L342 160 M342 160 L262 270" stroke="#E5484D" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="M398 74 L344 158 M341 163 L265 268" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" opacity=".5" transform="translate(-2 -1)"/>', { enter: 'fade', delay: 300 });
      s.add('<path d="M220 60 V330 Q220 340 230 340 H420 Q430 340 430 330 V60" fill="none" stroke="#7A7F96" stroke-width="3.5" stroke-linecap="round"/>' +
        '<path d="M228 70 V320" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".8"/>', { enter: 'fade', flat: true });
      s.add(T(110, 230, 'what you see', { size: 18, weight: 700, colour: s.C.red }) + '<path d="M162 236 L262 264" stroke="#E5484D" stroke-width="2"/>', { enter: 'fade', delay: 1200, flat: true });
      s.add(T(530, 300, 'where it', { size: 16, colour: s.C.muted }) + T(530, 320, 'really is', { size: 16, colour: s.C.muted }) + '<path d="M484 306 L300 296" stroke="#9AA0B4" stroke-width="2"/>', { enter: 'fade', delay: 2800, flat: true });
      s.add(T(530, 160, 'water surface', { size: 16, colour: s.C.blue }), { enter: 'fade', delay: 1800 });
      s.owl(100, 150, 90, { delay: 600 });
    },

    /* ---------- 5. Colour ---------- */
    'prism': function (s) {
      s.text(320, 30, 'White light is a mix of colours', { size: 26, weight: 700, colour: s.C.deep });
      s.add('<defs><linearGradient id="lgtPrism" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6FBFF"/><stop offset="1" stop-color="#C5DEFA"/></linearGradient></defs>' +
        '<path d="M320 80 L425 280 H215 Z" fill="url(#lgtPrism)" fill-opacity=".9" stroke="rgba(47,128,237,.8)" stroke-width="3" stroke-linejoin="round"/>' +
        '<path d="M314 100 L236 266" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".8"/>', { enter: 'pop', name: 'prism' });
      s.add('<path d="M40 236 L264 196" stroke="#9AA0B4" stroke-width="14" stroke-linecap="round"/>', { enter: 'fade', delay: 300, flat: true });
      ray(s, [[40, 236], [264, 196]], { colour: '#FFFFFF', width: 8, delay: 400, arrows: false, glow: false });
      s.add(head(150, 216.4, Math.atan2(-40, 224), '#9AA0B4', 1.6), { enter: 'fade', delay: 900, flat: true });
      s.add(T(130, 196, 'white light', { size: 20, weight: 700, colour: s.C.muted }), { enter: 'fade', delay: 800 });
      s.add('<path d="M264 196 L366 168 L378 196 Z" fill="#FFF3B0" opacity=".9"/>', { enter: 'fade', delay: 1300, flat: true });
      SPECTRUM.forEach(function (c, k) {
        var ex = 366 + k * 2, ey = 168 + k * 4.6;
        ray(s, [[ex, ey], [560, 214 + k * 18]], { colour: c, width: 6, arrows: false, glow: false, delay: 1500 + k * 120, ms: 700 });
      });
      ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'].forEach(function (n, k) {
        s.add(T(570, 214 + k * 18, n, { size: 14, weight: 700, colour: SPECTRUM[k], anchor: 'start' }), { enter: 'fade', delay: 2400 + k * 100 });
      });
    },
    'prism-bend': function (s) {
      s.add(pill(180, '#6C4DF6', T(0, 1, 'dispersion', { size: 24, weight: 700, colour: s.C.fun })), { x: 120, y: 90, enter: 'pop' });
      s.add(T(140, 290, 'red bends least', { size: 18, weight: 700, colour: SPECTRUM[0] }), { enter: 'fade', delay: 800 });
      s.add(T(140, 318, 'violet bends most', { size: 18, weight: 700, colour: SPECTRUM[6] }), { enter: 'fade', delay: 1400 });
    },
    'apple': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'Why a red apple looks red', { size: 26, weight: 700, colour: s.C.deep });
      s.add(sun(26), { x: 70, y: 110, enter: 'pop' });
      s.add(apple('#E5484D'), { x: 300, y: 250, enter: 'pop', delay: 200, name: 'apple' });
      ray(s, [[100, 124], [262, 228]], { colour: '#E5484D', width: 5, delay: 600, glow: false });
      ray(s, [[96, 136], [258, 240]], { colour: '#22A06B', width: 5, delay: 750, glow: false });
      ray(s, [[92, 148], [254, 252]], { colour: '#2F80ED', width: 5, delay: 900, glow: false });
      s.add(T(110, 230, 'white light in', { size: 18, weight: 700, colour: s.C.muted }), { enter: 'fade', delay: 1300 });
      s.owl(560, 340, 110, { delay: 300 });
      ray(s, [[336, 222], [538, 268]], { colour: '#E5484D', width: 6, delay: 1800 });
      s.add(T(440, 205, 'red reflected', { size: 18, weight: 700, colour: s.C.red }), { enter: 'fade', delay: 2200 });
      s.add(T(300, 330, 'green and blue absorbed', { size: 18, weight: 700, colour: s.C.muted }), { enter: 'fade', delay: 2700 });
    },
    'white-black': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M320 50 V340" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { enter: 'fade', flat: true });
      s.text(160, 40, 'White', { size: 28, weight: 700, colour: s.C.muted });
      s.add(shirt(false), { x: 160, y: 260, enter: 'pop' });
      s.text(480, 40, 'Black', { size: 28, weight: 700, colour: s.C.ink, delay: 1400 });
      s.add(shirt(true), { x: 480, y: 260, enter: 'pop', delay: 1400 });
      ['#E5484D', '#22A06B', '#2F80ED'].forEach(function (c, k) {
        ray(s, [[60 + k * 14, 80], [130 + k * 14, 214]], { colour: c, width: 5, delay: 300 + k * 120, ms: 600, glow: false });
        ray(s, [[150 + k * 14, 214], [230 + k * 14, 80]], { colour: c, width: 5, delay: 1000 + k * 120, ms: 600, glow: false });
        ray(s, [[380 + k * 14, 80], [450 + k * 14, 214]], { colour: c, width: 5, delay: 1700 + k * 120, ms: 600, glow: false });
      });
      s.text(160, 340, 'reflects all colours', { size: 18, weight: 700, colour: s.C.muted, delay: 1300 });
      s.text(480, 340, 'absorbs all colours', { size: 18, weight: 700, colour: s.C.ink, delay: 2600 });
    },
    'filter': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'A red filter', { size: 28, weight: 700, colour: s.C.deep });
      s.add(TORCH, { x: 90, y: 180, enter: 'pop' });
      ['#E5484D', '#22A06B', '#2F80ED'].forEach(function (c, k) {
        ray(s, [[114, 166 + k * 14], [300, 166 + k * 14]], { colour: c, width: 6, delay: 300 + k * 100, ms: 700, glow: false });
      });
      s.add('<defs><linearGradient id="lgtRedF" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF8589"/><stop offset="1" stop-color="#D93A40"/></linearGradient></defs>' +
        '<rect x="300" y="110" width="22" height="140" rx="5" fill="url(#lgtRedF)" fill-opacity=".9" stroke="rgba(140,20,30,.5)" stroke-width="2"/><rect x="304" y="116" width="4" height="128" rx="2" fill="#FFFFFF" opacity=".5"/>', { enter: 'pop', delay: 100 });
      ray(s, [[324, 166], [580, 166]], { colour: '#E5484D', width: 6, delay: 1300 });
      s.add(T(200, 230, 'white light', { size: 18, weight: 700, colour: s.C.muted }), { enter: 'fade', delay: 900 });
      s.add(T(450, 140, 'only red gets through', { size: 18, weight: 700, colour: s.C.red }), { enter: 'fade', delay: 1900 });
      s.add(T(311, 290, 'green and blue', { size: 18, colour: s.C.muted }) + T(311, 314, 'absorbed by the filter', { size: 18, colour: s.C.muted }), { enter: 'fade', delay: 2400 });
    },
    'apple-blue': function (s) {
      s.clear(); s.ref = {};
      s.add('<defs><radialGradient id="lgtDim" cx=".3" cy=".3" r="1"><stop offset="0" stop-color="#2F4FA8" stop-opacity=".12"/><stop offset="1" stop-color="#1B2A6B" stop-opacity=".28"/></radialGradient></defs><rect x="0" y="0" width="640" height="360" fill="url(#lgtDim)"/>', { enter: 'fade', flat: true });
      s.text(320, 30, 'A red apple in blue light', { size: 26, weight: 700, colour: s.C.deep });
      s.add(TORCH, { x: 90, y: 110, enter: 'pop' });
      s.add('<defs><linearGradient id="lgtBlueF" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7DB8FF"/><stop offset="1" stop-color="#1D5FC0"/></linearGradient></defs>' +
        '<rect x="-6" y="-26" width="10" height="52" rx="4" fill="url(#lgtBlueF)" stroke="rgba(20,40,110,.55)" stroke-width="1.5"/><rect x="-4" y="-21" width="2.5" height="42" rx="1.2" fill="#FFFFFF" opacity=".55"/>', { x: 126, y: 110, enter: 'pop' });
      var red = s.add(apple('#E5484D'), { x: 320, y: 240, enter: 'pop', delay: 200 });
      ray(s, [[134, 116], [282, 214]], { colour: '#2F80ED', width: 6, delay: 700 });
      s.add(apple('#2A1E2E'), { x: 320, y: 240, enter: 'fade', delay: 1600, ms: 900 });
      s.hide(red, { delay: 2600, ms: 1 });
      s.add(T(470, 220, 'blue absorbed', { size: 18, weight: 700, colour: s.C.blue }) + T(470, 250, 'no red to reflect', { size: 18, weight: 700, colour: s.C.red }), { enter: 'fade', delay: 2200 });
      s.add(pill(180, '#1E1B3A', T(0, 1, 'looks black', { size: 24, weight: 700, colour: s.C.ink })), { x: 320, y: 330, enter: 'pop', delay: 2900 });
    }
  });

  function svgToFront(g) { if (g && g.parentNode) g.parentNode.appendChild(g); }
})();
