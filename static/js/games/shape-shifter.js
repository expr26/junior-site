/* Shape Shifter: shapes on a coordinate grid from −5 to 5. The child moves a dashed "ghost" copy of shape A with buttons
   (move 1 square, Flip ↔ / Flip ↕ about the ghost's own middle, Turn ↻ 90° clockwise in place) until it sits exactly on the image.
   A ghost is right when its corners are exactly the image's corners. Rules used:
   translation (a, b): (x, y) → (x + a, y + b); reflection in the y-axis: (x, y) → (−x, y); in the x-axis: (x, y) → (x, −y);
   in the line x = 1: (x, y) → (2 − x, y); rotation 90° clockwise about (0, 0): (x, y) → (y, −x); 180° about (0, 0): (x, y) → (−x, −y).
   Shapes: L = (0,0) (2,0) (2,1) (1,1) (1,3) (0,3); T = right-angled triangle (0,0) (3,0) (0,2). ★ marks the last corner of each.
   Worked by hand:
   R1 L at (−4,1)…: 3 right, 2 down → (−1,−1) (1,−1) (1,0) (0,0) (0,2) (−1,2); ★ (−4,4) → (−1,2).
   R2 L (1,1) (3,1) (3,2) (2,2) (2,4) (1,4), y-axis → (−1,1) (−3,1) (−3,2) (−2,2) (−2,4) (−1,4); ★ (1,4) → (−1,4).
   R3 T (−4,1) (−1,1) (−4,3), x-axis → (−4,−1) (−1,−1) (−4,−3); ★ (−4,3) → (−4,−3).
   R4 a 6 by 4 rectangle (not a square) has 2 lines of symmetry; the diagonals are not lines of symmetry.
   R5 L (−2,−2) (0,−2) (0,−1) (−1,−1) (−1,1) (−2,1), x = 1 → (4,−2) (2,−2) (2,−1) (3,−1) (3,1) (4,1); ★ (−2,1) → (4,1).
   R6 L at (1,1)… turned 90° clockwise about (0,0) → (1,−1) (1,−3) (2,−3) (2,−2) (4,−2) (4,−1); ★ (1,4) → (4,−1).
   R7 T (1,1) (4,1) (1,3), 180° about (0,0) → (−1,−1) (−4,−1) (−1,−3); ★ (1,3) → (−1,−3).
   R8 A = T (1,−4) (4,−4) (1,−2), B = (−3,−1) (0,−1) (−3,1): every corner moves 4 left and 3 up, same way round → translation. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var L = [[0, 0], [2, 0], [2, 1], [1, 1], [1, 3], [0, 3]], T = [[0, 0], [3, 0], [0, 2]];
  function at(S, dx, dy) { return S.map(function (p) { return [p[0] + dx, p[1] + dy]; }); }
  function map(S, fn) { return S.map(function (p) { return fn(p[0], p[1]); }); }
  function nn(v) { return v < 0 ? '−' + (-v) : String(v); }
  function pt(p) { return '(' + nn(p[0]) + ', ' + nn(p[1]) + ')'; }

  var ROUNDS = [
    { a: at(L, -4, 1), fn: function (x, y) { return [x + 3, y - 2]; }, tools: [], text: 'Translate shape A <b>3 right</b> and <b>2 down</b>. Move the ghost there, then press <b>Check</b>.',
      owl: 'A translation slides a shape. It does not turn or flip.',
      hint: '3 right means every x goes up by 3. 2 down means every y goes down by 2. Follow the ★ corner.',
      why: 'Every corner moved 3 right and 2 down, so ★ went from (−4, 4) to (−1, 2). As a column vector the translation is (3, −2).' },
    { a: at(L, 1, 1), fn: function (x, y) { return [-x, y]; }, tools: ['fh', 'fv'], mirror: 'y', text: 'Reflect shape A in the <b>y-axis</b> 🪞. Flip and move the ghost, then press <b>Check</b>.',
      owl: 'The y-axis is the up-and-down line through 0. Imagine it is a mirror.',
      hint: 'Each corner must end up the same distance from the y-axis, on the other side. ★ at (1, 4) goes to (−1, 4).',
      why: 'Reflecting in the y-axis flips the shape left to right: (x, y) goes to (−x, y), so ★ (1, 4) went to (−1, 4).' },
    { a: at(T, -4, 1), fn: function (x, y) { return [x, -y]; }, tools: ['fh', 'fv'], mirror: 'x', text: 'Reflect the triangle in the <b>x-axis</b> 🪞. Flip and move the ghost, then press <b>Check</b>.',
      owl: 'The x-axis is the flat line across the middle. Imagine it is a mirror.',
      hint: 'The x-axis is the horizontal line, so the shape flips upside down. ★ at (−4, 3) goes to (−4, −3).',
      why: 'Reflecting in the x-axis flips the shape top to bottom: (x, y) goes to (x, −y), so ★ (−4, 3) went to (−4, −3).' },
    { rect: true, q: 'How many lines of symmetry does this rectangle have?', opts: ['2', '4', '1', '0'], ans: 0,
      owl: 'A line of symmetry folds a shape into two halves that match exactly.',
      hint: 'Imagine folding along a diagonal. Do the two halves land exactly on top of each other? Try it with a paper rectangle!',
      why: 'A rectangle has 2 lines of symmetry: one across the middle each way. Folding along a diagonal does not make the halves match (only a square has 4).' },
    { a: at(L, -2, -2), fn: function (x, y) { return [2 - x, y]; }, tools: ['fh', 'fv'], mirror: 'x1', text: 'Reflect shape A in the line <b>x = 1</b> (the pink mirror). Then press <b>Check</b>.',
      owl: 'Careful: this mirror is not an axis. It is the line where every point has x = 1.',
      hint: 'Measure from the pink line, not the y-axis. ★ at (−2, 1) is 3 squares left of x = 1, so its image is 3 squares right: (4, 1).',
      why: '★ (−2, 1) was 3 squares left of the mirror line x = 1, so its image (4, 1) is 3 squares to the right of it.' },
    { a: at(L, 1, 1), fn: function (x, y) { return [y, -x]; }, tools: ['turn'], centre: true, text: 'Rotate shape A <b>90° clockwise</b> about the origin (0, 0) 🔄. Turn and move the ghost, then press <b>Check</b>.',
      owl: 'Clockwise is the way a clock\'s hands go. Tracing paper helps in real life!',
      hint: 'A quarter turn clockwise about (0, 0) sends (x, y) to (y, −x). So ★ at (1, 4) goes to (4, −1). Turn the ghost once, then move it.',
      why: 'A 90° clockwise turn about the origin sends (x, y) to (y, −x): ★ (1, 4) went to (4, −1), and the shape now lies on its side.' },
    { a: at(T, 1, 1), fn: function (x, y) { return [-x, -y]; }, tools: ['turn'], centre: true, text: 'Rotate the triangle <b>180°</b> (a half turn) about the origin (0, 0). Then press <b>Check</b>.',
      owl: 'A half turn is two quarter turns. The shape ends up upside down on the other side of (0, 0).',
      hint: 'A half turn about (0, 0) sends (x, y) to (−x, −y). ★ at (1, 3) goes to (−1, −3). Turn the ghost twice.',
      why: 'A 180° turn about the origin sends (x, y) to (−x, −y): ★ (1, 3) went to (−1, −3).' },
    { name: true, q: 'Which transformation takes shape A to shape B?', opts: ['Translation 4 left and 3 up', 'Reflection in the y-axis', 'Rotation 90° clockwise about (0, 0)', 'Translation 3 left and 4 up'], ans: 0,
      owl: 'Is B the same way round as A? If so, it has only slid.',
      hint: 'B is the same way round as A, so nothing flipped or turned. Count how far the ★ corner moved left, then up.',
      why: 'B is the same way round as A, and every corner moved 4 left and 3 up (★ (1, −2) to (−3, 1)). That is a translation.' }
  ];
  ROUNDS.forEach(function (R) { if (R.a) R.b = map(R.a, R.fn); });

  var O = 170, U = 28;
  function X(x) { return O + x * U; } function Y(y) { return O - y * U; }
  function pts(S) { return S.map(function (p) { return X(p[0]) + ',' + Y(p[1]); }).join(' '); }
  function key(S) { return S.map(function (p) { return p[0] + ',' + p[1]; }).sort().join(' '); }
  function box(S) { var xs = S.map(function (p) { return p[0]; }), ys = S.map(function (p) { return p[1]; }); return [Math.min.apply(0, xs), Math.min.apply(0, ys), Math.max.apply(0, xs), Math.max.apply(0, ys)]; }
  function norm(S) { var b = box(S); return key(at(S, -b[0], -b[1])); }
  function inside(S) { var b = box(S); return at(S, Math.max(0, -5 - b[0]) - Math.max(0, b[2] - 5), Math.max(0, -5 - b[1]) - Math.max(0, b[3] - 5)); }

  function grid() {
    var s = '<rect x="' + X(-5) + '" y="' + Y(5) + '" width="' + 10 * U + '" height="' + 10 * U + '" class="shf-bg"/>';
    for (var k = -5; k <= 5; k++) s += '<line x1="' + X(k) + '" y1="' + Y(5) + '" x2="' + X(k) + '" y2="' + Y(-5) + '" class="shf-gl"/><line x1="' + X(-5) + '" y1="' + Y(k) + '" x2="' + X(5) + '" y2="' + Y(k) + '" class="shf-gl"/>';
    s += '<line x1="' + (X(-5) - 8) + '" y1="' + O + '" x2="' + (X(5) + 8) + '" y2="' + O + '" class="shf-ax"/><line x1="' + O + '" y1="' + (Y(5) - 8) + '" x2="' + O + '" y2="' + (Y(-5) + 8) + '" class="shf-ax"/>';
    return s;
  }
  function labels() {
    var s = '';
    for (var k = -5; k <= 5; k++) if (k) s += '<text x="' + X(k) + '" y="' + (O + 14) + '" text-anchor="middle" class="shf-num">' + nn(k) + '</text><text x="' + (O - 5) + '" y="' + (Y(k) + 4) + '" text-anchor="end" class="shf-num">' + nn(k) + '</text>';
    return s + '<text x="' + (X(5) + 10) + '" y="' + (O + 5) + '" class="shf-axl">x</text><text x="' + (O + 6) + '" y="' + (Y(5) - 6) + '" class="shf-axl">y</text>';
  }
  function star(S, cls) { var p = S[S.length - 1]; return '<text x="' + X(p[0]) + '" y="' + (Y(p[1]) + 6) + '" text-anchor="middle" class="shf-star ' + cls + '">★</text>'; }
  function tag(S, t, cls) { var c = S.length === 6 ? [S[0][0] + 0.5, S[0][1] + 1.6] : [S[0][0] + 0.85, S[0][1] + 0.6]; return '<text x="' + X(c[0]) + '" y="' + (Y(c[1]) + 6) + '" text-anchor="middle" class="shf-tag ' + (cls || '') + '">' + t + '</text>'; }

  Arcade.game({
    intro: 'Welcome to Shape Shifter! 🔷 Slide, flip and turn a ghost copy of each shape to land it in exactly the right place.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], g = R.a ? R.a.slice() : null, solved = false, tries = 0;
      var tools = { fh: 'Flip ↔', fv: 'Flip ↕', turn: 'Turn ↻ 90°' };
      stage.innerHTML = '<p class="q-num">Shift ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="shf-svg" viewBox="0 0 340 340" role="img"></svg><p class="shf-out" aria-live="polite"></p>' +
        (R.opts ? '<div class="q-options"></div>' :
          '<div class="shf-pad"><button class="btn ghost" type="button" data-m="-1,0" aria-label="Move left">←</button><button class="btn ghost" type="button" data-m="0,1" aria-label="Move up">↑</button>' +
          '<button class="btn ghost" type="button" data-m="0,-1" aria-label="Move down">↓</button><button class="btn ghost" type="button" data-m="1,0" aria-label="Move right">→</button></div>' +
          '<div class="shf-tools">' + R.tools.map(function (t) { return '<button class="btn ghost" type="button" data-t="' + t + '">' + tools[t] + '</button>'; }).join('') +
          '<button class="btn ghost" type="button" data-reset>Reset</button></div>' +
          '<p class="actions shf-act"><button class="btn" type="button" data-check>Check ✓</button></p>');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.shf-out');
      ui.owl(R.owl);

      function draw() {
        var s = grid() + labels(), lab = '';
        if (R.mirror === 'y') s += '<line x1="' + O + '" y1="' + (Y(5) - 8) + '" x2="' + O + '" y2="' + (Y(-5) + 8) + '" class="shf-mir"/>';
        if (R.mirror === 'x') s += '<line x1="' + (X(-5) - 8) + '" y1="' + O + '" x2="' + (X(5) + 8) + '" y2="' + O + '" class="shf-mir"/>';
        if (R.mirror === 'x1') s += '<line x1="' + X(1) + '" y1="' + (Y(5) - 8) + '" x2="' + X(1) + '" y2="' + (Y(-5) + 8) + '" class="shf-mir"/>';
        if (R.rect) {
          s += '<polygon points="' + pts([[-3, -2], [3, -2], [3, 2], [-3, 2]]) + '" class="shf-a"/>';
          if (solved) s += '<line x1="' + X(-4) + '" y1="' + O + '" x2="' + X(4) + '" y2="' + O + '" class="shf-sym"/><line x1="' + O + '" y1="' + Y(3) + '" x2="' + O + '" y2="' + Y(-3) + '" class="shf-sym"/>';
          lab = 'A rectangle 6 squares wide and 4 squares tall, centred on the origin.' + (solved ? ' Its two lines of symmetry are shown.' : '');
        } else if (R.name) {
          var A = at(T, 1, -4), B = map(A, function (x, y) { return [x - 4, y + 3]; });
          s += '<polygon points="' + pts(A) + '" class="shf-a"/><polygon points="' + pts(B) + '" class="shf-b"/>' + star(A, 'a') + star(B, 'b');
          lab = 'Triangle A with corners (1, −4), (4, −4) and (1, −2). Triangle B with corners (−3, −1), (0, −1) and (−3, 1).';
        } else {
          s += '<polygon points="' + pts(R.a) + '" class="shf-a"/>' + star(R.a, 'a');
          s += '<polygon points="' + pts(g) + '" class="shf-g' + (solved ? ' done' : '') + '"/>' + star(g, 'g');
          lab = 'Shape A with its star corner at ' + pt(R.a[R.a.length - 1]) + '. The ghost copy has its star corner at ' + pt(g[g.length - 1]) + '.';
          out.innerHTML = 'A ★ at <b>' + pt(R.a[R.a.length - 1]) + '</b> · Ghost ★ at <b>' + pt(g[g.length - 1]) + '</b>';
        }
        if (R.centre) s += '<circle cx="' + O + '" cy="' + O + '" r="6" class="shf-c"/>';
        if (R.a) s += tag(R.a, 'A');
        if (R.name) s += tag(at(T, 1, -4), 'A') + tag(map(at(T, 1, -4), function (x, y) { return [x - 4, y + 3]; }), 'B', 'b');
        if (R.mirror === 'x1') s += '<text x="' + (X(1) + 5) + '" y="' + (Y(5) + 14) + '" class="shf-ml">x = 1</text>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Coordinate grid from −5 to 5. ' + lab);
      }

      function locked() { return stage.classList.contains('locked'); }
      stage.querySelectorAll('[data-m]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (locked()) return; var d = b.getAttribute('data-m').split(',').map(Number), n = at(g, d[0], d[1]), bx = box(n);
          if (bx[0] >= -5 && bx[1] >= -5 && bx[2] <= 5 && bx[3] <= 5) { g = n; draw(); }
        });
      });
      stage.querySelectorAll('[data-t]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (locked()) return; var t = b.getAttribute('data-t'), bx = box(g), n;
          if (t === 'fh') n = map(g, function (x, y) { return [bx[0] + bx[2] - x, y]; });
          if (t === 'fv') n = map(g, function (x, y) { return [x, bx[1] + bx[3] - y]; });
          if (t === 'turn') { n = map(g, function (x, y) { return [y, -x]; }); var nb = box(n); n = at(n, bx[0] - nb[0], bx[1] - nb[1]); }
          g = inside(n); draw();
        });
      });
      var rs = stage.querySelector('[data-reset]');
      if (rs) rs.addEventListener('click', function () { if (locked()) return; g = R.a.slice(); draw(); });
      var chk = stage.querySelector('[data-check]');
      if (chk) chk.addEventListener('click', function () {
        if (locked()) return;
        var ok = key(g) === key(R.b), pre = '';
        if (!ok && !tries) {
          if (norm(g) !== norm(R.b)) pre = R.tools.length ? (R.tools[0] === 'turn' ? 'The ghost is not turned the right way yet. ' : 'The ghost is facing the wrong way: a reflection flips the shape over. ') : '';
          else if (!R.tools.length) { var dx = g[0][0] - R.a[0][0], dy = g[0][1] - R.a[0][1], mvd = [];
            if (dx) mvd.push(Math.abs(dx) + ' ' + (dx < 0 ? 'left' : 'right')); if (dy) mvd.push(Math.abs(dy) + ' ' + (dy < 0 ? 'down' : 'up'));
            pre = mvd.length ? 'You moved it ' + mvd.join(' and ') + '. ' : 'The ghost has not moved yet. '; }
          else pre = 'It faces the right way, but it is in the wrong place. ';
        }
        tries++;
        if (ok) solved = true;
        ui.check(ok, { hint: pre + R.hint, why: R.why, reveal: function () { g = R.b.slice(); solved = true; } });
        draw();
      });
      if (R.opts) {
        var bx2 = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { bx2.children[R.ans].classList.add('right'); } });
            if (locked()) { solved = true; draw(); }
          });
          bx2.appendChild(b);
        });
      }
      draw();
    }
  });
})();
