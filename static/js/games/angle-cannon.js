/* Angle Cannon: angles measured anticlockwise from the ground on the right (0° to 180°).
   The child turns a laser cannon with -5/-1/+1/+5 and fires at a balloon; some rounds use angle facts
   (angles on a straight line add to 180°, angles in a triangle add to 180°). Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  var ROUNDS = [
    { aim: 40, pro: true, text: 'Pop the balloon! Turn the cannon to the right angle and fire.', hint: 'Use the protractor numbers. Start from 0° on the right-hand ground.' },
    { aim: 70, pro: true, text: 'Another balloon, higher up. Aim and fire!', hint: 'Count up the protractor from 0° in tens: 10, 20, 30…' },
    { q: 'You just aimed at 70°. What type of angle is 70°?', opts: ['Acute (less than 90°)', 'Right angle (exactly 90°)', 'Obtuse (between 90° and 180°)'], ans: 0, show: 70,
      hint: 'Is 70° smaller or bigger than a right angle (90°)?', why: '70° is less than 90°, so it is an acute angle.' },
    { aim: 120, pro: true, text: 'This balloon is over on the left. Aim and fire!', hint: 'It is past the 90° (straight up) mark, so the angle is bigger than 90°.' },
    { aim: 145, pro: false, mark: 35, text: 'No protractor this time! The balloon is <b>35°</b> up from the ground on the <b>left</b>. What angle should the cannon be at?',
      hint: 'The ground is a straight line, and angles on a straight line add up to 180°. So 180° − 35° = ?', why: 'Angles on a straight line add up to 180°, so 180° − 35° = 145°.' },
    { aim: 60, pro: false, tol: 5, text: 'No protractor! Estimate the angle of this balloon and fire. (Within 5° counts as a hit.)',
      hint: 'Straight up is 90°. Halfway between flat and straight up is 45°. Is the balloon above or below that?', why: 'The balloon was at 60°: a bit more than halfway up to 90°.' },
    { q: 'Angles on a straight line add up to…', opts: ['90°', '180°', '360°'], ans: 1, show: 0,
      hint: 'A straight line is half of a full turn. A full turn is 360°.', why: 'A straight line is half a turn, so the angles on it add up to 180°.' },
    { aim: 60, pro: false, tri: [50, 70], text: 'A triangle has angles of <b>50°</b> and <b>70°</b>. Aim the cannon at the <b>third angle</b> and fire!',
      hint: 'The three angles in a triangle add up to 180°. Work out 180° − 50° − 70°.', why: 'Angles in a triangle add up to 180°: 180° − 50° − 70° = 60°.' }
  ];

  var CX = 200, CY = 215;
  function P(a, r) { var t = a * Math.PI / 180; return [CX + r * Math.cos(t), CY - r * Math.sin(t)]; }
  function f(v) { return v.toFixed(1); }

  Arcade.game({
    intro: 'Laser cannon ready! Angles are measured from the ground on the right: flat is 0°, straight up is 90°, flat on the left is 180°.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], aim = 0, busy = false, popped = false;
      stage.innerHTML = '<p class="q-num">Target ' + (i + 1) + '</p>' +
        '<p class="q-text">' + (R.text || R.q) + '</p>' +
        (R.tri ? '<p class="ac-tri" aria-hidden="true"><svg viewBox="0 0 160 80"><path d="M10 70 H150 L58 12 Z" class="ac-tris"/><text x="26" y="64">50°</text><text x="118" y="64">70°</text><text x="54" y="34">?</text></svg><small>not to scale</small></p>' : '') +
        '<svg class="ac-svg" viewBox="0 0 400 240" role="img"></svg>' +
        (R.q ? '<div class="q-options"></div>' :
          '<div class="ac-ctrl"><button class="btn ghost" type="button" data-d="-5">−5</button><button class="btn ghost" type="button" data-d="-1">−1</button>' +
          '<b class="ac-deg" aria-live="polite"></b><button class="btn ghost" type="button" data-d="1">+1</button><button class="btn ghost" type="button" data-d="5">+5</button></div>' +
          '<p class="actions ac-act"><button class="btn" type="button" data-fire>Fire! 🔥</button></p>');
      var svg = stage.querySelector('.ac-svg');
      if (R.show != null) aim = R.show;

      ui.owl(R.q ? 'Think about what you know about angles.' : R.pro ? 'Read the angle off the protractor, then turn the cannon to it.' :
        R.mark ? 'Use an angle fact: you can work this one out exactly!' : R.tri ? 'Use the triangle fact, then aim.' : 'Use 0°, 90° and 180° as guides.');

      function draw(laser) {
        var s = '<line x1="10" y1="' + CY + '" x2="390" y2="' + CY + '" class="ac-ground"/>';
        if (R.pro) {
          s += '<path d="M' + (CX - 160) + ' ' + CY + ' A160 160 0 0 1 ' + (CX + 160) + ' ' + CY + '" class="ac-pro"/>';
          for (var a = 0; a <= 180; a += 10) {
            var p1 = P(a, 160), p2 = P(a, a % 30 ? 150 : 142), pt = P(a, 128);
            s += '<line x1="' + f(p1[0]) + '" y1="' + f(p1[1]) + '" x2="' + f(p2[0]) + '" y2="' + f(p2[1]) + '" class="ac-tick"/>';
            if (a % 30 === 0) s += '<text x="' + f(pt[0]) + '" y="' + f(pt[1] + 5) + '" text-anchor="middle" class="ac-pl">' + a + '</text>';
          }
        }
        if (R.mark) {
          s += '<path d="M' + (CX - 60) + ' ' + CY + ' A60 60 0 0 1 ' + f(P(180 - R.mark, 60)[0]) + ' ' + f(P(180 - R.mark, 60)[1]) + '" class="ac-markarc"/>' +
            '<text x="' + (CX - 92) + '" y="' + (CY - 10) + '" class="ac-markt">35°</text>';
        }
        if (R.aim != null && !popped) { var b = P(R.aim, 178); s += '<text x="' + f(b[0]) + '" y="' + f(b[1] + 12) + '" text-anchor="middle" class="ac-bal">🎈</text>'; }
        if (popped) { var b2 = P(R.aim, 178); s += '<text x="' + f(b2[0]) + '" y="' + f(b2[1] + 12) + '" text-anchor="middle" class="ac-bal">💥</text>'; }
        if (R.mark && !popped) s += '<line x1="' + CX + '" y1="' + CY + '" x2="' + f(P(R.aim, 168)[0]) + '" y2="' + f(P(R.aim, 168)[1]) + '" class="ac-guide"/>';
        if (laser) s += '<line x1="' + CX + '" y1="' + CY + '" x2="' + f(P(aim, laser)[0]) + '" y2="' + f(P(aim, laser)[1]) + '" class="ac-laser"/>';
        var e = P(aim, 26);
        s += '<path d="M' + (CX + 28) + ' ' + CY + ' A28 28 0 0 0 ' + f(e[0]) + ' ' + f(e[1]) + '" class="ac-arc"/>';
        s += '<g transform="translate(' + CX + ' ' + CY + ') rotate(' + (-aim) + ')"><rect x="0" y="-8" width="52" height="16" rx="6" class="ac-barrel"/></g>' +
          '<circle cx="' + CX + '" cy="' + CY + '" r="16" class="ac-base"/>';
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Cannon at ' + aim + ' degrees.' + (R.pro ? ' A protractor is shown.' : ''));
        var d = stage.querySelector('.ac-deg'); if (d) d.textContent = aim + '°';
      }

      function fire() {
        if (busy || stage.classList.contains('locked')) return;
        var hit = Math.abs(aim - R.aim) <= (R.tol || 0);
        function end() {
          popped = hit; draw(hit ? 0 : 200); busy = false;
          ui.check(hit, { hint: R.hint + (aim > R.aim ? ' (You aimed too high.)' : ' (You aimed too low.)'),
            why: R.why || 'The balloon was at ' + R.aim + '°.', reveal: function () { aim = R.aim; popped = true; draw(0); } });
          if (stage.classList.contains('locked')) stage.querySelectorAll('.ac-ctrl button, [data-fire]').forEach(function (x) { x.disabled = true; });
        }
        if (still) { end(); return; }
        busy = true; var t0 = performance.now();
        (function go(t) { var p = Math.min(1, (t - t0) / 450); draw(30 + 170 * p); if (p < 1) requestAnimationFrame(go); else end(); })(t0);
      }

      if (R.q) {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
          });
          box.appendChild(b);
        });
      } else {
        stage.querySelectorAll('[data-d]').forEach(function (b) { b.addEventListener('click', function () {
          if (busy || stage.classList.contains('locked')) return; aim = Math.max(0, Math.min(180, aim + +b.getAttribute('data-d'))); draw(); }); });
        stage.querySelector('[data-fire]').addEventListener('click', fire);
      }
      draw();
    }
  });
})();
