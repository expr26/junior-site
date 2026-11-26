/* Magnet Sandbox: like poles repel, unlike poles attract; iron, steel (and nickel, cobalt) are magnetic, most other materials
   (aluminium, copper, plastic, wood) are not; field lines run from N to S outside a magnet and are closest together at the poles.
   Compass needles in the field view point along the field of a bar magnet (two-pole model). */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;
  var still = (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) || document.documentElement.getAttribute('data-rs-calm') === 'on';

  var OBJ = [
    { id: 'clip', name: 'Steel paper clip', icon: '📎', mag: true }, { id: 'bolt', name: 'Iron bolt', icon: '🔩', mag: true },
    { id: 'coin', name: 'Copper coin', icon: '🪙', mag: false }, { id: 'foil', name: 'Aluminium foil', icon: '', mag: false },
    { id: 'ruler', name: 'Plastic ruler', icon: '📏', mag: false }, { id: 'pencil', name: 'Wooden pencil', icon: '✏️', mag: false }
  ];

  var ROUNDS = [
    { mode: 'pair', flipB: true, startB: 'NS', task: 'Turn the right-hand magnet so the two magnets <b>pull together</b>, then press <b>Done</b>.', want: 'attract',
      hint: 'Tap the right magnet to turn it round, then press Test. Opposite poles (N and S) attract.', why: 'A north pole and a south pole attract each other.' },
    { mode: 'pair', flipB: true, startB: 'NS', q: 'Two <b>north</b> poles are pushed towards each other. What happens?', opts: ['They pull together (attract)', 'They push apart (repel)', 'Nothing'], ans: 1,
      hint: 'Set up N facing N and press Test.', why: 'Like poles (N and N, or S and S) repel each other.' },
    { mode: 'objects', q: 'Test the objects. Which one is <b>attracted</b> to the magnet?', opts: ['Steel paper clip', 'Copper coin', 'Plastic ruler'], ans: 0,
      hint: 'Tap each object to bring it near the magnet.', why: 'Steel is mostly iron, which is a magnetic material.' },
    { mode: 'objects', q: 'Which of these metals is <b>not</b> attracted to a magnet?', opts: ['Iron bolt', 'Steel paper clip', 'Aluminium foil'], ans: 2,
      hint: 'Not every metal is magnetic! Test the aluminium foil.', why: 'Only a few metals are magnetic: iron, steel, nickel and cobalt. Aluminium and copper are not.' },
    { mode: 'field', q: 'Outside a magnet, the magnetic field lines go from…', opts: ['North pole to south pole', 'South pole to north pole'], ans: 0,
      hint: 'Follow the arrows on the lines, and look at the red end of the compass needles.', why: 'Field lines point away from the north pole and towards the south pole.' },
    { mode: 'field', q: 'Where is the magnetic field <b>strongest</b>?', opts: ['At the poles', 'In the middle of the magnet\'s side', 'Far away from the magnet'], ans: 0,
      hint: 'Where are the field lines closest together?', why: 'The field is strongest at the poles, where the field lines are closest together.' },
    { mode: 'field', compassOnly: true, q: 'A compass needle is a tiny magnet. Why does it point north wherever you are?', opts: ['The Earth has a magnetic field', 'The wind pushes it', 'The Sun pulls it'], ans: 0,
      hint: 'The needle lines up with a magnetic field. What big object around us has one?', why: 'The Earth acts like a giant magnet, and a compass needle lines up with its magnetic field.' },
    { mode: 'pair', flipB: true, startB: 'SN', task: 'Now make the two magnets <b>push apart</b>, then press <b>Done</b>.', want: 'repel',
      hint: 'Tap the right magnet to turn it, then press Test. Which poles must face each other to repel?', why: 'Like poles facing each other (N with N, or S with S) repel.' }
  ];

  function magnet(x, y, w, left, cls) {   // left = pole on the left end
    var right = left === 'N' ? 'S' : 'N';
    function half(px, p) { return '<rect x="' + px + '" y="' + (y - 18) + '" width="' + (w / 2) + '" height="36" class="ms-' + p + '"/><text x="' + (px + w / 4) + '" y="' + (y + 8) + '" text-anchor="middle" class="ms-pl">' + p + '</text>'; }
    return '<g class="' + (cls || '') + '">' + half(x, left) + half(x + w / 2, right) + '<rect x="' + x + '" y="' + (y - 18) + '" width="' + w + '" height="36" rx="4" class="ms-edge"/></g>';
  }

  Arcade.game({
    intro: 'Welcome to the Magnet Sandbox! Test magnets, materials and magnetic fields.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = ROUNDS[i], B = R.startB || 'SN', busy = false, tested = 0, near = null;
      stage.innerHTML = '<p class="q-num">Experiment ' + (i + 1) + '</p>' + '<p class="q-text">' + (R.task || R.q) + '</p>' +
        '<svg class="ms-svg" viewBox="0 0 400 200" role="img"></svg><p class="ms-out" aria-live="polite"></p>' +
        (R.mode === 'pair' ? '<p class="actions ms-act"><button class="btn ghost" type="button" data-flip>Turn right magnet ↻</button><button class="btn" type="button" data-test>Test ▶</button>' +
          (R.task ? '<button class="btn ghost" type="button" data-done>Done ✓</button>' : '') + '</p>' : '') +
        (R.mode === 'objects' ? '<div class="ms-objs" role="group" aria-label="Objects to test">' + OBJ.map(function (o) {
          return '<button class="opt ms-obj" type="button" data-o="' + o.id + '">' + (o.icon ? '<span aria-hidden="true">' + o.icon + '</span> ' : '') + o.name + '</button>'; }).join('') + '</div>' : '') +
        (R.q ? (R.mode === 'objects' ? '<p class="q-num ms-ans">Your answer</p>' : '') + '<div class="q-options"></div>' : '');
      var svg = stage.querySelector('svg'), out = stage.querySelector('.ms-out');

      ui.owl(R.mode === 'pair' ? 'Red is <b>N</b> (north), blue is <b>S</b> (south). Turn the right magnet and press Test.' :
        R.mode === 'objects' ? 'Tap an object to bring it near the magnet.' : 'The red end of each compass needle points along the field.');

      function pair(dx) {
        var facing = B[0], aRight = 'N';
        svg.innerHTML = magnet(40, 100, 130, 'S') + magnet(230 + (dx || 0), 100, 130, B[0], 'ms-b') +
          '<text x="105" y="150" text-anchor="middle" class="ms-cap">fixed</text><text x="' + (295 + (dx || 0)) + '" y="150" text-anchor="middle" class="ms-cap">tap ↻ to turn</text>';
        svg.setAttribute('aria-label', 'Left magnet S then N. Right magnet ' + B[0] + ' then ' + B[1] + '. Facing poles: N and ' + facing + '.');
        return facing === aRight ? 'repel' : 'attract';
      }
      function test() {
        if (busy) return;
        var kind = pair(), dist = kind === 'attract' ? -60 : 70; tested++;
        function done() { out.innerHTML = kind === 'attract' ? '🧲 <b>Click!</b> N and S <b>attract</b>: they pull together.' : '💨 <b>Boing!</b> N and N <b>repel</b>: they push apart.'; busy = false; }
        if (still) { pair(dist); done(); return; }
        busy = true; var t0 = performance.now();
        (function f(t) { var p = Math.min(1, (t - t0) / 500), e = kind === 'attract' ? p * p : 1 - Math.pow(1 - p, 3); pair(dist * e); if (p < 1) requestAnimationFrame(f); else done(); })(t0);
      }

      function objects() {
        var s = magnet(135, 60, 130, 'S');
        if (near) {
          var o = OBJ.filter(function (x) { return x.id === near; })[0];
          s += '<text x="200" y="' + (o.mag ? 112 : 170) + '" text-anchor="middle" class="ms-objicon">' + (o.icon || '🥈') + '</text>' +
            '<text x="200" y="195" text-anchor="middle" class="ms-cap">' + o.name + '</text>';
        }
        svg.innerHTML = s;
      }
      function testObj(id) {
        var o = OBJ.filter(function (x) { return x.id === id; })[0];
        near = id; objects(); tested++;
        out.innerHTML = o.mag ? '🧲 The <b>' + o.name.toLowerCase() + '</b> jumps up and <b>sticks</b>: it is magnetic.' : '😐 The <b>' + o.name.toLowerCase() + '</b> just sits there: it is <b>not</b> magnetic.';
        stage.querySelectorAll('.ms-obj').forEach(function (b) { if (b.getAttribute('data-o') === id) b.classList.add(o.mag ? 'right' : 'tested'); });
      }

      function field() {
        var N = [270, 100], S = [130, 100], s = '';
        if (!R.compassOnly) {
          [24, 48, 76].forEach(function (k, j) {   // field loops above and below, from N round to S
            [-1, 1].forEach(function (sg) {
              s += '<path d="M' + (N[0] + 4) + ' ' + (100 + sg * 8) + ' C' + (N[0] + 40 + j * 30) + ' ' + (100 + sg * (k + 30)) + ' ' + (S[0] - 40 - j * 30) + ' ' + (100 + sg * (k + 30)) + ' ' + (S[0] - 4) + ' ' + (100 + sg * 8) + '" class="ms-line"/>' +
                '<path d="M196 ' + (100 + sg * (k * .75 + 24.5)) + ' l8 -5 m-8 5 l8 5" class="ms-arrow"/>';
            });
          });
          s += '<path d="M' + (N[0] + 4) + ' 100 H392" class="ms-line"/><path d="M380 100 l-8 -5 m8 5 l-8 5" class="ms-arrow"/>' +
            '<path d="M8 100 H' + (S[0] - 4) + '" class="ms-line"/><path d="M70 100 l-8 -5 m8 5 l-8 5" class="ms-arrow"/>';
        }
        s += magnet(130, 100, 140, 'S');
        [[60, 40], [200, 30], [340, 40], [60, 160], [200, 170], [340, 160], [30, 100], [370, 100]].forEach(function (p) {
          var bx = 0, by = 0;
          [[N, 1], [S, -1]].forEach(function (q) { var dx = p[0] - q[0][0], dy = p[1] - q[0][1], r = Math.pow(dx * dx + dy * dy, 1.5); bx += q[1] * dx / r; by += q[1] * dy / r; });
          var a = Math.atan2(by, bx) * 180 / Math.PI;
          s += '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><circle r="15" class="ms-comp"/><g transform="rotate(' + a.toFixed(1) + ')"><path d="M0 -4 L12 0 L0 4 Z" class="ms-nn"/><path d="M0 -4 L-12 0 L0 4 Z" class="ms-ns"/></g></g>';
        });
        svg.innerHTML = s;
        svg.setAttribute('aria-label', 'Bar magnet with S on the left and N on the right, ' + (R.compassOnly ? '' : 'field lines from N round to S, ') + 'and compasses around it.');
        out.innerHTML = R.compassOnly ? 'Each compass needle lines up with the magnet\'s field. Far from magnets, they line up with the <b>Earth\'s</b> field.' : 'The arrows show the direction of the field.';
      }

      if (R.mode === 'pair') {
        pair(); out.innerHTML = 'Press <b>Test</b> to push the magnets together.';
        stage.querySelector('[data-flip]').addEventListener('click', function () { if (busy) return; B = B === 'SN' ? 'NS' : 'SN'; pair(); out.innerHTML = 'Press <b>Test</b> to push the magnets together.'; });
        stage.querySelector('[data-test]').addEventListener('click', test);
        svg.addEventListener('click', function (e) { if (!busy && e.target.closest('.ms-b')) { B = B === 'SN' ? 'NS' : 'SN'; pair(); } });
      } else if (R.mode === 'objects') {
        objects(); out.innerHTML = 'Tap an object below to test it.';
        stage.querySelectorAll('.ms-obj').forEach(function (b) { b.addEventListener('click', function () { testObj(b.getAttribute('data-o')); }); });
      } else field();

      if (R.task) {
        stage.querySelector('[data-done]').addEventListener('click', function () {
          if (busy || stage.classList.contains('locked')) return;
          if (!tested) { ui.owl('Press <b>Test</b> to try it first!'); return; }
          ui.check(pair() === R.want, { hint: R.hint, why: R.why });
          if (stage.classList.contains('locked')) { stage.querySelector('[data-flip]').disabled = false; stage.querySelector('[data-test]').disabled = false; }
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
            if (stage.classList.contains('locked')) stage.querySelectorAll('[data-flip],[data-test],.ms-obj').forEach(function (x) { x.disabled = false; });
          });
          box.appendChild(b);
        });
      }
    }
  });
})();
