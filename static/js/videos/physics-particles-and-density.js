/* Pictures for the Particles and density theory video (words: videos/physics/particles-and-density.json). Stage is 640 x 360; see static/js/theory.js.
   Particles that keep moving use looping animations; every scene restarts the loops drawn earlier in its chapter (s.ref.loops),
   because the player finishes all animations when a step changes. Random layouts use a fixed seed, so a replay draws the same picture. */
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
  function card(text, w) {
    return '<rect x="' + (-w / 2) + '" y="-38" width="' + w + '" height="76" rx="20" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="4"/>' + T(0, 2, text, 30, '#2D1B69', 700);
  }
  var COL = { blue: ['#2F80ED', '#1B5FB8'], teal: ['#0F9488', '#0B6B63'], purple: ['#6C4DF6', '#4A33C9'], yellow: ['#FFC93C', '#C99A00'], pink: ['#FF5D8F', '#C23A68'], grey: ['#9AA0B4', '#55526E'] };
  function dot(r, c) {   // one particle, centred on (0, 0), inside a <g class="m"> that the loops move
    c = COL[c] || COL.blue;
    return '<g class="m"><circle r="' + r + '" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2"/><circle cx="' + (-r * .35) + '" cy="' + (-r * .35) + '" r="' + (r * .3) + '" fill="#FFFFFF" opacity=".55"/></g>';
  }
  function rnd(seed) {   // a small seeded random generator, warmed up so that small seeds don't start near 0
    seed = (seed * 104729 + 7) % 2147483647;
    var next = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    next(); next(); next();
    return next;
  }
  function arrowAt(x, y, len, deg, col, w) {
    w = w || 6; var h = Math.max(12, w * 2);
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + deg + ')"><rect x="0" y="' + (-w / 2) + '" width="' + Math.max(0, len - h + 2) + '" height="' + w + '" rx="' + (w / 2) + '" fill="' + col + '"/>' +
      '<path d="M' + (len - h) + ' ' + (-h * .75) + ' L' + len + ' 0 L' + (len - h) + ' ' + (h * .75) + ' Z" fill="' + col + '"/></g>';
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }

  /* ----- looping motion ----- */
  function loop(s, g, frames, ms, o) {
    o = o || {};
    if (s.fast) return;
    var e = g.querySelector('.m');
    if (e && e.animate) e.animate(frames, { duration: ms, delay: o.delay || 0, iterations: Infinity, easing: o.easing || 'linear' });
  }
  function keep(s, fn) { (s.ref.loops = s.ref.loops || []).push(fn); fn(); }   // start a loop now and again in later steps
  function again(s) { (s.ref.loops || []).forEach(function (fn) { fn(); }); }
  function vibrate(s, g, r, amp, ms) {
    var a = (r() - .5) * 2 * amp, b = (r() - .5) * 2 * amp;
    keep(s, function () {
      loop(s, g, [{ transform: 'translate(0px,0px)' }, { transform: 'translate(' + a + 'px,' + b + 'px)' }, { transform: 'translate(' + (-b) + 'px,' + a + 'px)' }, { transform: 'translate(0px,0px)' }], ms);
    });
  }
  function bounces(r, x0, y0, x1, y1, n) {   // points on the walls of a box, never two on the same wall in a row
    var pts = [], last = -1, first;
    for (var i = 0; i < n; i++) {
      var w; do { w = Math.floor(r() * 4); } while (w === last || (i === n - 1 && w === first));
      if (i === 0) first = w;
      last = w;
      var u = r();
      pts.push(w === 0 ? [x0, y0 + u * (y1 - y0)] : w === 1 ? [x1, y0 + u * (y1 - y0)] : w === 2 ? [x0 + u * (x1 - x0), y0] : [x0 + u * (x1 - x0), y1]);
    }
    return pts;
  }
  function zoom(s, g, pts, speed) {   // a particle flying round a closed path at a steady speed (units per second)
    var d = [0];
    for (var i = 1; i <= pts.length; i++) {
      var a = pts[i - 1], b = pts[i % pts.length];
      d.push(d[i - 1] + Math.sqrt((b[0] - a[0]) * (b[0] - a[0]) + (b[1] - a[1]) * (b[1] - a[1])));
    }
    var total = d[d.length - 1];
    var frames = pts.concat([pts[0]]).map(function (p, i) { return { transform: 'translate(' + (p[0] - pts[0][0]) + 'px,' + (p[1] - pts[0][1]) + 'px)', offset: d[i] / total }; });
    keep(s, function () { loop(s, g, frames, total / (speed * (s.ref.hot || 1)) * 1000); });
  }
  function gasIn(s, seed, x0, y0, x1, y1, n, rad, col, speed, o) {   // n particles bouncing round inside a box
    var r = rnd(seed), out = [];
    o = o || {};
    for (var k = 0; k < n; k++) {
      var pts = bounces(r, x0 + rad, y0 + rad, x1 - rad, y1 - rad, 6);
      var g = s.add(dot(rad, col), { x: pts[0][0], y: pts[0][1], enter: 'pop', delay: (o.delay || 0) + k * 120 });
      zoom(s, g, pts, speed);
      out.push(g);
    }
    return out;
  }

  /* ----- drawings ----- */
  function beaker(x, y, w, h, lid) {
    return (lid ? '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="6" fill="#FFFFFF" fill-opacity=".6" stroke="#55526E" stroke-width="4"/>'
      : '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#FFFFFF" fill-opacity=".6"/><path d="M' + x + ' ' + y + ' V' + (y + h) + ' H' + (x + w) + ' V' + y + '" fill="none" stroke="#55526E" stroke-width="4" stroke-linejoin="round"/>');
  }
  function arcArrow(x0, y0, cx, cy, x1, y1, col) {
    var tx = x1 - cx, ty = y1 - cy, n = Math.sqrt(tx * tx + ty * ty); tx /= n; ty /= n;
    var bx = x1 - tx * 14, by = y1 - ty * 14;
    return '<path d="M' + x0 + ' ' + y0 + ' Q' + cx + ' ' + cy + ' ' + bx.toFixed(1) + ' ' + by.toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M' + x1 + ' ' + y1 + ' L' + (bx - ty * 10).toFixed(1) + ' ' + (by + tx * 10).toFixed(1) + ' L' + (bx + ty * 10).toFixed(1) + ' ' + (by - tx * 10).toFixed(1) + ' Z" fill="' + col + '"/>';
  }
  function node(kind, label) {   // a 110 x 110 card with a small particle picture, centred on (0, 0)
    var m = '<rect x="-55" y="-55" width="110" height="110" rx="16" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="3"/>' + T(0, -36, label, 18, '#2D1B69', 700);
    function c(x, y, col) { return '<circle cx="' + x + '" cy="' + y + '" r="7" fill="' + col + '" stroke="#1B5FB8" stroke-width="1.5"/>'; }
    if (kind === 's') for (var i = 0; i < 4; i++) for (var j = 0; j < 3; j++) m += c(-22 + i * 15, 6 + j * 15, '#2F80ED');
    if (kind === 'l') [[-28, 36], [-13, 37], [3, 35], [18, 37], [33, 36], [-21, 22], [-5, 21], [11, 23], [27, 21], [-12, 8], [6, 9]].forEach(function (p) { m += c(p[0], p[1], '#2F80ED'); });
    if (kind === 'g') [[-30, -8], [22, -14], [-6, 14], [30, 30], [-28, 36]].forEach(function (p) { m += c(p[0], p[1], '#2F80ED'); });
    return m;
  }
  function scale(reading) {
    return '<rect x="-80" y="0" width="160" height="34" rx="8" fill="#55526E"/><rect x="-36" y="7" width="72" height="20" rx="4" fill="#DDF7EE"/>' + T(0, 18, reading, 16, '#0E7A5A', 700) +
      '<rect x="-70" y="-8" width="140" height="8" rx="3" fill="#C9CED8"/>';
  }
  function block3d(w, h, d, fill, edge) {   // a box in oblique view, bottom-front-left corner at (0, 0)
    var ox = d * .5, oy = -d * .4;
    return '<path d="M0 ' + (-h) + ' L' + ox + ' ' + (-h + oy) + ' H' + (w + ox) + ' L' + w + ' ' + (-h) + ' Z" fill="' + fill[1] + '" stroke="' + edge + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<path d="M' + w + ' ' + (-h) + ' L' + (w + ox) + ' ' + (-h + oy) + ' V' + oy + ' L' + w + ' 0 Z" fill="' + fill[2] + '" stroke="' + edge + '" stroke-width="3" stroke-linejoin="round"/>' +
      '<rect x="0" y="' + (-h) + '" width="' + w + '" height="' + h + '" fill="' + fill[0] + '" stroke="' + edge + '" stroke-width="3"/>';
  }

  Theory.scenes({
    /* ---------- 1. Solids, liquids and gases ---------- */
    'zoom': function (s) {
      s.text(320, 34, 'Tiny particles', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<rect x="-60" y="-60" width="120" height="120" rx="16" fill="#CFE8FF" stroke="#7DB7EC" stroke-width="4"/><path d="M-40 -42 h40 M-42 -28 v30" stroke="#FFFFFF" stroke-width="8" stroke-linecap="round"/>',
        { x: 140, y: 200, enter: 'pop' });
      s.text(140, 296, 'an ice cube', { size: 20, colour: s.C.muted, delay: 300 });
      s.add('<path d="M175 165 L340 100 M175 235 L340 260" stroke="#9AA0B4" stroke-width="3" stroke-dasharray="7 7"/>', { enter: 'fade', delay: 700 });
      var inside = '';
      for (var i = -4; i <= 4; i++) for (var j = -4; j <= 4; j++) { var x = i * 26, y = j * 26; if (x * x + y * y < 86 * 86) inside += '<circle cx="' + x + '" cy="' + y + '" r="12" fill="#2F80ED" stroke="#1B5FB8" stroke-width="2"/>'; }
      s.add('<path d="M70 70 L130 130" stroke="#8A5A2B" stroke-width="18" stroke-linecap="round"/><circle r="106" fill="#FFFFFF"/>' + inside + '<circle r="106" fill="none" stroke="#2D1B69" stroke-width="10"/>',
        { x: 430, y: 180, enter: 'pop', delay: 900 });
      s.text(560, 330, 'zoomed in a lot!', { size: 18, colour: s.C.muted, delay: 1600 });
    },
    'solid': function (s) {
      s.clear(); s.ref = {};
      var r = rnd(11);
      s.add(beaker(30, 100, 170, 160), { enter: 'fade' });
      for (var row = 0; row < 4; row++) for (var col = 0; col < 5; col++) {
        var g = s.add(dot(13, 'blue'), { x: 61 + col * 27, y: 243.5 - row * 27, enter: 'pop', delay: 100 + (row * 5 + col) * 25 });
        vibrate(s, g, r, 2.5, 260 + r() * 120);
      }
      s.text(115, 290, 'solid', { size: 26, weight: 700, colour: s.C.blue, delay: 600 });
      s.text(115, 322, 'keeps its shape', { size: 17, colour: s.C.muted, delay: 900 });
    },
    'liquid': function (s) {
      again(s);
      var r = rnd(23);
      s.add(beaker(235, 100, 170, 160), { enter: 'fade' });
      [[250, 244], [277, 244], [305, 244], [333, 244], [360, 244], [388, 244], [262, 219], [290, 218], [318, 219], [348, 218], [376, 219], [272, 194], [300, 193], [344, 194], [371, 193]].forEach(function (p, i) {
        var g = s.add(dot(13, 'blue'), { x: p[0], y: p[1], enter: 'pop', delay: 100 + i * 30 });
        var a = (r() - .5) * 14, b = (r() - .5) * 4;
        keep(s, function () { loop(s, g, [{ transform: 'translate(0px,0px)' }, { transform: 'translate(' + a + 'px,' + b + 'px)' }, { transform: 'translate(' + (-a) + 'px,' + (-b) + 'px)' }, { transform: 'translate(0px,0px)' }], 1400 + r() * 600, { easing: 'ease-in-out' }); });
      });
      s.text(320, 290, 'liquid', { size: 26, weight: 700, colour: s.C.blue, delay: 600 });
      s.text(320, 322, 'flows', { size: 17, colour: s.C.muted, delay: 900 });
    },
    'gas': function (s) {
      again(s);
      s.add(beaker(440, 100, 170, 160, true), { enter: 'fade' });
      gasIn(s, 31, 442, 102, 608, 258, 6, 13, 'blue', 170, { delay: 100 });
      s.text(525, 290, 'gas', { size: 26, weight: 700, colour: s.C.blue, delay: 600 });
      s.text(525, 322, 'fills its container', { size: 17, colour: s.C.muted, delay: 900 });
    },
    'squash': function (s) {
      s.clear(); s.ref = {};
      var SY = function (y) {
        return '<path d="M110 ' + (y + 25) + ' H90 V' + (y + 45) + ' H110" fill="#E3F1FF" stroke="#55526E" stroke-width="3"/>' +
          '<rect x="110" y="' + y + '" width="300" height="70" rx="4" fill="#E3F1FF" fill-opacity=".7" stroke="#55526E" stroke-width="4"/>';
      };
      var PL = function (y) { return '<rect x="0" y="' + (y + 4) + '" width="12" height="62" rx="3" fill="#55526E"/><rect x="12" y="' + (y + 30) + '" width="170" height="10" fill="#9AA0B4"/><rect x="182" y="' + (y + 5) + '" width="12" height="60" rx="4" fill="#55526E"/>'; };
      s.text(120, 60, 'gas: squashes easily', { size: 22, weight: 700, colour: s.C.green, anchor: 'start' });
      s.add(SY(85), { enter: 'fade' });
      var r = rnd(5), gas = [];
      [[140, 105], [200, 140], [255, 100], [300, 135], [350, 108], [390, 138]].forEach(function (p, i) {
        var g = s.add(dot(11, 'blue'), { x: p[0], y: p[1], enter: 'pop', delay: 100 + i * 60 });
        s.move(g, 126 + i * 22, 105 + (i % 2) * 30 + (r() - .5) * 6, 1600, { delay: 1300 });
      });
      var p1 = s.add(PL(85), { x: 410, y: 0, enter: 'fade' });
      s.move(p1, 262, 0, 1600, { delay: 1300 });
      s.text(120, 205, 'solid: hardly squashes at all', { size: 22, weight: 700, colour: s.C.red, anchor: 'start', delay: 600 });
      s.add(SY(225), { enter: 'fade', delay: 600 });
      var sol = '';
      for (var c = 0; c < 13; c++) for (var k = 0; k < 3; k++) sol += '<circle cx="' + (122 + c * 23) + '" cy="' + (237 + k * 23) + '" r="11" fill="#2F80ED" stroke="#1B5FB8" stroke-width="2"/>';
      s.add(sol, { enter: 'fade', delay: 700 });
      var p2 = s.add(PL(225), { x: 410, y: 0, enter: 'fade', delay: 600 });
      s.anim(p2, [{ transform: 'translateX(0px)' }, { transform: 'translateX(-4px)', offset: .5 }, { transform: 'translateX(0px)' }], 900, { delay: 2000 });
      s.arrow(615, 66, 50, 'l', { label: 'push', colour: s.C.fun, width: 7, size: 17, delay: 1000 });
      s.arrow(615, 206, 50, 'l', { label: 'push', colour: s.C.fun, width: 7, size: 17, delay: 1800 });
    },

    /* ---------- 2. Changes of state ---------- */
    'melt': function (s) {
      s.text(320, 24, 'heating', { size: 20, weight: 700, colour: s.C.red });
      s.add(node('s', 'solid'), { x: 110, y: 190, enter: 'pop' });
      s.add(node('l', 'liquid'), { x: 320, y: 190, enter: 'pop', delay: 500 });
      s.add(arcArrow(150, 128, 215, 70, 280, 128, '#E5484D'), { enter: 'fade', delay: 1000 });
      s.text(215, 70, 'melting', { size: 20, weight: 700, colour: s.C.red, delay: 1300 });
    },
    'evaporate': function (s) {
      s.add(node('g', 'gas'), { x: 530, y: 190, enter: 'pop' });
      s.add(arcArrow(360, 128, 425, 70, 490, 128, '#E5484D'), { enter: 'fade', delay: 500 });
      s.text(425, 56, 'evaporating', { size: 20, weight: 700, colour: s.C.red, delay: 800 });
      s.text(425, 80, 'or boiling', { size: 17, weight: 700, colour: s.C.red, delay: 1300 });
    },
    'condense': function (s) {
      s.text(320, 345, 'cooling', { size: 20, weight: 700, colour: s.C.blue });
      s.add(arcArrow(490, 252, 425, 330, 360, 252, '#2F80ED'), { enter: 'fade', delay: 300 });
      s.text(425, 312, 'condensing', { size: 20, weight: 700, colour: s.C.blue, delay: 700 });
    },
    'freeze': function (s) {
      s.add(arcArrow(280, 252, 215, 330, 150, 252, '#2F80ED'), { enter: 'fade', delay: 300 });
      s.text(215, 312, 'freezing', { size: 20, weight: 700, colour: s.C.blue, delay: 700 });
    },
    'mass-same': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'The mass stays the same', { size: 28, weight: 700, colour: s.C.fun });
      s.add(scale('20 g') + '<path d="M-56 -8 Q0 6 56 -8" fill="#E3F1FF" stroke="#9AA0B4" stroke-width="3"/>' +
        '<rect x="-30" y="-66" width="60" height="58" rx="10" fill="#CFE8FF" stroke="#7DB7EC" stroke-width="3"/><path d="M-20 -54 h18" stroke="#FFFFFF" stroke-width="6" stroke-linecap="round"/>',
        { x: 170, y: 240, enter: 'pop' });
      s.text(170, 310, 'ice', { size: 22, weight: 700, colour: s.C.blue, delay: 300 });
      s.arrow(270, 230, 100, 'r', { label: 'melts', colour: s.C.red, delay: 800 });
      s.add(scale('20 g') + '<path d="M-56 -8 Q0 6 56 -8" fill="#E3F1FF" stroke="#9AA0B4" stroke-width="3"/><ellipse cx="0" cy="-12" rx="48" ry="9" fill="#7DB7EC"/>',
        { x: 470, y: 240, enter: 'pop', delay: 1400 });
      s.text(470, 310, 'water', { size: 22, weight: 700, colour: s.C.blue, delay: 1600 });
      s.add(pill('20 g = 20 g', 220), { x: 320, y: 110, enter: 'pop', delay: 2300 });
    },

    /* ---------- 3. Diffusion ---------- */
    'mix-start': function (s) {
      s.add(beaker(110, 70, 420, 220, true), { enter: 'fade' });
      s.add('<rect x="316" y="72" width="8" height="216" fill="#55526E"/>', { enter: 'fade', name: 'wall' });
      var r = rnd(41), all = [];
      for (var k = 0; k < 28; k++) {
        var left = k < 14, x = (left ? 130 : 342) + r() * 166, y = 90 + r() * 180;
        var g = s.add(dot(10, left ? 'purple' : 'yellow'), { x: x, y: y, enter: 'pop', delay: 100 + k * 30 });
        vibrate(s, g, r, 5, 500 + r() * 300);
        all.push(g);
      }
      s.ref.mix = all;
      s.text(320, 320, 'two gases, kept apart', { size: 20, colour: s.C.muted, delay: 1200, name: 'cap1' });
    },
    'mix-spread': function (s) {
      again(s);
      s.hide(s.ref.wall); s.hide(s.ref.cap1);
      var r = rnd(77);
      s.ref.mix.forEach(function (g) { s.move(g, 130 + r() * 380, 90 + r() * 180, 3000, { delay: 400 + r() * 1200, easing: 'ease-in-out' }); });
      s.text(320, 34, 'Diffusion', { size: 30, weight: 700, colour: s.C.fun, delay: 300 });
      s.text(320, 320, 'they spread out and mix by themselves', { size: 20, weight: 700, colour: s.C.deep, delay: 3600 });
    },
    'perfume': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Smells spread by diffusion', { size: 28, weight: 700, colour: s.C.fun });
      s.ground(300);
      s.add('<rect x="70" y="200" width="80" height="100" rx="18" fill="#FF8FB1" stroke="#C23A68" stroke-width="3"/><rect x="96" y="170" width="28" height="32" rx="4" fill="#FFD6E3" stroke="#C23A68" stroke-width="3"/>' +
        '<rect x="84" y="230" width="52" height="30" rx="6" fill="#FFFFFF" opacity=".7"/>' + T(110, 246, 'perfume', 12, '#C23A68', 700), { enter: 'pop' });
      s.owl(560, 302, 110, { delay: 200 });
      var r = rnd(9);
      for (var k = 0; k < 26; k++) {
        var g = s.add(dot(6, 'pink'), { x: 110, y: 168, enter: 'pop', delay: 400 + k * 90, ms: 200 });
        var x = 140 + r() * 420, y = 70 + r() * 210;
        s.move(g, x, y, 2600, { delay: 400 + k * 90, easing: 'ease-out' });
      }
      s.add('<path d="M-70 -26 H70 a10 10 0 0 1 10 10 V16 a10 10 0 0 1 -10 10 H10 L0 40 L-8 26 H-70 a10 10 0 0 1 -10 -10 V-16 a10 10 0 0 1 10 -10 Z" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="3"/>' + T(0, 0, 'I can smell it!', 17, '#2D1B69', 700),
        { x: 540, y: 120, enter: 'pop', delay: 3400 });
    },
    'ink': function (s) {
      s.clear(); s.ref = {};
      [[70, 'cold water', '#2F80ED'], [370, 'hot water', '#E5484D']].forEach(function (b) {
        s.add('<rect x="' + b[0] + '" y="120" width="200" height="180" fill="#CFE8FF"/><path d="M' + b[0] + ' 100 V300 H' + (b[0] + 200) + ' V100" fill="none" stroke="#55526E" stroke-width="4" stroke-linejoin="round"/>', { enter: 'fade' });
        s.text(b[0] + 100, 330, b[1], { size: 22, weight: 700, colour: b[2] });
      });
      s.add('<path d="M430 116 q-7 -6 0 -12 t0 -12 M470 116 q-7 -6 0 -12 t0 -12 M510 116 q-7 -6 0 -12 t0 -12" fill="none" stroke="#9AA0B4" stroke-width="4" stroke-linecap="round"/>', { enter: 'up', delay: 200 });
      var cold = s.add('<circle r="18" fill="#6C4DF6" opacity=".85"/>', { x: 170, y: 210, enter: 'pop', delay: 500 });
      var hot = s.add('<circle r="18" fill="#6C4DF6" opacity=".85"/>', { x: 470, y: 210, enter: 'pop', delay: 500 });
      s.anim(cold, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(1.7)', opacity: .8 }], 4000, { delay: 1100, easing: 'ease-out' });
      s.anim(hot, [{ transform: 'scale(1)', opacity: 1 }, { transform: 'scale(4.6)', opacity: .5 }], 4000, { delay: 1100, easing: 'ease-out' });
      s.text(170, 76, 'spreads slowly', { size: 20, weight: 700, colour: s.C.blue, delay: 2600 });
      s.text(470, 76, 'spreads quickly', { size: 20, weight: 700, colour: s.C.red, delay: 2600 });
      s.text(320, 34, 'Warmer = faster particles', { size: 26, weight: 700, colour: s.C.fun });
    },

    /* ---------- 4. Gas pressure ---------- */
    'box': function (s) {
      s.add(beaker(130, 60, 270, 220, true), { enter: 'fade' });
      gasIn(s, 3, 132, 62, 398, 278, 8, 11, 'blue', 140, { delay: 200 });
      s.text(520, 130, 'particles zoom', { size: 22, weight: 700, colour: s.C.deep, delay: 900, name: 't1' });
      s.text(520, 160, 'about and hit', { size: 22, weight: 700, colour: s.C.deep, delay: 1000, name: 't2' });
      s.text(520, 190, 'the walls', { size: 22, weight: 700, colour: s.C.deep, delay: 1100, name: 't3' });
    },
    'pushes': function (s) {
      again(s);
      var m = '';
      [[130, 110, 180], [130, 230, 180], [400, 100, 0], [400, 200, 0], [400, 250, 0], [190, 60, 270], [320, 60, 270], [250, 280, 90], [360, 280, 90], [130, 170, 180]].forEach(function (a) {
        m += arrowAt(a[0], a[1], 26, a[2], '#E5484D', 6);
      });
      var g = s.add(m, { enter: 'fade', delay: 300, name: 'pushA' });
      s.anim(g, [{ opacity: 1 }, { opacity: .35 }, { opacity: 1 }], 700, { iterations: Infinity, delay: 1000 });
      s.add(pill('gas pressure', 180, '#E5484D', '#FFE4E4', '#B42318'), { x: 528, y: 250, enter: 'pop', delay: 1200, name: 'gp' });
    },
    'hot-box': function (s) {
      s.ref.hot = 2.4;
      again(s);
      hideAll(s, ['pushA', 't1', 't2', 't3', 'gp']);
      var m = '';
      [[130, 110, 180], [130, 230, 180], [400, 100, 0], [400, 200, 0], [400, 250, 0], [190, 60, 270], [320, 60, 270], [250, 280, 90], [360, 280, 90], [130, 170, 180], [400, 150, 0], [270, 60, 270]].forEach(function (a) {
        m += arrowAt(a[0], a[1], 40, a[2], '#E5484D', 8);
      });
      s.add(m, { enter: 'pop', delay: 800 });
      s.add('<path d="M0 0 C-22 -12 -14 -36 0 -50 C2 -36 20 -30 16 -12 C14 -4 8 0 0 0 Z" fill="#FF8A3D"/><path d="M0 0 C-10 -6 -8 -20 0 -28 C2 -18 10 -14 6 -6 Z" fill="#FFC93C"/>', { x: 190, y: 334, enter: 'up' });
      s.add('<path d="M0 0 C-22 -12 -14 -36 0 -50 C2 -36 20 -30 16 -12 C14 -4 8 0 0 0 Z" fill="#FF8A3D"/><path d="M0 0 C-10 -6 -8 -20 0 -28 C2 -18 10 -14 6 -6 Z" fill="#FFC93C"/>', { x: 305, y: 334, enter: 'up', delay: 150 });
      s.text(530, 130, 'hotter:', { size: 24, weight: 700, colour: s.C.red, delay: 500 });
      s.text(530, 162, 'faster particles,', { size: 19, delay: 700 });
      s.text(530, 188, 'harder hits,', { size: 19, delay: 900 });
      s.text(530, 214, 'more hits', { size: 19, delay: 1100 });
      s.add(pill('pressure up!', 170, '#E5484D', '#FFE4E4', '#B42318'), { x: 535, y: 290, enter: 'pop', delay: 1600 });
    },
    'pump': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'More particles, more hits', { size: 26, weight: 700, colour: s.C.fun });
      var ball = s.add('<circle r="104" fill="#FFE1CC" stroke="#FF8A3D" stroke-width="6"/><path d="M-60 -64 q30 -24 70 -22" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round" opacity=".7"/>', { x: 230, y: 200, enter: 'pop' });
      s.add('<path d="M470 290 C420 320 380 260 336 206" fill="none" stroke="#55526E" stroke-width="8" stroke-linecap="round"/>' +
        '<rect x="460" y="150" width="60" height="150" rx="8" fill="#6C4DF6" stroke="#2D1B69" stroke-width="3"/><rect x="440" y="300" width="100" height="14" rx="6" fill="#2D1B69"/>', { enter: 'fade' });
      var h = s.add('<g class="m"><rect x="486" y="90" width="8" height="70" fill="#9AA0B4"/><rect x="456" y="82" width="68" height="14" rx="6" fill="#2D1B69"/></g>', { enter: 'fade' });
      if (!s.fast) h.querySelector('.m').animate([{ transform: 'translateY(0px)' }, { transform: 'translateY(40px)' }, { transform: 'translateY(0px)' }], { duration: 900, delay: 900, iterations: 3, easing: 'ease-in-out' });
      gasIn(s, 17, 168, 138, 292, 262, 6, 10, 'blue', 150, { delay: 300 });
      var r = rnd(61);
      for (var k = 0; k < 6; k++) {
        var pts = bounces(r, 168, 138, 292, 262, 6);
        var g = s.add(dot(10, 'purple'), { x: pts[0][0], y: pts[0][1], enter: 'pop', delay: 1200 + k * 400 });
        if (s.fast) continue;
        (function (g, pts, dl) {
          var d = [0];
          for (var i = 1; i <= pts.length; i++) { var a = pts[i - 1], b = pts[i % pts.length]; d.push(d[i - 1] + Math.hypot(b[0] - a[0], b[1] - a[1])); }
          var total = d[d.length - 1];
          g.querySelector('.m').animate(pts.concat([pts[0]]).map(function (p, i) { return { transform: 'translate(' + (p[0] - pts[0][0]) + 'px,' + (p[1] - pts[0][1]) + 'px)', offset: d[i] / total }; }),
            { duration: total / 150 * 1000, delay: dl, iterations: Infinity });
        })(g, pts, 1200 + k * 400);
      }
      s.anim(ball, [{ transform: 'scale(1)' }, { transform: 'scale(1.06)' }], 2400, { delay: 1200 });
      s.text(560, 345, 'pressure goes up', { size: 20, weight: 700, colour: s.C.red, delay: 3600 });
    },

    /* ---------- 5. Density ---------- */
    'cubes': function (s) {
      s.text(320, 34, 'Same size, different mass', { size: 28, weight: 700, colour: s.C.fun });
      s.add('<rect x="240" y="318" width="160" height="16" rx="6" fill="#55526E"/><rect x="312" y="130" width="16" height="190" fill="#9AA0B4"/>', { enter: 'fade' });
      var beam = s.add('<rect x="140" y="125" width="360" height="10" rx="5" fill="#55526E"/><circle cx="320" cy="130" r="9" fill="#2D1B69"/>', { enter: 'fade' });
      function pan(x, cube) {
        return '<path d="M' + x + ' 130 L' + (x - 60) + ' 230 M' + x + ' 130 L' + (x + 60) + ' 230" stroke="#9AA0B4" stroke-width="2"/>' + cube +
          '<path d="M' + (x - 64) + ' 230 Q' + x + ' 252 ' + (x + 64) + ' 230 Z" fill="#C9CED8" stroke="#55526E" stroke-width="3"/>';
      }
      var cork = '<rect x="100" y="152" width="80" height="78" rx="4" fill="#D9A86C" stroke="#8A5A2B" stroke-width="3"/>' + [[115, 170], [150, 165], [130, 200], [165, 210], [112, 220], [150, 190]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="3" fill="#8A5A2B"/>'; }).join('');
      var metal = '<rect x="460" y="152" width="80" height="78" rx="4" fill="#B8BFCC" stroke="#55526E" stroke-width="3"/><path d="M470 162 L490 162 L470 190 Z" fill="#FFFFFF" opacity=".6"/>';
      var L = s.add(pan(140, cork), { enter: 'fade', delay: 200 });
      var R = s.add(pan(500, metal), { enter: 'fade', delay: 400 });
      beam._inner.style.transformBox = 'view-box'; beam._inner.style.transformOrigin = '320px 130px';
      s.anim(beam, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(10deg)' }], 1200, { delay: 1000, easing: 'cubic-bezier(.3,1.4,.6,1)' });
      s.move(L, 0, -31, 1200, { delay: 1000, easing: 'cubic-bezier(.3,1.4,.6,1)' });
      s.move(R, 0, 31, 1200, { delay: 1000, easing: 'cubic-bezier(.3,1.4,.6,1)' });
      s.text(140, 262, 'cork: light', { size: 20, weight: 700, colour: s.C.wood, delay: 1800 });
      s.text(530, 316, 'metal: heavy', { size: 20, weight: 700, colour: s.C.muted, delay: 2000 });
    },
    'd-formula': function (s) {
      s.clear(); s.ref = {};
      s.add(card('density = mass ÷ volume', 480), { x: 320, y: 66, enter: 'pop' });
      s.text(210, 160, 'mass: grams (g)', { size: 24, weight: 700, colour: s.C.red, delay: 800 });
      s.text(210, 210, 'volume: cm³', { size: 24, weight: 700, colour: s.C.blue, delay: 1400 });
      s.add(block3d(60, 60, 40, ['#CFE8FF', '#E3F1FF', '#9FC9F0'], '#2F80ED') + T(30, -30, '1 cm³', 15, '#1B5FB8', 700), { x: 440, y: 230, enter: 'pop', delay: 1600 });
      s.text(530, 250, '(shown much bigger!)', { size: 14, colour: s.C.muted, delay: 1800 });
      s.add(pill('density in g/cm³', 280), { x: 320, y: 300, enter: 'pop', delay: 2300 });
    },
    'd-calc': function (s) {
      s.clear(); s.ref = {};
      s.add(block3d(150, 100, 80, ['#FFB27A', '#FFD2B0', '#E07A3A'], '#C2570C'), { x: 60, y: 280, enter: 'pop' });
      s.text(135, 230, '200 g', { size: 26, weight: 700, colour: s.C.ink, delay: 500 });
      s.text(160, 316, 'volume 50 cm³', { size: 20, weight: 700, colour: s.C.blue, delay: 900 });
      s.text(450, 110, 'density = mass ÷ volume', { size: 22, colour: s.C.deep, weight: 700, delay: 1200 });
      s.text(450, 160, '= 200 ÷ 50', { size: 28, delay: 1700 });
      s.add(pill('= 4 g/cm³', 220), { x: 450, y: 220, enter: 'pop', delay: 2300 });
    },
    'float': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect x="100" y="100" width="440" height="220" fill="#FFFFFF" fill-opacity=".5"/>', { enter: 'fade' });
      var wood = s.add('<rect width="120" height="50" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><path d="M10 16 q30 -8 60 0 t44 0 M8 34 q40 8 80 0" fill="none" stroke="#8A5A2B" stroke-width="2"/>', { x: 170, y: 30, enter: 'down' });
      s.move(wood, 170, 135, 1400, { delay: 500, easing: 'cubic-bezier(.3,1.5,.6,1)' });   // 35 of its 50 units under water: 0.7 of it, as its density is 0.7 g/cm³
      var stone = s.add('<path d="M0 10 Q4 -14 30 -12 Q56 -16 60 8 Q64 30 34 32 Q2 34 0 10 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/>', { x: 400, y: 50, enter: 'down', delay: 300 });
      s.move(stone, 400, 284, 2200, { delay: 900, easing: 'ease-in' });
      s.add('<rect x="102" y="150" width="436" height="168" fill="#5AA9F0" fill-opacity=".45"/><path d="M102 150 H538" stroke="#2F80ED" stroke-width="3"/>' +
        '<path d="M100 100 V320 H540 V100" fill="none" stroke="#55526E" stroke-width="4" stroke-linejoin="round"/>', { enter: 'fade' });
      s.text(220, 292, 'water: 1 g/cm³', { size: 20, weight: 700, colour: s.C.blue, delay: 600 });
      s.text(230, 72, 'wood, 0.7 g/cm³: floats', { size: 20, weight: 700, colour: s.C.wood, delay: 2000 });
      s.text(470, 230, 'denser: sinks', { size: 20, weight: 700, colour: s.C.muted, delay: 3200 });
    },
    'displace': function (s) {
      s.clear(); s.ref = {};
      var top = 70, bot = 310, k = 2.4;   // 0 cm³ at y = 310, 100 cm³ at y = 70
      function yv(v) { return bot - v * k; }
      var marks = '';
      for (var v = 0; v <= 100; v += 10) marks += '<path d="M260 ' + yv(v) + ' h' + (v % 50 ? 10 : 18) + '" stroke="#55526E" stroke-width="2"/>' + T(252, yv(v), v, 13, '#55526E', 600, 'end');
      s.add('<rect x="260" y="' + (top - 10) + '" width="110" height="' + (bot - top + 14) + '" rx="6" fill="#FFFFFF" fill-opacity=".6" stroke="#55526E" stroke-width="4"/>', { enter: 'fade' });
      s.text(250, 44, 'cm³', { size: 15, colour: s.C.muted, anchor: 'end' });
      var st = s.add('<path d="M0 -320 V-20" stroke="#55526E" stroke-width="2"/><path d="M-22 -4 Q-18 -24 2 -22 Q24 -22 22 2 Q20 22 -2 20 Q-24 18 -22 -4 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/>',
        { x: 315, y: 40, enter: 'down' });
      s.text(160, 50, 'stone: 150 g', { size: 20, weight: 700, colour: s.C.deep, delay: 300 });
      s.add('<rect x="262" y="' + yv(50) + '" width="106" height="' + (bot - yv(50) + 2) + '" fill="#5AA9F0" fill-opacity=".45"/>', { enter: 'fade' });
      var rise = s.add('<rect x="262" y="' + yv(80) + '" width="106" height="' + (yv(50) - yv(80)) + '" fill="#5AA9F0" fill-opacity=".45"/>', { enter: 'none' });
      rise._inner.style.transformOrigin = '50% 100%';
      s.anim(rise, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], 1200, { delay: 1900 });
      s.add(marks, { enter: 'fade' });
      s.move(st, 315, 268, 1800, { delay: 900, easing: 'ease-in-out' });
      s.text(500, 80, 'before: 50 cm³', { size: 20, delay: 400 });
      s.text(500, 112, 'after: 80 cm³', { size: 20, delay: 3000 });
      s.text(500, 156, 'volume = 30 cm³', { size: 22, weight: 700, colour: s.C.blue, delay: 3500 });
      s.text(500, 204, 'density = 150 ÷ 30', { size: 22, weight: 700, colour: s.C.deep, delay: 4100 });
      s.add(pill('= 5 g/cm³', 200), { x: 500, y: 258, enter: 'pop', delay: 4600 });
    }
  });
})();
