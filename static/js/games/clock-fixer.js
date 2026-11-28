/* Clock Fixer: set the hands of an analogue clock to match a time, then read clocks and work out how long.
   The hour hand moves smoothly: it turns 30° per hour plus 0.5° per minute, so at half past it is halfway between numbers.
   Answers by hand: quarter to 4 = 3:45; ten to 6 = 5:50; 14:30 = half past 2 (in the afternoon);
   2:15 to 3:00 is 45 minutes; 8:40 + 35 minutes = 9:15. */
(function () {
  if (!window.Arcade) return;
  function words(h, m) {
    if (m === 0) return h + ' o\'clock';
    if (m === 15) return 'quarter past ' + h;
    if (m === 30) return 'half past ' + h;
    if (m === 45) return 'quarter to ' + (h % 12 + 1);
    return m < 30 ? m + ' minutes past ' + h : (60 - m) + ' minutes to ' + (h % 12 + 1);
  }
  function face(h, m) {
    var s = '<svg class="ck-svg" viewBox="0 0 220 220" role="img" aria-label="A clock showing ' + words(h, m) + '">' +
      '<circle cx="110" cy="110" r="100" fill="var(--card)" stroke="var(--fun)" stroke-width="8"/>';
    for (var k = 0; k < 60; k++) {
      var a = (k * 6 - 90) * Math.PI / 180, big = k % 5 === 0, r0 = big ? 82 : 89;
      s += '<line x1="' + (110 + r0 * Math.cos(a)).toFixed(1) + '" y1="' + (110 + r0 * Math.sin(a)).toFixed(1) + '" x2="' + (110 + 95 * Math.cos(a)).toFixed(1) + '" y2="' + (110 + 95 * Math.sin(a)).toFixed(1) + '" stroke="var(--navy)" stroke-width="' + (big ? 3 : 1.2) + '"/>';
    }
    for (var n = 1; n <= 12; n++) {
      var b = (n * 30 - 90) * Math.PI / 180;
      s += '<text x="' + (110 + 66 * Math.cos(b)).toFixed(1) + '" y="' + (116 + 66 * Math.sin(b)).toFixed(1) + '" text-anchor="middle" font-size="19" font-weight="700" fill="var(--navy)">' + n + '</text>';
    }
    var ha = ((h % 12) * 30 + m * 0.5 - 90) * Math.PI / 180, ma = (m * 6 - 90) * Math.PI / 180;
    s += '<line class="ck-h" x1="110" y1="110" x2="' + (110 + 48 * Math.cos(ha)).toFixed(1) + '" y2="' + (110 + 48 * Math.sin(ha)).toFixed(1) + '" stroke="var(--navy)" stroke-width="9" stroke-linecap="round"/>' +
      '<line class="ck-m" x1="110" y1="110" x2="' + (110 + 76 * Math.cos(ma)).toFixed(1) + '" y2="' + (110 + 76 * Math.sin(ma)).toFixed(1) + '" stroke="var(--gold)" stroke-width="6" stroke-linecap="round"/>' +
      '<circle cx="110" cy="110" r="7" fill="var(--navy)"/></svg>';
    return s;
  }
  var R = [
    { set: [3, 0], say: '3 o\'clock', hint: 'At o\'clock, the long minute hand points straight up to 12.' },
    { set: [7, 30], say: 'half past 7', hint: 'Half past: the minute hand points down to 6. The hour hand is halfway between 7 and 8.' },
    { set: [9, 15], say: 'quarter past 9', hint: 'Quarter past: the minute hand points to 3 (15 minutes).' },
    { set: [3, 45], say: 'quarter to 4', hint: 'Quarter to 4 is 15 minutes before 4 o\'clock: that is 3:45. The minute hand points to 9.' },
    { set: [5, 50], say: 'ten to 6', hint: 'Ten to 6 is 10 minutes before 6, which is 5:50. The minute hand points to 10.' },
    { set: [2, 30], say: '14:30 on a 24-hour clock', hint: 'Take 12 away from hours after 12: 14 − 12 = 2. So 14:30 is half past 2 in the afternoon.' },
    { read: [2, 15], q: 'The film starts at the time on this clock and ends at 3 o\'clock. How long is it?', opts: ['45 minutes', '15 minutes', '1 hour', '30 minutes'], ans: 0, hint: 'The clock shows quarter past 2. How many minutes from 2:15 to 3:00?', why: 'From 2:15 to 3:00 is 45 minutes: 15 to get to 2:30, then 30 more to 3:00.' },
    { read: [8, 40], q: 'This clock shows when Mia leaves home. The walk takes 35 minutes. When does she arrive?', opts: ['9:15', '9:05', '8:75', '9:35'], ans: 0, hint: 'The clock shows 8:40. 20 minutes takes you to 9:00. How many more minutes are left?', why: '8:40 + 20 minutes = 9:00, and 15 more minutes = 9:15. (There is no such time as 8:75!)' }
  ];
  Arcade.game({
    intro: 'The clocks in the clock shop are all wrong! Set the hands to the right time, then solve some time puzzles.',
    rounds: R.length,
    round: function (i, ui, stage) {
      var r = R[i];
      if (r.read) {
        stage.innerHTML = '<p class="q-num">Time puzzle</p>' + face(r.read[0], r.read[1]) + '<p class="q-text">' + r.q + '</p><div class="q-options"></div>';
        ui.owl('Read the clock first, then count on.');
        var box = stage.querySelector('.q-options');
        r.opts.forEach(function (t, k) {
          var b = Arcade.h('button', 'opt', t); b.type = 'button';
          b.addEventListener('click', function () {
            var ok = k === r.ans; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) b.disabled = true;
            ui.check(ok, { hint: r.hint, why: r.why, reveal: function () { box.children[r.ans].classList.add('right'); } });
          });
          box.appendChild(b);
        });
        return;
      }
      var h = 12, m = 0;
      stage.innerHTML = '<p class="q-num">Clock ' + (i + 1) + '</p><p class="q-text">Set the clock to <b>' + r.say + '</b>.</p><div class="ck-face"></div>' +
        '<p class="ck-ctrl"><span>Hour hand</span><button class="btn ghost" type="button" data-h="-1">−1 hour</button><button class="btn ghost" type="button" data-h="1">+1 hour</button></p>' +
        '<p class="ck-ctrl"><span>Minute hand</span><button class="btn ghost" type="button" data-m="-5">−5 min</button><button class="btn ghost" type="button" data-m="5">+5 min</button><button class="btn ghost" type="button" data-m="15">+15 min</button></p>' +
        '<p class="actions"><button class="btn" type="button" data-check>Check ✓</button></p>';
      ui.owl(i === 0 ? 'Use the buttons to move the hands. The hour hand moves a little as the minutes go by, just like a real clock.' : 'Short hand for hours, long hand for minutes.');
      function draw() { stage.querySelector('.ck-face').innerHTML = face(h, m); }
      draw();
      stage.querySelectorAll('[data-h]').forEach(function (b) { b.addEventListener('click', function () { h = ((h - 1 + +b.getAttribute('data-h') + 12) % 12) + 1; draw(); }); });
      stage.querySelectorAll('[data-m]').forEach(function (b) {
        b.addEventListener('click', function () {
          var t = (h % 12) * 60 + m + +b.getAttribute('data-m'); t = (t + 720) % 720;
          h = Math.floor(t / 60) || 12; m = t % 60; draw();
        });
      });
      stage.querySelector('[data-check]').addEventListener('click', function () {
        var ok = h === r.set[0] && m === r.set[1];
        ui.check(ok, { hint: r.hint, why: 'That\'s ' + r.say + ': ' + r.set[0] + ':' + (r.set[1] < 10 ? '0' : '') + r.set[1] + '.', reveal: function () { h = r.set[0]; m = r.set[1]; draw(); } });
      });
    }
  });
})();
