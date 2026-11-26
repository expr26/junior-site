/* Pizza Fractions: an animal orders a fraction of a pizza; the child taps slices to add toppings, then serves.
   Rounds 1-4: the pizza is cut into as many slices as the bottom number.
   Rounds 5-6: more slices than that, so the child makes an equivalent fraction (e.g. 4/8 for 1/2).
   Rounds 7-8: the child chooses how to cut the pizza; only one choice works.
   Right when toppings / slices equals the order (sel * den === num * cut). */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  // [top, bottom, slices] ; slices is an array when the child picks the cut
  var ROUNDS = [
    [1, 2, 2], [1, 4, 4], [3, 4, 4], [2, 3, 3],
    [1, 2, 8], [3, 4, 8],
    [1, 3, [4, 6, 8]], [3, 4, [3, 6, 8]]
  ];
  var FOLK = [['🐻', 'Bear'], ['🦊', 'Fox'], ['🐼', 'Panda'], ['🐸', 'Frog'], ['🐰', 'Rabbit'], ['🐯', 'Tiger'], ['🐨', 'Koala'], ['🐷', 'Pig']];

  function fr(n, d) { return '<span class="fr"><span>' + n + '</span><span>' + d + '</span></span>'; }

  var CX = 110, CY = 110, R = 96;
  function pt(deg, r) { var a = deg * Math.PI / 180; return [CX + r * Math.cos(a), CY + r * Math.sin(a)]; }
  function wedge(k, n) {
    var a0 = -90 + 360 * k / n, a1 = a0 + 360 / n, p0 = pt(a0, R), p1 = pt(a1, R);
    return 'M' + CX + ' ' + CY + ' L' + p0[0].toFixed(2) + ' ' + p0[1].toFixed(2) + ' A' + R + ' ' + R + ' 0 0 1 ' + p1[0].toFixed(2) + ' ' + p1[1].toFixed(2) + ' Z';
  }

  Arcade.game({
    intro: 'Welcome to the Pizza Café! Hungry animals will order a fraction of a pizza. Tap the slices to add toppings, then serve.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var r = ROUNDS[i], num = r[0], den = r[1], choose = Array.isArray(r[2]);
      var cut = choose ? 0 : r[2], on = [];
      var who = FOLK[i % FOLK.length];

      stage.innerHTML = '<p class="q-num">Order ' + (i + 1) + '</p>' +
        '<div class="pz-order"><span class="pz-who" aria-hidden="true">' + who[0] + '</span>' +
        '<p class="q-text">' + who[1] + ' would like ' + fr(num, den) + ' of a pizza, please!</p></div>' +
        (choose ? '<div class="pz-cuts" role="group" aria-label="How many slices?"><span>Cut into:</span></div>' : '') +
        '<div class="pz-board"><svg class="pizza" viewBox="0 0 220 220" role="group" aria-label="Pizza"></svg>' +
        '<p class="pz-count" aria-live="polite"></p></div>' +
        '<p class="actions pz-actions"><button class="btn" type="button" data-serve>Serve 🍕</button>' +
        '<button class="btn ghost" type="button" data-clear>Clear toppings</button></p>';
      var svg = stage.querySelector('svg'), count = stage.querySelector('.pz-count');

      if (choose) {
        ui.owl('This time <b>you</b> cut the pizza. Which number of slices lets you make ' + fr(num, den) + ' exactly?');
        var cuts = stage.querySelector('.pz-cuts');
        r[2].forEach(function (n) {
          var b = h('button', 'opt pz-cut', n + ' slices'); b.type = 'button';
          b.addEventListener('click', function () {
            cuts.querySelectorAll('.pz-cut').forEach(function (x) { x.classList.toggle('picked', x === b); x.setAttribute('aria-pressed', x === b); });
            cut = n; on = []; draw();
          });
          cuts.appendChild(b);
        });
      } else if (cut === den) {
        ui.owl('The pizza is cut into ' + den + ' equal slices. How many slices make ' + fr(num, den) + '?');
      } else {
        ui.owl('Tricky! This pizza has ' + cut + ' slices, not ' + den + '. How many slices make ' + fr(num, den) + '?');
      }

      function draw() {
        if (!cut) { svg.innerHTML = '<circle cx="110" cy="110" r="100" class="pz-crust"/><circle cx="110" cy="110" r="' + R + '" class="pz-dough"/>'; count.textContent = 'Choose how to cut the pizza first.'; return; }
        var s = '<circle cx="110" cy="110" r="104" class="pz-crust"/>';
        for (var k = 0; k < cut; k++) {
          var mid = -90 + 360 * (k + .5) / cut, sel = on.indexOf(k) >= 0;
          s += '<g class="pz-slice' + (sel ? ' on' : '') + '" data-k="' + k + '" tabindex="0" role="button" aria-pressed="' + sel + '" aria-label="Slice ' + (k + 1) + '">' +
            '<path d="' + wedge(k, cut) + '"/>';
          if (sel) {
            var p = pt(mid, R * .62); s += '<circle class="pz-pep" cx="' + p[0].toFixed(1) + '" cy="' + p[1].toFixed(1) + '" r="' + (cut > 6 ? 8 : 11) + '"/>';
            if (cut <= 4) { var q = pt(mid + 360 / cut / 4, R * .3); s += '<circle class="pz-pep" cx="' + q[0].toFixed(1) + '" cy="' + q[1].toFixed(1) + '" r="8"/>'; }
            var l = pt(mid - 360 / cut / 5, R * .85); s += '<circle class="pz-leaf" cx="' + l[0].toFixed(1) + '" cy="' + l[1].toFixed(1) + '" r="4"/>';
          }
          s += '</g>';
        }
        svg.innerHTML = s;
        count.innerHTML = 'Toppings on <b>' + on.length + '</b> of <b>' + cut + '</b> slices' + (on.length ? ' = ' + fr(on.length, cut) : '');
      }

      function toggle(k) {
        if (stage.classList.contains('locked')) return;
        var at = on.indexOf(k); if (at >= 0) on.splice(at, 1); else on.push(k);
        draw();
        var g = svg.querySelector('[data-k="' + k + '"]'); if (g) g.focus({ preventScroll: true });
      }
      svg.addEventListener('click', function (e) { var g = e.target.closest('.pz-slice'); if (g) toggle(+g.getAttribute('data-k')); });
      svg.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        var g = e.target.closest('.pz-slice'); if (g) { e.preventDefault(); toggle(+g.getAttribute('data-k')); }
      });
      stage.querySelector('[data-clear]').addEventListener('click', function () { on = []; draw(); });

      function good() { return cut ? cut / den : 0; }   // slices in one 1/den part, when it is a whole number
      var answerCut = choose ? r[2].filter(function (n) { return n % den === 0; })[0] : cut;

      stage.querySelector('[data-serve]').addEventListener('click', function () {
        if (!cut) { ui.owl('First choose how many slices to cut the pizza into.'); return; }
        var ok = on.length * den === num * cut, hint;
        if (cut % den !== 0) {
          hint = cut + ' slices can\'t be shared into ' + den + ' equal parts. Try cutting the pizza a different way: you need a number that ' + den + ' goes into.';
        } else {
          var per = good(), want = num * per;
          hint = (cut === den ? '' : 'With ' + cut + ' slices, each ' + fr(1, den) + ' is ' + per + ' slice' + (per > 1 ? 's' : '') + '. ') +
            fr(num, den) + ' means ' + num + ' of those parts, so ' + (on.length > want ? 'that\'s too much pizza!' : 'add a little more!');
        }
        var extra = cut !== den && ok ? fr(on.length, cut) + ' is the same amount as ' + fr(num, den) + '. They are <b>equivalent fractions</b>.' : '';
        ui.check(ok, {
          hint: hint,
          why: extra || (fr(num, den) + ' means ' + num + ' out of ' + den + ' equal parts.'),
          reveal: function () {
            if (choose) {
              cut = answerCut;
              stage.querySelectorAll('.pz-cut').forEach(function (x) { x.classList.toggle('picked', x.textContent === cut + ' slices'); });
            }
            on = []; for (var k = 0; k < num * cut / den; k++) on.push(k);
            draw();
          }
        });
        if (stage.classList.contains('locked')) svg.querySelectorAll('.pz-slice').forEach(function (g) { g.removeAttribute('tabindex'); });
      });

      draw();
    }
  });
})();
