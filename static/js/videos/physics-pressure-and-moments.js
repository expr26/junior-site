/* Pictures for the Pressure and moments theory video (words: videos/physics/pressure-and-moments.json). Stage is 640 x 360; see static/js/theory.js.
   Distances on the beam and the see-saw are to scale inside each picture; water-pressure arrows grow with depth. */
(function () {
  if (!window.Theory) return;

  var F = 'Fredoka, Trebuchet MS, sans-serif';
  function T(x, y, t, size, fill, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (size || 18) + '" font-weight="' + (weight || 600) + '" fill="' + (fill || '#1E1B3A') +
      '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle">' + t + '</text>';
  }
  function pill(text, w, col, bg, ink) {
    w = w || 300;
    return '<rect x="' + (-w / 2) + '" y="-26" width="' + w + '" height="52" rx="18" fill="' + (bg || '#DDF7EE') + '" stroke="' + (col || '#22A06B') + '" stroke-width="3"/>' + T(0, 2, text, 26, ink || '#0E7A5A', 700);
  }
  function card(text, w, col) {
    return '<rect x="' + (-w / 2) + '" y="-38" width="' + w + '" height="76" rx="20" fill="#FFFFFF" stroke="' + (col || '#6C4DF6') + '" stroke-width="4"/>' + T(0, 2, text, 30, '#2D1B69', 700);
  }
  function arrowAt(x, y, len, deg, col, w) {   // an arrow from (x, y), len long, pointing at angle deg (0 = right, 90 = down)
    w = w || 8; var h = Math.max(14, w * 2);
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + deg + ')"><rect x="0" y="' + (-w / 2) + '" width="' + Math.max(0, len - h + 2) + '" height="' + w + '" rx="' + (w / 2) + '" fill="' + col + '"/>' +
      '<path d="M' + (len - h) + ' ' + (-h * .75) + ' L' + len + ' 0 L' + (len - h) + ' ' + (h * .75) + ' Z" fill="' + col + '"/></g>';
  }
  function curl(cw, col, r, a0, a1) {   // a round "turning" arrow centred on (0, 0), from angle a0 to a1 (degrees, 0 = right, 90 = down)
    r = r || 26;
    if (a0 === undefined) { a0 = cw ? -200 : 20; a1 = cw ? 20 : -200; }
    function P(a) { return [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)]; }
    var p0 = P(a0), p1 = P(a1), e = P(a1 + (cw ? -1 : 1) * 1);
    var tx = p1[0] - e[0], ty = p1[1] - e[1], n = Math.sqrt(tx * tx + ty * ty); tx /= n; ty /= n;
    var hx = p1[0] + tx * 12, hy = p1[1] + ty * 12;
    return '<path d="M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (Math.abs(a1 - a0) > 180 ? 1 : 0) + ' ' + (cw ? 1 : 0) + ' ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M' + hx.toFixed(1) + ' ' + hy.toFixed(1) + ' L' + (p1[0] - ty * 10).toFixed(1) + ' ' + (p1[1] + tx * 10).toFixed(1) + ' L' + (p1[0] + ty * 10).toFixed(1) + ' ' + (p1[1] - tx * 10).toFixed(1) + ' Z" fill="' + col + '"/>';
  }
  function dim(x1, x2, y, label, col, bw) {
    col = col || '#55526E'; bw = bw || 68;
    return '<path d="M' + x1 + ' ' + (y - 8) + ' V' + (y + 8) + ' M' + x2 + ' ' + (y - 8) + ' V' + (y + 8) + ' M' + x1 + ' ' + y + ' H' + x2 + '" stroke="' + col + '" stroke-width="3" fill="none"/>' +
      '<rect x="' + ((x1 + x2) / 2 - bw / 2) + '" y="' + (y - 13) + '" width="' + bw + '" height="26" rx="8" fill="#FFFDF7"/>' + T((x1 + x2) / 2, y + 1, label, 18, col, 700);
  }
  function brick(w, h) {
    var m = '<rect width="' + w + '" height="' + h + '" rx="3" fill="#C0533A" stroke="#7A2E1E" stroke-width="3"/>';
    if (w > h) m += '<path d="M0 ' + h / 2 + ' H' + w + ' M' + w / 2 + ' 0 V' + h / 2 + ' M' + w / 4 + ' ' + h / 2 + ' V' + h + ' M' + 3 * w / 4 + ' ' + h / 2 + ' V' + h + '" stroke="#E9B8A6" stroke-width="2"/>';
    else m += '<path d="M0 ' + h / 2 + ' H' + w + ' M' + w / 2 + ' 0 V' + h / 2 + ' M0 ' + h / 4 + ' H' + w + ' M0 ' + 3 * h / 4 + ' H' + w + '" stroke="#E9B8A6" stroke-width="2"/>';
    return m;
  }
  function sponge(w) {
    return '<rect width="' + w + '" height="60" rx="8" fill="#FFE27A" stroke="#C99A00" stroke-width="3"/>' +
      [0.15, 0.4, 0.65, 0.85].map(function (f, i) { return '<circle cx="' + (w * f) + '" cy="' + (i % 2 ? 40 : 24) + '" r="5" fill="#E8C24A"/>'; }).join('');
  }
  function crate(w, h, d, label) {   // oblique view: front face w x h units, depth d; bottom-front-left corner at (0, 0)
    var U = 70, ox = d * U * 0.5, oy = -d * U * 0.4, W = w * U, H = h * U;
    return '<path d="M0 ' + (-H) + ' L' + ox + ' ' + (-H + oy) + ' H' + (W + ox) + ' L' + W + ' ' + (-H) + ' Z" fill="#F0C48A" stroke="#8A5A2B" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M' + W + ' ' + (-H) + ' L' + (W + ox) + ' ' + (-H + oy) + ' V' + oy + ' L' + W + ' 0 Z" fill="#B97A3E" stroke="#8A5A2B" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="0" y="' + (-H) + '" width="' + W + '" height="' + H + '" fill="#E0A96D" stroke="#8A5A2B" stroke-width="3"/>' +
      '<path d="M6 ' + (-H + 6) + ' L' + (W - 6) + ' -6 M' + (W - 6) + ' ' + (-H + 6) + ' L6 -6" stroke="#C98A4B" stroke-width="5"/>' +
      '<rect x="' + (W / 2 - Math.min(36, W / 2 - 4)) + '" y="' + (-H / 2 - 15) + '" width="' + Math.min(72, W - 8) + '" height="30" rx="8" fill="#FFF4D6"/>' + T(W / 2, -H / 2 + 1, label, W < 100 ? 17 : 20, '#1E1B3A', 700);
  }
  function grid(cols, rows, each) {   // floor squares, 80 units each, seen from above
    var m = '';
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++)
      m += '<rect x="' + c * 80 + '" y="' + r * 80 + '" width="80" height="80" fill="#FFF4D6" stroke="#C98A4B" stroke-width="3"/>' + T(c * 80 + 40, r * 80 + 41, each, 22, '#E5484D', 700);
    return m;
  }
  function seesawBase() {
    return '<path d="M320 252 L290 300 H350 Z" fill="#55526E" stroke="#1E1B3A" stroke-width="3" stroke-linejoin="round"/>';
  }
  var PLANK = '<rect x="20" y="240" width="600" height="12" rx="5" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/>';
  function block(w, label, col) { return '<rect x="' + (-w / 2) + '" y="' + (-w) + '" width="' + w + '" height="' + w + '" rx="6" fill="' + col + '" stroke="#1E1B3A" stroke-width="3"/>' + T(0, -w / 2 + 1, label, 18, '#FFFFFF', 700); }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }
  function rnd(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  Theory.scenes({
    /* ---------- 1. What is pressure? ---------- */
    'bricks': function (s) {
      s.text(320, 34, 'Same weight, different area', { size: 28, weight: 700, colour: s.C.fun });
      s.add(brick(50, 100), { x: 145, y: 140, enter: 'down', delay: 200, name: 'ba' });
      s.add(brick(100, 50), { x: 420, y: 190, enter: 'down', delay: 500, name: 'bb' });
      s.add(sponge(220), { x: 60, y: 240, enter: 'fade' });
      s.add(sponge(220), { x: 360, y: 240, enter: 'fade' });
      s.text(170, 100, 'on its end', { size: 22, colour: s.C.deep, delay: 900 });
      s.text(470, 100, 'lying flat', { size: 22, colour: s.C.deep, delay: 1100 });
    },
    'bricks-sink': function (s) {
      s.move(s.ref.ba, 145, 176, 900, { delay: 200, easing: 'cubic-bezier(.3,1.4,.6,1)' });
      s.move(s.ref.bb, 420, 198, 900, { delay: 200, easing: 'cubic-bezier(.3,1.4,.6,1)' });
      s.text(170, 324, 'small area: big pressure', { size: 20, weight: 700, colour: s.C.red, delay: 1100 });
      s.text(470, 324, 'big area: small pressure', { size: 20, weight: 700, colour: s.C.green, delay: 1600 });
    },
    'pin': function (s) {
      s.clear(); s.ref = {};
      var pin = s.add('<rect x="60" y="140" width="112" height="80" rx="36" fill="#F7B89B" stroke="#C2570C" stroke-width="3"/><rect x="72" y="152" width="30" height="40" rx="10" fill="#FFE3D6"/>' +
        '<rect x="172" y="120" width="16" height="120" rx="5" fill="#E5484D" stroke="#B42318" stroke-width="3"/><rect x="188" y="166" width="70" height="28" rx="6" fill="#FF8A8A" stroke="#B42318" stroke-width="3"/>' +
        '<path d="M258 176 L344 180 L258 184 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="2"/>', { x: 0, y: 0, enter: 'left' });
      s.add('<rect x="336" y="60" width="90" height="240" rx="6" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><circle cx="360" cy="100" r="4" fill="#8A5A2B"/><circle cx="400" cy="250" r="5" fill="#8A5A2B"/><circle cx="380" cy="150" r="3" fill="#8A5A2B"/>', { enter: 'fade' });
      s.move(pin, 36, 0, 900, { delay: 1000, easing: 'cubic-bezier(.5,0,.3,1)' });
      s.arrow(30, 100, 110, 'r', { label: 'push', colour: s.C.fun, width: 8, size: 18, delay: 600 });
      s.text(530, 150, 'tiny point:', { size: 22, weight: 700, colour: s.C.red, delay: 1800 });
      s.text(530, 180, 'huge pressure', { size: 22, weight: 700, colour: s.C.red, delay: 1900 });
      s.text(175, 300, 'wide head: gentle on your thumb', { size: 19, weight: 700, colour: s.C.green, delay: 2600 });
    },
    'snowshoes': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Snowshoes spread the weight', { size: 28, weight: 700, colour: s.C.fun });
      var o1 = s.owl(170, 250, 110, { enter: 'pop' });
      s.move(o1, 170, 292, 1200, { delay: 800, easing: 'ease-out' });
      s.add('<rect x="0" y="250" width="640" height="110" fill="#F4FAFF"/><path d="M0 250 Q80 240 160 250 T320 250 T480 250 T640 250" fill="none" stroke="#CFE8FF" stroke-width="6"/>' +
        '<path d="M30 290 h60 M240 320 h80 M420 300 h50 M540 330 h60" stroke="#CFE8FF" stroke-width="4" stroke-linecap="round"/>', { enter: 'fade' });
      s.add('<ellipse cx="0" cy="0" rx="72" ry="11" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><path d="M-50 0 H50 M-20 -8 V8 M20 -8 V8" stroke="#8A5A2B" stroke-width="2"/>', { x: 460, y: 250, enter: 'pop', delay: 300 });
      s.owl(460, 246, 110, { enter: 'pop', delay: 300 });
      s.text(170, 320, 'small area: sinks in', { size: 20, weight: 700, colour: s.C.red, delay: 1800 });
      s.text(460, 300, 'big area: stays on top', { size: 20, weight: 700, colour: s.C.green, delay: 2200 });
    },

    /* ---------- 2. Calculating pressure ---------- */
    'p-formula': function (s) {
      s.add(card('pressure = force ÷ area', 460), { x: 320, y: 70, enter: 'pop' });
      s.add('<rect x="0" y="0" width="120" height="120" fill="#EEE9FF" stroke="#6C4DF6" stroke-width="4"/>' + T(60, 62, '1 m²', 26, '#2D1B69', 700) +
        T(60, 138, '1 m', 16, '#55526E', 700) + T(-18, 60, '1 m', 16, '#55526E', 700, 'end'), { x: 110, y: 160, enter: 'pop', delay: 800 });
      s.text(440, 190, 'force: newtons (N)', { size: 24, colour: s.C.red, weight: 700, delay: 1300, name: 'f1' });
      s.text(440, 240, 'area: square metres (m²)', { size: 22, colour: s.C.fun, weight: 700, delay: 1900, name: 'f2' });
    },
    'p-unit': function (s) {
      hideAll(s, ['f1', 'f2']);
      s.text(440, 180, 'pressure in N/m²', { size: 30, weight: 700, colour: s.C.deep, delay: 300 });
      s.add(pill('1 N/m² = 1 pascal (Pa)', 300, '#0F9488'), { x: 440, y: 245, enter: 'pop', delay: 1200 });
    },
    'p-box4': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Lying flat on 4 m²', { size: 28, weight: 700, colour: s.C.fun, name: 't' });
      s.add('<path d="M20 290 H320 L380 220 H80 Z" fill="#E9DFCB" stroke="#C9B48E" stroke-width="3"/>', { enter: 'fade' });
      s.add(crate(2, 1, 2, '200 N'), { x: 90, y: 275, enter: 'down', delay: 200, name: 'c' });
      s.text(500, 86, 'floor under the crate', { size: 18, colour: s.C.muted, delay: 700, name: 'g0' });
      s.add(grid(2, 2, '50 N'), { x: 420, y: 106, enter: 'pop', delay: 900, name: 'g' });
      s.text(500, 284, 'each square is 1 m²', { size: 16, colour: s.C.muted, delay: 1100 });
      s.add(pill('200 ÷ 4 = 50 N/m²', 300), { x: 230, y: 328, enter: 'pop', delay: 2000, name: 'p' });
    },
    'p-box2': function (s) {
      hideAll(s, ['t', 'c', 'g', 'p']);
      s.text(320, 34, 'On a smaller side: 2 m²', { size: 28, weight: 700, colour: s.C.fun, delay: 200 });
      s.add(crate(1, 2, 2, '200 N'), { x: 120, y: 275, enter: 'down', delay: 400 });
      s.add(grid(1, 2, '100 N'), { x: 460, y: 106, enter: 'pop', delay: 1000 });
      s.add(pill('200 ÷ 2 = 100 N/m²', 300), { x: 230, y: 328, enter: 'pop', delay: 1800 });
      s.text(500, 324, 'double the pressure!', { size: 18, weight: 700, colour: s.C.red, delay: 2400 });
    },

    /* ---------- 3. Pressure in liquids and gases ---------- */
    'fluid-all': function (s) {
      s.text(320, 34, 'Water pushes in all directions', { size: 28, weight: 700, colour: s.C.blue });
      s.add('<rect x="130" y="70" width="380" height="250" rx="10" fill="#E3F1FF" stroke="#9AA0B4" stroke-width="4"/><rect x="134" y="96" width="372" height="220" rx="6" fill="#9FD0FF"/>' +
        '<path d="M134 96 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t12 0" fill="none" stroke="#5AA9F0" stroke-width="3"/>', { enter: 'fade' });
      s.add('<circle r="34" fill="#FF8A3D" stroke="#C2570C" stroke-width="3"/><path d="M-14 -16 q10 -8 22 -4" stroke="#FFD2B0" stroke-width="6" fill="none" stroke-linecap="round"/>', { x: 320, y: 205, enter: 'pop', delay: 300 });
      var m = '';
      for (var k = 0; k < 8; k++) {
        var a = k * 45, rad = a * Math.PI / 180;   // each arrow points at the ball; the ones pushing up from below are a little longer (deeper water pushes harder)
        var len = 40 - 6 * Math.sin(rad), R = 40 + len;
        m += arrowAt((320 - R * Math.cos(rad)).toFixed(1), (205 - R * Math.sin(rad)).toFixed(1), len, a, '#2D1B69', 7);
      }
      s.add(m, { enter: 'pop', delay: 900 });
    },
    'jets': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Deeper water pushes harder', { size: 28, weight: 700, colour: s.C.blue });
      s.add('<rect x="200" y="60" width="130" height="250" rx="8" fill="#E3F1FF" stroke="#9AA0B4" stroke-width="4"/><rect x="204" y="80" width="122" height="226" rx="5" fill="#9FD0FF"/>' +
        '<rect x="0" y="310" width="640" height="50" fill="#E9DFCB"/><rect x="0" y="310" width="640" height="5" fill="#C9B48E"/>', { enter: 'fade' });
      [[130, 64, 300], [200, 94, 900], [262, 116, 1500]].forEach(function (h) {
        var y = h[0], L = h[1];
        s.add('<circle cx="330" cy="' + y + '" r="5" fill="#2D1B69"/>', { enter: 'fade', delay: h[2] });
        var j = s.add('<path d="M330 ' + y + ' Q' + (330 + L * 0.5) + ' ' + y + ' ' + (330 + L) + ' ' + (y + 44) + '" fill="none" stroke="#2F80ED" stroke-width="7" stroke-linecap="round"/>' +
          '<circle cx="' + (334 + L) + '" cy="' + (y + 56) + '" r="4" fill="#2F80ED"/><circle cx="' + (338 + L) + '" cy="' + (y + 68) + '" r="3" fill="#2F80ED"/>', { enter: 'right', delay: h[2] });
      });
      s.arrow(170, 90, 200, 'd', { label: 'deeper', labelSide: 'left', colour: s.C.fun, width: 7, size: 18, delay: 500 });
      s.text(410, 116, 'weak squirt', { size: 18, colour: s.C.muted, anchor: 'start', delay: 800 });
      s.text(535, 236, 'strongest squirt', { size: 19, weight: 700, colour: s.C.blue, delay: 2000 });
    },
    'dam': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Why dams are thick at the bottom', { size: 26, weight: 700, colour: s.C.blue });
      s.add('<rect x="0" y="100" width="300" height="220" fill="#9FD0FF"/><path d="M0 100 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t20 0" fill="none" stroke="#5AA9F0" stroke-width="3"/>' +
        '<path d="M300 80 H340 L470 320 H300 Z" fill="#C9CED8" stroke="#55526E" stroke-width="4" stroke-linejoin="round"/>' +
        '<rect x="0" y="320" width="640" height="40" fill="#C9B48E"/><rect x="470" y="300" width="170" height="20" fill="#CDEFD9"/>', { enter: 'fade' });
      [[130, 18], [180, 44], [230, 70], [280, 96], [310, 112]].forEach(function (a, i) {   // length grows with depth below the surface at y = 100
        s.arrow(298 - a[1], a[0], a[1], 'r', { colour: s.C.red, width: 8, delay: 400 + i * 350 });
      });
      s.text(400, 128, 'thin at the top', { size: 18, weight: 700, colour: s.C.muted, anchor: 'start', delay: 2300 });
      s.text(140, 210, 'pushes harder', { size: 20, weight: 700, colour: s.C.red, delay: 2400 });
      s.text(140, 236, 'deeper down', { size: 20, weight: 700, colour: s.C.red, delay: 2500 });
      s.text(560, 280, 'thick at the bottom', { size: 18, weight: 700, colour: s.C.deep, delay: 2700 });
    },
    'mountain': function (s) {
      s.clear(); s.ref = {};
      var r = rnd(7), dots = '';
      for (var k = 0; k < 900; k++) {
        var x = r() * 640, y = 40 + r() * 290;
        if (r() < 0.03 + 0.97 * Math.pow((y - 40) / 290, 2)) dots += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="4" fill="#8CC4F5"/>';
      }
      s.add(dots, { enter: 'fade' });
      s.add('<path d="M120 330 L320 70 L520 330 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="3" stroke-linejoin="round"/><path d="M320 70 L274 130 L296 122 L314 136 L334 120 L352 132 L366 130 Z" fill="#FFFFFF"/>' +
        '<rect x="0" y="330" width="640" height="30" fill="#CDEFD9"/>', { enter: 'up', delay: 200 });
      s.owl(320, 74, 50, { delay: 800 });
      s.text(540, 70, 'less air above:', { size: 20, weight: 700, colour: s.C.blue, delay: 1200 });
      s.text(540, 98, 'lower pressure', { size: 20, weight: 700, colour: s.C.blue, delay: 1300 });
      s.text(70, 282, 'more air above:', { size: 17, weight: 700, colour: s.C.deep, delay: 1800 });
      s.text(70, 306, 'higher pressure', { size: 17, weight: 700, colour: s.C.deep, delay: 1900 });
    },

    /* ---------- 4. Moments ---------- */
    'spanner': function (s) {
      s.add('<path d="M200 200 m-26 0 l13 -22 h26 l13 22 l-13 22 h-26 z" fill="#C9CED8" stroke="#55526E" stroke-width="3"/><circle cx="200" cy="200" r="8" fill="#55526E"/>', { enter: 'pop', name: 'nut' });
      var sp = s.add('<path d="M228 188 H480 a12 12 0 0 1 0 24 H228 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/>' +
        '<path d="M200 200 m-40 0 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0 M200 200 m-28 0 a28 28 0 1 1 56 0 a28 28 0 1 1 -56 0" fill="#9AA0B4" fill-rule="evenodd" stroke="#55526E" stroke-width="3"/>' +
        arrowAt(468, 186, 80, -90, '#E5484D', 10) + T(492, 126, 'force', 20, '#E5484D', 700, 'start'), { enter: 'fade', delay: 300, name: 'sp' });
      sp._inner.style.transformBox = 'view-box'; sp._inner.style.transformOrigin = '200px 200px';
      s.anim(sp, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-20deg)', offset: .5 }, { transform: 'rotate(0deg)' }], 2400, { delay: 1000 });
      s.add(curl(false, '#6C4DF6', 58, -40, -300), { x: 200, y: 200, enter: 'pop', delay: 1200, name: 'curl' });
      s.text(200, 274, 'pivot', { size: 24, weight: 700, colour: s.C.deep, delay: 1800, name: 'pv' });
    },
    'moment-formula': function (s) {
      s.add(card('moment = force × distance', 480), { x: 320, y: 60, enter: 'pop' });
      s.add(dim(200, 468, 250, 'distance', '#2D1B69', 90), { enter: 'fade', delay: 900 });
      s.hide(s.ref.pv);
      s.text(200, 300, 'pivot', { size: 20, weight: 700, colour: s.C.deep, delay: 900 });
    },
    'moment-calc': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect x="100" y="234" width="460" height="14" rx="5" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><path d="M160 248 L136 290 H184 Z" fill="#55526E" stroke="#1E1B3A" stroke-width="3" stroke-linejoin="round"/>',
        { enter: 'fade' });
      s.text(160, 312, 'pivot', { size: 18, weight: 700, colour: s.C.deep });
      s.arrow(460, 110, 120, 'd', { label: '20 N', colour: s.C.red, delay: 400 });
      s.add(dim(160, 460, 276, '3 m', '#2D1B69'), { enter: 'fade', delay: 1000 });
      s.text(310, 116, 'moment = 20 × 3', { size: 26, colour: s.C.ink, delay: 1500 });
      s.add(pill('= 60 N m', 200), { x: 310, y: 166, enter: 'pop', delay: 2200 });
      s.text(310, 208, '(newton metres)', { size: 17, colour: s.C.muted, delay: 2600 });
    },
    'door': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Looking down on a door', { size: 26, weight: 700, colour: s.C.fun });
      s.add('<rect x="40" y="186" width="70" height="28" fill="#C9CED8" stroke="#55526E" stroke-width="3"/>', { enter: 'fade' });
      s.add('<rect x="116" y="192" width="420" height="16" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><circle cx="510" cy="186" r="8" fill="#FFC93C" stroke="#8A5A2B" stroke-width="2"/>', { enter: 'fade' });
      s.add('<circle cx="118" cy="200" r="9" fill="#55526E"/>', { enter: 'pop' });
      s.text(118, 240, 'hinge', { size: 18, weight: 700, colour: s.C.deep, delay: 200 });
      s.text(118, 262, '(pivot)', { size: 16, colour: s.C.muted, delay: 200 });
      s.arrow(190, 290, 76, 'u', { label: 'push', colour: s.C.red, size: 17, delay: 600 });
      s.arrow(490, 290, 76, 'u', { label: 'push', colour: s.C.red, size: 17, delay: 1000 });
      s.text(190, 150, 'hard!', { size: 24, weight: 700, colour: s.C.red, delay: 1500 });
      s.text(490, 150, 'easy!', { size: 24, weight: 700, colour: s.C.green, delay: 1900 });
      s.text(200, 322, 'small distance: small moment', { size: 17, colour: s.C.muted, delay: 2200 });
      s.text(500, 322, 'big distance: big moment', { size: 17, colour: s.C.muted, delay: 2400 });
    },

    /* ---------- 5. Balancing a see-saw (1 m = 90 units) ---------- */
    'seesaw': function (s) {
      s.ground(300);
      s.add(seesawBase() + PLANK, { enter: 'up' });
      s.add(block(60, '30 N', '#6C4DF6'), { x: 140, y: 240, enter: 'down', delay: 400 });
      s.add(block(50, '20 N', '#FF8A3D'), { x: 590, y: 240, enter: 'down', delay: 800 });
      s.add(curl(false, '#6C4DF6'), { x: 140, y: 70, enter: 'pop', delay: 1400, name: 'c1' });
      s.text(140, 120, 'anticlockwise', { size: 20, weight: 700, colour: s.C.fun, delay: 1500, name: 'l1' });
      s.add(curl(true, '#FF8A3D'), { x: 500, y: 70, enter: 'pop', delay: 2200, name: 'c2' });
      s.text(500, 120, 'clockwise', { size: 20, weight: 700, colour: s.C.orange, delay: 2300, name: 'l2' });
    },
    'seesaw-calc': function (s) {
      s.add(dim(140, 320, 160, '2 m', '#6C4DF6') + dim(320, 590, 160, '3 m', '#FF8A3D'), { enter: 'fade' });
      s.text(170, 330, '30 N × 2 m = 60 N m', { size: 20, weight: 700, colour: s.C.fun, delay: 700 });
      s.text(470, 330, '20 N × 3 m = 60 N m', { size: 20, weight: 700, colour: s.C.orange, delay: 1600 });
    },
    'seesaw-balance': function (s) {
      hideAll(s, ['c1', 'l1', 'c2', 'l2']);
      s.add(pill('60 N m = 60 N m: it balances!', 420), { x: 320, y: 90, enter: 'pop', delay: 300 });
    },
    'seesaw-people': function (s) {
      s.clear(); s.ref = {};
      s.ground(300);
      s.add(seesawBase() + PLANK, { enter: 'fade' });
      s.owl(230, 242, 130, { delay: 200 });
      s.owl(570, 242, 72, { delay: 600 });
      s.text(230, 90, 'heavier: sits closer', { size: 20, weight: 700, colour: s.C.fun, delay: 1100 });
      s.text(520, 150, 'lighter: sits further away', { size: 20, weight: 700, colour: s.C.orange, delay: 1600 });
      s.text(320, 330, 'balanced!', { size: 24, weight: 700, colour: s.C.green, delay: 2200 });
    }
  });
})();
