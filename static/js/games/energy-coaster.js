/* Energy Coaster: a roller coaster car (with riders, 500 kg in total) on a track with 5 stops.
   Gravitational store = m × g × h with g = 10 N/kg, so each metre of height is 5 kJ: 20 m → 100 kJ, 16 m → 80 kJ, 12 m → 60 kJ, 0 m → 0 kJ.
   The car starts at rest at 20 m, so the total is always 100 kJ (conservation of energy).
   Stops: start (20 m), first dip (0 m), middle hill (12 m), second dip (0 m), last hill (20 m).
   No friction: kinetic = 100 − gravitational, so [G,K,T] = [100,0,0] [0,100,0] [60,40,0] [0,100,0] [100,0,0].
   Friction (simple model): each of the 4 parts of the track transfers 5 kJ to the thermal store, so
   [G,K,T] = [100,0,0] [0,95,5] [60,30,10] [0,85,15] and on the last hill the car stops at 16 m with [80,0,20].
   All wasted energy is shown in the thermal store (in real life a little goes as sound, which also ends up warming the air).
   Sankey round: filament bulb, 100 J in, 20 J light (useful), so 80 J heating (wasted); efficiency 20 ÷ 100 = 20%.
   Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var KEYS = [[40, 20], [120, 0], [200, 12], [280, 0], [360, 20]];
  var NAMES = ['the start', 'the bottom of the first dip', 'the top of the middle hill', 'the bottom of the second dip', 'the last hill'];
  var E0 = [[100, 0, 0], [0, 100, 0], [60, 40, 0], [0, 100, 0], [100, 0, 0]];
  var E1 = [[100, 0, 0], [0, 95, 5], [60, 30, 10], [0, 85, 15], [80, 0, 20]];
  var STORES = [['Gravitational', '🏔️', 'ec-g'], ['Kinetic', '💨', 'ec-k'], ['Thermal', '🔥', 'ec-t']];

  var TILES = [
    { e: '🔋', name: 'Battery', st: 'chemical' }, { e: '🏹', name: 'Pulled-back bow', st: 'elastic' },
    { e: '🍌', name: 'Banana', st: 'chemical' }, { e: '☕', name: 'Hot cocoa', st: 'thermal' },
    { e: '⚽', name: 'Rolling ball', st: 'kinetic' }, { e: '🎢', name: 'Car at the top of a hill', st: 'gravitational' }
  ];
  var WAYS = ['Choose…', 'Electrically', 'By forces', 'By heating', 'By radiation'];
  var MATCH = [
    { e: '🔌', t: 'A cable carries energy from the mains to the ride\'s motor', a: 1 },
    { e: '⛓️', t: 'The chain lift pulls the car up the first hill', a: 2 },
    { e: '☀️', t: 'Sunshine warms up the track', a: 4 },
    { e: '🔥', t: 'Hot brakes warm up the air around them', a: 3 }
  ];

  var ROUNDS = [
    { view: 'coaster', drive: true, text: 'Drive the car to a place where its <b>kinetic</b> store is the biggest (where it moves fastest), then press <b>Done</b>.',
      ok: function (p) { return p === 1 || p === 3; },
      hint: 'Kinetic energy is movement energy. A coaster is fastest at the lowest point, where its gravitational store is smallest.',
      why: 'At the bottom of a dip, all 100 kJ from the gravitational store has been transferred to the kinetic store, so the car is going fastest.' },
    { view: 'coaster', start: 2, hideK: true, q: 'The car started with <b>100 kJ</b> and there is no friction. At the top of the middle hill the gravitational store has 60 kJ. How much is in the kinetic store?',
      opts: ['40 kJ', '60 kJ', '100 kJ', '0 kJ'], ans: 0,
      hint: 'Energy is conserved: the stores must still add up to 100 kJ altogether.', why: '100 kJ − 60 kJ = 40 kJ. The total stays 100 kJ: the energy is just shared between the stores.' },
    { view: 'coaster', drive: true, fric: true, text: 'The wheels rub and the air pushes back: <b>friction is ON</b> 🔥. Drive the car as far along the track as it can go, then press <b>Done</b>.',
      ok: function (p) { return p === 4; },
      hint: 'Keep pressing Forward ▶ until the car can\'t go any further.',
      why: 'The car only gets 16 m up the last hill. Friction transferred 5 kJ to the thermal store on each part of the track, so only 80 kJ was left for the gravitational store.' },
    { view: 'coaster', drive: true, fric: true, q: 'With friction, why can\'t the car climb back up to 20 m, its starting height?',
      opts: ['Some energy was transferred to the thermal store of the wheels, track and air', 'The energy got used up and disappeared', 'Gravity is stronger on the last hill'], ans: 0,
      hint: 'Energy is never used up. Drive the car and watch the 🔥 thermal meter.', why: 'Friction warms the wheels, track and air a little. The total is still 100 kJ, but less is left to lift the car back up.' },
    { view: 'tiles', text: 'Every energy store has a name! Tap the thing with energy in an <b>elastic</b> store.',
      hint: 'Elastic stores are in things that are stretched, squashed or bent. Which one is being stretched?',
      why: 'A pulled-back bow is bent and its string is stretched, so it has an elastic store. Let go, and the energy goes to the arrow\'s kinetic store.' },
    { view: 'match', text: 'Energy moves between stores in four ways. Tap each button to choose how the energy is transferred, then press <b>Check</b>.',
      why: 'Electrically means by an electric current, by forces means by a push or pull, by heating means from a hotter thing to a cooler thing, and by radiation means by light or other waves, like sunshine.' },
    { view: 'sankey', text: 'The ride\'s old <b>filament bulbs</b>: each takes in 100 J of electrical energy and gives out 20 J as light. Make the wasted arrow the right size, then press <b>Check</b>.',
      hint: 'Energy in = energy out. The two arrows coming out must add up to the 100 J going in.',
      why: '20 J + 80 J = 100 J, so no energy is lost. Efficiency = useful ÷ total in = 20 ÷ 100 = 20%, so this bulb wastes most of its energy heating the room.' },
    { view: 'coaster', start: 4, fric: true, q: 'At the end of the day the ride stops and cools down. What has happened to all its energy?',
      opts: ['It has spread out into the thermal stores of the surroundings', 'It has been used up and destroyed', 'It has turned back into electricity by itself'], ans: 0,
      hint: 'Energy can\'t be made or destroyed, only transferred. Where does the energy in the 🔥 thermal store go?',
      why: 'Energy is never used up. It ends up spread out as a slightly warmer track, air and surroundings, where it is hard to use again.' }
  ];

  function f(v) { return v.toFixed(1); }
  function eh(t) { return (1 - Math.cos(Math.PI * t)) / 2; }
  function hAt(x) {
    if (x <= KEYS[0][0]) return KEYS[0][1];
    for (var k = 0; k < KEYS.length - 1; k++) {
      var a = KEYS[k], b = KEYS[k + 1];
      if (x <= b[0]) return a[1] + (b[1] - a[1]) * eh((x - a[0]) / (b[0] - a[0]));
    }
    return KEYS[KEYS.length - 1][1];
  }
  function Y(hm) { return 170 - hm * 6.5; }
  // where the car stops on the last hill with friction: height 16 m, so eh(t) = 0.8
  var XSTOP = 280 + 80 * Math.acos(-0.6) / Math.PI;
  function xOf(p, fric) { return p === 4 && fric ? XSTOP : KEYS[p][0]; }

  Arcade.game({
    intro: 'All aboard the Energy Coaster! Watch the energy move between stores as the car whooshes up and down.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], pos = R.start || 0, carX = xOf(pos, R.fric), busy = false, showK = !R.hideK;
      var picked = null, choice = MATCH.map(function () { return 0; }), marks = null, waste = 50;

      var html = '<p class="q-num">Ride ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>';
      if (R.view === 'coaster' || R.view === 'sankey') html += '<svg class="ec-svg ec-' + R.view + '" viewBox="0 0 400 ' + (R.view === 'coaster' ? 290 : 280) + '" role="img"></svg>';
      if (R.view === 'tiles') html += '<div class="ec-tiles"></div>';
      if (R.view === 'match') html += '<div class="ec-match"></div>';
      html += '<p class="ec-out" aria-live="polite"></p>';
      if (R.drive) html += '<p class="actions ec-act"><button class="btn ghost" type="button" data-m="-1">' + (R.fric ? '↺ Restart' : '◀ Back') + '</button><button class="btn" type="button" data-m="1">Forward ▶</button>' +
        (R.ok ? '<button class="btn ghost" type="button" data-done>Done ✓</button>' : '') + '</p>';
      if (R.view === 'sankey') html += '<p class="actions ec-act"><button class="btn ghost" type="button" data-w="-10">−10 J</button><button class="btn ghost" type="button" data-w="10">+10 J</button><button class="btn" type="button" data-done>Check ✓</button></p>';
      if (R.view === 'match') html += '<p class="actions ec-act"><button class="btn" type="button" data-done>Check ✓</button></p>';
      if (R.q) html += '<div class="q-options"></div>';
      stage.innerHTML = html;
      var svg = stage.querySelector('svg'), out = stage.querySelector('.ec-out');
      ui.owl(R.view === 'coaster' ? (R.fric ? 'Friction is on, so watch the 🔥 thermal store fill up.' : 'No friction here: the total energy stays at 100 kJ.') :
        R.view === 'tiles' ? 'Stores are where energy is kept: chemical, kinetic, gravitational, elastic, thermal and more.' :
        R.view === 'match' ? 'Transfers are how energy moves from one store to another.' : 'A Sankey diagram: the width of each arrow shows how much energy.');

      function track() {
        var d = '', sup = '';
        for (var x = 20; x <= 380; x += 4) d += (x === 20 ? 'M' : 'L') + x + ' ' + f(Y(hAt(x)));
        for (var s = 24; s <= 376; s += 16) sup += 'M' + s + ' ' + f(Y(hAt(s)) + 3) + 'V178';
        return '<rect x="0" y="178" width="400" height="12" class="ec-ground"/><path d="' + sup + '" class="ec-sup"/><path d="' + d + '" class="ec-rail"/>' +
          '<path d="M20 ' + Y(20) + 'H380" class="ec-line"/><text x="378" y="' + (Y(20) - 6) + '" text-anchor="end" class="ec-cap">start height 20 m</text>';
      }
      function car(x) {
        var y = Y(hAt(x)), sl = (Y(hAt(x + 1)) - Y(hAt(x - 1))) / 2, a = Math.atan(sl) * 180 / Math.PI;
        return '<g transform="translate(' + f(x) + ' ' + f(y) + ') rotate(' + f(a) + ')"><text x="0" y="-19" text-anchor="middle" class="ec-rider">🙂</text>' +
          '<rect x="-17" y="-20" width="34" height="15" rx="5" class="ec-car"/><circle cx="-9" cy="-4" r="4" class="ec-wheel"/><circle cx="9" cy="-4" r="4" class="ec-wheel"/></g>';
      }
      function meters(E) {
        var s = '';
        E.forEach(function (v, k) {
          var y = 204 + k * 28, hid = k === 1 && !showK;
          s += '<text x="8" y="' + (y + 14) + '" class="ec-ml">' + STORES[k][1] + ' ' + STORES[k][0] + '</text><rect x="146" y="' + y + '" width="190" height="20" rx="6" class="ec-bg"/>' +
            (hid ? '<text x="241" y="' + (y + 15) + '" text-anchor="middle" class="ec-mv">?</text>' : '<rect x="146" y="' + y + '" width="' + (v * 1.9) + '" height="20" rx="6" class="' + STORES[k][2] + '"/>') +
            '<text x="392" y="' + (y + 15) + '" text-anchor="end" class="ec-mv">' + (hid ? '? kJ' : v + ' kJ') + '</text>';
        });
        return s;
      }
      function coaster() {
        var E = (R.fric ? E1 : E0)[pos], moving = busy;
        svg.innerHTML = track() + car(carX) + (moving ? '' : meters(E));
        var hm = pos === 4 && R.fric ? 16 : KEYS[pos][1];
        if (!moving) {
          out.innerHTML = '📍 At ' + NAMES[pos] + ' (' + hm + ' m high)' + (R.fric ? ' · 🔥 friction ON' : '') + ' · Total: <b>100 kJ</b>';
          svg.setAttribute('aria-label', 'Roller coaster. The car is at ' + NAMES[pos] + ', ' + hm + ' metres high. Gravitational store ' + E[0] + ' kJ, kinetic store ' + (showK ? E[1] + ' kJ' : 'unknown') + ', thermal store ' + E[2] + ' kJ.');
        }
      }
      function sankey() {
        var w = waste * 0.8, a = 76, r = 18, cy = a + w + r, xo = 140 + r + w, xi = 140 + r, bot = 248;
        var s = '<rect x="10" y="60" width="130" height="80" class="ec-in"/><text x="16" y="96" class="ec-st">100 J in</text><text x="16" y="116" class="ec-ss">electrical</text>' +
          '<path d="M140 60 H330 V52 L356 68 L330 84 V76 H140 Z" class="ec-use"/><text x="350" y="42" text-anchor="end" class="ec-sl">20 J light (useful)</text>';
        if (waste > 0) s += '<path d="M140 ' + a + ' A' + f(r + w) + ' ' + f(r + w) + ' 0 0 1 ' + f(xo) + ' ' + f(cy) + ' L' + f(xo) + ' ' + bot + ' L' + f(xo + 8) + ' ' + bot + ' L' + f((xo + xi) / 2) + ' ' + (bot + 22) +
          ' L' + f(xi - 8) + ' ' + bot + ' L' + f(xi) + ' ' + bot + ' L' + f(xi) + ' ' + f(cy) + ' A' + r + ' ' + r + ' 0 0 0 140 ' + f(a + w) + ' Z" class="ec-waste"/>';
        s += '<text x="' + f(xo + 14) + '" y="' + (Math.max(cy, 150) + 20) + '" class="ec-sl">' + waste + ' J heating</text><text x="' + f(xo + 14) + '" y="' + (Math.max(cy, 150) + 40) + '" class="ec-sl">(wasted)</text>';
        svg.innerHTML = s;
        out.innerHTML = 'In: <b>100 J</b> · Out: 20 J + ' + waste + ' J = <b>' + (20 + waste) + ' J</b>';
        svg.setAttribute('aria-label', 'Sankey diagram for a filament bulb: 100 joules in, 20 joules out as light, ' + waste + ' joules out as heating.');
      }
      function tiles() {
        var box = stage.querySelector('.ec-tiles'); box.innerHTML = '';
        TILES.forEach(function (t, k) {
          var lock = stage.classList.contains('locked'), b = h('button', 'opt ec-tile' + (k === picked ? (t.st === 'elastic' ? ' right' : ' wrong') : '') + (lock && t.st === 'elastic' ? ' right' : ''),
            '<span class="ec-te" aria-hidden="true">' + t.e + '</span><span>' + t.name + '</span>' + (k === picked || lock ? '<small>' + t.st + ' store</small>' : ''));
          b.type = 'button'; b.disabled = lock;
          b.addEventListener('click', function () {
            picked = k; tiles();
            ui.check(t.st === 'elastic', { hint: R.hint, why: R.why, reveal: function () {} });
            if (stage.classList.contains('locked')) tiles();
          });
          box.appendChild(b);
        });
      }
      function match() {
        var box = stage.querySelector('.ec-match'), lock = stage.classList.contains('locked'); box.innerHTML = '';
        MATCH.forEach(function (m, k) {
          var row = h('div', 'ec-row' + (marks ? (marks[k] ? ' right' : ' wrong') : ''), '<span class="ec-re" aria-hidden="true">' + m.e + '</span><span class="ec-rt">' + m.t + '</span>');
          var b = h('button', 'btn ghost ec-way', WAYS[choice[k]] + (marks ? (marks[k] ? ' ✓' : ' ✗') : '')); b.type = 'button'; b.disabled = lock;
          b.setAttribute('aria-label', m.t + ': ' + WAYS[choice[k]] + '. Tap to change.');
          b.addEventListener('click', function () { choice[k] = choice[k] % 4 + 1; marks = null; match(); box.querySelectorAll('.ec-way')[k].focus(); });
          row.appendChild(b); box.appendChild(row);
        });
      }
      function draw() { if (R.view === 'coaster') coaster(); else if (R.view === 'sankey') sankey(); else if (R.view === 'tiles') tiles(); else match(); }

      function driveTo(p) {
        if (busy || p < 0 || p > 4 || p === pos) return;
        var x0 = carX, x1 = xOf(p, R.fric);
        pos = p;
        if (still || (R.fric && p === 0)) { carX = x1; draw(); return; }
        busy = true; var t0 = null;
        function step(ts) {
          if (t0 === null) t0 = ts;
          var t = Math.min(1, (ts - t0) / 650), e = t < .5 ? 2 * t * t : 1 - 2 * (1 - t) * (1 - t);
          carX = x0 + (x1 - x0) * e;
          if (t >= 1) { busy = false; carX = x1; }
          draw();
          if (busy) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      }
      stage.querySelectorAll('[data-m]').forEach(function (b) {
        b.addEventListener('click', function () { var d = +b.getAttribute('data-m'); driveTo(R.fric && d < 0 ? 0 : pos + d); });
      });
      stage.querySelectorAll('[data-w]').forEach(function (b) {
        b.addEventListener('click', function () { waste = Math.max(0, Math.min(150, waste + +b.getAttribute('data-w'))); draw(); });
      });
      function unlockDrive() { if (stage.classList.contains('locked')) stage.querySelectorAll('[data-m]').forEach(function (x) { x.disabled = false; }); }

      var doneBtn = stage.querySelector('[data-done]');
      if (doneBtn) doneBtn.addEventListener('click', function () {
        if (stage.classList.contains('locked') || busy) return;
        if (R.view === 'coaster') {
          ui.check(R.ok(pos), { hint: R.hint, why: R.why, reveal: function () { pos = R.ok(1) ? 1 : 4; carX = xOf(pos, R.fric); } });
          draw(); unlockDrive();
        } else if (R.view === 'sankey') {
          ui.check(waste === 80, { hint: R.hint, why: R.why, reveal: function () { waste = 80; } });
          draw();
        } else {
          marks = choice.map(function (c, k) { return c === MATCH[k].a; });
          var bad = marks.filter(function (m) { return !m; }).length;
          ui.check(!bad, { hint: bad + ' of 4 are not right yet (marked ✗). Electrically = an electric current. By forces = a push or a pull. By heating = from something hotter to something cooler. By radiation = light or other waves.',
            why: R.why, reveal: function () { choice = MATCH.map(function (m) { return m.a; }); marks = MATCH.map(function () { return true; }); } });
          match();
        }
      });

      if (R.q) {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            if (stage.classList.contains('locked')) { showK = true; draw(); unlockDrive(); }
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
