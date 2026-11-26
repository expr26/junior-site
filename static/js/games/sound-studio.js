/* Sound Studio: vibrations, amplitude, frequency, echoes and hearing.
   Model: the oscilloscope screen shows 1/100 of a second, so n complete waves on the screen means a frequency of n × 100 Hz
   (n = 1 to 8, so 100 Hz to 800 Hz). Loudness levels 1 to 4 set the amplitude (height of the wave from the middle line).
   Bigger amplitude = louder; higher frequency (more waves each second) = higher pitch. The two are independent.
   Answers checked by hand: match round: loudness 3, 400 Hz. Louder round: loudness 4, still 300 Hz. Quiet + high: loudness 1, 800 Hz.
   Pitch round: B (6 waves) is higher than A (2 tall waves). Space: no sound, a vacuum has no particles to pass on vibrations.
   Echo: speed of sound in air about 340 m/s; the echo takes 2 s there and back, so the sound travels about 340 × 2 = 680 m,
   and the cliff is 680 ÷ 2 = 340 m away. Hearing: humans hear about 20 Hz to 20 000 Hz, so 30 000 Hz (ultrasound) is too high.
   Guitar string: 300 vibrations each second = 300 Hz = 3 waves on the screen.
   Play button: Web Audio sine tone at a low volume, about 0.6 s, only after a tap. No network, so no CSP change. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var LOUD = ['very quiet', 'quiet', 'loud', 'very loud'];
  var ROUNDS = [
    { scope: true, a: 1, n: 2, goal: { a: 3, n: 4 }, text: 'Match the mystery sound! Change the loudness and pitch until your wave sits on the dashed wave, then press <b>Check</b>.',
      why: 'You matched it: the same amplitude (loudness) and the same frequency (pitch, 400 Hz) make the same sound.' },
    { scope: true, a: 2, n: 3, ok: function (s) { return s.a === 4 && s.n === 3; }, text: 'Make this note as <b>loud</b> as the studio allows, but keep the <b>same pitch</b>. Then press <b>Check</b>.',
      hint: function (s) { return s.n !== 3 ? 'You changed the pitch. Put it back to 300 Hz. Loudness is about how <b>tall</b> the waves are, not how many there are.' : 'Make the waves as tall as they can go: a bigger amplitude means a louder sound.'; },
      why: 'A bigger amplitude (taller waves) means a louder sound. The number of waves stayed the same, so the pitch did not change.' },
    { two: true, q: 'Which sound has the <b>higher pitch</b>?', opts: ['Sound A: its waves are taller', 'Sound B: more waves fit on the screen', 'They have the same pitch'], ans: 1,
      hint: 'Pitch depends on the frequency: how many waves fit on the screen. How tall they are shows the loudness.', why: 'Sound B has more waves in the same time, so it has a higher frequency and a higher pitch. Sound A is louder, but lower.' },
    { scope: true, a: 3, n: 3, ok: function (s) { return s.a === 1 && s.n === 8; }, text: 'Make a <b>very quiet</b> sound with the <b>highest pitch</b> the studio can make, like a tiny whistle. Then press <b>Check</b>.',
      hint: function (s) { return s.a !== 1 ? 'Quiet means small waves: make the amplitude as small as it goes.' : 'High pitch means a high frequency: squeeze in as many waves as you can.'; },
      why: 'Small amplitude = quiet. High frequency (800 Hz here, lots of waves) = high pitch.' },
    { space: true, q: 'An astronaut rings a bell outside the space station, in empty space. What does the astronaut next to her hear?', opts: ['Nothing: sound needs particles to travel through', 'A very loud ring', 'A quiet ring'], ans: 0,
      hint: 'Sound is passed on by particles bumping into each other. Are there any particles in empty space?', why: 'Space is a vacuum: it has no particles, so sound cannot travel through it. Sound needs a medium, like air, water or a solid.' },
    { echo: true, d: 100, text: 'You shout at a cliff and hear the <b>echo 2 seconds</b> later. Sound travels at about <b>340 m/s</b> in air. Set the distance to the cliff, then press <b>Check</b>.' },
    { hear: true, q: 'A dog whistle makes a sound of about 30 000 Hz. Dogs can hear it. Why can\'t you?', opts: ['It is above about 20 000 Hz, the top of the human hearing range', 'It is too quiet for anyone to hear', 'Sound cannot travel through air'], ans: 0,
      hint: 'Look at the hearing bar. Where is 30 000 Hz compared with what humans can hear?', why: 'Humans hear from about 20 Hz to about 20 000 Hz. Higher sounds are called ultrasound. Dogs can hear higher than we can.' },
    { scope: true, a: 2, n: 6, ok: function (s) { return s.n === 3; }, text: 'A guitar string vibrates <b>300 times every second</b>. Set the studio to the same frequency, then press <b>Check</b>.',
      hint: function (s) { return 'Frequency is the number of vibrations each second, measured in hertz (Hz). 1 Hz means 1 vibration each second. You are on ' + s.n * 100 + ' Hz.'; },
      why: '300 vibrations each second is a frequency of 300 Hz. Every sound is made by something vibrating.' }
  ];

  function f(v) { return (+v).toFixed(1); }
  function wave(a, n, cy, x0, w) {
    var d = '';
    for (var k = 0; k <= 200; k++) { var x = k / 200; d += (k ? 'L' : 'M') + f(x0 + x * w) + ' ' + f(cy - a * Math.sin(2 * Math.PI * n * x)); }
    return d;
  }
  function grid(y0, y1, step) {
    var s = '';
    for (var x = 0; x <= 400; x += 50) s += '<line x1="' + x + '" y1="' + y0 + '" x2="' + x + '" y2="' + y1 + '" class="ss-grid"/>';
    for (var y = y0; y <= y1; y += step) s += '<line x1="0" y1="' + y + '" x2="400" y2="' + y + '" class="ss-grid"/>';
    return s + '<line x1="0" y1="' + (y0 + y1) / 2 + '" x2="400" y2="' + (y0 + y1) / 2 + '" class="ss-mid"/>';
  }

  var ctx = null;
  function beep(a, hz) {
    try {
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
      ctx = ctx || new AC(); if (ctx.state === 'suspended') ctx.resume();
      var o = ctx.createOscillator(), g = ctx.createGain(), t = ctx.currentTime, v = [0.02, 0.04, 0.07, 0.1][a - 1];
      o.type = 'sine'; o.frequency.value = hz;
      g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(v, t + 0.05); g.gain.setValueAtTime(v, t + 0.45); g.gain.linearRampToValueAtTime(0, t + 0.6);
      o.connect(g); g.connect(ctx.destination); o.start(t); o.stop(t + 0.65);
    } catch (e) { /* no sound is fine */ }
  }

  Arcade.game({
    intro: 'Welcome to the Sound Studio! Shape sound waves on the screen, make sounds louder and higher, and find out where sound can\'t go.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], st = { a: R.a || 1, n: R.n || 1 }, d = R.d || 0;
      var ctrl = '';
      if (R.scope) ctrl = '<div class="ss-row"><button class="btn ghost" type="button" data-a="-1">Quieter</button><b class="ss-val ss-av"></b><button class="btn ghost" type="button" data-a="1">Louder</button></div>' +
        '<div class="ss-row"><button class="btn ghost" type="button" data-n="-1">Lower</button><b class="ss-val ss-nv"></b><button class="btn ghost" type="button" data-n="1">Higher</button></div>' +
        '<p class="actions ss-act"><button class="btn ghost ss-play" type="button" data-play>▶ Play</button><button class="btn" type="button" data-go>Check ✓</button></p>';
      else if (R.echo) ctrl = '<div class="ss-echo"><button class="btn ghost" type="button" data-d="-100">−100</button><button class="btn ghost" type="button" data-d="-10">−10</button>' +
        '<b class="ss-val ss-dv"></b><button class="btn ghost" type="button" data-d="10">+10</button><button class="btn ghost" type="button" data-d="100">+100</button></div>' +
        '<p class="actions ss-act"><button class="btn" type="button" data-go>Check ✓</button></p>';
      else if (R.two) ctrl = '<p class="actions ss-act"><button class="btn ghost ss-play" type="button" data-pa>▶ Play A</button><button class="btn ghost ss-play" type="button" data-pb>▶ Play B</button></p>';
      stage.innerHTML = '<p class="q-num">Studio track ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="ss-svg" viewBox="0 0 400 ' + (R.two ? 290 : 200) + '" role="img"></svg><p class="ss-out" aria-live="polite"></p>' + ctrl + (R.q ? '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.ss-out');
      ui.owl(R.scope ? 'Tall waves = loud. Lots of waves squeezed together = high pitch. Tap ▶ Play to hear it (quietly).' :
        R.two ? 'Two sounds on two screens. Compare them carefully.' : R.space ? 'Sound is made by vibrations passed on from particle to particle.' :
        R.echo ? 'An echo is sound bouncing back off a hard surface.' : 'Hertz (Hz) means vibrations each second.');

      function draw() {
        var lk = stage.classList.contains('locked'), s = '';
        if (R.scope) {
          s = grid(0, 200, 25);
          if (R.goal) s += '<path d="' + wave(R.goal.a * 20, R.goal.n, 100, 0, 400) + '" class="ss-goal"/>';
          s += '<path d="' + wave(st.a * 20, st.n, 100, 0, 400) + '" class="ss-wave"/><text x="8" y="192" class="ss-cap">screen = 1/100 of a second</text>';
          svg.setAttribute('aria-label', 'Oscilloscope screen showing ' + st.n + ' waves, amplitude level ' + st.a + ' of 4.' + (R.goal ? ' A dashed target wave shows ' + R.goal.n + ' waves at level ' + R.goal.a + '.' : ''));
          stage.querySelector('.ss-av').innerHTML = '🔊 <span class="ss-bars" aria-hidden="true">' + [1, 2, 3, 4].map(function (k) { return '<i class="' + (k <= st.a ? 'on' : '') + '" style="height:' + (6 + k * 5) + 'px"></i>'; }).join('') + '</span>';
          stage.querySelector('.ss-nv').textContent = '🎵 ' + st.n * 100 + ' Hz';
          out.innerHTML = 'Loudness: <b>' + LOUD[st.a - 1] + '</b> · pitch: <b>' + st.n * 100 + ' Hz</b>';
        } else if (R.two) {
          s = '<rect x="0" y="0" width="400" height="130" class="ss-panel"/><rect x="0" y="160" width="400" height="130" class="ss-panel"/>' + grid(0, 130, 32.5) + grid(160, 290, 32.5);
          s += '<path d="' + wave(55, 2, 65, 0, 400) + '" class="ss-wave"/><path d="' + wave(15, 6, 225, 0, 400) + '" class="ss-wave b"/>';
          s += '<text x="10" y="24" class="ss-tag">A</text><text x="10" y="184" class="ss-tag">B</text>';
          if (lk) s += '<text x="390" y="122" text-anchor="end" class="ss-cap">200 Hz, loud</text><text x="390" y="282" text-anchor="end" class="ss-cap">600 Hz, quiet</text>';
          svg.setAttribute('aria-label', 'Two oscilloscope screens. A shows 2 tall waves. B shows 6 short waves in the same time.');
        } else if (R.space) {
          s = '<rect width="400" height="200" class="ss-space"/>';
          [[30, 30], [90, 160], [150, 20], [250, 170], [330, 40], [380, 120], [60, 100], [210, 60]].forEach(function (p) { s += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="1.8" class="ss-star"/>'; });
          s += '<text x="90" y="120" text-anchor="middle" class="ss-big">🧑‍🚀</text><text x="145" y="100" text-anchor="middle" class="ss-mid-e">🔔</text><text x="310" y="120" text-anchor="middle" class="ss-big">🧑‍🚀</text>';
          s += '<path d="M180 70 q12 20 0 40 M200 60 q16 30 0 60 M220 50 q20 40 0 80" class="ss-ring' + (lk ? ' off' : '') + '"/>';
          if (lk) s += '<path d="M176 50 L236 140 M236 50 L176 140" class="ss-x"/>';
          s += '<text x="200" y="185" text-anchor="middle" class="ss-cap">' + (lk ? 'vacuum: no particles, so no sound 🔇' : 'empty space') + '</text>';
          svg.setAttribute('aria-label', 'Two astronauts in empty space. One rings a bell.');
        } else if (R.echo) {
          var px = 50, cx = 330;
          s = '<rect width="400" height="200" class="ss-sky"/><rect x="0" y="160" width="400" height="40" class="ss-ground"/>' +
            '<polygon points="330,160 340,40 372,20 400,24 400,160" class="ss-cliff"/>' +
            '<text x="' + px + '" y="158" text-anchor="middle" class="ss-big">🧍</text>' +
            '<path d="M80 92 q8 12 0 24 M92 86 q12 18 0 36" class="ss-ring"/>' +
            '<path d="M84 70 H322" class="ss-go" marker-end="url(#ss-ah)"/><path d="M322 84 H84" class="ss-back" marker-end="url(#ss-ah2)"/>' +
            '<defs><marker id="ss-ah" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" class="ss-ahd"/></marker>' +
            '<marker id="ss-ah2" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0 L10 5 L0 10 Z" class="ss-ahd2"/></marker></defs>' +
            '<text x="200" y="62" text-anchor="middle" class="ss-cap2">shout ➜</text><text x="112" y="104" class="ss-cap2">⬅ echo: 2 s there and back</text>' +
            '<path d="M' + px + ' 176 H' + cx + '" class="ss-dist"/><path d="M' + px + ' 168 V184 M' + cx + ' 168 V184" class="ss-dist"/>' +
            '<text x="190" y="194" text-anchor="middle" class="ss-dl">' + d + ' m</text>';
          svg.setAttribute('aria-label', 'A person shouts at a cliff. The echo comes back after 2 seconds. Your distance: ' + d + ' metres.');
          stage.querySelector('.ss-dv').textContent = d + ' m';
          out.innerHTML = lk ? 'In 2 s the sound goes about <b>680 m</b>: 340 m there and 340 m back.' : 'Distance to the cliff: <b>' + d + ' m</b>';
        } else if (R.hear) {
          s = '<rect width="400" height="200" class="ss-sky"/>' +
            '<rect x="20" y="90" width="40" height="24" rx="4" class="ss-infra"/><rect x="60" y="90" width="240" height="24" class="ss-human"/><rect x="300" y="90" width="85" height="24" rx="4" class="ss-ultra"/>' +
            '<text x="180" y="107" text-anchor="middle" class="ss-bt">👂 humans hear this</text>' +
            '<path d="M60 84 V122 M300 84 V122" class="ss-tick"/><text x="60" y="142" text-anchor="middle" class="ss-cap2">20 Hz</text><text x="300" y="142" text-anchor="middle" class="ss-cap2">20 000 Hz</text>' +
            '<text x="40" y="168" text-anchor="middle" class="ss-cap2">lower</text><text x="342" y="168" text-anchor="middle" class="ss-cap2">ultrasound</text>' +
            '<path d="M350 50 V86" class="ss-pin"/><text x="350" y="44" text-anchor="middle" class="ss-cap2">🐕 30 000 Hz</text>' +
            '<text x="200" y="192" text-anchor="middle" class="ss-cap ss-ns">(not to scale)</text>';
          svg.setAttribute('aria-label', 'A hearing range bar. Humans hear from about 20 hertz to about 20 000 hertz. A dog whistle at 30 000 hertz is above that range.');
        }
        svg.innerHTML = s;
      }

      function relock() { if (stage.classList.contains('locked')) stage.querySelectorAll('.ss-play').forEach(function (x) { x.disabled = false; }); }

      if (R.scope) {
        stage.querySelectorAll('[data-a]').forEach(function (b) { b.addEventListener('click', function () { if (stage.classList.contains('locked')) return; st.a = Math.max(1, Math.min(4, st.a + +b.getAttribute('data-a'))); draw(); }); });
        stage.querySelectorAll('[data-n]').forEach(function (b) { b.addEventListener('click', function () { if (stage.classList.contains('locked')) return; st.n = Math.max(1, Math.min(8, st.n + +b.getAttribute('data-n'))); draw(); }); });
        stage.querySelector('[data-play]').addEventListener('click', function () { beep(st.a, st.n * 100); });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          var ok, hint;
          if (R.goal) {
            ok = st.a === R.goal.a && st.n === R.goal.n;
            var bits = [];
            if (st.a !== R.goal.a) bits.push('Your waves are too ' + (st.a < R.goal.a ? 'short' : 'tall') + ': change the <b>loudness</b> (amplitude).');
            if (st.n !== R.goal.n) bits.push('You have too ' + (st.n < R.goal.n ? 'few' : 'many') + ' waves: change the <b>pitch</b> (frequency).');
            hint = bits.join(' ');
          } else { ok = R.ok(st); hint = R.hint(st); }
          ui.check(ok, { hint: hint, why: R.why, reveal: function () { if (R.goal) { st.a = R.goal.a; st.n = R.goal.n; } else if (i === 1) { st.a = 4; st.n = 3; } else if (i === 3) { st.a = 1; st.n = 8; } else st.n = 3; draw(); } });
          relock();
        });
      } else if (R.echo) {
        stage.querySelectorAll('[data-d]').forEach(function (b) { b.addEventListener('click', function () { if (stage.classList.contains('locked')) return; d = Math.max(0, Math.min(1000, d + +b.getAttribute('data-d'))); draw(); }); });
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          ui.check(d === 340, { hint: d === 680 ? '680 m is how far the sound travels in 2 s, but it goes to the cliff <b>and back</b>. Halve it!' :
            'Distance = speed × time. In 2 s sound travels about 340 × 2 = 680 m. But the echo goes there <b>and back</b>, so the cliff is half of that.',
            why: 'The sound travels about 340 × 2 = 680 m in 2 s. That is there and back, so the cliff is about 680 ÷ 2 = 340 m away.', reveal: function () { d = 340; } });
          draw();
        });
      } else {
        if (R.two) {
          stage.querySelector('[data-pa]').addEventListener('click', function () { beep(4, 200); });
          stage.querySelector('[data-pb]').addEventListener('click', function () { beep(1, 600); });
        }
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            relock(); draw();
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
