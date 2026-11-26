/* Smoothie Mixer: make smoothies with fruit in a given ratio. One scoop of fruit is one part; the cup holds up to 12 scoops.
   Rules used (all worked out by hand):
     R1  strawberry : banana = 2 : 3. Any equivalent ratio counts (2 : 3, 4 : 6, 6 : 9 all taste the same).  (trap: 3 : 2, reversed)
     R2  2 : 3 has 2 + 3 = 5 parts, so strawberry is 2/5 of the smoothie.                       (traps: 2/3, 3/5)
     R3  2 : 1 scaled up to 6 strawberries: × 3, so 6 : 3.                                     (trap: 6 : 5, adding 4 to both)
     R4  8 : 4 simplified: divide both by 4 (the highest common factor), so 2 : 1.             (trap: 4 : 2, equivalent but not simplest)
     R5  12 scoops shared 1 : 3: 4 parts, 12 ÷ 4 = 3 per part, so 3 and 9.                     (trap: 4 and 8, from 12 ÷ 3)
     R6  3 smoothies cost £6, so 1 costs £2 and 5 cost £10 (direct proportion).                (trap: £8, adding £2)
     R7  12 scoops shared 1 : 2 : 1: 4 parts, 3 per part, so 3, 6 and 3.
     R8  3 : 2 is the same as 6 : 4 (both × 2). 4 : 3 adds 1 to each part, which changes the ratio.
   Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';
  var CAP = 12;

  var F = {
    s: { e: '🍓', name: 'Strawberry', c: '#F0525A' },
    b: { e: '🍌', name: 'Banana', c: '#FFE066' },
    k: { e: '🥝', name: 'Kiwi', c: '#86CF4F' },
    u: { e: '🫐', name: 'Blueberry', c: '#6A72E8' },
    m: { e: '🥭', name: 'Mango', c: '#FFA62B' },
    o: { e: '🍊', name: 'Orange', c: '#FF7A1A' }
  };

  var ROUNDS = [
    { fruits: ['s', 'b'], start: [0, 0], show: [2, 3],
      text: 'Make a smoothie with strawberry and banana in the ratio <b>2 : 3</b> (strawberry : banana).',
      ok: function (c) { return c[0] > 0 && c[0] * 3 === c[1] * 2; },
      hint: function (c) { return c[1] > 0 && c[0] * 2 === c[1] * 3 ? 'Order matters! The ratio says strawberry first: 2 strawberry for every 3 banana.' : 'For every 2 scoops of strawberry you need 3 scoops of banana.'; },
      why: 'Strawberry : banana = 2 : 3 means 2 scoops of strawberry for every 3 of banana. (4 : 6 or 6 : 9 would taste exactly the same!)' },
    { fruits: ['s', 'b'], fixed: [2, 3], q: 'This smoothie is strawberry : banana = <b>2 : 3</b>. What fraction of the smoothie is strawberry?',
      opts: ['2/5', '2/3', '3/5'], ans: 0,
      hint: 'A fraction of the whole needs the total. Count all the scoops in the cup first: 2 + 3 = ?',
      why: 'There are 2 + 3 = 5 parts altogether and 2 of them are strawberry, so 2/5 of the smoothie is strawberry.' },
    { fruits: ['s', 'b'], start: [0, 0], show: [6, 3],
      text: 'The recipe is strawberry : banana = <b>2 : 1</b>. Make a bigger smoothie that uses <b>6 scoops of strawberry</b>.',
      ok: function (c) { return c[0] === 6 && c[1] === 3; },
      hint: function (c) { return c[0] === 6 && c[1] === 5 ? 'Ratios multiply, they don\'t add! 2 became 6 by multiplying by 3, so multiply the 1 by 3 too.' : c[0] !== 6 ? 'The question says 6 scoops of strawberry. Start there, then work out the banana.' : '2 × 3 = 6, so the recipe has been made 3 times bigger. Do the same to the banana.'; },
      why: '2 × 3 = 6 strawberry, so the banana is 1 × 3 = 3. The ratio 6 : 3 is the same as 2 : 1.' },
    { fruits: ['k', 'u'], start: [8, 4], show: [2, 1],
      text: 'This cup is kiwi : blueberry = <b>8 : 4</b>. Make the <b>smallest</b> smoothie that tastes exactly the same. (That\'s simplifying the ratio!)',
      ok: function (c) { return c[0] === 2 && c[1] === 1; },
      hint: function (c) { return c[1] > 1 && c[0] === 2 * c[1] ? 'Same taste, but it can be smaller! Divide both numbers by the biggest number that goes into both 8 and 4.' : 'Divide both 8 and 4 by the same number. Find the biggest number that goes into both.'; },
      why: '4 is the biggest number that goes into both 8 and 4. 8 ÷ 4 = 2 and 4 ÷ 4 = 1, so 8 : 4 = 2 : 1.' },
    { fruits: ['b', 'u'], start: [0, 0], show: [3, 9],
      text: 'Share <b>12 scoops</b> between banana and blueberry in the ratio <b>1 : 3</b>.',
      ok: function (c) { return c[0] === 3 && c[1] === 9; },
      hint: function (c) { return c[0] === 4 && c[1] === 8 ? 'The ratio 1 : 3 has 1 + 3 = 4 parts, not 3. So divide 12 by 4.' : c[0] + c[1] !== 12 ? 'You need exactly 12 scoops altogether. There are 1 + 3 = 4 parts: how many scoops is one part?' : 'Add the parts: 1 + 3 = 4. Then 12 ÷ 4 = 3 scoops in each part.'; },
      why: '1 + 3 = 4 parts. 12 ÷ 4 = 3 scoops per part, so banana gets 1 × 3 = 3 and blueberry gets 3 × 3 = 9.' },
    { price: true, q: '<b>3 smoothies cost £6.</b> All smoothies cost the same. How much do <b>5 smoothies</b> cost?', opts: ['£10', '£8', '£15', '£30'], ans: 0,
      hint: 'Find the cost of 1 smoothie first: £6 ÷ 3. (Adding £2 because you have 2 more smoothies doesn\'t work.)',
      why: '1 smoothie costs £6 ÷ 3 = £2, so 5 smoothies cost 5 × £2 = £10. The cost is in direct proportion to the number of smoothies.' },
    { fruits: ['m', 's', 'k'], start: [0, 0, 0], show: [3, 6, 3],
      text: 'Tropical Twist 🌴: mango : strawberry : kiwi = <b>1 : 2 : 1</b>. Make it with exactly <b>12 scoops</b>.',
      ok: function (c) { return c[0] === 3 && c[1] === 6 && c[2] === 3; },
      hint: function (c) { return c[0] + c[1] + c[2] !== 12 ? 'You need 12 scoops altogether. There are 1 + 2 + 1 = 4 parts: how many scoops is one part?' : 'Your total is right, but check the ratio. One part is 12 ÷ 4 = 3 scoops, and strawberry has 2 parts.'; },
      why: '1 + 2 + 1 = 4 parts, and 12 ÷ 4 = 3 scoops per part: mango 3, strawberry 2 × 3 = 6, kiwi 3.' },
    { fruits: ['o', 'u'], fixed: [3, 2], q: 'Mia\'s smoothie is orange : blueberry = <b>3 : 2</b>. Which smoothie tastes <b>exactly</b> the same?',
      opts: ['6 orange : 4 blueberry', '4 orange : 3 blueberry', '2 orange : 3 blueberry'], ans: 0,
      hint: 'To keep the same taste, multiply (or divide) both parts by the same number. Adding 1 to both parts changes the taste.',
      why: '3 : 2 with both parts multiplied by 2 is 6 : 4, so it tastes the same. 4 : 3 adds 1 to each part, which changes the ratio.' }
  ];

  // Cup: top edge y=30 from x=130 to 270, bottom y=240 from x=148 to 252. 12 scoop layers of 17.5 units.
  function cup(R, c) {
    var top = 30, bot = 240, lh = (bot - top) / CAP, s = '';
    s += '<defs><clipPath id="sm-clip"><path d="M130 30 L148 240 Q200 250 252 240 L270 30 Z"/></clipPath></defs>';
    s += '<line x1="236" y1="4" x2="214" y2="120" class="sm-straw"/>';
    s += '<g class="sm-cupg"><path d="M130 30 L148 240 Q200 250 252 240 L270 30 Z" class="sm-cupbg"/><g clip-path="url(#sm-clip)">';
    var n = 0;
    R.fruits.forEach(function (k, j) {
      for (var q = 0; q < c[j]; q++, n++) {
        var y = bot - (n + 1) * lh;
        s += '<rect x="120" y="' + y.toFixed(1) + '" width="160" height="' + (lh + 0.5).toFixed(1) + '" fill="' + F[k].c + '" class="sm-layer"/>' +
          '<text x="200" y="' + (y + lh - 3.5).toFixed(1) + '" text-anchor="middle" class="sm-le">' + F[k].e + '</text>';
      }
    });
    for (var t = 1; t < CAP; t++) s += '<line x1="120" y1="' + (bot - t * lh).toFixed(1) + '" x2="280" y2="' + (bot - t * lh).toFixed(1) + '" class="sm-tick"/>';
    s += '</g><path d="M130 30 L148 240 Q200 250 252 240 L270 30 Z" class="sm-cup"/></g>';
    s += '<text x="282" y="40" class="sm-cap">12</text><text x="282" y="140" class="sm-cap">6</text><text x="282" y="244" class="sm-cap">0</text>';
    var lx = 14, ly = 60;
    R.fruits.forEach(function (k, j) { s += '<text x="' + lx + '" y="' + (ly + j * 44) + '" class="sm-leg">' + F[k].e + ' ' + c[j] + '</text>'; });
    return s;
  }

  function ratioText(R, c) {
    var tot = c.reduce(function (a, b) { return a + b; }, 0);
    return R.fruits.map(function (k, j) { return c[j] + ' ' + F[k].e; }).join(' : ') + ' · ' + tot + ' scoop' + (tot === 1 ? '' : 's') + (tot === CAP ? ' (cup full!)' : '');
  }

  Arcade.game({
    intro: 'Welcome to the Smoothie Bar! Mix fruit in just the right ratio to make every smoothie taste perfect.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], c = R.fixed ? R.fixed.slice() : R.start ? R.start.slice() : null;
      var locked = function () { return stage.classList.contains('locked'); };
      var body = '<p class="q-num">Order ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q).replace(/(\d) : (?=\d)/g, '$1&nbsp;:&nbsp;') + '</p>';
      if (R.fruits) body += '<svg class="sm-svg" viewBox="0 0 400 260" role="img"></svg><p class="sm-out" aria-live="polite"></p>';
      if (R.price) body += '<div class="sm-price" aria-hidden="true"><p><span>🥤🥤🥤</span><b>£6</b></p><p><span>🥤🥤🥤🥤🥤</span><b>?</b></p></div>';
      if (R.ok) {
        body += '<div class="sm-ctrl">' + R.fruits.map(function (k, j) {
          return '<div class="sm-row"><span class="sm-name">' + F[k].e + ' ' + F[k].name + '</span><button class="btn ghost" type="button" data-f="' + j + '" data-d="-1" aria-label="One less ' + F[k].name.toLowerCase() + '">−</button>' +
            '<b class="sm-n" data-n="' + j + '"></b><button class="btn ghost" type="button" data-f="' + j + '" data-d="1" aria-label="One more ' + F[k].name.toLowerCase() + '">+</button></div>';
        }).join('') + '</div><p class="actions sm-act"><button class="btn" type="button" data-blend>Blend! 🌀</button></p>';
      } else body += '<div class="q-options"></div>';
      stage.innerHTML = body;
      var svg = stage.querySelector('.sm-svg'), out = stage.querySelector('.sm-out');
      ui.owl(R.price ? 'Find the cost of one first, then scale up.' : R.ok ? 'Each scoop is one part. Use + and − to add fruit to the cup.' : 'Look at the scoops in the cup.');

      function draw() {
        if (!svg) return;
        svg.innerHTML = cup(R, c);
        svg.setAttribute('aria-label', 'Smoothie cup holding ' + R.fruits.map(function (k, j) { return c[j] + ' ' + F[k].name.toLowerCase(); }).join(' and ') + ' scoops, out of 12.');
        out.innerHTML = ratioText(R, c);
        stage.querySelectorAll('[data-n]').forEach(function (b) { b.textContent = c[+b.getAttribute('data-n')]; });
      }
      function blendFx() {
        if (still) return;
        svg.classList.remove('blend'); void svg.getBoundingClientRect(); svg.classList.add('blend');
      }

      if (R.ok) {
        stage.querySelectorAll('[data-f]').forEach(function (b) { b.addEventListener('click', function () {
          if (locked()) return;
          var j = +b.getAttribute('data-f'), d = +b.getAttribute('data-d'), tot = c.reduce(function (x, y) { return x + y; }, 0);
          if (d > 0 && tot >= CAP) { out.innerHTML = 'The cup is full! Take some fruit out first. 🥤'; return; }
          c[j] = Math.max(0, c[j] + d); draw();
        }); });
        stage.querySelector('[data-blend]').addEventListener('click', function () {
          if (locked()) return;
          var ok = R.ok(c);
          if (ok) { blendFx(); out.innerHTML = ratioText(R, c) + ' · Yum! 😋'; } else out.innerHTML = ratioText(R, c) + ' · Hmm, that doesn\'t taste right. 🤔';
          ui.check(ok, { hint: R.hint(c), why: R.why, reveal: function () { c = R.show.slice(); draw(); out.innerHTML = ratioText(R, c) + ' ✅'; } });
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
