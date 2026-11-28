/* Separation Station: choose the right way to separate each mixture, then put the steps for getting salt from rock salt in order.
   Methods (KS3): filtering separates an insoluble solid from a liquid (sand from water); evaporation gets a dissolved
   solid back from a solution (salt from salt water); a magnet pulls out magnetic metals (iron filings); a sieve separates
   solids with different-sized bits (pebbles from sand); chromatography separates the dyes in an ink; distillation gets
   pure water from a solution by boiling and condensing the steam.
   Rock salt order: crush, dissolve in warm water, filter (sand stays in the filter paper), evaporate the filtrate. */
(function () {
  if (!window.Arcade) return;
  var M = { filter: '🧻 Filtering', evap: '🔥 Evaporation', magnet: '🧲 Magnet', sieve: '🥅 Sieve', chrom: '🖊️ Chromatography', distil: '💨 Distillation' };
  var R = [
    { mix: '🏖️ Sand and water', want: 'filter', opts: ['filter', 'magnet', 'chrom'], hint: 'Sand does not dissolve. Which method lets the water through but stops the solid bits?', why: 'Filter paper has tiny holes: water passes through, but the sand grains are too big and stay behind.' },
    { mix: '🧂 Salt dissolved in water: you want the salt', want: 'evap', opts: ['filter', 'evap', 'sieve'], hint: 'Dissolved salt goes straight through filter paper. How can you get rid of the water?', why: 'Heat the salt water so the water evaporates. The salt crystals are left behind in the dish.' },
    { mix: '⚙️ Iron filings mixed with sand', want: 'magnet', opts: ['evap', 'magnet', 'filter'], hint: 'Iron has a special property that sand doesn\'t have.', why: 'Iron is magnetic, so a magnet pulls the filings out and leaves the sand.' },
    { mix: '🪨 Pebbles mixed with sand', want: 'sieve', opts: ['sieve', 'chrom', 'evap'], hint: 'The bits are very different sizes.', why: 'A sieve lets the small sand grains fall through and keeps the big pebbles.' },
    { mix: '🖍️ The different coloured dyes in black felt-tip ink', want: 'chrom', opts: ['magnet', 'filter', 'chrom'], hint: 'This method uses paper and water creeping up it.', why: 'In chromatography, water moves up the paper and carries each dye a different distance, so the colours spread apart.' },
    { mix: '🌊 Pure drinking water from sea water', want: 'distil', opts: ['filter', 'distil', 'sieve'], hint: 'You need to keep the water, not the salt. Boil it, then cool the steam.', why: 'Distillation boils the water into steam, then cools the steam so it condenses back into pure water. The salt stays behind.' },
    { order: true },
    { q: 'Why can\'t you get salt out of salt water just by filtering it?', opts: ['The dissolved salt passes through the filter paper', 'Salt is magnetic', 'The salt sinks to the bottom', 'Filter paper melts in salt water'], ans: 0, hint: 'What happens to salt when it dissolves?', why: 'When salt dissolves, it breaks up into particles far smaller than the holes in filter paper, so it goes straight through with the water.' }
  ];
  var STEPS = ['Crush the rock salt', 'Stir it into warm water to dissolve the salt', 'Filter to remove the sand and grit', 'Evaporate the water to leave salt crystals'];
  function mcButtons(stage, ui, labels, ans, r) {
    var box = Arcade.h('div', 'q-options');
    labels.forEach(function (t, k) {
      var b = Arcade.h('button', 'opt', t); b.type = 'button';
      b.addEventListener('click', function () {
        var ok = k === ans; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) b.disabled = true;
        ui.check(ok, { hint: r.hint, why: r.why, reveal: function () { box.children[ans].classList.add('right'); } });
      });
      box.appendChild(b);
    });
    stage.appendChild(box);
  }
  Arcade.game({
    intro: 'Welcome to Separation Station! Each mixture needs the right method to pull it apart.',
    rounds: R.length,
    round: function (i, ui, stage) {
      var r = R[i];
      if (r.order) {
        var mixed = [2, 0, 3, 1], picked = [];
        stage.innerHTML = '<p class="q-num">Salt from rock salt</p><p class="q-text">Rock salt is salt mixed with sand and grit. <b>Tap the steps in the right order</b> to get clean salt.</p>' +
          '<ol class="ss-order"></ol><div class="q-options ss-steps"></div><p class="actions"><button class="btn ghost" type="button" data-undo>Start again</button></p>';
        ui.owl('Think: what has to happen first?');
        var list = stage.querySelector('.ss-order'), box = stage.querySelector('.ss-steps');
        function draw() {
          list.innerHTML = picked.map(function (k) { return '<li>' + STEPS[k] + '</li>'; }).join('');
          box.innerHTML = '';
          mixed.forEach(function (k) {
            if (picked.indexOf(k) >= 0) return;
            var b = Arcade.h('button', 'opt', STEPS[k]); b.type = 'button';
            b.addEventListener('click', function () {
              picked.push(k); draw();
              if (picked.length === 4) {
                var ok = picked.join() === '0,1,2,3';
                ui.check(ok, { hint: 'You need to dissolve the salt before you can filter, and filter before you evaporate. Press Start again.',
                  why: 'Crush → dissolve → filter (the sand stays in the paper) → evaporate (the salt is left behind).',
                  reveal: function () { picked = [0, 1, 2, 3]; draw(); } });
              }
            });
            box.appendChild(b);
          });
        }
        stage.querySelector('[data-undo]').addEventListener('click', function () { if (!stage.classList.contains('locked')) { picked = []; draw(); } });
        draw(); return;
      }
      if (r.q) {
        stage.innerHTML = '<p class="q-num">Question</p><p class="q-text">' + r.q + '</p>';
        ui.owl('Think about the size of the particles.');
        mcButtons(stage, ui, r.opts, r.ans, r); return;
      }
      stage.innerHTML = '<p class="q-num">Mixture ' + (i + 1) + '</p><p class="ss-mix">' + r.mix + '</p><p class="q-text">Which method separates it?</p>';
      ui.owl(i === 0 ? 'Pick the best method for this mixture.' : 'Is it dissolved? Magnetic? Different sizes?');
      mcButtons(stage, ui, r.opts.map(function (k) { return M[k]; }), r.opts.indexOf(r.want), r);
    }
  });
})();
