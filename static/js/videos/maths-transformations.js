/* Pictures for the Transformations theory video (words: videos/maths/transformations.json). Stage is 640 x 360; see static/js/theory.js.
   The coordinate grid runs from −5 to 5 on both axes, 30 px per square, so every shape and point is drawn exactly where it really is. */
(function () {
  if (!window.Theory) return;

  /* Soft gradients (the Forces look). Every call makes fresh ids (prefix mDt), so groups on screen together never share one. */
  var gN = 0, EDGE = 'rgba(30,27,58,.35)';
  function gid() { return 'mDt' + (++gN); }
  function mix(hex, t) {   // t > 0 mixes towards white, t < 0 towards black
    var n = parseInt(hex.slice(1), 16), c = [n >> 16, (n >> 8) & 255, n & 255], to = t > 0 ? 255 : 0, a = Math.abs(t);
    return '#' + c.map(function (v) { return ('0' + Math.round(v + (to - v) * a).toString(16)).slice(-2); }).join('');
  }
  function lin(id, a, b, across) {
    return '<linearGradient id="' + id + '" x1="0" y1="0" x2="' + (across ? 1 : 0) + '" y2="' + (across ? 0 : 1) + '"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></linearGradient>';
  }
  function rad(id, a, b) { return '<radialGradient id="' + id + '" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="' + a + '"/><stop offset="1" stop-color="' + b + '"/></radialGradient>'; }
  function sheen(id) { return '<linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".06"/></linearGradient>'; }
  /* a solid shape: tag + its geometry attributes, filled with a soft gradient of col, a white sheen on top and a thin outline */
  function solid(tag, geo, col, o) {
    o = o || {};
    var g = gid(), h = gid();
    return '<defs>' + lin(g, o.top || mix(col, .4), col) + sheen(h) + '</defs>' +
      '<' + tag + ' ' + geo + ' fill="url(#' + g + ')"' + (o.op ? ' fill-opacity="' + o.op + '"' : '') + '/>' +
      '<' + tag + ' ' + geo + ' fill="url(#' + h + ')" stroke="' + (o.stroke || EDGE) + '" stroke-width="' + (o.sw || 2.5) + '" stroke-linejoin="round"' + (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
  }
  /* a shiny ball (dots, counters), centred at cx, cy */
  function ball(cx, cy, r, col, ring) {
    var g = gid();
    return '<defs>' + rad(g, mix(col, .5), mix(col, -.12)) + '</defs><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="url(#' + g + ')" stroke="' + (ring || '#fff') + '" stroke-width="2"/>' +
      '<ellipse cx="' + (cx - r * .3) + '" cy="' + (cy - r * .38) + '" rx="' + (r * .34) + '" ry="' + (r * .22) + '" fill="#fff" opacity=".55"/>';
  }

  var U = 30, OX = 185, OY = 180, F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function px(x) { return OX + x * U; }
  function py(y) { return OY - y * U; }
  function pts(list) { return list.map(function (p) { return px(p[0]) + ',' + py(p[1]); }).join(' '); }
  function rel(list) { return list.map(function (p) { return (p[0] * U) + ',' + (-p[1] * U); }).join(' '); }
  function poly(list, fill, stroke) { return solid('polygon', 'points="' + pts(list) + '"', fill, { stroke: stroke, sw: 3, op: .92 }); }
  function label(x, y, t, size, col, anchor) {
    return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '" font-weight="700" fill="' + col + '" text-anchor="' + (anchor || 'middle') +
      '" dominant-baseline="middle" stroke="#FFFDF7" stroke-width="5" paint-order="stroke">' + t + '</text>';
  }
  function paper(s, x, y, w, h) {   // a sheet of white paper under a grid (soft shadow, rounded corners just outside the grid)
    var g = gid();
    return s.add('<defs>' + lin(g, '#FFFFFF', '#FAF8FF') + '</defs><rect x="' + (x - 5) + '" y="' + (y - 5) + '" width="' + (w + 10) + '" height="' + (h + 10) + '" rx="9" fill="url(#' + g + ')" stroke="rgba(30,27,58,.12)" stroke-width="1.5"/>', { enter: 'fade' });
  }
  function grid(s) {
    paper(s, px(-5), py(5), 10 * U, 10 * U);
    var m = '';
    for (var i = -5; i <= 5; i++) {
      m += '<path d="M' + px(i) + ' ' + py(5) + ' V' + py(-5) + ' M' + px(-5) + ' ' + py(i) + ' H' + px(5) + '" stroke="#DCD8EE" stroke-width="1.5"/>';
    }
    m += '<path d="M' + px(-5) + ' ' + OY + ' H' + (px(5) + 8) + ' M' + OX + ' ' + py(-5) + ' V' + (py(5) - 8) + '" stroke="#1E1B3A" stroke-width="2.5" stroke-linecap="round"/>' +
      '<path d="M' + (px(5) + 2) + ' ' + (OY - 5) + ' L' + (px(5) + 9) + ' ' + OY + ' L' + (px(5) + 2) + ' ' + (OY + 5) + ' M' + (OX - 5) + ' ' + (py(5) - 2) + ' L' + OX + ' ' + (py(5) - 9) + ' L' + (OX + 5) + ' ' + (py(5) - 2) + '" fill="none" stroke="#1E1B3A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>';
    [-4, -2, 2, 4].forEach(function (n) {
      m += label(px(n), OY + 16, n < 0 ? '−' + (-n) : n, 18, '#55526E');
      m += label(OX - 7, py(n), n < 0 ? '−' + (-n) : n, 18, '#55526E', 'end');
    });
    m += label(px(5) + 14, OY - 14, 'x', 20, '#1E1B3A') + label(OX + 16, py(5) - 2, 'y', 20, '#1E1B3A');
    return s.add(m, { enter: 'fade', name: 'grid', flat: true });
  }
  function dot(s, x, y, col, o) { return s.add(ball(px(x), py(y), 7, col), Object.assign({ enter: 'pop' }, o || {})); }
  function panel(s, y, t, o) { return s.text(495, y, t, Object.assign({ size: 22, colour: s.C.ink }, o || {})); }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }
  function squares(s, x0, y0, cols, rows) {   // a plain squared grid (no axes), 30 px squares
    paper(s, x0, y0, cols * U, rows * U);
    var m = '';
    for (var i = 0; i <= cols; i++) m += '<path d="M' + (x0 + i * U) + ' ' + y0 + ' v' + rows * U + '" stroke="#DCD8EE" stroke-width="1.5"/>';
    for (var j = 0; j <= rows; j++) m += '<path d="M' + x0 + ' ' + (y0 + j * U) + ' h' + cols * U + '" stroke="#DCD8EE" stroke-width="1.5"/>';
    return s.add(m, { enter: 'fade', flat: true });
  }
  function pill(x, y, t, col) {   // a label in a white pill, like the labels on s.arrow
    var w = t.length * 18 * 0.56 + 16;
    return '<rect x="' + (x - w / 2) + '" y="' + (y - 13) + '" width="' + w + '" height="26" rx="13" fill="#FFFFFF" stroke="' + col + '" stroke-width="2.5"/>' +
      '<text x="' + x + '" y="' + (y + 1) + '" ' + F + ' font-size="18" font-weight="700" fill="' + col + '" text-anchor="middle" dominant-baseline="middle">' + t + '</text>';
  }
  function centre(x, y) { return ball(x, y, 8, '#E5484D'); }   // the red centre dot (rotation, enlargement)

  var TRI = [[1, 1], [4, 1], [1, 3]];

  Theory.scenes({
    /* ---------- 1. Four ways to move a shape ---------- */
    'tf-intro': function (s) {
      s.owl(110, 330, 150, { name: 'owl' });
      s.text(390, 60, 'Transformations', { size: 40, weight: 700, colour: s.C.fun, enter: 'pop', delay: 300 });
      [['flip it', s.C.pink], ['turn it', s.C.orange], ['slide it', s.C.blue], ['make it bigger', s.C.green]].forEach(function (r, i) {
        s.text(390, 135 + i * 52, r[0], { size: 30, colour: r[1], delay: 900 + i * 500 });
      });
    },
    'tf-four': function (s) {
      s.clear(); s.ref = {};
      var cs = [80, 240, 400, 560];
      [['Reflection', 'flip', s.C.pink], ['Rotation', 'turn', s.C.orange], ['Translation', 'slide', s.C.blue], ['Enlargement', 'resize', s.C.green]].forEach(function (r, i) {
        var c = cs[i], d = i * 700;
        s.text(c, 55, r[0], { size: 21, weight: 700, colour: r[2], delay: d });
        var a = '', b = '';
        if (i === 0) {
          s.add('<path d="M' + c + ' 120 V250" stroke="#FF5D8F" stroke-width="3" stroke-dasharray="7 6"/>', { enter: 'fade', delay: d });
          a = (c - 55) + ',230 ' + (c - 12) + ',230 ' + (c - 12) + ',150'; b = (c + 55) + ',230 ' + (c + 12) + ',230 ' + (c + 12) + ',150';
        } else if (i === 1) {
          var x = c - 20;
          s.add(ball(x, 195, 6, '#1E1B3A'), { enter: 'pop', delay: d });
          a = x + ',195 ' + (x + 55) + ',195 ' + x + ',140'; b = x + ',195 ' + x + ',250 ' + (x + 55) + ',195';
        } else if (i === 2) {
          a = (c - 60) + ',250 ' + (c - 25) + ',250 ' + (c - 60) + ',205'; b = (c + 10) + ',190 ' + (c + 45) + ',190 ' + (c + 10) + ',145';
          s.add('<path d="M' + (c - 45) + ' 215 L' + (c + 15) + ' 168" stroke="#2F80ED" stroke-width="3" stroke-dasharray="5 5"/>', { enter: 'fade', delay: d + 400 });
        } else {
          a = (c - 65) + ',250 ' + (c - 35) + ',250 ' + (c - 65) + ',210'; b = (c - 20) + ',250 ' + (c + 40) + ',250 ' + (c - 20) + ',170';
        }
        s.add(solid('polygon', 'points="' + a + '"', '#B9A4FF', { stroke: '#6C4DF6', sw: 3 }), { enter: 'pop', delay: d + 100 });
        s.add(solid('polygon', 'points="' + b + '"', mix(r[2], .3), { stroke: r[2], sw: 3, op: .85 }), { enter: 'pop', delay: d + 500 });
        s.text(c, 285, r[1], { size: 24, colour: s.C.ink, delay: d + 500 });
      });
    },
    'tf-congruent': function (s) {
      s.add('<path d="M15 305 V315 H465 V305" fill="none" stroke="#22A06B" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>', { enter: 'fade', flat: true });
      s.text(240, 338, 'same size and shape = congruent', { size: 20, colour: s.C.green, weight: 700, delay: 300 });
      s.add('<path d="M495 305 V315 H625 V305" fill="none" stroke="#FF8A3D" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>', { enter: 'fade', delay: 900, flat: true });
      s.text(560, 338, 'size changes', { size: 20, colour: s.C.orange, weight: 700, delay: 1100 });
    },

    /* ---------- 2. Reflection ---------- */
    'ref-mirror': function (s) {
      grid(s);
      s.add('<path d="M' + OX + ' ' + py(5) + ' V' + py(-5) + '" stroke="#FF5D8F" stroke-width="5" stroke-dasharray="10 7" stroke-linecap="round"/>', { enter: 'fade', delay: 300, name: 'mirrorY', flat: true });
      s.add(poly(TRI, '#B9A4FF', '#6C4DF6'), { enter: 'pop', delay: 600, name: 'triA' });
      s.add(poly(TRI.map(function (p) { return [-p[0], p[1]]; }), '#FFAFC6', '#FF5D8F'), { enter: 'none', name: 'triB' });
      s.anim(s.ref.triB, [{ transform: 'scaleX(0)', opacity: 0 }, { transform: 'scaleX(1)', opacity: 1 }], 900, { delay: 1400 });
      panel(s, 50, 'Reflection', { size: 32, weight: 700, colour: s.C.pink, name: 'p1' });
      panel(s, 100, 'flip over a', { delay: 400, name: 'p2' });
      panel(s, 132, 'mirror line', { delay: 500, colour: s.C.pink, weight: 700, name: 'p3' });
      panel(s, 300, 'object', { colour: s.C.fun, delay: 800, name: 'p4' });
      panel(s, 330, 'image', { colour: s.C.pink, delay: 1600, name: 'p5' });
    },
    'ref-distance': function (s) {
      s.add('<path d="M' + px(4) + ' ' + py(1) + ' H' + px(-4) + '" stroke="#1E1B3A" stroke-width="3" stroke-dasharray="4 6" stroke-linecap="round"/>', { enter: 'fade', name: 'dline', flat: true });
      s.add(label(px(2), py(1) + 18, '4', 20, '#6C4DF6') + label(px(-2), py(1) + 18, '4', 20, '#FF5D8F'), { enter: 'pop', delay: 500, name: 'dnum' });
      s.add(ball(px(4), py(1), 7, '#6C4DF6') + ball(px(-4), py(1), 7, '#FF5D8F'), { enter: 'pop', delay: 300, name: 'ddots' });
      panel(s, 195, 'same distance', { colour: s.C.deep, weight: 700, delay: 800, name: 'p6' });
      panel(s, 227, 'each side', { delay: 900, name: 'p7' });
    },
    'ref-yaxis': function (s) {
      hideAll(s, ['triA', 'triB', 'dline', 'dnum', 'ddots', 'p4', 'p5', 'p6', 'p7', 'p2', 'p3']);
      dot(s, 3, 2, s.C.fun, { delay: 300, name: 'ya' });
      s.add(label(px(3), py(2) - 22, '(3, 2)', 20, '#6C4DF6'), { enter: 'fade', delay: 400, name: 'yal' });
      s.add('<path d="M' + px(3) + ' ' + py(2) + ' H' + px(-3) + '" stroke="#1E1B3A" stroke-width="2.5" stroke-dasharray="4 6" stroke-linecap="round"/>', { flat: true, enter: 'fade', delay: 800, name: 'yline' });
      dot(s, -3, 2, s.C.pink, { delay: 1100, name: 'yb' });
      s.add(label(px(-3), py(2) - 22, '(−3, 2)', 20, '#FF5D8F'), { enter: 'fade', delay: 1200, name: 'ybl' });
      panel(s, 110, 'in the y-axis:', { delay: 300, name: 'q1' });
      panel(s, 160, '(3, 2) → (−3, 2)', { size: 24, weight: 700, delay: 1300, name: 'q2' });
      panel(s, 210, 'x changes sign', { colour: s.C.pink, weight: 700, delay: 1800, name: 'q3' });
    },
    'ref-xaxis': function (s) {
      hideAll(s, ['mirrorY', 'ya', 'yal', 'yline', 'yb', 'ybl', 'q1', 'q2', 'q3']);
      s.add('<path d="M' + px(-5) + ' ' + OY + ' H' + px(5) + '" stroke="#2F80ED" stroke-width="5" stroke-dasharray="10 7" stroke-linecap="round"/>', { enter: 'fade', delay: 300, flat: true });
      dot(s, 4, 3, s.C.fun, { delay: 500 });
      s.add(label(px(4), py(3) - 22, '(4, 3)', 20, '#6C4DF6'), { enter: 'fade', delay: 600 });
      s.add('<path d="M' + px(4) + ' ' + py(3) + ' V' + py(-3) + '" stroke="#1E1B3A" stroke-width="2.5" stroke-dasharray="4 6" stroke-linecap="round"/>', { flat: true, enter: 'fade', delay: 900 });
      dot(s, 4, -3, s.C.blue, { delay: 1200 });
      s.add(label(px(4), py(-3) + 24, '(4, −3)', 20, '#2F80ED'), { enter: 'fade', delay: 1300 });
      panel(s, 110, 'in the x-axis:', { delay: 300 });
      panel(s, 160, '(4, 3) → (4, −3)', { size: 24, weight: 700, delay: 1400 });
      panel(s, 210, 'y changes sign', { colour: s.C.blue, weight: 700, delay: 1900 });
    },

    /* ---------- 3. Translation ---------- */
    'tr-slide': function (s) {
      grid(s);
      var T = [[-4, 1], [-2, 1], [-4, 3]];
      s.add(poly(T, '#B9A4FF', '#6C4DF6'), { enter: 'pop', delay: 300, name: 'obj' });
      var img = s.add(poly(T, '#9CC6FF', '#2F80ED'), { enter: 'fade', delay: 1000, name: 'img' });
      s.move(img, 5 * U, 2 * U, 1600, { delay: 1300 });
      panel(s, 50, 'Translation', { size: 32, weight: 700, colour: s.C.blue });
      panel(s, 100, 'a slide', { delay: 400 });
      panel(s, 140, 'no turning,', { delay: 700, colour: s.C.muted, name: 't1' });
      panel(s, 172, 'no flipping', { delay: 800, colour: s.C.muted, name: 't2' });
    },
    'tr-count': function (s) {
      s.arrow(px(-4), py(1), 5 * U, 'r', { colour: s.C.orange, width: 6, delay: 200, name: 'ar' });
      s.arrow(px(1), py(1), 2 * U, 'd', { colour: s.C.orange, width: 6, delay: 900, name: 'ad' });
      s.add(pill(px(-2.5), py(1) + 18, '5 right', '#E06A1B'), { enter: 'fade', delay: 600, name: 'lr' });   // pills kept clear of the axis numbers
      s.add(pill(px(1) + 44, py(-1) + 15, '2 down', '#E06A1B'), { enter: 'fade', delay: 1300, name: 'ld' });
      hideAll(s, ['t1', 't2']);
      panel(s, 160, 'every corner:', { delay: 400, name: 'c1' });
      panel(s, 200, '5 right, 2 down', { weight: 700, colour: s.C.orange, delay: 1400, name: 'c2' });
    },
    'tr-point': function (s) {
      hideAll(s, ['obj', 'img', 'ar', 'ad', 'lr', 'ld', 'c1', 'c2']);
      dot(s, 1, 2, s.C.fun, { delay: 300, name: 'pa' });
      s.add(label(px(1), py(2) + 22, '(1, 2)', 18, '#6C4DF6'), { enter: 'fade', delay: 400, name: 'pal' });
      s.add('<path d="M' + px(1) + ' ' + py(2) + ' H' + px(4) + ' V' + py(4) + '" fill="none" stroke="#FF8A3D" stroke-width="3" stroke-dasharray="5 5" stroke-linecap="round"/>', { enter: 'fade', delay: 900, name: 'ppath', flat: true });
      dot(s, 4, 4, s.C.blue, { delay: 1500, name: 'pb' });
      s.add(label(px(4), py(4) - 22, '(4, 4)', 18, '#2F80ED'), { enter: 'fade', delay: 1600, name: 'pbl' });
      panel(s, 150, '3 right, 2 up', { colour: s.C.orange, weight: 700, delay: 600, name: 'k1' });
      panel(s, 195, 'x: 1 + 3 = 4', { delay: 1100, name: 'k2' });
      panel(s, 235, 'y: 2 + 2 = 4', { delay: 1400, name: 'k3' });
      panel(s, 280, '(1, 2) → (4, 4)', { weight: 700, colour: s.C.blue, delay: 1800, name: 'k4' });
    },
    'tr-same': function (s) {
      hideAll(s, ['pa', 'pal', 'ppath', 'pb', 'pbl', 'k1', 'k2', 'k3', 'k4']);
      var T = [[-4, 1], [-2, 1], [-4, 3]];
      s.add(poly(T, '#B9A4FF', '#6C4DF6'), { enter: 'pop', delay: 200 });
      s.add(poly(T.map(function (p) { return [p[0] + 5, p[1] - 2]; }), '#9CC6FF', '#2F80ED'), { enter: 'pop', delay: 500 });
      panel(s, 150, 'same size', { weight: 700, colour: s.C.green, delay: 700 });
      panel(s, 185, 'same shape', { weight: 700, colour: s.C.green, delay: 900 });
      panel(s, 220, 'same way up', { weight: 700, colour: s.C.green, delay: 1100 });
      s.owl(575, 352, 90, { delay: 1400 });
    },

    /* ---------- 4. Rotation ---------- */
    'rot-turn': function (s) {
      s.text(320, 40, 'Turning', { size: 34, weight: 700, colour: s.C.orange });
      [[90, 'quarter turn', '90°'], [180, 'half turn', '180°'], [360, 'full turn', '360°']].forEach(function (r, i) {
        var cx = 140 + i * 180, cy = 165, R = 60, a = r[0] * Math.PI / 180;
        var ex = cx + R * Math.sin(a), ey = cy - R * Math.cos(a);
        var gf = gid(), gs = gid(), gh = gid();
        var defs = '<defs>' + rad(gf, '#FFFFFF', '#F1ECE2') + '<radialGradient id="' + gs + '" gradientUnits="userSpaceOnUse" cx="' + cx + '" cy="' + cy + '" r="' + R + '"><stop offset="0" stop-color="#FFE9D8"/><stop offset="1" stop-color="#FFC59A"/></radialGradient>' + sheen(gh) + '</defs>';
        var sector = r[0] === 360 ? '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#' + gs + ')"/>' :
          '<path d="M' + cx + ' ' + cy + ' V' + (cy - R) + ' A' + R + ' ' + R + ' 0 ' + (r[0] > 180 ? 1 : 0) + ' 1 ' + ex.toFixed(1) + ' ' + ey.toFixed(1) + ' Z" fill="url(#' + gs + ')"/>';
        s.add(defs + '<circle cx="' + cx + '" cy="' + cy + '" r="' + (R + 6) + '" fill="#E9DCC4" stroke="' + EDGE + '" stroke-width="2"/>' +
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#' + gf + ')"/>' + sector +
          '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="url(#' + gh + ')" stroke="rgba(30,27,58,.2)" stroke-width="1.5"/>' +
          '<path d="M' + cx + ' ' + cy + ' V' + (cy - R) + '" stroke="#1E1B3A" stroke-width="4" stroke-linecap="round"/>' +
          '<path d="M' + cx + ' ' + cy + ' L' + ex.toFixed(1) + ' ' + ey.toFixed(1) + '" stroke="#FF8A3D" stroke-width="4" stroke-linecap="round"/>' +
          ball(cx, cy, 6, '#1E1B3A'), { enter: 'pop', delay: i * 900 });
        s.text(cx, 255, r[1], { size: 22, colour: s.C.ink, delay: i * 900 + 200 });
        s.text(cx, 292, r[2], { size: 30, weight: 700, colour: s.C.orange, delay: i * 900 + 300 });
      });
    },
    'rot-three': function (s) {
      s.clear(); s.ref = {};
      s.text(300, 45, 'Describe a rotation', { size: 32, weight: 700, colour: s.C.orange });
      s.owl(580, 120, 90, { delay: 200 });
      [['1. angle', '90°, 180° or 270°'], ['2. direction', 'clockwise or anticlockwise'], ['3. centre', 'the point it turns about']].forEach(function (r, i) {
        var y = 140 + i * 75;
        s.text(40, y, r[0], { size: 28, weight: 700, anchor: 'start', colour: s.C.deep, delay: 500 + i * 900 });
        s.text(240, y, r[1], { size: 22, anchor: 'start', colour: s.C.ink, delay: 800 + i * 900 });
      });
    },
    'rot-shape': function (s) {
      s.clear(); s.ref = {};
      grid(s);
      s.add(poly(TRI, '#B9A4FF', '#6C4DF6'), { enter: 'pop', delay: 200, name: 'robj' });
      var g = s.add(solid('polygon', 'points="' + rel(TRI) + '"', '#FFC59A', { stroke: '#FF8A3D', sw: 3, op: .9 }), { x: OX, y: OY, enter: 'fade', delay: 800, name: 'rimg' });
      g._inner.style.transformBox = 'view-box'; g._inner.style.transformOrigin = '0 0';
      s.anim(g, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(90deg)' }], 1800, { delay: 1300, easing: 'ease-in-out' });
      s.add(centre(OX, OY), { enter: 'pop', delay: 400, name: 'rc' });
      panel(s, 50, 'Rotation', { size: 32, weight: 700, colour: s.C.orange, name: 'r1' });
      panel(s, 110, '90° clockwise', { weight: 700, delay: 600, name: 'r2' });
      panel(s, 145, 'about (0, 0)', { delay: 800, name: 'r3' });
      panel(s, 260, 'centre', { colour: s.C.red, weight: 700, delay: 500, name: 'r5' });
      panel(s, 292, '(the red dot)', { size: 20, colour: s.C.muted, delay: 600, name: 'r6' });
    },
    'rot-point': function (s) {
      hideAll(s, ['robj', 'rimg', 'r2', 'r3', 'r5', 'r6']);
      dot(s, 3, 1, s.C.fun, { delay: 300 });
      s.add(label(px(3), py(1) - 22, '(3, 1)', 20, '#6C4DF6'), { enter: 'fade', delay: 400 });
      s.add('<path d="M' + px(3) + ' ' + py(1) + ' L' + px(-3) + ' ' + py(-1) + '" stroke="#1E1B3A" stroke-width="2.5" stroke-dasharray="4 6" stroke-linecap="round"/>', { flat: true, enter: 'fade', delay: 900 });
      dot(s, -3, -1, s.C.orange, { delay: 1300 });
      s.add(label(px(-3), py(-1) + 24, '(−3, −1)', 20, '#C2570C'), { enter: 'fade', delay: 1400 });
      panel(s, 110, '180° about (0, 0)', { weight: 700, delay: 300 });
      panel(s, 160, '(3, 1) → (−3, −1)', { size: 24, delay: 1500 });
      panel(s, 210, 'both signs change', { colour: s.C.orange, weight: 700, delay: 2000 });
    },

    /* ---------- 5. Enlargement ---------- */
    'en-grow': function (s) {
      squares(s, 20, 60, 12, 9);
      s.add(solid('rect', 'x="50" y="90" width="60" height="30"', '#B9A4FF', { stroke: '#6C4DF6', sw: 3 }) + label(80, 76, '2', 18, '#6C4DF6') + label(38, 105, '1', 18, '#6C4DF6'), { enter: 'pop', delay: 200, name: 'small' });
      s.add(solid('rect', 'x="170" y="180" width="180" height="90"', '#A5E3C6', { stroke: '#22A06B', sw: 3 }) + label(260, 166, '6', 18, '#1B8A5A') + label(158, 225, '3', 18, '#1B8A5A'), { enter: 'pop', delay: 1200, name: 'big' });
      s.text(200, 30, 'Enlargement', { size: 30, weight: 700, colour: s.C.green });
      s.text(510, 80, 'scale factor 3', { size: 24, weight: 700, colour: s.C.green, delay: 600 });
      s.text(510, 140, '2 × 3 = 6', { size: 24, delay: 1400, name: 'g1' });
      s.text(510, 180, '1 × 3 = 3', { size: 24, delay: 1700, name: 'g2' });
    },
    'en-sf': function (s) {
      s.hide(s.ref.g1); s.hide(s.ref.g2);
      s.text(510, 140, 'scale factor =', { size: 22, delay: 200 });
      s.text(510, 175, 'new ÷ old', { size: 26, weight: 700, colour: s.C.fun, delay: 500 });
      s.text(510, 225, '6 ÷ 2 = 3', { size: 26, weight: 700, delay: 1100 });
      s.text(510, 285, 'angles stay', { size: 22, colour: s.C.muted, delay: 1700 });
      s.text(510, 315, 'the same', { size: 22, colour: s.C.muted, delay: 1800 });
    },
    'en-centre': function (s) {
      s.clear(); s.ref = {};
      squares(s, 20, 60, 12, 9);
      var C = [50, 300];
      function P(p) { return (C[0] + p[0] * U) + ',' + (C[1] - p[1] * U); }
      var small = [[2, 1], [4, 1], [2, 3]], big = small.map(function (p) { return [p[0] * 2, p[1] * 2]; });
      s.add(solid('polygon', 'points="' + small.map(P).join(' ') + '"', '#B9A4FF', { stroke: '#6C4DF6', sw: 3 }), { enter: 'pop', delay: 200 });
      var rays = big.map(function (p) { return '<path d="M' + C[0] + ' ' + C[1] + ' L' + P(p).replace(',', ' ') + '" stroke="#FF8A3D" stroke-width="2.5" stroke-dasharray="6 6" stroke-linecap="round"/>'; }).join('');
      s.add(rays, { enter: 'fade', delay: 700, flat: true });
      s.add(solid('polygon', 'points="' + big.map(P).join(' ') + '"', '#A5E3C6', { stroke: '#22A06B', sw: 3, op: .75 }), { enter: 'pop', delay: 1400 });
      s.add(centre(C[0], C[1]) + label(C[0] - 4, C[1] + 22, 'centre', 18, '#E5484D', 'start'), { enter: 'pop', delay: 300 });
      s.text(200, 30, 'Centre of enlargement', { size: 26, weight: 700, colour: s.C.green });
      s.text(510, 130, 'scale factor 2', { size: 24, weight: 700, colour: s.C.green, delay: 500 });
      s.text(510, 190, 'each corner is', { size: 22, delay: 1600 });
      s.text(510, 222, '2 times as far', { size: 22, weight: 700, colour: s.C.orange, delay: 1700 });
      s.text(510, 254, 'from the centre', { size: 22, delay: 1800 });
    },
    'en-area': function (s) {
      s.clear(); s.ref = {};
      squares(s, 20, 60, 12, 9);
      s.add(solid('rect', 'x="50" y="120" width="60" height="30"', '#B9A4FF', { stroke: '#6C4DF6', sw: 3 }) + label(80, 106, '2', 18, '#6C4DF6') + label(38, 135, '1', 18, '#6C4DF6') +
        label(80, 175, 'area 2', 18, '#6C4DF6'), { enter: 'pop', delay: 200 });
      var m = '';
      [[0, 0], [60, 0], [0, 30], [60, 30]].forEach(function (o) { m += solid('rect', 'x="' + (200 + o[0]) + '" y="' + (120 + o[1]) + '" width="60" height="30"', '#A5E3C6', { stroke: '#22A06B', sw: 3 }); });
      s.add(m + label(260, 106, '4', 18, '#1B8A5A') + label(188, 150, '2', 18, '#1B8A5A') + label(260, 205, 'area 8', 18, '#1B8A5A'), { enter: 'pop', delay: 1000 });
      s.text(200, 30, 'Scale factor 2', { size: 30, weight: 700, colour: s.C.green });
      s.text(510, 110, 'lengths × 2', { size: 24, weight: 700, delay: 600 });
      s.text(510, 160, 'area × 2 × 2', { size: 24, delay: 1400 });
      s.text(510, 200, '= area × 4', { size: 28, weight: 700, colour: s.C.red, delay: 1900 });
      s.text(510, 260, '2 × 4 = 8', { size: 22, colour: s.C.muted, delay: 2400 });
      s.owl(200, 352, 90, { delay: 2600 });
    },

    /* ---------- 6. Symmetry ---------- */
    'sym-line': function (s) {
      s.text(320, 40, 'Line symmetry', { size: 34, weight: 700, colour: s.C.fun });
      s.add(solid('path', 'd="M0 90 C-70 40 -120 0 -110 -45 C-100 -90 -30 -95 0 -45 C30 -95 100 -90 110 -45 C120 0 70 40 0 90 Z"', '#FF5D8F', { stroke: 'rgba(140,20,50,.5)', sw: 3 }) +
        '<path d="M-82 -52 Q-74 -76 -48 -76" fill="none" stroke="#fff" stroke-width="9" stroke-linecap="round" opacity=".45"/>',
        { x: 200, y: 195, enter: 'pop', delay: 200 });
      s.add('<path d="M200 80 V310" stroke="#1E1B3A" stroke-width="4" stroke-dasharray="10 8" stroke-linecap="round"/>', { enter: 'fade', delay: 1000, flat: true });
      s.text(470, 150, 'fold here and', { size: 24, delay: 1200 });
      s.text(470, 185, 'the halves match', { size: 24, delay: 1300 });
      s.text(470, 250, 'line of symmetry', { size: 26, weight: 700, colour: s.C.fun, delay: 1800 });
      s.arrow(330, 250, 110, 'l', { colour: s.C.fun, width: 6, delay: 1800 });
    },
    'sym-shapes': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 35, 'Lines of symmetry', { size: 32, weight: 700, colour: s.C.fun });
      var c = [170, 205], R = 95, V = [-90, 30, 150].map(function (a) { a = a * Math.PI / 180; return [c[0] + R * Math.cos(a), c[1] + R * Math.sin(a)]; });
      s.add(solid('polygon', 'points="' + V.map(function (v) { return v[0].toFixed(1) + ',' + v[1].toFixed(1); }).join(' ') + '"', '#FFD666', { stroke: '#D69E00', sw: 3.5 }), { enter: 'pop' });
      var tl = V.map(function (v) {
        var a = [c[0] + 1.18 * (v[0] - c[0]), c[1] + 1.18 * (v[1] - c[1])], b = [c[0] - 0.72 * (v[0] - c[0]), c[1] - 0.72 * (v[1] - c[1])];
        return '<path d="M' + a[0].toFixed(1) + ' ' + a[1].toFixed(1) + ' L' + b[0].toFixed(1) + ' ' + b[1].toFixed(1) + '" stroke="#6C4DF6" stroke-width="3.5" stroke-dasharray="8 6" stroke-linecap="round"/>';
      });
      tl.forEach(function (l, i) { s.add(l, { enter: 'fade', delay: 600 + i * 500, flat: true }); });
      s.text(170, 330, '3 lines', { size: 26, weight: 700, colour: s.C.fun, delay: 2100 });
      s.add(solid('rect', 'x="400" y="125" width="150" height="150"', '#9CC6FF', { stroke: '#2F80ED', sw: 3.5 }), { enter: 'pop', delay: 2400 });
      ['M475 105 V295', 'M380 200 H570', 'M388 113 L562 287', 'M562 113 L388 287'].forEach(function (d, i) {
        s.add('<path d="' + d + '" stroke="#6C4DF6" stroke-width="3.5" stroke-dasharray="8 6" stroke-linecap="round"/>', { enter: 'fade', delay: 2900 + i * 450, flat: true });
      });
      s.text(475, 330, '4 lines', { size: 26, weight: 700, colour: s.C.fun, delay: 4800 });
    },
    'sym-rot': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 35, 'Rotational symmetry', { size: 32, weight: 700, colour: s.C.orange });
      s.add('<rect x="110" y="110" width="160" height="160" fill="none" stroke="#C9B48E" stroke-width="3" stroke-dasharray="6 6"/>', { enter: 'fade', flat: true });
      var sq = s.add(solid('rect', 'x="110" y="110" width="160" height="160"', '#9CC6FF', { stroke: '#2F80ED', sw: 3.5 }) + ball(135, 135, 10, '#E5484D'), { enter: 'pop', delay: 200 });
      s.anim(sq, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(90deg)', offset: .2 }, { transform: 'rotate(90deg)', offset: .27 }, { transform: 'rotate(180deg)', offset: .47 },
        { transform: 'rotate(180deg)', offset: .54 }, { transform: 'rotate(270deg)', offset: .74 }, { transform: 'rotate(270deg)', offset: .81 }, { transform: 'rotate(360deg)' }], 5600, { delay: 900, easing: 'ease-in-out' });
      s.add(ball(190, 190, 5, '#1E1B3A'), { enter: 'fade', delay: 200 });
      [1, 2, 3, 4].forEach(function (n, i) {
        s.text(390 + i * 55, 150, String(n), { size: 34, weight: 700, colour: s.C.orange, enter: 'pop', delay: 900 + [1120, 2630, 4140, 5600][i] });
      });
      s.text(500, 210, 'fits onto itself', { size: 22, delay: 1200 });
      s.text(500, 242, '4 times in a full turn', { size: 22, delay: 1300 });
      s.text(500, 300, 'order 4', { size: 32, weight: 700, colour: s.C.orange, enter: 'pop', delay: 6600 });
    },
    'sym-order2': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 35, 'Order 2: a half turn', { size: 32, weight: 700, colour: s.C.orange });
      var gS = gid();
      var S = s.add('<defs>' + lin(gS, '#9F86FF', '#5B3FE0') + '</defs><text x="0" y="0" ' + F + ' font-size="150" font-weight="700" fill="url(#' + gS + ')" stroke="rgba(30,27,58,.3)" stroke-width="2" text-anchor="middle" dominant-baseline="central">S</text>', { x: 170, y: 175, enter: 'pop' });
      s.anim(S, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }], 1600, { delay: 700, easing: 'ease-in-out' });
      var P = s.add(solid('polygon', 'points="-90,50 30,50 90,-50 -30,-50"', '#A5E3C6', { stroke: '#22A06B', sw: 3.5 }), { x: 460, y: 175, enter: 'pop', delay: 400 });
      s.anim(P, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(180deg)' }], 1600, { delay: 1100, easing: 'ease-in-out' });
      s.text(170, 290, 'order 2', { size: 26, weight: 700, colour: s.C.fun, delay: 2400 });
      s.text(460, 270, 'order 2', { size: 26, weight: 700, colour: s.C.green, delay: 2700 });
      s.text(460, 310, 'no lines of symmetry', { size: 22, colour: s.C.red, delay: 3300 });
    }
  });
})();
