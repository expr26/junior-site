/* Pictures for the Power and energy bills theory video (words: videos/physics/energy-bills-and-power.json).
   Stage is 640 x 360; see static/js/theory.js. Bars that compare amounts are drawn to scale inside each picture. */
(function () {
  if (!window.Theory) return;

  var F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function T(x, y, str, size, col, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '" font-weight="' + (o.w || 600) + '" fill="' + col +
      '" text-anchor="' + (o.a || 'middle') + '" dominant-baseline="middle">' + str + '</text>';
  }
  function keep(s, g) { (s.ref.cur = s.ref.cur || []).push(g); return g; }
  function gone(s) { (s.ref.cur || []).forEach(function (g) { s.hide(g); }); s.ref.cur = []; }
  function fresh(s) { s.clear(); s.ref = {}; }
  /* gradients: every id starts with "ebp" (each drawing that needs one defines it again, always the same) */
  function stops(st) { return st.map(function (p) { return '<stop offset="' + p[0] + '" stop-color="' + p[1] + '"' + (p[2] != null ? ' stop-opacity="' + p[2] + '"' : '') + '/>'; }).join(''); }
  function lin(id, st, dir) {
    var c = dir === 'h' ? 'x1="0" y1="0" x2="1" y2="0"' : dir === 'd' ? 'x1="0" y1="0" x2="1" y2="1"' : 'x1="0" y1="0" x2="0" y2="1"';
    return '<linearGradient id="' + id + '" ' + c + '>' + stops(st) + '</linearGradient>';
  }
  function rad(id, st, cx, cy, r) { return '<radialGradient id="' + id + '" cx="' + (cx || .38) + '" cy="' + (cy || .32) + '" r="' + (r || .75) + '">' + stops(st) + '</radialGradient>'; }
  function defs() { return '<defs>' + [].join.call(arguments, '') + '</defs>'; }
  var SOFT = 'rgba(30,27,58,.35)', LINE = 'rgba(30,27,58,.5)';
  var SHINE = lin('ebpShine', [[0, '#FFFFFF', .4], [.5, '#FFFFFF', 0], [1, '#000000', .1]]);
  var METAL = lin('ebpMetal', [[0, '#7A7F96'], [.38, '#E6E9F2'], [.7, '#A9AEC0'], [1, '#6B7086']], 'h');

  function bar(s, x, y, w, h, col, delay) {   // grows from the left
    var b = s.add(defs(SHINE) + '<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="9" fill="' + col + '"/><rect x="0" y="0" width="' + w + '" height="' + h + '" rx="9" fill="url(#ebpShine)" stroke="rgba(30,27,58,.3)" stroke-width="1.5"/>' +
      '<rect x="6" y="4" width="' + Math.max(0, w - 12) + '" height="5" rx="2.5" fill="#fff" opacity=".35"/>', { x: x, y: y, enter: 'none' });
    b._inner.style.transformOrigin = '0% 50%';
    s.anim(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 900, { delay: delay || 0 });
    return b;
  }
  function box(w, h, fill, stroke) {
    var a = 'x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="16"';
    return defs(lin('ebpBox', [[0, '#FFFFFF', .7], [.6, '#FFFFFF', 0]])) + '<rect ' + a + ' fill="' + fill + '"/><rect ' + a + ' fill="url(#ebpBox)" stroke="' + stroke + '" stroke-width="3"/>';
  }

  var GLOW = rad('ebpGlow', [[0, '#FFE9A8', 1], [.6, '#FFE9A8', .75], [1, '#FFE9A8', 0]], .5, .5, .5);
  var BASE = '<path d="M-10 10 H10 L12 16 H-12 Z" fill="#C9CED8"/><rect x="-12" y="16" width="24" height="19" rx="4" fill="url(#ebpMetal)" stroke="' + SOFT + '" stroke-width="1.5"/>' +
    '<path d="M-12 22 H12 M-12 28 H12" stroke="rgba(30,27,58,.25)" stroke-width="2"/><path d="M-5 35 H5 Q5 40 0 40 Q-5 40 -5 35 Z" fill="#4A4668"/>';
  function bulb(glow) {
    return defs(GLOW, rad('ebpGlass', [[0, '#FFFFFF'], [.55, '#FFF4D6'], [1, '#FFD978']], .4, .35, .7), METAL) + (glow ? '<circle r="48" fill="url(#ebpGlow)"/>' : '') +
      '<path d="M-9 12 Q-10 6 -16 0 A22 22 0 1 1 16 0 Q10 6 9 12 Z" fill="url(#ebpGlass)" stroke="#D9962E" stroke-width="2.5" stroke-linejoin="round"/>' +
      '<path d="M-5 12 L-9 -2 M5 12 L9 -2" stroke="#B5B9C8" stroke-width="1.5"/><path d="M-9 -2 l5 -10 l4 10 l4 -10 l5 10" stroke="#FF8A3D" stroke-width="3" fill="none" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<path d="M-15 -18 q4 -11 14 -13" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".9"/>' + BASE;
  }
  var LED = defs(rad('ebpLedGlow', [[0, '#DDF7EE', 1], [.7, '#DDF7EE', .85], [1, '#DDF7EE', 0]], .5, .5, .5), lin('ebpLed', [[0, '#F4FFFB'], [1, '#A7EBD9']]), METAL) +
    '<circle r="46" fill="url(#ebpLedGlow)"/><path d="M-22 -4 a22 22 0 0 1 44 0 V10 Q22 14 18 14 H-18 Q-22 14 -22 10 Z" fill="url(#ebpLed)" stroke="#0F9488" stroke-width="2.5"/>' +
    '<rect x="-8" y="-6" width="16" height="8" rx="2" fill="#FFC93C" stroke="#C2570C" stroke-width="1.5"/><path d="M-14 -12 q2 -8 10 -10" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>' +
    '<rect x="-12" y="14" width="24" height="19" rx="4" fill="url(#ebpMetal)" stroke="' + SOFT + '" stroke-width="1.5"/><path d="M-12 20 H12 M-12 26 H12" stroke="rgba(30,27,58,.25)" stroke-width="2"/><path d="M-5 33 H5 Q5 38 0 38 Q-5 38 -5 33 Z" fill="#4A4668"/>';
  var KETTLE = defs(lin('ebpKettle', [[0, '#1F5FC4'], [.3, '#6FA8F5'], [.6, '#2F80ED'], [1, '#1B4FA3']], 'h'), lin('ebpDark', [[0, '#4A4668'], [1, '#24213A']]), METAL) +
    '<path d="M-30 -12 L-54 -26" stroke="#1F5FC4" stroke-width="10" stroke-linecap="round"/><path d="M-32 -15 L-52 -27" stroke="#9CC5FA" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M30 -10 q26 4 22 34" stroke="#2A2740" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M32 -12 q24 4 22 30" stroke="#6B6788" stroke-width="2" fill="none" stroke-linecap="round"/>' +
    '<path d="M-36 40 L-30 -20 Q0 -36 30 -20 L36 40 Z" fill="url(#ebpKettle)" stroke="#1B4FA3" stroke-width="2" stroke-linejoin="round"/><path d="M-22 -16 Q-26 10 -26 32" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".35"/>' +
    '<rect x="-12" y="4" width="10" height="24" rx="5" fill="#CFE8FF" opacity=".7"/>' +
    '<rect x="-14" y="-35" width="28" height="9" rx="4.5" fill="url(#ebpDark)"/><rect x="-46" y="38" width="92" height="12" rx="5" fill="url(#ebpDark)"/><rect x="-42" y="40" width="84" height="2.5" rx="1.25" fill="#fff" opacity=".2"/>';
  var HEATER = defs(lin('ebpRad', [[0, '#FFFFFF'], [1, '#C9CED8']]), lin('ebpFin', [[0, '#FFB27A'], [.5, '#FF8A3D'], [1, '#E5602A']], 'h')) +
    '<path d="M-48 34 v10 M48 34 v10" stroke="#7A7F96" stroke-width="5" stroke-linecap="round"/><rect x="-60" y="-34" width="120" height="68" rx="12" fill="url(#ebpRad)" stroke="' + LINE + '" stroke-width="2"/>' +
    [-40, -20, 0, 20, 40].map(function (x) { return '<rect x="' + (x - 5.5) + '" y="-24" width="11" height="48" rx="5.5" fill="url(#ebpFin)"/><rect x="' + (x - 3) + '" y="-20" width="2.5" height="30" rx="1.25" fill="#fff" opacity=".45"/>'; }).join('') +
    '<rect x="-54" y="-30" width="108" height="3" rx="1.5" fill="#fff" opacity=".8"/>';
  var TV = defs(lin('ebpTvFrame', [[0, '#4A4668'], [1, '#1E1B3A']]), lin('ebpSky', [[0, '#9CC5FA'], [1, '#6C8BF5']]), lin('ebpHill', [[0, '#3CC47F'], [1, '#178A55']]), METAL) +
    '<path d="M-20 52 H20" stroke="#55526E" stroke-width="6" stroke-linecap="round"/><rect x="-4" y="34" width="8" height="18" fill="url(#ebpMetal)"/>' +
    '<rect x="-60" y="-40" width="120" height="76" rx="9" fill="url(#ebpTvFrame)"/><rect x="-52" y="-32" width="104" height="60" rx="5" fill="url(#ebpSky)"/>' +
    '<path d="M-52 22 L-30 -4 L-16 12 L-6 2 L18 22 Q20 28 14 28 H-47 Q-52 28 -52 23 Z" fill="url(#ebpHill)"/><circle cx="30" cy="-16" r="7" fill="#FFC93C"/>' +
    '<path d="M-52 -32 L-20 -32 L-52 2 Z" fill="#fff" opacity=".18"/><circle cx="52" cy="32" r="1.8" fill="#22A06B"/>';
  var DRYER = defs(lin('ebpDryer', [[0, '#FF9CBB'], [.5, '#FF5D8F'], [1, '#D93F72']]), lin('ebpDryH', [[0, '#FF9CBB'], [.5, '#FF5D8F'], [1, '#D93F72']], 'h'), rad('ebpVent', [[0, '#4A4668'], [1, '#24213A']], .5, .5, .5)) +
    '<path d="M58 -10 h18 M58 4 h26 M58 18 h16" stroke="#9AA0B4" stroke-width="4" stroke-linecap="round" opacity=".8"/>' +
    '<path d="M-14 26 L-6 72 Q-5 76 -1 76 H8 Q12 76 12 72 L10 26 Z" fill="url(#ebpDryH)" stroke="#B8305E" stroke-width="2" stroke-linejoin="round"/>' +
    '<path d="M-36 -28 H14 V-16 H44 Q48 -16 48 -12 V12 Q48 16 44 16 H14 V28 H-36 Q-64 28 -64 0 Q-64 -28 -36 -28 Z" fill="url(#ebpDryer)" stroke="#B8305E" stroke-width="2" stroke-linejoin="round"/>' +
    '<circle cx="-36" cy="0" r="13" fill="url(#ebpVent)"/><path d="M-43 -4 H-29 M-43 4 H-29" stroke="#6B6788" stroke-width="2"/><path d="M-30 -22 H8" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>' +
    '<rect x="-6" y="40" width="10" height="6" rx="3" fill="#FFF4D6"/>';
  var LAMP = defs(lin('ebpShade', [[0, '#FFE08A'], [1, '#F5A91E']]), rad('ebpLampGlow', [[0, '#FFE9A8', .9], [1, '#FFE9A8', 0]], .5, .2, .8), METAL) +
    '<ellipse cx="0" cy="4" rx="40" ry="26" fill="url(#ebpLampGlow)"/><rect x="-3.5" y="-12" width="7" height="64" rx="3.5" fill="url(#ebpMetal)"/><path d="M-26 54 H26" stroke="#4A4668" stroke-width="7" stroke-linecap="round"/>' +
    '<path d="M-30 -10 L-18 -50 H18 L30 -10 Z" fill="url(#ebpShade)" stroke="#D9862E" stroke-width="2" stroke-linejoin="round"/><path d="M-16 -44 L-24 -16" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".55"/>';
  function clock(label, col) {
    var ticks = [0, 90, 180, 270].map(function (a) { return '<path d="M0 -24 V-20" stroke="#9AA0B4" stroke-width="3" stroke-linecap="round" transform="rotate(' + a + ')"/>'; }).join('');
    return defs(rad('ebpFace', [[0, '#FFFFFF'], [.8, '#FFFFFF'], [1, '#E6E8F0']], .45, .4, .7)) +
      '<circle r="30" fill="url(#ebpFace)" stroke="' + (col || '#4A4668') + '" stroke-width="4"/>' + ticks +
      '<path d="M0 0 V-20 M0 0 L14 8" stroke="#2D1B69" stroke-width="4" stroke-linecap="round"/><circle r="3.5" fill="#2D1B69"/>' +
      (label ? T(0, 48, label, 18, '#1E1B3A', { w: 700 }) : '');
  }
  function coin(label, col) {
    return defs(rad('ebpCoin', [[0, '#FFF1B8'], [.55, '#FFC93C'], [1, '#E0A12B']], .38, .32, .8)) +
      '<circle r="22" fill="' + (col || 'url(#ebpCoin)') + '" stroke="#C2850C" stroke-width="2"/><circle r="17" fill="none" stroke="#FFF1B8" stroke-width="1.5" opacity=".8"/>' +
      T(0, 1, label, label.length > 3 ? 13 : 15, '#6E4A00', { w: 700 });
  }
  function earth() {
    return defs(rad('ebpSea', [[0, '#7FB2F5'], [.6, '#2F80ED'], [1, '#1B4FA3']], .38, .32, .8)) + '<circle r="80" fill="url(#ebpSea)"/>' +
      '<path d="M-64 -30 Q-46 -52 -16 -44 Q4 -34 -6 -16 Q-22 -2 -46 -6 Q-66 -12 -64 -30 Z M10 16 Q34 4 56 16 Q68 34 50 50 Q28 60 16 44 Q4 30 10 16 Z M28 -60 Q46 -62 52 -46 Q38 -38 28 -60 Z" fill="#3CC47F" stroke="#178A55" stroke-width="1.5" stroke-linejoin="round"/>' +
      '<path d="M-46 -52 Q-24 -70 4 -68" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".45"/>';
  }

  Theory.scenes({
    /* ---------- 1. What is power? ---------- */
    'power-intro': function (s) {
      s.owl(100, 300, 140);
      s.text(400, 70, 'Power', { size: 60, weight: 700, colour: s.C.fun, enter: 'pop' });
      s.text(400, 130, 'how fast energy is transferred', { size: 24, colour: s.C.ink, delay: 500 });
      s.add(defs(lin('ebpDial', [[0, '#FFFFFF'], [1, '#EEF0F6']])) + '<path d="M-86 0 A86 86 0 0 1 86 0 Z" fill="url(#ebpDial)" stroke="#4A4668" stroke-width="4" stroke-linejoin="round"/>' +
        '<path d="M-72 0 A72 72 0 0 1 -36 -62" fill="none" stroke="#22A06B" stroke-width="12" stroke-linecap="round"/><path d="M-30 -65.5 A72 72 0 0 1 30 -65.5" fill="none" stroke="#FFC93C" stroke-width="12" stroke-linecap="round"/><path d="M36 -62 A72 72 0 0 1 72 0" fill="none" stroke="#E5484D" stroke-width="12" stroke-linecap="round"/>' +
        T(-58, 18, 'slow', 16, '#22A06B', { w: 700 }) + T(58, 18, 'fast', 16, '#E5484D', { w: 700 }), { x: 400, y: 300, enter: 'pop', delay: 900 });
      var n = s.add('<path d="M0 0 L0 -60" stroke="#2D1B69" stroke-width="6" stroke-linecap="round"/><circle r="10" fill="#2D1B69"/><circle r="4" fill="#9AA0B4"/>', { x: 400, y: 300, enter: 'fade', delay: 900 });
      n._inner.style.transformBox = 'view-box'; n._inner.style.transformOrigin = '0 0';
      s.anim(n, [{ transform: 'rotate(-70deg)' }, { transform: 'rotate(60deg)' }], 1600, { delay: 1300, easing: 'cubic-bezier(.3,1.4,.6,1)' });
    },
    'watt': function (s) {
      fresh(s);
      s.add(box(360, 76, '#FFF4D6', '#FFC93C') + T(0, 2, '1 W = 1 J every second', 32, '#C2570C', { w: 700 }), { x: 320, y: 80, enter: 'pop' });
      s.add(clock(''), { x: 120, y: 230, enter: 'pop', delay: 400 });
      var hand = s.add('<path d="M0 0 V-22" stroke="#E5484D" stroke-width="4" stroke-linecap="round"/>', { x: 120, y: 230, enter: 'fade', delay: 400 });
      hand._inner.style.transformBox = 'view-box'; hand._inner.style.transformOrigin = '0 0';
      s.anim(hand, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 1000, { iterations: 3, easing: 'linear', delay: 600 });
      [0, 1, 2].forEach(function (k) {
        s.add(coin('1 J'), { x: 240 + k * 70, y: 230, enter: 'pop', delay: 600 + k * 1000 });
        s.text(240 + k * 70, 280, (k + 1) + ' s', { size: 18, colour: s.C.muted, delay: 600 + k * 1000 });
      });
      s.text(530, 230, '…', { size: 40, colour: s.C.muted, delay: 2800 });
      s.text(320, 330, 'watt is the unit of power', { size: 22, colour: s.C.fun, delay: 2600 });
    },
    'two-bulbs': function (s) {
      fresh(s);
      s.text(320, 34, 'Energy transferred every second', { size: 26, weight: 700, colour: s.C.fun });
      // 1 J = 5 units of bar
      s.add(LED, { x: 70, y: 130, enter: 'pop' });
      s.text(70, 190, '10 W', { size: 22, weight: 700, colour: s.C.sci });
      bar(s, 130, 112, 50, 36, '#0F9488', 400);
      s.text(196, 130, '10 J', { size: 22, weight: 700, colour: s.C.sci, anchor: 'start', delay: 1000 });
      s.add(bulb(true), { x: 70, y: 262, enter: 'pop', delay: 1200 });
      s.text(70, 322, '60 W', { size: 22, weight: 700, colour: s.C.orange, delay: 1200 });
      bar(s, 130, 244, 300, 36, '#FF8A3D', 1600);
      s.text(446, 262, '60 J', { size: 22, weight: 700, colour: s.C.orange, anchor: 'start', delay: 2300 });
      s.text(540, 196, '6 times as fast', { size: 20, weight: 700, colour: s.C.red, delay: 2600 });
    },
    'kilowatt': function (s) {
      fresh(s);
      s.add(KETTLE, { x: 140, y: 190, enter: 'pop' });
      var st = s.add('<path d="M-10 0 q-8 -10 0 -20 q8 -10 0 -20 M10 0 q-8 -10 0 -20 q8 -10 0 -20" stroke="#B5B9C8" stroke-width="4" fill="none" stroke-linecap="round" opacity=".85"/>', { x: 102, y: 150, enter: 'up', delay: 500 });
      s.anim(st, [{ opacity: 1, transform: 'translateY(0)' }, { opacity: .3, transform: 'translateY(-8px)' }], 1200, { iterations: Infinity, delay: 1000 });
      s.text(420, 80, 'kilo = 1000', { size: 32, weight: 700, colour: s.C.fun, enter: 'pop', delay: 300 });
      s.text(420, 150, '1 kW = 1000 W', { size: 30, weight: 700, colour: s.C.ink, delay: 900 });
      s.add(box(260, 64, '#DDF7EE', '#22A06B') + T(0, 2, '2000 W = 2 kW', 30, '#0E7A5A', { w: 700 }), { x: 420, y: 240, enter: 'pop', delay: 1600 });
    },

    /* ---------- 2. Energy = power × time ---------- */
    'ept-formula': function (s) {
      fresh(s);
      var f = '<g>' + box(150, 70, '#FFF4D6', '#FFC93C') + T(0, -8, 'energy', 26, '#C2570C', { w: 700 }) + T(0, 20, 'J', 18, '#C2570C') + '</g>' +
        T(100, 0, '=', 34, '#1E1B3A', { w: 700 }) +
        '<g transform="translate(200 0)">' + box(150, 70, '#E8E2FF', '#6C4DF6') + T(0, -8, 'power', 26, '#6C4DF6', { w: 700 }) + T(0, 20, 'W', 18, '#6C4DF6') + '</g>' +
        T(300, 0, '×', 34, '#1E1B3A', { w: 700 }) +
        '<g transform="translate(400 0)">' + box(150, 70, '#DDF3FF', '#2F80ED') + T(0, -8, 'time', 26, '#2F80ED', { w: 700 }) + T(0, 20, 's', 18, '#2F80ED') + '</g>';
      s.add(f, { x: 120, y: 170, enter: 'pop', name: 'f' });
      s.owl(560, 340, 90, { delay: 800, name: 'owl' });
    },
    'ept-lamp': function (s) {
      s.move(s.ref.f, 120, 60, 700);
      s.hide(s.ref.owl);
      keep(s, s.add(LAMP, { x: 80, y: 200, enter: 'pop', delay: 500 }));
      keep(s, s.text(80, 280, '40 W', { size: 22, weight: 700, colour: s.C.fun, delay: 600 }));
      keep(s, s.add(clock('10 s'), { x: 190, y: 190, enter: 'pop', delay: 700 }));
      for (var k = 0; k < 10; k++)   // one 40 J block for each second
        keep(s, s.add(defs(lin('ebpBlock', [[0, '#FFE08A'], [1, '#F5B21E']])) + '<rect x="-28" y="-18" width="56" height="36" rx="9" fill="url(#ebpBlock)" stroke="#D9862E" stroke-width="1.5"/><rect x="-23" y="-14" width="46" height="4" rx="2" fill="#fff" opacity=".55"/>' + T(0, 2, '40 J', 15, '#6E4A00', { w: 700 }),
          { x: 300 + (k % 5) * 62, y: 160 + Math.floor(k / 5) * 46, enter: 'pop', delay: 900 + k * 150, ms: 300 }));
      keep(s, s.add(box(300, 52, '#DDF7EE', '#22A06B') + T(0, 2, '40 × 10 = 400 J', 26, '#0E7A5A', { w: 700 }), { x: 424, y: 290, enter: 'pop', delay: 2600 }));
    },
    'ept-minutes': function (s) {
      gone(s);
      keep(s, s.add(LAMP, { x: 80, y: 200, enter: 'pop' }));
      keep(s, s.text(80, 280, '10 W', { size: 22, weight: 700, colour: s.C.fun }));
      keep(s, s.add(clock('2 minutes'), { x: 200, y: 180, enter: 'pop', delay: 300 }));
      keep(s, s.arrow(250, 180, 70, 'r', { colour: s.C.blue, width: 8, delay: 800 }));
      keep(s, s.add(box(200, 56, '#DDF3FF', '#2F80ED') + T(0, 2, '120 s', 28, '#2F80ED', { w: 700 }), { x: 430, y: 180, enter: 'pop', delay: 1200 }));
      keep(s, s.text(430, 230, '2 × 60 = 120', { size: 20, colour: s.C.muted, delay: 1400 }));
      keep(s, s.add(box(340, 52, '#DDF7EE', '#22A06B') + T(0, 2, '10 × 120 = 1200 J', 26, '#0E7A5A', { w: 700 }), { x: 400, y: 300, enter: 'pop', delay: 2100 }));
    },
    'ept-back': function (s) {
      gone(s);
      s.hide(s.ref.f);
      var f = '<g>' + box(150, 70, '#E8E2FF', '#6C4DF6') + T(0, -8, 'power', 26, '#6C4DF6', { w: 700 }) + T(0, 20, 'W', 18, '#6C4DF6') + '</g>' +
        T(100, 0, '=', 34, '#1E1B3A', { w: 700 }) +
        '<g transform="translate(200 0)">' + box(150, 70, '#FFF4D6', '#FFC93C') + T(0, -8, 'energy', 26, '#C2570C', { w: 700 }) + T(0, 20, 'J', 18, '#C2570C') + '</g>' +
        T(300, 0, '÷', 34, '#1E1B3A', { w: 700 }) +
        '<g transform="translate(400 0)">' + box(150, 70, '#DDF3FF', '#2F80ED') + T(0, -8, 'time', 26, '#2F80ED', { w: 700 }) + T(0, 20, 's', 18, '#2F80ED') + '</g>';
      s.add(f, { x: 120, y: 60, enter: 'pop' });
      s.add(DRYER, { x: 130, y: 200, enter: 'pop', delay: 600 });
      s.text(400, 190, '12,000 J in 10 s', { size: 26, weight: 700, colour: s.C.ink, delay: 1000 });
      s.add(box(360, 56, '#DDF7EE', '#22A06B') + T(0, 2, '12,000 ÷ 10 = 1200 W', 26, '#0E7A5A', { w: 700 }), { x: 400, y: 280, enter: 'pop', delay: 1800 });
    },

    /* ---------- 3. Kilowatt-hours ---------- */
    'kwh-intro': function (s) {
      fresh(s);
      s.add(defs(lin('ebpRoof', [[0, '#FF7D80'], [1, '#C8323A']]), lin('ebpWall', [[0, '#FFFBEE'], [1, '#F5E3BC']]), lin('ebpDoor', [[0, '#C98A4B'], [1, '#9A6532']]), lin('ebpWin', [[0, '#FFF4C2'], [1, '#FFD966']])) +
        '<rect x="40" y="-74" width="20" height="44" rx="3" fill="#B8773A"/><rect x="36" y="-80" width="28" height="9" rx="3" fill="#9A6532"/>' +
        '<rect x="-72" y="-8" width="144" height="118" rx="4" fill="url(#ebpWall)" stroke="' + SOFT + '" stroke-width="2"/>' +
        '<path d="M-96 6 L0 -82 L96 6 Z" fill="url(#ebpRoof)" stroke="#A3201A" stroke-width="2" stroke-linejoin="round"/><path d="M-72 -10 L0 -74" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".3"/>' +
        '<rect x="-20" y="48" width="40" height="62" rx="6" fill="url(#ebpDoor)" stroke="#8A5A2B" stroke-width="1.5"/><circle cx="10" cy="80" r="3" fill="#FFC93C"/>' +
        '<rect x="-60" y="20" width="30" height="30" rx="4" fill="url(#ebpWin)" stroke="' + SOFT + '" stroke-width="2"/><path d="M-45 20 V50 M-60 35 H-30" stroke="#fff" stroke-width="2.5"/>' +
        '<rect x="30" y="20" width="30" height="30" rx="4" fill="url(#ebpWin)" stroke="' + SOFT + '" stroke-width="2"/><path d="M45 20 V50 M30 35 H60" stroke="#fff" stroke-width="2.5"/>',
        { x: 140, y: 200, enter: 'up' });
      s.text(430, 90, 'millions of J', { size: 34, weight: 700, colour: s.C.orange, delay: 500 });
      s.text(430, 136, 'every day!', { size: 24, colour: s.C.muted, delay: 900 });
      s.text(430, 196, 'a bigger unit:', { size: 22, colour: s.C.ink, delay: 1400 });
      s.add(box(300, 70, '#E8E2FF', '#6C4DF6') + T(0, 2, 'kilowatt-hour', 34, '#6C4DF6', { w: 700 }), { x: 430, y: 256, enter: 'pop', delay: 1800 });
      s.text(430, 316, 'kWh', { size: 28, weight: 700, colour: s.C.fun, delay: 2300 });
    },
    'kwh-one': function (s) {
      fresh(s);
      s.add(HEATER, { x: 110, y: 130, enter: 'pop' });
      s.text(110, 200, '1 kW', { size: 24, weight: 700, colour: s.C.orange, delay: 200 });
      s.text(215, 130, '×', { size: 40, weight: 700, delay: 500 });
      s.add(clock('1 hour'), { x: 310, y: 126, enter: 'pop', delay: 700 });
      s.text(405, 130, '=', { size: 40, weight: 700, delay: 1100 });
      s.add(box(150, 70, '#E8E2FF', '#6C4DF6') + T(0, 2, '1 kWh', 34, '#6C4DF6', { w: 700 }), { x: 530, y: 130, enter: 'pop', delay: 1300 });
      s.text(320, 270, '1 kWh = 3,600,000 J', { size: 30, weight: 700, colour: s.C.ink, delay: 2000 });
      s.text(320, 312, '1000 W × 3600 s', { size: 20, colour: s.C.muted, delay: 2400 });
    },
    'kwh-heater': function (s) {
      fresh(s);
      s.text(320, 34, 'kWh = kW × hours', { size: 30, weight: 700, colour: s.C.fun });
      s.add(HEATER, { x: 100, y: 140, enter: 'pop' });
      s.text(100, 210, '2 kW', { size: 24, weight: 700, colour: s.C.orange, delay: 200 });
      [0, 1, 2, 3].forEach(function (k) { s.add(clock(''), { x: 250 + k * 80, y: 136, enter: 'pop', delay: 500 + k * 300 }); });
      s.text(370, 196, '4 hours', { size: 22, weight: 700, colour: s.C.ink, delay: 1700 });
      s.add(box(300, 60, '#DDF7EE', '#22A06B') + T(0, 2, '2 × 4 = 8 kWh', 30, '#0E7A5A', { w: 700 }), { x: 320, y: 280, enter: 'pop', delay: 2100 });
    },
    'kwh-tv': function (s) {
      fresh(s);
      s.text(320, 34, 'Watts to kilowatts first', { size: 30, weight: 700, colour: s.C.fun });
      s.add(TV, { x: 100, y: 150, enter: 'pop' });
      s.text(100, 226, '200 W', { size: 24, weight: 700, colour: s.C.blue, delay: 200 });
      s.text(400, 110, '200 W = 0.2 kW', { size: 30, weight: 700, colour: s.C.ink, delay: 500 });
      s.text(400, 150, '÷ 1000', { size: 20, colour: s.C.muted, delay: 800 });
      s.text(400, 200, 'on for 5 hours', { size: 24, colour: s.C.ink, delay: 1200 });
      s.add(box(320, 60, '#DDF7EE', '#22A06B') + T(0, 2, '0.2 × 5 = 1 kWh', 30, '#0E7A5A', { w: 700 }), { x: 400, y: 280, enter: 'pop', delay: 1800 });
    },

    /* ---------- 4. Paying for energy ---------- */
    'price': function (s) {
      fresh(s);
      s.owl(110, 320, 150);
      s.add(defs(lin('ebpTag', [[0, '#FFE08A'], [1, '#F5B21E']])) + '<path d="M-122 -60 H100 L148 -4 Q151 0 148 4 L100 60 H-122 Q-130 60 -130 52 V-52 Q-130 -60 -122 -60 Z" fill="url(#ebpTag)" stroke="#D9862E" stroke-width="3" stroke-linejoin="round"/>' +
        '<rect x="-118" y="-52" width="210" height="8" rx="4" fill="#fff" opacity=".45"/><circle cx="110" cy="0" r="10" fill="#FFFDF7" stroke="#D9862E" stroke-width="2.5"/>' +
        T(-20, -16, '25p', 44, '#1E1B3A', { w: 700 }) + T(-20, 30, 'for each kWh', 22, '#1E1B3A'), { x: 400, y: 150, enter: 'pop', delay: 300 });
      s.text(400, 270, 'You pay for every kWh you use', { size: 22, colour: s.C.muted, delay: 1200 });
    },
    'cost-heater': function (s) {
      fresh(s);
      s.text(320, 34, 'cost = kWh × price', { size: 30, weight: 700, colour: s.C.fun });
      s.add(HEATER, { x: 90, y: 120, enter: 'pop' });
      s.text(90, 186, '8 kWh', { size: 22, weight: 700, colour: s.C.orange, delay: 200 });
      for (var k = 0; k < 8; k++) s.add(coin('25p'), { x: 200 + k * 54, y: 120, enter: 'pop', delay: 400 + k * 180, ms: 300 });
      s.text(390, 176, '8 × 25p = 200p', { size: 28, weight: 700, colour: s.C.ink, delay: 2000 });
      s.add(box(200, 64, '#DDF7EE', '#22A06B') + T(0, 2, '= £2', 36, '#0E7A5A', { w: 700 }), { x: 390, y: 260, enter: 'pop', delay: 2400 });
      s.text(390, 316, '100p = £1', { size: 18, colour: s.C.muted, delay: 2600 });
    },
    'meter': function (s) {
      fresh(s);
      function meter(reading) {
        var digits = '';
        reading.split('').forEach(function (d, i) { digits += '<rect x="' + (-75 + i * 30) + '" y="-20" width="26" height="40" rx="5" fill="url(#ebpDigit)"/>' + T(-62 + i * 30, 1, d, 26, '#FFFFFF', { w: 700 }); });
        return defs(lin('ebpMeter', [[0, '#F4F5F9'], [1, '#C9CED8']]), lin('ebpDigit', [[0, '#3A3658'], [.5, '#1E1B3A'], [1, '#2A2740']])) +
          '<rect x="-100" y="-70" width="200" height="140" rx="18" fill="url(#ebpMeter)" stroke="' + LINE + '" stroke-width="2.5"/><rect x="-92" y="-63" width="184" height="6" rx="3" fill="#fff" opacity=".8"/>' +
          '<rect x="-84" y="-28" width="168" height="56" rx="10" fill="#E6E8F0" stroke="' + SOFT + '" stroke-width="1.5"/>' + T(0, -46, 'kWh', 16, '#55526E', { w: 700 }) + digits +
          '<circle cx="-80" cy="50" r="4" fill="#9AA0B4"/><circle cx="80" cy="50" r="4" fill="#9AA0B4"/><circle cx="0" cy="48" r="5" fill="#22A06B"/>';
      }
      s.add(meter('05120'), { x: 160, y: 160, enter: 'pop' });
      s.text(160, 260, 'Monday', { size: 24, weight: 700, colour: s.C.blue, delay: 300 });
      s.add(meter('05150'), { x: 480, y: 160, enter: 'pop', delay: 900 });
      s.text(480, 260, 'Friday', { size: 24, weight: 700, colour: s.C.pink, delay: 1200 });
      s.arrow(275, 160, 90, 'r', { colour: s.C.fun, width: 8, delay: 700 });
      s.text(320, 316, '5150 − 5120 = 30 kWh', { size: 28, weight: 700, colour: s.C.green, delay: 2000, name: 'sub' });
    },
    'meter-cost': function (s) {
      s.move(s.ref.sub, 320, 36, 600);
      s.add(box(420, 56, '#DDF7EE', '#22A06B') + T(0, 2, '30 × 25p = 750p = £7.50', 28, '#0E7A5A', { w: 700 }), { x: 320, y: 316, enter: 'pop', delay: 700 });
    },

    /* ---------- 5. Comparing and saving ---------- */
    'compare-intro': function (s) {
      fresh(s);
      s.text(320, 40, 'Energy used depends on…', { size: 30, weight: 700, colour: s.C.fun });
      s.add(box(200, 120, '#E8E2FF', '#6C4DF6') + T(0, -16, 'power', 34, '#6C4DF6', { w: 700 }) + T(0, 24, 'kW', 22, '#6C4DF6'), { x: 180, y: 170, enter: 'pop', delay: 300 });
      s.text(320, 170, '×', { size: 44, weight: 700, delay: 700 });
      s.add(box(200, 120, '#DDF3FF', '#2F80ED') + T(0, -16, 'how long', 34, '#2F80ED', { w: 700 }) + T(0, 24, 'hours', 22, '#2F80ED'), { x: 460, y: 170, enter: 'pop', delay: 900 });
      s.owl(320, 345, 80, { delay: 1300 });
    },
    'compare': function (s) {
      fresh(s);
      s.add('<path d="M320 20 V250" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { enter: 'fade' });
      s.add(DRYER, { x: 170, y: 70, enter: 'pop' });
      s.text(160, 160, '2 kW for 15 minutes', { size: 20, weight: 700, colour: s.C.pink, delay: 300 });
      s.text(160, 194, '2 × 0.25 = 0.5 kWh', { size: 22, weight: 700, colour: s.C.ink, delay: 800 });
      s.add(TV, { x: 480, y: 80, enter: 'pop', delay: 1000 });
      s.text(480, 160, '100 W for 5 hours', { size: 20, weight: 700, colour: s.C.blue, delay: 1200 });
      s.text(480, 194, '0.1 × 5 = 0.5 kWh', { size: 22, weight: 700, colour: s.C.ink, delay: 1600 });
      // the same energy: bars of equal length (1 kWh = 400 units)
      bar(s, 60, 222, 200, 34, '#FF5D8F', 1900);
      bar(s, 380, 222, 200, 34, '#2F80ED', 1900);
      s.add(T(160, 240, '0.5 kWh', 20, '#FFFFFF', { w: 700 }), { delay: 2600 });
      s.add(T(480, 240, '0.5 kWh', 20, '#FFFFFF', { w: 700 }), { delay: 2600 });
      s.add(box(300, 50, '#DDF7EE', '#22A06B') + T(0, 2, 'the same energy!', 26, '#0E7A5A', { w: 700 }), { x: 320, y: 310, enter: 'pop', delay: 2600 });
    },
    'save': function (s) {
      fresh(s);
      s.text(320, 34, 'Ways to save energy', { size: 30, weight: 700, colour: s.C.green });
      var sw = defs(lin('ebpPlate', [[0, '#FFFFFF'], [1, '#E2E5EE']]), lin('ebpRocker', [[0, '#C9CED8'], [1, '#8A8FA8']])) +
        '<rect x="-30" y="-44" width="60" height="88" rx="12" fill="url(#ebpPlate)" stroke="' + LINE + '" stroke-width="2"/><rect x="-16" y="-12" width="32" height="44" rx="7" fill="#E6E8F0" stroke="' + SOFT + '" stroke-width="1.5"/>' +
        '<rect x="-12" y="-6" width="24" height="34" rx="5" fill="url(#ebpRocker)"/><rect x="-9" y="-3" width="18" height="4" rx="2" fill="#fff" opacity=".5"/>' + T(0, -26, 'OFF', 14, '#E5484D', { w: 700 });
      var shower = defs(METAL, lin('ebpHead', [[0, '#E6E9F2'], [1, '#8A8FA8']])) + '<path d="M-30 -40 H10 Q30 -40 30 -20" stroke="#7A7F96" stroke-width="7" fill="none" stroke-linecap="round"/><path d="M-30 -41.5 H10 Q28 -41.5 28.5 -22" stroke="#E6E9F2" stroke-width="2" fill="none" stroke-linecap="round"/>' +
        '<path d="M14 -20 H46 L40 -9 Q39 -8 37 -8 H23 Q21 -8 20 -9 Z" fill="url(#ebpHead)" stroke="' + SOFT + '" stroke-width="1.5" stroke-linejoin="round"/>' +
        [18, 26, 34, 42].map(function (x, i) { return '<path d="M' + x + ' -2 l-3 ' + (24 + i * 6) + '" stroke="#5E9CEB" stroke-width="3" stroke-linecap="round" stroke-dasharray="7 5"/>'; }).join('');
      var dial = defs(rad('ebpKnob', [[0, '#FFFFFF'], [.8, '#F4F5F9'], [1, '#D5D9E3']], .45, .4, .7)) +
        '<circle r="40" fill="url(#ebpKnob)" stroke="#55526E" stroke-width="3"/><path d="M-28 20 A34 34 0 1 1 28 20" stroke="#FFD2B0" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M-28 20 A34 34 0 0 1 -24 -24" stroke="#FF8A3D" stroke-width="8" fill="none" stroke-linecap="round"/>' +
        '<path d="M0 0 L-18 -18" stroke="#2D1B69" stroke-width="5" stroke-linecap="round"/><circle r="7" fill="#2D1B69"/><circle r="2.5" fill="#9AA0B4"/>' +
        '<path d="M48 -30 v24 m-8 -8 l8 8 l8 -8" stroke="#2F80ED" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>';
      var items = [[sw, 'switch off', 'lights and screens'], [LED, 'LED bulbs', ''], [shower, 'shorter', 'showers'], [dial, 'heating', 'down a little']];
      items.forEach(function (it, k) {
        var x = 90 + k * 153;
        s.add('<rect x="-68" y="-110" width="136" height="230" rx="18" fill="#FFFFFF" stroke="#22A06B" stroke-width="3"/><circle cx="0" cy="-40" r="52" fill="#22A06B" opacity=".07"/>', { x: x, y: 200, enter: 'pop', delay: k * 400 });
        s.add(it[0], { x: x, y: 160, enter: 'pop', delay: k * 400 + 150 });
        s.text(x, 248, it[1], { size: 19, weight: 700, colour: s.C.green, delay: k * 400 + 250 });
        if (it[2]) s.text(x, 274, it[2], { size: 15, colour: s.C.muted, delay: k * 400 + 300 });
      });
    },
    'save-planet': function (s) {
      fresh(s);
      var pig = defs(rad('ebpPig', [[0, '#FFD3E0'], [.55, '#FF9EBB'], [1, '#F0709A']], .4, .3, .8), lin('ebpSnout', [[0, '#FFA8C2'], [1, '#F06E98']])) +
        '<path d="M-40 40 v24 M30 40 v24 M-20 44 v20 M50 36 v24" stroke="#E0628C" stroke-width="12" stroke-linecap="round"/>' +
        '<path d="M-70 -4 q-16 -6 -14 -20 q8 4 4 12" stroke="#E0628C" stroke-width="4" fill="none" stroke-linecap="round"/>' +
        '<ellipse rx="70" ry="54" fill="url(#ebpPig)" stroke="#C2306A" stroke-width="2"/><path d="M18 -48 l8 -22 l16 18 Z" fill="#FF8DB0" stroke="#C2306A" stroke-width="2" stroke-linejoin="round"/>' +
        '<ellipse cx="66" cy="4" rx="16" ry="14" fill="url(#ebpSnout)" stroke="#C2306A" stroke-width="2"/><ellipse cx="61" cy="3" rx="2.6" ry="3.4" fill="#A8245A"/><ellipse cx="71" cy="3" rx="2.6" ry="3.4" fill="#A8245A"/>' +
        '<circle cx="34" cy="-18" r="6" fill="#2D1B69"/><circle cx="36" cy="-20" r="2" fill="#fff"/><ellipse cx="40" cy="6" rx="9" ry="5" fill="#FF7BA3" opacity=".6"/>' +
        '<rect x="-30" y="-56" width="36" height="8" rx="4" fill="#A8245A"/><path d="M-44 -30 q14 -14 34 -16" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" opacity=".5"/>';
      s.add(pig, { x: 170, y: 180, enter: 'pop' });
      var c = s.add(coin('£'), { x: 158, y: 60, enter: 'down', delay: 400 });
      s.move(c, 158, 116, 600, { delay: 900, easing: 'ease-in' });
      s.hide(c, { delay: 1500, ms: 200 });
      s.text(170, 290, 'saves money', { size: 26, weight: 700, colour: s.C.pink, delay: 1000 });
      s.add(earth(), { x: 470, y: 170, enter: 'pop', delay: 1400 });
      s.add(defs(rad('ebpHeart', [[0, '#FF9A9C'], [1, '#D93A40']], .35, .3, .8)) + '<path d="M0 12 C-30 -10 -18 -36 0 -22 C18 -36 30 -10 0 12 Z" fill="url(#ebpHeart)" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round"/><ellipse cx="-9" cy="-18" rx="4" ry="3" fill="#fff" opacity=".6"/>', { x: 540, y: 96, enter: 'pop', delay: 2000 });
      s.text(470, 290, 'less fuel burned', { size: 26, weight: 700, colour: s.C.green, delay: 1800 });
    }
  });
})();
