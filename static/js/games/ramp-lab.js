/* Ramp Lab: a block on a 1 m ramp. The child sets the slope (10° to 40°) and the surface (ice, wood, carpet), then lets go.
   Simple model, same surface on the ramp and the floor, g = 9.8 m/s², friction coefficient mu:
     the block slides only if tan(angle) > mu;
     on the ramp a = g (sin θ − mu cos θ);  on the floor it slows at mu g, so the floor distance is d = L (sin θ − mu cos θ) / mu.
   The friction values are typical classroom figures, not measurements. Check the tasks with these formulas when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var SURF = { ice: { mu: .05, name: 'Ice', fill: '#CFEFFF', edge: '#7CC6F0' },
               wood: { mu: .3, name: 'Wood', fill: '#D9A066', edge: '#9C6430' },
               carpet: { mu: .6, name: 'Carpet', fill: '#E0607E', edge: '#A3324F' } };
  var G = 9.8, L = 1, PX = 140, BX = 200, BY = 220;   // 1 m = 140 px; bottom of the ramp at (BX, BY)

  function model(deg, s) {
    var t = deg * Math.PI / 180, mu = SURF[s].mu, a = G * (Math.sin(t) - mu * Math.cos(t));
    if (Math.tan(t) <= mu) return { moves: false, a: 0, d: 0, v: 0 };
    var v = Math.sqrt(2 * a * L);
    return { moves: true, a: a, v: v, d: L * (Math.sin(t) - mu * Math.cos(t)) / mu };
  }

  var ROUNDS = [
    { task: 'The block is stuck! Change something to make it <b>slide</b>, then press <b>Done</b>.', start: [10, 'wood'], ok: function (r) { return r.moves; },
      hint: 'Make the ramp steeper, or pick a slippier surface. Let go to test it first!', why: 'A steeper slope pulls the block down harder. When that pull beats friction, the block slides.' },
    { task: 'Make the block slide <b>more than 3 m</b> along the floor.', start: [20, 'wood'], ok: function (r) { return r.d > 3; },
      hint: 'Which surface has the least friction? Try that one, and make the ramp steeper.', why: 'Ice has very little friction, so the block keeps going for a long way.' },
    { q: 'Which surface has the <b>most</b> friction?', opts: ['Ice', 'Wood', 'Carpet'], ans: 2, start: [40, 'carpet'],
      hint: 'Try each surface at the same angle. Which one makes the block stop soonest?', why: 'Carpet is rough, so it has the most friction. The block stops quickly on it.' },
    { task: 'On <b>carpet</b>, find the <b>smallest</b> angle where the block starts to slide.', start: [10, 'carpet'], lock: 'carpet', ok: function (r, d) { return d === 35; },
      hint: 'Go up 5° at a time and let go each time. Stop at the first angle where it moves.', why: 'On carpet the block first slides at 35°. Below that, friction is strong enough to hold it still.' },
    { q: 'You make the ramp <b>steeper</b>. At the bottom, the block is…', opts: ['Faster', 'Slower', 'The same speed'], ans: 0, start: [20, 'ice'],
      hint: 'Let go at 15°, then at 40°. Watch how far it goes along the floor.', why: 'A steeper ramp gives a bigger pull down the slope, so the block speeds up more and is faster at the bottom.' },
    { q: 'Which way does <b>friction</b> push on the sliding block?', opts: ['The same way it moves', 'The opposite way to how it moves', 'Straight up'], ans: 1, start: [30, 'wood'],
      hint: 'Let go and watch the red friction arrow.', why: 'Friction always acts against the motion, so it slows the block down.' },
    { task: 'Land the block in the <b>target zone</b>: between 0.5 m and 1.5 m along the floor.', start: [15, 'ice'], target: [.5, 1.5], ok: function (r) { return r.d >= .5 && r.d <= 1.5; },
      hint: 'Ice sends it too far and carpet stops it too soon. Try wood at different angles.', why: 'Wood at 25° to 40° lands the block in the zone: enough friction to stop it, but not too much.' },
    { q: 'Why is it hard to walk on ice?', opts: ['Ice has very little friction', 'Ice has a lot of friction', 'Ice pulls you down'], ans: 0, start: [25, 'ice'],
      hint: 'Compare how far the block slides on ice and on carpet.', why: 'Ice has very little friction, so your shoes can\'t grip and slide instead.' }
  ];

  Arcade.game({
    intro: 'Welcome to Ramp Lab! Change the slope and the surface, then let the block go. Watch how <b>friction</b> changes things.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], deg = R.start[0], surf = R.start[1], runs = 0, busy = false;
      stage.innerHTML = '<p class="q-num">Experiment ' + (i + 1) + '</p>' +
        '<p class="q-text">' + (R.task || R.q) + '</p>' +
        '<svg class="rl-svg" viewBox="40 78 600 187" role="img"></svg>' +
        '<p class="rl-out" aria-live="polite">Press <b>Let go</b> to test.</p>' +
        '<div class="rl-ctrl">' +
          '<div class="rl-row"><span>Slope</span><button class="btn ghost rl-s" type="button" data-a="-5" aria-label="Less steep">−</button><b class="rl-deg"></b><button class="btn ghost rl-s" type="button" data-a="5" aria-label="Steeper">+</button></div>' +
          '<div class="rl-row rl-surf" role="group" aria-label="Surface">' + Object.keys(SURF).map(function (k) {
            return '<button class="opt rl-sf" type="button" data-s="' + k + '"' + (R.lock && R.lock !== k ? ' disabled' : '') + '>' + SURF[k].name + '</button>'; }).join('') + '</div>' +
        '</div>' +
        '<p class="actions rl-act"><button class="btn" type="button" data-go>Let go! ▶</button>' + (R.task ? '<button class="btn ghost" type="button" data-done>Done ✓</button>' : '') + '</p>' +
        (R.opts ? '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.rl-out');

      ui.owl(R.task ? 'Change the slope and surface, press <b>Let go</b> to test, and press <b>Done</b> when you\'ve got it.' :
        'Do some experiments first, then answer.');

      function geom() {
        var t = deg * Math.PI / 180;
        return { t: t, tx: BX - PX * L * Math.cos(t), ty: BY - PX * L * Math.sin(t) };
      }
      function blockAt(s, onRamp) {   // s = distance in metres from the top of the ramp, or along the floor
        var g = geom();
        if (onRamp) return { x: g.tx + s * PX * Math.cos(g.t), y: g.ty + s * PX * Math.sin(g.t), r: deg };
        return { x: BX + s * PX, y: BY, r: 0 };
      }
      function draw(b, arrow) {
        var g = geom(), S = SURF[surf], s = '';
        if (R.target) s += '<rect x="' + (BX + R.target[0] * PX) + '" y="' + (BY - 2) + '" width="' + ((R.target[1] - R.target[0]) * PX) + '" height="10" class="rl-target"/>' +
          '<text x="' + (BX + (R.target[0] + R.target[1]) / 2 * PX) + '" y="' + (BY + 40) + '" text-anchor="middle" class="rl-tt">target</text>';
        s += '<rect x="' + BX + '" y="' + BY + '" width="440" height="12" fill="' + S.fill + '" stroke="' + S.edge + '" stroke-width="2"/>';
        s += '<path d="M' + g.tx + ' ' + g.ty + ' L' + BX + ' ' + BY + ' L' + g.tx + ' ' + BY + ' Z" class="rl-wedge"/>';
        s += '<line x1="' + g.tx + '" y1="' + g.ty + '" x2="' + BX + '" y2="' + BY + '" stroke="' + S.edge + '" stroke-width="8" stroke-linecap="round"/>';
        for (var m = 0; m <= 3; m += .5) s += '<line x1="' + (BX + m * PX) + '" y1="' + (BY + 12) + '" x2="' + (BX + m * PX) + '" y2="' + (BY + 20) + '" class="rl-tick"/>' +
          (m % 1 === 0 ? '<text x="' + (BX + m * PX) + '" y="' + (BY + 40) + '" text-anchor="middle" class="rl-tl">' + m + ' m</text>' : '');
        s += '<path d="M' + (BX - 42) + ' ' + BY + ' A42 42 0 0 0 ' + (BX - 42 * Math.cos(g.t)) + ' ' + (BY - 42 * Math.sin(g.t)) + '" class="rl-arc"/>' +
          '<text x="' + (BX - 56) + '" y="' + (BY - 8) + '" text-anchor="end" class="rl-dl">' + deg + '°</text>';
        b = b || blockAt(0, true);
        s += '<g transform="translate(' + b.x + ' ' + b.y + ') rotate(' + b.r + ')"><rect x="-14" y="-34" width="30" height="30" rx="5" class="rl-block"/>';
        if (arrow) s += '<path d="M-18 -19 h-34 m10 -8 l-10 8 10 8" class="rl-fr"/><text x="-40" y="-30" text-anchor="middle" class="rl-frt">friction</text>';
        s += '</g>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Ramp at ' + deg + ' degrees, surface ' + S.name + '.');
        stage.querySelector('.rl-deg').textContent = deg + '°';
        stage.querySelectorAll('.rl-sf').forEach(function (x) { x.classList.toggle('picked', x.getAttribute('data-s') === surf); });
      }

      function run() {
        if (busy) return;
        var r = model(deg, surf); runs++;
        if (!r.moves) {
          draw(); out.innerHTML = '😮 The block <b>didn\'t move</b>. Friction is holding it still.';
          return;
        }
        var tR = Math.sqrt(2 * L / r.a), dec = SURF[surf].mu * G, tF = r.v / dec, speed = Math.max(1, (tR + tF) / 3.5);
        var shown = Math.min(r.d, 3.1);
        if (still) { draw(blockAt(shown, false)); report(r); return; }
        busy = true; setDisabled(true);
        var t0 = performance.now();
        (function f(now) {
          var t = (now - t0) / 1000 * speed, b;
          if (t < tR) b = blockAt(.5 * r.a * t * t, true);
          else { var u = Math.min(t - tR, tF), x = r.v * u - .5 * dec * u * u; b = blockAt(Math.min(x, 3.1), false); }
          draw(b, true);
          if (t < tR + tF && !(t > tR && b.x >= BX + 3.1 * PX)) requestAnimationFrame(f);
          else { busy = false; setDisabled(false); draw(blockAt(shown, false)); report(r); }
        })(t0);
      }
      function report(r) {
        out.innerHTML = r.d > 3.1 ? '🚀 Whoosh! It slid <b>' + r.d.toFixed(1) + ' m</b> along the floor (off the edge of the picture).' :
          '✅ It slid <b>' + r.d.toFixed(1) + ' m</b> along the floor.';
      }
      function setDisabled(on) { stage.querySelectorAll('.rl-ctrl button, [data-go], [data-done]').forEach(function (b) { b.disabled = on || (b.classList.contains('rl-sf') && R.lock && R.lock !== b.getAttribute('data-s')) ||
        (b.hasAttribute('data-done') && stage.classList.contains('locked')); }); }

      stage.querySelectorAll('.rl-s').forEach(function (b) { b.addEventListener('click', function () {
        if (busy) return; deg = Math.max(10, Math.min(40, deg + +b.getAttribute('data-a'))); draw(); out.innerHTML = 'Press <b>Let go</b> to test.'; }); });
      stage.querySelectorAll('.rl-sf').forEach(function (b) { b.addEventListener('click', function () {
        if (busy) return; surf = b.getAttribute('data-s'); draw(); out.innerHTML = 'Press <b>Let go</b> to test.'; }); });
      stage.querySelector('[data-go]').addEventListener('click', run);

      function after() { if (stage.classList.contains('locked')) { setDisabled(false); var d = stage.querySelector('[data-done]'); if (d) d.disabled = true; } }
      if (R.task) {
        stage.querySelector('[data-done]').addEventListener('click', function () {
          if (busy || stage.classList.contains('locked')) return;
          if (!runs) { ui.owl('Press <b>Let go</b> to test your idea first!'); return; }
          ui.check(R.ok(model(deg, surf), deg), { hint: R.hint, why: R.why });
          after();
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            after();
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
