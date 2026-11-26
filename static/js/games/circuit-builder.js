/* Circuit Builder: tap parts of a circuit to change them and watch the bulbs.
   Series circuits (one loop) and parallel circuits (two branches). Current flows round a loop only when every part in it conducts.
   Brightness (simple model): in series each bulb gets cells ÷ bulbs; in parallel each branch bulb gets the full cells.
   Shown as dim (less than 1), normal (1) or bright (more than 1). Materials: metals and wire conduct; plastic, rubber and wood don't. */
(function () {
  if (!window.Arcade) return;
  var h = Arcade.h;

  var MATS = { none: { name: 'nothing', icon: '', c: false }, wire: { name: 'wire', icon: '', c: true }, plastic: { name: 'plastic ruler', icon: '📏', c: false },
    rubber: { name: 'rubber band', icon: '🎈', c: false }, wood: { name: 'wooden stick', icon: '🪵', c: false }, spoon: { name: 'metal spoon', icon: '🥄', c: true },
    clip: { name: 'paper clip', icon: '📎', c: true } };

  var ROUNDS = [
    { lay: 'series', parts: [{ t: 'cell', n: 1 }, { t: 'bulb', on: true }, { t: 'gap', mat: 'none', mats: ['none', 'wire'] }],
      task: 'The bulb is off because there\'s a gap. Tap the gap to fix the circuit, then press <b>Done</b>.', ok: function (s) { return s.lit > 0; },
      hint: 'Tap the gap on the right until a wire fills it.', why: 'Electricity needs a complete loop with no gaps. Then current can flow and the bulb lights.' },
    { lay: 'series', parts: [{ t: 'cell', n: 1 }, { t: 'bulb', on: true }, { t: 'gap', mat: 'plastic', mats: ['plastic', 'rubber', 'wood', 'spoon'] }],
      task: 'Try different things in the gap. Find the one that <b>lights the bulb</b>, then press <b>Done</b>.', ok: function (s) { return s.lit > 0; },
      hint: 'Keep tapping the gap to try each object. Electricity flows through metals.', why: 'The metal spoon is a conductor: it lets electricity through. Plastic, rubber and wood are insulators.' },
    { lay: 'series', parts: [{ t: 'cell', n: 1 }, { t: 'bulb', on: true }, { t: 'switch', closed: true }],
      task: 'Use the switch to turn the bulb <b>off</b>, then press <b>Done</b>.', ok: function (s) { return s.lit === 0; },
      hint: 'Tap the switch to open it.', why: 'Opening the switch makes a gap in the circuit, so the current stops and the bulb goes out.' },
    { lay: 'series', parts: [{ t: 'cell', n: 1 }, { t: 'bulb', on: true }, { t: 'slot', has: false }],
      q: 'Tap the dotted spot to add a second bulb <b>in series</b>. What happens to the brightness?', opts: ['The bulbs get dimmer', 'The bulbs get brighter', 'Nothing changes'], ans: 0,
      hint: 'Tap the dotted spot to add and remove the second bulb. Compare the glow.', why: 'With two bulbs in series, they share the push from the cell, so each bulb is dimmer.' },
    { lay: 'series', parts: [{ t: 'cell', n: 1, tap: true }, { t: 'bulb', on: true }, { t: 'bulb', on: true }],
      task: 'These two bulbs are dim. Make them shine at <b>normal</b> brightness, then press <b>Done</b>.', ok: function (s) { return s.level === 'normal'; },
      hint: 'Tap the cell to add a second cell.', why: 'Two cells give twice the push, so two bulbs in series shine as brightly as one bulb with one cell.' },
    { lay: 'series', parts: [{ t: 'cell', n: 1 }, { t: 'bulb', on: true, tap: true }, { t: 'bulb', on: true, tap: true }],
      q: 'Tap a bulb to unscrew it. What happens to the <b>other</b> bulb in this series circuit?', opts: ['It goes out too', 'It stays on', 'It gets brighter'], ans: 0,
      hint: 'Unscrew one bulb and look at the other one.', why: 'In a series circuit there is only one path. Unscrewing a bulb breaks the loop, so all the bulbs go out.' },
    { lay: 'parallel', branches: [[{ t: 'bulb', on: true, tap: true }], [{ t: 'bulb', on: true, tap: true }]],
      q: 'This is a <b>parallel</b> circuit. Unscrew one bulb. What happens to the other one?', opts: ['It goes out too', 'It stays on', 'It gets dimmer'], ans: 1,
      hint: 'Unscrew one bulb and follow the other path with your finger.', why: 'In parallel each bulb has its own path to the cell, so the other bulb stays on.' },
    { lay: 'parallel', branches: [[{ t: 'switch', closed: true }, { t: 'bulb', on: true }], [{ t: 'switch', closed: true }, { t: 'bulb', on: true }]],
      q: 'In which kind of circuit can you switch each bulb on and off <b>on its own</b>?', opts: ['Series', 'Parallel'], ans: 1,
      hint: 'Try the two switches in this parallel circuit. Does each one control just one bulb?', why: 'In a parallel circuit each branch can have its own switch, like the lights in different rooms of a house.' }
  ];

  function conducts(p) { return p.t === 'cell' || (p.t === 'bulb' && p.on) || (p.t === 'switch' && p.closed) || (p.t === 'gap' && MATS[p.mat].c) || (p.t === 'slot'); }

  function state(R) {   // which bulbs glow and how much
    var out = { glow: [], lit: 0, level: '' };
    if (R.lay === 'series') {
      var cells = R.parts[0].n, ok = R.parts.every(conducts);
      var bulbs = R.parts.filter(function (p) { return p.t === 'bulb' || (p.t === 'slot' && p.has); }).length;
      var r = ok && bulbs ? cells / bulbs : 0;
      R.parts.forEach(function (p) { out.glow.push(p.t === 'bulb' || (p.t === 'slot' && p.has) ? (p.t === 'bulb' && !p.on ? 0 : r) : null); });
      out.lit = r ? bulbs : 0; out.flow = [ok];
    } else {
      out.flow = R.branches.map(function (b) { return b.every(conducts); });
      R.branches.forEach(function (b, k) { b.forEach(function (p) { out.glow.push(p.t === 'bulb' ? (out.flow[k] ? 1 : 0) : null); }); });
      out.lit = out.flow.filter(Boolean).length;
    }
    var g = out.glow.filter(function (x) { return x; });
    out.level = !g.length ? 'off' : g[0] < 1 ? 'dim' : g[0] > 1 ? 'bright' : 'normal';
    return out;
  }

  function part(p, x, y, v, glow, id) {
    var s = '<g class="cb-part' + (p.tap || p.t === 'switch' || p.t === 'gap' || p.t === 'slot' ? ' cb-tap' : '') + '" data-id="' + id + '" transform="translate(' + x + ' ' + y + ')' + (v ? ' rotate(90)' : '') + '"' +
      (p.tap || p.t === 'switch' || p.t === 'gap' || p.t === 'slot' ? ' tabindex="0" role="button"' : '') + '>' +
      '<rect x="-30" y="-24" width="60" height="48" class="cb-patch"/>';
    function stubs(a) { return '<line x1="-30" y1="0" x2="' + (-a) + '" y2="0" class="cb-w"/><line x1="' + a + '" y1="0" x2="30" y2="0" class="cb-w"/>'; }
    if (p.t === 'cell') {
      s += p.n === 1 ? stubs(4) + '<line x1="-4" y1="-17" x2="-4" y2="17" class="cb-cl"/><line x1="4" y1="-9" x2="4" y2="9" class="cb-cs"/>' :
        stubs(14) + '<line x1="-14" y1="-17" x2="-14" y2="17" class="cb-cl"/><line x1="-6" y1="-9" x2="-6" y2="9" class="cb-cs"/><line x1="-6" y1="0" x2="6" y2="0" class="cb-w"/>' +
        '<line x1="6" y1="-17" x2="6" y2="17" class="cb-cl"/><line x1="14" y1="-9" x2="14" y2="9" class="cb-cs"/>';
    } else if (p.t === 'bulb' || (p.t === 'slot' && p.has)) {
      if (p.t === 'bulb' && !p.on) s += stubs(16) + '<circle r="14" class="cb-out"/>';
      else s += (glow ? '<circle r="' + (glow < 1 ? 20 : glow > 1 ? 34 : 27) + '" class="cb-glow" style="opacity:' + (glow < 1 ? .35 : glow > 1 ? 1 : .8) + '"/>' : '') +
        stubs(14) + '<circle r="14" class="cb-bulb' + (glow ? ' on' : '') + '"/><path d="M-10 -10 L10 10 M10 -10 L-10 10" class="cb-x"/>';
    } else if (p.t === 'slot') {
      s += '<line x1="-30" y1="0" x2="30" y2="0" class="cb-w"/><circle r="15" class="cb-dash"/><text y="6" text-anchor="middle" class="cb-plus"' + (v ? ' transform="rotate(-90)"' : '') + '>+</text>';
    } else if (p.t === 'switch') {
      s += stubs(13) + '<circle cx="-13" r="3.5" class="cb-dot"/><circle cx="13" r="3.5" class="cb-dot"/>' +
        (p.closed ? '<line x1="-13" y1="0" x2="13" y2="0" class="cb-sw"/>' : '<line x1="-13" y1="0" x2="9" y2="-15" class="cb-sw"/>');
    } else if (p.t === 'gap') {
      s += stubs(16) + '<circle cx="-16" r="4" class="cb-dot"/><circle cx="16" r="4" class="cb-dot"/>' + (p.mat === 'wire' ? '<line x1="-16" y1="0" x2="16" y2="0" class="cb-w"/>' : '');
    }
    s += '</g>';
    if (p.t === 'gap' && MATS[p.mat].icon) s += '<text x="' + x + '" y="' + (y + 9) + '" text-anchor="middle" class="cb-mat">' + MATS[p.mat].icon + '</text>';
    if (p.t === 'gap') s += '<text x="' + (x + (v ? 0 : 0)) + '" y="' + (y + (v ? 46 : 40)) + '" text-anchor="middle" class="cb-lab">' + MATS[p.mat].name + '</text>';
    return s;
  }

  Arcade.game({
    intro: 'Welcome to the electronics lab! Tap the parts of each circuit to change them and watch what the bulbs do.',
    rounds: ROUNDS.length,
    round: function (i, ui, stage) {
      var R = JSON.parse(JSON.stringify(ROUNDS[i])); R.ok = ROUNDS[i].ok;
      stage.innerHTML = '<p class="q-num">Circuit ' + (i + 1) + ' · ' + (R.lay === 'series' ? 'series' : 'parallel') + '</p>' +
        '<p class="q-text">' + (R.task || R.q) + '</p>' +
        '<svg class="cb-svg" viewBox="0 0 400 270" role="img"></svg>' +
        '<p class="cb-out-txt" aria-live="polite"></p>' +
        (R.task ? '<p class="actions cb-act"><button class="btn" type="button" data-done>Done ✓</button></p>' : '<div class="q-options"></div>');
      var svg = stage.querySelector('svg'), txt = stage.querySelector('.cb-out-txt');
      ui.owl(i === 0 ? 'Tip: the parts with a dotted outline can be tapped.' : i === 6 ? 'Parallel means there is more than one path for the current.' : 'Tap the parts to experiment!');

      var list = [];
      function draw() {
        var st = state(R), s = '', k = 0;
        list = [];
        if (R.lay === 'series') {
          s += '<rect x="60" y="45" width="280" height="170" rx="14" class="cb-w cb-loop' + (st.flow[0] ? ' flow' : '') + '"/>';
          var pos = [[60, 130, 1], [200, 45, 0], [340, 130, 1]];
          R.parts.forEach(function (p, j) { list.push(p); s += part(p, pos[j][0], pos[j][1], pos[j][2], st.glow[j], j); });
        } else {
          var any = st.flow.some(Boolean), xs = [210, 340];
          s += '<path d="M60 40 H' + xs[1] + ' M60 220 H' + xs[1] + ' M60 40 V220" class="cb-w' + (any ? ' flow' : '') + '"/>';
          xs.forEach(function (x, b) { s += '<line x1="' + x + '" y1="40" x2="' + x + '" y2="220" class="cb-w' + (st.flow[b] ? ' flow' : '') + '"/>'; });
          s += part({ t: 'cell', n: 1 }, 60, 130, 1, null, 'c');
          var g = 0;
          R.branches.forEach(function (br, b) {
            br.forEach(function (p, j) {
              var y = br.length === 1 ? 130 : (j === 0 ? 90 : 170);
              list.push(p); s += part(p, xs[b], y, 1, st.glow[g], list.length - 1); g++;
            });
          });
          s += '<text x="' + xs[0] + '" y="262" text-anchor="middle" class="cb-lab">path 1</text><text x="' + xs[1] + '" y="262" text-anchor="middle" class="cb-lab">path 2</text>';
        }
        svg.innerHTML = s;
        txt.innerHTML = st.lit ? '💡 ' + (st.lit > 1 ? 'Bulbs are' : 'The bulb is') + ' <b>' + (st.level === 'normal' ? 'on (normal brightness)' : st.level) + '</b>' + (R.lay === 'parallel' && st.lit === 1 ? ' (only one path is complete)' : '') + '.' :
          '⚫ No current: ' + (R.lay === 'series' ? 'the loop has a gap.' : 'no path is complete.');
        svg.setAttribute('aria-label', 'Circuit diagram. ' + txt.textContent);
        return st;
      }

      function tap(id) {
        if (stage.classList.contains('locked') && R.task) return;
        var p = id === 'c' ? null : list[+id];
        if (!p) return;
        if (p.t === 'switch') p.closed = !p.closed;
        else if (p.t === 'gap') p.mat = p.mats[(p.mats.indexOf(p.mat) + 1) % p.mats.length];
        else if (p.t === 'slot') p.has = !p.has;
        else if (p.t === 'cell' && p.tap) p.n = p.n === 1 ? 2 : 1;
        else if (p.t === 'bulb' && p.tap) p.on = !p.on;
        else return;
        draw();
        var el = svg.querySelector('[data-id="' + id + '"]'); if (el) el.focus({ preventScroll: true });
      }
      svg.addEventListener('click', function (e) { var g = e.target.closest('.cb-part'); if (g) tap(g.getAttribute('data-id')); });
      svg.addEventListener('keydown', function (e) { if (e.key !== 'Enter' && e.key !== ' ') return; var g = e.target.closest('.cb-part'); if (g) { e.preventDefault(); tap(g.getAttribute('data-id')); } });

      if (R.task) {
        stage.querySelector('[data-done]').addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          ui.check(R.ok(state(R)), { hint: R.hint, why: R.why });
        });
      } else {
        var box = stage.querySelector('.q-options');
        R.opts.forEach(function (o, k) {
          var b = h('button', 'opt', o); b.type = 'button';
          b.addEventListener('click', function () {
            b.classList.add(k === R.ans ? 'right' : 'wrong'); if (k !== R.ans) b.disabled = true;
            ui.check(k === R.ans, { hint: R.hint, why: R.why, reveal: function () { box.children[R.ans].classList.add('right'); } });
          });
          box.appendChild(b);
        });
      }
      draw();
    }
  });
})();
