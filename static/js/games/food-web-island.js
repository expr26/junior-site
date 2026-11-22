/* Food Web Island: a simple island food web. Arrows point from the food to the animal that eats it (the way energy flows).
   Web: grass -> rabbit, mouse, caterpillar; caterpillar -> thrush; rabbit -> fox; mouse -> fox, owl; thrush -> owl.
   Effects after removing an animal are written by hand per round (a simple model: first and second knock-on effects only).
   Check every answer by hand when editing ROUNDS or the web. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var N = {
    fox: { e: '🦊', name: 'Fox', pl: 'foxes', x: 110, y: 42 },
    owl: { e: '🦉', name: 'Owl', x: 290, y: 42 },
    rabbit: { e: '🐇', name: 'Rabbit', x: 52, y: 128 },
    mouse: { e: '🐭', name: 'Mouse', pl: 'mice', x: 180, y: 128 },
    thrush: { e: '🐦', name: 'Thrush', x: 345, y: 118 },
    cat: { e: '🐛', name: 'Caterpillar', pl: 'caterpillars', x: 285, y: 212 },
    grass: { e: '🌿', name: 'Grass', x: 180, y: 262 }
  };
  var EATS = [['grass', 'rabbit'], ['grass', 'mouse'], ['grass', 'cat'], ['cat', 'thrush'], ['rabbit', 'fox'], ['mouse', 'fox'], ['mouse', 'owl'], ['thrush', 'owl']];

  var ROUNDS = [
    { tap: 'grass', text: 'Tap the <b>producer</b>: the living thing that makes its own food using energy from sunlight.',
      hint: 'Animals cannot make their own food. Which one is a plant?', why: 'Grass is a producer. Plants make their own food by photosynthesis, using energy from sunlight. Every food chain starts with a producer.' },
    { q: 'What do the arrows in a food web show?', opts: ['Energy passing from the food to the animal that eats it', 'Which animal is bigger', 'The arrow points to the animal that gets eaten'], ans: 0,
      hint: 'Look at the arrow from the grass to the rabbit. Which one eats the other?', why: 'Each arrow points from the food to the animal that eats it. Grass → rabbit means the rabbit gets its energy by eating grass.' },
    { tap: 'thrush', text: 'Tap the animal that eats the <b>caterpillars</b> 🐛.',
      hint: 'Find the arrow that starts at the caterpillar and follow it.', why: 'The arrow goes from the caterpillar to the thrush, so the thrush eats caterpillars.' },
    { gone: 'fox', q: 'A disease wipes out all the foxes 🦊. What happens to the number of rabbits?', opts: ['It goes up', 'It goes down', 'It stays the same'], ans: 0, fx: { rabbit: 1, mouse: 1 },
      hint: 'Which animal used to eat the rabbits?', why: 'The foxes ate rabbits. With no foxes, fewer rabbits are eaten, so the number of rabbits goes up. The same happens to the mice.' },
    { gone: 'fox', q: 'Still no foxes, so there are many more rabbits and mice. What happens to the grass?', opts: ['It goes down', 'It goes up', 'It stays the same'], ans: 0, fx: { rabbit: 1, mouse: 1, grass: -1 },
      hint: 'What do rabbits and mice eat?', why: 'More rabbits and mice eat more grass, so the amount of grass goes down. Losing the foxes affected a plant they never even ate!' },
    { gone: 'cat', q: 'A very cold spring kills all the caterpillars 🐛. What happens to the thrushes?', opts: ['They go down: they have lost their only food', 'They go up', 'Nothing happens to them'], ans: 0, fx: { thrush: -1 },
      hint: 'Follow the arrows into the thrush. What else does it eat in this web?', why: 'In this food web, caterpillars are the thrushes\' only food, so the number of thrushes goes down.' },
    { gone: 'mouse', tap: 'thrush', text: 'All the mice 🐭 have gone. The owls need other food. Tap the animal the owls will now eat <b>more</b> of.', fx: { thrush: -1 },
      hint: 'Look at all the arrows going into the owl. Which one is still there?', why: 'Owls also eat thrushes, so they hunt more thrushes and the number of thrushes goes down. (The foxes will eat more rabbits too.)' },
    { q: 'Why can losing just one species harm a whole food web?', opts: ['Other living things depend on it, so the effects spread through the web', 'It cannot: the others carry on exactly the same', 'Only the animals that eat it are affected'], ans: 0,
      hint: 'Think about the foxes and the grass a few questions ago.', why: 'Living things in a food web depend on each other (interdependence). A change to one population spreads to others, even ones far away in the web.' }
  ];

  function f(v) { return v.toFixed(1); }

  Arcade.game({
    intro: 'Welcome to Food Web Island! Find out who eats whom, then see what happens when one animal disappears.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], fx = null, wrongTap = null, rightTap = null;
      stage.innerHTML = '<p class="q-num">Island report ' + (i + 1) + '</p><p class="q-text">' + (R.text || R.q) + '</p>' +
        '<svg class="fw-svg" viewBox="0 0 400 300" role="img"></svg><p class="fw-out" aria-live="polite"></p>' + (R.q ? '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.fw-out');
      ui.owl(R.tap ? 'Tap a living thing on the island to choose it.' : R.gone ? 'Follow the arrows to see who depends on whom.' : 'Arrows point from the food to the animal that eats it.');

      function draw() {
        var s = '<defs><marker id="fw-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" class="fw-head"/></marker></defs>';
        s += '<ellipse cx="200" cy="300" rx="230" ry="40" class="fw-sand"/>';
        EATS.forEach(function (p) {
          var a = N[p[0]], b = N[p[1]], dx = b.x - a.x, dy = b.y - a.y, L = Math.sqrt(dx * dx + dy * dy), ux = dx / L, uy = dy / L;
          var off = R.gone === p[0] || R.gone === p[1];
          s += '<line x1="' + f(a.x + ux * 30) + '" y1="' + f(a.y + uy * 30) + '" x2="' + f(b.x - ux * 31) + '" y2="' + f(b.y - uy * 31) + '" class="fw-arrow' + (off ? ' off' : '') + '" marker-end="url(#fw-ah)"/>';
        });
        Object.keys(N).forEach(function (k) {
          var n = N[k], gone = R.gone === k, cls = 'fw-node' + (gone ? ' gone' : '') + (R.tap && !gone ? ' tap' : '') + (k === wrongTap ? ' wrong' : '') + (k === rightTap ? ' right' : '');
          s += '<g class="' + cls + '" data-k="' + k + '"' + (R.tap && !gone ? ' role="button" tabindex="0" aria-label="' + n.name + '"' : '') + '>' +
            '<circle cx="' + n.x + '" cy="' + n.y + '" r="26" class="fw-c"/><text x="' + n.x + '" y="' + (n.y + 10) + '" text-anchor="middle" class="fw-e">' + n.e + '</text>' +
            '<text x="' + n.x + '" y="' + (n.y + (k === 'grass' ? -32 : 42)) + '" text-anchor="middle" class="fw-name">' + n.name + '</text>' +
            (gone ? '<path d="M' + (n.x - 18) + ' ' + (n.y - 18) + ' l36 36 m0 -36 l-36 36" class="fw-x"/>' : '');
          if (fx && fx[k]) s += '<circle cx="' + (n.x + 22) + '" cy="' + (n.y - 20) + '" r="11" class="fw-b ' + (fx[k] > 0 ? 'up' : 'down') + '"/><text x="' + (n.x + 22) + '" y="' + (n.y - 15) + '" text-anchor="middle" class="fw-bt">' + (fx[k] > 0 ? '↑' : '↓') + '</text>';
          s += '</g>';
        });
        svg.innerHTML = s;
        var gone = R.gone ? N[R.gone].pl : '';
        svg.setAttribute('aria-label', 'Food web on the island.' + (gone ? ' All the ' + gone + ' have gone.' : '') +
          (fx ? ' ' + Object.keys(fx).map(function (k) { return N[k].name + (fx[k] > 0 ? ' goes up' : ' goes down'); }).join(', ') + '.' : ''));
        if (fx) out.innerHTML = Object.keys(fx).map(function (k) { return N[k].e + ' ' + N[k].name + ' <b>' + (fx[k] > 0 ? 'up ↑' : 'down ↓') + '</b>'; }).join(' · ');
        else out.innerHTML = gone ? 'All the ' + gone + ' have gone from the island.' : '';
      }

      function done() { if (stage.classList.contains('locked')) { if (R.fx) fx = R.fx; draw(); } }

      if (R.tap) {
        svg.addEventListener('click', function (ev) {
          var g = ev.target.closest('.fw-node.tap'); if (!g || stage.classList.contains('locked')) return;
          var k = g.getAttribute('data-k'), ok = k === R.tap;
          wrongTap = ok ? null : k; rightTap = ok ? k : null; draw();
          ui.check(ok, { hint: R.hint, why: R.why, reveal: function () { wrongTap = null; rightTap = R.tap; draw(); } });
          done();
        });
        svg.addEventListener('keydown', function (ev) { if ((ev.key === 'Enter' || ev.key === ' ') && ev.target.closest('.fw-node.tap')) { ev.preventDefault(); ev.target.dispatchEvent(new MouseEvent('click', { bubbles: true })); } });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            done();
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
