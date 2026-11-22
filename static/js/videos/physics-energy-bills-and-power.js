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
  function bar(s, x, y, w, h, col, delay) {   // grows from the left
    var b = s.add('<rect x="0" y="0" width="' + w + '" height="' + h + '" rx="8" fill="' + col + '" stroke="#1E1B3A" stroke-width="2"/>', { x: x, y: y, enter: 'none' });
    b._inner.style.transformOrigin = '0% 50%';
    s.anim(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 900, { delay: delay || 0 });
    return b;
  }
  function box(w, h, fill, stroke) { return '<rect x="' + (-w / 2) + '" y="' + (-h / 2) + '" width="' + w + '" height="' + h + '" rx="16" fill="' + fill + '" stroke="' + stroke + '" stroke-width="3"/>'; }

  function bulb(glow) {
    return (glow ? '<circle r="44" fill="#FFE9A8" opacity=".85"/>' : '') +
      '<circle cy="-8" r="26" fill="#FFF4D6" stroke="#C2570C" stroke-width="3"/><path d="M-9 -2 l5 -10 l4 10 l4 -10 l5 10" stroke="#FF8A3D" stroke-width="3" fill="none"/>' +
      '<rect x="-12" y="16" width="24" height="20" rx="3" fill="#9AA0B4" stroke="#55526E" stroke-width="2"/>';
  }
  var LED = '<circle r="40" fill="#DDF7EE"/><path d="M-22 -4 a22 22 0 0 1 44 0 V14 H-22 Z" fill="#FFFFFF" stroke="#0F9488" stroke-width="3"/><path d="M-12 -2 h24" stroke="#0F9488" stroke-width="3"/>' +
    '<rect x="-12" y="14" width="24" height="20" rx="3" fill="#9AA0B4" stroke="#55526E" stroke-width="2"/>';
  var KETTLE = '<path d="M-36 40 L-30 -20 Q0 -36 30 -20 L36 40 Z" fill="#2F80ED" stroke="#1E1B3A" stroke-width="3"/><path d="M30 -10 q26 4 22 34" stroke="#1E1B3A" stroke-width="7" fill="none"/>' +
    '<path d="M-30 -12 L-54 -26" stroke="#1E1B3A" stroke-width="8" stroke-linecap="round"/><rect x="-14" y="-34" width="28" height="8" rx="4" fill="#1E1B3A"/><rect x="-44" y="40" width="88" height="10" rx="4" fill="#55526E"/>';
  var HEATER = '<rect x="-60" y="-34" width="120" height="68" rx="10" fill="#E6E8F0" stroke="#55526E" stroke-width="3"/>' +
    [-40, -20, 0, 20, 40].map(function (x) { return '<rect x="' + (x - 5) + '" y="-24" width="10" height="48" rx="5" fill="#FF8A3D"/>'; }).join('') + '<path d="M-48 34 v10 M48 34 v10" stroke="#55526E" stroke-width="5"/>';
  var TV = '<rect x="-60" y="-40" width="120" height="76" rx="8" fill="#1E1B3A"/><rect x="-52" y="-32" width="104" height="60" rx="4" fill="#6C8BF5"/><path d="M-36 14 l20 -24 l14 16 l10 -10 l24 18 Z" fill="#22A06B"/><circle cx="30" cy="-16" r="7" fill="#FFC93C"/><path d="M-20 52 H20 M0 36 V52" stroke="#1E1B3A" stroke-width="6"/>';
  var DRYER = '<path d="M-36 -28 H14 V-16 H48 V16 H14 V28 H-36 Q-64 28 -64 0 Q-64 -28 -36 -28 Z" fill="#FF5D8F" stroke="#1E1B3A" stroke-width="3"/><circle cx="-36" cy="0" r="12" fill="#1E1B3A" opacity=".8"/>' +
    '<path d="M-14 26 L-6 76 H12 L10 26 Z" fill="#FF5D8F" stroke="#1E1B3A" stroke-width="3"/>' +
    '<path d="M58 -10 h18 M58 4 h26 M58 18 h16" stroke="#9AA0B4" stroke-width="4" stroke-linecap="round"/>';
  var LAMP = '<path d="M-30 -10 L-18 -50 H18 L30 -10 Z" fill="#FFC93C" stroke="#1E1B3A" stroke-width="3"/><path d="M0 -10 V50 M-26 54 H26" stroke="#1E1B3A" stroke-width="6" stroke-linecap="round"/>';
  function clock(label, col) {
    return '<circle r="30" fill="#FFFFFF" stroke="' + (col || '#1E1B3A') + '" stroke-width="4"/><path d="M0 0 V-20 M0 0 L14 8" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/><circle r="3" fill="#1E1B3A"/>' +
      (label ? T(0, 48, label, 18, '#1E1B3A', { w: 700 }) : '');
  }
  function coin(label, col) { return '<circle r="22" fill="' + (col || '#FFC93C') + '" stroke="#C2570C" stroke-width="3"/>' + T(0, 1, label, label.length > 3 ? 13 : 15, '#1E1B3A', { w: 700 }); }

  Theory.scenes({
    /* ---------- 1. What is power? ---------- */
    'power-intro': function (s) {
      s.owl(100, 300, 140);
      s.text(400, 70, 'Power', { size: 60, weight: 700, colour: s.C.fun, enter: 'pop' });
      s.text(400, 130, 'how fast energy is transferred', { size: 24, colour: s.C.ink, delay: 500 });
      s.add('<path d="M-80 0 A80 80 0 0 1 80 0" fill="#FFFFFF" stroke="#1E1B3A" stroke-width="5"/><path d="M-80 0 A80 80 0 0 1 -40 -69" fill="none" stroke="#22A06B" stroke-width="12"/><path d="M40 -69 A80 80 0 0 1 80 0" fill="none" stroke="#E5484D" stroke-width="12"/>' +
        T(-58, 18, 'slow', 16, '#22A06B', { w: 700 }) + T(58, 18, 'fast', 16, '#E5484D', { w: 700 }), { x: 400, y: 300, enter: 'pop', delay: 900 });
      var n = s.add('<path d="M0 0 L0 -66" stroke="#1E1B3A" stroke-width="6" stroke-linecap="round"/><circle r="9" fill="#1E1B3A"/>', { x: 400, y: 300, enter: 'fade', delay: 900 });
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
      var st = s.add('<path d="M-10 0 q-8 -10 0 -20 q8 -10 0 -20 M10 0 q-8 -10 0 -20 q8 -10 0 -20" stroke="#9AA0B4" stroke-width="4" fill="none" stroke-linecap="round"/>', { x: 102, y: 150, enter: 'up', delay: 500 });
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
        keep(s, s.add('<rect x="-28" y="-18" width="56" height="36" rx="8" fill="#FFC93C" stroke="#C2570C" stroke-width="2"/>' + T(0, 1, '40 J', 15, '#1E1B3A', { w: 700 }),
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
      s.add('<path d="M-90 0 L0 -80 L90 0 Z" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/><rect x="-72" y="0" width="144" height="110" fill="#FFF4D6" stroke="#1E1B3A" stroke-width="3"/>' +
        '<rect x="-20" y="48" width="40" height="62" fill="#8A5A2B"/><rect x="-60" y="20" width="30" height="30" fill="#FFE9A8" stroke="#1E1B3A" stroke-width="2"/><rect x="30" y="20" width="30" height="30" fill="#FFE9A8" stroke="#1E1B3A" stroke-width="2"/>',
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
      s.add('<path d="M-130 -60 H100 L150 0 L100 60 H-130 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="4"/><circle cx="110" cy="0" r="10" fill="#FFFDF7" stroke="#C2570C" stroke-width="3"/>' +
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
        reading.split('').forEach(function (d, i) { digits += '<rect x="' + (-75 + i * 30) + '" y="-20" width="26" height="40" rx="4" fill="#1E1B3A"/>' + T(-62 + i * 30, 1, d, 26, '#FFFFFF', { w: 700 }); });
        return '<rect x="-100" y="-70" width="200" height="140" rx="16" fill="#E6E8F0" stroke="#55526E" stroke-width="4"/>' + T(0, -46, 'kWh', 16, '#55526E', { w: 700 }) + digits;
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
      var sw = '<rect x="-30" y="-44" width="60" height="88" rx="10" fill="#FFFFFF" stroke="#55526E" stroke-width="3"/><rect x="-14" y="-10" width="28" height="40" rx="6" fill="#9AA0B4"/>' + T(0, -26, 'OFF', 14, '#E5484D', { w: 700 });
      var shower = '<path d="M-30 -40 H10 Q30 -40 30 -20" stroke="#55526E" stroke-width="6" fill="none"/><path d="M14 -20 H46 L40 -10 H20 Z" fill="#9AA0B4"/>' +
        [18, 26, 34, 42].map(function (x, i) { return '<path d="M' + x + ' -4 l-3 ' + (24 + i * 6) + '" stroke="#2F80ED" stroke-width="3" stroke-linecap="round"/>'; }).join('');
      var dial = '<circle r="40" fill="#FFFFFF" stroke="#55526E" stroke-width="4"/><path d="M-28 20 A34 34 0 1 1 28 20" stroke="#FF8A3D" stroke-width="8" fill="none"/><path d="M0 0 L-18 -18" stroke="#1E1B3A" stroke-width="5" stroke-linecap="round"/><circle r="6" fill="#1E1B3A"/>' +
        '<path d="M44 -30 v24 m-8 -8 l8 8 l8 -8" stroke="#2F80ED" stroke-width="4" fill="none" stroke-linecap="round"/>';
      var items = [[sw, 'switch off', 'lights and screens'], [LED, 'LED bulbs', ''], [shower, 'shorter', 'showers'], [dial, 'heating', 'down a little']];
      items.forEach(function (it, k) {
        var x = 90 + k * 153;
        s.add('<rect x="-68" y="-110" width="136" height="230" rx="18" fill="#FFFFFF" stroke="#22A06B" stroke-width="3"/>', { x: x, y: 200, enter: 'pop', delay: k * 400 });
        s.add(it[0], { x: x, y: 160, enter: 'pop', delay: k * 400 + 150 });
        s.text(x, 248, it[1], { size: 19, weight: 700, colour: s.C.green, delay: k * 400 + 250 });
        if (it[2]) s.text(x, 274, it[2], { size: 15, colour: s.C.muted, delay: k * 400 + 300 });
      });
    },
    'save-planet': function (s) {
      fresh(s);
      var pig = '<ellipse rx="70" ry="54" fill="#FF9EBB" stroke="#C2306A" stroke-width="3"/><ellipse cx="66" cy="4" rx="16" ry="14" fill="#FF7BA3" stroke="#C2306A" stroke-width="3"/><circle cx="62" cy="2" r="3" fill="#C2306A"/><circle cx="70" cy="2" r="3" fill="#C2306A"/>' +
        '<circle cx="34" cy="-18" r="6" fill="#1E1B3A"/><path d="M20 -46 l6 -22 l16 16 Z" fill="#FF7BA3" stroke="#C2306A" stroke-width="3"/><rect x="-30" y="-58" width="36" height="8" rx="4" fill="#C2306A"/>' +
        '<path d="M-40 46 v20 M30 46 v20" stroke="#C2306A" stroke-width="10" stroke-linecap="round"/>';
      s.add(pig, { x: 170, y: 180, enter: 'pop' });
      var c = s.add(coin('£'), { x: 158, y: 60, enter: 'down', delay: 400 });
      s.move(c, 158, 116, 600, { delay: 900, easing: 'ease-in' });
      s.hide(c, { delay: 1500, ms: 200 });
      s.text(170, 290, 'saves money', { size: 26, weight: 700, colour: s.C.pink, delay: 1000 });
      s.add('<circle r="80" fill="#2F80ED"/><path d="M-50 -30 q20 -18 40 0 t40 6 M-40 30 q30 -14 60 4" stroke="#22A06B" stroke-width="18" fill="none" stroke-linecap="round"/>', { x: 470, y: 170, enter: 'pop', delay: 1400 });
      s.add('<path d="M0 12 C-30 -10 -18 -36 0 -22 C18 -36 30 -10 0 12 Z" fill="#E5484D" stroke="#FFFFFF" stroke-width="3"/>', { x: 540, y: 96, enter: 'pop', delay: 2000 });
      s.text(470, 290, 'less fuel burned', { size: 26, weight: 700, colour: s.C.green, delay: 1800 });
    }
  });
})();
