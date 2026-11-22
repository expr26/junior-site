/* Day, Night and Seasons.
   Spin view: the Earth seen from above the North Pole, Sun on the left. The Earth spins anticlockwise once a day (24 hours);
   a person on the equator has midnight when facing away from the Sun, sunrise (06:00) a quarter turn later, noon facing the Sun.
   Orbit view: the Earth goes round the Sun once a year (about 365 days) with its axis tilted (about 23.5°) and always pointing the
   same way in space. June: the northern half leans towards the Sun (northern summer, southern winter); December: the opposite.
   Seasons are caused by the tilt, not by the distance from the Sun. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var ROUNDS = [
    { view: 'spin', start: 180, task: 'Spin the Earth so it is <b>midnight</b> for the person 🧍, then press <b>Done</b>.', ok: function (s) { return s.th === 0; },
      hint: 'Midnight is when the person is in the middle of the dark side, facing directly away from the Sun.', why: 'At midnight you are on the side of the Earth facing away from the Sun.' },
    { view: 'spin', start: 0, q: 'Why do we have day and night?', opts: ['The Earth spins on its axis', 'The Sun goes round the Earth', 'The Earth goes round the Sun'], ans: 0,
      hint: 'Spin the Earth and watch the person move from the dark side into the light.', why: 'The Earth spins once a day. The side facing the Sun has day; the side facing away has night.' },
    { view: 'spin', start: 0, task: 'Spin the Earth to <b>sunrise</b> (6 o\'clock in the morning), then press <b>Done</b>.', ok: function (s) { return s.th === 90; },
      hint: 'Sunrise is when the person is just turning out of the dark side into the light.', why: 'At sunrise, the spinning Earth carries you from the night side onto the day side.' },
    { view: 'spin', start: 0, q: 'How long does the Earth take to spin round once?', opts: ['About 24 hours (1 day)', 'About 365 days (1 year)', 'About 1 month'], ans: 0,
      hint: 'Count how many hours the clock moves when you spin the Earth all the way round.', why: 'One full spin takes about 24 hours: that is one day.' },
    { view: 'orbit', start: 2, task: 'Move the Earth to <b>summer</b> in the <b>northern</b> half (where the UK is), then press <b>Done</b>.', ok: function (s) { return s.pos === 0; },
      hint: 'In summer, your half of the Earth leans <b>towards</b> the Sun. Watch which way the North Pole points.', why: 'In June the northern half leans towards the Sun, so the UK gets more direct sunlight and longer days: summer.' },
    { view: 'orbit', start: 0, q: 'What causes the seasons?', opts: ['The tilt of the Earth\'s axis', 'How close the Earth is to the Sun', 'The Earth spinning'], ans: 0,
      hint: 'Move the Earth round the Sun. The distance hardly changes, but something else does.', why: 'The tilt of the Earth\'s axis causes the seasons. The half leaning towards the Sun has summer. (The Earth is actually closest to the Sun in January!)' },
    { view: 'orbit', start: 0, task: 'Move the Earth to <b>summer</b> in the <b>southern</b> half (where Australia is), then press <b>Done</b>.', ok: function (s) { return s.pos === 2; },
      hint: 'The southern half has summer when it leans <b>towards</b> the Sun. That\'s when the northern half leans away.', why: 'In December the southern half leans towards the Sun, so Australia has summer at Christmas while the UK has winter.' },
    { view: 'orbit', start: 1, q: 'How long does the Earth take to go once round the Sun?', opts: ['About 24 hours', 'About 1 month', 'About 365 days (1 year)'], ans: 2,
      hint: 'Going once round the Sun takes you through all four seasons.', why: 'One trip round the Sun takes about 365¼ days: one year.' }
  ];
  var MONTHS = ['June', 'September', 'December', 'March'];
  var NORTH = ['summer ☀️', 'autumn 🍂', 'winter ❄️', 'spring 🌱'], SOUTH = ['winter ❄️', 'spring 🌱', 'summer ☀️', 'autumn 🍂'];

  function f(v) { return v.toFixed(1); }

  Arcade.game({
    intro: 'Let\'s explore space! Spin the Earth to make day and night, then send it round the Sun to make the seasons.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], th = R.view === 'spin' ? R.start : 0, pos = R.view === 'orbit' ? R.start : 0;
      stage.innerHTML = '<p class="q-num">Space mission ' + (i + 1) + '</p><p class="q-text">' + (R.task || R.q) + '</p>' +
        '<svg class="dn-svg" viewBox="0 0 400 260" role="img"></svg><p class="dn-out" aria-live="polite"></p>' +
        '<p class="actions dn-act">' + (R.view === 'spin' ?
          '<button class="btn ghost" type="button" data-t="-45">↻ Back 3 h</button><button class="btn" type="button" data-t="45">Spin ↺ 3 h</button>' :
          '<button class="btn ghost" type="button" data-p="-1">◀ 3 months back</button><button class="btn" type="button" data-p="1">3 months on ▶</button>') +
        (R.task ? '<button class="btn ghost" type="button" data-done>Done ✓</button>' : '') + '</p>' + (R.q ? '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.dn-out');
      ui.owl(R.view === 'spin' ? 'We\'re looking down on the North Pole. The Sun is on the left.' : 'The Earth\'s axis is tilted, and it always points the same way in space.');

      function sun(x, y, r) {
        var s = '';
        for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6; s += '<line x1="' + f(x + Math.cos(a) * (r + 4)) + '" y1="' + f(y + Math.sin(a) * (r + 4)) + '" x2="' + f(x + Math.cos(a) * (r + 14)) + '" y2="' + f(y + Math.sin(a) * (r + 14)) + '" class="dn-ray"/>'; }
        return s + '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" class="dn-sun"/>';
      }

      function spin() {
        var cx = 250, cy = 130, r = 80, t = th * Math.PI / 180, px = cx + r * Math.cos(t), py = cy - r * Math.sin(t);
        var s = sun(36, 130, 26) + '<path d="M70 70 L160 70 M70 130 L160 130 M70 190 L160 190" class="dn-beam"/>';
        s += '<g transform="rotate(' + (-th) + ' ' + cx + ' ' + cy + ')"><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" class="dn-sea"/>' +
          '<path d="M215 85 q25 -20 50 0 q10 25 -15 35 q-30 5 -35 -35 Z M270 150 q30 0 35 25 q-20 25 -45 5 Z M200 150 q15 10 5 30 q-20 -5 -5 -30 Z" class="dn-land"/></g>';
        s += '<path d="M' + cx + ' ' + (cy - r) + ' A' + r + ' ' + r + ' 0 0 1 ' + cx + ' ' + (cy + r) + ' Z" class="dn-night"/>';
        s += '<circle cx="' + cx + '" cy="' + cy + '" r="5" class="dn-pole"/><text x="' + cx + '" y="' + (cy + 20) + '" text-anchor="middle" class="dn-cap">North Pole</text>';
        s += '<text x="' + f(px + 20 * Math.cos(t)) + '" y="' + f(py - 20 * Math.sin(t) + 9) + '" text-anchor="middle" class="dn-me">🧍</text>';
        s += '<text x="170" y="34" text-anchor="middle" class="dn-cap">day side</text><text x="330" y="34" text-anchor="middle" class="dn-cap">night side</text>' +
          '<path d="M342 165 A50 50 0 0 0 342 95" class="dn-spin"/><path d="M334 90 L346 92 L340 103 Z" class="dn-spinhead"/>';
        svg.innerHTML = s;
        var hrs = ((th / 360) * 24 + 24) % 24, clock = ('0' + hrs).slice(-2) + ':00';
        var when = th === 0 ? 'midnight 🌙' : th === 90 ? 'sunrise 🌅' : th === 180 ? 'noon ☀️' : th === 270 ? 'sunset 🌇' : th > 90 && th < 180 ? 'morning' : th > 180 && th < 270 ? 'afternoon' : th > 270 ? 'evening' : 'night';
        out.innerHTML = 'Time for the person: <b>' + clock + '</b> (' + when + ')';
        svg.setAttribute('aria-label', 'Earth seen from above the North Pole with the Sun on the left. The person is at ' + clock + '.');
      }

      function orbit() {
        var spots = [[52, 130], [200, 198], [348, 130], [200, 58]], e = spots[pos], s = '';
        s += '<ellipse cx="200" cy="130" rx="148" ry="70" class="dn-orbit"/>';
        spots.forEach(function (q, k) { s += '<text x="' + q[0] + '" y="' + (q[1] + (k === 1 ? 54 : k === 3 ? -36 : 52)) + '" text-anchor="middle" class="dn-cap">' + MONTHS[k] + '</text>'; });
        if (pos !== 3) s += sun(200, 130, 24);
        var away = Math.atan2(e[1] - 130, e[0] - 200) * 180 / Math.PI;
        s += '<g transform="translate(' + e[0] + ' ' + e[1] + ')"><circle r="24" class="dn-sea"/><path d="M-10 -12 q10 -8 18 2 q-2 12 -14 8 Z M2 6 q10 0 12 8 q-8 6 -14 0 Z" class="dn-land"/>' +
          '<path d="M0 -24 A24 24 0 0 1 0 24 Z" class="dn-night" transform="rotate(' + f(away) + ')"/>' +
          '<g transform="rotate(23.5)"><path d="M-24 0 H24" class="dn-eq"/><line x1="0" y1="-38" x2="0" y2="38" class="dn-axis"/><text x="0" y="-42" text-anchor="middle" class="dn-n">N</text></g></g>';
        if (pos === 3) s += sun(200, 130, 24);
        svg.innerHTML = s;
        out.innerHTML = '<b>' + MONTHS[pos] + '</b>: north (UK) has <b>' + NORTH[pos] + '</b>, south (Australia) has <b>' + SOUTH[pos] + '</b>';
        svg.setAttribute('aria-label', 'The Earth going round the Sun. It is ' + MONTHS[pos] + '. The North Pole leans to the right.');
      }
      function draw() { if (R.view === 'spin') spin(); else orbit(); }

      stage.querySelectorAll('[data-t]').forEach(function (b) { b.addEventListener('click', function () { th = (th + +b.getAttribute('data-t') + 360) % 360; draw(); }); });
      stage.querySelectorAll('[data-p]').forEach(function (b) { b.addEventListener('click', function () { pos = (pos + +b.getAttribute('data-p') + 4) % 4; draw(); }); });

      if (R.task) {
        stage.querySelector('[data-done]').addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          ui.check(R.ok({ th: th, pos: pos }), { hint: R.hint, why: R.why });
          if (stage.classList.contains('locked')) stage.querySelectorAll('[data-t],[data-p]').forEach(function (x) { x.disabled = false; });
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            if (stage.classList.contains('locked')) stage.querySelectorAll('[data-t],[data-p]').forEach(function (x) { x.disabled = false; });
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
