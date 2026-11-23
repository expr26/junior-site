/* Pictures for the Magnets and electromagnets theory video (words: videos/physics/magnets-and-electromagnets.json).
   Stage is 640 x 360; see static/js/theory.js. Colours: north poles red, south poles blue (the usual school colours).
   Field lines and compass needles are worked out from a simple two-pole model, so they always run from N to S outside
   the magnet. A compass needle's red end is its north end. */
(function () {
  if (!window.Theory) return;
  var F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  var RED = '#E5484D', BLUE = '#2F80ED', LINE = '#6C4DF6';

  /* ---------- small helpers (own to this file) ---------- */
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function lbl(x, y, t, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (o.size || 16) + '" font-weight="' + (o.weight || 700) + '" fill="' + (o.colour || '#1E1B3A') +
      '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="middle" stroke="#FFFDF7" stroke-width="4" paint-order="stroke">' + t + '</text>';
  }
  /* a bar magnet centred on (0, 0), length L, height H; left end is N unless flip */
  function magnet(L, H, flip, opacity) {
    var a = flip ? BLUE : RED, b = flip ? RED : BLUE, la = flip ? 'S' : 'N', lb = flip ? 'N' : 'S', fs = Math.min(H * 0.62, 30);
    return '<g opacity="' + (opacity || 1) + '"><rect x="' + (-L / 2) + '" y="' + (-H / 2) + '" width="' + L + '" height="' + H + '" rx="7" fill="' + b + '"/>' +
      '<path d="M0 ' + (-H / 2) + ' H' + (-L / 2 + 7) + ' Q' + (-L / 2) + ' ' + (-H / 2) + ' ' + (-L / 2) + ' ' + (-H / 2 + 7) + ' V' + (H / 2 - 7) + ' Q' + (-L / 2) + ' ' + (H / 2) + ' ' + (-L / 2 + 7) + ' ' + (H / 2) + ' H0 Z" fill="' + a + '"/>' +
      '<rect x="' + (-L / 2) + '" y="' + (-H / 2) + '" width="' + L + '" height="' + H + '" rx="7" fill="none" stroke="#1E1B3A" stroke-width="3"/>' +
      '<text x="' + (-L / 4) + '" y="2" ' + F + ' font-size="' + fs + '" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">' + la + '</text>' +
      '<text x="' + (L / 4) + '" y="2" ' + F + ' font-size="' + fs + '" font-weight="700" fill="#fff" text-anchor="middle" dominant-baseline="middle">' + lb + '</text></g>';
  }
  function clip(rot) {   // a paper clip, about 14 x 40, centred
    return '<g transform="rotate(' + (rot || 0) + ')"><path d="M-5 14 V-12 a5 5 0 0 1 10 0 V16 a7 7 0 0 1 -14 0 V-8" fill="none" stroke="#55526E" stroke-width="3" stroke-linecap="round"/></g>';
  }
  function needle(deg, k) {
    k = k || 1;
    return '<g transform="rotate(' + deg + ') scale(' + k + ')"><path d="M0 -4.5 L16 0 L0 4.5 Z" fill="' + RED + '"/><path d="M0 -4.5 L-16 0 L0 4.5 Z" fill="#C9CED8"/><circle r="2.6" fill="#1E1B3A"/></g>';
  }
  function compassCase(r) { return '<circle r="' + r + '" fill="#FFFFFF" stroke="#55526E" stroke-width="2.5"/>'; }
  /* compass at (x, y): a case and a needle pointing at deg (0 = right, -90 = up); returns the needle group */
  function compass(s, x, y, deg, o) {
    o = o || {};
    s.add(compassCase(o.r || 17), { x: x, y: y, enter: o.enter || 'pop', delay: o.delay });
    return s.add(needle(deg, (o.r || 17) / 18), { x: x, y: y, enter: o.enter || 'pop', delay: o.delay });
  }
  function turn(s, g, by, ms, delay) {   // spin a needle group by `by` degrees about its centre
    s.anim(g, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(' + by + 'deg)' }], ms || 900, { delay: delay, easing: 'cubic-bezier(.3,1.5,.6,1)' });
  }
  function shortest(d) { d = ((d % 360) + 540) % 360 - 180; return d; }

  /* two-pole field model: N and S are points [x, y] */
  function fieldAt(p, N, S) {
    var ax = p[0] - N[0], ay = p[1] - N[1], bx = p[0] - S[0], by = p[1] - S[1];
    var ra = Math.pow(ax * ax + ay * ay, 1.5) || 1, rb = Math.pow(bx * bx + by * by, 1.5) || 1;
    return [ax / ra - bx / rb, ay / ra - by / rb];
  }
  function fieldDeg(p, N, S) { var b = fieldAt(p, N, S); return Math.atan2(b[1], b[0]) * 180 / Math.PI; }
  function trace(N, S, ang) {
    var p = [N[0] + 4 * Math.cos(ang), N[1] + 4 * Math.sin(ang)], pts = [p], done = false;
    for (var i = 0; i < 1200; i++) {
      var b = fieldAt(p, N, S), m = Math.hypot(b[0], b[1]);
      p = [p[0] + 2.5 * b[0] / m, p[1] + 2.5 * b[1] / m]; pts.push(p);
      if (Math.hypot(p[0] - S[0], p[1] - S[1]) < 4) { done = true; break; }
      if (p[0] < -40 || p[0] > 680 || p[1] < -40 || p[1] > 400) break;
    }
    return { pts: pts, done: done };
  }
  function vis(p) { return p[0] > 14 && p[0] < 626 && p[1] > 14 && p[1] < 346; }
  function arrowAt(pts, i, col) {
    var a = pts[Math.max(0, i - 2)], b = pts[Math.min(pts.length - 1, i + 2)];
    var deg = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;
    return '<path d="M-7 -6.5 L8 0 L-7 6.5 Z" fill="' + col + '" transform="translate(' + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1) + ') rotate(' + deg.toFixed(1) + ')"/>';
  }
  /* field lines from N to S. `out` = direction (radians) pointing away from the magnet at N; ks = angles from it;
     mirror(p) maps a point on the N side to the matching point on the S side (lines that leave the stage are completed from S) */
  function fieldLines(N, S, out, ks, mirror, col) {
    var paths = [], arrows = [];
    function add(pts, at) {
      paths.push('M' + pts.map(function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }).join(' L'));
      var seen = []; pts.forEach(function (p, i) { if (vis(p)) seen.push(i); });
      if (seen.length > 10) arrows.push(arrowAt(pts, seen[Math.floor(seen.length * at)], col));
    }
    ks.forEach(function (k) {
      [1, -1].forEach(function (sg) {
        if (k === 0 && sg < 0) return;
        var t = trace(N, S, out + sg * k);
        if (t.done) add(t.pts, 0.5);
        else { add(t.pts, 0.45); add(t.pts.map(mirror).reverse(), 0.55); }
      });
    });
    return { paths: paths, arrows: arrows };
  }
  /* draw a set of paths so they grow along their length */
  function drawPaths(s, ds, o) {
    o = o || {};
    var g = s.add(ds.map(function (d) {
      return '<path d="' + d + '" fill="none" stroke="' + (o.colour || LINE) + '" stroke-opacity="' + (o.opacity || 1) + '" stroke-width="' + (o.width || 2.5) + '" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>';
    }).join(''), { enter: 'none', name: o.name });
    g.querySelectorAll('path').forEach(function (p, i) {
      if (p.animate && !s.fast) p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: o.ms || 1400, delay: (o.delay || 0) + i * (o.stagger || 60), easing: 'ease-in-out', fill: 'both' });
      else p.setAttribute('stroke-dashoffset', '0');
    });
    return g;
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }

  /* a horizontal bar magnet's field for the 'Magnetic fields' chapter */
  var MX = 320, MY = 200, ML = 200, MH = 50;
  var MN = [MX - ML / 2, MY], MS = [MX + ML / 2, MY];
  function mirrorX(p) { return [2 * MX - p[0], p[1]]; }

  Theory.scenes({
    /* ---------- 1. Magnets and poles ---------- */
    'bar-magnet': function (s) {
      s.add(magnet(300, 70), { x: 320, y: 180, enter: 'pop', name: 'mag' });
      s.add('<path d="M0 0 L40 60" stroke="' + RED + '" stroke-width="3"/>', { x: 130, y: 70, enter: 'fade', delay: 700, name: 'p1' });
      s.text(130, 52, 'north pole', { size: 26, weight: 700, colour: RED, delay: 600, name: 't1' });
      s.add('<path d="M0 0 L-40 60" stroke="' + BLUE + '" stroke-width="3"/>', { x: 510, y: 70, enter: 'fade', delay: 1500, name: 'p2' });
      s.text(510, 52, 'south pole', { size: 26, weight: 700, colour: BLUE, delay: 1400, name: 't2' });
      s.owl(80, 340, 90, { delay: 2000 });
    },
    'clips-poles': function (s) {
      hideAll(s, ['p1', 'p2', 't1', 't2']);
      var r = rng(7);
      [[165, 236, -18], [180, 240, 8], [196, 235, -6], [460, 238, 12], [474, 235, -10], [446, 240, 4], [154, 124, 192], [486, 126, 170]].forEach(function (c, i) {
        var startY = c[1] > 200 ? 330 : 30;
        var g = s.add(clip(c[2]), { x: c[0] + (r() - 0.5) * 60, y: startY, enter: 'fade', delay: i * 120 });
        s.move(g, c[0], c[1], 700, { delay: 300 + i * 120, easing: 'cubic-bezier(.6,0,.9,1.2)' });
      });
      s.add(clip(90), { x: 320, y: 320, enter: 'fade', delay: 200 });
      s.text(320, 278, 'hardly any pull in the middle', { size: 18, colour: s.C.muted, delay: 1800 });
      s.text(320, 40, 'Strongest at the poles', { size: 30, weight: 700, colour: s.C.fun, delay: 1400 });
    },
    'materials': function (s) {
      s.clear(); s.ref = {};
      s.add(magnet(320, 50), { x: 320, y: 70, enter: 'down' });
      var items = [
        ['<rect x="-4" y="-22" width="8" height="40" fill="#7A7F90"/><rect x="-11" y="-26" width="22" height="7" rx="2" fill="#7A7F90"/><path d="M-4 18 L0 28 L4 18 Z" fill="#7A7F90"/>', 'iron'],
        [clip(0), 'steel'],
        ['<circle r="18" fill="#B8BCC8" stroke="#7A7F90" stroke-width="3"/><circle r="9" fill="none" stroke="#9AA0B4" stroke-width="2"/>', 'nickel'],
        ['<path d="M-18 6 L-10 -14 L8 -16 L18 0 L10 16 L-12 16 Z" fill="#5C6B8A" stroke="#3B4660" stroke-width="3"/>', 'cobalt']
      ];
      items.forEach(function (it, i) {
        var x = 200 + i * 80, g = s.add(it[0] + lbl(0, 44, it[1], { size: 18, colour: s.C.deep }), { x: x, y: 250, enter: 'pop', delay: 200 + i * 250 });
        s.move(g, x, 125, 600, { delay: 1400 + i * 200, easing: 'cubic-bezier(.6,0,.9,1.15)' });
      });
      s.text(320, 212, 'magnetic', { size: 24, weight: 700, colour: s.C.green, delay: 2400 });
    },
    'not-magnetic': function (s) {
      var items = [
        ['<path d="M-24 0 C-10 -20 10 20 24 0" fill="none" stroke="#C9733A" stroke-width="5" stroke-linecap="round"/>', 'copper'],
        ['<rect x="-14" y="-20" width="28" height="40" rx="5" fill="#D4D8E2" stroke="#9AA0B4" stroke-width="3"/><rect x="-14" y="-6" width="28" height="12" fill="#2F80ED"/>', 'aluminium'],
        ['<circle r="15" fill="none" stroke="#E0B100" stroke-width="6"/>', 'gold'],
        ['<rect x="-20" y="-14" width="40" height="28" rx="3" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><path d="M-14 -4 H12 M-10 5 H16" stroke="#8A5A2B" stroke-width="2"/>', 'wood'],
        ['<rect x="-18" y="-16" width="36" height="32" rx="8" fill="#FF5D8F" stroke="#B42318" stroke-width="3"/>', 'plastic']
      ];
      items.forEach(function (it, i) {
        var x = 120 + i * 100, g = s.add(it[0] + lbl(0, 36, it[1], { size: 17, colour: s.C.muted }), { x: x, y: 268, enter: 'pop', delay: i * 200 });
        s.anim(g, [{ transform: 'translateY(0)' }, { transform: 'translateY(-6px)' }, { transform: 'translateY(0)' }], 400, { delay: 1300 + i * 100 });
      });
      s.text(320, 340, 'not magnetic: they stay put', { size: 18, colour: RED, delay: 1800 });
    },

    /* ---------- 2. Attract and repel ---------- */
    'attract': function (s) {
      s.text(320, 36, 'Opposite poles attract', { size: 28, weight: 700, colour: s.C.green });
      var a = s.add(magnet(180, 46), { x: 120, y: 110, enter: 'right' });
      var b = s.add(magnet(180, 46), { x: 520, y: 110, enter: 'left' });
      s.move(a, 220, 110, 900, { delay: 1100, easing: 'cubic-bezier(.6,0,1,1)' });
      s.move(b, 402, 110, 900, { delay: 1100, easing: 'cubic-bezier(.6,0,1,1)' });
      s.text(311, 166, 'S meets N: they pull together', { size: 18, colour: s.C.green, delay: 2200 });
    },
    'repel': function (s) {
      s.text(320, 222, 'Like poles repel', { size: 28, weight: 700, colour: RED });
      var a = s.add(magnet(180, 46, true), { x: 222, y: 280, enter: 'fade' });
      var b = s.add(magnet(180, 46), { x: 418, y: 280, enter: 'fade' });
      s.move(a, 140, 280, 700, { delay: 700, easing: 'cubic-bezier(.2,1.4,.5,1)' });
      s.move(b, 500, 280, 700, { delay: 700, easing: 'cubic-bezier(.2,1.4,.5,1)' });
      s.add('<path d="M-12 -10 L-20 0 L-12 10 M12 -10 L20 0 L12 10" fill="none" stroke="' + RED + '" stroke-width="4" stroke-linecap="round"/>', { x: 320, y: 280, enter: 'pop', delay: 1300 });
      s.text(320, 332, 'N and N push apart. S and S do too.', { size: 18, colour: s.C.muted, delay: 1700 });
    },
    'gap': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'A non-contact force', { size: 28, weight: 700, colour: s.C.pink });
      s.add('<rect x="-130" y="-8" width="260" height="16" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/><rect x="-120" y="8" width="14" height="40" fill="#8A5A2B"/><rect x="106" y="8" width="14" height="40" fill="#8A5A2B"/>',
        { x: 320, y: 90, enter: 'down' });
      s.add('<g transform="rotate(90)">' + magnet(110, 40, true) + '</g>', { x: 320, y: 153, enter: 'pop', delay: 300 });
      s.add('<rect x="-200" y="0" width="400" height="16" rx="4" fill="#E9DFCB" stroke="#C9B48E" stroke-width="3"/>', { x: 320, y: 320, enter: 'up' });
      var thread = s.add('<path d="M0 0 V-90" stroke="#55526E" stroke-width="2" stroke-dasharray="3 3"/>', { x: 320, y: 320, enter: 'fade', delay: 500 });
      thread._inner.style.transformOrigin = '50% 100%';
      var c = s.add(clip(0), { x: 320, y: 300, enter: 'fade', delay: 500 });
      s.anim(thread, [{ transform: 'scaleY(.2)' }, { transform: 'scaleY(1)' }], 1000, { delay: 900, easing: 'cubic-bezier(.4,1.4,.6,1)' });
      s.move(c, 320, 248, 1000, { delay: 900, easing: 'cubic-bezier(.4,1.4,.6,1)' });
      s.add('<path d="M0 0 V22 M-6 6 L0 0 L6 6 M-6 16 L0 22 L6 16" fill="none" stroke="#6C4DF6" stroke-width="3" stroke-linecap="round"/>', { x: 360, y: 210, enter: 'fade', delay: 1900 });
      s.text(376, 221, 'gap', { size: 20, weight: 700, colour: s.C.fun, anchor: 'start', delay: 2000 });
      s.text(180, 250, 'clip on a thread', { size: 17, colour: s.C.muted, delay: 2200 });
    },
    'cut': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 40, 'Cut a magnet in half...', { size: 28, weight: 700, colour: s.C.fun });
      var whole = s.add(magnet(360, 60), { x: 320, y: 170, enter: 'pop' });
      s.add('<path d="M0 -50 V50" stroke="#1E1B3A" stroke-width="3" stroke-dasharray="7 6"/>', { x: 320, y: 170, enter: 'fade', delay: 600, name: 'cutline' });
      s.hide(whole, { delay: 1500, ms: 1 }); s.hide(s.ref.cutline, { delay: 1500, ms: 1 });
      var a = s.add(magnet(180, 60), { x: 230, y: 170, enter: 'fade', ms: 1, delay: 1500 });
      var b = s.add(magnet(180, 60), { x: 410, y: 170, enter: 'fade', ms: 1, delay: 1500 });
      s.move(a, 160, 170, 900, { delay: 1600 }); s.move(b, 480, 170, 900, { delay: 1600 });
      s.text(320, 260, '...and you get two magnets!', { size: 26, weight: 700, colour: s.C.green, delay: 2500 });
      s.text(320, 300, 'Each half has a north and a south pole.', { size: 19, colour: s.C.muted, delay: 2900 });
    },

    /* ---------- 3. Magnetic fields (one magnet in the middle) ---------- */
    'field-area': function (s) {
      s.add('<defs><radialGradient id="mg-glow"><stop offset="0" stop-color="#6C4DF6" stop-opacity=".35"/><stop offset="1" stop-color="#6C4DF6" stop-opacity="0"/></radialGradient></defs>' +
        '<ellipse rx="230" ry="150" fill="url(#mg-glow)"/>', { x: MX, y: MY, enter: 'pop', ms: 900, delay: 300, name: 'glow' });
      s.add(magnet(ML, MH), { x: MX, y: MY, enter: 'pop', name: 'mag' });
      s.text(320, 34, 'The magnetic field', { size: 30, weight: 700, colour: s.C.fun, delay: 600, name: 'title' });
      var near = s.add(clip(90), { x: 140, y: 300, enter: 'pop', delay: 900, name: 'c1' });
      s.move(near, 110, 222, 800, { delay: 1600, easing: 'cubic-bezier(.6,0,.9,1.1)' });
      s.add(clip(90), { x: 600, y: 330, enter: 'pop', delay: 900, name: 'c2' });
      s.text(560, 300, 'too far away', { size: 17, colour: s.C.muted, delay: 2200, name: 'c3' });
    },
    'filings': function (s) {
      hideAll(s, ['glow', 'c1', 'c2', 'c3']);
      var r = rng(42), d = '';
      for (var i = 0; i < 1100; i++) {
        var x = 20 + r() * 600, y = 70 + r() * 280;
        if (Math.abs(x - MX) < ML / 2 + 8 && Math.abs(y - MY) < MH / 2 + 8) continue;
        var b = fieldAt([x, y], MN, MS), m = Math.hypot(b[0], b[1]);
        if (r() > Math.min(1, 0.02 + m * 7000)) continue;
        var ux = b[0] / m * 5, uy = b[1] / m * 5;
        d += 'M' + (x - ux).toFixed(1) + ' ' + (y - uy).toFixed(1) + ' L' + (x + ux).toFixed(1) + ' ' + (y + uy).toFixed(1);
      }
      var g = s.add('<path d="' + d + '" stroke="#55526E" stroke-width="2" stroke-linecap="round"/>', { enter: 'fade', ms: 1500, name: 'filings' });
      svgFront(s, 'mag');
      s.hide(s.ref.title);
      s.text(320, 34, 'Iron filings show the field', { size: 28, weight: 700, colour: s.C.fun, delay: 500, name: 'title2' });
      return g;
    },
    'field-lines': function (s) {
      s.hide(s.ref.filings); s.hide(s.ref.title2);
      var f = fieldLines(MN, MS, Math.PI, [0, 0.45, 0.85, 1.3, 1.75], mirrorX, LINE);
      drawPaths(s, f.paths, { delay: 300, name: 'lines' });
      s.add(f.arrows.join(''), { enter: 'fade', delay: 1900, name: 'arrows' });
      s.add('<path d="M640 ' + MY + ' H' + MS[0] + '" stroke="' + LINE + '" stroke-width="2.5"/>' + arrowAt([[600, MY], [590, MY], [580, MY], [570, MY], [560, MY]], 2, LINE),
        { enter: 'fade', delay: 1500 });
      svgFront(s, 'mag');
      s.text(320, 34, 'Field lines go from N to S', { size: 28, weight: 700, colour: s.C.fun, delay: 500 });
    },
    'strongest': function (s) {
      s.add('<circle r="34" fill="none" stroke="#FFC93C" stroke-width="6"/>', { x: MN[0], y: MY, enter: 'pop', delay: 100 });
      s.add('<circle r="34" fill="none" stroke="#FFC93C" stroke-width="6"/>', { x: MS[0], y: MY, enter: 'pop', delay: 400 });
      svgFront(s, 'mag');
      s.text(MX, MY + 52, 'strongest at the poles', { size: 20, weight: 700, colour: '#C2570C', delay: 900 });
    },
    'compasses': function (s) {
      [[70, 120], [190, 104], [320, 102], [450, 104], [570, 120], [320, 300], [150, 288], [490, 288]].forEach(function (p, i) {
        var g = compass(s, p[0], p[1], -90, { delay: i * 150 });
        turn(s, g, shortest(fieldDeg(p, MN, MS) + 90), 900, 600 + i * 150);
      });
    },

    /* ---------- 4. Compasses and the Earth ---------- */
    'compass': function (s) {
      s.add('<circle r="100" fill="#FFF4D6" stroke="#C2570C" stroke-width="6"/><circle r="84" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="3"/>' +
        lbl(0, -66, 'N', { size: 24, colour: RED }) + lbl(0, 68, 'S', { size: 22 }) + lbl(68, 2, 'E', { size: 22 }) + lbl(-68, 2, 'W', { size: 22 }), { x: 200, y: 190, enter: 'pop' });
      var n = s.add(needle(-90 + 120, 3.2), { x: 200, y: 190, enter: 'pop' });
      s.anim(n, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-150deg)', offset: .35 }, { transform: 'rotate(-100deg)', offset: .6 }, { transform: 'rotate(-125deg)', offset: .8 }, { transform: 'rotate(-120deg)' }],
        2400, { delay: 500, easing: 'ease-in-out' });
      s.text(450, 140, 'a tiny magnet', { size: 26, weight: 700, colour: s.C.fun, delay: 800 });
      s.text(450, 178, 'on a pivot', { size: 22, colour: s.C.muted, delay: 1100 });
      s.text(450, 230, 'red end = north end', { size: 22, weight: 700, colour: RED, delay: 2400 });
    },
    'earth-field': function (s) {
      s.clear(); s.ref = {};
      var EX = 230, EY = 190, EN = [EX, EY + 55], ES = [EX, EY - 55];   // the Earth's "magnet": its N pole is in the south
      var f = fieldLines(EN, ES, Math.PI / 2, [0.45, 0.8, 1.15, 1.55], function (p) { return [p[0], 2 * EY - p[1]]; }, LINE);
      drawPaths(s, f.paths, { delay: 900, name: 'elines' });
      s.add(f.arrows.join(''), { enter: 'fade', delay: 2400 });
      s.add('<circle r="92" fill="#2F80ED"/><path d="M-60 -40 q20 -26 50 -14 t30 30 q-10 20 -40 10 z M10 20 q30 -10 50 10 q-6 30 -36 34 q-20 -14 -14 -44 z M-70 40 q16 -6 24 10 q-8 14 -22 6 z" fill="#22A06B"/>' +
        '<ellipse cx="0" cy="-84" rx="34" ry="9" fill="#FFFFFF"/><ellipse cx="0" cy="84" rx="34" ry="9" fill="#FFFFFF"/>', { x: EX, y: EY, enter: 'pop', name: 'earth' });
      s.add('<g transform="rotate(90)">' + magnet(116, 34, true, 0.85) + '</g>', { x: EX, y: EY, enter: 'fade', delay: 500, name: 'emag' });
      s.text(500, 44, 'North Pole', { size: 22, weight: 700, colour: s.C.deep, delay: 400 });
      s.add('<path d="M0 0 L-140 50" stroke="#2D1B69" stroke-width="2.5" stroke-dasharray="5 4"/>', { x: 410, y: 52, enter: 'fade', delay: 400 });
      s.text(500, 330, 'South Pole', { size: 22, weight: 700, colour: s.C.deep, delay: 400 });
      s.add('<path d="M0 0 L-140 -36" stroke="#2D1B69" stroke-width="2.5" stroke-dasharray="5 4"/>', { x: 410, y: 324, enter: 'fade', delay: 400 });
      s.text(500, 190, 'like a giant', { size: 22, colour: s.C.muted, delay: 1600, name: 'g1' });
      s.text(500, 220, 'bar magnet', { size: 22, colour: s.C.muted, delay: 1700, name: 'g2' });
      s.ref.EN = EN; s.ref.ES = ES;
    },
    'earth-compass': function (s) {
      var EN = s.ref.EN, ES = s.ref.ES;
      s.hide(s.ref.g1); s.hide(s.ref.g2);
      [[108, 190], [352, 190], [40, 190]].forEach(function (p, i) {
        compass(s, p[0], p[1], fieldDeg(p, EN, ES), { delay: i * 200, r: 15 });
      });
      s.text(500, 160, 'every needle', { size: 22, weight: 700, colour: s.C.fun, delay: 1300 });
      s.text(500, 190, 'lines up', { size: 22, weight: 700, colour: s.C.fun, delay: 1400 });
      s.text(500, 220, 'with the field', { size: 22, weight: 700, colour: s.C.fun, delay: 1500 });
    },
    'twist': function (s) {
      s.add('<rect x="-110" y="-56" width="220" height="112" rx="16" fill="#FFFFFF" stroke="#FFC93C" stroke-width="4"/>', { x: 510, y: 190, enter: 'pop' });
      s.add(lbl(0, -32, 'Near the Arctic is', { size: 18, colour: s.C.ink }) + lbl(0, -6, "the Earth magnet's", { size: 18, colour: s.C.ink }) +
        lbl(0, 22, 'SOUTH pole!', { size: 24, colour: BLUE }), { x: 510, y: 190, enter: 'fade', delay: 400 });
      s.add('<circle r="22" fill="none" stroke="#FFC93C" stroke-width="5"/>', { x: 230, y: 152, enter: 'pop', delay: 900 });
      s.text(500, 270, 'opposite poles attract', { size: 18, colour: s.C.green, delay: 1500 });
    },

    /* ---------- 5. Electromagnets ---------- */
    'wire-field': function (s) {
      var WX = 220, WY = 205;
      s.text(320, 34, 'A current makes a magnetic field', { size: 26, weight: 700, colour: s.C.fun });
      s.add('<rect x="-170" y="-140" width="340" height="280" rx="16" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="3"/>', { x: WX, y: WY, enter: 'fade' });
      var circles = [40, 75, 110].map(function (r) { return 'M' + (WX) + ' ' + (WY - r) + ' A' + r + ' ' + r + ' 0 1 1 ' + (WX - 0.1) + ' ' + (WY - r); });
      drawPaths(s, circles, { delay: 1300, ms: 1200, stagger: 200 });
      var heads = '';
      [40, 75, 110].forEach(function (r) {   // current into the screen: field goes clockwise as we look
        [0, 90, 180, 270].forEach(function (a) {
          var t = a * Math.PI / 180, x = WX + r * Math.cos(t), y = WY + r * Math.sin(t);
          heads += '<path d="M-6 -6 L7 0 L-6 6 Z" fill="' + LINE + '" transform="translate(' + x.toFixed(1) + ' ' + y.toFixed(1) + ') rotate(' + (a + 90) + ')"/>';
        });
      });
      s.add(heads, { enter: 'fade', delay: 2400 });
      s.add('<circle r="16" fill="#C9733A" stroke="#8A4B1E" stroke-width="3"/><path d="M-8 -8 L8 8 M8 -8 L-8 8" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>', { x: WX, y: WY, enter: 'pop', delay: 300 });
      [45, 135, 225, 315].forEach(function (a, i) {
        var t = a * Math.PI / 180, x = WX + 92 * Math.cos(t), y = WY + 92 * Math.sin(t);
        var g = compass(s, x, y, -90, { delay: 500 + i * 100, r: 15 });
        turn(s, g, shortest(a + 90 - (-90)), 900, 1300 + i * 100);
      });
      s.text(510, 150, 'a wire, seen end-on', { size: 20, weight: 700, colour: '#8A4B1E', delay: 400 });
      s.add('<circle r="11" fill="#C9733A"/><path d="M-5 -5 L5 5 M5 -5 L-5 5" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round"/>', { x: 430, y: 195, enter: 'pop', delay: 800 });
      s.text(450, 195, 'current flowing', { size: 18, colour: s.C.muted, anchor: 'start', delay: 800 });
      s.text(450, 219, 'into the screen', { size: 18, colour: s.C.muted, anchor: 'start', delay: 800 });
      s.text(510, 270, 'the field goes', { size: 20, weight: 700, colour: LINE, delay: 2400 });
      s.text(510, 296, 'round the wire', { size: 20, weight: 700, colour: LINE, delay: 2500 });
    },
    'coil': function (s) {
      s.clear(); s.ref = {};
      var CX = 320, CY = 150, half = 110;
      s.text(320, 30, 'A coil of wire', { size: 28, weight: 700, colour: s.C.fun, name: 'ctitle' });
      var f = fieldLines([CX - half, CY], [CX + half, CY], Math.PI, [0.7, 1.2, 1.7], function (p) { return [2 * CX - p[0], p[1]]; }, LINE);
      drawPaths(s, f.paths, { delay: 1400, name: 'clines', width: 2, opacity: .6 });
      s.add('<g opacity=".6">' + f.arrows.join('') + '</g>', { enter: 'fade', delay: 2800, name: 'carrows' });
      s.ref.coilField = f;
      var back = '', front = '';
      for (var i = 0; i < 9; i++) {
        var x = CX - half + 12 + i * 25.5;
        back += '<path d="M' + x + ' ' + (CY - 30) + ' Q' + (x + 18) + ' ' + CY + ' ' + (x + 6) + ' ' + (CY + 30) + '" fill="none" stroke="#A55A24" stroke-width="5" stroke-linecap="round"/>';
        front += '<path d="M' + (x + 6) + ' ' + (CY + 30) + ' Q' + (x - 6) + ' ' + CY + ' ' + (x + 25.5) + ' ' + (CY - 30) + '" fill="none" stroke="#E08A45" stroke-width="5" stroke-linecap="round"/>';
      }
      s.ref.coilFront = front;
      s.add(back, { enter: 'fade', delay: 200, name: 'back' });
      s.add(front, { enter: 'fade', delay: 300, name: 'front' });
      // the circuit: wires from both ends down to a cell and a switch
      s.add('<path d="M' + (CX - half + 18) + ' ' + (CY + 30) + ' V322 H290 M350 322 H380 M430 322 H' + (CX + half + 4) + ' V' + (CY - 30) + '" fill="none" stroke="#1E1B3A" stroke-width="3"/>' +
        '<path d="M290 308 V336 M304 315 V329" stroke="#1E1B3A" stroke-width="4"/><path d="M304 322 H350" stroke="#1E1B3A" stroke-width="3"/>' +
        lbl(270, 340, 'cell', { size: 15, colour: s.C.muted }) +
        '<circle cx="380" cy="322" r="4" fill="#1E1B3A"/><circle cx="430" cy="322" r="4" fill="#1E1B3A"/>', { enter: 'fade', delay: 400 });
      s.add('<path d="M0 0 L50 0" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/>', { x: 380, y: 322, enter: 'fade', delay: 400, name: 'sw' });
      s.text(490, 330, 'switch on', { size: 15, colour: s.C.green, delay: 400, name: 'swt' });
      s.add(lbl(0, 0, 'N', { size: 24, colour: RED }), { x: CX - half - 30, y: CY - 44, enter: 'pop', delay: 2600, name: 'pn' });
      s.add(lbl(0, 0, 'S', { size: 24, colour: BLUE }), { x: CX + half + 30, y: CY - 44, enter: 'pop', delay: 2600, name: 'ps' });
    },
    'core': function (s) {
      var CX = 320, CY = 150, half = 110;
      s.add('<rect x="' + (CX - half - 14) + '" y="' + (CY - 20) + '" width="' + (2 * half + 28) + '" height="40" rx="6" fill="#8A90A3" stroke="#55526E" stroke-width="3"/>', { enter: 'right', name: 'corebar' });
      s.add(s.ref.coilFront, { enter: 'none' });
      s.hide(s.ref.clines); s.hide(s.ref.carrows); s.hide(s.ref.ctitle);
      s.text(320, 30, 'Coil + iron core', { size: 28, weight: 700, colour: s.C.fun });
      var f2 = fieldLines([CX - half - 14, CY], [CX + half + 14, CY], Math.PI, [0.45, 0.75, 1.05, 1.35, 1.65, 1.95], function (p) { return [2 * CX - p[0], p[1]]; }, LINE);
      drawPaths(s, f2.paths, { delay: 600, width: 3, name: 'clines2', opacity: .75 });
      s.add('<g opacity=".75">' + f2.arrows.join('') + '</g>', { enter: 'fade', delay: 2000, name: 'carrows2' });
      s.text(140, 238, 'iron core', { size: 18, weight: 700, colour: '#55526E', delay: 400, name: 'ic' });
      s.add('<path d="M0 0 L40 -64" stroke="#55526E" stroke-width="2"/>', { x: 170, y: 228, enter: 'fade', delay: 400 });
      s.ref.clips = [482, 500, 518].map(function (x, i) {
        var c = s.add(clip(90), { x: x + 40, y: 300 - i * 6, enter: 'fade', delay: 1200 });
        s.anim(c, [{ transform: 'translate(0px,0px)' }, { transform: 'translate(' + (468 - x - 40) + 'px,' + (-14 + i * 6 + (i - 1) * 14 - 136) + 'px)' }], 600, { delay: 1500 + i * 150, easing: 'cubic-bezier(.6,0,.9,1.15)' });
        return c;
      });
      s.text(530, 64, 'electromagnet!', { size: 24, weight: 700, colour: s.C.green, enter: 'pop', delay: 2400, name: 'em' });
    },
    'switch-off': function (s) {
      ['clines2', 'carrows2', 'em', 'swt', 'pn', 'ps'].forEach(function (n) { s.hide(s.ref[n]); });
      s.anim(s.ref.sw, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-35deg)' }], 400, { delay: 200 });
      s.ref.sw._inner.style.transformOrigin = '0% 50%';
      s.text(490, 330, 'switch off', { size: 15, colour: RED, delay: 400 });
      s.ref.clips.forEach(function (c, i) {
        s.anim(c, [{ transform: 'translate(' + (468 - [482, 500, 518][i] - 40) + 'px,' + (-14 + i * 6 + (i - 1) * 14 - 136) + 'px)' }, { transform: 'translate(0px,0px)' }],
          700, { delay: 900 + i * 120, easing: 'cubic-bezier(.5,0,1,1)' });
      });
      s.text(530, 64, 'OFF: no magnet', { size: 24, weight: 700, colour: RED, enter: 'pop', delay: 1700 });
    },
    'stronger': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Three ways to make it stronger', { size: 28, weight: 700, colour: s.C.fun });
      var card = '<rect x="-90" y="-100" width="180" height="200" rx="18" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="3"/>';
      var coil = ''; for (var i = 0; i < 12; i++) coil += '<path d="M' + (-60 + i * 10) + ' -22 Q' + (-48 + i * 10) + ' 0 ' + (-56 + i * 10) + ' 22" fill="none" stroke="#E08A45" stroke-width="4"/>';
      s.add(card + coil + lbl(0, 60, 'more turns', { size: 20, colour: s.C.deep }), { x: 120, y: 200, enter: 'pop', delay: 200 });
      var cells = '<path d="M-40 -16 V16 M-26 -8 V8 M4 -16 V16 M18 -8 V8" stroke="#1E1B3A" stroke-width="5"/><path d="M-26 0 H4 M-70 0 H-40 M18 0 H50" stroke="#1E1B3A" stroke-width="3"/>' +
        '<path d="M-50 -40 H40" stroke="#FF8A3D" stroke-width="6" stroke-linecap="round"/><path d="M34 -50 L48 -40 L34 -30 Z" fill="#FF8A3D"/>';
      s.add(card + cells + lbl(0, 60, 'bigger current', { size: 20, colour: s.C.deep }), { x: 320, y: 200, enter: 'pop', delay: 900 });
      var core = '<rect x="-60" y="-18" width="120" height="36" rx="6" fill="#8A90A3" stroke="#55526E" stroke-width="3"/>' + coil.replace(/#E08A45/g, '#E08A45" opacity=".9');
      s.add(card + core + lbl(0, 60, 'iron core', { size: 20, colour: s.C.deep }), { x: 520, y: 200, enter: 'pop', delay: 1600 });
    },

    /* ---------- 6. Using electromagnets ---------- */
    'uses-title': function (s) {
      s.owl(130, 300, 150);
      s.text(400, 90, 'Switch on: magnet', { size: 30, weight: 700, colour: s.C.green, delay: 400 });
      s.text(400, 140, 'Switch off: no magnet', { size: 30, weight: 700, colour: RED, delay: 1100 });
      s.add('<rect x="-60" y="-28" width="120" height="56" rx="28" fill="#DDF7EE" stroke="#22A06B" stroke-width="4"/>', { x: 400, y: 240, enter: 'pop', delay: 1600, name: 'tog' });
      var knob = s.add('<circle r="22" fill="#22A06B"/>', { x: 430, y: 240, enter: 'pop', delay: 1600 });
      s.anim(knob, [{ transform: 'translateX(0)' }, { transform: 'translateX(-60px)' }, { transform: 'translateX(0)' }], 1600, { delay: 2200, iterations: 3 });
    },
    'crane': function (s) {
      s.clear(); s.ref = {};
      s.ground(300);
      s.add('<path d="M100 300 V40 M130 300 V40 M100 300 L130 260 L100 220 L130 180 L100 140 L130 100 L100 60" fill="none" stroke="#FFB020" stroke-width="6"/>' +
        '<path d="M60 40 H440 M60 62 H440 M100 62 L140 40 L180 62 L220 40 L260 62 L300 40 L340 62 L380 40 L420 62" fill="none" stroke="#FFB020" stroke-width="5"/>' +
        '<rect x="40" y="30" width="40" height="40" fill="#55526E"/><rect x="112" y="72" width="50" height="40" rx="4" fill="#2F80ED"/><rect x="120" y="78" width="34" height="18" rx="2" fill="#CFE8FF"/>', { enter: 'fade' });
      var cable = s.add('<rect x="-2" y="0" width="4" height="80" fill="#1E1B3A"/>', { x: 400, y: 64, enter: 'none' });
      cable._inner.style.transformOrigin = '50% 0%';
      var disc = s.add('<rect x="-44" y="0" width="88" height="22" rx="6" fill="#55526E" stroke="#1E1B3A" stroke-width="3"/><rect x="-30" y="22" width="60" height="6" fill="#8A90A3"/>', { x: 400, y: 144, enter: 'none' });
      var car = s.add('<path d="M-60 34 Q-58 16 -36 14 L-20 0 Q-12 -4 12 0 L28 14 Q56 16 60 34 V44 H-60 Z" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/>' +
        '<circle cx="-34" cy="46" r="11" fill="#1E1B3A"/><circle cx="34" cy="46" r="11" fill="#1E1B3A"/><path d="M-14 14 L-4 4 H12 L22 14 Z" fill="#CFE8FF"/>', { x: 400, y: 243, enter: 'fade' });
      var T = 6500, ease = { easing: 'ease-in-out', delay: 300 };
      var kf = function (vals) { return vals.map(function (v) { return { transform: v[1], offset: v[0] }; }); };
      s.anim(cable, kf([[0, 'scaleY(1)'], [.22, 'scaleY(1.85)'], [.34, 'scaleY(1.85)'], [.56, 'scaleY(1)'], [1, 'scaleY(1)']]), T, ease);
      s.anim(disc, kf([[0, 'translateY(0px)'], [.22, 'translateY(68px)'], [.34, 'translateY(68px)'], [.56, 'translateY(0px)'], [1, 'translateY(0px)']]), T, ease);
      s.anim(car, kf([[0, 'translateY(0px)'], [.34, 'translateY(0px)'], [.56, 'translateY(-68px)'], [.72, 'translateY(-68px)'], [.84, 'translateY(0px)'], [.88, 'translateY(-6px)'], [.92, 'translateY(0px)'], [1, 'translateY(0px)']]),
        T, { easing: 'ease-in-out', delay: 300 });
      var on = s.add('<rect x="-50" y="-20" width="100" height="40" rx="20" fill="#22A06B"/>' + lbl(0, 1, 'ON', { size: 22, colour: '#FFFFFF' }).replace('stroke="#FFFDF7"', 'stroke="#22A06B"'), { x: 540, y: 120, enter: 'none' });
      var off = s.add('<rect x="-50" y="-20" width="100" height="40" rx="20" fill="#E5484D"/>' + lbl(0, 1, 'OFF', { size: 22, colour: '#FFFFFF' }).replace('stroke="#FFFDF7"', 'stroke="#E5484D"'), { x: 540, y: 120, enter: 'none' });
      s.anim(on, kf([[0, 'scale(0)'], [.28, 'scale(0)'], [.31, 'scale(1)'], [.72, 'scale(1)'], [.73, 'scale(0)'], [1, 'scale(0)']]), T, { easing: 'linear', delay: 300 });
      s.anim(off, kf([[0, 'scale(1)'], [.27, 'scale(1)'], [.28, 'scale(0)'], [.72, 'scale(0)'], [.75, 'scale(1)'], [1, 'scale(1)']]), T, { easing: 'linear', delay: 300 });
      s.text(540, 170, 'electromagnet', { size: 20, colour: s.C.muted, delay: 300 });
    },
    'bell': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'An electric bell', { size: 28, weight: 700, colour: s.C.fun });
      // electromagnet (coil on an iron core), standing up
      var coil = '<rect x="-14" y="-50" width="28" height="100" rx="4" fill="#8A90A3" stroke="#55526E" stroke-width="3"/>';
      for (var i = 0; i < 8; i++) coil += '<path d="M-20 ' + (-42 + i * 11) + ' Q0 ' + (-36 + i * 11) + ' 20 ' + (-42 + i * 11) + '" fill="none" stroke="#E08A45" stroke-width="5" stroke-linecap="round"/>';
      s.add(coil, { x: 300, y: 250, enter: 'up' });
      s.add('<rect x="-160" y="0" width="420" height="14" rx="4" fill="#C98A4B" stroke="#8A5A2B" stroke-width="3"/>', { x: 300, y: 300, enter: 'fade' });
      // gong
      s.add('<path d="M-56 0 A56 56 0 0 1 56 0 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="4"/><rect x="-6" y="0" width="12" height="38" fill="#8A5A2B"/>', { x: 500, y: 262, enter: 'pop', delay: 300 });
      // iron arm on a springy hinge at (180, 180), with the hammer at the far end
      s.add('<rect x="-8" y="0" width="16" height="120" fill="#8A5A2B"/><path d="M0 0 c-14 -6 14 -12 0 -18 c-14 -6 14 -12 0 -18" fill="none" stroke="#55526E" stroke-width="3"/>', { x: 172, y: 182, enter: 'fade', delay: 400 });
      var arm = s.add('<rect x="0" y="-5" width="270" height="10" rx="4" fill="#55526E"/><circle cx="276" cy="0" r="15" fill="#1E1B3A"/>', { x: 172, y: 182, enter: 'fade', delay: 500 });
      arm._inner.style.transformBox = 'view-box'; arm._inner.style.transformOrigin = '0 0';
      s.anim(arm, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(3deg)' }, { transform: 'rotate(0deg)' }], 320, { delay: 1600, iterations: 8, easing: 'ease-in-out' });
      var ding = s.text(565, 150, 'ding!', { size: 28, weight: 700, colour: '#C2570C', delay: 1700 });
      s.anim(ding, [{ transform: 'scale(1)' }, { transform: 'scale(1.25)' }, { transform: 'scale(1)' }], 320, { delay: 1700, iterations: 8 });
      s.add(lbl(0, 0, 'electromagnet', { size: 17, colour: '#55526E' }), { x: 300, y: 335, enter: 'fade', delay: 900 });
      s.add(lbl(0, 0, 'iron arm', { size: 17, colour: '#55526E' }), { x: 300, y: 160, enter: 'fade', delay: 1000 });
      s.add(lbl(0, 0, 'hammer', { size: 17, colour: '#55526E' }), { x: 448, y: 150, enter: 'fade', delay: 1100 });
      s.add(lbl(0, 0, 'bell', { size: 17, colour: '#C2570C' }), { x: 500, y: 244, enter: 'fade', delay: 1100 });
      s.add(lbl(0, 0, 'spring', { size: 17, colour: '#55526E' }), { x: 126, y: 158, enter: 'fade', delay: 1200 });
    },
    'more-uses': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 36, 'Electromagnets are everywhere', { size: 28, weight: 700, colour: s.C.fun });
      var card = '<rect x="-90" y="-100" width="180" height="200" rx="18" fill="#FFFFFF" stroke="#EAE2D6" stroke-width="3"/>';
      var speaker = '<rect x="-46" y="-50" width="92" height="96" rx="10" fill="#2D1B69"/><circle cy="-22" r="14" fill="#55526E" stroke="#9AA0B4" stroke-width="3"/><circle cy="16" r="24" fill="#55526E" stroke="#9AA0B4" stroke-width="3"/><circle cy="16" r="8" fill="#1E1B3A"/>';
      var lock = '<path d="M-22 -10 V-30 a22 22 0 0 1 44 0 V-10" fill="none" stroke="#9AA0B4" stroke-width="9"/><rect x="-36" y="-12" width="72" height="58" rx="10" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/><circle cy="12" r="7" fill="#1E1B3A"/><rect x="-3" y="14" width="6" height="16" fill="#1E1B3A"/>';
      var scan = '<circle cy="-12" r="44" fill="#CFE8FF" stroke="#2F80ED" stroke-width="8"/><circle cy="-12" r="22" fill="#FFFFFF"/><rect x="-62" y="-14" width="124" height="10" rx="4" fill="#9AA0B4"/><path d="M-46 30 h92" stroke="#2F80ED" stroke-width="6"/>';
      [[speaker, 'loudspeakers'], [lock, 'door locks'], [scan, 'hospital scanners']].forEach(function (c, i) {
        s.add(card + c[0] + lbl(0, 76, c[1], { size: 19, colour: s.C.deep }), { x: 120 + i * 200, y: 200, enter: 'pop', delay: 200 + i * 600 });
      });
    }
  });

  /* move a named drawing back to the front (so lines and filings sit underneath it) */
  function svgFront(s, name) { var g = s.ref[name]; if (g && g.parentNode) g.parentNode.appendChild(g); }
})();
