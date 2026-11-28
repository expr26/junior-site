/* pH Lab: add universal indicator to everyday liquids, read the colour, and neutralise an acid.
   Universal indicator colours used here (a simplified, common school chart):
     pH 0–2 red · 3–4 orange · 5–6 yellow · 7 green · 8–9 blue-green/blue · 10–11 dark blue · 12–14 purple.
   Typical pH values (approximate, they vary by brand): lemon juice ~2, vinegar ~3, pure water 7, soapy water ~10,
   oven cleaner ~13, stomach acid ~1 to 2. Below 7 acid, 7 neutral, above 7 alkali.
   Neutralising round: each drop of alkali raises the pH by 1 (a simplification for the game), from pH 2 to 7 = 5 drops. */
(function () {
  if (!window.Arcade) return;
  var COL = ['#E53935', '#EF5A2A', '#F57C1F', '#FB9A1A', '#FDBA21', '#F4D428', '#C9DA2B', '#43B649', '#24A887', '#1E9BB8', '#2B6CC4', '#3949AB', '#5E35B1', '#7B1FA2', '#8E24AA'];
  function kind(p) { return p < 7 ? 'acid' : p === 7 ? 'neutral' : 'alkali'; }
  function tube(color, label) {
    return '<svg class="ph-svg" viewBox="0 0 220 230" role="img" aria-label="A test tube of ' + label + '">' +
      '<rect x="80" y="10" width="60" height="180" rx="30" fill="#fff" stroke="var(--navy)" stroke-width="4"/>' +
      '<rect class="ph-liq" x="84" y="80" width="52" height="106" rx="26" fill="' + color + '"/>' +
      '<text x="110" y="222" text-anchor="middle" font-size="16" font-weight="700" fill="var(--navy)">' + label + '</text></svg>';
  }
  function scale(mark) {
    var s = '<div class="ph-scale" aria-hidden="true">';
    for (var p = 0; p <= 14; p++) s += '<span style="background:' + COL[p] + '"' + (p === mark ? ' class="on"' : '') + '>' + p + '</span>';
    return s + '</div><p class="ph-ends small"><span>⬅ more acidic</span><span>neutral 7</span><span>more alkaline ➡</span></p>';
  }
  function mc(stage, ui, opts, ans, o) {
    var box = Arcade.h('div', 'q-options'), tries = 0;
    opts.forEach(function (t, k) {
      var b = Arcade.h('button', 'opt', t); b.type = 'button';
      b.addEventListener('click', function () {
        tries++; var ok = k === ans;
        b.classList.add(ok ? 'right' : 'wrong'); if (!ok) b.disabled = true;
        ui.check(ok, { hint: o.hint, why: o.why, reveal: function () { box.children[ans].classList.add('right'); if (o.reveal) o.reveal(); } });
      });
      box.appendChild(b);
    });
    stage.appendChild(box);
  }
  var R = [
    { name: 'Lemon juice', ph: 2, ask: 'kind', hint: 'Red and orange mean acid; green means neutral; blue and purple mean alkali.', why: 'Red is at the acid end of the scale: lemon juice is about pH 2, an acid. It tastes sour because of citric acid.' },
    { name: 'Pure water', ph: 7, ask: 'kind', hint: 'Look for the colour exactly in the middle of the scale.', why: 'Green means pH 7: neutral. Pure water is neither acidic nor alkaline.' },
    { name: 'Soapy water', ph: 10, ask: 'kind', hint: 'Which side of the scale is blue on?', why: 'Blue is on the alkali side. Soap is a weak alkali, about pH 10.' },
    { name: 'Vinegar', ph: 3, ask: 'num', opts: [3, 7, 10], hint: 'Orange is close to red on the scale.', why: 'Orange means about pH 3: vinegar is a weak acid (ethanoic acid).' },
    { name: 'Oven cleaner', ph: 13, ask: 'num', opts: [1, 7, 13], hint: 'Purple is at the far end of the scale.', why: 'Purple means about pH 13: oven cleaner is a strong alkali. It is corrosive, so it needs gloves and goggles.' },
    { name: 'Stomach acid', ph: 2, ask: 'drops', hint: 'Each drop of alkali moves the pH up by 1 here. Watch for green.', why: 'From pH 2, five drops of alkali reach pH 7: neutral. Acid + alkali → salt + water. This is neutralisation, and it is how indigestion tablets work.' },
    { name: 'Mystery liquid', ph: 6, ask: 'q', q: 'A mystery liquid turns indicator yellow (about pH 6). What is it?', opts: ['A weak acid', 'A strong alkali', 'Exactly neutral', 'A strong acid'], ans: 0, hint: 'Yellow is just below 7, on the acid side, but not far from neutral.', why: 'pH 6 is a weak acid: just a little below neutral. Milk and rain water are about this pH.' },
    { name: 'Lab safety', ph: 13, ask: 'q', q: 'Which of these needs gloves and goggles because it is strongly alkaline?', opts: ['Oven cleaner (pH 13)', 'Pure water (pH 7)', 'Milk (pH 6 to 7)', 'Lemon juice (pH 2)'], ans: 0, hint: 'Strong alkalis have the highest pH numbers.', why: 'Strong acids (pH 0 to 2) and strong alkalis (pH 12 to 14) are corrosive. Oven cleaner is a strong alkali.' }
  ];
  Arcade.game({
    intro: 'Welcome to the pH Lab! Add universal indicator to each liquid and read the colour on the pH scale.',
    rounds: R.length,
    round: function (i, ui, stage) {
      var r = R[i];
      stage.innerHTML = '<p class="q-num">Test ' + (i + 1) + ': ' + r.name + '</p>';
      if (r.ask === 'q') {
        stage.insertAdjacentHTML('beforeend', tube(COL[r.ph], r.name) + scale(-1) + '<p class="q-text">' + r.q + '</p>');
        ui.owl('Use the colour and the pH scale.');
        mc(stage, ui, r.opts, r.ans, r); return;
      }
      if (r.ask === 'drops') {
        var p = r.ph;
        stage.insertAdjacentHTML('beforeend', '<p class="q-text">Too much stomach acid gives you indigestion. Add drops of <b>alkali</b> until the liquid is <b>neutral</b>, then press Done.</p>' +
          tube(COL[p], 'pH ' + p) + scale(p) + '<p class="actions"><button class="btn ghost" type="button" data-a="-1">Add acid 💧</button> <button class="btn ghost" type="button" data-a="1">Add alkali 💧</button> <button class="btn" type="button" data-done>Done ✓</button></p>');
        ui.owl('Watch the colour change as you add drops.');
        function draw() {
          stage.querySelector('.ph-liq').setAttribute('fill', COL[p]);
          stage.querySelector('.ph-svg text').textContent = 'pH ' + p;
          stage.querySelectorAll('.ph-scale span').forEach(function (s, k) { s.classList.toggle('on', k === p); });
        }
        stage.querySelectorAll('[data-a]').forEach(function (b) { b.addEventListener('click', function () { p = Math.max(0, Math.min(14, p + +b.getAttribute('data-a'))); draw(); }); });
        stage.querySelector('[data-done]').addEventListener('click', function () {
          ui.check(p === 7, { hint: p < 7 ? 'It is still acidic (pH ' + p + '). Add more alkali.' : 'It is now alkaline (pH ' + p + '). You added too much: add a drop of acid.', why: r.why, reveal: function () { p = 7; draw(); } });
        });
        return;
      }
      var added = false;
      stage.insertAdjacentHTML('beforeend', '<p class="q-text">Add universal indicator to the <b>' + r.name.toLowerCase() + '</b>.</p>' + tube('#E9EEF5', r.name) +
        '<p class="actions"><button class="btn" type="button" data-add>Add indicator 🧪</button></p>');
      ui.owl(i === 0 ? 'Press the button to add a few drops of indicator.' : 'Add the indicator, then look closely at the colour.');
      stage.querySelector('[data-add]').addEventListener('click', function () {
        if (added) return; added = true;
        this.remove();
        stage.querySelector('.ph-liq').setAttribute('fill', COL[r.ph]);
        stage.insertAdjacentHTML('beforeend', scale(-1));
        if (r.ask === 'kind') {
          stage.insertAdjacentHTML('beforeend', '<p class="q-text">Is it an acid, neutral or an alkali?</p>');
          mc(stage, ui, ['Acid', 'Neutral', 'Alkali'], ['acid', 'neutral', 'alkali'].indexOf(kind(r.ph)), { hint: r.hint, why: r.why });
        } else {
          stage.insertAdjacentHTML('beforeend', '<p class="q-text">What is its pH, about?</p>');
          mc(stage, ui, r.opts.map(function (x) { return 'pH ' + x; }), r.opts.indexOf(r.ph), { hint: r.hint, why: r.why });
        }
      });
    }
  });
})();
