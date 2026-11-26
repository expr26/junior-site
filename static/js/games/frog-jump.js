/* Frog Jump: adding and subtracting with negative numbers on a number line from -10 to 10.
   The frog starts on the first number; the child hops it left or right (or taps a lily pad) and presses Land.
   Adding a positive number moves right, subtracting moves left; subtracting a negative moves right.
   Check every answer by hand when editing ROUNDS: [start, operator, number, story or ''] */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ROUNDS = [
    [2, '+', 5, ''], [4, '-', 6, ''], [-3, '+', 7, ''], [-2, '-', 5, ''],
    [-4, '+', 6, 'It\'s −4 °C in the morning. By lunchtime the temperature has gone up by 6 degrees.'],
    [-8, '+', 3, ''], [1, '-', -4, ''], [-3, '-', -6, '']
  ];
  var MIN = -10, MAX = 10, X0 = 26, STEP = 29, Y = 112;

  function n(v) { return v < 0 ? '−' + (-v) : String(v); }
  function nb(v) { return v < 0 ? '(−' + (-v) + ')' : String(v); }
  function px(v) { return X0 + (v - MIN) * STEP; }

  Arcade.game({
    intro: 'Ribbit! Help the frog hop along the number line. Adding moves it <b>right</b>, taking away moves it <b>left</b>.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], a = R[0], op = R[1], b = R[2];
      var ans = op === '+' ? a + b : a - b, at = a, busy = false;

      stage.innerHTML = '<p class="q-num">Jump ' + (i + 1) + '</p>' +
        (R[3] ? '<p class="fj-story">' + R[3] + '</p>' : '') +
        '<p class="q-text fj-eq">' + n(a) + ' ' + (op === '+' ? '+' : '−') + ' ' + nb(b) + ' = <b>?</b></p>' +
        '<svg class="fj-svg" viewBox="0 0 640 170" role="img"></svg>' +
        '<p class="fj-at" aria-live="polite"></p>' +
        '<div class="fj-ctrl"><button class="btn ghost" type="button" data-move="-1" aria-label="Hop left">◀ Left</button>' +
        '<button class="btn" type="button" data-land>Land here ✓</button>' +
        '<button class="btn ghost" type="button" data-move="1" aria-label="Hop right">Right ▶</button></div>' +
        '<p class="small fj-reset"><button class="linkish" type="button" data-reset>Back to the start</button> · or tap a lily pad</p>';
      var svg = stage.querySelector('svg'), atTxt = stage.querySelector('.fj-at');

      ui.owl(R[3] ? 'Going up means moving right on the number line.' :
        op === '-' && b < 0 ? 'Taking away a negative number is the same as adding. So which way does the frog go?' :
        'The frog starts on <b>' + n(a) + '</b>. Which way should it hop, and how many jumps?');

      var base = '<line x1="10" y1="' + (Y + 18) + '" x2="630" y2="' + (Y + 18) + '" class="fj-water"/>';
      for (var v = MIN; v <= MAX; v++) {
        base += '<g class="fj-pad' + (v === 0 ? ' zero' : '') + (v % 2 ? ' odd' : '') + '" data-v="' + v + '"><ellipse cx="' + px(v) + '" cy="' + Y + '" rx="13" ry="7"/>' +
          '<text x="' + px(v) + '" y="' + (Y + 44) + '" text-anchor="middle">' + n(v) + '</text></g>';
      }
      base += '<g class="fj-frog"><text class="fj-emoji" x="0" y="0" text-anchor="middle">🐸</text></g>';
      svg.innerHTML = base;
      var frog = svg.querySelector('.fj-frog');

      function place(x, y) { frog.setAttribute('transform', 'translate(' + x + ' ' + y + ')'); }
      function say() {
        var moved = at - a;
        atTxt.innerHTML = 'The frog is on <b>' + n(at) + '</b>' + (moved ? ' (' + Math.abs(moved) + ' jump' + (Math.abs(moved) > 1 ? 's' : '') + ' ' + (moved > 0 ? 'right' : 'left') + ')' : ' (the start)');
        svg.querySelectorAll('.fj-pad').forEach(function (g) { g.classList.toggle('here', +g.getAttribute('data-v') === at); });
        svg.setAttribute('aria-label', 'Number line from −10 to 10. The frog is on ' + n(at) + '.');
      }
      function hop(to, done) {
        to = Math.max(MIN, Math.min(MAX, to));
        var from = at; at = to; say();
        if (still || from === to) { place(px(to), Y - 4); if (done) done(); return; }
        busy = true;
        var t0 = performance.now(), dur = Math.min(900, 260 + 90 * Math.abs(to - from)), lift = 30 + 6 * Math.min(8, Math.abs(to - from));
        (function f(t) {
          var p = Math.min(1, (t - t0) / dur), x = px(from) + (px(to) - px(from)) * p, y = Y - 4 - lift * 4 * p * (1 - p);
          place(x, y);
          if (p < 1) requestAnimationFrame(f); else { busy = false; if (done) done(); }
        })(t0);
      }
      place(px(a), Y - 4); say();

      stage.querySelectorAll('[data-move]').forEach(function (btn) {
        btn.addEventListener('click', function () { if (!busy && !stage.classList.contains('locked')) hop(at + (+btn.getAttribute('data-move'))); });
      });
      stage.querySelector('[data-reset]').addEventListener('click', function () { if (!busy && !stage.classList.contains('locked')) hop(a); });
      svg.addEventListener('click', function (ev) {
        if (busy || stage.classList.contains('locked')) return;
        var pt = svg.createSVGPoint(); pt.x = ev.clientX; pt.y = ev.clientY;
        var loc = pt.matrixTransform(svg.getScreenCTM().inverse());
        hop(Math.round((loc.x - X0) / STEP) + MIN);
      });

      var dir = (op === '+') === (b > 0) ? 'right' : 'left', steps = Math.abs(b);
      var why = n(a) + ' ' + (op === '+' ? '+' : '−') + ' ' + nb(b) + ' = ' + n(ans) + ': start on ' + n(a) + ' and hop ' + steps + ' to the ' + dir + '.' +
        (op === '-' && b < 0 ? ' Taking away a negative is the same as adding: ' + n(a) + ' + ' + steps + '.' : '');

      stage.querySelector('[data-land]').addEventListener('click', function () {
        if (busy || stage.classList.contains('locked')) return;
        var hint;
        if (at === a) hint = 'The frog hasn\'t moved yet! It needs to hop ' + steps + ' times.';
        else if ((at > a) !== (dir === 'right')) hint = (op === '-' && b < 0) ? 'Careful: taking away a negative number moves the frog <b>right</b>, the same as adding.' :
          'Wrong way! ' + (op === '+' ? 'Adding' : 'Taking away') + ' ' + steps + ' moves the frog to the <b>' + dir + '</b>.';
        else hint = 'Right direction! Now count the jumps: you need exactly ' + steps + ', and the frog has made ' + Math.abs(at - a) + '.';
        ui.check(at === ans, { hint: hint, why: why, reveal: function () { hop(a, function () { hop(ans); }); } });
      });
    }
  });
})();
