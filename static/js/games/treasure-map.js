/* Treasure Map: coordinates in all four quadrants on a grid from -5 to 5.
   "dig" rounds: tap the point (x, y), then Dig. "read" rounds: choose the coordinates of a picture.
   Coordinates are (x, y): x along (left/right) first, then y up/down. Check every round by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var ROUNDS = [
    { dig: [3, 2] }, { dig: [1, 4] },
    { read: [4, 1], icon: '🦜', name: 'parrot', opts: [[4, 1], [1, 4], [4, -1]] },
    { dig: [-3, 2] }, { dig: [2, -4] },
    { read: [-2, -3], icon: '🦀', name: 'crab', opts: [[-3, -2], [-2, -3], [2, 3]] },
    { dig: [-4, -1] }, { dig: [0, -3] }
  ];
  var C = 170, S = 28;   // centre of the grid and the size of one square

  function n(v) { return v < 0 ? '−' + (-v) : String(v); }
  function pt(p) { return '(' + n(p[0]) + ', ' + n(p[1]) + ')'; }
  function X(x) { return C + x * S; }
  function Y(y) { return C - y * S; }

  function grid() {
    var s = '<rect x="14" y="14" width="312" height="312" rx="26" class="tm-sea"/>' +
      '<path class="tm-land" d="M60 70 Q120 20 200 50 Q300 60 290 150 Q320 240 250 290 Q170 330 100 280 Q30 240 50 160 Q30 110 60 70 Z"/>';
    for (var k = -5; k <= 5; k++) {
      s += '<line class="tm-line" x1="' + X(k) + '" y1="' + Y(-5) + '" x2="' + X(k) + '" y2="' + Y(5) + '"/>' +
        '<line class="tm-line" x1="' + X(-5) + '" y1="' + Y(k) + '" x2="' + X(5) + '" y2="' + Y(k) + '"/>';
    }
    s += '<line class="tm-axis" x1="' + X(-5.4) + '" y1="' + C + '" x2="' + X(5.4) + '" y2="' + C + '"/>' +
      '<line class="tm-axis" x1="' + C + '" y1="' + Y(-5.4) + '" x2="' + C + '" y2="' + Y(5.4) + '"/>' +
      '<text class="tm-ax" x="' + X(5.5) + '" y="' + (C - 6) + '">x</text><text class="tm-ax" x="' + (C + 6) + '" y="' + Y(5.45) + '">y</text>';
    for (k = -5; k <= 5; k++) {
      if (!k) continue;
      s += '<text class="tm-num" x="' + X(k) + '" y="' + (C + 17) + '" text-anchor="middle">' + n(k) + '</text>' +
        '<text class="tm-num" x="' + (C - 6) + '" y="' + (Y(k) + 5) + '" text-anchor="end">' + n(k) + '</text>';
    }
    return s + '<text class="tm-num" x="' + (C - 6) + '" y="' + (C + 17) + '" text-anchor="end">0</text>';
  }

  Arcade.game({
    intro: 'Ahoy! Use coordinates to find buried treasure. Remember: <b>x first</b> (along), <b>then y</b> (up or down).',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], pick = null;
      stage.innerHTML = '<p class="q-num">Map ' + (i + 1) + '</p>' +
        '<p class="q-text">' + (R.dig ? 'The treasure is buried at <b class="tm-target">' + pt(R.dig) + '</b>. Tap the spot, then dig!' :
          'What are the coordinates of the ' + R.name + ' ' + R.icon + '?') + '</p>' +
        '<svg class="tm-svg" viewBox="0 0 340 340" role="img" aria-label="Map with a coordinate grid from −5 to 5 on both axes"></svg>' +
        (R.dig ? '<p class="tm-pick" aria-live="polite">Tap a point where two lines cross.</p><p class="actions tm-act"><button class="btn" type="button" data-dig disabled>Dig here ⛏️</button></p>' :
          '<div class="q-options"></div>');
      var svg = stage.querySelector('svg');
      var layer = '<g class="tm-marks"></g>';
      svg.innerHTML = grid() + (R.read ? '<text class="tm-icon" x="' + X(R.read[0]) + '" y="' + (Y(R.read[1]) + 9) + '" text-anchor="middle">' + R.icon + '</text>' : '') + layer;
      var marks = svg.querySelector('.tm-marks');

      ui.owl(i === 0 ? 'Start at the middle (0, 0). Go along to x, then up to y.' :
        i === 3 ? 'A negative x means go <b>left</b> from the middle.' :
        i === 4 ? 'A negative y means go <b>down</b> from the middle.' :
        R.read ? 'Read x first: how far along? Then y: how far up or down?' : 'Along first, then up or down!');

      function mark(p, cls, txt) {
        marks.innerHTML += '<g class="' + cls + '"><circle cx="' + X(p[0]) + '" cy="' + Y(p[1]) + '" r="11"/>' +
          (txt ? '<text x="' + X(p[0]) + '" y="' + (Y(p[1]) + 7) + '" text-anchor="middle">' + txt + '</text>' : '') + '</g>';
      }

      function hint(p, want) {
        if (p[0] === want[1] && p[1] === want[0] && p[0] !== p[1]) return 'You swapped x and y. The first number is <b>x</b> (along), the second is <b>y</b> (up or down).';
        if (Math.abs(p[0]) === Math.abs(want[0]) && Math.abs(p[1]) === Math.abs(want[1])) return 'So close! Check the signs: negative x is <b>left</b> of the middle, negative y is <b>below</b> it.';
        return 'Start at (0, 0). Count ' + Math.abs(want[0]) + ' ' + (want[0] < 0 ? 'left' : 'right') + ', then ' + Math.abs(want[1]) + ' ' + (want[1] < 0 ? 'down' : 'up') + '.';
      }

      if (R.dig) {
        var btn = stage.querySelector('[data-dig]'), say = stage.querySelector('.tm-pick');
        svg.addEventListener('click', function (ev) {
          if (stage.classList.contains('locked')) return;
          var q = svg.createSVGPoint(); q.x = ev.clientX; q.y = ev.clientY;
          var l = q.matrixTransform(svg.getScreenCTM().inverse());
          var x = Math.round((l.x - C) / S), y = Math.round((C - l.y) / S);
          if (Math.abs(x) > 5 || Math.abs(y) > 5) return;
          pick = [x, y];
          marks.querySelectorAll('.tm-pickmark').forEach(function (m) { m.remove(); });
          mark(pick, 'tm-pickmark', '✕');
          say.innerHTML = 'You picked <b>' + pt(pick) + '</b>';
          btn.disabled = false;
        });
        btn.addEventListener('click', function () {
          if (!pick) return;
          var ok = pick[0] === R.dig[0] && pick[1] === R.dig[1];
          if (!ok) { marks.querySelectorAll('.tm-pickmark').forEach(function (m) { m.setAttribute('class', 'tm-miss'); }); }
          ui.check(ok, {
            hint: hint(pick, R.dig),
            why: pt(R.dig) + ': ' + (R.dig[0] ? Math.abs(R.dig[0]) + ' ' + (R.dig[0] < 0 ? 'left' : 'right') : 'stay on the y-axis') + ', then ' + Math.abs(R.dig[1]) + ' ' + (R.dig[1] < 0 ? 'down' : 'up') + '.',
            reveal: function () { mark(R.dig, 'tm-gold', '💰'); }
          });
          if (ok) { marks.querySelectorAll('.tm-pickmark').forEach(function (m) { m.remove(); }); mark(R.dig, 'tm-gold', '💰'); }
          pick = null; btn.disabled = true;
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o) {
          var b = h('button', 'opt', pt(o)); b.type = 'button';
          b.addEventListener('click', function () {
            var ok = o[0] === R.read[0] && o[1] === R.read[1];
            b.classList.add(ok ? 'right' : 'wrong'); if (!ok) b.disabled = true;
            ui.check(ok, { hint: hint(o, R.read), why: 'The ' + R.name + ' is ' + Math.abs(R.read[0]) + ' ' + (R.read[0] < 0 ? 'left' : 'right') + ' and ' + Math.abs(R.read[1]) + ' ' + (R.read[1] < 0 ? 'down' : 'up') + ', so it is at ' + pt(R.read) + '.',
              reveal: function () { [].forEach.call(box.children, function (c) { if (c.textContent === pt(R.read)) c.classList.add('right'); }); } });
          });
          box.appendChild(b);
        });
      }
    }
  });
})();
