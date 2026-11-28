/* Digestion Express: put the organs of the digestive system in order, then answer what happens at each stop.
   Facts (KS3): mouth (teeth chew; saliva has amylase, which starts digesting starch), oesophagus, stomach (acid kills most
   bacteria; protease starts on protein), small intestine (digestion finishes; villi absorb small molecules into the blood),
   large intestine (water absorbed). Bile is made in the liver and breaks fat into small droplets. */
(function () {
  if (!window.Arcade) return;
  var ORG = ['👄 Mouth', '🚇 Oesophagus', '🫃 Stomach', '🌀 Small intestine', '💧 Large intestine'];
  var R = [
    { order: true },
    { q: 'Where is food chewed and where does starch start to be digested?', opts: ['Mouth', 'Stomach', 'Large intestine', 'Oesophagus'], ans: 0, hint: 'Teeth and saliva are here.', why: 'Teeth break food into small pieces, and saliva contains amylase, an enzyme that starts turning starch into sugar.' },
    { q: 'Which part uses acid to kill most of the bacteria in food?', opts: ['Stomach', 'Mouth', 'Small intestine', 'Oesophagus'], ans: 0, hint: 'It churns food for a few hours.', why: 'The stomach makes hydrochloric acid, which kills most bacteria, and it starts digesting protein.' },
    { q: 'Where do most digested food molecules pass into the blood?', opts: ['Small intestine', 'Stomach', 'Large intestine', 'Mouth'], ans: 0, hint: 'It is long and lined with tiny finger-like villi.', why: 'The small intestine is lined with villi, which give a huge surface area for small food molecules to pass into the blood.' },
    { q: 'What is mainly absorbed in the large intestine?', opts: ['Water', 'Protein', 'Fat', 'Starch'], ans: 0, hint: 'What is left is mostly fibre and liquid.', why: 'The large intestine absorbs water from what is left, before it leaves the body.' },
    { q: 'What does the enzyme amylase do?', opts: ['Breaks starch into sugars', 'Breaks protein into amino acids', 'Kills bacteria', 'Absorbs water'], ans: 0, hint: 'It is in saliva. Chew bread for a long time and it starts to taste sweet.', why: 'Amylase breaks starch into sugars. Protease breaks down proteins, and lipase breaks down fats.' },
    { q: 'Bile helps you digest fat. Where is bile made?', opts: ['The liver', 'The stomach', 'The heart', 'The lungs'], ans: 0, hint: 'It is a big organ next to the stomach, and bile is stored in the gall bladder.', why: 'Bile is made in the liver and stored in the gall bladder. It breaks fat into tiny droplets, so the enzyme lipase can work faster.' }
  ];
  function mc(stage, ui, r) {
    var box = stage.querySelector('.q-options');
    var right; r.opts.forEach(function (t, k) {
      var b = Arcade.h('button', 'opt', t); b.type = 'button'; if (k === r.ans) right = b;
      b.addEventListener('click', function () {
        var ok = k === r.ans; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) b.disabled = true;
        ui.check(ok, { hint: r.hint, why: r.why, reveal: function () { right.classList.add('right'); } });
      });
      box.appendChild(b);
    });
    for (var n = box.children.length; n > 1; n--) box.appendChild(box.children[Math.floor(Math.random() * n)]);
  }
  Arcade.game({
    intro: 'All aboard the Digestion Express! First put the stops in order, then find out what happens at each one.',
    rounds: R.length,
    round: function (i, ui, stage) {
      var r = R[i];
      if (r.order) {
        var mixed = [2, 4, 0, 3, 1], picked = [];
        stage.innerHTML = '<p class="q-num">Build the route</p><p class="q-text">A bite of sandwich goes on a journey. <b>Tap the stops in order</b>, from first to last.</p>' +
          '<ol class="dx-route"></ol><div class="q-options dx-stops"></div><p class="actions"><button class="btn ghost" type="button" data-undo>Start again</button></p>';
        ui.owl('Where does food go in? Where does it go after you swallow?');
        var list = stage.querySelector('.dx-route'), box = stage.querySelector('.dx-stops');
        function draw() {
          list.innerHTML = picked.map(function (k) { return '<li>' + ORG[k] + '</li>'; }).join('');
          box.innerHTML = '';
          mixed.forEach(function (k) {
            if (picked.indexOf(k) >= 0) return;
            var b = Arcade.h('button', 'opt', ORG[k]); b.type = 'button';
            b.addEventListener('click', function () {
              picked.push(k); draw();
              if (picked.length === ORG.length) {
                ui.check(picked.join() === '0,1,2,3,4', {
                  hint: 'Food goes in at the mouth and down the oesophagus. Which intestine comes first? Press Start again.',
                  why: 'Mouth → oesophagus → stomach → small intestine → large intestine. What is left leaves through the anus.',
                  reveal: function () { picked = [0, 1, 2, 3, 4]; draw(); }
                });
              }
            });
            box.appendChild(b);
          });
        }
        stage.querySelector('[data-undo]').addEventListener('click', function () { if (!stage.classList.contains('locked')) { picked = []; draw(); } });
        draw(); return;
      }
      stage.innerHTML = '<p class="q-num">Stop ' + i + '</p><p class="q-text">' + r.q + '</p><div class="q-options"></div>';
      ui.owl('Think about the journey you just built.');
      mc(stage, ui, r);
    }
  });
})();
