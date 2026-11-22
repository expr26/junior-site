/* Mirror Maze: light, reflection, refraction and colour.
   Maze rounds: an 8 x 6 grid (50 px cells, y grows downwards). The laser beam moves along the grid. A mirror sits on a cell diagonal,
   '/' (1) or '\' (-1); the child turns it between these two 45° positions. Law of reflection: angle of incidence = angle of
   reflection, both measured from the normal (the dashed line at 90° to the mirror). For a beam at 45° to a diagonal mirror both are
   45°, so it turns through 90°: '/' maps direction (dx, dy) to (-dy, -dx); '\' maps it to (dy, dx).
   Solutions checked by hand: maze 1: A '/'. Maze 2: A '\', B '\'. Maze 3: A '\', B '/', C '/'.
   Law round: incidence 40° from the normal, so reflection 40° (50° is the common mistake of measuring from the mirror).
   Mirror angle round: 20° to the mirror surface means 90° − 20° = 70° to the normal.
   Shadow round: point torch at (tx, 150), box front face at x = 200 from y = 120 to 180 (60 tall), screen at x = 370.
   Straight-line rays give shadow height 60 × (370 − tx) / (200 − tx): tx 40 → 124, 75 → 142, 115 → 180 (= 3 × box, the target), 150 → 264.
   Refraction: air into glass bends the ray towards the normal (drawn 45° in, about 28° inside, as for glass with n ≈ 1.5).
   Prism: white light is a mixture of colours; each colour refracts by a different amount (violet most, red least), so they spread out. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var COLS = 8, ROWS = 6, C = 50;
  var ROUNDS = [
    { maze: { laser: [0, 4], target: [5, 0], mirrors: [[5, 4, -1]], rocks: [[2, 1], [7, 3]] }, sol: [1],
      text: 'Turn the mirror so the laser beam hits the target 🎯, then press <b>Fire</b>.',
      hint: 'The beam is going right. Which way must the mirror lean to send it <b>up</b>?', why: 'The beam hit the mirror 45° from the normal and bounced off 45° on the other side, so it turned up to the target.' },
    { maze: { laser: [0, 1], target: [7, 4], mirrors: [[3, 1, 1], [3, 4, 1]], rocks: [[5, 2], [1, 3], [6, 0]] }, sol: [-1, -1],
      text: 'Two mirrors this time! Turn them to guide the beam to the target 🎯, then press <b>Fire</b>.',
      hint: 'Follow the beam one mirror at a time. Mirror A must send it <b>down</b>, then mirror B must send it <b>right</b>.', why: 'Each mirror turned the beam through 90°, because the angle of incidence (45°) equals the angle of reflection (45°).' },
    { law: 40, start: 70, text: 'A ray hits the mirror <b>40°</b> from the normal. Turn the reflected ray so it obeys the <b>law of reflection</b>, then press <b>Done</b>.',
      hint: 'The angle of reflection equals the angle of incidence. Both are measured from the dashed normal, not from the mirror.', why: 'Angle of incidence = angle of reflection. The ray comes in 40° from the normal, so it leaves 40° from the normal on the other side.' },
    { tilt: 20, q: 'The ray makes <b>20°</b> with the mirror surface. What is the <b>angle of incidence</b>?', opts: ['20°', '70°', '160°'], ans: 1,
      hint: 'Angles are measured from the normal, and the normal is at 90° to the mirror. Try 90° − 20°.', why: 'The normal is at 90° to the mirror, so the angle of incidence is 90° − 20° = 70°. The ray then reflects at 70° too.' },
    { shadow: [40, 75, 115, 150], ans: 2, text: 'Light travels in straight lines. Move the torch until the box\'s shadow fits the pink dashed outline on the screen, then press <b>Done</b>.' },
    { maze: { laser: [0, 0], target: [2, 5], mirrors: [[6, 0, 1], [6, 3, -1], [2, 3, -1]], rocks: [[4, 1], [0, 4], [7, 5]] }, sol: [-1, 1, 1],
      text: 'Master maze: three mirrors! Get the beam to the target 🎯, then press <b>Fire</b>.',
      hint: 'Plan the route first: A sends the beam down, B sends it left, C sends it down to the target.', why: 'Three reflections, and at every mirror the angle of incidence equalled the angle of reflection.' },
    { refract: true, q: 'A ray of light goes from air into a glass block. Which path does it take inside the glass?', opts: ['A: it bends towards the normal', 'B: it goes straight on without bending', 'C: it bends away from the normal'], ans: 0,
      hint: 'Light slows down when it goes into glass or water, and that makes it bend. Does it bend towards the dashed normal or away from it?', why: 'Light slows down in glass, so it bends towards the normal. That bending is called refraction.' },
    { prism: true, q: 'White light shines into a glass prism. What comes out of the other side?', opts: ['A spread of colours: white light is a mix of colours, and the prism separates them', 'Only white light: a prism cannot change light', 'Colours that the glass adds to the light, like paint'], ans: 0,
      hint: 'The prism does not make colours. White light is a mixture. What could bending each colour by a different amount do?', why: 'White light is a mixture of colours. Each colour bends by a different amount in the prism (violet most, red least), so they spread out into a spectrum. This is called dispersion.' }
  ];
  var DIRS = { '0,-1': 'up', '0,1': 'down', '1,0': 'right', '-1,0': 'left' };
  var SPECTRUM = ['#FF3B3B', '#FF8A3D', '#FFE14D', '#34C77B', '#3B82F6', '#4B3BCB', '#9B4DF6'];

  function f(v) { return (+v).toFixed(1); }
  function rad(d) { return d * Math.PI / 180; }
  function cc(c) { return [c[0] * C + C / 2, c[1] * C + C / 2]; }

  /* Ray picture for the reflection rounds: flat mirror at y = 240, normal at x = 200. */
  function rayPic(inc, out, labels) {
    var X = 200, Y = 240, L = 190, s = '<defs><marker id="mm-ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" class="mm-ahd"/></marker></defs>';
    s += '<rect x="20" y="' + Y + '" width="360" height="12" class="mm-back"/><line x1="20" y1="' + Y + '" x2="380" y2="' + Y + '" class="mm-flat"/>';
    s += '<line x1="' + X + '" y1="' + Y + '" x2="' + X + '" y2="34" class="mm-norm"/><text x="' + (X + 6) + '" y="30" class="mm-cap">normal</text>';
    var a = rad(inc), sx = X - L * Math.sin(a), sy = Y - L * Math.cos(a), mx = (sx + X) / 2, my = (sy + Y) / 2;
    s += '<line x1="' + f(sx) + '" y1="' + f(sy) + '" x2="' + f(mx) + '" y2="' + f(my) + '" class="mm-ray" marker-end="url(#mm-ah)"/><line x1="' + f(mx) + '" y1="' + f(my) + '" x2="' + X + '" y2="' + Y + '" class="mm-ray"/>';
    s += '<path d="M' + X + ' ' + (Y - 56) + ' A56 56 0 0 0 ' + f(X - 56 * Math.sin(a)) + ' ' + f(Y - 56 * Math.cos(a)) + '" class="mm-arc"/>';
    var la = rad(inc / 2); s += '<text x="' + f(X - 78 * Math.sin(la)) + '" y="' + f(Y - 78 * Math.cos(la) + 5) + '" text-anchor="middle" class="mm-ang">' + labels[0] + '</text>';
    if (labels[2]) {
      s += '<path d="M' + (X - 70) + ' ' + Y + ' A70 70 0 0 1 ' + f(X - 70 * Math.sin(a)) + ' ' + f(Y - 70 * Math.cos(a)) + '" class="mm-arc2"/>' +
        '<text x="' + (X - 104) + '" y="' + (Y - 10) + '" text-anchor="middle" class="mm-ang2">' + labels[2] + '</text>';
    }
    if (out != null) {
      var b = rad(out), ex = X + L * Math.sin(b), ey = Y - L * Math.cos(b);
      s += '<line x1="' + X + '" y1="' + Y + '" x2="' + f(ex) + '" y2="' + f(ey) + '" class="mm-ray" marker-end="url(#mm-ah)"/>';
      s += '<path d="M' + X + ' ' + (Y - 56) + ' A56 56 0 0 1 ' + f(X + 56 * Math.sin(b)) + ' ' + f(Y - 56 * Math.cos(b)) + '" class="mm-arc"/>';
      var lb = rad(out / 2); s += '<text x="' + f(X + 78 * Math.sin(lb)) + '" y="' + f(Y - 78 * Math.cos(lb) + 5) + '" text-anchor="middle" class="mm-ang">' + labels[1] + '</text>';
    }
    s += '<text x="30" y="270" class="mm-cap">mirror 🪞</text>';
    return s;
  }

  Arcade.game({
    intro: 'Welcome to the Mirror Maze! Bounce a laser off mirrors, make shadows, bend light and split it into colours.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], M = R.maze, ori = M ? M.mirrors.map(function (m) { return m[2]; }) : null, beam = null;
      var r = R.start || 0, tp = 0;
      var ctrl = '';
      if (M) ctrl = '<div class="mm-ctrl">' + M.mirrors.map(function (m, k) { return '<button class="btn ghost" type="button" data-m="' + k + '">Turn ' + 'ABC'[k] + ' ↻</button>'; }).join('') + '</div>' +
        '<p class="actions mm-act"><button class="btn" type="button" data-go>Fire! 🔴</button></p>';
      else if (R.law) ctrl = '<div class="mm-step"><button class="btn ghost" type="button" data-r="-5">−5°</button><b class="mm-deg" aria-live="polite"></b><button class="btn ghost" type="button" data-r="5">+5°</button></div>' +
        '<p class="actions mm-act"><button class="btn" type="button" data-go>Done ✓</button></p>';
      else if (R.shadow) ctrl = '<div class="mm-step"><button class="btn ghost" type="button" data-t="-1">◀ Further</button><b class="mm-deg" aria-hidden="true">🔦</b><button class="btn ghost" type="button" data-t="1">Closer ▶</button></div>' +
        '<p class="actions mm-act"><button class="btn" type="button" data-go>Done ✓</button></p>';
      stage.innerHTML = '<p class="q-num">Light lab ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="mm-svg" viewBox="0 0 400 300" role="img"></svg><p class="mm-out" aria-live="polite"></p>' + ctrl + (R.q ? '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.mm-out');
      ui.owl(M ? 'Tap a mirror (or its button) to turn it. Light reflects off a mirror at the same angle it hits it.' :
        R.law ? 'The normal is the dashed line at 90° to the mirror. Measure every angle from it.' :
        R.tilt ? 'Careful: which line do we measure angles from?' :
        R.shadow ? 'Light can\'t bend round the box, so a shadow forms behind it.' :
        R.refract ? 'Light changes speed when it goes from air into glass.' : 'A prism is a triangle-shaped block of glass.');

      function trace() {
        var p = M.laser.slice(), d = [1, 0], pts = [cc(p)], hits = [], end = 'out';
        for (var n = 0; n < 60; n++) {
          p = [p[0] + d[0], p[1] + d[1]];
          var c = cc(p);
          if (p[0] < 0 || p[1] < 0 || p[0] >= COLS || p[1] >= ROWS) { pts.push([c[0] - d[0] * 25, c[1] - d[1] * 25]); break; }
          if (M.rocks.some(function (q) { return q[0] === p[0] && q[1] === p[1]; })) { pts.push([c[0] - d[0] * 18, c[1] - d[1] * 18]); end = 'rock'; break; }
          if (p[0] === M.target[0] && p[1] === M.target[1]) { pts.push(c); end = 'hit'; break; }
          var k = -1; M.mirrors.forEach(function (m, j) { if (m[0] === p[0] && m[1] === p[1]) k = j; });
          if (k >= 0) { pts.push(c); hits.push(k); d = ori[k] === 1 ? [-d[1], -d[0]] : [d[1], d[0]]; }
        }
        return { pts: pts, hits: hits, end: end, dir: DIRS[d[0] + ',' + d[1]] };
      }

      function drawMaze() {
        var s = '', x, y;
        for (x = 0; x <= COLS; x++) s += '<line x1="' + x * C + '" y1="0" x2="' + x * C + '" y2="300" class="mm-grid"/>';
        for (y = 0; y <= ROWS; y++) s += '<line x1="0" y1="' + y * C + '" x2="400" y2="' + y * C + '" class="mm-grid"/>';
        M.rocks.forEach(function (q) { s += '<rect x="' + (q[0] * C + 6) + '" y="' + (q[1] * C + 6) + '" width="38" height="38" rx="10" class="mm-rock"/><path d="M' + (q[0] * C + 14) + ' ' + (q[1] * C + 18) + ' l8 -4 l10 6" class="mm-crack"/>'; });
        var t = cc(M.target);
        s += '<circle cx="' + t[0] + '" cy="' + t[1] + '" r="20" class="mm-t1"/><circle cx="' + t[0] + '" cy="' + t[1] + '" r="13" class="mm-t2"/><circle cx="' + t[0] + '" cy="' + t[1] + '" r="6" class="mm-t1"/>';
        var l = cc(M.laser);
        s += '<rect x="' + (l[0] - 22) + '" y="' + (l[1] - 13) + '" width="38" height="26" rx="6" class="mm-las"/><rect x="' + (l[0] + 14) + '" y="' + (l[1] - 6) + '" width="10" height="12" rx="2" class="mm-noz"/>' +
          '<text x="' + (l[0] - 3) + '" y="' + (l[1] + 5) + '" text-anchor="middle" class="mm-lt">⚡</text>';
        if (beam) {
          var pl = beam.pts.map(function (q) { return f(q[0]) + ',' + f(q[1]); }).join(' '), len = 0;
          for (var k = 1; k < beam.pts.length; k++) len += Math.abs(beam.pts[k][0] - beam.pts[k - 1][0]) + Math.abs(beam.pts[k][1] - beam.pts[k - 1][1]);
          s += '<polyline points="' + pl + '" class="mm-glow"/><polyline points="' + pl + '" class="mm-beam" style="stroke-dasharray:' + f(len) + ';--L:' + f(len) + '"/>';
        }
        M.mirrors.forEach(function (m, k) {
          var c = cc(m), o = ori[k], dx = 20, dy = -20 * o, hit = beam && beam.hits.indexOf(k) >= 0;
          s += '<g class="mm-m" data-k="' + k + '" role="button" tabindex="0" aria-label="Mirror ' + 'ABC'[k] + ', leaning ' + (o === 1 ? 'like /' : 'like \\') + '. Tap to turn.">' +
            '<rect x="' + (m[0] * C) + '" y="' + (m[1] * C) + '" width="50" height="50" class="mm-pad"/>';
          if (hit) s += '<line x1="' + f(c[0] - 20 * o) + '" y1="' + f(c[1] - 20) + '" x2="' + f(c[0] + 20 * o) + '" y2="' + f(c[1] + 20) + '" class="mm-norm"/>';
          s += '<line x1="' + (c[0] - dx) + '" y1="' + (c[1] - dy) + '" x2="' + (c[0] + dx) + '" y2="' + (c[1] + dy) + '" class="mm-mback"/>' +
            '<line x1="' + (c[0] - dx) + '" y1="' + (c[1] - dy) + '" x2="' + (c[0] + dx) + '" y2="' + (c[1] + dy) + '" class="mm-mir"/>' +
            '<circle cx="' + (c[0] + (o === 1 ? -15 : 15)) + '" cy="' + (c[1] - 15) + '" r="9" class="mm-lab"/><text x="' + (c[0] + (o === 1 ? -15 : 15)) + '" y="' + (c[1] - 11) + '" text-anchor="middle" class="mm-labt">' + 'ABC'[k] + '</text></g>';
        });
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Laser maze grid with ' + M.mirrors.length + ' mirror' + (M.mirrors.length > 1 ? 's' : '') + ', a target and some rocks.' + (beam ? ' The beam ' + (beam.end === 'hit' ? 'hits the target.' : beam.end === 'rock' ? 'hits a rock.' : 'leaves the grid.') : ''));
        if (!beam) out.innerHTML = 'Mirrors: ' + M.mirrors.map(function (m, k) { return '<b>' + 'ABC'[k] + ' ' + (ori[k] === 1 ? '/' : '\\') + '</b>'; }).join(' · ');
        else out.innerHTML = beam.end === 'hit' ? '🎯 Hit! The beam bounced off ' + beam.hits.length + ' mirror' + (beam.hits.length > 1 ? 's' : '') + '. At each one, incidence = reflection = 45° from the normal (dashed).' :
          beam.end === 'rock' ? '🪨 The beam hit a rock.' : 'The beam went off the grid, heading ' + beam.dir + '.';
      }

      function drawLaw() {
        svg.innerHTML = rayPic(R.law, r, [R.law + '°', r + '°']);
        svg.setAttribute('aria-label', 'A ray hits a flat mirror ' + R.law + ' degrees from the normal. The reflected ray is ' + r + ' degrees from the normal.');
        stage.querySelector('.mm-deg').textContent = r + '°';
        out.innerHTML = 'Incidence <b>' + R.law + '°</b> · reflection <b>' + r + '°</b>';
      }

      function drawTilt(done) {
        svg.innerHTML = rayPic(90 - R.tilt, done ? 90 - R.tilt : null, [done ? (90 - R.tilt) + '°' : '?', done ? (90 - R.tilt) + '°' : '', R.tilt + '°']);
        svg.setAttribute('aria-label', 'A ray hits a flat mirror, making 20 degrees with the mirror surface. The dashed normal is at 90 degrees to the mirror.');
        out.innerHTML = done ? 'Incidence <b>70°</b> · reflection <b>70°</b> (from the normal)' : '';
      }

      function drawShadow() {
        var tx = R.shadow[tp], k = (370 - tx) / (200 - tx), top = 150 - 30 * k, bot = 150 + 30 * k;
        var s = '<polygon points="' + tx + ',150 370,10 370,290" class="mm-cone"/>' +
          '<polygon points="200,120 370,' + f(top) + ' 370,' + f(bot) + ' 200,180" class="mm-shade"/>' +
          '<line x1="' + tx + '" y1="150" x2="370" y2="' + f(top) + '" class="mm-sray"/><line x1="' + tx + '" y1="150" x2="370" y2="' + f(bot) + '" class="mm-sray"/>' +
          '<rect x="370" y="10" width="14" height="280" class="mm-scr"/><rect x="370" y="' + f(top) + '" width="14" height="' + f(bot - top) + '" class="mm-sh"/>' +
          '<rect x="364" y="60" width="26" height="180" rx="3" class="mm-goal"/>' +
          '<rect x="200" y="120" width="16" height="60" rx="2" class="mm-box"/><text x="208" y="200" text-anchor="middle" class="mm-cap">box</text>' +
          '<text x="358" y="286" text-anchor="end" class="mm-cap">screen</text>' +
          '<rect x="' + (tx - 34) + '" y="141" width="30" height="18" rx="4" class="mm-torch"/><path d="M' + (tx - 6) + ' 138 L' + tx + ' 143 L' + tx + ' 157 L' + (tx - 6) + ' 162 Z" class="mm-torch"/><circle cx="' + tx + '" cy="150" r="5" class="mm-bulb"/>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'A torch shines on a box. Straight light rays make a shadow on a screen. The shadow is about ' + k.toFixed(1) + ' times as tall as the box.');
        out.innerHTML = 'Shadow height: about <b>' + k.toFixed(1) + ' ×</b> the box';
      }

      function drawRefract(done) {
        var s = '<rect x="0" y="0" width="400" height="150" class="mm-air"/><rect x="0" y="150" width="400" height="150" class="mm-glass"/>' +
          '<text x="14" y="28" class="mm-cap">air</text><text x="14" y="176" class="mm-cap">glass</text>' +
          '<line x1="200" y1="30" x2="200" y2="290" class="mm-norm"/><text x="206" y="44" class="mm-cap">normal</text>' +
          '<line x1="70" y1="20" x2="200" y2="150" class="mm-ray"/>';
        var P = [['A', 263.8, 270], ['B', 320, 270], ['C', 390, 238.6]];
        P.forEach(function (p, k) {
          var on = done && k === 0;
          s += '<line x1="200" y1="150" x2="' + p[1] + '" y2="' + p[2] + '" class="' + (on ? 'mm-ray' : 'mm-path') + '"/>' +
            '<circle cx="' + (k === 2 ? 372 : p[1]) + '" cy="' + (k === 2 ? 222 : p[2] + 14) + '" r="12" class="mm-lab"/><text x="' + (k === 2 ? 372 : p[1]) + '" y="' + (k === 2 ? 227 : p[2] + 19) + '" text-anchor="middle" class="mm-labt">' + p[0] + '</text>';
        });
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'A ray of light goes from air into glass. Three possible paths in the glass: A bends towards the normal, B goes straight on, C bends away from the normal.');
        out.innerHTML = done ? 'Into glass: light slows down and bends <b>towards</b> the normal.' : '';
      }

      function drawPrism(done) {
        var s = '<polygon points="200,40 110,240 290,240" class="mm-prism"/>' +
          '<line x1="10" y1="178" x2="150.5" y2="150" class="mm-white"/>';
        if (done) {
          SPECTRUM.forEach(function (c, k) {
            s += '<line x1="150.5" y1="150" x2="249.5" y2="' + f(146 + k * 2) + '" style="stroke:' + c + '" class="mm-col in"/>' +
              '<line x1="249.5" y1="' + f(146 + k * 2) + '" x2="392" y2="' + f(172 + k * 12) + '" style="stroke:' + c + '" class="mm-col"/>';
          });
          s += '<text x="340" y="174" class="mm-cap">red</text><text x="330" y="262" class="mm-cap">violet</text>';
        } else s += '<line x1="150.5" y1="150" x2="249.5" y2="150" class="mm-white in"/><text x="330" y="200" text-anchor="middle" class="mm-q">?</text>';
        s += '<text x="14" y="206" class="mm-cap">white light</text><text x="200" y="270" text-anchor="middle" class="mm-cap">glass prism</text>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', done ? 'White light goes into a prism and comes out as a spectrum: red, orange, yellow, green, blue, indigo and violet. Violet bends the most.' : 'White light goes into a glass prism. What comes out is hidden.');
        out.innerHTML = done ? 'Red, orange, yellow, green, blue, indigo, violet: the <b>spectrum</b> 🌈' : '';
      }

      function draw() {
        var lk = stage.classList.contains('locked');
        if (M) drawMaze(); else if (R.law) drawLaw(); else if (R.tilt) drawTilt(lk); else if (R.shadow) drawShadow(); else if (R.refract) drawRefract(lk); else drawPrism(lk);
      }

      if (M) {
        function turn(k) { if (stage.classList.contains('locked')) return; ori[k] = -ori[k]; beam = null; draw(); }
        stage.querySelectorAll('[data-m]').forEach(function (b) { b.addEventListener('click', function () { turn(+b.getAttribute('data-m')); }); });
        svg.addEventListener('click', function (ev) { var g = ev.target.closest('.mm-m'); if (g) turn(+g.getAttribute('data-k')); });
        svg.addEventListener('keydown', function (ev) { var g = ev.target.closest('.mm-m'); if (g && (ev.key === 'Enter' || ev.key === ' ')) { ev.preventDefault(); turn(+g.getAttribute('data-k')); svg.querySelector('[data-k="' + g.getAttribute('data-k') + '"]').focus(); } });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          beam = trace(); draw();
          ui.check(beam.end === 'hit', { hint: R.hint, why: R.why, reveal: function () { ori = R.sol.slice(); beam = trace(); draw(); } });
        });
      } else if (R.law || R.shadow) {
        stage.querySelectorAll('[data-r]').forEach(function (b) { b.addEventListener('click', function () { if (stage.classList.contains('locked')) return; r = Math.max(5, Math.min(85, r + +b.getAttribute('data-r'))); draw(); }); });
        stage.querySelectorAll('[data-t]').forEach(function (b) { b.addEventListener('click', function () { if (stage.classList.contains('locked')) return; tp = Math.max(0, Math.min(R.shadow.length - 1, tp + +b.getAttribute('data-t'))); draw(); }); });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          if (R.law) {
            ui.check(r === R.law, { hint: r === 90 - R.law ? 'You measured from the mirror surface. Angles are measured from the dashed normal, so the reflected ray should match the 40° on the left.' : R.hint,
              why: R.why, reveal: function () { r = R.law; draw(); } });
          } else {
            var ok = tp === R.ans;
            ui.check(ok, { hint: tp < R.ans ? 'The shadow is too small. Move the torch <b>closer</b> to the box: then the straight rays spread out more behind it.' : 'The shadow is too big. Move the torch <b>further</b> from the box.',
              why: 'Light travels in straight lines and can\'t pass through the opaque box. The closer the torch is to the box, the bigger the shadow.', reveal: function () { tp = R.ans; draw(); } });
          }
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            draw();
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
