/* Particle Party: a beaker of water particles with Heat and Cool buttons (-30 °C to 130 °C, steps of 10).
   Below 0 °C: solid (particles in a regular pattern, vibrating in place). 0 °C: melting (solid and liquid together).
   Between 0 and 100 °C: liquid (close together, sliding past each other). 100 °C: boiling (liquid and gas together).
   Above 100 °C: gas (far apart, fast, filling the beaker). Water at normal air pressure.
   Rounds are either "make it ..." tasks on the simulation or questions with options. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ROUNDS = [
    { task: 'Make the water into <b>ice</b> (a solid).', ok: function (t) { return t < 0; },
      hint: 'Ice forms when water gets cold enough. Keep pressing Cool until the particles line up in neat rows.',
      why: 'Water freezes below 0 °C. In a solid the particles are in a regular pattern and can only vibrate in place.' },
    { task: 'Now turn it into <b>steam</b> (a gas).', ok: function (t) { return t > 100; },
      hint: 'Heat it more. Water boils at 100 °C, so you need to go above that.',
      why: 'Above 100 °C water is a gas. The particles are far apart and zoom about in all directions.' },
    { q: 'In which state can the particles only <b>vibrate</b> in fixed places?', opts: ['Solid', 'Liquid', 'Gas'], a: 0,
      hint: 'Cool the water right down and watch: do the particles move around, or do they wobble in one place?',
      why: 'In a solid, particles are held in fixed places. They vibrate (wobble) but don\'t move about.' },
    { q: 'What happens to the particles when you <b>heat</b> them?', opts: ['They get bigger', 'They move faster', 'They disappear'], a: 1,
      hint: 'Press Heat a few times and watch how the particles move. Do they change size?',
      why: 'Heating gives the particles more energy, so they move faster. The particles themselves don\'t get bigger.' },
    { task: 'Find the temperature where water <b>boils</b>. Stop exactly on it.', ok: function (t) { return t === 100; },
      hint: 'Boiling is when the liquid and the gas are both there at once. Look for the label "Boiling".',
      why: 'Water boils at 100 °C. While it boils, some particles escape from the liquid and become a gas.' },
    { q: 'Which state spreads out to <b>fill</b> its whole container?', opts: ['Solid', 'Liquid', 'Gas'], a: 2,
      hint: 'Heat the water above 100 °C. Where do the particles go?',
      why: 'A gas spreads out to fill whatever container it is in, because its particles move freely in all directions.' },
    { task: 'Find the temperature where ice <b>melts</b>. Stop exactly on it.', ok: function (t) { return t === 0; },
      hint: 'Melting is when the solid and the liquid are both there at once. Look for the label "Melting".',
      why: 'Ice melts at 0 °C. That\'s also the temperature where water freezes.' },
    { q: 'Steam cools down and turns back into liquid water. What is this called?', opts: ['Melting', 'Evaporation', 'Condensation', 'Freezing'], a: 2,
      hint: 'It\'s the opposite of boiling or evaporating: a gas turns into a liquid. Think of water drops on a cold window.',
      why: 'When a gas cools and turns into a liquid, it is called condensation.' }
  ];

  var W = 240, H = 240, X0 = 20, X1 = 220, Y0 = 16, Y1 = 224, N = 40, RAD = 6;

  function state(t) { return t < 0 ? 'solid' : t === 0 ? 'melting' : t < 100 ? 'liquid' : t === 100 ? 'boiling' : 'gas'; }
  var LABEL = { solid: 'Solid (ice)', melting: 'Melting', liquid: 'Liquid (water)', boiling: 'Boiling', gas: 'Gas (steam)' };

  function rand(a, b) { return a + Math.random() * (b - a); }

  Arcade.game({
    intro: 'Here\'s a beaker of water, zoomed in so far that you can see its particles! Heat it up or cool it down and watch what they do.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], T = i === 0 ? 20 : i === 1 ? -10 : 20;
      stage.innerHTML = '<p class="q-num">' + (R.task ? 'Challenge ' : 'Question ') + (i + 1) + '</p>' +
        '<p class="q-text">' + (R.task || R.q) + '</p>' +
        '<div class="pp-lab"><canvas width="' + W + '" height="' + H + '" class="pp-canvas" role="img"></canvas>' +
        '<div class="pp-side"><div class="pp-thermo" aria-hidden="true"><span></span></div>' +
        '<p class="pp-temp" aria-live="polite"></p><p class="pp-state"></p></div></div>' +
        '<p class="actions pp-ctrl"><button class="btn pp-cool" type="button">❄️ Cool</button><button class="btn pp-heat" type="button">🔥 Heat</button>' +
        (R.task ? '<button class="btn ghost" type="button" data-done>That\'s it! ✓</button>' : '') + '</p>' +
        (R.q ? '<div class="q-options"></div>' : '');
      var cv = stage.querySelector('canvas'), ctx = cv.getContext('2d');
      var temp = stage.querySelector('.pp-temp'), lab = stage.querySelector('.pp-state'), merc = stage.querySelector('.pp-thermo span');

      ui.owl(R.task ? 'Use <b>Heat</b> and <b>Cool</b> to change the temperature, then press <b>That\'s it!</b>' :
        'You can use the beaker to help you answer. Try heating or cooling it first!');

      // particles: home spot in the ice pattern, current position and speed
      var P = [];
      for (var k = 0; k < N; k++) {
        var c = k % 10, r = Math.floor(k / 10);
        P.push({ hx: 120 - 4.5 * 13 + c * 13 + (r % 2 ? 6.5 : 0) - 3, hy: Y1 - RAD - 1 - r * 12, x: 0, y: 0, vx: 0, vy: 0 });
      }
      P.forEach(function (p) { p.x = rand(X0 + RAD, X1 - RAD); p.y = rand(Y1 - 60, Y1 - RAD); });

      function kind(k, s) {   // what particle k is doing in state s
        if (s === 'melting') return k < N * .6 ? 'solid' : 'liquid';
        if (s === 'boiling') return k < N * .65 ? 'liquid' : 'gas';
        return s;
      }

      function step() {
        var s = state(T), speed = 0.4 + (T + 30) / 40;
        P.forEach(function (p, k) {
          var m = kind(k, s);
          if (m === 'solid') {
            var amp = 0.6 + (T + 30) / 25;
            p.x += (p.hx + rand(-amp, amp) - p.x) * .3; p.y += (p.hy + rand(-amp, amp) - p.y) * .3;
            return;
          }
          p.vx += rand(-.5, .5) * speed * .5; p.vy += rand(-.5, .5) * speed * .5;
          var vmax = m === 'gas' ? speed * 2.2 : speed * .9, v = Math.hypot(p.vx, p.vy);
          if (v > vmax) { p.vx *= vmax / v; p.vy *= vmax / v; }
          if (m === 'gas' && v < vmax * .6) { p.vx *= 1.15; p.vy *= 1.15; }
          if (m === 'liquid') p.vy += .12;   // liquid settles at the bottom
          p.x += p.vx; p.y += p.vy;
          var top = m === 'liquid' ? Y1 - (s === 'melting' ? 66 : 56) : Y0 + RAD;
          if (p.x < X0 + RAD) { p.x = X0 + RAD; p.vx = Math.abs(p.vx); }
          if (p.x > X1 - RAD) { p.x = X1 - RAD; p.vx = -Math.abs(p.vx); }
          if (p.y > Y1 - RAD) { p.y = Y1 - RAD; p.vy = -Math.abs(p.vy) * (m === 'liquid' ? .3 : 1); }
          if (p.y < top) { if (m === 'liquid') { p.y += (top - p.y) * .2; p.vy = Math.abs(p.vy) * .5; } else { p.y = top; p.vy = Math.abs(p.vy); } }
        });
        if (s !== 'gas' && s !== 'solid') {   // keep liquid particles from piling on top of each other
          for (var a = 0; a < N; a++) for (var b = a + 1; b < N; b++) {
            var A = P[a], B = P[b], dx = B.x - A.x, dy = B.y - A.y, d = Math.hypot(dx, dy) || .01, need = RAD * 2;
            if (d < need) { var push = (need - d) / 2, ux = dx / d, uy = dy / d; A.x -= ux * push; A.y -= uy * push; B.x += ux * push; B.y += uy * push; }
          }
        }
      }

      function draw() {
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = '#8A94A6'; ctx.lineWidth = 4; ctx.lineJoin = 'round';
        ctx.beginPath(); ctx.moveTo(X0 - 4, Y0 - 8); ctx.lineTo(X0 - 4, Y1 + 4); ctx.lineTo(X1 + 4, Y1 + 4); ctx.lineTo(X1 + 4, Y0 - 8); ctx.stroke();
        var s = state(T);
        P.forEach(function (p, k) {
          var m = kind(k, s);
          ctx.beginPath(); ctx.arc(p.x, p.y, RAD, 0, Math.PI * 2);
          ctx.fillStyle = m === 'solid' ? '#7FB8E8' : m === 'liquid' ? '#2F80ED' : '#9B7BF7'; ctx.fill();
          ctx.lineWidth = 1.5; ctx.strokeStyle = 'rgba(0,0,0,.25)'; ctx.stroke();
        });
      }

      function show() {
        var s = state(T);
        temp.textContent = T + ' °C';
        lab.textContent = LABEL[s];
        lab.className = 'pp-state ' + s;
        merc.style.height = Math.max(4, Math.min(100, (T + 30) / 160 * 100)) + '%';
        cv.setAttribute('aria-label', 'Beaker of water at ' + T + ' °C: ' + LABEL[s] + '.');
        stage.querySelector('.pp-cool').disabled = T <= -30;
        stage.querySelector('.pp-heat').disabled = T >= 130;
        if (still) { for (var n = 0; n < 200; n++) step(); draw(); }
      }

      stage.querySelector('.pp-heat').addEventListener('click', function () { T = Math.min(130, T + 10); show(); });
      stage.querySelector('.pp-cool').addEventListener('click', function () { T = Math.max(-30, T - 10); show(); });

      if (R.task) {
        stage.querySelector('[data-done]').addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          ui.check(R.ok(T), { hint: R.hint, why: R.why, reveal: function () {
            T = i === 0 ? -20 : i === 1 ? 120 : i === 4 ? 100 : 0; show();
          } });
          if (stage.classList.contains('locked')) stage.querySelectorAll('.pp-ctrl button').forEach(function (b) { b.disabled = false; });
          stage.querySelector('[data-done]').disabled = stage.classList.contains('locked');
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            var right = k === R.a;
            b.classList.add(right ? 'right' : 'wrong'); if (!right) b.disabled = true;
            ui.check(right, { hint: R.hint, why: R.why, reveal: function () { box.children[R.a].classList.add('right'); } });
            if (stage.classList.contains('locked')) stage.querySelectorAll('.pp-ctrl button').forEach(function (x) { x.disabled = false; });
          });
          box.appendChild(b);
        });
      }

      show();
      if (!still) {
        (function loop() {
          if (!document.body.contains(cv)) return;   // the round has moved on
          step(); draw(); requestAnimationFrame(loop);
        })();
      }
    }
  });
})();
