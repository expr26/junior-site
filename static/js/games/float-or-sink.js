/* Float or Sink: density with easy numbers.
   density = mass ÷ volume (g/cm³). The tank holds water with density 1 g/cm³.
   An object floats if its density is less than the liquid's, and sinks if it is more.
   A floating block sits with (its density ÷ 1) of its height under water (e.g. 0.5 g/cm³: half under).
   Cutting a block of one material in half halves the mass AND the volume, so the density stays the same.
   Volume of a cube = side × side × side. Cooking oil (about 0.9 g/cm³) floats on water and does not mix with it.
   Answers by hand: 50÷20 = 2.5 (sinks); 30÷60 = 0.5 (floats); 45÷50 = 0.9 (floats); 3×3×3 = 27 cm³, 54÷27 = 2 (sinks);
   240÷400 = 0.6 and 120÷200 = 0.6; A 20÷40 = 0.5 floats, B 80÷10 = 8 sinks, C 45÷50 = 0.9 floats, D 30÷20 = 1.5 sinks.
   Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';
  var CM3 = 'cm³', GCM3 = 'g/cm³';

  var ROUNDS = [
    { type: 'calc', b: { e: '🪨', name: 'Pebble', m: 50, v: 20, c: 'rock' },
      task: 'Work out the <b>density</b> of this pebble, then press <b>Check</b> to drop it in.',
      hint: 'density = mass ÷ volume. How many 20s make 50?' },
    { type: 'pred', b: { e: '🪵', name: 'Wooden block', m: 30, v: 60, c: 'wood' },
      task: 'Will this wooden block <b>float</b> or <b>sink</b> in water? Work out its density first.',
      hint: '30 ÷ 60 is less than 1. Is that more or less dense than water (1 ' + GCM3 + ')?' },
    { type: 'calc', b: { e: '🕯️', name: 'Candle wax', m: 45, v: 50, c: 'wax' },
      task: 'Work out the density of this lump of <b>candle wax</b>, then press <b>Check</b>.',
      hint: 'The mass is smaller than the volume, so the answer is less than 1. What is 45 ÷ 50? (Think: 90 ÷ 100.)' },
    { type: 'cube', side: 3, m: 54,
      task: 'Each side of this cube is <b>3 cm</b>. What is its <b>volume</b>?',
      hint: 'Volume of a cube = side × side × side. 3 × 3 is just one face: you need one more × 3.' },
    { type: 'cut', b: { e: '🪵', name: 'Wooden plank', m: 240, v: 400, c: 'wood' },
      q: 'This block is 240 g and 400 ' + CM3 + ', so its density is 0.6 ' + GCM3 + '. You saw it in half 🪚. What is the density of one half?',
      opts: ['0.6 ' + GCM3 + ': the same', '0.3 ' + GCM3 + ': half as much', '1.2 ' + GCM3 + ': twice as much'], ans: 0,
      hint: 'Each half has half the mass (120 g) AND half the volume (200 ' + CM3 + '). Work out 120 ÷ 200.',
      why: '120 ÷ 200 = 0.6 ' + GCM3 + '. The same material always has the same density, whatever its size, so both halves still float.' },
    { type: 'oil', q: 'You pour cooking oil (0.9 ' + GCM3 + ') into the tank of water (1 ' + GCM3 + '). Where does the oil end up?',
      opts: ['In a layer on top of the water', 'In a layer at the bottom', 'Mixed evenly into the water'], ans: 0,
      hint: 'Oil and water do not mix. The less dense liquid floats on the denser one.',
      why: 'Oil is less dense than water, so it floats on top in its own layer. Liquids that don\'t mix stack up, with the densest at the bottom.' },
    { type: 'sort', blocks: [{ k: 'A', m: 20, v: 40, c: 'cork' }, { k: 'B', m: 80, v: 10, c: 'steel' }, { k: 'C', m: 45, v: 50, c: 'plastic' }, { k: 'D', m: 30, v: 20, c: 'rubber' }],
      task: '<b>Tap every block that will float</b>, then press <b>Drop them in</b>.',
      hint: 'Work out mass ÷ volume for each block. Less than 1 ' + GCM3 + ' floats; more than 1 sinks. Watch out: a heavy block can still float!' },
    { type: 'parts', q: 'Look at the particles. Which sentence is right for most substances?',
      opts: ['Solids are usually densest; gases are much less dense than liquids', 'Gases are densest because their particles move fastest', 'All three states have the same density'], ans: 0,
      hint: 'Density is about how much mass is packed into each cm³. Where are the particles packed most closely?',
      why: 'Particles are packed closely in solids and liquids but far apart in a gas, so a gas is much less dense. Ice is a famous exception: it is a bit less dense than water, so it floats!' }
  ];

  var WATER = 150, FLOOR = 266, TL = 132, TR = 390;
  function f(v) { return (Math.round(v * 10) / 10).toString(); }
  function side(v) { return Math.round(12 * Math.cbrt(v)); }

  Arcade.game({
    intro: 'Welcome to the water lab! Work out the density of each block, then drop it in the tank to see if it floats or sinks.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], val = 0, dropped = false, pick = {}, oil = false, cut = false;
      var ctrl = '';
      if (R.type === 'calc' || R.type === 'cube') {
        var big = R.type === 'cube' ? 10 : 1, small = R.type === 'cube' ? 1 : 0.1;
        ctrl = '<div class="fs-ctrl"><button class="btn ghost" type="button" data-d="' + (-big) + '">−' + big + '</button><button class="btn ghost" type="button" data-d="' + (-small) + '">−' + small + '</button>' +
          '<b class="fs-val" aria-live="polite"></b><button class="btn ghost" type="button" data-d="' + small + '">+' + small + '</button><button class="btn ghost" type="button" data-d="' + big + '">+' + big + '</button></div>' +
          '<p class="actions fs-act"><button class="btn" type="button" data-check>Check ✓</button></p>';
      }
      if (R.type === 'pred') ctrl = '<p class="actions fs-act"><button class="btn" type="button" data-p="float">Float 🛟</button><button class="btn" type="button" data-p="sink">Sink ⚓</button></p>';
      if (R.type === 'sort') ctrl = '<div class="fs-cards">' + R.blocks.map(function (b) { return '<button class="opt fs-card" type="button" aria-pressed="false" data-k="' + b.k + '"><b>' + b.k + '</b> ' + b.m + ' g, ' + b.v + ' ' + CM3 + '</button>'; }).join('') + '</div>' +
        '<p class="actions fs-act"><button class="btn" type="button" data-drop>Drop them in 💦</button></p>';
      stage.innerHTML = '<p class="q-num">Lab test ' + (i + 1) + '</p><p class="q-text">' + (R.task || R.q) + '</p>' +
        '<svg class="fs-svg" viewBox="0 0 400 280" role="img"></svg><p class="fs-out" aria-live="polite"></p>' + ctrl + (R.q ? '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.fs-out');
      ui.owl(R.type === 'cube' ? 'Volume tells you how much space something takes up.' : R.type === 'parts' ? 'Same particles, packed differently.' :
        R.type === 'oil' ? 'Liquids have densities too!' : 'density = mass ÷ volume. Water is 1 ' + GCM3 + '. Less than 1 floats, more than 1 sinks.');
      function locked() { return stage.classList.contains('locked'); }

      function block(x, y, w, hgt, c, label, id) {
        return '<g class="fs-blk" id="' + id + '" style="transform:translate(' + x + 'px,' + y + 'px)"><rect width="' + w + '" height="' + hgt + '" rx="4" class="fs-b ' + c + '"/>' +
          (label ? '<text x="' + (w / 2) + '" y="' + (hgt / 2 + 6) + '" text-anchor="middle" class="fs-bl">' + label + '</text>' : '') + '</g>';
      }
      function rest(d, hgt) { return d < 1 ? WATER - hgt * (1 - d) : FLOOR - hgt; }

      function tank(withOil) {
        var s = '<rect x="' + TL + '" y="' + WATER + '" width="' + (TR - TL) + '" height="' + (FLOOR - WATER) + '" class="fs-water"/>';
        if (withOil) s += '<rect x="' + TL + '" y="' + (WATER - 26) + '" width="' + (TR - TL) + '" height="26" class="fs-oil"/><text x="' + (TR - 8) + '" y="' + (WATER - 8) + '" text-anchor="end" class="fs-tl">oil 0.9</text>';
        s += '<path d="M' + TL + ' 96 V' + FLOOR + ' H' + TR + ' V96" class="fs-glass"/>';
        s += '<text x="66" y="234" text-anchor="middle" class="fs-ct">💧 water</text><text x="66" y="254" text-anchor="middle" class="fs-cn">1 ' + GCM3 + '</text>';
        return s;
      }
      function card(b, m, v) {
        return '<g class="fs-card-s"><rect x="8" y="14" width="114" height="112" rx="12"/><text x="65" y="52" text-anchor="middle" class="fs-emo">' + b.e + '</text>' +
          '<text x="65" y="76" text-anchor="middle" class="fs-ct">' + b.name + '</text><text x="65" y="98" text-anchor="middle" class="fs-cn">' + m + ' g</text><text x="65" y="118" text-anchor="middle" class="fs-cn">' + v + ' ' + CM3 + '</text></g>';
      }

      function draw() {
        var s = '', label = '';
        if (R.type === 'calc' || R.type === 'pred') {
          var b = R.b, w = side(b.v), d = b.m / b.v, x = 261 - w / 2;
          s = tank() + card(b, b.m, b.v) + block(x, 10, w, w, b.c, '', 'fs-b0');
          label = b.name + ', ' + b.m + ' grams, ' + b.v + ' cubic centimetres.';
          svg.innerHTML = s;
          if (dropped) land('fs-b0', x, rest(d, w));
          out.innerHTML = dropped ? 'Density ' + f(d) + ' ' + GCM3 + ': it <b>' + (d < 1 ? 'floats 🛟' : 'sinks ⚓') + '</b>' + (d < 1 ? ' (' + Math.round(d * 100) + '% under water)' : '') : (R.type === 'calc' ? 'density = mass ÷ volume' : 'Will it float or sink? 🤔');
          if (dropped) label += d < 1 ? ' It floats.' : ' It sinks.';
        } else if (R.type === 'cube') {
          var u = 40, ox = 120, oy = 110, dx = 22, dy = -18, g = '';
          for (var a = 0; a <= 3; a++) {
            g += '<path d="M' + (ox + a * u) + ' ' + oy + ' V' + (oy + 3 * u) + ' M' + ox + ' ' + (oy + a * u) + ' H' + (ox + 3 * u) + '" class="fs-grid"/>';
            g += '<path d="M' + (ox + a * u) + ' ' + oy + ' l' + (3 * dx) + ' ' + (3 * dy) + ' M' + (ox + a * dx) + ' ' + (oy + a * dy) + ' h' + (3 * u) + '" class="fs-grid"/>';
            g += '<path d="M' + (ox + 3 * u) + ' ' + (oy + a * u) + ' l' + (3 * dx) + ' ' + (3 * dy) + ' M' + (ox + 3 * u + a * dx) + ' ' + (oy + a * dy) + ' v' + (3 * u) + '" class="fs-grid"/>';
          }
          s = '<path d="M' + ox + ' ' + oy + ' h120 v120 h-120 Z" class="fs-cf"/><path d="M' + ox + ' ' + oy + ' l66 -54 h120 l-66 54 Z" class="fs-ct2"/><path d="M' + (ox + 120) + ' ' + oy + ' l66 -54 v120 l-66 54 Z" class="fs-cr"/>' + g +
            '<text x="' + (ox + 60) + '" y="' + (oy + 146) + '" text-anchor="middle" class="fs-dim">3 cm</text>' +
            '<text x="' + (ox - 10) + '" y="' + (oy + 66) + '" text-anchor="end" class="fs-dim">3 cm</text>' +
            '<text x="' + (ox + 162) + '" y="' + (oy + 124) + '" class="fs-dim">3 cm</text>';
          if (dropped) s += '<text x="200" y="26" text-anchor="middle" class="fs-dim">54 g ÷ 27 ' + CM3 + ' = 2 ' + GCM3 + ' ⚓</text>';
          svg.innerHTML = s; label = 'A cube with sides of 3 centimetres, made of 27 small 1 centimetre cubes.';
          out.innerHTML = dropped ? 'Volume <b>27 ' + CM3 + '</b>. With a mass of 54 g, density = 2 ' + GCM3 + ', so it <b>sinks</b>.' : 'volume = side × side × side';
        } else if (R.type === 'cut') {
          var W = 88, H = 64, d2 = R.b.m / R.b.v;
          s = tank() + card({ e: '🪵', name: cut ? 'Each half' : R.b.name }, cut ? 120 : 240, cut ? 200 : 400);
          if (!cut) s += block(217, 18, W, H, 'wood', '0.6', 'fs-b0');
          else s += block(196, 18, W / 2, H, 'wood', '½', 'fs-b0') + block(282, 18, W / 2, H, 'wood', '½', 'fs-b1');
          svg.innerHTML = s;
          if (dropped) { land('fs-b0', 196, rest(d2, H)); land('fs-b1', 282, rest(d2, H)); }
          label = cut ? 'The plank sawn into two halves, each 120 grams and 200 cubic centimetres.' : 'A wooden plank, 240 grams and 400 cubic centimetres.';
          out.innerHTML = dropped ? 'Both halves: 0.6 ' + GCM3 + ', both <b>float 🛟</b>' : cut ? 'Sawn in half 🪚: 120 g and 200 ' + CM3 + ' each' : '';
        } else if (R.type === 'oil') {
          s = tank(oil) + '<text x="62" y="80" text-anchor="middle" class="fs-jug">🫗</text><text x="62" y="112" text-anchor="middle" class="fs-ct">cooking oil</text><text x="62" y="132" text-anchor="middle" class="fs-cn">0.9 ' + GCM3 + '</text>';
          if (oil) s += '<path d="M120 60 Q170 60 176 ' + (WATER - 26) + '" class="fs-pour"/>';
          svg.innerHTML = s; label = 'A tank of water and a jug of cooking oil.' + (oil ? ' The oil floats in a layer on top of the water.' : '');
          out.innerHTML = oil ? '🛢️ Oil on top, 💧 water underneath' : 'Oil 0.9 ' + GCM3 + ' · water 1 ' + GCM3;
        } else if (R.type === 'sort') {
          s = tank() + '<text x="66" y="60" text-anchor="middle" class="fs-ct">Mystery</text><text x="66" y="80" text-anchor="middle" class="fs-ct">blocks</text><text x="66" y="110" text-anchor="middle" class="fs-emo">🧪</text>';
          var X = [150, 212, 270, 334];
          R.blocks.forEach(function (b, j) { var w2 = side(b.v); s += block(X[j] + (44 - w2) / 2, 80 - w2, w2, w2, b.c + (pick[b.k] ? ' sel' : ''), b.k, 'fs-b' + j); });
          svg.innerHTML = s;
          if (dropped) R.blocks.forEach(function (b, j) { var w2 = side(b.v); land('fs-b' + j, X[j] + (44 - w2) / 2, rest(b.m / b.v, w2)); });
          label = 'Four blocks above the tank: ' + R.blocks.map(function (b) { return b.k + ' ' + b.m + ' grams ' + b.v + ' cubic centimetres'; }).join(', ') + '.';
          out.innerHTML = dropped ? R.blocks.map(function (b) { var d3 = b.m / b.v; return b.k + ': ' + f(d3) + (d3 < 1 ? ' 🛟' : ' ⚓'); }).join(' · ') : 'Tap the cards below to choose.';
        } else {
          var boxes = [['Solid', 16], ['Liquid', 146], ['Gas', 276]], dots = '';
          boxes.forEach(function (bx, j) {
            dots += '<rect x="' + bx[1] + '" y="40" width="108" height="150" rx="10" class="fs-pbox"/><text x="' + (bx[1] + 54) + '" y="218" text-anchor="middle" class="fs-ct">' + bx[0] + '</text>';
            var pts = [];
            if (j === 0) for (var r = 0; r < 6; r++) for (var c = 0; c < 4; c++) pts.push([bx[1] + 21 + c * 22, 70 + r * 22]);
            if (j === 1) [[20, 172], [42, 170], [64, 173], [86, 170], [26, 150], [49, 148], [72, 151], [94, 147], [18, 128], [40, 126], [63, 129], [86, 126], [32, 106], [56, 108], [79, 104], [100, 112], [48, 86], [72, 90]].forEach(function (p) { pts.push([bx[1] + p[0] - 4, p[1]]); });
            if (j === 2) [[22, 60], [84, 74], [50, 118], [90, 150], [26, 170], [70, 100]].forEach(function (p) { pts.push([bx[1] + p[0], p[1]]); });
            pts.forEach(function (p) { dots += '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="10" class="fs-pt s' + j + '"/>'; });
          });
          s = dots + '<text x="200" y="258" text-anchor="middle" class="fs-dim">Same-sized boxes</text>';
          svg.innerHTML = s; label = 'Particle pictures. Solid: particles packed closely in rows. Liquid: particles close together but jumbled. Gas: a few particles far apart.';
          out.innerHTML = 'Which box has the most mass packed in?';
        }
        svg.setAttribute('aria-label', label);
      }
      function land(id, x, y) {
        var g = svg.querySelector('#' + id); if (!g) return;
        if (still) { g.style.transform = 'translate(' + x + 'px,' + y + 'px)'; return; }
        requestAnimationFrame(function () { requestAnimationFrame(function () { g.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }); });
      }
      function drop() { dropped = true; draw(); }

      if (R.type === 'calc' || R.type === 'cube') {
        var vEl = stage.querySelector('.fs-val'), unit = R.type === 'cube' ? ' ' + CM3 : '';
        var show = function () { vEl.innerHTML = f(val) + '<small>' + (R.type === 'cube' ? CM3 : GCM3) + '</small>'; };
        stage.querySelectorAll('[data-d]').forEach(function (b) { b.addEventListener('click', function () { if (locked()) return; val = Math.max(0, Math.round((val + +b.getAttribute('data-d')) * 10) / 10); show(); }); });
        stage.querySelector('[data-check]').addEventListener('click', function () {
          if (locked()) return;
          var ans = R.type === 'cube' ? 27 : R.b.m / R.b.v, ok = Math.abs(val - ans) < 0.05, hint = R.hint;
          if (R.type === 'calc' && Math.abs(val - R.b.v / R.b.m) < 0.06) hint = 'You worked out volume ÷ mass. Swap them round: density = <b>mass ÷ volume</b>.';
          if (R.type === 'cube' && val === 9) hint = '9 ' + CM3 + ' is just one face (3 × 3). A cube has length, width <b>and</b> height: 3 × 3 × 3.';
          if (R.type === 'cube' && val === 18) hint = 'Not 3 × 6. Multiply all three sides: 3 × 3 × 3.';
          ui.check(ok, {
            hint: hint, reveal: function () { val = ans; show(); drop(); },
            why: R.type === 'cube' ? '3 × 3 × 3 = 27 ' + CM3 + '. You can count 27 little 1 cm cubes. With a mass of 54 g, its density is 54 ÷ 27 = 2 ' + GCM3 + ', so it sinks.' :
              R.b.m + ' ÷ ' + R.b.v + ' = ' + f(ans) + ' ' + GCM3 + '. That is ' + (ans < 1 ? 'less' : 'more') + ' than water (1 ' + GCM3 + '), so it ' + (ans < 1 ? 'floats.' : 'sinks.')
          });
          if (ok) drop();
        });
        show();
      }
      if (R.type === 'pred') {
        stage.querySelectorAll('[data-p]').forEach(function (b) {
          b.addEventListener('click', function () {
            if (locked()) return;
            var d = R.b.m / R.b.v, ok = (b.getAttribute('data-p') === 'float') === (d < 1);
            if (!ok) b.disabled = true;
            ui.check(ok, { hint: R.hint, reveal: drop, why: R.b.m + ' ÷ ' + R.b.v + ' = ' + f(d) + ' ' + GCM3 + '. That is less than water\'s 1 ' + GCM3 + ', so it floats, with ' + Math.round(d * 100) + '% of it under water.' });
            if (ok) drop();
          });
        });
      }
      if (R.type === 'sort') {
        stage.querySelectorAll('.fs-card').forEach(function (c) {
          c.addEventListener('click', function () { if (locked()) return; var k = c.getAttribute('data-k'); pick[k] = !pick[k]; c.setAttribute('aria-pressed', pick[k] ? 'true' : 'false'); c.classList.toggle('on', !!pick[k]); draw(); });
        });
        stage.querySelector('[data-drop]').addEventListener('click', function () {
          if (locked()) return;
          var ok = R.blocks.every(function (b) { return !!pick[b.k] === (b.m / b.v < 1); }), heavy = pick.B || pick.D, missC = !pick.C;
          var hint = R.hint;
          if (missC && !heavy) hint = 'Close! Check C again: 45 ÷ 50. Is that less than 1? It is heavier than A, but heavy things can still float.';
          ui.check(ok, {
            hint: hint, reveal: function () { R.blocks.forEach(function (b) { pick[b.k] = b.m / b.v < 1; }); drop(); },
            why: 'A: 20 ÷ 40 = 0.5 and C: 45 ÷ 50 = 0.9 float. B: 80 ÷ 10 = 8 and D: 30 ÷ 20 = 1.5 sink. It is density that matters, not mass.'
          });
          if (ok) drop();
        });
      }
      if (R.q) {
        if (R.type === 'cut') cut = true;
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            if (locked()) { if (R.type === 'cut') drop(); if (R.type === 'oil') { oil = true; draw(); } }
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
