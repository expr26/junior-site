/* Pictures for the Speed and motion theory video (words: videos/physics/speed-and-motion.json). Stage is 640 x 360; see static/js/theory.js.
   Distances along a road are to scale inside each picture; the distance-time graph uses 10 units per second and 2 units per metre. */
(function () {
  if (!window.Theory) return;

  var F = 'Fredoka, Trebuchet MS, sans-serif';
  function T(x, y, t, size, fill, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (size || 18) + '" font-weight="' + (weight || 600) + '" fill="' + (fill || '#1E1B3A') +
      '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle">' + t + '</text>';
  }
  function car(col, tag) {   // 6..130 wide, roof at -1, wheels touch y = 67
    var body = 'M6 42 Q8 22 32 19 L50 4 Q58 -1 86 2 L106 19 Q128 22 130 42 V50 Q130 54 126 54 H10 Q6 54 6 50 Z';
    return '<defs><linearGradient id="spdCarSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>' +
      '<linearGradient id="spdGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF8FF"/><stop offset="1" stop-color="#B9DCF7"/></linearGradient></defs>' +
      '<path d="' + body + '" fill="' + col + '"/><path d="' + body + '" fill="url(#spdCarSh)" stroke="rgba(30,27,58,.55)" stroke-width="2"/>' +
      '<path d="M44 19 L56 8 H76 V19 Z M82 19 V8 H90 L101 19 Z" fill="url(#spdGlass)" stroke="rgba(30,27,58,.35)" stroke-width="1.5"/>' +
      '<path d="M60 11 L56 16 M86 11 L84 15" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".8"/>' +
      '<rect x="118" y="30" width="10" height="6" rx="3" fill="#FFE08A"/><rect x="8" y="30" width="8" height="6" rx="3" fill="#FF8A8A"/>' +
      '<circle cx="36" cy="54" r="13" fill="#2A2740"/><circle cx="36" cy="54" r="6" fill="#D5D9E3"/><circle cx="36" cy="54" r="2.5" fill="#9AA0B4"/>' +
      '<circle cx="104" cy="54" r="13" fill="#2A2740"/><circle cx="104" cy="54" r="6" fill="#D5D9E3"/><circle cx="104" cy="54" r="2.5" fill="#9AA0B4"/>' +
      (tag ? '<text x="68" y="34" font-family="' + F + '" font-size="16" font-weight="700" fill="#FFFFFF" stroke="rgba(30,27,58,.25)" stroke-width="3" paint-order="stroke" text-anchor="middle" dominant-baseline="middle">' + tag + '</text>' : '');
  }
  function road(y, h) {   // asphalt with kerbs and a dashed middle line
    h = h || 80;
    return '<defs><linearGradient id="spdRoad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6A6F84"/><stop offset="1" stop-color="#4C5063"/></linearGradient></defs>' +
      '<rect x="0" y="' + y + '" width="640" height="' + h + '" fill="url(#spdRoad)"/>' +
      '<rect x="0" y="' + y + '" width="640" height="4" fill="#9AA0B4"/><rect x="0" y="' + (y + h - 4) + '" width="640" height="4" fill="#3E4254"/>' +
      '<path d="M0 ' + (y + h / 2) + ' H640" stroke="#F4F1E8" stroke-width="4" stroke-dasharray="26 28" stroke-linecap="round"/>';
  }
  var SNAIL = '<defs><radialGradient id="spdShell" cx=".38" cy=".32" r=".75"><stop offset="0" stop-color="#FFB36E"/><stop offset="1" stop-color="#EE7426"/></radialGradient>' +
    '<linearGradient id="spdSnBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE48F"/><stop offset="1" stop-color="#F2B637"/></linearGradient></defs>' +
    '<path d="M48 -10 Q50 -18 55 -25 M42 -10 Q43 -18 45 -25" stroke="#D9A030" stroke-width="2.5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="55.5" cy="-27" r="3.6" fill="#fff" stroke="#D9A030" stroke-width="1.2"/><circle cx="45.5" cy="-27" r="3.6" fill="#fff" stroke="#D9A030" stroke-width="1.2"/>' +
    '<circle cx="56.3" cy="-26.6" r="1.8" fill="#1E1B3A"/><circle cx="46.3" cy="-26.6" r="1.8" fill="#1E1B3A"/>' +
    '<path d="M0 0 Q-6 -10 4 -12 L46 -12 Q57 -12 58 -2 Q58 0 56 0 Z" fill="url(#spdSnBody)" stroke="#C98A1E" stroke-width="1.5"/>' +
    '<path d="M50 -5 q2 2 4 0" stroke="#A8701A" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
    '<circle cx="24" cy="-24" r="18" fill="url(#spdShell)" stroke="#C9621A" stroke-width="2"/>' +
    '<path d="M24 -24 m-8 0 a8 8 0 1 0 8 -8 a12 12 0 0 0 -12 12" fill="none" stroke="#C9621A" stroke-width="2.5" stroke-linecap="round"/>' +
    '<ellipse cx="17" cy="-34" rx="5" ry="3" fill="#fff" opacity=".45" transform="rotate(-30 17 -34)"/>';
  function stopwatch() {
    var t = '';
    for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6; t += '<path d="M' + (Math.sin(a) * 29).toFixed(1) + ' ' + (-Math.cos(a) * 29).toFixed(1) + ' L' + (Math.sin(a) * 32).toFixed(1) + ' ' + (-Math.cos(a) * 32).toFixed(1) + '"/>'; }
    return '<defs><linearGradient id="spdSwRing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7C5CFF"/><stop offset="1" stop-color="#2D1B69"/></linearGradient>' +
      '<radialGradient id="spdSwFace" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9EAF4"/></radialGradient></defs>' +
      '<rect x="-9" y="-56" width="18" height="10" rx="4" fill="url(#spdSwRing)"/><rect x="-3.5" y="-47" width="7" height="8" fill="#3B2A8F"/>' +
      '<rect x="-4" y="-49" width="8" height="12" rx="3" fill="#3B2A8F" transform="rotate(45)"/>' +
      '<circle r="40" fill="url(#spdSwRing)"/><circle r="33" fill="url(#spdSwFace)"/>' +
      '<g stroke="#B7B3D6" stroke-width="2" stroke-linecap="round">' + t + '</g>' +
      '<path d="M-30 -18 A35 35 0 0 1 -12 -34" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".5"/>';
  }
  function flag(label) {   // pole foot at (0, 0)
    return '<defs><linearGradient id="spdFlag" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF7A7E"/><stop offset="1" stop-color="#D93A40"/></linearGradient></defs>' +
      '<rect x="-2.5" y="-64" width="5" height="64" rx="2.5" fill="#7A7F96"/><rect x="-1.5" y="-62" width="1.5" height="60" fill="#fff" opacity=".45"/>' +
      '<path d="M2.5 -62 Q14 -67 32 -56 Q16 -50 2.5 -45 Z" fill="url(#spdFlag)" stroke="#B42318" stroke-width="1" stroke-linejoin="round"/>' +
      '<circle cy="-66" r="4" fill="#FFC93C"/>' + T(0, -82, label, 17, '#55526E', 700);
  }
  function dim(x1, x2, y, label, col) {   // a measuring line with end ticks and a label in the middle
    col = col || '#55526E';
    return '<path d="M' + x1 + ' ' + (y - 8) + ' V' + (y + 8) + ' M' + x2 + ' ' + (y - 8) + ' V' + (y + 8) + ' M' + x1 + ' ' + y + ' H' + x2 + '" stroke="' + col + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="' + ((x1 + x2) / 2 - 38) + '" y="' + (y - 13) + '" width="76" height="26" rx="13" fill="#FFFDF7" stroke="' + col + '" stroke-opacity=".25" stroke-width="1.5"/>' + T((x1 + x2) / 2, y + 1, label, 18, col, 700);
  }
  function pill(text, col, w) {
    w = w || 300;
    return '<defs><linearGradient id="spdPill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0FCF6"/><stop offset="1" stop-color="#CFF2E2"/></linearGradient></defs>' +
      '<rect x="' + (-w / 2) + '" y="-28" width="' + w + '" height="56" rx="18" fill="url(#spdPill)" stroke="' + (col || '#22A06B') + '" stroke-width="3"/>' + T(0, 2, text, 28, '#0E7A5A', 700);
  }
  function wheel(x, r) {
    return '<circle cx="' + x + '" cy="0" r="' + r + '" fill="none" stroke="#2A2740" stroke-width="4.5"/><circle cx="' + x + '" cy="0" r="' + (r - 3.5) + '" fill="none" stroke="#C9CED8" stroke-width="1.5"/>' +
      '<path d="M' + (x - r + 4) + ' 0 H' + (x + r - 4) + ' M' + x + ' ' + (-r + 4) + ' V' + (r - 4) + '" stroke="#C9CED8" stroke-width="1.2"/><circle cx="' + x + '" cy="0" r="3" fill="#55526E"/>';
  }
  function BIKE() {   // rear wheel centre at (0, 0)
    return wheel(0, 16) + wheel(56, 16) +
      '<path d="M0 0 L22 -24 L48 -24 L56 0 M22 -24 L28 0 L0 0 M48 -24 L46 -34" fill="none" stroke="#E5484D" stroke-width="4.5" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="M43 -35 H54" stroke="#2A2740" stroke-width="4" stroke-linecap="round"/><path d="M16 -28 H28" stroke="#2A2740" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="28" cy="0" r="4" fill="#55526E"/>' +
      '<path d="M22 -30 L33 -12 L30 2" fill="none" stroke="#2D1B69" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<path d="M22 -30 L32 -56" stroke="#2F80ED" stroke-width="9" stroke-linecap="round"/><path d="M31 -52 L48 -36" stroke="#2F80ED" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="36" cy="-65" r="9" fill="#FFD3B0"/><path d="M26 -66 Q27 -79 37 -79 Q47 -78 46 -66 Z" fill="#6C4DF6"/><path d="M30 -74 Q34 -77 39 -76" stroke="#fff" stroke-width="2" fill="none" stroke-linecap="round" opacity=".6"/>';
  }
  function train(col, label, face) {   // 0..200 wide, body -64..0, wheels to +12; face 'r' or 'l'
    var nose = face === 'l' ? 'M30 -64 H200 V0 H0 V-30 Q0 -64 30 -64 Z' : 'M0 -64 H170 Q200 -64 200 -30 V0 H0 Z';
    var w = '';
    for (var i = 0; i < 4; i++) w += '<rect x="' + (face === 'l' ? 52 + i * 36 : 14 + i * 36) + '" y="-54" width="26" height="20" rx="5" fill="url(#spdGlass)" stroke="rgba(30,27,58,.3)" stroke-width="1.2"/>';
    var screen = face === 'l' ? 'M26 -54 H16 Q8 -50 6 -38 H26 Z' : 'M174 -54 H184 Q192 -50 194 -38 H174 Z';
    return '<defs><linearGradient id="spdTrSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></linearGradient>' +
      '<linearGradient id="spdGlass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF8FF"/><stop offset="1" stop-color="#B9DCF7"/></linearGradient></defs>' +
      '<rect x="10" y="-4" width="180" height="8" rx="4" fill="#3E4256"/>' +
      '<path d="' + nose + '" fill="' + col + '"/><path d="' + nose + '" fill="url(#spdTrSh)" stroke="rgba(30,27,58,.5)" stroke-width="2"/>' +
      '<rect x="3" y="-31" width="194" height="4" fill="#fff" opacity=".45"/>' + w +
      '<path d="' + screen + '" fill="url(#spdGlass)" stroke="rgba(30,27,58,.3)" stroke-width="1.2"/>' +
      [40, 100, 160].map(function (x) { return '<circle cx="' + x + '" cy="2" r="10" fill="#2A2740"/><circle cx="' + x + '" cy="2" r="4" fill="#D5D9E3"/>'; }).join('') +
      (label ? '<text x="100" y="-14" font-family="' + F + '" font-size="17" font-weight="700" fill="#FFFFFF" stroke="rgba(30,27,58,.25)" stroke-width="3" paint-order="stroke" text-anchor="middle" dominant-baseline="middle">' + label + '</text>' : '');
  }
  function rails(y) {   // a track: sleepers and two shiny rails, top rail at y
    var sl = '';
    for (var x = 4; x < 640; x += 24) sl += '<rect x="' + x + '" y="' + (y + 2) + '" width="12" height="10" rx="2"/>';
    return '<g fill="#B08A63">' + sl + '</g><rect x="0" y="' + (y - 3) + '" width="640" height="6" rx="3" fill="#7A7F96"/><rect x="0" y="' + (y - 3) + '" width="640" height="2" fill="#E6E9F2" opacity=".8"/>';
  }
  function tree(x, y, r) {   // trunk foot at (x, y)
    r = r || 22;
    return '<defs><radialGradient id="spdLeaf" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#5CD18F"/><stop offset="1" stop-color="#178A55"/></radialGradient></defs>' +
      '<rect x="' + (x - 5) + '" y="' + (y - 40) + '" width="10" height="40" rx="4" fill="#8A5A2B"/>' +
      '<circle cx="' + x + '" cy="' + (y - 49) + '" r="' + r + '" fill="url(#spdLeaf)"/><circle cx="' + (x - 7) + '" cy="' + (y - 57) + '" r="' + (r * .3) + '" fill="#fff" opacity=".15"/>';
  }
  function clock() {
    var t = '';
    for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6, r1 = k % 3 ? 24 : 21; t += '<path d="M' + (Math.sin(a) * r1).toFixed(1) + ' ' + (-Math.cos(a) * r1).toFixed(1) + ' L' + (Math.sin(a) * 27).toFixed(1) + ' ' + (-Math.cos(a) * 27).toFixed(1) + '"/>'; }
    return '<defs><linearGradient id="spdSwRing" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7C5CFF"/><stop offset="1" stop-color="#2D1B69"/></linearGradient>' +
      '<radialGradient id="spdSwFace" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E9EAF4"/></radialGradient></defs>' +
      '<circle r="36" fill="url(#spdSwRing)"/><circle r="30" fill="url(#spdSwFace)"/><g stroke="#9A95C4" stroke-width="2" stroke-linecap="round">' + t + '</g>' +
      '<path d="M0 0 V-19 M0 0 L14 7" stroke="#2D1B69" stroke-width="4" stroke-linecap="round"/><circle r="3.5" fill="#E5484D"/>';
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
  function tri(H, W) {   // formula triangle, apex at (0, 0), each part lightly tinted
    var hy = H * 0.54, hx = W * hy / H;
    return '<path d="M0 0 L' + hx + ' ' + hy + ' H' + (-hx) + ' Z" fill="#E8F1FE"/>' +
      '<path d="M' + (-hx) + ' ' + hy + ' H0 V' + H + ' H' + (-W) + ' Z" fill="#E4F6EC"/><path d="M' + hx + ' ' + hy + ' H0 V' + H + ' H' + W + ' Z" fill="#FFEEDD"/>' +
      '<path d="M0 0 L' + W + ' ' + H + ' H' + (-W) + ' Z" fill="none" stroke="#3B2A8F" stroke-width="5" stroke-linejoin="round"/>' +
      '<path d="M' + (-hx) + ' ' + hy + ' H' + hx + ' M0 ' + hy + ' V' + H + '" stroke="#3B2A8F" stroke-width="3.5" stroke-linecap="round"/>' +
      T(0, H * 0.38, 'distance', H * 0.105, '#2F80ED', 700) + T(-W * 0.45, H * 0.78, 'speed', H * 0.105, '#22A06B', 700) + T(W * 0.45, H * 0.78, 'time', H * 0.105, '#FF8A3D', 700);
  }
  function cover(w, h, rot) {   // a card that covers one part of the triangle
    return '<defs><linearGradient id="spdCover" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFDB6E"/><stop offset="1" stop-color="#F5B321"/></linearGradient></defs>' +
      '<g transform="rotate(' + (rot || -4) + ')"><rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="10" fill="url(#spdCover)" stroke="#CC8A12" stroke-width="2.5"/>' +
      '<rect x="' + (-w / 2 + 6) + '" y="' + (-h / 2 + 4) + '" width="' + (w - 12) + '" height="5" rx="2.5" fill="#fff" opacity=".4"/>' +
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
      s.add('<defs><linearGradient id="spdLane" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D9F3E1"/><stop offset="1" stop-color="#B9E4C6"/></linearGradient></defs>' +
        '<rect x="0" y="80" width="640" height="80" fill="url(#spdLane)"/><rect x="0" y="80" width="640" height="5" fill="#A6E3A1"/><rect x="0" y="156" width="640" height="4" fill="#9ED3A8"/>' +
        [[186, 152], [300, 146], [430, 152], [560, 144]].map(function (p) { return '<path d="M' + p[0] + ' ' + p[1] + ' l-4 -9 M' + (p[0] + 4) + ' ' + p[1] + ' v-12 M' + (p[0] + 8) + ' ' + p[1] + ' l4 -9" stroke="#6FBF78" stroke-width="2.5" fill="none" stroke-linecap="round"/>'; }).join('') + road(190, 90) +
        '<path d="M40 84 V276" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round"/>', { enter: 'fade', flat: true });
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
      s.add(road(230), { enter: 'fade', flat: true });
      s.add(dim(150, 600, 334, '100 m', '#2D1B69'), { enter: 'fade', flat: true });
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
      s.add(road(240), { enter: 'fade', flat: true });
      s.add(dim(148, 598, 340, '300 m', '#2D1B69'), { enter: 'fade', flat: true });
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
      s.add('<defs><linearGradient id="spdTrack" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F59A82"/><stop offset="1" stop-color="#D9644C"/></linearGradient></defs>' +
        '<rect x="290" y="262" width="330" height="18" rx="9" fill="url(#spdTrack)"/><rect x="296" y="263" width="318" height="3" rx="1.5" fill="#fff" opacity=".35"/>' +
        '<path d="M300 271 H610" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="10 8" stroke-linecap="round" opacity=".9"/>', { enter: 'fade', delay: 900, flat: true });
      var o = s.owl(310, 266, 70, { delay: 1000 });
      s.move(o, 595, 266, 3000, { delay: 1500, easing: 'linear' });
      s.text(455, 306, '400 m at 8 m/s', { size: 20, colour: s.C.muted, delay: 1200 });
      s.text(440, 120, '400 ÷ 8', { size: 28, colour: s.C.ink, delay: 1800 });
      s.add(pill('= 50 s', '#22A06B', 180), { x: 440, y: 172, enter: 'pop', delay: 4200 });
    },

    /* ---------- 3. Units of speed ---------- */
    'units-signs': function (s) {
      s.text(320, 34, 'Units of speed', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<defs><radialGradient id="spdU1" cx=".4" cy=".32" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E0D8FF"/></radialGradient></defs>' +
        '<circle r="78" fill="url(#spdU1)" stroke="#6C4DF6" stroke-width="5"/><path d="M-52 -40 A66 66 0 0 1 -14 -64" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>' + T(0, 2, 'm/s', 46, '#2D1B69', 700), { x: 180, y: 160, enter: 'pop', delay: 200 });
      s.text(180, 268, 'metres per second', { size: 22, colour: s.C.ink, delay: 600 });
      s.add('<defs><radialGradient id="spdU2" cx=".4" cy=".32" r=".8"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#CDF0E4"/></radialGradient></defs>' +
        '<circle r="78" fill="url(#spdU2)" stroke="#0F9488" stroke-width="5"/><path d="M-52 -40 A66 66 0 0 1 -14 -64" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round" opacity=".8"/>' + T(0, 2, 'km/h', 46, '#0E5C55', 700), { x: 460, y: 160, enter: 'pop', delay: 1200 });
      s.text(460, 268, 'kilometres per hour', { size: 22, colour: s.C.ink, delay: 1600 });
      s.text(320, 322, 'a distance ÷ a time', { size: 22, weight: 700, colour: s.C.muted, delay: 2200 });
    },
    'cyclist': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'A bike ride', { size: 30, weight: 700, colour: s.C.fun });
      s.ground(248);
      s.add('<defs><linearGradient id="spdWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8E6"/><stop offset="1" stop-color="#F3DFB4"/></linearGradient>' +
        '<linearGradient id="spdRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A7E"/><stop offset="1" stop-color="#D93A40"/></linearGradient>' +
        '<linearGradient id="spdTower" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B6BBCC"/><stop offset="1" stop-color="#8E94A8"/></linearGradient>' +
        '<linearGradient id="spdTower2" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#DCE0EA"/><stop offset="1" stop-color="#B9BECD"/></linearGradient></defs>' +
        '<rect x="16" y="200" width="52" height="48" rx="3" fill="url(#spdWall)" stroke="#C29B62" stroke-width="1.5"/><path d="M6 204 L42 172 L78 204 Q78 207 74 207 H10 Q6 207 6 204 Z" fill="url(#spdRoof)" stroke="#B42318" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<rect x="34" y="222" width="16" height="26" rx="3" fill="#9A6532"/><circle cx="46" cy="236" r="1.6" fill="#FFC93C"/><rect x="21" y="214" width="9" height="9" rx="2" fill="#CFE8FF"/><rect x="54" y="214" width="9" height="9" rx="2" fill="#CFE8FF"/>' +
        '<rect x="572" y="150" width="30" height="98" rx="3" fill="url(#spdTower)" stroke="rgba(30,27,58,.35)" stroke-width="1.5"/><rect x="600" y="180" width="32" height="68" rx="3" fill="url(#spdTower2)" stroke="rgba(30,27,58,.35)" stroke-width="1.5"/>' +
        '<path d="M580 165 h14 M580 185 h14 M580 205 h14 M580 225 h14 M608 195 h16 M608 215 h16 M608 233 h16" stroke="#FFF4D6" stroke-width="6" stroke-linecap="round"/>', { enter: 'fade' });
      s.add(dim(42, 600, 282, '30 km', '#2D1B69'), { enter: 'fade', flat: true });
      var b = s.add(BIKE(), { x: 90, y: 230, enter: 'pop', delay: 200 });
      s.move(b, 490, 230, 3000, { delay: 700, easing: 'linear' });
      s.add(clock(), { x: 250, y: 110, enter: 'pop', delay: 400 });
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
      s.add(rails(182), { enter: 'fade', flat: true });
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
      s.add(road(150, 160) + '<path d="M0 156 H640 M0 304 H640" stroke="#FFC93C" stroke-width="3"/><path d="M40 154 V306" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 6" stroke-linecap="round"/>', { enter: 'fade', flat: true });
      s.add(car('#E5484D', '30 m/s'), { x: 32, y: 160, enter: 'pop', delay: 300, name: 'fast' });
      s.add(car('#2F80ED', '25 m/s'), { x: 32, y: 238, enter: 'pop', delay: 600, name: 'slow' });
      s.arrow(200, 105, 90, 'r', { label: 'both this way', colour: s.C.fun, width: 7, size: 17, delay: 1000 });
    },
    'rel-gap': function (s) {
      s.move(s.ref.fast, 32 + 330, 160, 2200, { easing: 'linear' });   // 11 units per metre, for 1 second
      s.move(s.ref.slow, 32 + 275, 238, 2200, { easing: 'linear' });
      s.add('<path d="M' + (32 + 130 + 275) + ' 154 V306 M' + (32 + 130 + 330) + ' 154 V306" stroke="#FFC93C" stroke-width="3" stroke-dasharray="6 5"/>', { enter: 'fade', delay: 2300, flat: true });
      s.text(320, 336, 'after 1 second, the red car is 5 m ahead', { size: 20, weight: 700, colour: s.C.orange, delay: 2400 });
      s.add(pill('30 − 25 = 5 m/s', '#22A06B', 300), { x: 480, y: 100, enter: 'pop', delay: 2800 });
    },
    'rel-trains': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Towards each other', { size: 30, weight: 700, colour: s.C.fun });
      s.add(rails(162) + rails(282), { enter: 'fade', flat: true });
      var a = s.add(train('#E5484D', '40 m/s →', 'r'), { x: 10, y: 150, enter: 'pop', delay: 200 });
      var b = s.add(train('#2F80ED', '← 35 m/s', 'l'), { x: 430, y: 270, enter: 'pop', delay: 400 });
      s.move(a, 10 + 120, 150, 2200, { delay: 900, easing: 'linear' });   // 3 units per metre, for 1 second
      s.move(b, 430 - 105, 270, 2200, { delay: 900, easing: 'linear' });
      s.add(pill('40 + 35 = 75 m/s', '#22A06B', 300), { x: 320, y: 328, enter: 'pop', delay: 3300 });
    },
    'rel-seat': function (s) {
      s.clear(); s.ref = {};
      s.ground(300);
      s.add(road(282, 20), { enter: 'fade', flat: true });
      s.add([30, 250, 470, 600].map(function (x) { return tree(x, 284); }).join(''), { enter: 'fade' });
      s.text(320, 34, 'Next to each other: still', { size: 26, weight: 700, colour: s.C.fun, delay: 2600 });
      var car_ = s.add('<defs><linearGradient id="spdCarSh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>' +
        '<linearGradient id="spdCabin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF8FF"/><stop offset="1" stop-color="#C4E2F8"/></linearGradient></defs>' +
        '<rect x="0" y="0" width="430" height="190" rx="24" fill="#FF8A3D"/><rect x="0" y="0" width="430" height="190" rx="24" fill="url(#spdCarSh)" stroke="rgba(30,27,58,.5)" stroke-width="2.5"/>' +
        '<rect x="40" y="22" width="350" height="120" rx="14" fill="url(#spdCabin)" stroke="#C2570C" stroke-width="3"/><path d="M54 34 L84 34 M54 44 L70 44" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".8"/>' +
        '<rect x="4" y="156" width="422" height="8" rx="4" fill="#fff" opacity=".3"/><rect x="408" y="150" width="16" height="10" rx="4" fill="#FFE08A"/><rect x="6" y="150" width="12" height="10" rx="4" fill="#FF8A8A"/>' +
        '<path d="M58 190 a22 22 0 0 1 44 0 M328 190 a22 22 0 0 1 44 0" fill="#B85E1C"/>' +
        '<circle cx="80" cy="196" r="15" fill="#2A2740"/><circle cx="80" cy="196" r="6.5" fill="#D5D9E3"/><circle cx="350" cy="196" r="15" fill="#2A2740"/><circle cx="350" cy="196" r="6.5" fill="#D5D9E3"/>', { x: 20, y: 78, enter: 'pop' });
      var o1 = s.owl(150, 218, 90, { delay: 300 }), o2 = s.owl(290, 218, 90, { delay: 400 });
      [car_, o1, o2].forEach(function (g) { s.move(g, g._x + 150, g._y, 3500, { delay: 900, easing: 'linear' }); });
      s.arrow(170, 318, 260, 'r', { label: 'compared with the ground: moving', labelSide: 'below', colour: s.C.red, width: 8, size: 17, delay: 2000 });
    }
  });
})();
