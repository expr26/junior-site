/* Pictures for the Electric circuits theory video (words: videos/physics/circuits.json). Stage is 640 x 360; see static/js/theory.js.
   Circuit symbols are the standard UK (IEC) ones: cell = long thin line (+) and short thick line (−), lamp = circle with a cross,
   switch, ammeter and voltmeter = circles with A and V, resistor = rectangle. Orange arrows show conventional current (+ to −);
   blue dots in the "electrons" step drift the other way. */
(function () {
  if (!window.Theory) return;

  var INK = '#2B2847', FONT = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function T(x, y, txt, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + FONT + ' font-size="' + (o.size || 18) + '" font-weight="' + (o.weight || 600) + '" fill="' + (o.colour || '#1E1B3A') +
      '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="middle" stroke="#FFFFFF" stroke-width="4" paint-order="stroke">' + txt + '</text>';
  }
  function at(markup, x, y, rot) { return '<g transform="translate(' + x + ' ' + y + ')' + (rot ? ' rotate(' + rot + ')' : '') + '">' + markup + '</g>'; }

  /* ---- symbols, drawn on a horizontal wire through (0, 0); a white patch hides the wire underneath.
     Line widths: wires 3.5, symbol outlines 3, the short (−) plate of a cell 7. ---- */
  var CELL = '<rect x="-14" y="-25" width="28" height="50" fill="#FFFFFF"/><path d="M-6 -22 V22" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M6 -11 V11" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>';
  var CELL2 = '<rect x="-26" y="-25" width="52" height="50" fill="#FFFFFF"/><path d="M-8 0 H8" stroke="' + INK + '" stroke-width="3.5"/>' +
    '<path d="M-18 -22 V22 M8 -22 V22" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M-8 -11 V11 M18 -11 V11" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>';
  var BATT = '<rect x="-30" y="-25" width="60" height="50" fill="#FFFFFF"/><path d="M-11 0 H11" stroke="' + INK + '" stroke-width="3" stroke-dasharray="3 4" stroke-linecap="round"/>' +   // a battery of several cells
    '<path d="M-24 -22 V22 M12 -22 V22" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/><path d="M-12 -11 V11 M24 -11 V11" stroke="' + INK + '" stroke-width="7" stroke-linecap="round"/>';
  var LAMP = '<circle r="17" fill="#FFFFFF" stroke="' + INK + '" stroke-width="3"/><path d="M-12 -12 L12 12 M12 -12 L-12 12" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>';
  var SW_BASE = '<rect x="-26" y="-28" width="52" height="34" fill="#FFFFFF"/><circle cx="-20" r="4.5" fill="' + INK + '"/><circle cx="20" r="4.5" fill="' + INK + '"/>';
  var SW_SHUT = '<path d="M-20 0 L20 0" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>';
  var SW_OPEN = '<path d="M-20 0 L8 -24" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>';
  function meter(letter) {
    return '<circle r="17" fill="#FFFFFF" stroke="' + INK + '" stroke-width="3"/><text y="1" ' + FONT + ' font-size="20" font-weight="700" fill="' + INK + '" text-anchor="middle" dominant-baseline="middle">' + letter + '</text>';
  }
  var RES = '<rect x="-30" y="-14" width="60" height="28" fill="#FFFFFF"/><rect x="-24" y="-10" width="48" height="20" rx="1.5" fill="#FFFFFF" stroke="' + INK + '" stroke-width="3"/>';
  function glow(level) {   // light from a lamp, drawn over it; level 0..1 (the cross still shows through)
    var r = '', n = 8, r0 = 22, r1 = 22 + 13 * level;
    for (var k = 0; k < n; k++) {
      var a = k * 2 * Math.PI / n + Math.PI / 8;
      r += '<path d="M' + (Math.cos(a) * r0).toFixed(1) + ' ' + (Math.sin(a) * r0).toFixed(1) + ' L' + (Math.cos(a) * r1).toFixed(1) + ' ' + (Math.sin(a) * r1).toFixed(1) + '"/>';
    }
    return '<defs><radialGradient id="crcGlow"><stop offset="0" stop-color="#FFE066" stop-opacity=".55"/><stop offset=".5" stop-color="#FFD43B" stop-opacity=".4"/><stop offset="1" stop-color="#FFD43B" stop-opacity="0"/></radialGradient></defs>' +
      '<circle r="' + (24 + 16 * level) + '" fill="url(#crcGlow)" opacity="' + (0.45 + 0.55 * level) + '"/>' +
      '<g stroke="#FFB300" stroke-width="3.5" stroke-linecap="round" opacity="' + (0.6 + 0.4 * level) + '">' + r + '</g>';
  }
  var BREAK = '<path d="M-6 -22 L2 -8 L-4 -2 L6 10 L0 22" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linejoin="round" stroke-linecap="round"/><path d="M-6 -22 L2 -8 L-4 -2 L6 10 L0 22" fill="none" stroke="#E5484D" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>';
  var METAL = '<linearGradient id="crcMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4E7EF"/><stop offset=".5" stop-color="#A7ADC0"/><stop offset="1" stop-color="#7A8098"/></linearGradient>';
  var BULB = '<defs>' + METAL + '<radialGradient id="crcHalo"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset=".55" stop-color="#FFE58A" stop-opacity=".45"/><stop offset="1" stop-color="#FFE58A" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="crcBulb" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFDF0"/><stop offset=".55" stop-color="#FFE680"/><stop offset="1" stop-color="#FFC93C"/></radialGradient></defs>' +
    '<circle r="52" fill="url(#crcHalo)"/>' +
    '<path d="M-13 25 Q-30 12 -30 -4 A30 30 0 1 1 30 -4 Q30 12 13 25 Z" fill="url(#crcBulb)" stroke="rgba(194,87,12,.5)" stroke-width="2"/>' +
    '<path d="M-5 25 L-8 6 M5 25 L8 6" stroke="#B9AE96" stroke-width="1.5"/><path d="M-8 6 q4 -10 8 0 q4 -10 8 0" fill="none" stroke="#E8590C" stroke-width="2.5" stroke-linecap="round"/>' +
    '<path d="M-20 -14 A20 20 0 0 1 -6 -25" fill="none" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" opacity=".75"/>' +
    '<rect x="-14" y="24" width="28" height="24" rx="4" fill="url(#crcMetal)" stroke="rgba(30,27,58,.45)" stroke-width="1.5"/><path d="M-14 31 H14 M-14 38 H14" stroke="rgba(30,27,58,.3)" stroke-width="2"/>' +
    '<path d="M-7 48 H7 L4 53 H-4 Z" fill="#55526E"/>';
  function panel(s, x, y, w, h, o) {   // the card a circuit diagram sits on
    return s.add('<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="18" fill="#FFFFFF" stroke="#E4DCF5" stroke-width="2"/>' +
      '<rect x="' + (x + 6) + '" y="' + (y + 6) + '" width="' + (w - 12) + '" height="' + (h - 12) + '" rx="13" fill="none" stroke="#F1ECFB" stroke-width="1.5"/>', Object.assign({ enter: 'fade' }, o || {}));
  }
  function wire(d) { return '<path d="' + d + '" fill="none" stroke="' + INK + '" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round"/>'; }
  function addWire(s, d, o) {   // the wires of a circuit; moving current is slipped in just above them, under the symbols
    var g = s.add(wire(d), Object.assign({ flat: true, enter: 'fade', flat: true }, o || {}));
    s.ref._wire = g;
    return g;
  }
  function dot(x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="4.5" fill="' + INK + '"/>'; }
  function tag(x, y, t, kind) {   // a small reading next to a meter, centred at (x, y)
    var c = { A: ['#F1ECFF', '#6C4DF6', '#6C4DF6'], V: ['#E2F7F3', '#0F9488', '#0F9488'], I: ['#FFF4D6', '#FF8A3D', '#C2570C'] }[kind || 'A'], w = t.length > 4 ? 64 : 56;
    return '<rect x="' + (x - w / 2) + '" y="' + (y - 14) + '" width="' + w + '" height="28" rx="14" fill="' + c[0] + '" stroke="' + c[1] + '" stroke-width="2"/>' +
      '<text x="' + x + '" y="' + (y + 1) + '" ' + FONT + ' font-size="16" font-weight="700" fill="' + c[2] + '" text-anchor="middle" dominant-baseline="middle">' + t + '</text>';
  }

  /* ---- moving current: a few markers that travel round a closed loop of points, for as long as the step lasts ---- */
  var CHEV = '<path d="M-7 -9 L8 0 L-7 9 L-3 0 Z" fill="#FF8A3D" stroke="#FFFFFF" stroke-width="2.5" stroke-linejoin="round" paint-order="stroke"/>';
  var ELEC = '<circle r="7" fill="#2F80ED" stroke="#FFFFFF" stroke-width="2"/><path d="M-3.5 0 H3.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round"/>';
  function flow(s, pts, o) {
    o = o || {};
    var P = pts.concat([pts[0]]), segs = [], total = 0;
    for (var i = 0; i + 1 < P.length; i++) {
      var a = P[i], b = P[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]);
      segs.push({ a: a, b: b, len: len, ang: o.spin === false ? 0 : Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI, at: total }); total += len;
    }
    var tf = function (x, y, ang) { return 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + ang.toFixed(1) + 'deg)'; };
    var frames = [];
    segs.forEach(function (g) {
      frames.push({ offset: g.at / total, transform: tf(g.a[0], g.a[1], g.ang) });
      frames.push({ offset: (g.at + g.len) / total, transform: tf(g.b[0], g.b[1], g.ang) });
    });
    var n = o.n || Math.max(4, Math.round(total / 160)), ms = o.ms || total * 9, list = [];
    for (var k = 0; k < n; k++) {
      var d = total * (k + 0.5) / n, g = segs[0];
      for (var j = 0; j < segs.length; j++) if (d >= segs[j].at && d <= segs[j].at + segs[j].len) { g = segs[j]; break; }
      var f = (d - g.at) / g.len;
      var m = s.add(o.mark || CHEV, { enter: 'fade', delay: o.delay || 0, flat: true });
      if (s.ref._wire && s.ref._wire.parentNode) s.ref._wire.parentNode.insertBefore(m, s.ref._wire.nextSibling);
      m._inner.style.transformBox = 'view-box'; m._inner.style.transformOrigin = '0 0';
      m._inner.style.transform = tf(g.a[0] + (g.b[0] - g.a[0]) * f, g.a[1] + (g.b[1] - g.a[1]) * f, g.ang);
      list.push({ g: m, frames: frames, ms: ms, lag: ms * (k + 0.5) / n });
    }
    var all = s.ref.flows = s.ref.flows || {};
    all[o.name || 'main'] = list;
    run(s, list);
    return list;
  }
  function run(s, list) {
    if (s.fast) return;
    list.forEach(function (m) {
      if (m.g._inner.animate) m.g._inner.animate(m.frames, { duration: m.ms, iterations: Infinity, delay: -m.lag, easing: 'linear' });
    });
  }
  function keepFlowing(s) {   // restart every flow that is still showing (each step ends the previous step's animations)
    var all = s.ref.flows || {};
    for (var k in all) run(s, all[k]);
  }
  function stopFlow(s, name) {
    var all = s.ref.flows || {}, list = all[name || 'main'] || [];
    list.forEach(function (m) { s.hide(m.g, { ms: 250 }); });
    delete all[name || 'main'];
  }
  function inset(x0, y0, x1, y1, d, clockwise) {   // a loop just inside a rectangle of wire; default: along the bottom to the left first
    var p = [[x1 - d, y1 - d], [x0 + d, y1 - d], [x0 + d, y0 + d], [x1 - d, y0 + d]];
    return clockwise ? p.reverse() : p;
  }

  Theory.scenes({
    /* ---------- 1. Complete circuits ---------- */
    'parts': function (s) {
      s.text(320, 34, "What's in a circuit?", { size: 30, weight: 700, colour: s.C.deep });
      s.add('<defs>' + METAL + '<linearGradient id="crcCell" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4FD39A"/><stop offset=".55" stop-color="#22A06B"/><stop offset="1" stop-color="#157A50"/></linearGradient>' +
        '<linearGradient id="crcCellEnd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4A4670"/><stop offset="1" stop-color="#1E1B3A"/></linearGradient></defs>' +
        '<rect x="58" y="-10" width="12" height="20" rx="3" fill="url(#crcMetal)" stroke="rgba(30,27,58,.45)" stroke-width="1.5"/>' +
        '<rect x="-60" y="-26" width="120" height="52" rx="12" fill="url(#crcCell)" stroke="rgba(15,80,50,.55)" stroke-width="2"/>' +
        '<path d="M-48 -25 H-30 V25 H-48 Q-59 25 -59 14 V-14 Q-59 -25 -48 -25 Z" fill="url(#crcCellEnd)"/>' +
        '<rect x="-54" y="-21" width="108" height="6" rx="3" fill="#FFFFFF" opacity=".3"/>' +
        '<text x="44" y="2" ' + FONT + ' font-size="26" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">+</text><text x="-2" y="3" ' + FONT + ' font-size="16" font-weight="700" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle">1.5 V</text>',
        { x: 130, y: 170, enter: 'pop', delay: 200 });
      s.text(130, 240, 'a cell', { size: 22, weight: 700, delay: 400 });
      s.add(BULB, { x: 320, y: 150, enter: 'pop', delay: 900 });
      s.text(320, 240, 'a bulb', { size: 22, weight: 700, delay: 1100 });
      var curl = 'M-70 10 C-40 -40 -10 50 20 0 S60 -20 70 -10';
      s.add('<path d="M70 -10 l14 -4 M-70 10 l-14 4" stroke="#D08A4E" stroke-width="5" stroke-linecap="round"/><path d="M71 -11 l12 -3.4 M-71 9 l-12 3.4" stroke="#F6C79A" stroke-width="1.5" stroke-linecap="round"/>' +
        '<path d="' + curl + '" fill="none" stroke="#C93A40" stroke-width="11" stroke-linecap="round"/><path d="' + curl + '" fill="none" stroke="#E5484D" stroke-width="8" stroke-linecap="round"/>' +
        '<path d="' + curl + '" fill="none" stroke="#FFB3B5" stroke-width="2.5" stroke-linecap="round" transform="translate(-1 -2.5)" opacity=".8"/>',
        { x: 510, y: 170, enter: 'pop', delay: 1600 });
      s.text(510, 240, 'wires', { size: 22, weight: 700, delay: 1800 });
      s.text(320, 310, 'A battery is two or more cells joined together.', { size: 19, colour: s.C.muted, delay: 2600 });
    },
    'symbols': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Circuit symbols', { size: 30, weight: 700, colour: s.C.deep });
      var cards = [
        ['cell', CELL, 'long line is +'],
        ['bulb (lamp)', LAMP, 'circle with a cross'],
        ['switch', SW_BASE + SW_OPEN, 'here it is open'],
        ['wire', '', 'a straight line']
      ];
      cards.forEach(function (c, k) {
        var x = 95 + k * 150;
        s.add('<rect x="-66" y="-90" width="132" height="190" rx="16" fill="#FFFFFF" stroke="#E7E0F5" stroke-width="3"/>' + wire('M-48 -20 H48') + at(c[1], 0, -20) +
          T(0, 48, c[0], { size: 20, weight: 700, colour: s.C.fun }) + T(0, 76, c[2], { size: 14, colour: s.C.muted }), { x: x, y: 180, enter: 'pop', delay: 300 + k * 500 });
      });
      s.add(T(-14, -36, '+', { size: 18, weight: 700, colour: s.C.red }) + T(16, -36, '−', { size: 20, weight: 700, colour: s.C.blue }), { x: 95, y: 180, enter: 'fade', delay: 2600 });
    },
    'loop': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'A complete loop', { size: 28, weight: 700, colour: s.C.deep });
      panel(s, 150, 60, 356, 266);
      addWire(s, 'M170 100 H470 V280 H170 Z');
      s.add(at(CELL, 320, 280), { flat: true, enter: 'pop', delay: 100 });
      s.add(at(LAMP, 320, 100), { flat: true, enter: 'pop', delay: 200 });
      s.add(at(SW_BASE, 470, 190, 90), { flat: true, enter: 'pop', delay: 300 });
      s.add(at(SW_SHUT, 470, 190, 90), { flat: true, enter: 'pop', delay: 300, name: 'lever' });
      s.add(T(320, 152, 'bulb', { size: 16, colour: s.C.muted }) + T(320, 236, 'cell', { size: 16, colour: s.C.muted }) + T(436, 190, 'switch', { size: 16, colour: s.C.muted, anchor: 'end' }), { enter: 'fade', delay: 500 });
      s.add(at(glow(1), 320, 100), { flat: true, enter: 'pop', delay: 1200, name: 'glow' });
      flow(s, inset(170, 100, 470, 280, 0), { delay: 1000 });
      s.owl(80, 340, 100, { delay: 400 });
    },
    'open': function (s) {
      s.hide(s.ref.lever, { ms: 200 });
      s.add(at(SW_OPEN, 470, 190, 90), { flat: true, enter: 'fade', ms: 300, name: 'lever2' });
      stopFlow(s);
      s.hide(s.ref.glow, { delay: 200 });
      s.add(T(560, 176, 'gap!', { size: 26, weight: 700, colour: s.C.red }), { enter: 'pop', delay: 600 });
      s.add(T(560, 210, 'no current', { size: 18, colour: s.C.red }), { enter: 'fade', delay: 900 });
    },
    'conductors': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 30, 'Conductors and insulators', { size: 28, weight: 700, colour: s.C.deep });
      var strands = '';
      for (var k = 0; k < 5; k++) {
        var sd = 'M420 ' + (112 + k * 4) + ' Q470 ' + (100 + k * 7) + ' 530 ' + (98 + k * 9);
        strands += '<path d="' + sd + '" stroke="#C27A3E" stroke-width="4" fill="none" stroke-linecap="round"/><path d="' + sd + '" stroke="#F6C79A" stroke-width="1.3" fill="none" stroke-linecap="round" transform="translate(0 -1)"/>';
      }
      s.add('<defs><linearGradient id="crcCoat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7DB8FF"/><stop offset=".55" stop-color="#2F80ED"/><stop offset="1" stop-color="#1D5FC0"/></linearGradient>' +
        '<linearGradient id="crcCopper" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6C08E"/><stop offset=".5" stop-color="#E09A5C"/><stop offset="1" stop-color="#B8733A"/></linearGradient></defs>' + strands +
        '<rect x="360" y="106" width="62" height="28" rx="6" fill="url(#crcCopper)" stroke="rgba(110,60,20,.55)" stroke-width="1.5"/>' +
        '<rect x="70" y="100" width="300" height="40" rx="20" fill="url(#crcCoat)" stroke="rgba(20,50,120,.55)" stroke-width="2"/><rect x="86" y="105" width="270" height="7" rx="3.5" fill="#FFFFFF" opacity=".3"/>', { enter: 'left' });
      s.add(T(200, 120, 'plastic coat', { size: 17, weight: 700, colour: '#FFFFFF' }).replace('stroke="#FFFFFF"', 'stroke="#2F80ED"'), { enter: 'fade', delay: 500 });
      s.add(T(560, 90, 'copper', { size: 18, weight: 700, colour: '#8A5A2B', anchor: 'start' }), { enter: 'fade', delay: 700 });
      s.add('<rect x="-140" y="-24" width="280" height="140" rx="16" fill="#FFF4D6" stroke="#FFC93C" stroke-width="3"/>' + T(0, 0, 'Conductors', { size: 22, weight: 700, colour: '#C2570C' }) +
        T(0, 36, 'copper, iron,', { size: 18 }) + T(0, 62, 'aluminium, gold', { size: 18 }) + T(0, 90, 'current flows easily', { size: 15, colour: s.C.muted }),
        { x: 170, y: 210, enter: 'up', delay: 1200 });
      s.add('<rect x="-140" y="-24" width="280" height="140" rx="16" fill="#E8F1FF" stroke="#2F80ED" stroke-width="3"/>' + T(0, 0, 'Insulators', { size: 22, weight: 700, colour: s.C.blue }) +
        T(0, 36, 'plastic, rubber,', { size: 18 }) + T(0, 62, 'wood, glass', { size: 18 }) + T(0, 90, 'current is stopped', { size: 15, colour: s.C.muted }),
        { x: 470, y: 210, enter: 'up', delay: 2000 });
    },

    /* ---------- 2. Current: circuit on the left (wires x 80..340, y 100..280), notes on the right ---------- */
    'current': function (s) {
      panel(s, 40, 50, 340, 280);
      addWire(s, 'M80 100 H340 V280 H80 Z');
      s.add(at(CELL, 210, 280), { flat: true, enter: 'pop' });
      s.add(at(LAMP, 210, 100), { flat: true, enter: 'pop', delay: 100 });
      s.add(at(glow(1), 210, 100), { flat: true, enter: 'pop', delay: 900, name: 'glow' });
      flow(s, inset(80, 100, 340, 280, 0), { delay: 500 });
      s.add(T(510, 120, 'Current', { size: 34, weight: 700, colour: '#C2570C' }) + T(510, 164, 'a flow of charge', { size: 20 }) + T(510, 194, 'round the circuit', { size: 20 }), { enter: 'fade', delay: 300, name: 'n1' });
      s.add('<g transform="scale(1.4)">' + CHEV + '</g>', { x: 470, y: 250, flat: true, enter: 'pop', delay: 1200, name: 'n2' });
      s.add(T(488, 250, '= current', { size: 18, colour: '#C2570C', anchor: 'start' }), { enter: 'fade', delay: 1300, name: 'n3' });
    },
    'amps': function (s) {
      keepFlowing(s);
      ['n1', 'n2', 'n3'].forEach(function (n) { s.hide(s.ref[n]); });
      s.add('<g transform="scale(2.2)">' + meter('A') + '</g>', { x: 510, y: 130, enter: 'pop', delay: 300, name: 'a1' });
      s.add(T(510, 210, 'ammeter', { size: 26, weight: 700, colour: s.C.fun }) + T(510, 244, 'measures current', { size: 18 }) + T(510, 270, 'in amps (A)', { size: 18 }), { enter: 'fade', delay: 700, name: 'a2' });
    },
    'ammeter-series': function (s) {
      keepFlowing(s);
      s.add(at(meter('A'), 340, 190), { flat: true, enter: 'pop' });
      s.add(tag(270, 190, '0.2 A'), { enter: 'pop', delay: 500 });
      s.hide(s.ref.a2);
      s.add(T(510, 230, 'in series:', { size: 20, weight: 700, colour: s.C.fun }) + T(510, 258, 'in the loop itself', { size: 18 }), { enter: 'fade', delay: 800, name: 'a3' });
    },
    'direction': function (s) {
      keepFlowing(s);
      ['a1', 'a3'].forEach(function (n) { s.hide(s.ref[n]); });
      s.add(T(196, 240, '+', { size: 24, weight: 700, colour: s.C.red }) + T(226, 240, '−', { size: 26, weight: 700, colour: s.C.blue }), { enter: 'pop', delay: 200 });
      s.add(T(510, 110, 'Current flows', { size: 24, weight: 700, colour: '#C2570C' }) + T(510, 146, 'out of + (long line)', { size: 18, colour: s.C.red }) +
        T(510, 176, 'round the circuit', { size: 18 }) + T(510, 206, 'into − (short line)', { size: 18, colour: s.C.blue }), { enter: 'fade', delay: 600, name: 'd1' });
    },
    'electrons': function (s) {
      keepFlowing(s);
      s.hide(s.ref.d1);
      flow(s, inset(80, 100, 340, 280, 0, true), { mark: ELEC, spin: false, name: 'e', delay: 300, n: 8, ms: 9000 });
      s.add(T(510, 100, 'Electrons', { size: 26, weight: 700, colour: s.C.blue }) + T(510, 134, 'negative, so they', { size: 18 }) + T(510, 160, 'drift from − to +', { size: 18, colour: s.C.blue }) +
        at(CHEV, 450, 220) + T(468, 220, 'current: + to −', { size: 16, colour: '#C2570C', anchor: 'start' }) +
        at(ELEC, 450, 250) + T(468, 250, 'electrons: − to +', { size: 16, colour: s.C.blue, anchor: 'start' }), { enter: 'fade', delay: 500 });
    },

    /* ---------- 3. Potential difference ---------- */
    'pd': function (s) {
      panel(s, 40, 22, 340, 308);
      addWire(s, 'M80 100 H340 V280 H80 Z');
      s.add(at(CELL, 210, 280), { flat: true, enter: 'pop' });
      s.add(at(LAMP, 210, 100), { flat: true, enter: 'pop', delay: 100 });
      s.add(at(glow(1), 210, 100), { flat: true, enter: 'pop', delay: 900 });
      flow(s, inset(80, 100, 340, 280, 0), { delay: 500 });
      s.add('<path d="M0 -20 L-12 4 H-2 L-8 22 L12 -4 H2 L8 -20 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="2"/>', { x: 262, y: 236, enter: 'pop', delay: 700 });
      s.add(T(510, 100, 'Potential', { size: 28, weight: 700, colour: s.C.sci }) + T(510, 134, 'difference', { size: 28, weight: 700, colour: s.C.sci }) +
        T(510, 172, '(voltage)', { size: 20, colour: s.C.muted }) + T(510, 214, 'the push', { size: 20 }) + T(510, 240, 'from the cell', { size: 20 }), { enter: 'fade', delay: 300, name: 'p1' });
    },
    'volts': function (s) {
      keepFlowing(s);
      s.hide(s.ref.p1);
      s.add('<g transform="scale(2.2)">' + meter('V') + '</g>', { x: 510, y: 130, enter: 'pop', delay: 300, name: 'v1' });
      s.add(T(510, 210, 'voltmeter', { size: 26, weight: 700, colour: s.C.sci }) + T(510, 244, 'measures potential', { size: 18 }) + T(510, 270, 'difference in volts (V)', { size: 18 }), { enter: 'fade', delay: 700, name: 'v2' });
    },
    'voltmeter': function (s) {
      keepFlowing(s);
      s.hide(s.ref.v2);
      s.add(wire('M160 100 V52 H260 V100') + dot(160, 100) + dot(260, 100) + at(meter('V'), 210, 52), { flat: true, enter: 'down' });
      s.add(tag(308, 52, '1.5 V', 'V'), { enter: 'pop', delay: 600 });
      s.add(T(510, 222, 'in parallel:', { size: 20, weight: 700, colour: s.C.sci }) + T(510, 250, 'across the bulb', { size: 18 }), { enter: 'fade', delay: 900 });
    },
    'more-cells': function (s) {
      s.clear(); s.ref = {};
      [[0, 'one cell', '1.5 V', CELL, 0.25], [310, 'two cells', '3 V', CELL2, 1]].forEach(function (c, k) {
        var dx = c[0], x0 = 60 + dx, x1 = 270 + dx, mx = (x0 + x1) / 2;
        panel(s, 20 + dx, 70, 290, 250, { delay: k * 1200 });
        s.text(165 + dx, 40, c[1], { size: 26, weight: 700, colour: s.C.deep, delay: k * 1200 });
        addWire(s, 'M' + x0 + ' 120 H' + x1 + ' V280 H' + x0 + ' Z', { delay: k * 1200 });
        s.add(at(c[3], mx, 280) + at(LAMP, mx, 120), { flat: true, enter: 'fade', delay: k * 1200 });
        s.add(T(mx, 238, c[2], { size: 22, weight: 700, colour: s.C.sci }), { enter: 'pop', delay: k * 1200 + 300 });
        s.add(at(glow(c[4]), mx, 120), { flat: true, enter: 'pop', delay: k * 1200 + 600 });
        flow(s, inset(x0, 120, x1, 280, 0), { delay: k * 1200 + 400, name: 'f' + k, ms: k ? 4200 : 8400 });
      });
      s.text(165, 168, 'dim', { size: 18, colour: s.C.muted, delay: 900 });
      s.text(475, 168, 'brighter!', { size: 18, weight: 700, colour: '#C2570C', delay: 2100 });
    },

    /* ---------- 4. Series circuits: wires x 170..470, y 100..280 ---------- */
    'series': function (s) {
      s.text(320, 26, 'Series: one loop', { size: 28, weight: 700, colour: s.C.deep });
      panel(s, 120, 50, 400, 280);
      addWire(s, 'M170 100 H470 V280 H170 Z');
      s.add(at(CELL, 320, 280), { flat: true, enter: 'pop' });
      s.add(at(LAMP, 240, 100) + at(LAMP, 400, 100), { flat: true, enter: 'pop', delay: 200 });
      s.add(at(glow(0.6), 240, 100) + at(glow(0.6), 400, 100), { flat: true, enter: 'pop', delay: 900 });
      flow(s, inset(170, 100, 470, 280, 0), { delay: 600 });
      s.add(T(320, 236, 'only one path', { size: 18, colour: s.C.muted }), { enter: 'fade', delay: 1400 });
    },
    'series-current': function (s) {
      keepFlowing(s);
      s.add(at(meter('A'), 170, 190), { flat: true, enter: 'pop' });
      s.add(at(meter('A'), 320, 100), { flat: true, enter: 'pop', delay: 300 });
      s.add(at(meter('A'), 470, 190), { flat: true, enter: 'pop', delay: 600 });
      s.add(tag(228, 190, '0.2 A'), { enter: 'pop', delay: 1000 });
      s.add(tag(320, 140, '0.2 A'), { enter: 'pop', delay: 1300 });
      s.add(tag(412, 190, '0.2 A'), { enter: 'pop', delay: 1600 });
    },
    'series-share': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 26, 'The push is shared', { size: 28, weight: 700, colour: s.C.deep });
      panel(s, 120, 50, 400, 270);
      addWire(s, 'M170 100 H470 V280 H170 Z');
      s.add(at(CELL2, 320, 280), { flat: true, enter: 'pop' });
      s.add(at(LAMP, 240, 100) + at(LAMP, 400, 100), { flat: true, enter: 'pop', delay: 100 });
      s.add(at(glow(0.6), 240, 100) + at(glow(0.6), 400, 100), { flat: true, enter: 'pop', delay: 500 });
      flow(s, inset(170, 100, 470, 280, 0), { delay: 300 });
      s.add(T(320, 234, '3 V', { size: 24, weight: 700, colour: s.C.sci }), { enter: 'pop', delay: 800 });
      s.add(T(240, 146, '1.5 V', { size: 22, weight: 700, colour: s.C.sci }), { enter: 'pop', delay: 1600 });
      s.add(T(400, 146, '1.5 V', { size: 22, weight: 700, colour: s.C.sci }), { enter: 'pop', delay: 2000 });
      s.text(320, 342, '1.5 V + 1.5 V = 3 V', { size: 22, weight: 700, colour: s.C.sci, delay: 2600 });
    },
    'series-more': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 26, 'More bulbs in series: dimmer', { size: 28, weight: 700, colour: s.C.deep });
      panel(s, 120, 50, 400, 280);
      addWire(s, 'M170 100 H470 V280 H170 Z');
      s.add(at(CELL2, 320, 280), { flat: true, enter: 'pop' });
      [230, 320, 410].forEach(function (x, k) {
        s.add(at(LAMP, x, 100), { flat: true, enter: 'pop', delay: k === 2 ? 600 : 0 });
        s.add(at(glow(0.2), x, 100), { flat: true, enter: 'pop', delay: 1200, name: 'g' + k });
      });
      s.add(T(410, 64, 'new bulb', { size: 16, weight: 700, colour: s.C.fun }), { enter: 'fade', delay: 700, name: 'newb' });
      flow(s, inset(170, 100, 470, 280, 0), { delay: 1000, ms: 14000 });
      s.add(T(320, 200, 'smaller current', { size: 20, weight: 700, colour: '#C2570C' }), { enter: 'fade', delay: 1600, name: 'sc' });
    },
    'series-break': function (s) {
      s.add(at(BREAK, 320, 100), { flat: true, enter: 'pop' });
      s.add(T(320, 140, 'broken!', { size: 18, weight: 700, colour: s.C.red }), { enter: 'fade', delay: 200 });
      s.hide(s.ref.newb); s.hide(s.ref.sc);
      stopFlow(s);
      ['g0', 'g1', 'g2'].forEach(function (n) { s.hide(s.ref[n], { delay: 400 }); });
      s.add('<rect x="-120" y="-20" width="240" height="40" rx="20" fill="#FFFFFF" stroke="#E5484D" stroke-width="3"/>' + T(0, 1, 'all the bulbs go out', { size: 18, weight: 700, colour: s.C.red }), { x: 320, y: 236, enter: 'pop', delay: 900 });
    },

    /* ---------- 5. Parallel circuits: branches at y 70 and 170, cell wire at y 280 ---------- */
    'parallel': function (s) {
      panel(s, 120, 24, 400, 290);
      addWire(s, 'M170 70 H470 V280 H170 Z M170 170 H470');
      s.add(dot(170, 170) + dot(470, 170), { flat: true, enter: 'fade' });
      s.add(at(CELL, 280, 280), { flat: true, enter: 'pop' });
      s.add(at(meter('A'), 380, 280) + at(meter('A'), 380, 70) + at(meter('A'), 380, 170), { flat: true, enter: 'pop', delay: 100 });
      s.add(at(LAMP, 280, 70), { flat: true, enter: 'pop', delay: 200 });
      s.add(at(LAMP, 280, 170), { flat: true, enter: 'pop', delay: 200 });
      s.add(at(glow(1), 280, 70), { flat: true, enter: 'pop', delay: 800, name: 'glowTop' });
      s.add(at(glow(1), 280, 170), { flat: true, enter: 'pop', delay: 800 });
      flow(s, [[470, 280], [170, 280], [170, 170], [470, 170]], { delay: 600, name: 'low' });
      flow(s, [[470, 280], [170, 280], [170, 70], [470, 70]], { delay: 600, name: 'top' });
      s.add(T(580, 120, 'branch 1', { size: 18, weight: 700, colour: s.C.fun }) + T(580, 210, 'branch 2', { size: 18, weight: 700, colour: s.C.fun }), { enter: 'fade', delay: 1400 });
    },
    'parallel-add': function (s) {
      stopFlow(s, 'low'); stopFlow(s, 'top');
      s.add(tag(432, 48, '0.3 A'), { enter: 'pop', delay: 300, name: 't1' });
      s.add(tag(432, 148, '0.3 A'), { enter: 'pop', delay: 800, name: 't2' });
      s.add(tag(432, 258, '0.6 A'), { enter: 'pop', delay: 1500, name: 't3' });
      s.add('<rect x="-150" y="-18" width="300" height="36" rx="18" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="3"/>' + T(0, 1, '0.3 A + 0.3 A = 0.6 A', { size: 20, weight: 700, colour: s.C.fun }), { x: 320, y: 342 - 4, enter: 'pop', delay: 2100, name: 't4' });
    },
    'parallel-break': function (s) {
      ['t1', 't2', 't3', 't4'].forEach(function (n) { s.hide(s.ref[n]); });
      s.add(at(BREAK, 280, 70), { flat: true, enter: 'pop', delay: 200 });
      s.hide(s.ref.glowTop, { delay: 300 });
      s.add(T(280, 104, 'broken!', { size: 16, weight: 700, colour: s.C.red }), { enter: 'fade', delay: 400 });
      flow(s, [[470, 280], [170, 280], [170, 170], [470, 170]], { delay: 700, name: 'low' });
      s.add(T(280, 214, 'still on!', { size: 18, weight: 700, colour: s.C.green }), { enter: 'pop', delay: 1200 });
    },
    'house': function (s) {
      s.clear(); s.ref = {};
      s.ground(322);
      s.add('<defs><linearGradient id="crcRoof" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FF7A7E"/><stop offset="1" stop-color="#C93A40"/></linearGradient>' +
        '<linearGradient id="crcWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF9EA"/><stop offset="1" stop-color="#F5E6C2"/></linearGradient></defs>' +
        '<rect x="130" y="124" width="380" height="198" rx="4" fill="url(#crcWall)" stroke="rgba(120,90,40,.5)" stroke-width="2"/><path d="M257 132 V322 M383 132 V322" stroke="rgba(120,90,40,.35)" stroke-width="3"/>' +
        '<path d="M106 132 L320 38 L534 132 Q536 138 530 138 H110 Q104 138 106 132 Z" fill="url(#crcRoof)" stroke="rgba(120,20,30,.5)" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M150 118 L320 44 L490 118" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" opacity=".25"/>', { enter: 'up' });
      [[193, true], [320, false], [447, true]].forEach(function (r, k) {
        var x = r[0];
        if (r[1]) s.add('<defs><linearGradient id="crcBeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE066" stop-opacity=".6"/><stop offset="1" stop-color="#FFE066" stop-opacity=".08"/></linearGradient></defs>' +
          '<path d="M' + (x - 40) + ' 300 L' + (x - 12) + ' 172 H' + (x + 12) + ' L' + (x + 40) + ' 300 Z" fill="url(#crcBeam)"/>', { enter: 'fade', delay: 600 + k * 300, flat: true });
        s.add('<defs><linearGradient id="crcShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8B70FF"/><stop offset="1" stop-color="#5B3FE0"/></linearGradient>' +
          '<radialGradient id="crcOn" cx=".4" cy=".35" r=".75"><stop offset="0" stop-color="#FFFDF0"/><stop offset="1" stop-color="#FFC93C"/></radialGradient></defs>' +
          '<path d="M' + x + ' 138 V158" stroke="#55526E" stroke-width="2.5"/>' +
          '<circle cx="' + x + '" cy="176" r="8" fill="' + (r[1] ? 'url(#crcOn)' : '#D5D9E3') + '" stroke="' + (r[1] ? 'rgba(194,87,12,.5)' : 'rgba(85,82,110,.5)') + '" stroke-width="1.5"/>' +
          '<path d="M' + (x - 15) + ' 172 Q' + x + ' 146 ' + (x + 15) + ' 172 Z" fill="url(#crcShade)" stroke="rgba(45,27,105,.5)" stroke-width="1.5" stroke-linejoin="round"/><path d="M' + (x - 7) + ' 160 Q' + (x - 2) + ' 155 ' + (x + 3) + ' 154" stroke="#FFFFFF" stroke-width="2" fill="none" stroke-linecap="round" opacity=".45"/>',
          { enter: 'down', delay: 300 + k * 300 });
        s.add('<rect x="' + (x + 33) + '" y="225" width="20" height="30" rx="5" fill="#FFFFFF" stroke="rgba(85,82,110,.55)" stroke-width="1.5"/><rect x="' + (x + 38) + '" y="' + (r[1] ? 230 : 240) + '" width="10" height="10" rx="3" fill="' + (r[1] ? s.C.green : s.C.red) + '"/>',
          { enter: 'pop', delay: 600 + k * 300 });
        s.add(T(x, 290, r[1] ? 'on' : 'off', { size: 20, weight: 700, colour: r[1] ? s.C.green : s.C.red }), { enter: 'fade', delay: 1200 + k * 300 });
      });
      s.text(320, 100, 'Each light has its own switch', { size: 18, weight: 700, colour: '#FFFFFF', delay: 2100 }).querySelector('text').setAttribute('stroke', '#A8262C');
    },

    /* ---------- 6. Resistance ---------- */
    'resistance': function (s) {
      s.text(320, 34, 'Resistance', { size: 30, weight: 700, colour: s.C.deep });
      panel(s, 200, 98, 240, 84, { delay: 200 });
      s.add(wire('M-90 0 H90') + '<g transform="scale(2)">' + RES + '</g>', { flat: true, x: 320, y: 140, enter: 'pop', delay: 300 });
      s.text(320, 200, 'a resistor', { size: 24, weight: 700, colour: s.C.fun, delay: 700 });
      s.text(320, 250, 'makes it harder for', { size: 20, delay: 1200 });
      s.text(320, 278, 'current to flow', { size: 20, delay: 1300 });
      s.owl(80, 340, 100, { delay: 500 });
    },
    'ohms': function (s) {
      s.clear(); s.ref = {};
      [[0, '2 Ω', '3 A', 'small resistance', 3000], [310, '6 Ω', '1 A', 'big resistance', 9000]].forEach(function (c, k) {
        var dx = c[0], x0 = 60 + dx, x1 = 260 + dx, d = k * 1300;
        panel(s, 20 + dx, 64, 290, 256, { delay: d });
        s.text(165 + dx, 36, c[3], { size: 24, weight: 700, colour: s.C.deep, delay: d });
        addWire(s, 'M' + x0 + ' 120 H' + x1 + ' V280 H' + x0 + ' Z', { delay: d });
        s.add(at(BATT, x0 + 100, 280) + at(RES, x0 + 100, 120) + at(meter('A'), x1, 200), { flat: true, enter: 'fade', delay: d });
        s.add(T(x0 + 100, 90, c[1], { size: 22, weight: 700, colour: s.C.fun }) + T(x0 + 100, 236, '6 V', { size: 20, weight: 700, colour: s.C.sci }), { enter: 'pop', delay: d + 300 });
        s.add(tag(x1 - 56, 200, c[2], 'I'), { enter: 'pop', delay: d + 700 });
        flow(s, inset(x0, 120, x1, 280, 0), { delay: d + 500, name: 'f' + k, ms: c[4] });
      });
      s.text(320, 342, 'more resistance, less current', { size: 20, weight: 700, colour: '#C2570C', delay: 3000 });
    },
    'formula': function (s) {
      s.clear(); s.ref = {};
      s.add('<rect x="-200" y="-56" width="400" height="112" rx="24" fill="#FFFFFF" stroke="#6C4DF6" stroke-width="4"/>' + T(0, 2, 'R = V ÷ I', { size: 60, weight: 700, colour: s.C.fun }), { x: 320, y: 110, enter: 'pop' });
      s.text(320, 214, 'R = resistance, in ohms (Ω)', { size: 22, delay: 700 });
      s.text(320, 254, 'V = potential difference, in volts (V)', { size: 22, delay: 1200 });
      s.text(320, 294, 'I = current, in amps (A)', { size: 22, delay: 1700 });
    },
    'calc': function (s) {
      s.clear(); s.ref = {};
      panel(s, 20, 24, 330, 300);
      s.add(wire('M60 120 H300 V280 H60 Z M120 120 V62 H240 V120') + dot(120, 120) + dot(240, 120) + at(BATT, 180, 280) + at(RES, 180, 120) + at(meter('V'), 180, 62) + at(meter('A'), 300, 200), { flat: true, enter: 'fade' });
      s.add(tag(278, 62, '6 V', 'V'), { enter: 'pop', delay: 400 });
      s.add(tag(244, 200, '2 A', 'I'), { enter: 'pop', delay: 800 });
      s.text(490, 90, 'R = V ÷ I', { size: 30, weight: 700, colour: s.C.fun, delay: 1200 });
      s.text(490, 150, '= 6 ÷ 2', { size: 30, delay: 1800 });
      s.add('<rect x="-80" y="-30" width="160" height="60" rx="16" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' + T(0, 2, '= 3 Ω', { size: 32, weight: 700, colour: '#0E7A5A' }).replace('stroke="#FFFFFF"', 'stroke="#DDF7EE"'), { x: 490, y: 222, enter: 'pop', delay: 2400 });
    },
    'rearrange': function (s) {
      s.clear(); s.ref = {};
      panel(s, 64, 48, 252, 176);
      s.add(wire('M30 0 H230') + at(RES, 130, 0), { flat: true, x: 60, y: 120, enter: 'fade' });
      s.text(190, 80, '3 Ω', { size: 24, weight: 700, colour: s.C.fun, delay: 200 });
      s.add('<path d="M0 0 H58" stroke="#FF8A3D" stroke-width="6" stroke-linecap="round"/><path d="M56 -10 L74 0 L56 10 Z" fill="#FF8A3D" stroke="#FF8A3D" stroke-width="2" stroke-linejoin="round"/>', { x: 100, y: 160, enter: 'left', delay: 600, flat: true });
      s.text(138, 190, '4 A', { size: 22, weight: 700, colour: '#C2570C', delay: 700 });
      s.text(480, 80, 'V = I × R', { size: 30, weight: 700, colour: s.C.fun, delay: 1200 });
      s.text(480, 140, '= 4 × 3', { size: 30, delay: 1800 });
      s.add('<rect x="-80" y="-30" width="160" height="60" rx="16" fill="#DDF7EE" stroke="#22A06B" stroke-width="3"/>' + T(0, 2, '= 12 V', { size: 32, weight: 700, colour: '#0E7A5A' }).replace('stroke="#FFFFFF"', 'stroke="#DDF7EE"'), { x: 480, y: 212, enter: 'pop', delay: 2400 });
      s.text(320, 316, 'potential difference = current × resistance', { size: 20, colour: s.C.muted, delay: 3000 });
    }
  });
})();
