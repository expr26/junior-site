/* Pictures for the Static electricity theory video (words: videos/physics/static-electricity.json). Stage is 640 x 360; see static/js/theory.js.
   Red circles with + are positive charges (protons), blue circles with − are electrons. Only the blue ones ever move. */
(function () {
  if (!window.Theory) return;

  var INK = '#1E1B3A', FONT = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function T(x, y, txt, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (o.size || 18) + '" font-weight="' + (o.weight || 600) + '" fill="' + (o.colour || INK) +
      '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="middle" stroke="' + (o.halo || '#FFFDF7') + '" stroke-width="4" paint-order="stroke">' + txt + '</text>';
  }
  function plus(x, y, r) {
    r = r || 9;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#E5484D" stroke="#FFFFFF" stroke-width="1.5"/><path d="M' + (x - r * .5) + ' ' + y + ' H' + (x + r * .5) + ' M' + x + ' ' + (y - r * .5) + ' V' + (y + r * .5) + '" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>';
  }
  function minus(x, y, r) {
    r = r || 9;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#2F80ED" stroke="#FFFFFF" stroke-width="1.5"/><path d="M' + (x - r * .5) + ' ' + y + ' H' + (x + r * .5) + '" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>';
  }
  function neutron(x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r || 9) + '" fill="#9AA0B4" stroke="#FFFFFF" stroke-width="1.5"/>'; }
  function signs(list, r) { return list.map(function (c) { return c[2] === '+' ? plus(c[0], c[1], r) : minus(c[0], c[1], r); }).join(''); }
  function balloon(fill, rx, ry) {   // centred at (0, 0), knot and string below
    rx = rx || 56; ry = ry || 66;
    return '<path d="M0 ' + ry + ' q-20 40 6 80" fill="none" stroke="#55526E" stroke-width="2"/><path d="M-7 ' + (ry + 8) + ' L0 ' + (ry - 2) + ' L7 ' + (ry + 8) + ' Z" fill="' + fill + '"/>' +
      '<ellipse rx="' + rx + '" ry="' + ry + '" fill="' + fill + '" stroke="' + INK + '" stroke-width="3"/><ellipse cx="' + (-rx * .45) + '" cy="' + (-ry * .45) + '" rx="' + (rx * .16) + '" ry="' + (ry * .22) + '" fill="#FFFFFF" opacity=".45"/>';
  }
  /* a balloon hanging on a thread from a pivot at (px, 46): drawn in stage coordinates so it can swing about the pivot */
  function hang(s, px, fill, sg, o) {
    var cy = 182, list = sg === '+' ? [[px - 10, cy - 14, '+'], [px + 10, cy, '+'], [px - 6, cy + 16, '+']] : [[px - 10, cy - 14, '-'], [px + 10, cy, '-'], [px - 6, cy + 16, '-']];
    var g = s.add('<path d="M' + px + ' 46 V142" stroke="#55526E" stroke-width="2"/><path d="M' + (px - 6) + ' 148 L' + px + ' 140 L' + (px + 6) + ' 148 Z" fill="' + fill + '"/>' +
      '<ellipse cx="' + px + '" cy="' + cy + '" rx="30" ry="38" fill="' + fill + '" stroke="' + INK + '" stroke-width="3"/>' + signs(list, 8), Object.assign({ enter: 'fade' }, o || {}));
    g._inner.style.transformBox = 'view-box'; g._inner.style.transformOrigin = px + 'px 46px';
    return g;
  }
  function swing(s, g, deg, o) { s.anim(g, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(' + deg + 'deg)' }], 1100, Object.assign({ easing: 'cubic-bezier(.3,1.5,.6,1)' }, o || {})); }
  var HEAD = [[-40, -50], [-10, -66], [24, -64], [50, -44], [-58, -20], [62, -16]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="28" fill="#A0673A" stroke="' + INK + '" stroke-width="3"/>'; }).join('') +
    [[-40, -50], [-10, -66], [24, -64], [50, -44], [-58, -20], [62, -16]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="25" fill="#A0673A"/>'; }).join('') +
    '<circle r="58" fill="#F4C7A1" stroke="' + INK + '" stroke-width="3"/>' +
    '<circle cx="-20" cy="6" r="5" fill="' + INK + '"/><circle cx="20" cy="6" r="5" fill="' + INK + '"/><path d="M-16 26 Q0 38 16 26" fill="none" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
  function bricks(x0) {
    var b = '<rect x="' + x0 + '" y="0" width="' + (640 - x0) + '" height="360" fill="#E8A87C"/>';
    for (var r = 0; r < 12; r++) {
      b += '<path d="M' + x0 + ' ' + (r * 30) + ' H640" stroke="#C97B52" stroke-width="2"/>';
      for (var c = x0 + (r % 2 ? 20 : 50); c < 640; c += 60) b += '<path d="M' + c + ' ' + (r * 30) + ' v30" stroke="#C97B52" stroke-width="2"/>';
    }
    return b;
  }
  var BOLT = 'M0 0 L-22 60 L8 60 L-18 130 L26 50 L-4 50 L18 0 Z';

  Theory.scenes({
    /* ---------- 1. Charges in atoms: atom centred at (190, 190) ---------- */
    'atom': function (s) {
      var orbits = [0, 60, -60].map(function (a) { return '<ellipse rx="120" ry="44" fill="none" stroke="#9AA0B4" stroke-width="2.5" transform="rotate(' + a + ')"/>'; }).join('');
      var nuc = [[-8, -8, 'p'], [9, -9, 'n'], [-10, 8, 'n'], [8, 9, 'p'], [0, -1, 'p'], [0, 17, 'n']].map(function (c) { return c[2] === 'p' ? plus(c[0], c[1], 10) : neutron(c[0], c[1], 10); }).join('');
      s.add(orbits, { x: 190, y: 190, enter: 'pop' });
      s.add('<circle r="30" fill="#FFF4D6" opacity=".9"/>' + nuc, { x: 190, y: 190, enter: 'pop', delay: 300, name: 'nuc' });
      [[-120, 0], [60, 104], [60, -104]].forEach(function (p, k) {
        s.add(minus(0, 0, 10), { x: 190 + p[0], y: 190 + p[1], enter: 'pop', delay: 700 + k * 200, name: 'e' + k });
      });
      s.text(470, 150, 'An atom', { size: 34, weight: 700, colour: s.C.deep, delay: 300, name: 'a1' });
      s.text(470, 196, 'far too small to see,', { size: 20, colour: s.C.muted, delay: 900, name: 'a2' });
      s.text(470, 224, 'even with a microscope', { size: 20, colour: s.C.muted, delay: 1100, name: 'a3' });
    },
    'particles': function (s) {
      ['a1', 'a2', 'a3'].forEach(function (n) { s.hide(s.ref[n]); });
      var rows = [[plus(0, 0, 13), 'proton', 'positive (+)', '#E5484D'], [minus(0, 0, 13), 'electron', 'negative (−)', '#2F80ED'], [neutron(0, 0, 13), 'neutron', 'no charge', '#55526E']];
      rows.forEach(function (r, k) {
        s.add(r[0] + T(26, -12, r[1], { size: 22, weight: 700, colour: r[3], anchor: 'start' }) + T(26, 14, r[2], { size: 18, anchor: 'start' }), { x: 410, y: 100 + k * 90, enter: 'left', delay: k * 700, name: 'l' + k });
      });
    },
    'nucleus': function (s) {
      ['l0', 'l1', 'l2'].forEach(function (n) { s.hide(s.ref[n]); });
      s.add('<circle r="34" fill="none" stroke="#FF8A3D" stroke-width="3" stroke-dasharray="6 5"/>', { x: 190, y: 190, enter: 'pop', delay: 200 });
      s.add('<path d="M226 186 L380 120" stroke="#FF8A3D" stroke-width="2.5"/>' + T(390, 110, 'nucleus', { size: 22, weight: 700, colour: '#C2570C', anchor: 'start' }) +
        T(390, 138, 'protons and neutrons,', { size: 17, anchor: 'start' }) + T(390, 160, 'held tightly', { size: 17, anchor: 'start' }), { enter: 'fade', delay: 500 });
      s.add(T(390, 236, 'electrons', { size: 22, weight: 700, colour: s.C.blue, anchor: 'start' }) + T(390, 264, 'on the outside', { size: 17, anchor: 'start' }) +
        T(390, 286, 'some can be rubbed off', { size: 17, anchor: 'start' }), { enter: 'fade', delay: 1300 });
      s.move(s.ref.e1, 330, 320, 1200, { delay: 1800, easing: 'ease-in' });
    },
    'neutral': function (s) {
      s.clear(); s.ref = {};
      s.add(balloon('#FF8A3D') + signs([[-28, -30, '+'], [4, -38, '-'], [30, -14, '+'], [-34, 6, '-'], [-4, -6, '+'], [26, 18, '-'], [-20, 34, '+'], [10, 40, '-'], [36, -44, '+'], [-8, 16, '-']]),
        { x: 200, y: 160, enter: 'pop' });
      s.text(450, 100, '5 positive', { size: 26, weight: 700, colour: s.C.red, delay: 600 });
      s.text(450, 140, '5 negative', { size: 26, weight: 700, colour: s.C.blue, delay: 1000 });
      s.text(450, 184, 'they cancel out', { size: 20, delay: 1500 });
      s.add('<rect x="-90" y="-26" width="180" height="52" rx="26" fill="#FFFFFF" stroke="#22A06B" stroke-width="3"/>' + T(0, 1, 'neutral', { size: 28, weight: 700, colour: s.C.green }), { x: 450, y: 250, enter: 'pop', delay: 2000 });
    },

    /* ---------- 2. Charging by rubbing: balloon at (240, 170), head at (470, 220) ---------- */
    'rub': function (s) {
      s.text(320, 30, 'Rub a balloon on your hair', { size: 26, weight: 700, colour: s.C.deep, name: 'title' });
      s.add(HEAD + signs([[-40, -56, '+'], [10, -74, '+'], [48, -46, '+'], [-64, -28, '+'], [-30, -80, '-']], 8), { x: 470, y: 230, enter: 'pop', name: 'head' });
      var hairE = [[456, 156], [500, 160], [530, 200]];
      var b = s.add(balloon('#FF5D8F') + signs([[-26, -30, '+'], [8, -36, '-'], [-30, 8, '-'], [24, -6, '+'], [-6, 30, '+'], [20, 30, '-'], [-10, -2, '+'], [30, 52, '-']], 8),
        { x: 240, y: 170, enter: 'pop', delay: 300, name: 'bal' });
      s.anim(b, [{ transform: 'translate(0,0) rotate(0deg)' }, { transform: 'translate(60px,-20px) rotate(8deg)' }, { transform: 'translate(20px,-10px) rotate(-4deg)' }, { transform: 'translate(60px,-20px) rotate(8deg)' }, { transform: 'translate(0,0) rotate(0deg)' }],
        2000, { delay: 700, easing: 'ease-in-out' });
      hairE.forEach(function (p, k) { s.add(minus(0, 0, 8), { x: p[0], y: p[1], enter: 'pop', delay: 200, name: 'he' + k }); });
      var dest = [[280, 180], [276, 134], [212, 214]];
      hairE.forEach(function (p, k) { s.move(s.ref['he' + k], dest[k][0], dest[k][1], 900, { delay: 2700 + k * 250 }); });
      s.text(380, 330, 'electrons move onto the balloon', { size: 20, weight: 700, colour: s.C.blue, delay: 3000 });
    },
    'balloon-neg': function (s) {
      s.add('<rect x="-104" y="-38" width="208" height="76" rx="18" fill="#FFFFFF" stroke="#2F80ED" stroke-width="3"/>' + T(0, -14, 'gained electrons', { size: 18, colour: s.C.blue }) + T(0, 14, 'negative', { size: 26, weight: 700, colour: s.C.blue }),
        { x: 110, y: 66, enter: 'pop' });
      s.hide(s.ref.title, { ms: 200 });
      s.add(T(100, 124, '4 + and 7 −', { size: 20, weight: 700 }), { enter: 'fade', delay: 500 });
    },
    'hair-pos': function (s) {
      s.add('<rect x="-104" y="-38" width="208" height="76" rx="18" fill="#FFFFFF" stroke="#E5484D" stroke-width="3"/>' + T(0, -14, 'lost electrons', { size: 18, colour: s.C.red }) + T(0, 14, 'positive', { size: 26, weight: 700, colour: s.C.red }),
        { x: 530, y: 80, enter: 'pop' });
      s.add(T(560, 132, '4 + and 1 −', { size: 20, weight: 700 }), { enter: 'fade', delay: 500 });
      s.anim(s.ref.head, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-6deg)' }, { transform: 'rotate(4deg)' }, { transform: 'rotate(0deg)' }], 900, { delay: 900 });
    },
    'only-electrons': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Only electrons move', { size: 30, weight: 700, colour: s.C.deep });
      s.add('<rect x="-130" y="-80" width="260" height="170" rx="20" fill="#E8F1FF" stroke="#2F80ED" stroke-width="3"/>' + minus(-40, -30, 16) +
        '<path d="M-14 -30 H50" stroke="#2F80ED" stroke-width="5" stroke-linecap="round"/><path d="M46 -40 L62 -30 L46 -20 Z" fill="#2F80ED"/>' +
        T(0, 26, 'electrons', { size: 22, weight: 700, colour: s.C.blue }) + T(0, 56, 'can move', { size: 18 }), { x: 170, y: 160, enter: 'pop', delay: 200 });
      s.add('<rect x="-130" y="-80" width="260" height="170" rx="20" fill="#FFEDEE" stroke="#E5484D" stroke-width="3"/>' + plus(-20, -30, 16) +
        '<rect x="10" y="-38" width="30" height="24" rx="4" fill="#FFC93C" stroke="' + INK + '" stroke-width="2.5"/><path d="M15 -38 v-8 a10 10 0 0 1 20 0 v8" fill="none" stroke="' + INK + '" stroke-width="3"/>' +
        T(0, 26, 'protons', { size: 22, weight: 700, colour: s.C.red }) + T(0, 56, 'stuck in the nucleus', { size: 18 }), { x: 470, y: 160, enter: 'pop', delay: 900 });
      s.text(320, 292, 'gain electrons → negative', { size: 20, weight: 700, colour: s.C.blue, delay: 1700 });
      s.text(320, 326, 'lose electrons → positive', { size: 20, weight: 700, colour: s.C.red, delay: 2300 });
    },

    /* ---------- 3. Attract and repel: hanging balloons swing about their pivots ---------- */
    'non-contact': function (s) {
      s.add('<path d="M320 40 V340" stroke="#EAE2D6" stroke-width="3" stroke-dasharray="8 8"/>' +
        '<rect x="60" y="38" width="200" height="8" rx="4" fill="#8A5A2B"/><rect x="380" y="38" width="240" height="8" rx="4" fill="#8A5A2B"/>', { enter: 'fade' });
      s.ref.b1 = hang(s, 120, '#7FB2FF', '-', { delay: 200 });
      s.ref.b2 = hang(s, 200, '#7FB2FF', '-', { delay: 300 });
      s.ref.b3 = hang(s, 440, '#7FB2FF', '-', { delay: 400 });
      s.ref.b4 = hang(s, 580, '#FF9AA2', '+', { delay: 500 });
      s.text(320, 20, 'Charges push and pull without touching', { size: 22, weight: 700, colour: s.C.deep, delay: 600 });
      s.text(160, 300, 'negative and negative', { size: 17, colour: s.C.muted, delay: 900, name: 'q1' });
      s.text(510, 300, 'negative and positive', { size: 17, colour: s.C.muted, delay: 1100, name: 'q2' });
    },
    'repel': function (s) {
      swing(s, s.ref.b1, 15, { delay: 200 });
      swing(s, s.ref.b2, -15, { delay: 200 });
      s.arrow(76, 250, 46, 'l', { colour: s.C.fun, width: 7, delay: 1000 });
      s.arrow(244, 250, 46, 'r', { colour: s.C.fun, width: 7, delay: 1000 });
      s.hide(s.ref.q1);
      s.text(160, 300, 'Like charges repel', { size: 22, weight: 700, colour: s.C.fun, delay: 1300 });
    },
    'attract': function (s) {
      swing(s, s.ref.b3, -10, { delay: 200 });
      swing(s, s.ref.b4, 10, { delay: 200 });
      s.arrow(470, 250, 30, 'r', { colour: s.C.green, width: 7, delay: 1000 });
      s.arrow(550, 250, 30, 'l', { colour: s.C.green, width: 7, delay: 1000 });
      s.hide(s.ref.q2);
      s.text(510, 300, 'Opposite charges attract', { size: 22, weight: 700, colour: s.C.green, delay: 1300 });
    },
    'field': function (s) {
      s.clear(); s.ref = {};
      [150, 110, 72].forEach(function (r, k) {
        s.add('<circle r="' + r + '" fill="#2F80ED" fill-opacity="' + (0.06 + 0.07 * k) + '" stroke="#2F80ED" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 6"/>', { x: 190, y: 190, enter: 'pop', delay: k * 300 });
      });
      s.add('<circle r="40" fill="#7FB2FF" stroke="' + INK + '" stroke-width="3"/>' + signs([[-14, -12, '-'], [14, -8, '-'], [0, 16, '-']], 9), { x: 190, y: 190, enter: 'pop' });
      s.text(470, 70, 'Electric field', { size: 30, weight: 700, colour: s.C.blue, delay: 900 });
      s.add(plus(0, 0, 11), { x: 272, y: 190, enter: 'pop', delay: 1400 });
      s.arrow(262, 190, 30, 'l', { colour: s.C.green, width: 8, delay: 1600 });
      s.add(plus(0, 0, 11), { x: 356, y: 190, enter: 'pop', delay: 2000 });
      s.arrow(345, 190, 12, 'l', { colour: s.C.green, width: 5, delay: 2200 });
      s.text(470, 160, 'close up:', { size: 20, delay: 1600 });
      s.text(470, 188, 'a strong pull', { size: 22, weight: 700, colour: s.C.green, delay: 1700 });
      s.text(470, 240, 'further away:', { size: 20, delay: 2200 });
      s.text(470, 268, 'a weaker pull', { size: 22, weight: 700, colour: '#55A07B', delay: 2300 });
    },

    /* ---------- 4. Sticky balloons ---------- */
    'wall': function (s) {
      s.add(bricks(450), { enter: 'fade' });
      s.add('<rect x="-74" y="-18" width="148" height="36" rx="18" fill="#FFFFFF" stroke="#C97B52" stroke-width="2"/>' + T(0, 1, 'not charged', { size: 18, weight: 700, colour: '#8A5A2B' }), { x: 545, y: 40, enter: 'pop', delay: 300 });
      var b = s.add(balloon('#FF5D8F', 50, 60) + signs([[-20, -24, '-'], [10, -30, '-'], [24, 0, '-'], [-18, 14, '-'], [6, 30, '-'], [-30, -4, '+'], [12, 4, '+']], 8),
        { x: 150, y: 170, enter: 'pop', delay: 200, name: 'bal' });
      s.move(b, 398, 170, 1600, { delay: 900, easing: 'cubic-bezier(.3,0,.3,1)' });
      s.text(180, 320, 'the balloon sticks!', { size: 22, weight: 700, colour: s.C.pink, delay: 2600 });
    },
    'wall-why': function (s) {
      s.add('<rect x="452" y="118" width="62" height="110" rx="10" fill="#FFFFFF" opacity=".85"/>', { enter: 'fade' });
      s.add(signs([[466, 132, '+'], [466, 158, '+'], [466, 184, '+'], [466, 210, '+']], 8), { enter: 'pop', delay: 300 });
      var e = s.add(signs([[478, 132, '-'], [478, 158, '-'], [478, 184, '-'], [478, 210, '-']], 8), { enter: 'fade', delay: 300 });
      s.move(e, 22, 0, 900, { delay: 900 });
      s.add('<rect x="-100" y="-38" width="200" height="76" rx="16" fill="#FFFFFF" stroke="#C97B52" stroke-width="2"/>' + T(0, -14, 'electrons pushed back', { size: 15, colour: s.C.blue }) + T(0, 14, 'surface slightly +', { size: 17, weight: 700, colour: s.C.red }),
        { x: 540, y: 290, enter: 'pop', delay: 1600 });
      s.text(190, 66, 'opposite charges attract', { size: 22, weight: 700, colour: s.C.green, delay: 2300 });
    },
    'paper': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect x="80" y="290" width="480" height="14" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><rect x="110" y="304" width="14" height="56" fill="#8A5A2B"/><rect x="516" y="304" width="14" height="56" fill="#8A5A2B"/>', { enter: 'up' });
      s.add('<rect x="150" y="-14" width="340" height="28" rx="14" fill="#6C4DF6" stroke="' + INK + '" stroke-width="3"/>' + signs([[190, 0, '-'], [240, 0, '-'], [290, 0, '-'], [340, 0, '-'], [390, 0, '-'], [440, 0, '-']], 8), { y: 120, enter: 'down', delay: 200 });
      s.text(320, 74, 'a charged plastic rod', { size: 22, weight: 700, colour: s.C.fun, delay: 400 });
      var bits = [[200, 6], [235, -8], [262, 12], [300, -4], [332, 10], [366, -10], [400, 4], [436, -6]];
      bits.forEach(function (p, k) {
        var g = s.add('<rect x="-7" y="-5" width="14" height="10" rx="1" fill="#FFFFFF" stroke="#9AA0B4" stroke-width="1.5" transform="rotate(' + p[1] + ')"/>', { x: p[0], y: 284, enter: 'fade', delay: 300 });
        if (k % 3 !== 2) s.move(g, p[0] + (k % 2 ? 6 : -6), 142, 500, { delay: 1300 + k * 180, easing: 'cubic-bezier(.5,0,.8,.6)' });
      });
      s.text(320, 230, 'tiny bits of paper jump up', { size: 20, weight: 700, colour: s.C.ink, delay: 2600 });
    },

    /* ---------- 5. Sparks and lightning ---------- */
    'carpet': function (s) {
      s.add('<rect x="0" y="290" width="640" height="70" fill="#D9485F"/><path d="M0 306 H640 M0 326 H640 M0 346 H640" stroke="#B83350" stroke-width="3" stroke-dasharray="10 8"/>', { enter: 'up' });
      s.add('<rect x="520" y="70" width="110" height="220" fill="#C98A4B" stroke="#8A5A2B" stroke-width="4"/><rect x="534" y="86" width="82" height="80" rx="4" fill="none" stroke="#8A5A2B" stroke-width="3"/>' +
        '<rect x="526" y="196" width="34" height="10" rx="5" fill="#C9CED8" stroke="#55526E" stroke-width="2"/>', { enter: 'fade', delay: 200 });
      s.add(T(575, 230, 'metal', { size: 15, weight: 700, colour: '#FFFFFF', halo: '#8A5A2B' }) + T(575, 248, 'handle', { size: 15, weight: 700, colour: '#FFFFFF', halo: '#8A5A2B' }), { enter: 'fade', delay: 400 });
      var owl = s.owl(90, 292, 110, { name: 'owl' });
      s.move(owl, 430, 292, 2600, { delay: 400 });
      s.anim(owl, [{ transform: 'rotate(-5deg)' }, { transform: 'rotate(5deg)' }], 320, { delay: 400, iterations: 8 });
      var sp = '';
      [[-50, -110], [44, -96], [-56, -40], [52, -30], [0, -126]].forEach(function (p) { sp += '<path d="M' + p[0] + ' ' + (p[1] - 9) + ' l3 6 l6 3 l-6 3 l-3 6 l-3 -6 l-6 -3 l6 -3 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="1"/>'; });
      s.add(sp, { x: 430, y: 292, enter: 'pop', delay: 3000, name: 'sparkles' });
      s.text(250, 60, 'shuffle, shuffle...', { size: 24, weight: 700, colour: s.C.pink, delay: 600 });
      s.text(250, 100, 'charge builds up on you', { size: 20, colour: s.C.ink, delay: 3100 });
    },
    'shock': function (s) {
      s.hide(s.ref.sparkles, { delay: 800 });
      var z = s.add('<path d="M470 238 L486 226 L494 234 L508 216 L516 222 L527 203" fill="none" stroke="#FFC93C" stroke-width="5" stroke-linejoin="round"/><path d="M470 238 L486 226 L494 234 L508 216 L516 222 L527 203" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linejoin="round"/>',
        { enter: 'pop', delay: 400 });
      s.anim(z, [{ opacity: 1 }, { opacity: .2 }, { opacity: 1 }], 300, { delay: 900, iterations: 4 });
      s.text(470, 150, 'zap!', { size: 34, weight: 700, colour: s.C.orange, enter: 'pop', delay: 500 });
      s.text(250, 140, 'the charge flows away', { size: 20, weight: 700, colour: s.C.fun, delay: 1400 });
      s.text(250, 168, 'through the metal', { size: 20, weight: 700, colour: s.C.fun, delay: 1500 });
    },
    'lightning': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect width="640" height="360" fill="#2D2A4A"/><rect y="300" width="640" height="60" fill="#2F6B4F"/>', { enter: 'fade' });
      s.add('<path d="M120 140 Q100 90 160 80 Q180 30 250 46 Q300 10 360 44 Q430 30 450 80 Q510 90 490 140 Z" fill="#6B6F86" stroke="#9AA0B4" stroke-width="3"/>' +
        signs([[220, 70, '+'], [290, 52, '+'], [360, 64, '+']], 9) + signs([[170, 124, '-'], [230, 128, '-'], [290, 128, '-'], [350, 128, '-'], [420, 124, '-']], 9), { enter: 'down' });
      s.add(signs([[150, 320, '+'], [250, 320, '+'], [350, 320, '+'], [450, 320, '+']], 9), { enter: 'fade', delay: 800 });
      var b = s.add('<path d="' + BOLT + '" fill="#FFE066" stroke="#FFFFFF" stroke-width="3" stroke-linejoin="round" transform="translate(300 140) scale(1.25)"/>', { enter: 'fade', delay: 1600, ms: 100 });
      s.anim(b, [{ opacity: 1 }, { opacity: .3 }, { opacity: 1 }], 260, { delay: 1800, iterations: 4 });
      var fl = s.add('<rect width="640" height="360" fill="#FFFFFF"/>', { enter: 'none' });
      s.anim(fl, [{ opacity: 0 }, { opacity: .6 }, { opacity: 0 }], 400, { delay: 1600 });
      s.add(T(560, 180, 'a giant', { size: 24, weight: 700, colour: '#FFE066', halo: '#2D2A4A' }) + T(560, 212, 'spark!', { size: 30, weight: 700, colour: '#FFE066', halo: '#2D2A4A' }), { enter: 'pop', delay: 2000 });
    },
    'conductor': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect width="640" height="360" fill="#2D2A4A"/><rect y="300" width="640" height="60" fill="#2F6B4F"/>', { enter: 'none' });
      s.add('<path d="M40 110 Q20 60 80 50 Q100 0 170 16 Q220 -10 280 14 Q350 0 370 50 Q430 60 410 110 Z" fill="#6B6F86" stroke="#9AA0B4" stroke-width="3"/>', { enter: 'none' });
      var win = '';
      for (var r = 0; r < 5; r++) for (var c = 0; c < 3; c++) win += '<rect x="' + (452 + c * 30) + '" y="' + (150 + r * 28) + '" width="18" height="16" rx="2" fill="#FFE9A8"/>';
      s.add('<rect x="440" y="130" width="100" height="170" fill="#9AA0B4" stroke="' + INK + '" stroke-width="3"/>' + win, { enter: 'up' });
      s.add('<path d="M490 130 V84" stroke="#C98A4B" stroke-width="6" stroke-linecap="round"/><path d="M490 84 l-6 10 h12 Z" fill="#C98A4B"/><path d="M490 130 H546 V340" fill="none" stroke="#C98A4B" stroke-width="6"/><path d="M530 340 H562 M536 348 H556" stroke="#C98A4B" stroke-width="5"/>',
        { enter: 'fade', delay: 300 });
      s.add(T(590, 260, 'metal', { size: 16, weight: 700, colour: '#FFC9A0', halo: '#2D2A4A' }) + T(590, 280, 'strip', { size: 16, weight: 700, colour: '#FFC9A0', halo: '#2D2A4A' }), { enter: 'fade', delay: 600 });
      var b = s.add('<path d="M300 100 L340 60 L380 100 L420 70 L490 86" fill="none" stroke="#FFE066" stroke-width="7" stroke-linejoin="round"/>', { enter: 'fade', delay: 1000, ms: 100 });
      s.anim(b, [{ opacity: 1 }, { opacity: .3 }, { opacity: 1 }], 260, { delay: 1200, iterations: 3 });
      [0, 1, 2].forEach(function (k) {
        var d = s.add('<circle r="7" fill="#FFE066"/>', { x: 546, y: 130, enter: 'fade', delay: 1500 + k * 400, ms: 100 });
        s.move(d, 546, 336, 1000, { delay: 1500 + k * 400, easing: 'linear' });
        s.hide(d, { delay: 2500 + k * 400, ms: 200 });
      });
      s.add(T(220, 200, 'a safe path', { size: 26, weight: 700, colour: '#FFE066', halo: '#2D2A4A' }) + T(220, 236, 'down to the ground', { size: 22, weight: 700, colour: '#FFFFFF', halo: '#2D2A4A' }), { enter: 'fade', delay: 2200 });
    }
  });
})();
