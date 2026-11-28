/* Cell Builder: find the parts of an animal cell and a plant cell by tapping them.
   Facts (KS3): nucleus controls the cell and holds genetic material; cell membrane controls what goes in and out;
   cytoplasm is where most chemical reactions happen; mitochondria are where aerobic respiration releases energy;
   plant cells also have a cell wall (cellulose, strengthens the cell), chloroplasts (photosynthesis) and a
   permanent vacuole filled with cell sap. Animal cells have no cell wall, chloroplasts or permanent vacuole. */
(function () {
  if (!window.Arcade) return;
  var NAMES = { nucleus: 'nucleus', membrane: 'cell membrane', cytoplasm: 'cytoplasm', mito: 'mitochondria', wall: 'cell wall', chloro: 'chloroplast', vacuole: 'vacuole' };
  function animal() {
    return '<svg class="cb-svg" viewBox="0 0 360 260" role="img" aria-label="An animal cell. Tap a part.">' +
      '<ellipse data-p="cytoplasm" cx="180" cy="130" rx="160" ry="110" fill="#FDE7EF"/>' +
      '<ellipse data-p="membrane" cx="180" cy="130" rx="160" ry="110" fill="none" stroke="#C2185B" stroke-width="12" pointer-events="stroke"/>' +
      '<ellipse data-p="mito" cx="95" cy="90" rx="26" ry="12" fill="#FF8A65" stroke="#BF360C" stroke-width="3"/>' +
      '<ellipse data-p="mito" cx="250" cy="185" rx="26" ry="12" fill="#FF8A65" stroke="#BF360C" stroke-width="3" transform="rotate(-25 250 185)"/>' +
      '<ellipse data-p="mito" cx="110" cy="180" rx="22" ry="11" fill="#FF8A65" stroke="#BF360C" stroke-width="3" transform="rotate(20 110 180)"/>' +
      '<circle data-p="nucleus" cx="195" cy="120" r="42" fill="#9575CD" stroke="#4527A0" stroke-width="4"/></svg>';
  }
  function plant() {
    return '<svg class="cb-svg" viewBox="0 0 360 260" role="img" aria-label="A plant cell. Tap a part.">' +
      '<rect data-p="wall" x="10" y="10" width="340" height="240" rx="10" fill="none" stroke="#6D8B2F" stroke-width="16" pointer-events="stroke"/>' +
      '<rect data-p="cytoplasm" x="26" y="26" width="308" height="208" rx="6" fill="#EEF7DC"/>' +
      '<rect data-p="membrane" x="26" y="26" width="308" height="208" rx="6" fill="none" stroke="#C2185B" stroke-width="9" pointer-events="stroke"/>' +
      '<rect data-p="vacuole" x="110" y="55" width="150" height="150" rx="40" fill="#B3E5FC" stroke="#0277BD" stroke-width="3"/>' +
      '<circle data-p="nucleus" cx="295" cy="70" r="26" fill="#9575CD" stroke="#4527A0" stroke-width="4"/>' +
      [[60, 60], [62, 200], [300, 195], [70, 130], [290, 135]].map(function (c) { return '<ellipse data-p="chloro" cx="' + c[0] + '" cy="' + c[1] + '" rx="20" ry="11" fill="#43A047" stroke="#1B5E20" stroke-width="3"/>'; }).join('') +
      '<ellipse data-p="mito" cx="200" cy="222" rx="18" ry="8" fill="#FF8A65" stroke="#BF360C" stroke-width="3"/></svg>';
  }
  var R = [
    { cell: 'animal', want: 'nucleus', task: 'Tap the <b>nucleus</b>: it controls the cell and holds the genetic material (DNA).', hint: 'It is the biggest round part, near the middle.' },
    { cell: 'animal', want: 'membrane', task: 'Tap the part that <b>controls what goes in and out</b> of the cell.', hint: 'It is the thin layer all the way round the outside.' },
    { cell: 'animal', want: 'mito', task: 'Tap one of the <b>mitochondria</b>, where respiration releases energy.', hint: 'They are small, sausage-shaped and orange here. There are several.' },
    { cell: 'plant', want: 'chloro', task: 'Tap a part where <b>photosynthesis</b> happens.', hint: 'Photosynthesis needs the green substance chlorophyll.', why: 'Chloroplasts contain green chlorophyll, which absorbs light for photosynthesis. Animal cells don\'t have them.' },
    { cell: 'plant', want: 'wall', task: 'Tap the <b>cell wall</b>: it is made of cellulose and makes the cell strong.', hint: 'It is the thick, stiff layer on the very outside of the plant cell.' },
    { cell: 'plant', want: 'vacuole', task: 'Tap the <b>vacuole</b>, filled with cell sap. It helps keep the cell firm.', hint: 'It is the big space in the middle, shown in light blue.' },
    { q: 'Which of these parts do animal cells NOT have?', opts: ['Cell wall', 'Nucleus', 'Cell membrane', 'Mitochondria'], ans: 0, hint: 'Think about what makes plant cells stiff.', why: 'Animal cells have no cell wall, no chloroplasts and no permanent vacuole. All cells like these have a nucleus, membrane, cytoplasm and mitochondria.' },
    { q: 'A red blood cell has no nucleus, so it has more room for…', opts: ['carrying oxygen', 'photosynthesis', 'a cell wall', 'sending nerve messages'], ans: 0, hint: 'What does blood carry around the body?', why: 'Red blood cells are specialised to carry oxygen. Having no nucleus leaves more space for haemoglobin, which carries the oxygen.' }
  ];
  Arcade.game({
    intro: 'Explore animal and plant cells under the microscope! Tap the part each question asks for.',
    rounds: R.length,
    round: function (i, ui, stage) {
      var r = R[i];
      if (r.q) {
        stage.innerHTML = '<p class="q-num">Question ' + (i + 1) + '</p><p class="q-text">' + r.q + '</p><div class="q-options"></div>';
        ui.owl('Think about what each part does.');
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
      stage.innerHTML = '<p class="q-num">' + (r.cell === 'animal' ? '🐾 Animal cell' : '🌿 Plant cell') + '</p><p class="q-text">' + r.task + '</p>' +
        (r.cell === 'animal' ? animal() : plant()) + '<p class="cb-out" aria-live="polite"></p>';
      ui.owl(r.cell === 'animal' ? 'Tap right on the part.' : 'Plant cells have three extra parts.');
      var out = stage.querySelector('.cb-out');
      function show(p) { stage.querySelectorAll('[data-p="' + p + '"]').forEach(function (e) { e.classList.add('cb-on'); }); }
      stage.querySelectorAll('[data-p]').forEach(function (el) {
        el.style.cursor = 'pointer';
        el.addEventListener('click', function (ev) {
          ev.stopPropagation();
          if (stage.classList.contains('locked')) return;
          var p = el.getAttribute('data-p'), ok = p === r.want;
          out.textContent = 'You tapped the ' + NAMES[p] + '.';
          if (ok) show(p);
          ui.check(ok, { hint: r.hint, why: r.why || ('That is the ' + NAMES[r.want] + '.'), reveal: function () { show(r.want); out.textContent = 'This is the ' + NAMES[r.want] + '.'; } });
        });
      });
    }
  });
})();
