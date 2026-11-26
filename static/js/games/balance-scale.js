/* Balance the Scale: a balanced scale holds mystery boxes (x) and 1 kg weights.
   The child can take the same thing off both sides (the scale stays balanced), then tries a value for x.
   Trying a value puts that number into every box: the right value keeps the scale level, a wrong one tips it.
   Every equation has one whole-number answer; check them by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  // a x + b = c x + d, answer x
  var ROUNDS = [
    [1, 3, 0, 7, 4], [1, 5, 0, 12, 7], [2, 0, 0, 10, 5], [2, 1, 0, 9, 4],
    [3, 2, 0, 14, 4], [2, 3, 1, 8, 5], [3, 1, 1, 9, 4], [4, 2, 2, 12, 5]
  ];
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';

  function side(x, n) {
    var parts = [];
    if (x) parts.push((x === 1 ? '' : x) + '<i>x</i>');
    if (n || !x) parts.push(n);
    return parts.join(' + ');
  }

  Arcade.game({
    intro: 'Each mystery box <b>x</b> weighs the same. The scale is balanced. Can you find out what <b>x</b> is?',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], ans = R[4];
      var L = { x: R[0], n: R[1] }, Rt = { x: R[2], n: R[3] }, guess = null, angle = 0;

      stage.innerHTML = '<p class="q-num">Scale ' + (i + 1) + '</p>' +
        '<p class="q-text bs-eq" aria-live="polite"></p>' +
        '<svg class="bs-svg" viewBox="0 0 360 250" role="img"></svg>' +
        '<div class="bs-tools" role="group" aria-label="Do the same to both sides">' +
        '<button class="opt" type="button" data-take="n">Take 1 kg off both sides</button>' +
        '<button class="opt" type="button" data-take="x">Take 1 box off both sides</button>' +
        '<button class="btn ghost" type="button" data-reset>Start again</button></div>' +
        '<form class="q-num-form bs-try"><label for="bs-x"><b><i>x</i> =</b></label>' +
        '<input id="bs-x" type="number" inputmode="numeric" min="0" max="99" step="1" autocomplete="off">' +
        '<button class="btn" type="submit">Try it ⚖️</button></form>';
      var svg = stage.querySelector('svg'), eq = stage.querySelector('.bs-eq'), inp = stage.querySelector('input');

      ui.owl(i === 0 ? 'Tip: take 1 kg off both sides until the box is on its own. The scale stays balanced!' :
        R[2] ? 'Boxes on both sides! Take boxes off both sides first, then the weights.' :
        R[0] > 1 ? 'Take the weights away first. Then share what\'s left between the boxes.' : 'Make the box lonely: take away the same from both sides.');

      function weight(sd) { return sd.x * (guess == null ? ans : guess) + sd.n; }

      function pile(sd, cx, base) {   // boxes in rows of 3 on the pan, 1 kg blocks in rows of 6 on top
        var s = '', y = base, k, n, w, x0;
        for (k = 0; k < sd.x; k += 3) {
          n = Math.min(3, sd.x - k); x0 = cx - n * 32 / 2;
          for (w = 0; w < n; w++) s += '<g class="bs-box"><rect x="' + (x0 + w * 32) + '" y="' + (y - 30) + '" width="30" height="30" rx="5"/>' +
            '<text x="' + (x0 + w * 32 + 15) + '" y="' + (y - 9) + '" text-anchor="middle">' + (guess == null ? 'x' : guess) + '</text></g>';
          y -= 32;
        }
        for (k = 0; k < sd.n; k += 6) {
          n = Math.min(6, sd.n - k); x0 = cx - n * 18 / 2;
          for (w = 0; w < n; w++) s += '<rect class="bs-kg" x="' + (x0 + w * 18) + '" y="' + (y - 16) + '" width="16" height="16" rx="3"/>';
          y -= 18;
        }
        return s;
      }

      function draw() {
        var a = angle * Math.PI / 180, ax = 115 * Math.cos(a), ay = 115 * Math.sin(a);
        var lx = 180 - ax, ly = 70 - ay, rx = 180 + ax, ry = 70 + ay, drop = 110;
        var s = '<path class="bs-stand" d="M180 70 L150 238 H210 Z"/><rect class="bs-stand" x="120" y="234" width="120" height="10" rx="5"/>' +
          '<line class="bs-beam" x1="' + lx + '" y1="' + ly + '" x2="' + rx + '" y2="' + ry + '"/><circle class="bs-pivot" cx="180" cy="70" r="9"/>';
        [[lx, ly, L], [rx, ry, Rt]].forEach(function (p) {
          var px = p[0], py = p[1] + drop;
          s += '<line class="bs-string" x1="' + px + '" y1="' + p[1] + '" x2="' + (px - 48) + '" y2="' + py + '"/>' +
            '<line class="bs-string" x1="' + px + '" y1="' + p[1] + '" x2="' + (px + 48) + '" y2="' + py + '"/>' +
            '<path class="bs-pan" d="M' + (px - 58) + ' ' + py + ' H' + (px + 58) + ' Q' + px + ' ' + (py + 22) + ' ' + (px - 58) + ' ' + py + ' Z"/>' +
            pile(p[2], px, py);
        });
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Scale: left side ' + L.x + ' boxes and ' + L.n + ' kilograms, right side ' + Rt.x + ' boxes and ' + Rt.n + ' kilograms.' +
          (angle === 0 ? ' It is balanced.' : angle < 0 ? ' The left side is down.' : ' The right side is down.'));
        eq.innerHTML = side(L.x, L.n) + ' = ' + side(Rt.x, Rt.n);
        stage.querySelector('[data-take="n"]').disabled = !(L.n && Rt.n) || stage.classList.contains('locked');
        stage.querySelector('[data-take="x"]').disabled = !(L.x && Rt.x) || stage.classList.contains('locked');
      }

      function tiltTo(target) {   // left side heavier -> left pan goes down (negative angle)
        if (still) { angle = target; draw(); return; }
        var from = angle, t0 = performance.now();
        (function step(t) {
          var p = Math.min(1, (t - t0) / 600), e = 1 - Math.pow(1 - p, 3);
          angle = from + (target - from) * e; draw();
          if (p < 1) requestAnimationFrame(step); else { angle = target; draw(); }
        })(t0);
      }

      stage.querySelectorAll('[data-take]').forEach(function (b) {
        b.addEventListener('click', function () {
          var k = b.getAttribute('data-take');
          if (L[k] && Rt[k]) { L[k]--; Rt[k]--; guess = null; angle = 0; draw(); }
          if (L.x && !Rt.x && !L.n && L.x === 1) ui.owl('The box is on its own! So <b>x</b> = ' + Rt.n + '... or is it? Try it and see.');
          else if (!L.n && !Rt.x && L.x > 1) ui.owl(L.x + ' boxes weigh ' + Rt.n + ' kg. Share ' + Rt.n + ' kg equally between ' + L.x + ' boxes.');
        });
      });
      stage.querySelector('[data-reset]').addEventListener('click', function () {
        L = { x: R[0], n: R[1] }; Rt = { x: R[2], n: R[3] }; guess = null; angle = 0; draw();
      });

      stage.querySelector('form').addEventListener('submit', function (ev) {
        ev.preventDefault();
        if (stage.classList.contains('locked')) return;
        var g = inp.value.trim();
        if (!/^\d+$/.test(g)) { ui.owl('Type a whole number for <b>x</b>, then press Try it.'); inp.focus(); return; }
        guess = +g;
        var diff = weight(L) - weight(Rt);
        tiltTo(diff === 0 ? 0 : (diff > 0 ? -1 : 1) * Math.min(16, 8 + Math.abs(diff) * 2));
        var heavier = diff > 0 ? 'left' : 'right', moreX = L.x > Rt.x ? 'left' : 'right';
        var hint = 'With <i>x</i> = ' + guess + ' the ' + heavier + ' side goes down, so it\'s too heavy. ' +
          (heavier === moreX ? 'That side has more boxes, so try a <b>smaller</b> x.' : 'That side has fewer boxes, so try a <b>bigger</b> x.');
        var why = 'Check: put ' + ans + ' in every box. Left: ' + (R[0] * ans + R[1]) + ' kg, right: ' + (R[2] * ans + R[3]) + ' kg. Balanced!';
        ui.check(diff === 0, {
          hint: hint, why: why,
          reveal: function () { inp.value = ans; guess = ans; tiltTo(0); }
        });
        if (stage.classList.contains('locked')) { inp.disabled = true; draw(); }
        else { inp.select(); }
      });

      draw();
    }
  });
})();
