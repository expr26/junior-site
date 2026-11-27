/* Times Table Trainer: pick the tables you want, answer 10 facts, colour in the times table map.
   No timer. A fact turns light on the map when you get it right first time once, and bright ("got it") after two
   first-time rights on different rounds. Facts you haven't got yet come up more often.
   Saved in js-game-v1 under S.tt = { pick: [2, 5, 10], f: { "3x7": 2, ... } }  (key: smaller number first).
   Hints are standard mental strategies; every one gives the right product for 1 to 12 (checked by hand):
     2 double · 3 two lots + one more · 4 double, double · 5 half of ×10 · 6 five lots + one more · 7 five lots + two lots
     8 double three times · 9 ten lots − one lot · 10 add a zero · 11 ten lots + one lot · 12 ten lots + two lots */
(function () {
  if (!window.Arcade || !window.JG) return;
  var h = Arcade.h, S = JG.state();
  S.tt = S.tt || { pick: [2, 5, 10], f: {} };
  var TABLES = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], ROUNDS = 10;

  function key(a, b) { return Math.min(a, b) + 'x' + Math.max(a, b); }
  function got(a, b) { return S.tt.f[key(a, b)] || 0; }

  function strategy(t, n) {
    var p = t * n;
    switch (t) {
      case 2: return 'Times 2 is doubling. Double ' + n + '.';
      case 3: return 'Work out 2 × ' + n + ' = ' + 2 * n + ', then add one more ' + n + '.';
      case 4: return 'Double ' + n + ' (' + 2 * n + '), then double again.';
      case 5: return 'Work out 10 × ' + n + ' = ' + 10 * n + ', then halve it.';
      case 6: return 'Work out 5 × ' + n + ' = ' + 5 * n + ', then add one more ' + n + '.';
      case 7: return 'Work out 5 × ' + n + ' = ' + 5 * n + ' and 2 × ' + n + ' = ' + 2 * n + ', then add them.';
      case 8: return 'Double ' + n + ' three times: ' + n + ' → ' + 2 * n + ' → ' + 4 * n + ' → ?';
      case 9: return 'Work out 10 × ' + n + ' = ' + 10 * n + ', then take away one ' + n + '.';
      case 10: return 'Times 10: the digits move one place to the left, so a 0 goes on the end of ' + n + '.';
      case 11: return 'Work out 10 × ' + n + ' = ' + 10 * n + ', then add one more ' + n + '.';
      case 12: return 'Split 12 into 10 and 2: 10 × ' + n + ' = ' + 10 * n + ' and 2 × ' + n + ' = ' + 2 * n + '. Add them.';
    }
    return 'Count in ' + t + 's.';
  }

  /* ---------- the picker and the map (shown before Play and after each round) ---------- */
  var box = document.getElementById('arcade');
  var panel = h('div', 'tt-panel');
  box.parentNode.insertBefore(panel, box.nextSibling);

  function drawPanel() {
    var chips = TABLES.map(function (t) {
      var on = S.tt.pick.indexOf(t) >= 0;
      return '<button type="button" class="tt-chip' + (on ? ' on' : '') + '" aria-pressed="' + on + '" data-t="' + t + '">' + t + '<span class="tt-x">×</span></button>';
    }).join('');
    var rows = '<tr><th scope="col"><span class="sr">times</span>×</th>' + [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(function (b) { return '<th scope="col">' + b + '</th>'; }).join('') + '</tr>';
    var done = 0, total = 0;
    TABLES.forEach(function (a) {
      rows += '<tr><th scope="row">' + a + '</th>';
      for (var b = 1; b <= 12; b++) {
        var g = got(a, b), cls = g >= 2 ? 'got' : g === 1 ? 'half' : '';
        total++; if (g >= 2) done++;
        rows += '<td class="' + cls + '" title="' + a + ' × ' + b + ' = ' + a * b + '">' + (g ? a * b : '') + '</td>';
      }
      rows += '</tr>';
    });
    panel.innerHTML = '<div class="card tt-pick"><h2>Which tables?</h2><p class="small">Tap to choose one or more. Facts you haven\'t got yet come up more often.</p>' +
      '<div class="tt-chips">' + chips + '</div><p class="tt-quick"><button type="button" class="btn ghost" data-set="2,5,10">2, 5, 10</button> ' +
      '<button type="button" class="btn ghost" data-set="3,4,8">3, 4, 8</button> <button type="button" class="btn ghost" data-set="6,7,9">6, 7, 9</button> ' +
      '<button type="button" class="btn ghost" data-set="2,3,4,5,6,7,8,9,10,11,12">All</button></p></div>' +
      '<div class="card tt-map"><h2>My times table map</h2><p class="small"><span class="tt-key half"></span> right once · <span class="tt-key got"></span> got it (right first time twice) · <b>' + done + ' of ' + total + '</b> facts got</p>' +
      '<div class="tt-scroll"><table class="tt-grid"><caption class="sr">Times table map: products you have got are filled in</caption>' + rows + '</table></div></div>';
    panel.querySelectorAll('.tt-chip').forEach(function (c) {
      c.addEventListener('click', function () {
        var t = +c.getAttribute('data-t'), i = S.tt.pick.indexOf(t);
        if (i >= 0 && S.tt.pick.length > 1) S.tt.pick.splice(i, 1); else if (i < 0) S.tt.pick.push(t);
        S.tt.pick.sort(function (x, y) { return x - y; }); JG.save(); drawPanel();
      });
    });
    panel.querySelectorAll('[data-set]').forEach(function (b) {
      b.addEventListener('click', function () { S.tt.pick = b.getAttribute('data-set').split(',').map(Number); JG.save(); drawPanel(); });
    });
    if (done === total) JG.award('tt-map');
  }

  /* ---------- choosing the facts for a round of 10 ---------- */
  var set = [];
  function makeSet() {
    var pool = [];
    S.tt.pick.forEach(function (t) {
      for (var n = 1; n <= 12; n++) {
        var w = got(t, n) >= 2 ? 1 : got(t, n) === 1 ? 3 : 5;
        if (n === 1 || (n === 10 && t !== 10)) w = 1;
        for (var k = 0; k < w; k++) pool.push([t, n]);
      }
    });
    var out = [], seen = {};
    for (var guard = 0; out.length < ROUNDS && guard < 2000; guard++) {
      var f = pool[Math.floor(Math.random() * pool.length)], id = f[0] + 'x' + f[1];
      if (seen[id] && guard < 1500) continue;
      seen[id] = 1; out.push(f);
    }
    return out.map(function (f, i) { return { t: f[0], n: f[1], div: i === 4 || i === 8, flip: Math.random() < 0.5 }; });
  }

  Arcade.game({
    intro: 'Choose your tables below, then press Play.',
    rounds: ROUNDS,
    round: function (i, ui, stage) {
      if (i === 0) { set = makeSet(); panel.hidden = true; }
      var F = set[i], t = F.t, n = F.n, p = t * n, a = F.flip ? n : t, b = F.flip ? t : n;
      var text, want, hint, why;
      if (F.div) {
        text = '<span class="tt-q">' + p + ' <span class="tt-x">÷</span> ' + t + ' = <span class="tt-gap">?</span></span>';
        want = n; hint = 'What times ' + t + ' makes ' + p + '? ' + strategy(t, n).replace(/\?$/, '');
        why = n + ' × ' + t + ' = ' + p + ', so ' + p + ' ÷ ' + t + ' = ' + n + '.';
        ui.owl('Use your ' + t + ' times table backwards.');
      } else {
        text = '<span class="tt-q">' + a + ' <span class="tt-x">×</span> ' + b + ' = <span class="tt-gap">?</span></span>';
        want = p; hint = strategy(t, n); why = a + ' × ' + b + ' = ' + p + '.';
        ui.owl(i === 0 ? 'Let\'s go! Type the answer and press Check.' : got(t, n) >= 2 ? 'You know this one!' : 'Take your time.');
      }
      stage.innerHTML = '<p class="tt-big" aria-label="' + (F.div ? p + ' divided by ' + t : a + ' times ' + b) + '">' + text + '</p>';
      var form = h('form', 'tt-form');
      var inp = h('input'); inp.type = 'text'; inp.inputMode = 'numeric'; inp.autocomplete = 'off'; inp.className = 'num-in';
      inp.setAttribute('aria-label', 'Your answer');
      var go = h('button', 'btn', 'Check'); go.type = 'submit';
      form.appendChild(inp); form.appendChild(go); stage.appendChild(form);
      var tries = 0;
      form.addEventListener('submit', function (ev) {
        ev.preventDefault();
        var v = inp.value.trim().replace(/,/g, '');
        if (!/^\d+$/.test(v)) { inp.focus(); return; }
        tries++;
        var ok = +v === want;
        if (ok && tries === 1) { var k = key(t, n); S.tt.f[k] = (S.tt.f[k] || 0) + 1; JG.save(); }
        if (!ok && tries === 1) { inp.select(); }
        ui.check(ok, { hint: hint, why: why, reveal: function () { stage.querySelector('.tt-gap').textContent = want; stage.querySelector('.tt-gap').classList.add('shown'); } });
        if (ok || tries >= 2) { inp.disabled = true; go.disabled = true; }
      });
      setTimeout(function () { inp.focus({ preventScroll: true }); }, 50);
      if (i === ROUNDS - 1) {
        // show the map again under the end card
        setTimeout(function wait() { if (!box.querySelector('.endcard')) return setTimeout(wait, 400); panel.hidden = false; drawPanel(); }, 400);
      }
    }
  });
  drawPanel();
})();
