/* Bar Chart Builder: read a table, then set each bar to the right height on the scale. The scale goes up in 1s, 2s, 5s
   and 10s, so some bars end halfway between two lines. Then two questions read the last chart.
   Checks: Y4 45 − Y5 20 = 25; 30 + 45 + 20 = 95. */
(function () {
  if (!window.Arcade) return;
  var R = [
    { title: 'Favourite pets', unit: 'children', top: 10, step: 1, inc: 1, bars: [['Dog', 5], ['Cat', 7], ['Fish', 2]], tip: 'The scale goes up in 1s. Make each bar reach its number.' },
    { title: 'Fruit eaten at lunch', unit: 'pieces', top: 12, step: 2, inc: 1, bars: [['Apple', 8], ['Banana', 5], ['Pear', 10]], tip: 'The scale goes up in 2s, so 5 is halfway between 4 and 6.' },
    { title: 'Cars past the school', unit: 'cars', top: 30, step: 5, inc: 5, bars: [['Mon', 15], ['Tue', 25], ['Wed', 10]], tip: 'Now the lines go up in 5s. Each tap adds 5.' },
    { title: 'Library books borrowed', unit: 'books', top: 50, step: 10, inc: 5, bars: [['Y3', 30], ['Y4', 45], ['Y5', 20]], tip: 'The lines go up in 10s, and each tap adds 5. Where is 45?' },
    { q: 'How many more books did Year 4 borrow than Year 5?', opts: ['25', '20', '15', '65'], ans: 0, hint: 'Read Y4 and Y5 from the chart, then subtract.', why: 'Year 4 borrowed 45 and Year 5 borrowed 20. 45 − 20 = 25 more.' },
    { q: 'How many books were borrowed altogether?', opts: ['95', '85', '100', '90'], ans: 0, hint: 'Add all three bars.', why: '30 + 45 + 20 = 95 books.' }
  ];
  function chart(r, vals, cls) {
    var x0 = 40, y0 = 210, h = 180, bw = 70, w = bw * r.bars.length + 16, p = [];
    for (var v = 0; v <= r.top; v += r.step) {
      var y = y0 - h * v / r.top;
      p.push('<line class="bb-grid" x1="' + x0 + '" y1="' + y + '" x2="' + (x0 + w) + '" y2="' + y + '"/>');
      p.push('<text class="bb-num" x="' + (x0 - 6) + '" y="' + (y + 4) + '" text-anchor="end">' + v + '</text>');
    }
    p.push('<line class="bb-axis" x1="' + x0 + '" y1="' + (y0 - h) + '" x2="' + x0 + '" y2="' + y0 + '"/><line class="bb-axis" x1="' + x0 + '" y1="' + y0 + '" x2="' + (x0 + w) + '" y2="' + y0 + '"/>');
    r.bars.forEach(function (b, k) {
      var x = x0 + 12 + k * bw, yy = y0 - h * vals[k] / r.top;
      p.push('<rect class="bb-bar' + (cls ? ' ' + cls : '') + '" x="' + x + '" y="' + yy + '" width="' + (bw - 22) + '" height="' + (y0 - yy) + '" rx="3"/>');
      p.push('<text class="bb-lab" x="' + (x + (bw - 22) / 2) + '" y="' + (y0 + 18) + '" text-anchor="middle">' + b[0] + '</text>');
    });
    return '<svg class="bb-svg" viewBox="0 0 ' + (x0 + w + 8) + ' ' + (y0 + 26) + '" role="img" aria-label="Bar chart of ' + r.title + '"><text class="bb-unit" x="4" y="14">' + r.unit + '</text>' + p.join('') + '</svg>';
  }
  function table(r) {
    return '<table class="bb-table"><tr><th>' + r.title + '</th><th>' + r.unit + '</th></tr>' +
      r.bars.map(function (b) { return '<tr><td>' + b[0] + '</td><td>' + b[1] + '</td></tr>'; }).join('') + '</table>';
  }
  Arcade.game({
    intro: 'Welcome to Bar Chart Builder! Read the table, then make each bar the right height. Watch the scale: it does not always go up in 1s.',
    rounds: R.length,
    round: function (i, ui, stage) {
      var r = R[i];
      if (r.q) {
        var last = R[3];
        stage.innerHTML = '<p class="q-num">Read the chart</p>' + chart(last, last.bars.map(function (b) { return b[1]; }), 'done') + '<p class="q-text">' + r.q + '</p><div class="q-options"></div>';
        ui.owl('Read the bars carefully against the scale.');
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
        return;
      }
      var vals = r.bars.map(function () { return 0; });
      stage.innerHTML = '<p class="q-num">Chart ' + (i + 1) + '</p><p class="q-text">Make the bar chart match the table.</p>' + table(r) +
        '<div class="bb-chart"></div><div class="bb-ctrl">' + r.bars.map(function (b, k) {
          return '<div class="bb-c"><span>' + b[0] + '</span><button class="btn ghost" type="button" data-k="' + k + '" data-d="-1" aria-label="' + b[0] + ' down ' + r.inc + '">−</button>' +
            '<button class="btn ghost" type="button" data-k="' + k + '" data-d="1" aria-label="' + b[0] + ' up ' + r.inc + '">+</button></div>';
        }).join('') + '</div><p class="actions"><button class="btn" type="button" data-check>Check ✓</button></p>';
      ui.owl(r.tip);
      var holder = stage.querySelector('.bb-chart');
      function draw() { holder.innerHTML = chart(r, vals); }
      stage.querySelectorAll('[data-k]').forEach(function (b) {
        b.addEventListener('click', function () {
          if (stage.classList.contains('locked')) return;
          var k = +b.getAttribute('data-k');
          vals[k] = Math.max(0, Math.min(r.top, vals[k] + r.inc * +b.getAttribute('data-d'))); draw();
        });
      });
      stage.querySelector('[data-check]').addEventListener('click', function () {
        var wrong = r.bars.filter(function (b, k) { return vals[k] !== b[1]; }).map(function (b) { return b[0]; });
        ui.check(!wrong.length, {
          hint: 'Check ' + wrong.join(' and ') + '. ' + r.tip,
          why: r.bars.map(function (b) { return b[0] + ': ' + b[1]; }).join(', ') + '.',
          reveal: function () { vals = r.bars.map(function (b) { return b[1]; }); draw(); }
        });
      });
      draw();
    }
  });
})();
