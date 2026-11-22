/* Pattern Machine: the machine prints a sequence; the child finds the next term, the rule or the nth term.
   Check every answer by hand when editing ROUNDS. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var ROUNDS = [
    { seq: [3, 7, 11, 15], ask: 'next', ans: 19, hint: 'Look at the jumps: how much does it go up each time?', why: 'It goes up by 4 each time: 15 + 4 = 19.' },
    { seq: [50, 44, 38, 32], ask: 'next', ans: 26, hint: 'This one is going down. How much smaller does each number get?', why: 'It goes down by 6 each time: 32 − 6 = 26.' },
    { seq: [5, 8, 11, 14], ask: 'rule', opts: ['Add 3', 'Add 5', 'Multiply by 3'], ans: 0, hint: 'Find the difference between two numbers next to each other: 8 − 5 = ?', why: 'Each term is 3 more than the one before, so the rule is "add 3".' },
    { seq: [2, 4, 8, 16], ask: 'next', ans: 32, hint: 'The jumps get bigger! Try multiplying instead of adding.', why: 'Each term is double the one before: 16 × 2 = 32.' },
    { seq: [1, 4, 9, 16], ask: 'next', ans: 25, hint: 'These are special numbers: 1 × 1, 2 × 2, 3 × 3, 4 × 4…', why: 'They are square numbers: 5 × 5 = 25.' },
    { seq: [-7, -4, -1, 2], ask: 'next', ans: 5, hint: 'It goes up by the same amount each time, even past zero.', why: 'It goes up by 3 each time: 2 + 3 = 5.' },
    { seq: [4, 7, 10, 13], ask: 'rule', q: 'Which formula gives the nth term?', opts: ['3n + 1', 'n + 3', '4n', '3n + 4'], ans: 0,
      hint: 'Test each formula with n = 1 and n = 2. The first term must be 4 and the second must be 7.', why: 'The terms go up by 3, so it starts with 3n. When n = 1, 3 × 1 = 3, and we need 4, so add 1: 3n + 1.' },
    { seq: [6, 11, 16, 21], ask: 'nth', n: 10, ans: 51, hint: 'The terms go up by 5, so the formula starts 5n. When n = 1, 5n = 5, but the first term is 6. Fix the formula, then put in n = 10.', why: 'The nth term is 5n + 1, so the 10th term is 5 × 10 + 1 = 51.' }
  ];

  function n(v) { return v < 0 ? '−' + (-v) : String(v); }
  function readNum(s) { s = String(s).trim().replace(/−/g, '-'); return /^-?\d+$/.test(s) ? +s : null; }

  Arcade.game({
    intro: 'Beep boop! The Pattern Machine prints numbers that follow a secret rule. Can you crack it?',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i];
      var tiles = R.seq.map(function (v, k) { return '<span class="pm-tile" style="animation-delay:' + (k * .35) + 's">' + n(v) + '</span>'; }).join('') +
        (R.ask === 'next' ? '<span class="pm-tile pm-q" style="animation-delay:' + (R.seq.length * .35) + 's">?</span>' : '<span class="pm-dots">…</span>');
      var q = R.ask === 'next' ? 'What number comes next?' : R.ask === 'rule' ? (R.q || 'What is the rule?') : 'What is the <b>' + R.n + 'th</b> term?';
      stage.innerHTML = '<p class="q-num">Pattern ' + (i + 1) + '</p>' +
        '<div class="pm-machine" aria-hidden="true"><span class="pm-gear g1">⚙️</span><span class="pm-gear g2">⚙️</span><span class="pm-light"></span></div>' +
        '<div class="pm-tape" role="img" aria-label="The sequence: ' + R.seq.map(n).join(', ') + '">' + tiles + '</div>' +
        '<p class="pm-diffs" aria-live="polite"></p>' +
        '<p class="q-text">' + q + '</p>' +
        (R.opts ? '<div class="q-options"></div>' :
          '<form class="q-num-form"><label class="sr" for="pm-in">Your answer</label><input id="pm-in" type="text" inputmode="numeric" autocomplete="off">' +
          '<button class="btn" type="submit">Check</button><p class="tip small">For a negative number, type a minus sign first, like −3.</p></form>');

      ui.owl(i === 0 ? 'Tip: look at how much the numbers change from one to the next.' :
        R.ask === 'nth' ? 'The nth term is the number in position n. Position 1 is the first term.' :
        R.ask === 'rule' ? 'Check the rule works for <b>every</b> number, not just the first two.' : 'What is the machine doing each time?');

      var diffs = stage.querySelector('.pm-diffs');
      function showDiffs() {
        var d = [];
        for (var k = 1; k < R.seq.length; k++) d.push(R.seq[k] - R.seq[k - 1]);
        diffs.innerHTML = 'Jumps: ' + d.map(function (x) { return '<b>' + (x > 0 ? '+' : '−') + Math.abs(x) + '</b>'; }).join('  ');
      }

      function done(ok, el) {
        if (el) el.classList.add(ok ? 'right' : 'wrong');
        if (el && el.tagName === 'INPUT' && ok) el.classList.remove('wrong');
        ui.check(ok, { hint: R.hint, why: R.why, reveal: function () {
          showDiffs();
          if (R.opts) stage.querySelector('.q-options').children[R.ans].classList.add('right');
          else { var inp = stage.querySelector('input'); inp.value = n(R.ans); inp.classList.remove('wrong'); inp.classList.add('right'); }
        } });
        if (stage.classList.contains('locked')) { showDiffs(); var qq = stage.querySelector('.pm-q'); if (qq) qq.textContent = n(R.ans); }
      }

      if (R.opts) {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () { if (k !== R.ans) b.disabled = true; done(k === R.ans, b); });
          box.appendChild(b);
        });
      } else {
        var form = stage.querySelector('form'), inp = stage.querySelector('input');
        form.addEventListener('submit', function (ev) {
          ev.preventDefault();
          if (stage.classList.contains('locked')) return;
          var v = readNum(inp.value);
          if (v === null) { ui.owl('Type a whole number, then press Check.'); inp.focus(); return; }
          inp.classList.remove('wrong');
          done(v === R.ans, inp);
          if (!stage.classList.contains('locked')) inp.select();
        });
      }
    }
  });
})();
