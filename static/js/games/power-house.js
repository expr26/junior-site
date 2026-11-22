/* Power House: a house with six appliances the child switches on and off. Powers (round, typical values):
   LED lamp 10 W, phone charger 5 W, laptop 50 W, TV 100 W, heater 2 kW (2000 W), kettle 3 kW (3000 W). 1 kW = 1000 W.
   Rules: energy (kWh) = power (kW) × time (h); cost = kWh × price. The price is made up: 30p per kWh.
   Answers worked by hand:
   R1 most energy in 1 hour = biggest power = kettle 3 kW (the other five together are 2165 W).
   R2 2.1 kW = 2100 W = heater 2000 W + TV 100 W (the only combination).
   R3 heater 2 kW × 3 h = 6 kWh.        R4 6 kWh × 30p = 180p = £1.80.
   R5 TV 100 W = 0.1 kW; 0.1 × 5 h = 0.5 kWh; 0.5 × 30p = 15p.
   R6 filament 100 W × 10 h = 1 kWh = 30p; LED 10 W × 10 h = 0.1 kWh = 3p; saving 27p.
   R7 meter 04560 − 04518 = 42 kWh.     R8 heater 2 kW × 1 h = 2 kWh > LED 0.01 × 10 = 0.1 kWh > charger 0.005 × 10 = 0.05 kWh.
   Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var APP = [
    { k: 'lamp', e: '💡', name: 'LED lamp', w: 10 }, { k: 'phone', e: '📱', name: 'Phone charger', w: 5 },
    { k: 'laptop', e: '💻', name: 'Laptop', w: 50 }, { k: 'tv', e: '📺', name: 'TV', w: 100 },
    { k: 'heater', e: '🌡️', name: 'Heater', w: 2000 }, { k: 'kettle', e: '🫖', name: 'Kettle', w: 3000 }
  ];
  function pw(w) { return w >= 1000 ? (w / 1000) + ' kW' : w + ' W'; }
  function pence(p) { return p >= 100 ? '£' + (p / 100).toFixed(2) : p + 'p'; }

  var PRICE = 'Imagine electricity costs <b>30p per kWh</b>.';
  var ROUNDS = [
    { view: 'house', toggle: true, text: 'If each one was left on for <b>1 hour</b>, which would use the most energy? Switch ON just that one, then press <b>Check</b>.',
      ok: function (on) { return on.join() === 'kettle'; },
      hint: function (on) { return on.length !== 1 ? 'Switch on just <b>one</b> appliance.' : 'The times are the same, so look for the biggest power. Careful: 1 kW = 1000 W, so 3 kW is 3000 W, much more than 100 W.'; },
      why: 'The kettle has the biggest power: 3 kW = 3000 W. In 1 hour it uses 3 kWh, more than all the others put together.', reveal: ['kettle'] },
    { view: 'house', toggle: true, text: 'Switch on appliances so the total power is exactly <b>2.1 kW</b>, then press <b>Check</b>.',
      ok: function (on, tot) { return tot === 2100; },
      hint: function () { return '1 kW = 1000 W, so 2.1 kW = 2100 W. The meter shows watts.'; },
      why: 'Heater 2 kW (2000 W) + TV 100 W = 2100 W = 2.1 kW.', reveal: ['tv', 'heater'] },
    { view: 'calc', calc: 'heater', dial: [-1, 1], unit: ' kWh', ans: 6, max: 20,
      text: 'The 🌡️ heater (<b>2 kW</b>) is on for <b>3 hours</b>. Set the dial to the energy it uses in kWh, then press <b>Check</b>.',
      hint: function (v) { return v === 5 ? 'You added 2 + 3. Energy = power × time, so <b>multiply</b>: kW × hours.' : 'Energy in kWh = power in kW × time in hours.'; },
      why: '2 kW × 3 h = 6 kWh. A kilowatt-hour is the energy used by a 1 kW appliance in 1 hour.' },
    { view: 'calc', calc: 'cost', q: PRICE + ' The heater used 6 kWh. How much did that cost?', opts: ['£1.80', '36p', '£18.00', '5p'], ans: 0,
      hint: 'Cost = kWh × price, so work out 6 × 30p. Then change pence to pounds: 100p = £1.', why: '6 × 30p = 180p = £1.80.' },
    { view: 'calc', calc: 'tv', dial: [-10, -1, 1, 10], unit: 'p', ans: 15, max: 200,
      text: PRICE + ' The 📺 TV (<b>100 W</b>) is on for <b>5 hours</b>. What does that cost? Set the dial, then press <b>Check</b>.',
      hint: function (v) { return v === 150 || v === 1500 ? 'Did you use 100 instead of 0.1? Change watts to kilowatts first: 100 W = 0.1 kW.' : 'First change 100 W into kW (100 W = 0.1 kW). Then kWh = 0.1 × 5, and cost = kWh × 30p.'; },
      why: '100 W = 0.1 kW. 0.1 kW × 5 h = 0.5 kWh. 0.5 × 30p = 15p.' },
    { view: 'calc', calc: 'bulbs', q: PRICE + ' A <b>100 W</b> filament bulb and a <b>10 W</b> LED bulb give about the same light. Each is on for 10 hours. How much do you save with the LED?',
      opts: ['27p', '90p', '3p', '30p'], ans: 0,
      hint: 'Work out each bulb. Filament: 0.1 kW × 10 h = 1 kWh. LED: 0.01 kW × 10 h = 0.1 kWh. Find both costs, then the difference.',
      why: 'Filament: 1 kWh = 30p. LED: 0.1 kWh = 3p. You save 30p − 3p = 27p, because the LED wastes much less energy heating the room.' },
    { view: 'calc', calc: 'meter', dial: [-10, -1, 1, 10], unit: ' kWh', ans: 42, max: 200,
      text: 'The electricity meter counts kWh. How many kWh did the house use from Monday to Sunday? Set the dial, then press <b>Check</b>.',
      hint: function () { return 'Take the Monday reading away from the Sunday reading: 4560 − 4518.'; },
      why: '4560 − 4518 = 42 kWh used in the week. At 30p per kWh that would cost £12.60.' },
    { view: 'house', q: 'Which of these saves the most energy?',
      opts: ['Switching off the 2 kW heater for 1 hour', 'Switching off the 10 W LED lamp for 10 hours', 'Unplugging the 5 W phone charger for 10 hours'], ans: 0,
      hint: 'Work out kWh = kW × hours for each one. Change W into kW first: 10 W = 0.01 kW.',
      why: 'Heater: 2 × 1 = 2 kWh. LED: 0.01 × 10 = 0.1 kWh. Charger: 0.005 × 10 = 0.05 kWh. Things that heat have big powers, so they use the most energy.' }
  ];

  Arcade.game({
    intro: 'Welcome to the Power House! Switch things on and off, and find out how much energy they use and what it costs.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], on = {}, val = 0, solved = false;
      var html = '<p class="q-num">Job ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="ph-svg" viewBox="0 0 400 ' + (R.view === 'house' ? 300 : { bulbs: 200, meter: 186 }[R.calc] || 170) + '" role="img"></svg><p class="ph-out" aria-live="polite"></p>';
      if (R.dial) html += '<div class="ph-dial ph-n' + R.dial.length + '">' + R.dial.map(function (d, k) {
        return (k === R.dial.length / 2 ? '<b class="ph-val"></b>' : '') + '<button class="btn ghost" type="button" data-d="' + d + '">' + (d > 0 ? '+' : '−') + Math.abs(d) + '</button>';
      }).join('') + '</div>';
      if (R.toggle || R.dial) html += '<p class="actions ph-act"><button class="btn" type="button" data-done>Check ✓</button></p>';
      if (R.q) html += '<div class="q-options"></div>';
      stage.innerHTML = html;
      var svg = stage.querySelector('svg'), out = stage.querySelector('.ph-out');
      ui.owl(R.view === 'house' ? 'Tap an appliance to switch it on or off. 1 kW = 1000 W.' : R.calc === 'meter' ? 'A meter keeps counting up, like a car\'s mileage.' : 'Energy (kWh) = power (kW) × time (hours).');

      function onList() { return APP.filter(function (a) { return on[a.k]; }).map(function (a) { return a.k; }); }
      function total() { return APP.reduce(function (s, a) { return s + (on[a.k] ? a.w : 0); }, 0); }

      function house() {
        var s = '<path d="M200 8 L388 70 H12 Z" class="ph-roof"/><rect x="12" y="70" width="376" height="222" rx="10" class="ph-wall"/><text x="200" y="56" text-anchor="middle" class="ph-sign">⚡ Power House</text>';
        APP.forEach(function (a, k) {
          var x = 22 + (k % 3) * 122, y = 80 + Math.floor(k / 3) * 104, o = !!on[a.k];
          s += '<g class="ph-app' + (o ? ' on' : '') + '" data-k="' + a.k + '" role="button" tabindex="0" aria-pressed="' + o + '" aria-label="' + a.name + ', ' + pw(a.w) + ', ' + (o ? 'on' : 'off') + '">' +
            '<rect x="' + x + '" y="' + y + '" width="112" height="96" rx="14" class="ph-card"/>' +
            '<text x="' + (x + 56) + '" y="' + (y + 38) + '" text-anchor="middle" class="ph-e">' + a.e + '</text>' +
            '<text x="' + (x + 56) + '" y="' + (y + 62) + '" text-anchor="middle" class="ph-name">' + a.name + '</text>' +
            '<text x="' + (x + 56) + '" y="' + (y + 84) + '" text-anchor="middle" class="ph-pw">' + pw(a.w) + '</text>' +
            '<rect x="' + (x + 74) + '" y="' + (y + 6) + '" width="32" height="18" rx="9" class="ph-sw"/><text x="' + (x + 90) + '" y="' + (y + 19) + '" text-anchor="middle" class="ph-swt">' + (o ? 'ON' : 'OFF') + '</text></g>';
        });
        svg.innerHTML = s;
        var t = total(), n = onList().length;
        out.innerHTML = '⚡ Power now: <b>' + t + ' W</b>' + (n ? ' · ' + n + ' on' : ' · all off');
        svg.setAttribute('aria-label', 'A house with six appliances. ' + APP.map(function (a) { return a.name + ' ' + pw(a.w) + (on[a.k] ? ' on' : ' off'); }).join(', ') + '. Total power ' + t + ' watts.');
      }

      function box(x, y, w, big, small, cls) {
        return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="78" rx="14" class="ph-box ' + (cls || '') + '"/>' +
          '<text x="' + (x + w / 2) + '" y="' + (y + 42) + '" text-anchor="middle" class="ph-big">' + big + '</text>' +
          '<text x="' + (x + w / 2) + '" y="' + (y + 66) + '" text-anchor="middle" class="ph-small">' + small + '</text>';
      }
      function op(x, y, t) { return '<text x="' + x + '" y="' + y + '" text-anchor="middle" class="ph-op">' + t + '</text>'; }
      function calc() {
        var s = '', lab = '', show = solved;
        if (R.calc === 'heater') {
          s = box(10, 20, 100, '🌡️ 2 kW', 'power') + op(126, 66, '×') + box(142, 20, 100, '⏰ 3 h', 'time') + op(258, 66, '=') + box(274, 20, 116, val + ' kWh', 'energy', 'ans');
          s += '<text x="200" y="150" text-anchor="middle" class="ph-note">kWh = kW × hours</text>';
          lab = 'Heater 2 kilowatts times 3 hours equals ' + val + ' kilowatt-hours.';
        } else if (R.calc === 'cost') {
          s = box(10, 20, 116, '6 kWh', 'energy') + op(142, 66, '×') + box(158, 20, 100, '30p', 'per kWh') + op(274, 66, '=') + box(290, 20, 100, show ? '£1.80' : '?', 'cost', 'ans');
          s += '<text x="200" y="150" text-anchor="middle" class="ph-note">100p = £1</text>';
          lab = '6 kilowatt-hours times 30p per kilowatt-hour equals ' + (show ? '£1.80' : 'what cost?');
        } else if (R.calc === 'tv') {
          s = box(10, 20, 104, '📺 0.1 kW', '100 W') + op(126, 66, '×') + box(138, 20, 64, '5 h', 'time') + op(214, 66, '×') + box(226, 20, 64, '30p', 'per kWh') + op(302, 66, '=') + box(314, 20, 76, pence(val), 'cost', 'ans');
          s += '<text x="200" y="150" text-anchor="middle" class="ph-note">cost = kW × hours × price</text>';
          lab = 'TV 100 watts on for 5 hours at 30p per kilowatt-hour. Your answer: ' + pence(val) + '.';
        } else if (R.calc === 'bulbs') {
          s = '<circle cx="100" cy="62" r="40" class="ph-glow"/><circle cx="300" cy="62" r="40" class="ph-glow"/>' +
            '<text x="100" y="80" text-anchor="middle" class="ph-bulb">💡</text><text x="300" y="80" text-anchor="middle" class="ph-bulb">💡</text>' +
            '<text x="100" y="134" text-anchor="middle" class="ph-name2">Filament: 100 W</text><text x="300" y="134" text-anchor="middle" class="ph-name2">LED: 10 W</text>' +
            '<text x="100" y="160" text-anchor="middle" class="ph-small">hot to touch 🔥</text><text x="300" y="160" text-anchor="middle" class="ph-small">stays cool</text>' +
            (show ? '<text x="100" y="186" text-anchor="middle" class="ph-name2">1 kWh = 30p</text><text x="300" y="186" text-anchor="middle" class="ph-name2">0.1 kWh = 3p</text>' : '');
          lab = 'A 100 watt filament bulb and a 10 watt LED bulb, each on for 10 hours.';
        } else {
          [['Monday', '04518', 16], ['Sunday', '04560', 108]].forEach(function (m) {
            s += '<text x="16" y="' + (m[2] + 40) + '" class="ph-name2">' + m[0] + '</text><rect x="110" y="' + m[2] + '" width="270" height="64" rx="12" class="ph-meter"/>';
            m[1].split('').forEach(function (d, k) { s += '<rect x="' + (116 + k * 38) + '" y="' + (m[2] + 12) + '" width="34" height="40" rx="6" class="ph-dig"/><text x="' + (133 + k * 38) + '" y="' + (m[2] + 42) + '" text-anchor="middle" class="ph-digt">' + d + '</text>'; });
            s += '<text x="324" y="' + (m[2] + 40) + '" class="ph-kwh">kWh</text>';
          });
          lab = 'Electricity meter: Monday 04518 kilowatt-hours, Sunday 04560 kilowatt-hours.';
        }
        svg.innerHTML = s;
        svg.setAttribute('aria-label', lab);
        out.innerHTML = R.dial ? 'Your answer: <b>' + (R.unit === 'p' ? pence(val) : val + R.unit) + '</b>' : '';
        var v = stage.querySelector('.ph-val'); if (v) v.textContent = R.unit === 'p' ? pence(val) : val + R.unit;
      }
      function draw() { if (R.view === 'house') house(); else calc(); }

      if (R.view === 'house') {
        svg.addEventListener('click', function (ev) {
          var g = ev.target.closest('.ph-app'); if (!g || (R.toggle && stage.classList.contains('locked'))) return;
          var k = g.getAttribute('data-k'); on[k] = !on[k]; draw();
          var n = svg.querySelector('[data-k="' + k + '"]'); if (n && ev.detail === 0) n.focus();
        });
        svg.addEventListener('keydown', function (ev) { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest('.ph-app')) { ev.preventDefault(); ev.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
      }
      stage.querySelectorAll('[data-d]').forEach(function (b) {
        b.addEventListener('click', function () { val = Math.max(0, Math.min(R.max, val + +b.getAttribute('data-d'))); draw(); });
      });
      var doneBtn = stage.querySelector('[data-done]');
      if (doneBtn) doneBtn.addEventListener('click', function () {
        if (stage.classList.contains('locked')) return;
        if (R.toggle) {
          var l = onList();
          ui.check(R.ok(l, total()), { hint: R.hint(l), why: R.why, reveal: function () { on = {}; R.reveal.forEach(function (k) { on[k] = true; }); } });
        } else {
          ui.check(val === R.ans, { hint: R.hint(val), why: R.why, reveal: function () { val = R.ans; } });
        }
        if (stage.classList.contains('locked')) solved = true;
        draw();
      });
      if (R.q) {
        var opts = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { opts.children[R.ans].classList.add('right'); } });
            if (stage.classList.contains('locked')) { solved = true; draw(); }
          });
          opts.appendChild(b);
        });
      }
      draw();
    }
  });
})();
