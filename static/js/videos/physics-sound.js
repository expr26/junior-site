/* Pictures for the Sound theory video (words: videos/physics/sound.json). Stage is 640 x 360; see static/js/theory.js.
   The speed bars are to scale (5000 m/s = 360 units). The hearing-range strip is NOT to scale, and says so. */
(function () {
  if (!window.Theory) return;

  var F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  function T(x, y, str, size, col, o) {
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + size + '" font-weight="' + (o.w || 600) + '" fill="' + col +
      '" text-anchor="' + (o.a || 'middle') + '" dominant-baseline="middle">' + str + '</text>';
  }
  function keep(s, g) { (s.ref.cur = s.ref.cur || []).push(g); return g; }
  function gone(s) { (s.ref.cur || []).forEach(function (g) { s.hide(g); }); s.ref.cur = []; }
  function fresh(s) { s.clear(); s.ref = {}; }
  function loop(s, g, frames, ms, delay) { s.anim(g, frames, ms, { iterations: Infinity, easing: 'linear', delay: delay || 0 }); }
  function wave(x0, y0, w, amp, n) {   // n whole waves across width w
    var d = 'M' + x0 + ' ' + y0;
    for (var i = 1; i <= 120; i++) { var x = x0 + w * i / 120; d += ' L' + x.toFixed(1) + ' ' + (y0 - amp * Math.sin(2 * Math.PI * n * i / 120)).toFixed(1); }
    return d;
  }
  function draw(s, d, col, width, delay) {   // a line that draws itself
    var g = s.add('<path d="' + d + '" stroke="' + col + '" stroke-width="' + (width || 4) + '" fill="none" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>', { enter: 'none' });
    var p = g.querySelector('path');
    if (p.animate && !s.fast) p.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1200, delay: delay || 0, fill: 'both' });
    else p.setAttribute('stroke-dashoffset', '0');
    return g;
  }
  function screen(w, h) {
    var grid = '';
    for (var x = 20; x < w; x += 20) grid += '<path d="M' + x + ' 0 V' + h + '" stroke="#1F5E4A" stroke-width="1"/>';
    for (var y = 20; y < h; y += 20) grid += '<path d="M0 ' + y + ' H' + w + '" stroke="#1F5E4A" stroke-width="1"/>';
    return '<rect x="-8" y="-8" width="' + (w + 16) + '" height="' + (h + 16) + '" rx="14" fill="#55526E"/><rect width="' + w + '" height="' + h + '" rx="6" fill="#0E3B2E"/>' + grid +
      '<path d="M0 ' + (h / 2) + ' H' + w + '" stroke="#2E8A6C" stroke-width="2"/>';
  }
  function arcs(n, col, r0) {   // sound arcs spreading to the right from (0,0)
    var p = '';
    for (var i = 0; i < n; i++) { var r = (r0 || 20) + i * 18; p += '<path d="M' + (r * 0.7).toFixed(1) + ' ' + (-r * 0.7).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (r * 0.7).toFixed(1) + ' ' + (r * 0.7).toFixed(1) + '" stroke="' + (col || '#6C4DF6') + '" stroke-width="5" fill="none" stroke-linecap="round"/>'; }
    return p;
  }
  var SPEAKER = '<rect x="-34" y="-30" width="24" height="60" rx="4" fill="#55526E"/><path d="M-10 -30 L24 -62 V62 L-10 30 Z" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/>';
  var BAT = '<path d="M0 -6 C-10 -20 -30 -22 -52 -10 C-42 -6 -40 2 -44 8 C-34 2 -24 6 -20 12 C-14 4 -6 4 0 10 C6 4 14 4 20 12 C24 6 34 2 44 8 C40 2 42 -6 52 -10 C30 -22 10 -20 0 -6 Z" fill="#2D1B69"/>' +
    '<path d="M-6 -12 L-8 -22 L-2 -14 M6 -12 L8 -22 L2 -14" fill="#2D1B69" stroke="#2D1B69" stroke-width="3"/><circle cx="-3" cy="-6" r="1.6" fill="#FFC93C"/><circle cx="3" cy="-6" r="1.6" fill="#FFC93C"/>';
  var ELEPHANT = '<ellipse cx="0" cy="0" rx="46" ry="30" fill="#9AA0B4"/><circle cx="-44" cy="-12" r="22" fill="#9AA0B4"/><path d="M-60 -2 Q-70 24 -58 40" stroke="#9AA0B4" stroke-width="10" fill="none" stroke-linecap="round"/>' +
    '<path d="M-38 -26 Q-20 -30 -26 0 Q-36 4 -40 -8 Z" fill="#C9CED8"/><circle cx="-50" cy="-16" r="3" fill="#1E1B3A"/><path d="M-30 24 v18 M-6 26 v18 M18 26 v18 M36 22 v18" stroke="#9AA0B4" stroke-width="11" stroke-linecap="round"/>';
  var DOG = '<ellipse cx="0" cy="0" rx="30" ry="16" fill="#C98A4B"/><circle cx="-30" cy="-16" r="14" fill="#C98A4B"/><path d="M-38 -28 l-6 -14 l12 8 Z M-24 -28 l4 -14 l6 12 Z" fill="#8A5A2B"/><circle cx="-34" cy="-18" r="2.5" fill="#1E1B3A"/><circle cx="-44" cy="-12" r="3" fill="#1E1B3A"/>' +
    '<path d="M-18 14 v14 M18 14 v14 M30 -4 q14 -10 10 -20" stroke="#C98A4B" stroke-width="7" fill="none" stroke-linecap="round"/>';

  Theory.scenes({
    /* ---------- 1. Making sounds ---------- */
    'string': function (s) {
      keep(s, s.text(320, 40, 'Vibrations make sound', { size: 32, weight: 700, colour: s.C.fun }));
      keep(s, s.add('<rect x="90" y="140" width="24" height="70" rx="6" fill="#8A5A2B"/><rect x="526" y="140" width="24" height="70" rx="6" fill="#8A5A2B"/><path d="M102 175 H538" stroke="#C9CED8" stroke-width="2" stroke-dasharray="4 6"/>', { enter: 'fade' }));
      var str = keep(s, s.add('<path d="M102 175 Q320 140 538 175" stroke="#FF8A3D" stroke-width="5" fill="none"/>', { enter: 'fade', delay: 300 }));
      loop(s, str, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(-1)' }, { transform: 'scaleY(1)' }], 140, 600);
      keep(s, s.text(320, 250, 'backwards and forwards, very fast', { size: 22, colour: s.C.ink, delay: 900 }));
      ['♪', '♫', '♪'].forEach(function (n, k) {
        var g = keep(s, s.text(220 + k * 100, 110, n, { size: 34, colour: [s.C.pink, s.C.blue, s.C.green][k], delay: 1200 + k * 300 }));
        loop(s, g, [{ transform: 'translateY(0)' }, { transform: 'translateY(-10px)' }, { transform: 'translateY(0)' }], 1200, 1500 + k * 300);
      });
    },
    'drum': function (s) {
      gone(s);
      keep(s, s.owl(150, 300, 160));
      keep(s, s.add('<path d="M0 0 Q30 -30 70 -20" stroke="#55526E" stroke-width="3" fill="none"/>' + T(100, -34, 'hmmm', 26, '#6C4DF6', { w: 700 }), { x: 190, y: 170, enter: 'pop', delay: 400 }));
      keep(s, s.text(150, 330, 'vocal cords', { size: 20, weight: 700, colour: s.C.fun, delay: 700 }));
      keep(s, s.add('<path d="M-80 0 V80 Q0 110 80 80 V0" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/><path d="M-80 30 L-40 90 M80 30 L40 90 M-40 20 L0 92 L40 20" stroke="#FFC93C" stroke-width="4" fill="none"/>', { x: 470, y: 200, enter: 'up', delay: 800 }));
      var skin = keep(s, s.add('<ellipse rx="80" ry="22" fill="#FFF4D6" stroke="#1E1B3A" stroke-width="3"/>', { x: 470, y: 200, enter: 'up', delay: 800 }));
      loop(s, skin, [{ transform: 'scaleY(1)' }, { transform: 'scaleY(.75)' }, { transform: 'scaleY(1)' }], 120, 1600);
      var stick = keep(s, s.add('<path d="M0 0 L70 -70" stroke="#8A5A2B" stroke-width="8" stroke-linecap="round"/><circle r="10" fill="#C98A4B"/>', { x: 470, y: 160, enter: 'fade', delay: 1000 }));
      s.anim(stick, [{ transform: 'translate(0,-40px)' }, { transform: 'translate(0,0)' }], 400, { delay: 1200, easing: 'ease-in' });
      keep(s, s.text(470, 330, 'drum skin', { size: 20, weight: 700, colour: s.C.red, delay: 1400 }));
    },
    'particles': function (s) {
      fresh(s);
      var spk = s.add(SPEAKER, { x: 60, y: 200, enter: 'pop' });
      loop(s, spk, [{ transform: 'translateX(0)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(0)' }], 1000, 0);
      for (var c = 0; c < 14; c++) {
        var dots = '';
        for (var r = 0; r < 6; r++) dots += '<circle cx="0" cy="' + (r * 32) + '" r="7" fill="' + (c === 6 && r === 2 ? '#E5484D' : '#2F80ED') + '"/>';
        var col = s.add(dots, { x: 140 + c * 33, y: 120, enter: 'fade', delay: c * 40 });
        loop(s, col, [{ transform: 'translateX(0)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(0)' }], 1000, 400 + c * 110);
      }
      s.text(320, 28, 'Air particles pass the vibration on', { size: 24, weight: 700, colour: s.C.fun });
      s.text(60, 300, 'speaker', { size: 18, colour: s.C.muted, delay: 300 });
    },
    'particle-jiggle': function (s) {
      s.arrow(200, 90, 300, 'r', { colour: s.C.fun, width: 8, label: 'the sound wave travels', size: 18, delay: 200 });
      s.add('<circle r="16" fill="none" stroke="#E5484D" stroke-width="3" stroke-dasharray="5 4"/>', { x: 338, y: 184, enter: 'pop', delay: 700 });
      s.text(338, 330, 'the red particle just jiggles', { size: 20, weight: 700, colour: s.C.red, delay: 900, name: 'jl' });
      s.add('<path d="M338 304 V208" stroke="#E5484D" stroke-width="3" stroke-dasharray="6 5"/>', { enter: 'fade', delay: 900, name: 'jline' });
    },
    'longitudinal': function (s) {
      s.hide(s.ref.jl); s.hide(s.ref.jline);
      s.add('<path d="M-18 0 H18 M-18 0 l8 -6 M-18 0 l8 6 M18 0 l-8 -6 M18 0 l-8 6" stroke="#E5484D" stroke-width="3.5" fill="none" stroke-linecap="round"/>', { x: 338, y: 200, enter: 'pop', delay: 300 });
      s.add('<rect x="-200" y="-30" width="400" height="60" rx="18" fill="#FFFFFF" stroke="#0F9488" stroke-width="3"/>' + T(0, -10, 'longitudinal wave', 22, '#0F9488', { w: 700 }) +
        T(0, 14, 'particles jiggle along the direction the wave travels', 15, '#55526E'), { x: 400, y: 322, enter: 'pop', delay: 600 });
    },

    /* ---------- 2. What can sound travel through? ---------- */
    'media': function (s) {
      fresh(s);
      s.text(320, 34, 'Sound travels through…', { size: 30, weight: 700, colour: s.C.fun });
      function boxOf(kind) {
        var p = '<rect x="-75" y="-65" width="150" height="130" rx="14" fill="#FFFFFF" stroke="#55526E" stroke-width="3"/>', k = 0;
        if (kind === 0) for (var r = 0; r < 5; r++) for (var c = 0; c < 6; c++) p += '<circle cx="' + (-55 + c * 22) + '" cy="' + (-46 + r * 23) + '" r="9.5" fill="#6C4DF6"/>';
        if (kind === 1) [[-50, -40], [-28, -44], [-6, -38], [18, -42], [42, -36], [58, -16], [-56, -16], [-34, -20], [-12, -14], [12, -18], [36, -12], [-46, 8], [-22, 4], [2, 10], [26, 6], [50, 12], [-56, 34], [-32, 30], [-8, 36], [16, 32], [40, 38], [58, 44]].forEach(function (q) { p += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="9.5" fill="#2F80ED"/>'; });
        if (kind === 2) [[-48, -40], [10, -30], [44, -44], [-20, 0], [36, 14], [-50, 38], [6, 40], [52, 46]].forEach(function (q) { p += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="9.5" fill="#0F9488"/>'; });
        void k;
        return p;
      }
      [['solids', 120, s.C.fun], ['liquids', 320, s.C.blue], ['gases', 520, s.C.sci]].forEach(function (it, k) {
        s.add(boxOf(k), { x: it[1], y: 160, enter: 'pop', delay: k * 450 });
        s.text(it[1], 250, it[0], { size: 24, weight: 700, colour: it[2], delay: k * 450 + 200 });
      });
      s.text(320, 312, 'the material is called the medium', { size: 22, colour: s.C.ink, delay: 1700 });
    },
    'bell-jar': function (s) {
      fresh(s);
      s.text(320, 30, 'A bell in a jar', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<rect x="70" y="290" width="240" height="16" rx="4" fill="#8A5A2B"/><path d="M310 298 H380 V250" stroke="#55526E" stroke-width="8" fill="none"/><rect x="356" y="210" width="48" height="44" rx="8" fill="#9AA0B4" stroke="#55526E" stroke-width="3"/>' + T(380, 232, 'pump', 13, '#1E1B3A', { w: 700 }),
        { enter: 'fade' });
      var air = '';
      [[110, 120], [150, 160], [250, 110], [270, 200], [120, 230], [230, 250], [180, 100], [100, 180], [260, 150]].forEach(function (q) { air += '<circle cx="' + q[0] + '" cy="' + q[1] + '" r="6" fill="#2F80ED"/>'; });
      var a = s.add(air, { enter: 'fade' });
      s.add('<path d="M190 140 a26 26 0 0 1 26 26 V200 H164 V166 a26 26 0 0 1 26 -26 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/><circle cx="190" cy="208" r="8" fill="#C2570C"/><path d="M190 200 V290" stroke="#55526E" stroke-width="4"/>', { enter: 'pop', delay: 200 });
      s.add('<path d="M80 290 V150 Q80 70 190 70 Q300 70 300 150 V290" fill="#CFE8FF" fill-opacity=".25" stroke="#7FB2F5" stroke-width="5"/>', { enter: 'fade', delay: 300 });
      var w1 = s.add(arcs(3, '#6C4DF6', 22), { x: 222, y: 180, enter: 'fade', delay: 500 });
      var w2 = s.add('<g transform="scale(-1,1)">' + arcs(3, '#6C4DF6', 22) + '</g>', { x: 158, y: 180, enter: 'fade', delay: 500 });
      s.hide(a, { delay: 1500, ms: 1400 });
      s.hide(w1, { delay: 1700, ms: 1400 }); s.hide(w2, { delay: 1700, ms: 1400 });
      s.text(510, 120, 'pump the air out…', { size: 22, colour: s.C.ink, delay: 1300 });
      s.text(510, 170, 'no particles', { size: 24, weight: 700, colour: s.C.red, delay: 2300 });
      s.text(510, 206, '= no sound', { size: 24, weight: 700, colour: s.C.red, delay: 2500 });
      s.text(510, 268, 'a vacuum', { size: 26, weight: 700, colour: s.C.fun, delay: 2800 });
    },
    'space': function (s) {
      fresh(s);
      var stars = '';
      for (var i = 0; i < 40; i++) stars += '<circle cx="' + ((i * 137) % 640) + '" cy="' + ((i * 89) % 360) + '" r="' + (1 + (i % 3) * 0.7) + '" fill="#FFFFFF" opacity=".8"/>';
      s.add('<rect width="640" height="360" fill="#1E1B3A"/>' + stars, { enter: 'fade' });
      function astro(col) {
        return '<rect x="-24" y="10" width="48" height="56" rx="14" fill="#FFFFFF" stroke="#C9CED8" stroke-width="3"/><circle r="30" fill="#FFFFFF" stroke="#C9CED8" stroke-width="3"/><circle r="20" fill="' + col + '"/>' +
          '<path d="M-6 -8 q6 -6 14 -2" stroke="#FFFFFF" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/><path d="M14 -26 V-46" stroke="#C9CED8" stroke-width="3"/><circle cx="14" cy="-48" r="4" fill="#E5484D"/>';
      }
      s.add(astro('#6C4DF6'), { x: 150, y: 170, enter: 'pop', delay: 200 });
      s.add('<g transform="scale(-1,1)">' + astro('#FF5D8F') + '</g>', { x: 490, y: 170, enter: 'pop', delay: 400 });
      s.add('<text x="0" y="0" ' + F + ' font-size="26" font-weight="700" fill="#FFFFFF" text-anchor="middle">"Hello!"</text><path d="M-50 20 L50 -20" stroke="#E5484D" stroke-width="6" stroke-linecap="round"/>', { x: 320, y: 120, enter: 'pop', delay: 900 });
      s.add('<path d="M0 0 q20 -14 40 0 t40 0 t40 0 t40 0" stroke="#22D3A8" stroke-width="4" fill="none" stroke-dasharray="8 6"/>', { x: 240, y: 260, enter: 'left', delay: 1600 });
      s.add(T(320, 300, 'radio waves can cross empty space', 20, '#22D3A8', { w: 700 }), { enter: 'fade', delay: 1800 });
      s.add(T(320, 50, 'Space is silent', 32, '#FFFFFF', { w: 700 }), { enter: 'up', delay: 100 });
    },
    'speeds': function (s) {
      fresh(s);
      s.text(320, 34, 'How fast does sound travel?', { size: 28, weight: 700, colour: s.C.fun });
      var rows = [['air', 340, '#0F9488'], ['water', 1500, '#2F80ED'], ['steel', 5000, '#6C4DF6']];
      rows.forEach(function (r, k) {
        var y = 110 + k * 80, w = r[1] * 360 / 5000, dl = 300 + k * 700;
        s.text(30, y, r[0], { size: 24, weight: 700, colour: r[2], anchor: 'start', delay: dl });
        var b = s.add('<rect x="0" y="-18" width="' + w + '" height="36" rx="8" fill="' + r[2] + '"/>', { x: 120, y: y, enter: 'none' });
        b._inner.style.transformOrigin = '0% 50%';
        s.anim(b, [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], 700, { delay: dl });
        s.text(130 + w, y, 'about ' + r[1] + ' m/s', { size: 20, weight: 700, colour: s.C.ink, anchor: 'start', delay: dl + 500 });
      });
      s.text(320, 330, 'fastest in solids: particles close and strongly joined', { size: 19, colour: s.C.muted, delay: 2600 });
    },

    /* ---------- 3. Loudness and pitch ---------- */
    'scope': function (s) {
      fresh(s);
      s.add('<rect x="-14" y="-40" width="28" height="50" rx="14" fill="#55526E"/><path d="M-22 -6 q0 30 22 30 q22 0 22 -30 M0 24 V44 M-14 44 H14" stroke="#55526E" stroke-width="4" fill="none"/>', { x: 80, y: 170, enter: 'pop' });
      s.add('<path d="M80 214 Q80 300 200 280" stroke="#1E1B3A" stroke-width="4" fill="none"/>', { enter: 'fade', delay: 300 });
      s.add(screen(360, 200), { x: 220, y: 80, enter: 'pop', delay: 400 });
      draw(s, wave(220, 180, 360, 60, 4), '#7CFFB2', 4, 900);
      s.text(400, 330, 'a sound on a screen', { size: 22, weight: 700, colour: s.C.sci, delay: 1400 });
      s.owl(60, 350, 70, { delay: 1000 });
    },
    'amplitude': function (s) {
      fresh(s);
      s.add(screen(260, 180), { x: 30, y: 70, enter: 'pop' });
      s.add(screen(260, 180), { x: 350, y: 70, enter: 'pop', delay: 200 });
      draw(s, wave(30, 160, 260, 25, 3), '#7CFFB2', 4, 500);
      draw(s, wave(350, 160, 260, 75, 3), '#7CFFB2', 4, 700);
      s.text(160, 286, 'small amplitude', { size: 20, weight: 700, colour: s.C.ink, delay: 1200 });
      s.text(160, 316, 'quiet', { size: 26, weight: 700, colour: s.C.blue, delay: 1400 });
      s.text(480, 286, 'big amplitude', { size: 20, weight: 700, colour: s.C.ink, delay: 1600 });
      s.text(480, 316, 'LOUD', { size: 30, weight: 700, colour: s.C.red, enter: 'pop', delay: 1800 });
      // amplitude marker: from the middle line up to the top of the first peak (x = 350 + 260/12)
      s.add('<path d="M371.7 160 V85" stroke="#FFC93C" stroke-width="4"/><path d="M364 85 H380 M364 160 H380" stroke="#FFC93C" stroke-width="4"/>', { enter: 'fade', delay: 2200 });
      s.text(480, 40, 'amplitude = height of the wave', { size: 22, weight: 700, colour: '#C2570C', delay: 2200 });
    },
    'frequency': function (s) {
      fresh(s);
      var fork = keep(s, s.add('<path d="M-20 -100 V0 Q-20 20 0 20 Q20 20 20 0 V-100" stroke="#9AA0B4" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M0 20 V90" stroke="#9AA0B4" stroke-width="12" stroke-linecap="round"/>', { x: 120, y: 200, enter: 'pop' }));
      loop(s, fork, [{ transform: 'scaleX(1)' }, { transform: 'scaleX(1.12)' }, { transform: 'scaleX(1)' }], 100, 500);
      s.add(arcs(2, '#6C4DF6', 34), { x: 140, y: 140, enter: 'fade', delay: 700 });
      s.text(410, 80, 'frequency', { size: 40, weight: 700, colour: s.C.fun, enter: 'pop', delay: 300 });
      s.text(410, 130, 'vibrations each second', { size: 24, colour: s.C.ink, delay: 700 });
      s.text(410, 190, 'measured in hertz (Hz)', { size: 24, weight: 700, colour: s.C.sci, delay: 1200 });
      s.add('<rect x="-150" y="-30" width="300" height="60" rx="16" fill="#FFF4D6" stroke="#FFC93C" stroke-width="3"/>' + T(0, -8, '100 Hz', 26, '#C2570C', { w: 700 }) + T(0, 16, '= 100 vibrations every second', 16, '#1E1B3A'),
        { x: 410, y: 270, enter: 'pop', delay: 1800 });
    },
    'pitch': function (s) {
      fresh(s);
      s.add(screen(260, 160), { x: 30, y: 50, enter: 'pop' });
      s.add(screen(260, 160), { x: 350, y: 50, enter: 'pop', delay: 200 });
      draw(s, wave(30, 130, 260, 55, 2), '#7CFFB2', 4, 500);
      draw(s, wave(350, 130, 260, 55, 7), '#7CFFB2', 4, 700);
      s.text(160, 238, 'low frequency', { size: 20, weight: 700, colour: s.C.ink, delay: 1100 });
      s.text(160, 266, 'low pitch', { size: 24, weight: 700, colour: s.C.blue, delay: 1300 });
      s.text(480, 238, 'high frequency', { size: 20, weight: 700, colour: s.C.ink, delay: 1500 });
      s.text(480, 266, 'high pitch', { size: 24, weight: 700, colour: s.C.pink, delay: 1700 });
      s.add('<ellipse cx="0" cy="0" rx="40" ry="12" fill="#FFF4D6" stroke="#1E1B3A" stroke-width="3"/><path d="M-40 0 V36 Q0 52 40 36 V0" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/>', { x: 160, y: 306, enter: 'pop', delay: 2000 });
      s.add('<rect x="-40" y="-14" width="70" height="28" rx="14" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/><circle cx="30" cy="2" r="18" fill="#FFC93C" stroke="#C2570C" stroke-width="3"/><circle cx="30" cy="2" r="6" fill="#C2570C"/>', { x: 470, y: 316, enter: 'pop', delay: 2200 });
    },

    /* ---------- 4. How we hear ---------- */
    'ear-1': function (s) {
      fresh(s);
      s.text(320, 30, 'Inside your ear', { size: 30, weight: 700, colour: s.C.fun });
      // outer ear, canal and eardrum
      s.add('<path d="M130 120 Q70 70 50 140 Q40 200 80 240 Q100 260 130 240" fill="#FFC9A8" stroke="#C2570C" stroke-width="4"/><path d="M130 160 H290 M130 200 H290" stroke="#C2570C" stroke-width="4"/><rect x="130" y="160" width="160" height="40" fill="#FFE3D1"/>',
        { enter: 'fade' });
      var drum = s.add('<ellipse cx="0" cy="0" rx="5" ry="34" fill="#FF5D8F" stroke="#B42318" stroke-width="2"/>', { x: 293, y: 180, enter: 'pop', delay: 300 });
      loop(s, drum, [{ transform: 'translateX(0)' }, { transform: 'translateX(4px)' }, { transform: 'translateX(0)' }], 160, 1400);
      var w = s.add(arcs(3, '#6C4DF6', 14), { x: 20, y: 180, enter: 'fade', delay: 500 });
      s.move(w, 200, 180, 1200, { delay: 500, easing: 'linear' });
      s.hide(w, { delay: 1500, ms: 300 });
      s.text(90, 290, 'outer ear', { size: 20, weight: 700, colour: '#C2570C', delay: 600 });
      s.text(210, 140, 'ear canal', { size: 17, colour: s.C.muted, delay: 800 });
      s.text(293, 248, 'eardrum', { size: 20, weight: 700, colour: s.C.pink, delay: 1200 });
    },
    'ear-2': function (s) {
      s.add('<path d="M300 182 L322 168 L338 180" stroke="#9AA0B4" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M338 180 L352 192 L366 186" stroke="#9AA0B4" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
        { enter: 'pop' });
      s.text(334, 136, 'tiny bones', { size: 18, weight: 700, colour: s.C.muted, delay: 200 });
      var sp = 'M430 190', a, r;
      for (var i = 0; i <= 60; i++) { a = i / 60 * Math.PI * 4.2; r = 34 - i * 0.5; sp += ' L' + (430 + r * Math.cos(a)).toFixed(1) + ' ' + (190 + r * Math.sin(a)).toFixed(1); }
      s.add('<path d="' + sp.replace('M430 190 L', 'M') + '" stroke="#22A06B" stroke-width="7" fill="none" stroke-linecap="round"/>', { enter: 'pop', delay: 500 });
      s.text(430, 248, 'cochlea', { size: 20, weight: 700, colour: s.C.green, delay: 700 });
      s.add('<path d="M462 176 Q520 160 540 110" stroke="#FFC93C" stroke-width="5" fill="none"/>', { enter: 'fade', delay: 900 });
      s.add('<path d="M500 70 Q520 40 560 46 Q600 36 614 70 Q634 96 606 116 Q590 134 556 126 Q520 130 506 108 Q488 90 500 70 Z" fill="#FFB4C6" stroke="#C2306A" stroke-width="3"/><path d="M520 80 q14 -10 24 4 q10 -14 24 0 q12 -6 20 8 M528 104 q16 -8 28 2 q14 -10 30 0" stroke="#C2306A" stroke-width="2" fill="none"/>',
        { enter: 'pop', delay: 1100 });
      s.text(600, 150, 'brain', { size: 20, weight: 700, colour: '#C2306A', delay: 1300 });
      s.text(530, 196, 'nerve', { size: 18, weight: 700, colour: '#C2570C', delay: 1100 });
      [0, 1, 2].forEach(function (k) {
        var p = s.add('<circle r="6" fill="#FF8A3D"/>', { x: 466, y: 175, enter: 'fade', delay: 1500 + k * 400, ms: 1 });
        s.move(p, 538, 116, 600, { delay: 1500 + k * 400 });
        s.hide(p, { delay: 2100 + k * 400, ms: 100 });
      });
    },
    'range': function (s) {
      fresh(s);
      s.text(320, 34, 'Your hearing range', { size: 30, weight: 700, colour: s.C.fun });
      s.add('<rect x="140" y="170" width="330" height="60" rx="10" fill="#22A06B"/>' + T(305, 201, 'we can hear these', 22, '#FFFFFF', { w: 700 }), { enter: 'pop' });
      s.add('<path d="M140 160 V240 M470 160 V240" stroke="#1E1B3A" stroke-width="3"/>', { enter: 'fade', delay: 300 });
      s.text(140, 258, '20 Hz', { size: 20, weight: 700, colour: s.C.ink, delay: 500 });
      s.text(470, 258, '20,000 Hz', { size: 20, weight: 700, colour: s.C.ink, delay: 700 });
      s.text(110, 120, 'low pitch', { size: 18, colour: s.C.muted, delay: 900 });
      s.text(530, 120, 'high pitch', { size: 18, colour: s.C.muted, delay: 900 });
      s.add('<path d="M180 120 H460" stroke="#9AA0B4" stroke-width="3"/><path d="M460 120 l-10 -7 v14 Z" fill="#9AA0B4"/>', { enter: 'fade', delay: 900 });
      s.arrow(462, 296, 90, 'l', { colour: s.C.orange, width: 6, delay: 1600 });
      s.text(355, 296, 'top gets lower with age', { size: 18, weight: 700, colour: s.C.orange, anchor: 'end', delay: 1800 });
      s.text(320, 340, '(not to scale)', { size: 15, colour: s.C.muted, delay: 1000 });
    },
    'ultra': function (s) {
      s.add('<rect x="20" y="170" width="116" height="60" rx="10" fill="#9AA0B4"/>' + T(78, 201, 'infrasound', 18, '#FFFFFF', { w: 700 }), { enter: 'right' });
      s.add('<rect x="474" y="170" width="146" height="60" rx="10" fill="#6C4DF6"/>' + T(547, 201, 'ultrasound', 20, '#FFFFFF', { w: 700 }), { enter: 'left', delay: 300 });
      s.add('<g transform="scale(.8)">' + ELEPHANT + '</g>', { x: 80, y: 314, enter: 'pop', delay: 800 });
      s.add('<g transform="scale(.7)">' + BAT + '</g>', { x: 590, y: 266, enter: 'pop', delay: 1100 });
      s.add(DOG, { x: 545, y: 322, enter: 'pop', delay: 1300 });
    },
    'loud': function (s) {
      fresh(s);
      s.owl(200, 320, 180);
      s.add('<path d="M128 200 Q130 92 200 92 Q270 92 272 200" stroke="#E5484D" stroke-width="12" fill="none" stroke-linecap="round"/><rect x="112" y="176" width="34" height="56" rx="14" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/><rect x="254" y="176" width="34" height="56" rx="14" fill="#E5484D" stroke="#1E1B3A" stroke-width="3"/>',
        { enter: 'down', delay: 600 });
      s.text(200, 60, 'ear defenders', { size: 24, weight: 700, colour: s.C.red, delay: 900 });
      var drill = '<rect x="-20" y="-60" width="40" height="70" rx="8" fill="#FFC93C" stroke="#1E1B3A" stroke-width="3"/><rect x="-50" y="-70" width="100" height="16" rx="8" fill="#1E1B3A"/><path d="M0 10 V60" stroke="#55526E" stroke-width="10"/><path d="M-6 60 L0 76 L6 60 Z" fill="#55526E"/>';
      var d = s.add(drill, { x: 480, y: 200, enter: 'pop', delay: 200 });
      loop(s, d, [{ transform: 'translateY(0)' }, { transform: 'translateY(4px)' }, { transform: 'translateY(0)' }], 100, 400);
      s.add(arcs(3, '#E5484D', 30), { x: 520, y: 170, enter: 'fade', delay: 500 });
      s.add('<g transform="scale(-1,1)">' + arcs(3, '#E5484D', 30) + '</g>', { x: 440, y: 170, enter: 'fade', delay: 500 });
      s.text(480, 310, 'very loud sounds', { size: 20, weight: 700, colour: s.C.ink, delay: 1200 });
      s.text(480, 336, 'can damage hearing', { size: 20, weight: 700, colour: s.C.red, delay: 1400 });
    },

    /* ---------- 5. Speed of sound and echoes ---------- */
    'storm': function (s) {
      fresh(s);
      s.add('<path d="M-70 20 Q-90 -10 -60 -20 Q-56 -54 -20 -50 Q0 -76 30 -56 Q66 -60 66 -26 Q96 -16 80 16 Z" fill="#55526E"/>', { x: 110, y: 80, enter: 'down' });
      var bolt = s.add('<path d="M0 0 L-16 46 H0 L-12 96 L22 34 H6 L16 0 Z" fill="#FFC93C" stroke="#C2570C" stroke-width="2"/>', { x: 110, y: 96, enter: 'pop', delay: 500 });
      void bolt;
      s.owl(560, 300, 110, { delay: 200 });
      s.add('<path d="M0 0 H330" stroke="#FFC93C" stroke-width="6" stroke-dasharray="14 8"/>', { x: 150, y: 150, enter: 'left', delay: 700, ms: 200 });
      s.text(320, 128, 'light: about 300,000,000 m/s', { size: 20, weight: 700, colour: '#C2570C', delay: 800 });
      var w = s.add(arcs(2, '#6C4DF6', 20), { x: 140, y: 240, enter: 'fade', delay: 1000 });
      s.move(w, 440, 240, 2400, { delay: 1000, easing: 'linear' });
      s.text(320, 300, 'sound: about 340 m/s', { size: 20, weight: 700, colour: s.C.fun, delay: 1200 });
      s.text(560, 340, 'flash first, bang later', { size: 16, colour: s.C.muted, delay: 2600 });
    },
    'storm-calc': function (s) {
      s.add('<rect x="-170" y="-46" width="340" height="92" rx="16" fill="#FFFFFF" stroke="#22A06B" stroke-width="3"/>' + T(0, -20, 'thunder 3 s after the flash', 18, '#1E1B3A') +
        T(0, 6, '340 × 3 = 1020 m', 24, '#0E7A5A', { w: 700 }) + T(0, 32, 'about 1 km away', 18, '#0E7A5A', { w: 700 }), { x: 320, y: 214 - 10, enter: 'pop' });
      s.text(320, 34, 'distance = speed × time', { size: 26, weight: 700, colour: s.C.fun, delay: 400 });
    },
    'echo': function (s) {
      fresh(s);
      s.add('<path d="M540 360 V120 Q560 90 590 100 L610 60 Q630 50 640 60 V360 Z" fill="#9A7B5A" stroke="#6B4E33" stroke-width="3"/><path d="M0 300 H640" stroke="#C9B48E" stroke-width="5"/>', { enter: 'fade' });
      s.owl(80, 300, 100, { delay: 100 });
      s.add(T(0, 0, '"Hello!"', 20, '#6C4DF6', { w: 700 }), { x: 90, y: 180, enter: 'pop', delay: 300 });
      var out = s.add(arcs(2, '#6C4DF6', 16), { x: 140, y: 210, enter: 'fade', delay: 500 });
      s.move(out, 480, 210, 1400, { delay: 500, easing: 'linear' });
      s.hide(out, { delay: 1900, ms: 100 });
      var back = s.add('<g transform="scale(-1,1)">' + arcs(2, '#FF5D8F', 16) + '</g>', { x: 520, y: 250, enter: 'fade', delay: 1950, ms: 100 });
      s.move(back, 180, 250, 1400, { delay: 1950, easing: 'linear' });
      s.arrow(200, 180, 300, 'r', { colour: s.C.fun, width: 5, delay: 400 });
      s.arrow(500, 280, 300, 'l', { colour: s.C.pink, width: 5, delay: 1900 });
      s.text(350, 328, 'echo', { size: 24, weight: 700, colour: s.C.pink, delay: 2300 });
      s.text(320, 40, 'Sound reflects off hard surfaces', { size: 26, weight: 700, colour: s.C.fun });
    },
    'echo-calc': function (s) {
      s.add('<rect x="-160" y="-44" width="320" height="88" rx="16" fill="#FFFFFF" stroke="#22A06B" stroke-width="3"/>' + T(0, -18, 'echo after 4 s', 18, '#1E1B3A') +
        T(0, 8, 'there and back: 340 × 4 = 1360 m', 18, '#1E1B3A', { w: 700 }) + T(0, 32, 'to the cliff: 1360 ÷ 2 = 680 m', 18, '#0E7A5A', { w: 700 }), { x: 340, y: 110, enter: 'pop' });
    },
    'absorb': function (s) {
      fresh(s);
      // curtains
      s.add('<rect x="30" y="60" width="220" height="10" rx="5" fill="#8A5A2B"/><path d="M40 70 Q50 170 40 270 H120 Q110 170 120 70 Z" fill="#FF5D8F" stroke="#C2306A" stroke-width="3"/><path d="M160 70 Q150 170 160 270 H240 Q250 170 240 70 Z" fill="#FF5D8F" stroke="#C2306A" stroke-width="3"/>' +
        '<path d="M60 90 Q66 170 60 250 M90 90 Q84 170 90 250 M190 90 Q184 170 190 250 M220 90 Q226 170 220 250" stroke="#C2306A" stroke-width="2" fill="none"/><rect x="30" y="270" width="220" height="16" rx="4" fill="#6C4DF6"/>', { enter: 'fade' });
      s.text(140, 316, 'soft things absorb sound', { size: 19, weight: 700, colour: s.C.pink, delay: 400 });
      // a bat finding a moth with ultrasound echoes
      s.add('<rect x="320" y="56" width="300" height="220" rx="20" fill="#2D1B69"/>', { enter: 'fade', delay: 600 });
      s.add('<g transform="scale(1.1)">' + BAT.replace(/#2D1B69/g, '#C9CED8') + '</g>', { x: 380, y: 160, enter: 'pop', delay: 800 });
      s.add('<ellipse rx="10" ry="6" fill="#FFF4D6"/><path d="M-2 -4 Q-14 -18 -20 -6 Q-12 0 -2 -4 Z M2 -4 Q14 -18 20 -6 Q12 0 2 -4 Z" fill="#FFE9A8"/>', { x: 570, y: 160, enter: 'pop', delay: 900 });
      var u = s.add(arcs(2, '#7CFFB2', 12), { x: 410, y: 160, enter: 'fade', delay: 1200 });
      s.move(u, 520, 160, 900, { delay: 1200, easing: 'linear' });
      s.hide(u, { delay: 2100, ms: 100 });
      var e = s.add('<g transform="scale(-1,1)">' + arcs(2, '#FFC93C', 12) + '</g>', { x: 550, y: 160, enter: 'fade', delay: 2150, ms: 100 });
      s.move(e, 462, 160, 900, { delay: 2150, easing: 'linear' });
      s.text(470, 316, 'bats use echoes', { size: 19, weight: 700, colour: s.C.fun, delay: 2400 });
    }
  });
})();
