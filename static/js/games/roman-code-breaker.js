/* Roman Code Breaker: crack a Roman vault by reading and building Roman numerals.
   Read rounds: tap the number that matches. Build rounds: tap symbol tiles to build a number (Start again to clear).
   Every answer is checked against toRoman() below (standard subtractive form: IV, IX, XL, XC, CD, CM). */
(function () {
  if (!window.Arcade) return;
  function toRoman(n) {
    var out = '', T = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']];
    T.forEach(function (t) { while (n >= t[0]) { out += t[1]; n -= t[0]; } });
    return out;
  }
  var R = [
    { read: 'XII', opts: [12, 21, 11, 7], hint: 'X is 10. Then add the Is.' },
    { read: 'XIV', opts: [14, 16, 9, 41], hint: 'Split it: X and IV. IV is one less than five.' },
    { read: 'XL', opts: [40, 60, 10, 50], hint: 'X before L means take 10 away from 50.' },
    { build: 8, tiles: ['I', 'V', 'X'], hint: '8 is 5 and 3 more.' },
    { build: 19, tiles: ['I', 'V', 'X'], hint: '19 is 10 + 9. How do you write 9?' },
    { read: 'XCIX', opts: [99, 101, 89, 109], hint: 'Split it: XC and IX.' },
    { build: 46, tiles: ['I', 'V', 'X', 'L'], hint: '46 is 40 + 6. 40 is X before L.' },
    { read: 'MMXXVI', opts: [2026, 2016, 2024, 1026], hint: 'MM is 2000. Then XX, then VI.' }
  ];
  Arcade.game({
    intro: 'The treasure vault has a Roman lock! Read and build Roman numerals to crack all 8 codes. Remember: I 1, V 5, X 10, L 50, C 100, D 500, M 1000.',
    rounds: R.length,
    round: function (i, ui, stage) {
      var r = R[i];
      if (r.read) {
        stage.innerHTML = '<p class="q-num">Code ' + (i + 1) + '</p><p class="rc-code">' + r.read + '</p><p class="q-text">What number is this?</p><div class="q-options"></div>';
        ui.owl(i === 0 ? 'Biggest symbols come first. Add them up.' : 'Look for a small symbol before a bigger one: that one is taken away.');
        var box = stage.querySelector('.q-options'), right;
        r.opts.forEach(function (v, k) {
          var b = Arcade.h('button', 'opt', String(v)); b.type = 'button'; if (k === 0) right = b;
          b.addEventListener('click', function () {
            var ok = k === 0; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) b.disabled = true;
            ui.check(ok, { hint: r.hint, why: r.read + ' = ' + r.opts[0] + '.', reveal: function () { right.classList.add('right'); } });
          });
          box.appendChild(b);
        });
        for (var n = box.children.length; n > 1; n--) box.appendChild(box.children[Math.floor(Math.random() * n)]);
        return;
      }
      var want = toRoman(r.build), got = '';
      stage.innerHTML = '<p class="q-num">Code ' + (i + 1) + '</p><p class="q-text">Build <b>' + r.build + '</b> in Roman numerals.</p>' +
        '<p class="rc-code rc-built" aria-live="polite">&nbsp;</p><div class="rc-tiles"></div>' +
        '<p class="actions"><button class="btn ghost" type="button" data-undo>Start again</button> <button class="btn" type="button" data-check>Check ✓</button></p>';
      ui.owl('Tap the tiles in order, biggest first. Watch out for 4s and 9s.');
      var out = stage.querySelector('.rc-built'), tiles = stage.querySelector('.rc-tiles');
      function draw() { out.textContent = got || ' '; }
      r.tiles.forEach(function (t) {
        var b = Arcade.h('button', 'btn ghost rc-tile', t); b.type = 'button';
        b.addEventListener('click', function () { if (!stage.classList.contains('locked') && got.length < 12) { got += t; draw(); } });
        tiles.appendChild(b);
      });
      stage.querySelector('[data-undo]').addEventListener('click', function () { if (!stage.classList.contains('locked')) { got = ''; draw(); } });
      stage.querySelector('[data-check]').addEventListener('click', function () {
        if (!got) return;
        ui.check(got === want, { hint: r.hint + ' Press Start again to try again.', why: r.build + ' = ' + want + '.', reveal: function () { got = want; draw(); } });
      });
    }
  });
})();
