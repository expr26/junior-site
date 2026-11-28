/* Food Detective: which nutrient is each food best known for? Then pick the most balanced lunch.
   Facts (KS2/KS3 nutrition): bread and pasta are mainly carbohydrate (starch) for energy; eggs, fish and beans give protein for
   growth and repair; butter and oil are mainly fat; oranges give vitamin C; milk gives calcium for bones and teeth;
   wholegrains and vegetables give fibre; every cell needs water. */
(function () {
  if (!window.Arcade) return;
  var R = [
    { food: '🍞 Bread', q: 'Bread is mainly which nutrient?', opts: ['Carbohydrate', 'Protein', 'Fat', 'Water'], ans: 0, hint: 'It gives you lots of energy and is made from flour.', why: 'Bread is mainly carbohydrate (starch), which your body uses for energy.' },
    { food: '🥚 Egg', q: 'Eggs are a great source of which nutrient, for growth and repair?', opts: ['Protein', 'Fibre', 'Carbohydrate', 'Vitamin C'], ans: 0, hint: 'This nutrient builds muscles and repairs your body.', why: 'Eggs are rich in protein, which your body uses to grow and repair cells.' },
    { food: '🧈 Butter', q: 'Butter is mainly which nutrient?', opts: ['Fat', 'Protein', 'Fibre', 'Minerals'], ans: 0, hint: 'It is greasy and stores a lot of energy.', why: 'Butter is mostly fat. Your body needs some fat to store energy and keep warm.' },
    { food: '🍊 Orange', q: 'Oranges are famous for which vitamin?', opts: ['Vitamin C', 'Vitamin D', 'Calcium', 'Iron'], ans: 0, hint: 'Sailors who ran out of fresh fruit got scurvy from a lack of it.', why: 'Oranges give vitamin C, which keeps your skin and gums healthy.' },
    { food: '🥛 Milk', q: 'Milk gives you which mineral, for strong bones and teeth?', opts: ['Calcium', 'Iron', 'Vitamin C', 'Fibre'], ans: 0, hint: 'Your bones and teeth are full of it.', why: 'Milk, cheese and yoghurt give calcium, which builds strong bones and teeth. Milk gives protein too.' },
    { food: '🥦 Broccoli and 🌾 wholegrain cereal', q: 'What do these give you that helps food move through your gut?', opts: ['Fibre', 'Fat', 'Protein', 'Salt'], ans: 0, hint: 'Your body can\'t digest it, but it keeps everything moving.', why: 'Fibre gives the muscles of your intestines something to push on, so food keeps moving and you don\'t get constipated.' },
    { food: '💧 Every cell in your body', q: 'Which nutrient does every cell need, and you should drink some every day?', opts: ['Water', 'Fat', 'Sugar', 'Salt'], ans: 0, hint: 'About two thirds of your body is made of it.', why: 'Water is needed by every cell. You lose some all the time in sweat, breath and wee, so you need to keep drinking.' },
    { food: '🍱 Lunchbox time', q: 'Which lunch is the most balanced?', opts: ['A chicken and salad wrap, an apple and water', 'Crisps, chocolate and a fizzy drink', 'Three bread rolls', 'Just an apple'], ans: 0, hint: 'A balanced meal has several different food groups.', why: 'The wrap gives carbohydrate, protein and some vegetables, the apple gives vitamins and fibre, and water keeps you hydrated. The others are missing whole food groups.' }
  ];
  Arcade.game({
    intro: 'Welcome, Food Detective! Work out what each food gives your body. 8 cases. No timer, so take your time.',
    rounds: R.length,
    round: function (i, ui, stage) {
      var r = R[i];
      stage.innerHTML = '<p class="q-num">Case ' + (i + 1) + '</p><p class="fd-food">' + r.food + '</p><p class="q-text">' + r.q + '</p><div class="q-options"></div>';
      ui.owl(i === 0 ? 'Think about what the food does for your body.' : i === 7 ? 'Look for a lunch with lots of different food groups.' : 'What is this food best known for?');
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
  });
})();
