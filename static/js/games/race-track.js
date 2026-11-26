/* Race Track: speed, distance and distance–time graphs.
   Model: every racer moves at a steady speed along each straight part of its journey (pts = [time, distance] corners),
   so speed = distance ÷ time on each part, and average speed = total distance ÷ total time (stops count in the time).
   On a distance–time graph a steeper line means faster, a flat line means stopped, and a line going down means coming back.
   "Time" here is simulated: the animation only shows the motion, it never times the child.
   Answers checked by hand: R1 40 m ÷ 5 s = 8 m/s. R2 dog 40 ÷ 4 = 10, fox 72 ÷ 9 = 8, cat 18 ÷ 3 = 6 m/s, so the dog.
   R3 red 50 ÷ 10 = 5, blue 20 ÷ 10 = 2, green flat (0) m/s. R4 flat from 4 s to 8 s = stopped. R5 up, flat, up.
   R6 (60 + 60) m ÷ (10 + 10 + 10) s = 4 m/s (6 m/s if you forget the stop). R7 240 km ÷ 2 h = 120 km/h.
   R8 1 km = 1000 m, 1000 m ÷ 100 s = 10 m/s (= 36 km/h). */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COL = ['#E5484D', '#3B82F6', '#1F9D55'];

  function line(v, T) { return [[0, 0], [T, v * T]]; }
  var ROUNDS = [
    { mode: 'race', T: 5, D: 80, finish: 40, tStep: 1, dStep: 20, val: 4, min: 1, max: 15, steps: [-1, 1], ans: 8,
      racers: [{ e: '🐇', n: 'rabbit', pts: function (v) { return line(v, 5); } }],
      text: 'The race lasts <b>5 s</b>. Set the rabbit\'s speed so it reaches the <b>40 m</b> finish line exactly as the race ends. Then press <b>Race!</b>',
      hint: 'Speed = distance ÷ time. How many metres does the rabbit need to run each second? Work out 40 ÷ 5.',
      why: 'Speed = 40 m ÷ 5 s = 8 m/s: the rabbit runs 8 metres every second.' },
    { mode: 'pick', graph: 'after', T: 9, D: 80, tStep: 1, dStep: 20,
      racers: [{ e: '🐕', n: 'dog', pts: [[0, 0], [4, 40]] }, { e: '🦊', n: 'fox', pts: [[0, 0], [9, 72]] }, { e: '🐈', n: 'cat', pts: [[0, 0], [3, 18]] }],
      q: 'Three animals each do a practice run. Which animal is the <b>fastest</b>?',
      opts: ['🐕 Dog: 40 m in 4 s', '🦊 Fox: 72 m in 9 s', '🐈 Cat: 18 m in 3 s'], ans: 0,
      hint: 'The fox goes furthest, but it also takes the longest. Work out each speed: distance ÷ time.',
      why: 'Dog: 40 ÷ 4 = 10 m/s. Fox: 72 ÷ 9 = 8 m/s. Cat: 18 ÷ 3 = 6 m/s. The dog is fastest, and its line is the steepest.' },
    { mode: 'pick', graph: 'full', T: 10, D: 60, tStep: 2, dStep: 20,
      racers: [{ e: '🐕', n: 'dog', pts: [[0, 0], [10, 50]] }, { e: '🚶', n: 'walker', pts: [[0, 0], [10, 20]] }, { e: '🐇', n: 'sleepy hare', sleep: true, pts: [[0, 30], [10, 30]] }],
      q: 'Look at the distance–time graph. Which racer is moving <b>fastest</b>?',
      opts: ['🔴 Red line (dog)', '🔵 Blue line (walker)', '🟢 Green line (hare)'], ans: 0,
      hint: 'The fastest racer has the <b>steepest</b> line, not the highest one. Which line climbs the most each second?',
      why: 'The red line is steepest: the dog goes 50 m in 10 s, which is 5 m/s. The green line is flat, so the hare isn\'t moving at all. It\'s asleep 💤' },
    { mode: 'pick', graph: 'full', T: 10, D: 40, tStep: 2, dStep: 10,
      racers: [{ e: '🚗', n: 'toy car', pts: [[0, 0], [4, 20], [8, 20], [10, 30]] }],
      q: 'The toy car\'s line is <b>flat</b> from 4 s to 8 s. What is the car doing then?',
      opts: ['Standing still (stopped)', 'Moving at a steady speed', 'Going faster and faster'], ans: 0,
      hint: 'Read the distance at 4 s and at 8 s. Does the car get any further from the start?',
      why: 'The distance stays at 20 m, so the car isn\'t moving. A flat line on a distance–time graph means stopped.' },
    { mode: 'pick', graph: 'after', mini: true, T: 10, D: 80, tStep: 2, dStep: 20, stop: 40,
      racers: [{ e: '🚌', n: 'bus', pts: [[0, 0], [4, 40], [7, 40], [10, 70]] }],
      q: 'Story time! The bus 🚌 drives at a steady speed, waits at the bus stop 🚏, then drives on. Which graph tells this story?',
      opts: [[[0, 0], [10, 70]], [[0, 0], [4, 40], [7, 40], [10, 70]], [[0, 0], [4, 40], [7, 40], [10, 0]]], ans: 1,
      hint: 'While the bus waits, its distance doesn\'t change, so look for a flat part. A line going <b>down</b> means coming back towards the start.',
      why: 'Sloping up (driving), flat (waiting at the stop), then sloping up again (driving on).' },
    { mode: 'calc', graph: 'full', T: 30, D: 120, tStep: 5, dStep: 30, val: 1, min: 1, max: 12, steps: [-1, 1], ans: 4, avg: true,
      racers: [{ e: '🚴', n: 'cyclist', pts: [[0, 0], [10, 60], [20, 60], [30, 120]] }],
      text: 'The cyclist rides 60 m in 10 s, stops for 10 s to fix the chain, then rides another 60 m in 10 s. Set the <b>average speed</b> for the whole journey, then press <b>Check</b>.',
      hint: 'Average speed = total distance ÷ total time. Add up all the distance, and all the time, including the stop.',
      trap: { 6: 'Careful: 6 m/s is the speed while riding. The 10 s stop counts in the total time too!' },
      why: 'Total distance 120 m ÷ total time 30 s = 4 m/s. The stop counts in the time, so the average is less than the 6 m/s riding speed.' },
    { mode: 'pick', graph: 'full', T: 2, D: 240, tStep: 0.5, dStep: 60, tu: 'h', du: 'km',
      racers: [{ e: '🚆', n: 'train', pts: [[0, 0], [2, 240]] }],
      q: 'A train 🚆 travels <b>240 km</b> in <b>2 hours</b>. What is its speed?',
      opts: ['120 km/h', '120 m/s', '480 km/h', '120 km'], ans: 0,
      hint: 'Divide the distance by the time. The units come from the question: kilometres ÷ hours gives km/h. And a speed needs a "per".',
      why: '240 km ÷ 2 h = 120 km/h. The distance was in km and the time in hours, so the speed is in kilometres per hour.' },
    { mode: 'race', T: 100, D: 1500, finish: 1000, finLab: '1 km', tStep: 20, dStep: 500, val: 1, min: 1, max: 15, steps: [-5, -1, 1, 5], ans: 10,
      racers: [{ e: '🐎', n: 'horse', pts: function (v) { return line(v, 100); } }],
      text: 'The horse 🐎 gallops <b>1 km</b> in <b>100 s</b>. Set its speed in <b>m/s</b> so it reaches the finish just as the race ends.',
      hint: 'First change 1 km into metres: 1 km = 1000 m. Then speed = 1000 m ÷ 100 s.',
      why: '1 km = 1000 m, and 1000 m ÷ 100 s = 10 m/s. That\'s 36 km/h: a good gallop!' }
  ];

  function f(v) { return (+v).toFixed(1); }
  function num(v) { return String(Math.round(v * 100) / 100); }
  function at(pts, t) {
    if (t <= pts[0][0]) return pts[0][1];
    for (var k = 1; k < pts.length; k++) if (t <= pts[k][0]) { var a = pts[k - 1], b = pts[k]; return a[1] + (b[1] - a[1]) * (t - a[0]) / (b[0] - a[0]); }
    return pts[pts.length - 1][1];
  }
  function upto(pts, t) {
    var out = [pts[0]];
    for (var k = 1; k < pts.length; k++) { if (pts[k][0] <= t) out.push(pts[k]); else { out.push([t, at(pts, t)]); break; } }
    return out;
  }
  function mini(pts) {
    var s = '<svg class="rt-mini" viewBox="0 0 120 80" aria-hidden="true"><path d="M14 6 V70 H116" class="rt-ax"/>';
    s += '<polyline points="' + pts.map(function (p) { return f(14 + p[0] * 10) + ',' + f(70 - p[1] * 0.8); }).join(' ') + '" class="rt-ml"/>';
    return s + '<text x="64" y="79" text-anchor="middle" class="rt-mt">time</text><text x="9" y="40" text-anchor="middle" class="rt-mt" transform="rotate(-90 9 40)">distance</text></svg>';
  }

  Arcade.game({
    intro: 'Ready, steady, go! Race animals and vehicles, then read the distance–time graph that draws as they move.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], v = R.val || 0, busy = false, showG = R.graph !== 'after', showAvg = false, now = R.mode === 'race' || R.graph === 'after' ? 0 : R.T;
      var tu = R.tu || 's', du = R.du || 'm', su = du + '/' + tu;
      var lanes = R.racers.length, LH = 36, ty = 6, gy0 = ty + lanes * LH + 46, gy1 = gy0 + 150, H = gy1 + 44;
      var tx0 = 48, tx1 = 372, gx0 = 58, gx1 = 380;
      function TX(d) { return tx0 + d / R.D * (tx1 - tx0); }
      function GX(t) { return gx0 + t / R.T * (gx1 - gx0); }
      function GY(d) { return gy1 - d / R.D * (gy1 - gy0); }
      function pts(r) { return typeof r.pts === 'function' ? r.pts(v) : r.pts; }

      var ctrl = '';
      if (R.mode === 'race' || R.mode === 'calc') {
        ctrl = '<div class="rt-ctrl rt-c' + (R.steps.length + 1) + '">' + R.steps.map(function (d, k) {
          return (k === R.steps.length / 2 ? '<b class="rt-val" aria-live="polite"></b>' : '') +
            '<button class="btn ghost" type="button" data-d="' + d + '" aria-label="' + (d > 0 ? 'Faster by ' : 'Slower by ') + Math.abs(d) + ' ' + su + '">' + (d > 0 ? '+' : '−') + Math.abs(d) + '</button>';
        }).join('') + '</div><p class="actions rt-act">' +
          (R.mode === 'race' ? '<button class="btn" type="button" data-go>Race! 🏁</button>' :
            '<button class="btn ghost" type="button" data-watch>Watch ▶</button><button class="btn" type="button" data-check>Check ✓</button>') + '</p>';
      } else if (R.graph === 'full') {
        ctrl = '<p class="actions rt-act"><button class="btn ghost" type="button" data-watch>Watch the race ▶</button></p>';
      }
      stage.innerHTML = '<p class="q-num">Race ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="rt-svg" viewBox="0 0 400 ' + H + '" role="img"></svg><p class="rt-out" aria-live="polite"></p>' + ctrl +
        (R.opts ? '<div class="q-options' + (R.mini ? ' rt-minis' : '') + '"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.rt-out');
      ui.owl(R.mode === 'race' ? 'Use the buttons to change the speed. The graph draws while they race.' :
        R.mode === 'calc' ? 'Watch the race, then work it out. Total distance ÷ total time.' :
        R.mini ? 'Read each graph like a story, from left to right.' : 'Steeper line = faster. Flat line = stopped.');

      function draw(t) {
        now = t;
        var s = '', k;
        // track
        R.racers.forEach(function (r, k) {
          var y = ty + k * LH;
          s += '<rect x="' + tx0 + '" y="' + y + '" width="' + (tx1 - tx0 + 20) + '" height="' + (LH - 4) + '" rx="8" class="rt-lane"/>' +
            '<circle cx="15" cy="' + (y + 16) + '" r="8" fill="' + COL[k] + '"/>';
        });
        s += '<line x1="' + tx0 + '" y1="' + ty + '" x2="' + tx0 + '" y2="' + (ty + lanes * LH - 4) + '" class="rt-start"/>';
        if (R.finish) s += '<line x1="' + f(TX(R.finish)) + '" y1="' + ty + '" x2="' + f(TX(R.finish)) + '" y2="' + (ty + lanes * LH - 4) + '" class="rt-fin"/>' +
          '<text x="' + f(TX(R.finish)) + '" y="' + (ty + lanes * LH + 12) + '" text-anchor="middle" class="rt-lab">🏁 ' + (R.finLab || R.finish + ' ' + du) + '</text>';
        if (R.stop) s += '<text x="' + f(TX(R.stop)) + '" y="' + (ty + 28) + '" text-anchor="middle" class="rt-stopi">🚏</text>';
        s += '<text x="' + tx0 + '" y="' + (ty + lanes * LH + 12) + '" text-anchor="middle" class="rt-lab">0</text>' +
          '<text x="' + tx1 + '" y="' + (ty + lanes * LH + 12) + '" text-anchor="middle" class="rt-lab">' + num(R.D) + ' ' + du + '</text>';
        R.racers.forEach(function (r, k) {
          var d = at(pts(r), t), x = TX(Math.min(d, R.D)), y = ty + k * LH + 25;
          s += '<text transform="translate(' + f(x) + ' ' + y + ') scale(-1 1)" text-anchor="middle" class="rt-e">' + r.e + '</text>' +
            (r.sleep ? '<text x="' + f(x + 14) + '" y="' + (y - 14) + '" class="rt-z">💤</text>' : '');
        });
        // graph
        for (k = 0; k <= R.D + 1e-9; k += R.dStep) s += '<line x1="' + gx0 + '" y1="' + f(GY(k)) + '" x2="' + gx1 + '" y2="' + f(GY(k)) + '" class="rt-grid"/>' +
          '<text x="' + (gx0 - 6) + '" y="' + f(GY(k) + 4) + '" text-anchor="end" class="rt-tk">' + num(k) + '</text>';
        for (k = 0; k <= R.T + 1e-9; k += R.tStep) s += '<line x1="' + f(GX(k)) + '" y1="' + gy0 + '" x2="' + f(GX(k)) + '" y2="' + gy1 + '" class="rt-grid"/>' +
          '<text x="' + f(GX(k)) + '" y="' + (gy1 + 16) + '" text-anchor="middle" class="rt-tk">' + num(k) + '</text>';
        s += '<path d="M' + gx0 + ' ' + (gy0 - 6) + ' V' + gy1 + ' H' + (gx1 + 4) + '" class="rt-ax"/>' +
          '<text x="' + ((gx0 + gx1) / 2) + '" y="' + (gy1 + 34) + '" text-anchor="middle" class="rt-axl">time (' + tu + ')</text>' +
          '<text x="12" y="' + ((gy0 + gy1) / 2) + '" text-anchor="middle" class="rt-axl" transform="rotate(-90 12 ' + ((gy0 + gy1) / 2) + ')">distance (' + du + ')</text>';
        if (showG) {
          if (t > 0 && t < R.T) s += '<line x1="' + f(GX(t)) + '" y1="' + gy0 + '" x2="' + f(GX(t)) + '" y2="' + gy1 + '" class="rt-now"/>';
          R.racers.forEach(function (r, k) {
            var p = upto(pts(r), t).map(function (q) { return [q[0], Math.min(q[1], R.D)]; });
            s += '<polyline points="' + p.map(function (q) { return f(GX(q[0])) + ',' + f(GY(q[1])); }).join(' ') + '" class="rt-gl" stroke="' + COL[k] + '"/>' +
              '<circle cx="' + f(GX(p[p.length - 1][0])) + '" cy="' + f(GY(p[p.length - 1][1])) + '" r="5" fill="' + COL[k] + '"/>';
          });
          if (showAvg) s += '<line x1="' + GX(0) + '" y1="' + GY(0) + '" x2="' + GX(R.T) + '" y2="' + GY(R.D) + '" class="rt-avg"/>' +
            '<text x="' + f(GX(R.T * 0.7)) + '" y="' + f(GY(R.D * 0.83)) + '" text-anchor="end" class="rt-avgt">average 4 m/s</text>';
        } else s += '<text x="' + ((gx0 + gx1) / 2) + '" y="' + ((gy0 + gy1) / 2 + 8) + '" text-anchor="middle" class="rt-q">graph after you answer ❓</text>';
        s += '<text x="' + (gx0 - 6) + '" y="' + (gy0 - 12) + '" class="rt-clock">time = ' + num(Math.round(t * 10) / 10) + ' ' + tu + '</text>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Race track with ' + R.racers.map(function (r) { return 'a ' + r.n; }).join(', ') +
          ', and a distance–time graph below it.' + (showG ? ' ' + R.racers.map(function (r) { return 'The ' + r.n + ' is at ' + num(Math.round(at(pts(r), t))) + ' ' + du + '.'; }).join(' ') : ''));
        var val = stage.querySelector('.rt-val'); if (val) val.textContent = v + ' ' + su;
      }

      function run(cb) {
        if (busy) return;
        if (still) { draw(R.T); if (cb) cb(); return; }
        busy = true; var t0 = performance.now(), dur = 1800;
        (function go(tm) {
          var p = Math.min(1, (tm - t0) / dur); draw(R.T * p);
          if (p < 1) requestAnimationFrame(go); else { busy = false; if (cb) cb(); }
        })(t0);
      }
      function locked() { return stage.classList.contains('locked'); }

      stage.querySelectorAll('[data-d]').forEach(function (b) { b.addEventListener('click', function () {
        if (busy || locked()) return; v = Math.max(R.min, Math.min(R.max, v + +b.getAttribute('data-d')));
        if (R.mode === 'race') { draw(0); out.textContent = ''; } else draw(now);
      }); });
      var watch = stage.querySelector('[data-watch]');
      if (watch) watch.addEventListener('click', function () { run(); });

      if (R.mode === 'race') {
        stage.querySelector('[data-go]').addEventListener('click', function () {
          if (busy || locked()) return;
          run(function () {
            var d = v * R.T;
            out.innerHTML = 'The ' + R.racers[0].n + ' ran <b>' + num(d) + ' m</b> in ' + R.T + ' s' + (v === R.ans ? ': right on the finish line! 🏁' : d > R.finish ? ': past the finish line.' : ': not at the finish yet.');
            ui.check(v === R.ans, { hint: R.hint + (v > R.ans ? ' (Too fast this time.)' : ' (Too slow this time.)'), why: R.why,
              reveal: function () { v = R.ans; run(function () { out.innerHTML = 'At <b>' + R.ans + ' m/s</b> the ' + R.racers[0].n + ' ends right on the finish line 🏁'; }); } });
          });
        });
      } else if (R.mode === 'calc') {
        stage.querySelector('[data-check]').addEventListener('click', function () {
          if (busy || locked()) return;
          var ok = v === R.ans;
          if (ok) { showAvg = true; draw(R.T); }
          ui.check(ok, { hint: (R.trap && R.trap[v]) || R.hint, why: R.why,
            reveal: function () { v = R.ans; showAvg = true; draw(R.T); } });
          if (locked()) { out.innerHTML = 'Average speed = 120 m ÷ 30 s = <b>4 m/s</b>'; if (watch) watch.disabled = false; }
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', R.mini ? mini(o) + '<span>Graph ' + 'ABC'[k] + '</span>' : o); b.type = 'button';
          if (R.mini) b.setAttribute('aria-label', 'Graph ' + 'ABC'[k] + ': ' + ['one steady slope all the way', 'slope up, flat, then slope up again', 'slope up, flat, then slope down to zero'][k]);
          b.addEventListener('click', function () {
            if (busy) return;
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            if (locked()) { showG = true; if (watch) watch.disabled = false; run(); }
          });
          box.appendChild(b);
        });
      }
      draw(now);
    }
  });
})();
