/* Pictures for the Forces theory video (words: videos/physics/forces.json). Stage is 640 x 360; see static/js/theory.js.
   Arrow lengths are drawn to scale inside each picture (e.g. the 10 N arrow is twice the 5 N arrow). */
(function () {
  if (!window.Theory) return;

  var BOX = '<rect width="100" height="80" rx="6" fill="#E0A96D" stroke="#8A5A2B" stroke-width="3"/>' +
            '<path d="M0 24 H100 M50 0 V24" stroke="#8A5A2B" stroke-width="3" fill="none"/>';
  function car(col) {
    return '<path d="M8 40 Q10 20 34 18 L52 2 Q60 -2 84 2 L104 18 Q126 20 128 40 V52 H8 Z" fill="' + col + '" stroke="#1E1B3A" stroke-width="3"/>' +
      '<path d="M44 18 L56 7 H76 V18 Z M82 18 V7 H90 L100 18 Z" fill="#CFE8FF"/>' +
      '<circle cx="36" cy="54" r="13" fill="#1E1B3A"/><circle cx="36" cy="54" r="5" fill="#C9CED8"/>' +
      '<circle cx="104" cy="54" r="13" fill="#1E1B3A"/><circle cx="104" cy="54" r="5" fill="#C9CED8"/>';
  }
  var BAG = '<path d="M30 18 Q50 -6 70 18" fill="none" stroke="#2D1B69" stroke-width="7" stroke-linecap="round"/>' +
            '<rect x="8" y="16" width="84" height="92" rx="18" fill="#6C4DF6" stroke="#2D1B69" stroke-width="3"/>' +
            '<rect x="22" y="56" width="56" height="34" rx="8" fill="#4A33C9"/>' +
            '<rect x="30" y="28" width="40" height="18" rx="5" fill="#FFF4D6"/><text x="50" y="38" font-family="Fredoka, sans-serif" font-size="15" font-weight="700" text-anchor="middle" dominant-baseline="middle" fill="#1E1B3A">2 kg</text>';
  function spring(len) {   // a hanging spring, top at 0, 100 units long before scaling
    var d = 'M0 0 V10', n = 9;
    for (var i = 0; i < n; i++) d += ' L' + (i % 2 ? -14 : 14) + ' ' + (10 + (i + .5) * 80 / n);
    d += ' L0 90 V100';
    return '<path d="' + d + '" fill="none" stroke="#55526E" stroke-width="4" stroke-linejoin="round"/>';
  }
  function weight(label, w) {
    w = w || 50;
    return '<path d="M0 -14 V0" stroke="#55526E" stroke-width="4"/><path d="M' + (-w / 2) + ' 0 H' + (w / 2) + ' L' + (w / 2 - 6) + ' 40 H' + (-w / 2 + 6) + ' Z" fill="#55526E"/>' +
      '<text x="0" y="22" font-family="Fredoka, sans-serif" font-size="16" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">' + label + '</text>';
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }

  Theory.scenes({
    /* ---------- 1. What is a force? ---------- */
    'push-box': function (s) {
      s.ground(290);
      s.add(BOX, { x: 290, y: 210, enter: 'pop', name: 'box' });
      s.owl(225, 292, 110, { name: 'owl', delay: 200 });
      s.text(320, 60, 'push!', { size: 40, colour: s.C.red, delay: 600, name: 'pushword' });
      s.arrow(490, 250, 110, 'r', { label: 'push', delay: 1900, name: 'pusharrow' });
      s.move(s.ref.box, 390, 210, 1400, { delay: 900 });
      s.move(s.ref.owl, 325, 292, 1400, { delay: 900 });
      
    },
    'ball-motion': function (s) {
      hideAll(s, ['box', 'owl', 'pushword', 'pusharrow']);
      var rows = [['speeds up', 90, 'ease-in'], ['slows down', 180, 'ease-out'], ['changes direction', 270, 'turn']];
      rows.forEach(function (r, i) {
        s.text(20, r[1] - 34, r[0], { size: 22, anchor: 'start', colour: s.C.deep, delay: i * 900 });
        var b = s.add('<circle r="18" fill="#FF8A3D" stroke="#C2570C" stroke-width="3"/>', { x: 40, y: r[1], enter: 'pop', delay: i * 900 });
        if (r[2] === 'turn') {
          s.add('<rect x="0" y="-34" width="18" height="68" rx="4" fill="#8A5A2B"/>', { x: 400, y: r[1], enter: 'up', delay: i * 900 });
          s.move(b, 380, r[1], 900, { delay: i * 900 + 200, easing: 'linear' });
          s.hide(b, { delay: i * 900 + 1100, ms: 1 });
          var b3 = s.add('<circle r="18" fill="#FF8A3D" stroke="#C2570C" stroke-width="3"/>', { x: 380, y: r[1], enter: 'fade', ms: 1, delay: i * 900 + 1100 });
          s.move(b3, 170, r[1], 900, { delay: i * 900 + 1100, easing: 'linear' });
          s.arrow(398, r[1], 70, 'l', { colour: s.C.fun, width: 7, label: 'wall pushes back', size: 16, delay: i * 900 + 1100 });
        } else {
          s.move(b, 560, r[1], 1600, { delay: i * 900 + 200, easing: r[2] });
        }
        s.ref['row' + i] = b;
      });
    },
    'ball-squash': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Forces can change shape', { size: 28, colour: s.C.deep });
      s.add('<circle r="70" fill="#FF8A3D" stroke="#C2570C" stroke-width="4"/><path d="M-40 -30 Q-20 -55 10 -50" stroke="#FFD2B0" stroke-width="8" fill="none" stroke-linecap="round"/>',
        { x: 320, y: 210, enter: 'pop', name: 'ball' });
      s.arrow(120, 210, 110, 'r', { label: 'squeeze', delay: 500 });
      s.arrow(520, 210, 110, 'l', { label: 'squeeze', delay: 500 });
      s.anim(s.ref.ball, [{ transform: 'scale(1,1)' }, { transform: 'scale(.72,1.2)' }], 700, { delay: 1100, easing: 'cubic-bezier(.3,1.5,.6,1)' });
    },
    'newtons': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 70, 'We measure force in', { size: 28, colour: s.C.muted });
      s.text(320, 140, 'newtons', { size: 64, weight: 700, colour: s.C.fun, enter: 'pop', delay: 300 });
      s.add('<circle r="46" fill="#FFF4D6" stroke="#FFC93C" stroke-width="5"/><text y="3" font-family="Fredoka, sans-serif" font-size="56" font-weight="700" fill="#E5484D" text-anchor="middle" dominant-baseline="middle">N</text>',
        { x: 320, y: 240, enter: 'pop', delay: 1100 });
      s.text(320, 320, 'A small apple weighs about 1 N', { size: 20, colour: s.C.muted, delay: 1800 });
      s.add('<circle cx="0" cy="4" r="16" fill="#E5484D"/><path d="M0 -10 q2 -8 8 -10" stroke="#22A06B" stroke-width="4" fill="none" stroke-linecap="round"/>', { x: 500, y: 316, enter: 'pop', delay: 2000 });
    },
    'arrows': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Force arrows', { size: 30, colour: s.C.deep });
      s.add('<circle r="12" fill="#1E1B3A"/>', { x: 120, y: 140, enter: 'pop' });
      s.add('<circle r="12" fill="#1E1B3A"/>', { x: 120, y: 260, enter: 'pop' });
      s.arrow(120, 140, 160, 'r', { label: '5 N', colour: s.C.blue, delay: 400 });
      s.arrow(120, 260, 320, 'r', { label: '10 N', delay: 1300 });
      s.add('<path d="M120 300 V312 H440 V300" fill="none" stroke="#55526E" stroke-width="3"/>', { enter: 'fade', delay: 2100 });
      s.text(280, 334, 'twice as long = twice the force', { size: 20, colour: s.C.muted, delay: 2200 });
    },

    /* ---------- 2. Contact and non-contact forces ---------- */
    'contact-title': function (s) {
      s.text(320, 120, 'Contact forces', { size: 52, weight: 700, colour: s.C.sci, enter: 'pop' });
      s.text(320, 190, 'act when things touch', { size: 28, colour: s.C.muted, delay: 500 });
      s.add('<path d="M0 0 h60" stroke="#0F9488" stroke-width="6" stroke-linecap="round"/><circle cx="0" r="14" fill="#0F9488"/><circle cx="74" r="14" fill="#6C4DF6"/>',
        { x: 283, y: 260, enter: 'pop', delay: 900 });
    },
    'friction': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Friction', { size: 34, weight: 700, colour: s.C.sci });
      s.ground(290);
      var b = s.add(BOX, { x: 60, y: 210, enter: 'fade' });
      s.move(b, 300, 210, 2200, { delay: 200, easing: 'cubic-bezier(.1,.7,.4,1)' });
      s.add('<path d="M0 0 l10 -10 M14 0 l10 -10 M28 0 l10 -10 M42 0 l10 -10 M56 0 l10 -10 M70 0 l10 -10" stroke="#8A5A2B" stroke-width="3"/>', { x: 305, y: 300, enter: 'fade', delay: 1600 });
      s.arrow(350, 150, 120, 'r', { label: 'sliding this way', colour: s.C.fun, width: 7, size: 18, delay: 1500 });
      s.arrow(300, 290, 110, 'l', { label: 'friction', labelSide: 'below', delay: 2200 });
    },
    'air-resistance': function (s) {
      s.clear(); s.ref = {};
      s.text(160, 40, 'Air resistance', { size: 30, weight: 700, colour: s.C.sci });
      var p = s.add('<path d="M-80 0 Q0 -70 80 0 Q60 -10 40 0 Q20 -10 0 0 Q-20 -10 -40 0 Q-60 -10 -80 0 Z" fill="#FF5D8F" stroke="#B42318" stroke-width="3"/>' +
        '<path d="M-78 0 L-8 80 M78 0 L8 80 M0 0 V78" stroke="#55526E" stroke-width="2"/>' +
        '<circle cx="0" cy="88" r="10" fill="#FFC93C"/><rect x="-9" y="96" width="18" height="30" rx="6" fill="#2F80ED"/>', { x: 420, y: 40, enter: 'down' });
      s.move(p, 420, 150, 3000, { delay: 300, easing: 'linear' });
      s.arrow(420, 140, 90, 'u', { label: 'air resistance', labelSide: 'left', colour: s.C.blue, delay: 3300, size: 18 });
      s.add('<path d="M0 0 v-40 M30 20 v-40 M-30 30 v-40" stroke="#9AA0B4" stroke-width="3" stroke-dasharray="6 8" stroke-linecap="round"/>', { x: 540, y: 320, enter: 'up', delay: 600 });
      s.text(160, 200, 'and in water:', { size: 22, colour: s.C.muted, delay: 3000 });
      s.text(160, 240, 'water resistance', { size: 26, weight: 700, colour: s.C.blue, delay: 3200 });
    },
    'gravity': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Non-contact forces act across a gap', { size: 26, weight: 700, colour: s.C.pink });
      s.ground(300);
      s.add('<rect x="-14" y="0" width="28" height="140" fill="#8A5A2B"/><circle cx="0" cy="-10" r="70" fill="#22A06B"/><circle cx="-50" cy="20" r="45" fill="#22A06B"/><circle cx="55" cy="25" r="45" fill="#1B8A5A"/>',
        { x: 140, y: 160, enter: 'up' });
      var ap = s.add('<circle r="14" fill="#E5484D"/><path d="M0 -12 q2 -8 8 -10" stroke="#22A06B" stroke-width="4" fill="none"/>', { x: 220, y: 170, enter: 'pop', delay: 300 });
      s.move(ap, 300, 284, 1300, { delay: 900, easing: 'cubic-bezier(.5,0,1,1)' });
      s.arrow(400, 150, 110, 'd', { label: 'gravity', colour: s.C.red, delay: 1200 });
      s.add('<circle r="14" fill="#E5484D" opacity=".35"/>', { x: 400, y: 136, enter: 'fade', delay: 1100 });
    },
    'magnet': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Magnetism', { size: 30, weight: 700, colour: s.C.pink });
      s.add('<path d="M0 -60 H50 V60 H0 V30 H25 V-30 H0 Z" fill="#E5484D" stroke="#B42318" stroke-width="3" transform="scale(-1,1)"/>' +
        '<rect x="-50" y="-60" width="20" height="30" fill="#C9CED8"/><rect x="-50" y="30" width="20" height="30" fill="#C9CED8"/>',
        { x: 500, y: 190, enter: 'pop' });
      var clip = s.add('<path d="M0 -10 H40 a10 10 0 0 1 0 20 H6 a6 6 0 0 1 0 -12 H34" fill="none" stroke="#55526E" stroke-width="4" stroke-linecap="round"/>', { x: 140, y: 190, enter: 'pop', delay: 300 });
      s.move(clip, 380, 190, 1600, { delay: 1200, easing: 'cubic-bezier(.6,0,1,1)' });
      s.arrow(150, 260, 140, 'r', { label: 'pulled across the gap', labelSide: 'below', colour: s.C.fun, width: 7, size: 18, delay: 700 });
      s.text(320, 320, 'Static electricity works across a gap too', { size: 20, colour: s.C.muted, delay: 2600 });
    },

    /* ---------- 3. Resultant force ---------- */
    'two-forces': function (s) {
      s.text(320, 40, 'Resultant force', { size: 34, weight: 700, colour: s.C.fun });
      s.text(320, 84, '= all the forces added up', { size: 24, colour: s.C.muted, delay: 400 });
      s.ground(280);
      s.add(BOX, { x: 270, y: 200, enter: 'pop', name: 'box', delay: 600 });
    },
    'same-way': function (s) {
      s.hide(s.ref.box);
      var b = s.add(BOX, { x: 270, y: 200, enter: 'none', name: 'box2' });
      s.owl(150, 282, 80, { delay: 100 }); s.owl(225, 282, 80, { delay: 300 });
      s.arrow(370, 220, 100, 'r', { label: '5 N', colour: s.C.blue, delay: 700, labelSide: 'above' });
      s.arrow(470, 220, 60, 'r', { label: '3 N', colour: s.C.sun, delay: 1400, labelSide: 'above' });
      s.arrow(370, 150, 160, 'r', { label: 'resultant 8 N', colour: s.C.green, delay: 2400 });
      s.text(320, 330, '5 N + 3 N = 8 N', { size: 26, weight: 700, colour: s.C.green, delay: 2600 });
    },
    'opposite': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Opposite directions: take away', { size: 28, weight: 700, colour: s.C.fun });
      s.ground(280);
      s.add(BOX, { x: 270, y: 200, enter: 'fade', name: 'box' });
      s.owl(215, 282, 90, { name: 'owl', delay: 200 });
      s.arrow(370, 225, 200, 'r', { label: 'push 10 N', colour: s.C.blue, delay: 600 });
      s.arrow(320, 300, 80, 'l', { label: 'friction 4 N', colour: s.C.red, labelSide: 'below', delay: 1600 });
    },
    'opposite-answer': function (s) {
      s.text(320, 90, '10 N − 4 N = 6 N', { size: 32, weight: 700, colour: s.C.green, enter: 'pop' });
      s.arrow(320, 145, 120, 'r', { label: 'resultant 6 N', colour: s.C.green, delay: 700 });
    },

    /* ---------- 4. Balanced and unbalanced forces ---------- */
    'book': function (s) {
      s.add('<rect x="0" y="0" width="300" height="16" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><rect x="20" y="16" width="16" height="110" fill="#8A5A2B"/><rect x="264" y="16" width="16" height="110" fill="#8A5A2B"/>',
        { x: 170, y: 220, enter: 'up' });
      s.add('<rect x="0" y="0" width="120" height="34" rx="4" fill="#2F80ED" stroke="#1E1B3A" stroke-width="3"/><rect x="8" y="8" width="104" height="6" fill="#CFE8FF"/>',
        { x: 260, y: 186, enter: 'down', delay: 300 });
      s.arrow(320, 236, 90, 'd', { label: 'gravity 5 N', colour: s.C.red, delay: 1000 });
      s.arrow(320, 186, 90, 'u', { label: 'table 5 N', colour: s.C.blue, labelSide: 'left', delay: 2200 });
    },
    'book-balanced': function (s) {
      s.text(530, 120, 'Balanced!', { size: 34, weight: 700, colour: s.C.green, enter: 'pop' });
      s.text(530, 168, 'resultant = 0 N', { size: 24, colour: s.C.ink, delay: 500 });
      s.add('<path d="M-40 0 H40 M0 0 V40 M-30 40 H30" stroke="#55526E" stroke-width="4" stroke-linecap="round"/><path d="M-40 0 l-14 24 h28 Z M40 0 l-14 24 h28 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="2"/>',
        { x: 530, y: 210, enter: 'pop', delay: 900 });
    },
    'car-steady': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Balanced: same speed, same direction', { size: 26, weight: 700, colour: s.C.green });
      s.add('<rect x="0" y="0" width="640" height="80" fill="#5A5F73"/><path d="M0 40 H640" stroke="#fff" stroke-width="4" stroke-dasharray="30 24"/>', { y: 280, enter: 'fade' });
      var c = s.add(car('#22A06B'), { x: 40, y: 214, enter: 'fade' });
      var f = s.arrow(176, 228, 100, 'r', { label: 'driving force', colour: s.C.blue, size: 18 });
      var r = s.arrow(40, 228, 100, 'l', { label: 'air resistance', colour: s.C.red, size: 18 });
      s.move(c, 260, 214, 3200, { delay: 500, easing: 'linear' });
      s.move(f, 396, 228, 3200, { delay: 500, easing: 'linear' });
      s.move(r, 260, 228, 3200, { delay: 500, easing: 'linear' });
    },
    'car-faster': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Unbalanced: speeds up', { size: 28, weight: 700, colour: s.C.orange });
      s.add('<rect x="0" y="0" width="640" height="80" fill="#5A5F73"/><path d="M0 40 H640" stroke="#fff" stroke-width="4" stroke-dasharray="30 24"/>', { y: 280, enter: 'none' });
      var c = s.add(car('#FF8A3D'), { x: 40, y: 214, enter: 'fade' });
      var f = s.arrow(176, 228, 170, 'r', { label: 'driving force', colour: s.C.blue, size: 18 });
      var r = s.arrow(40, 228, 60, 'l', { label: 'air resistance', colour: s.C.red, size: 18 });
      s.move(c, 260, 214, 2600, { delay: 600, easing: 'ease-in' });
      s.move(f, 396, 228, 2600, { delay: 600, easing: 'ease-in' });
      s.move(r, 260, 228, 2600, { delay: 600, easing: 'ease-in' });
    },
    'car-slower': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Unbalanced: slows down', { size: 28, weight: 700, colour: s.C.red });
      s.add('<rect x="0" y="0" width="640" height="80" fill="#5A5F73"/><path d="M0 40 H640" stroke="#fff" stroke-width="4" stroke-dasharray="30 24"/>', { y: 280, enter: 'none' });
      var c = s.add(car('#2F80ED'), { x: 150, y: 214, enter: 'fade' });
      var f = s.arrow(286, 228, 50, 'r', { label: 'driving', colour: s.C.blue, size: 18 });
      var r = s.arrow(150, 228, 130, 'l', { label: 'friction + air', colour: s.C.red, size: 18 });
      s.move(c, 330, 214, 2600, { delay: 600, easing: 'ease-out' });
      s.move(f, 466, 228, 2600, { delay: 600, easing: 'ease-out' });
      s.move(r, 330, 228, 2600, { delay: 600, easing: 'ease-out' });
    },

    /* ---------- 5. Mass and weight ---------- */
    'mass': function (s) {
      s.add(BAG, { x: 110, y: 120, enter: 'pop', name: 'bag' });
      s.text(440, 130, 'Mass', { size: 40, weight: 700, colour: s.C.fun, name: 'm1', delay: 400 });
      s.text(440, 180, 'how much stuff', { size: 24, colour: s.C.ink, name: 'm2', delay: 800 });
      s.text(440, 220, 'measured in kg', { size: 24, colour: s.C.ink, name: 'm3', delay: 1200 });
      s.text(440, 260, 'the same everywhere', { size: 24, colour: s.C.ink, name: 'm4', delay: 1600 });
    },
    'weight': function (s) {
      hideAll(s, ['m1', 'm2', 'm3', 'm4']);
      s.add('<ellipse cx="0" cy="0" rx="430" ry="70" fill="#2F80ED"/><path d="M-300 -40 q60 -20 120 0 t100 0 M120 -50 q40 -12 90 0" stroke="#22A06B" stroke-width="18" fill="none" stroke-linecap="round"/>',
        { x: 320, y: 380, enter: 'up', name: 'earth' });
      s.arrow(160, 232, 80, 'd', { label: 'weight', colour: s.C.red, delay: 700, name: 'w' });
      s.text(440, 130, 'Weight', { size: 40, weight: 700, colour: s.C.red, name: 'w1', delay: 300 });
      s.text(440, 180, 'gravity pulling', { size: 24, name: 'w2', delay: 800 });
      s.text(440, 220, 'a force, so in N', { size: 24, name: 'w3', delay: 1200 });
    },
    'weight-calc': function (s) {
      hideAll(s, ['w1', 'w2', 'w3']);
      s.text(440, 100, 'weight = mass × 10 N/kg', { size: 24, weight: 700, colour: s.C.deep, name: 'c1' });
      s.text(440, 160, '2 kg × 10 N/kg', { size: 28, name: 'c2', delay: 900 });
      s.add('<rect x="-70" y="-30" width="140" height="60" rx="16" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/><text font-family="Fredoka, sans-serif" font-size="34" font-weight="700" fill="#0E7A5A" text-anchor="middle" dominant-baseline="middle">= 20 N</text>',
        { x: 440, y: 225, enter: 'pop', delay: 1800, name: 'c3' });
    },
    'moon': function (s) {
      s.clear(); s.ref = {};
      s.add('<path d="M320 0 V360" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>', { enter: 'fade' });
      s.text(160, 30, 'Earth', { size: 28, weight: 700, colour: s.C.blue });
      s.add('<circle r="170" fill="#2F80ED"/><path d="M-120 -120 q40 -14 80 0 M30 -150 q40 -10 70 6" stroke="#22A06B" stroke-width="16" fill="none" stroke-linecap="round"/>', { x: 160, y: 470, enter: 'up' });
      s.add(BAG, { x: 110, y: 70, enter: 'none' });
      s.arrow(160, 182, 80, 'd', { label: '20 N', colour: s.C.red });
      s.text(480, 30, 'Moon', { size: 28, weight: 700, colour: s.C.muted, delay: 500 });
      s.add('<circle r="170" fill="#C9CED8"/><circle cx="-60" cy="-140" r="14" fill="#9AA0B4"/><circle cx="50" cy="-150" r="9" fill="#9AA0B4"/><circle cx="10" cy="-120" r="6" fill="#9AA0B4"/>', { x: 480, y: 470, enter: 'up', delay: 500 });
      s.add(BAG, { x: 430, y: 70, enter: 'pop', delay: 900 });
      s.arrow(480, 182, 13, 'd', { colour: s.C.red, width: 8, delay: 1500 });
      s.text(530, 196, '3.2 N', { size: 22, weight: 700, colour: s.C.red, delay: 1700 });
      s.add('<rect x="-150" y="-22" width="300" height="44" rx="22" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="3"/>', { x: 320, y: 236, enter: 'pop', delay: 2300 });
      s.text(320, 238, 'mass 2 kg in both places', { size: 22, weight: 700, colour: s.C.fun, delay: 2300 });
    },

    /* ---------- 6. Stretching springs (1 cm = 15 units) ---------- */
    'spring-0': function (s) {
      s.add('<rect x="-90" y="-16" width="180" height="16" rx="4" fill="#8A5A2B"/>', { x: 200, y: 50, enter: 'down' });
      var sp = s.add(spring(), { x: 200, y: 50, enter: 'fade', name: 'spring' });
      sp._inner.style.transformOrigin = '50% 0%';
      s.add('<rect x="0" y="0" width="34" height="150" rx="4" fill="#FFF4D6" stroke="#C2570C" stroke-width="2"/>' +
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (k) { return '<path d="M0 ' + (k * 15) + ' h' + (k % 2 ? 8 : 14) + '" stroke="#C2570C" stroke-width="2"/>'; }).join('') +
        '<text x="40" y="0" font-size="13" font-family="Fredoka, sans-serif" fill="#55526E" dominant-baseline="middle">0 cm</text>' +
        '<text x="40" y="90" font-size="13" font-family="Fredoka, sans-serif" fill="#55526E" dominant-baseline="middle">6 cm</text>',
        { x: 250, y: 150, enter: 'fade', delay: 300 });
      s.add('<path d="M-30 0 H30" stroke="#E5484D" stroke-width="3" stroke-dasharray="6 5"/>', { x: 200, y: 150, enter: 'fade', delay: 300 });
      var w = s.add(weight('1 N'), { x: 200, y: 164, enter: 'down', delay: 900, name: 'w' });
      s.anim(sp, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(1.3)' }], 800, { delay: 1400, easing: 'cubic-bezier(.3,1.6,.6,1)' });
      s.move(w, 200, 194, 800, { delay: 1400, easing: 'cubic-bezier(.3,1.6,.6,1)' });
      s.add('<path d="M0 0 h10 v30 h-10" fill="none" stroke="#6C4DF6" stroke-width="3"/>', { x: 135, y: 150, enter: 'fade', delay: 2200, name: 'ext' });
      s.text(130, 165, 'extension', { size: 18, weight: 700, colour: s.C.fun, anchor: 'end', delay: 2300, name: 'extt' });
    },
    'spring-123': function (s) {
      var sp = s.ref.spring, w = s.ref.w;
      s.hide(s.ref.ext); s.hide(s.ref.extt);
      s.add('<rect x="0" y="0" width="230" height="170" rx="14" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="3"/>' +
        '<text x="60" y="28" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#2D1B69" text-anchor="middle">Force</text>' +
        '<text x="165" y="28" font-family="Fredoka, sans-serif" font-size="18" font-weight="700" fill="#2D1B69" text-anchor="middle">Extension</text>' +
        '<path d="M14 44 H216 M115 14 V156" stroke="#EAE2D6" stroke-width="2"/>', { x: 380, y: 60, enter: 'fade' });
      [['1 N', '2 cm'], ['2 N', '4 cm'], ['3 N', '6 cm']].forEach(function (r, k) {
        var dl = k * 1800;
        s.text(440, 132 + k * 36, r[0], { size: 22, delay: dl + 200 });
        s.text(545, 132 + k * 36, r[1], { size: 22, weight: 700, colour: s.C.fun, delay: dl + 900 });
        if (k) {
          s.remove(w);
          w = s.add(weight(r[0], 50 + k * 8), { x: 200, y: 164 + 30 * (k - 1) + 30, enter: 'fade', ms: 1, delay: dl });
          s.anim(sp, [{ transform: 'scaleY(' + (1 + .3 * k) + ')' }, { transform: 'scaleY(' + (1 + .3 * (k + 1)) + ')' }], 800, { delay: dl + 300, easing: 'cubic-bezier(.3,1.6,.6,1)' });
          s.move(w, 200, 164 + 30 * (k + 1), 800, { delay: dl + 300, easing: 'cubic-bezier(.3,1.6,.6,1)' });
        }
      });
      s.ref.w = w;
    },
    'spring-graph': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Double the force, double the extension', { size: 24, weight: 700, colour: s.C.fun });
      var ox = 180, oy = 310, kx = 80, ky = 35;   // 1 N = 80 units across, 1 cm = 35 units up
      var grid = '';
      for (var n = 1; n <= 3; n++) grid += '<path d="M' + (ox + n * kx) + ' ' + oy + ' v6" stroke="#55526E" stroke-width="2"/><text x="' + (ox + n * kx) + '" y="' + (oy + 22) + '" font-family="Fredoka, sans-serif" font-size="15" text-anchor="middle" fill="#55526E">' + n + '</text>';
      for (var c = 2; c <= 6; c += 2) grid += '<path d="M' + ox + ' ' + (oy - c * ky) + ' h-6" stroke="#55526E" stroke-width="2"/><text x="' + (ox - 10) + '" y="' + (oy - c * ky) + '" font-family="Fredoka, sans-serif" font-size="15" text-anchor="end" dominant-baseline="middle" fill="#55526E">' + c + '</text>';
      s.add('<path d="M' + ox + ' ' + (oy - 240) + ' V' + oy + ' H' + (ox + 300) + '" fill="none" stroke="#1E1B3A" stroke-width="3"/>' + grid +
        '<text x="' + (ox + 150) + '" y="' + (oy + 44) + '" font-family="Fredoka, sans-serif" font-size="17" text-anchor="middle" fill="#1E1B3A">force (N)</text>' +
        '<text x="' + (ox - 50) + '" y="' + (oy - 120) + '" font-family="Fredoka, sans-serif" font-size="17" text-anchor="middle" fill="#1E1B3A" transform="rotate(-90 ' + (ox - 50) + ' ' + (oy - 120) + ')">extension (cm)</text>', { enter: 'fade' });
      var line = s.add('<path d="M' + ox + ' ' + oy + ' L' + (ox + 3.3 * kx) + ' ' + (oy - 6.6 * ky) + '" stroke="#6C4DF6" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>', { enter: 'none' });
      s.anim(line, [{ opacity: 1 }], 1, {});
      var path = line.querySelector('path');
      if (path.animate && !s.fast) path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1400, delay: 400, fill: 'both' });
      else path.setAttribute('stroke-dashoffset', '0');
      [1, 2, 3].forEach(function (n) { s.add('<circle r="8" fill="#FF8A3D" stroke="#C2570C" stroke-width="2"/>', { x: ox + n * kx, y: oy - 2 * n * ky, enter: 'pop', delay: 400 + n * 450 }); });
      s.text(470, 150, "Hooke's law", { size: 26, weight: 700, colour: s.C.sci, delay: 2000 });
      s.text(470, 186, 'a straight line', { size: 20, colour: s.C.muted, delay: 2300 });
      s.text(470, 212, 'through zero', { size: 20, colour: s.C.muted, delay: 2400 });
    },
    'spring-broken': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Too much force damages the spring', { size: 24, weight: 700, colour: s.C.red });
      s.add('<rect x="-90" y="-16" width="180" height="16" rx="4" fill="#8A5A2B"/>', { x: 240, y: 70, enter: 'none' });
      var sp = s.add(spring(), { x: 240, y: 70, enter: 'none' });
      sp._inner.style.transformOrigin = '50% 0%';
      var w = s.add(weight('lots!', 80), { x: 240, y: 184, enter: 'down' });
      s.anim(sp, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(2.3)' }], 900, { delay: 500, easing: 'cubic-bezier(.3,1.5,.6,1)' });
      s.move(w, 240, 314, 900, { delay: 500, easing: 'cubic-bezier(.3,1.5,.6,1)' });
      s.hide(w, { delay: 1900 });
      s.anim(sp, [{ transform: 'scaleY(2.3)' }, { transform: 'scaleY(1.6)' }], 700, { delay: 2100 });
      s.add('<path d="M-30 0 H30" stroke="#E5484D" stroke-width="3" stroke-dasharray="6 5"/>', { x: 240, y: 170, enter: 'fade', delay: 2100 });
      s.text(280, 172, 'old length', { size: 17, colour: s.C.red, anchor: 'start', delay: 2200 });
      s.text(480, 240, 'stays stretched', { size: 24, weight: 700, colour: s.C.red, delay: 2800 });
      s.text(480, 274, "Hooke's law stops working", { size: 19, colour: s.C.muted, delay: 3200 });
    }
  });
})();
