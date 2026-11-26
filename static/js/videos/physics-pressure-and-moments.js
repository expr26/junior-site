/* Pictures for the Pressure and moments theory video (words: videos/physics/pressure-and-moments.json). Stage is 640 x 360; see static/js/theory.js.
   Distances on the beam and the see-saw are to scale inside each picture; water-pressure arrows grow with depth. */
(function () {
  if (!window.Theory) return;

  var F = 'Fredoka, Trebuchet MS, sans-serif';
  function T(x, y, t, size, fill, weight, anchor) {
    return '<text x="' + x + '" y="' + y + '" font-family="' + F + '" font-size="' + (size || 18) + '" font-weight="' + (weight || 600) + '" fill="' + (fill || '#1E1B3A') +
      '" text-anchor="' + (anchor || 'middle') + '" dominant-baseline="middle">' + t + '</text>';
  }
  var SHADE = '<linearGradient id="pmShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient>';
  var WOOD = '<linearGradient id="pmWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E0A86A"/><stop offset="1" stop-color="#B8773A"/></linearGradient>';
  var METAL = '<linearGradient id="pmMetal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDE1EA"/><stop offset=".5" stop-color="#A9AFC2"/><stop offset="1" stop-color="#8A90A6"/></linearGradient>';
  var WATER = '<linearGradient id="pmWater" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B8DEFF"/><stop offset="1" stop-color="#5FA8EE"/></linearGradient>';
  function pill(text, w, col, bg, ink) {
    w = w || 300;
    return '<defs><linearGradient id="pmPill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F0FCF6"/><stop offset="1" stop-color="#CFF2E2"/></linearGradient></defs><rect x="' + (-w / 2) + '" y="-26" width="' + w + '" height="52" rx="18" fill="' + (bg || 'url(#pmPill)') + '" stroke="' + (col || '#22A06B') + '" stroke-width="3"/>' + T(0, 2, text, 26, ink || '#0E7A5A', 700);
  }
  function card(text, w, col) {
    return '<rect x="' + (-w / 2) + '" y="-38" width="' + w + '" height="76" rx="20" fill="#FFFFFF" stroke="' + (col || '#6C4DF6') + '" stroke-width="4"/>' + T(0, 2, text, 30, '#2D1B69', 700);
  }
  function arrowAt(x, y, len, deg, col, w) {   // an arrow from (x, y), len long, pointing at angle deg (0 = right, 90 = down)
    w = w || 8; var h = Math.max(14, w * 2);
    return '<g transform="translate(' + x + ' ' + y + ') rotate(' + deg + ')"><rect x="0" y="' + (-w / 2) + '" width="' + Math.max(0, len - h + 2) + '" height="' + w + '" rx="' + (w / 2) + '" fill="' + col + '"/>' +
      '<path d="M' + (len - h) + ' ' + (-h * .75) + ' L' + len + ' 0 L' + (len - h) + ' ' + (h * .75) + ' Z" fill="' + col + '"/></g>';
  }
  function curl(cw, col, r, a0, a1) {   // a round "turning" arrow centred on (0, 0), from angle a0 to a1 (degrees, 0 = right, 90 = down)
    r = r || 26;
    if (a0 === undefined) { a0 = cw ? -200 : 20; a1 = cw ? 20 : -200; }
    function P(a) { return [r * Math.cos(a * Math.PI / 180), r * Math.sin(a * Math.PI / 180)]; }
    var p0 = P(a0), p1 = P(a1), e = P(a1 + (cw ? -1 : 1) * 1);
    var tx = p1[0] - e[0], ty = p1[1] - e[1], n = Math.sqrt(tx * tx + ty * ty); tx /= n; ty /= n;
    var hx = p1[0] + tx * 12, hy = p1[1] + ty * 12;
    return '<path d="M' + p0[0].toFixed(1) + ' ' + p0[1].toFixed(1) + ' A' + r + ' ' + r + ' 0 ' + (Math.abs(a1 - a0) > 180 ? 1 : 0) + ' ' + (cw ? 1 : 0) + ' ' + p1[0].toFixed(1) + ' ' + p1[1].toFixed(1) + '" fill="none" stroke="' + col + '" stroke-width="6" stroke-linecap="round"/>' +
      '<path d="M' + hx.toFixed(1) + ' ' + hy.toFixed(1) + ' L' + (p1[0] - ty * 10).toFixed(1) + ' ' + (p1[1] + tx * 10).toFixed(1) + ' L' + (p1[0] + ty * 10).toFixed(1) + ' ' + (p1[1] - tx * 10).toFixed(1) + ' Z" fill="' + col + '"/>';
  }
  function dim(x1, x2, y, label, col, bw) {
    col = col || '#55526E'; bw = bw || 68;
    return '<path d="M' + x1 + ' ' + (y - 8) + ' V' + (y + 8) + ' M' + x2 + ' ' + (y - 8) + ' V' + (y + 8) + ' M' + x1 + ' ' + y + ' H' + x2 + '" stroke="' + col + '" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="' + ((x1 + x2) / 2 - bw / 2) + '" y="' + (y - 13) + '" width="' + bw + '" height="26" rx="13" fill="#FFFDF7" stroke="' + col + '" stroke-opacity=".25" stroke-width="1.5"/>' + T((x1 + x2) / 2, y + 1, label, 18, col, 700);
  }
  function brick(w, h) {
    var m = '<defs><linearGradient id="pmBrick" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E07456"/><stop offset="1" stop-color="#A9432E"/></linearGradient></defs>' +
      '<rect width="' + w + '" height="' + h + '" rx="5" fill="url(#pmBrick)" stroke="#8A3422" stroke-width="2"/>';
    if (w > h) m += '<path d="M0 ' + h / 2 + ' H' + w + ' M' + w / 2 + ' 0 V' + h / 2 + ' M' + w / 4 + ' ' + h / 2 + ' V' + h + ' M' + 3 * w / 4 + ' ' + h / 2 + ' V' + h + '" stroke="#F2C6B4" stroke-width="2.5" opacity=".85"/>';
    else m += '<path d="M0 ' + h / 2 + ' H' + w + ' M' + w / 2 + ' 0 V' + h / 2 + ' M0 ' + h / 4 + ' H' + w + ' M0 ' + 3 * h / 4 + ' H' + w + '" stroke="#F2C6B4" stroke-width="2.5" opacity=".85"/>';
    return m + '<rect x="4" y="3" width="' + (w - 8) + '" height="4" rx="2" fill="#fff" opacity=".3"/>';
  }
  function sponge(w) {
    return '<defs><linearGradient id="pmSponge" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFEB9A"/><stop offset="1" stop-color="#F5C443"/></linearGradient></defs>' +
      '<rect width="' + w + '" height="60" rx="12" fill="url(#pmSponge)" stroke="#D4A21A" stroke-width="2"/><rect x="8" y="5" width="' + (w - 16) + '" height="5" rx="2.5" fill="#fff" opacity=".45"/>' +
      [[0.12, 24, 5], [0.27, 42, 3.5], [0.4, 30, 6], [0.55, 46, 4], [0.68, 22, 4.5], [0.85, 38, 6], [0.95, 20, 3]].map(function (p) { return '<ellipse cx="' + (w * p[0]).toFixed(0) + '" cy="' + p[1] + '" rx="' + p[2] + '" ry="' + (p[2] * .8) + '" fill="#E0AE2E"/>'; }).join('');
  }
  function crate(w, h, d, label) {   // oblique view: front face w x h units, depth d; bottom-front-left corner at (0, 0)
    var U = 70, ox = d * U * 0.5, oy = -d * U * 0.4, W = w * U, H = h * U;
    return '<defs><linearGradient id="pmCrTop" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#F8D9A8"/><stop offset="1" stop-color="#EDBF80"/></linearGradient>' +
      '<linearGradient id="pmCrSide" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C98A4B"/><stop offset="1" stop-color="#A06630"/></linearGradient>' +
      '<linearGradient id="pmCrFront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EDB87A"/><stop offset="1" stop-color="#D3954F"/></linearGradient></defs>' +
      '<path d="M0 ' + (-H) + ' L' + ox + ' ' + (-H + oy) + ' H' + (W + ox) + ' L' + W + ' ' + (-H) + ' Z" fill="url(#pmCrTop)" stroke="#9A6532" stroke-width="2" stroke-linejoin="round"/>' +
      '<path d="M' + W + ' ' + (-H) + ' L' + (W + ox) + ' ' + (-H + oy) + ' V' + oy + ' L' + W + ' 0 Z" fill="url(#pmCrSide)" stroke="#9A6532" stroke-width="2" stroke-linejoin="round"/>' +
      '<rect x="0" y="' + (-H) + '" width="' + W + '" height="' + H + '" rx="2" fill="url(#pmCrFront)" stroke="#9A6532" stroke-width="2"/>' +
      '<rect x="5" y="' + (-H + 5) + '" width="' + (W - 10) + '" height="' + (H - 10) + '" rx="2" fill="none" stroke="#B87C3E" stroke-width="3" opacity=".7"/>' +
      '<path d="M8 ' + (-H + 8) + ' L' + (W - 8) + ' -8 M' + (W - 8) + ' ' + (-H + 8) + ' L8 -8" stroke="#C48646" stroke-width="5" stroke-linecap="round" opacity=".8"/>' +
      '<path d="M3 ' + (-H + 3) + ' H' + (W - 3) + '" stroke="#fff" stroke-width="2" opacity=".35"/>' +
      '<rect x="' + (W / 2 - Math.min(36, W / 2 - 4)) + '" y="' + (-H / 2 - 15) + '" width="' + Math.min(72, W - 8) + '" height="30" rx="8" fill="#FFF4D6"/>' + T(W / 2, -H / 2 + 1, label, W < 100 ? 17 : 20, '#1E1B3A', 700);
  }
  function grid(cols, rows, each) {   // floor squares, 80 units each, seen from above
    var m = '';
    for (var r = 0; r < rows; r++) for (var c = 0; c < cols; c++)
      m += '<rect x="' + c * 80 + '" y="' + r * 80 + '" width="80" height="80" fill="#FFF6E2" stroke="#D9A86A" stroke-width="2.5"/>' + T(c * 80 + 40, r * 80 + 41, each, 22, '#E5484D', 700);
    return m;
  }
  function seesawBase() {
    return '<defs><linearGradient id="pmBase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A8FA8"/><stop offset="1" stop-color="#4A4E63"/></linearGradient></defs>' +
      '<path d="M320 250 L288 300 H352 Z" fill="url(#pmBase)" stroke="#3E4256" stroke-width="2" stroke-linejoin="round"/><path d="M318 258 L298 292" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".35"/><circle cx="320" cy="252" r="4" fill="#3E4256"/>';
  }
  var PLANK = '<defs>' + WOOD + '</defs><rect x="20" y="240" width="600" height="12" rx="6" fill="url(#pmWood)" stroke="#9A6532" stroke-width="2"/><path d="M30 244 H200 M260 245 H420 M470 244 H610" stroke="#F4CF9E" stroke-width="2" stroke-linecap="round" opacity=".7"/>';
  function block(w, label, col) {
    return '<defs>' + SHADE + '</defs><rect x="' + (-w / 2) + '" y="' + (-w) + '" width="' + w + '" height="' + w + '" rx="8" fill="' + col + '"/>' +
      '<rect x="' + (-w / 2) + '" y="' + (-w) + '" width="' + w + '" height="' + w + '" rx="8" fill="url(#pmShade)" stroke="rgba(30,27,58,.5)" stroke-width="2"/>' +
      '<rect x="' + (-w / 2 + 5) + '" y="' + (-w + 4) + '" width="' + (w - 10) + '" height="4" rx="2" fill="#fff" opacity=".4"/>' +
      '<text x="0" y="' + (-w / 2 + 1) + '" font-family="' + F + '" font-size="18" font-weight="700" fill="#FFFFFF" stroke="rgba(30,27,58,.25)" stroke-width="3" paint-order="stroke" text-anchor="middle" dominant-baseline="middle">' + label + '</text>';
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }
  function rnd(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }

  Theory.scenes({
    /* ---------- 1. What is pressure? ---------- */
    'bricks': function (s) {
      s.text(320, 34, 'Same weight, different area', { size: 28, weight: 700, colour: s.C.fun });
      s.add(brick(50, 100), { x: 145, y: 140, enter: 'down', delay: 200, name: 'ba' });
      s.add(brick(100, 50), { x: 420, y: 190, enter: 'down', delay: 500, name: 'bb' });
      s.add(sponge(220), { x: 60, y: 240, enter: 'fade' });
      s.add(sponge(220), { x: 360, y: 240, enter: 'fade' });
      s.text(170, 100, 'on its end', { size: 22, colour: s.C.deep, delay: 900 });
      s.text(470, 100, 'lying flat', { size: 22, colour: s.C.deep, delay: 1100 });
    },
    'bricks-sink': function (s) {
      s.move(s.ref.ba, 145, 176, 900, { delay: 200, easing: 'cubic-bezier(.3,1.4,.6,1)' });
      s.move(s.ref.bb, 420, 198, 900, { delay: 200, easing: 'cubic-bezier(.3,1.4,.6,1)' });
      s.text(170, 324, 'small area: big pressure', { size: 20, weight: 700, colour: s.C.red, delay: 1100 });
      s.text(470, 324, 'big area: small pressure', { size: 20, weight: 700, colour: s.C.green, delay: 1600 });
    },
    'pin': function (s) {
      s.clear(); s.ref = {};
      var pin = s.add('<defs><linearGradient id="pmSkin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFD9BF"/><stop offset="1" stop-color="#EFA483"/></linearGradient>' +
        '<linearGradient id="pmPinHead" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FF6B70"/><stop offset="1" stop-color="#C8343A"/></linearGradient>' +
        '<linearGradient id="pmPinBody" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB3B3"/><stop offset=".5" stop-color="#FF7C7C"/><stop offset="1" stop-color="#D9474C"/></linearGradient>' + METAL + '</defs>' +
        '<path d="M100 140 H172 V220 H100 Q60 220 60 180 Q60 140 100 140 Z" fill="url(#pmSkin)" stroke="#D98A66" stroke-width="2"/>' +
        '<path d="M70 166 Q72 150 90 150 H116 Q124 150 124 158 V178 Q124 186 116 186 H88 Q72 186 70 172 Z" fill="#FFEDE4" stroke="#E8A98C" stroke-width="1.5"/><path d="M80 158 H104" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>' +
        '<path d="M140 200 q8 -4 16 0 M140 208 q8 -4 16 0" stroke="#D98A66" stroke-width="1.5" fill="none" stroke-linecap="round"/>' +
        '<rect x="172" y="120" width="16" height="120" rx="7" fill="url(#pmPinHead)" stroke="#A82A30" stroke-width="1.5"/><rect x="175" y="126" width="4" height="100" rx="2" fill="#fff" opacity=".4"/>' +
        '<path d="M188 168 H252 Q258 168 258 174 V186 Q258 192 252 192 H188 Z" fill="url(#pmPinBody)" stroke="#B42318" stroke-width="1.5"/>' +
        '<path d="M258 176 L344 180 L258 184 Z" fill="url(#pmMetal)" stroke="#6B7088" stroke-width="1"/>', { x: 0, y: 0, enter: 'left' });
      s.add('<defs>' + WOOD + '</defs><rect x="336" y="60" width="90" height="240" rx="8" fill="url(#pmWood)" stroke="#9A6532" stroke-width="2"/>' +
        '<path d="M352 70 Q348 140 356 200 T352 290 M384 66 Q392 120 386 170 M404 180 Q410 230 404 292" stroke="#9A6532" stroke-width="2" fill="none" opacity=".45" stroke-linecap="round"/>' +
        '<ellipse cx="398" cy="118" rx="7" ry="11" fill="none" stroke="#9A6532" stroke-width="2" opacity=".5"/><rect x="340" y="64" width="5" height="232" rx="2.5" fill="#fff" opacity=".25"/>', { enter: 'fade' });
      s.move(pin, 36, 0, 900, { delay: 1000, easing: 'cubic-bezier(.5,0,.3,1)' });
      s.arrow(30, 100, 110, 'r', { label: 'push', colour: s.C.fun, width: 8, size: 18, delay: 600 });
      s.text(530, 150, 'tiny point:', { size: 22, weight: 700, colour: s.C.red, delay: 1800 });
      s.text(530, 180, 'huge pressure', { size: 22, weight: 700, colour: s.C.red, delay: 1900 });
      s.text(175, 300, 'wide head: gentle on your thumb', { size: 19, weight: 700, colour: s.C.green, delay: 2600 });
    },
    'snowshoes': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Snowshoes spread the weight', { size: 28, weight: 700, colour: s.C.fun });
      var o1 = s.owl(170, 250, 110, { enter: 'pop' });
      s.move(o1, 170, 292, 1200, { delay: 800, easing: 'ease-out' });
      s.add('<defs><linearGradient id="pmSnow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#DCEBF8"/></linearGradient></defs>' +
        '<path d="M0 250 Q80 240 160 250 T320 250 T480 250 T640 250 V360 H0 Z" fill="url(#pmSnow)"/><path d="M0 250 Q80 240 160 250 T320 250 T480 250 T640 250" fill="none" stroke="#BFDDF5" stroke-width="4"/>' +
        '<path d="M30 290 h60 M240 340 h80 M400 330 h50 M560 300 h50" stroke="#CFE3F5" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M60 262 l2 4 l4 -1 M520 272 l2 4 l4 -1 M300 264 l2 4 l4 -1" stroke="#fff" stroke-width="2" fill="none"/>', { enter: 'fade', flat: true });
      s.add('<defs>' + WOOD + '</defs><ellipse cx="0" cy="0" rx="72" ry="11" fill="url(#pmWood)" stroke="#9A6532" stroke-width="2"/><ellipse cx="0" cy="0" rx="60" ry="6" fill="none" stroke="#F4CF9E" stroke-width="1.5" opacity=".7"/>' +
        '<path d="M-50 0 H50 M-30 -7 V7 M-10 -8 V8 M10 -8 V8 M30 -7 V7" stroke="#7A4E25" stroke-width="1.5" opacity=".7"/>', { x: 460, y: 250, enter: 'pop', delay: 300 });
      s.owl(460, 246, 110, { enter: 'pop', delay: 300 });
      s.text(170, 320, 'small area: sinks in', { size: 20, weight: 700, colour: s.C.red, delay: 1800 });
      s.text(460, 300, 'big area: stays on top', { size: 20, weight: 700, colour: s.C.green, delay: 2200 });
    },

    /* ---------- 2. Calculating pressure ---------- */
    'p-formula': function (s) {
      s.add(card('pressure = force ÷ area', 460), { x: 320, y: 70, enter: 'pop' });
      s.add('<defs><linearGradient id="pmSq" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6F3FF"/><stop offset="1" stop-color="#DCD3FF"/></linearGradient></defs><rect x="0" y="0" width="120" height="120" rx="4" fill="url(#pmSq)" stroke="#6C4DF6" stroke-width="4"/>' + T(60, 62, '1 m²', 26, '#2D1B69', 700) +
        T(60, 138, '1 m', 16, '#55526E', 700) + T(-18, 60, '1 m', 16, '#55526E', 700, 'end'), { x: 110, y: 160, enter: 'pop', delay: 800 });
      s.text(440, 190, 'force: newtons (N)', { size: 24, colour: s.C.red, weight: 700, delay: 1300, name: 'f1' });
      s.text(440, 240, 'area: square metres (m²)', { size: 22, colour: s.C.fun, weight: 700, delay: 1900, name: 'f2' });
    },
    'p-unit': function (s) {
      hideAll(s, ['f1', 'f2']);
      s.text(440, 180, 'pressure in N/m²', { size: 30, weight: 700, colour: s.C.deep, delay: 300 });
      s.add(pill('1 N/m² = 1 pascal (Pa)', 300, '#0F9488'), { x: 440, y: 245, enter: 'pop', delay: 1200 });
    },
    'p-box4': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Lying flat on 4 m²', { size: 28, weight: 700, colour: s.C.fun, name: 't' });
      s.add('<defs><linearGradient id="pmFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EFE6D3"/><stop offset="1" stop-color="#DCCBA8"/></linearGradient></defs>' +
        '<path d="M20 290 H320 L380 220 H80 Z" fill="url(#pmFloor)" stroke="#C9B48E" stroke-width="2" stroke-linejoin="round"/><path d="M62 260 H330 M100 238 H360" stroke="#CDBB95" stroke-width="1.5" opacity=".7"/>', { enter: 'fade', flat: true });
      s.add(crate(2, 1, 2, '200 N'), { x: 90, y: 275, enter: 'down', delay: 200, name: 'c' });
      s.text(500, 86, 'floor under the crate', { size: 18, colour: s.C.muted, delay: 700, name: 'g0' });
      s.add(grid(2, 2, '50 N'), { x: 420, y: 106, enter: 'pop', delay: 900, name: 'g' });
      s.text(500, 284, 'each square is 1 m²', { size: 16, colour: s.C.muted, delay: 1100 });
      s.add(pill('200 ÷ 4 = 50 N/m²', 300), { x: 230, y: 328, enter: 'pop', delay: 2000, name: 'p' });
    },
    'p-box2': function (s) {
      hideAll(s, ['t', 'c', 'g', 'p']);
      s.text(320, 34, 'On a smaller side: 2 m²', { size: 28, weight: 700, colour: s.C.fun, delay: 200 });
      s.add(crate(1, 2, 2, '200 N'), { x: 120, y: 275, enter: 'down', delay: 400 });
      s.add(grid(1, 2, '100 N'), { x: 460, y: 106, enter: 'pop', delay: 1000 });
      s.add(pill('200 ÷ 2 = 100 N/m²', 300), { x: 230, y: 328, enter: 'pop', delay: 1800 });
      s.text(500, 324, 'double the pressure!', { size: 18, weight: 700, colour: s.C.red, delay: 2400 });
    },

    /* ---------- 3. Pressure in liquids and gases ---------- */
    'fluid-all': function (s) {
      s.text(320, 34, 'Water pushes in all directions', { size: 28, weight: 700, colour: s.C.blue });
      s.add('<defs>' + WATER + '</defs><rect x="130" y="70" width="380" height="250" rx="12" fill="#EEF6FF" stroke="#A9B8CC" stroke-width="3"/><rect x="134" y="96" width="372" height="220" rx="8" fill="url(#pmWater)"/>' +
        '<path d="M134 96 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t12 0" fill="none" stroke="#E6F3FF" stroke-width="3"/>' +
        '<rect x="140" y="104" width="6" height="200" rx="3" fill="#fff" opacity=".35"/><path d="M150 140 q6 -4 12 0 M480 260 q6 -4 12 0" stroke="#fff" stroke-width="2" fill="none" opacity=".6"/>', { enter: 'fade' });
      s.add('<defs><radialGradient id="pmBall" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFB27A"/><stop offset="1" stop-color="#E8661F"/></radialGradient></defs>' +
        '<circle r="34" fill="url(#pmBall)" stroke="#C2570C" stroke-width="2"/><path d="M-16 -18 q10 -8 22 -5" stroke="#FFE3CC" stroke-width="6" fill="none" stroke-linecap="round" opacity=".9"/>', { x: 320, y: 205, enter: 'pop', delay: 300 });
      var m = '';
      for (var k = 0; k < 8; k++) {
        var a = k * 45, rad = a * Math.PI / 180;   // each arrow points at the ball; the ones pushing up from below are a little longer (deeper water pushes harder)
        var len = 40 - 6 * Math.sin(rad), R = 40 + len;
        m += arrowAt((320 - R * Math.cos(rad)).toFixed(1), (205 - R * Math.sin(rad)).toFixed(1), len, a, '#2D1B69', 7);
      }
      s.add(m, { enter: 'pop', delay: 900 });
    },
    'jets': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Deeper water pushes harder', { size: 28, weight: 700, colour: s.C.blue });
      s.ground(312);
      s.add('<defs>' + WATER + '</defs><rect x="200" y="60" width="130" height="250" rx="10" fill="#EEF6FF" stroke="#A9B8CC" stroke-width="3"/><rect x="204" y="80" width="122" height="226" rx="7" fill="url(#pmWater)"/>' +
        '<path d="M204 80 q15 -5 30 0 t30 0 t30 0 t32 0" fill="none" stroke="#E6F3FF" stroke-width="3"/><rect x="210" y="88" width="6" height="210" rx="3" fill="#fff" opacity=".35"/>', { enter: 'fade' });
      [[130, 64, 300], [200, 94, 900], [262, 116, 1500]].forEach(function (h) {
        var y = h[0], L = h[1];
        s.add('<circle cx="330" cy="' + y + '" r="5" fill="#2D1B69"/>', { enter: 'fade', delay: h[2] });
        var drops = y + 68 < 306 ? '<circle cx="' + (334 + L) + '" cy="' + (y + 56) + '" r="4" fill="#4A97F0"/><circle cx="' + (338 + L) + '" cy="' + (y + 68) + '" r="3" fill="#4A97F0"/>' :
          '<ellipse cx="' + (336 + L) + '" cy="312" rx="16" ry="4" fill="#8CC4F5"/>';
        s.add('<path d="M330 ' + y + ' Q' + (330 + L * 0.5) + ' ' + y + ' ' + (330 + L) + ' ' + (y + 44) + '" fill="none" stroke="#4A97F0" stroke-width="7" stroke-linecap="round"/>' +
          '<path d="M332 ' + (y - 2) + ' Q' + (330 + L * 0.5) + ' ' + (y - 2) + ' ' + (326 + L * 0.9) + ' ' + (y + 30) + '" fill="none" stroke="#D6ECFF" stroke-width="2" stroke-linecap="round"/>' + drops, { enter: 'right', delay: h[2] });
      });
      s.arrow(170, 90, 200, 'd', { label: 'deeper', labelSide: 'left', colour: s.C.fun, width: 7, size: 18, delay: 500 });
      s.text(410, 116, 'weak squirt', { size: 18, colour: s.C.muted, anchor: 'start', delay: 800 });
      s.text(535, 236, 'strongest squirt', { size: 19, weight: 700, colour: s.C.blue, delay: 2000 });
    },
    'dam': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Why dams are thick at the bottom', { size: 26, weight: 700, colour: s.C.blue });
      s.ground(320);
      s.add('<defs>' + WATER + '</defs><rect x="0" y="100" width="300" height="220" fill="url(#pmWater)"/><path d="M0 100 q20 -6 40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t40 0 t20 0" fill="none" stroke="#E6F3FF" stroke-width="3"/>' +
        '<path d="M30 150 q8 -5 16 0 M90 290 q8 -5 16 0 M240 180 q8 -5 16 0" stroke="#fff" stroke-width="2" fill="none" opacity=".5"/>', { enter: 'fade', flat: true });
      s.add('<defs><linearGradient id="pmDam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E1E4EC"/><stop offset="1" stop-color="#AEB4C6"/></linearGradient></defs>' +
        '<path d="M300 80 H340 L470 320 H300 Z" fill="url(#pmDam)" stroke="#7A7F96" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<path d="M300 140 H372 M300 200 H405 M300 260 H437 M336 80 V140 M356 140 V200 M380 200 V260 M330 260 V320 M410 260 V320" stroke="#9AA0B4" stroke-width="1.5" opacity=".7"/>' +
        '<path d="M304 84 H336" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".6"/>', { enter: 'fade' });
      [[130, 18], [180, 44], [230, 70], [280, 96], [310, 112]].forEach(function (a, i) {   // length grows with depth below the surface at y = 100
        s.arrow(298 - a[1], a[0], a[1], 'r', { colour: s.C.red, width: 8, delay: 400 + i * 350 });
      });
      s.text(400, 128, 'thin at the top', { size: 18, weight: 700, colour: s.C.muted, anchor: 'start', delay: 2300 });
      s.text(140, 210, 'pushes harder', { size: 20, weight: 700, colour: s.C.red, delay: 2400 });
      s.text(140, 236, 'deeper down', { size: 20, weight: 700, colour: s.C.red, delay: 2500 });
      s.text(548, 280, 'thick at the bottom', { size: 18, weight: 700, colour: s.C.deep, delay: 2700 });
    },
    'mountain': function (s) {
      s.clear(); s.ref = {};
      var r = rnd(7), dots = '';
      for (var k = 0; k < 900; k++) {
        var x = r() * 640, y = 40 + r() * 290;
        if (r() < 0.03 + 0.97 * Math.pow((y - 40) / 290, 2)) dots += '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="4" fill="#8CC4F5"/>';
      }
      s.add(dots, { enter: 'fade' });
      s.ground(332);
      s.add('<defs><linearGradient id="pmRock" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B3B8CA"/><stop offset=".5" stop-color="#9AA0B4"/><stop offset="1" stop-color="#767C93"/></linearGradient></defs>' +
        '<path d="M120 332 L314 76 Q320 68 326 76 L520 332 Z" fill="url(#pmRock)" stroke="#6B7088" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M320 72 L360 332 H520 Z" fill="#1E1B3A" opacity=".08"/>' +
        '<path d="M314 76 Q320 68 326 76 L366 130 L352 132 L334 120 L314 136 L296 122 L274 130 Z" fill="#FFFFFF" stroke="#DDE3EE" stroke-width="1.5" stroke-linejoin="round"/>' +
        '<path d="M250 200 L230 230 M410 220 L430 250 M300 260 L290 280" stroke="#7A7F96" stroke-width="2.5" stroke-linecap="round" opacity=".5"/>', { enter: 'up', delay: 200 });
      s.owl(320, 74, 50, { delay: 800 });
      s.text(540, 70, 'less air above:', { size: 20, weight: 700, colour: s.C.blue, delay: 1200 });
      s.text(540, 98, 'lower pressure', { size: 20, weight: 700, colour: s.C.blue, delay: 1300 });
      s.text(70, 282, 'more air above:', { size: 17, weight: 700, colour: s.C.deep, delay: 1800 });
      s.text(70, 306, 'higher pressure', { size: 17, weight: 700, colour: s.C.deep, delay: 1900 });
    },

    /* ---------- 4. Moments ---------- */
    'spanner': function (s) {
      s.add('<defs><linearGradient id="pmNut" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF0F5"/><stop offset="1" stop-color="#A9AFC2"/></linearGradient></defs>' +
        '<path d="M200 200 m-26 0 l13 -22 h26 l13 22 l-13 22 h-26 z" fill="url(#pmNut)" stroke="#6B7088" stroke-width="2" stroke-linejoin="round"/><circle cx="200" cy="200" r="9" fill="#55526E"/><circle cx="198" cy="198" r="3" fill="#9AA0B4"/>', { enter: 'pop', name: 'nut' });
      var sp = s.add('<defs>' + METAL + '</defs><path d="M228 188 H480 a12 12 0 0 1 0 24 H228 Z" fill="url(#pmMetal)" stroke="#6B7088" stroke-width="2"/><path d="M240 192 H476" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity=".6"/>' +
        '<path d="M200 200 m-40 0 a40 40 0 1 0 80 0 a40 40 0 1 0 -80 0 M200 200 m-28 0 a28 28 0 1 1 56 0 a28 28 0 1 1 -56 0" fill="url(#pmMetal)" fill-rule="evenodd" stroke="#6B7088" stroke-width="2"/>' +
        '<path d="M172 180 A36 36 0 0 1 200 164" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round" opacity=".6"/>' +
        arrowAt(468, 186, 80, -90, '#E5484D', 10) + T(492, 126, 'force', 20, '#E5484D', 700, 'start'), { enter: 'fade', delay: 300, name: 'sp' });
      sp._inner.style.transformBox = 'view-box'; sp._inner.style.transformOrigin = '200px 200px';
      s.anim(sp, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(-20deg)', offset: .5 }, { transform: 'rotate(0deg)' }], 2400, { delay: 1000 });
      s.add(curl(false, '#6C4DF6', 58, -40, -300), { x: 200, y: 200, enter: 'pop', delay: 1200, name: 'curl' });
      s.text(200, 274, 'pivot', { size: 24, weight: 700, colour: s.C.deep, delay: 1800, name: 'pv' });
    },
    'moment-formula': function (s) {
      s.add(card('moment = force × distance', 480), { x: 320, y: 60, enter: 'pop' });
      s.add(dim(200, 468, 250, 'distance', '#2D1B69', 90), { enter: 'fade', delay: 900 });
      s.hide(s.ref.pv); s.hide(s.ref.curl);
      s.text(200, 300, 'pivot', { size: 20, weight: 700, colour: s.C.deep, delay: 900 });
    },
    'moment-calc': function (s) {
      s.clear(); s.ref = {};
      s.add('<defs>' + WOOD + '<linearGradient id="pmBase" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A8FA8"/><stop offset="1" stop-color="#4A4E63"/></linearGradient></defs>' +
        '<path d="M160 248 L136 290 H184 Z" fill="url(#pmBase)" stroke="#3E4256" stroke-width="2" stroke-linejoin="round"/>' +
        '<rect x="100" y="234" width="460" height="14" rx="7" fill="url(#pmWood)" stroke="#9A6532" stroke-width="2"/><path d="M110 238 H300 M360 239 H550" stroke="#F4CF9E" stroke-width="2" stroke-linecap="round" opacity=".7"/><circle cx="160" cy="241" r="3.5" fill="#7A4E25"/>',
        { enter: 'fade' });
      s.text(160, 328, 'pivot', { size: 18, weight: 700, colour: s.C.deep });
      s.arrow(460, 110, 120, 'd', { label: '20 N', colour: s.C.red, delay: 400 });
      s.add(dim(160, 460, 302, '3 m', '#2D1B69'), { enter: 'fade', delay: 1000 });
      s.text(310, 116, 'moment = 20 × 3', { size: 26, colour: s.C.ink, delay: 1500 });
      s.add(pill('= 60 N m', 200), { x: 310, y: 166, enter: 'pop', delay: 2200 });
      s.text(310, 208, '(newton metres)', { size: 17, colour: s.C.muted, delay: 2600 });
    },
    'door': function (s) {
      s.clear(); s.ref = {};
      s.text(320, 34, 'Looking down on a door', { size: 26, weight: 700, colour: s.C.fun });
      s.add('<defs><linearGradient id="pmWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E1E4EC"/><stop offset="1" stop-color="#AEB4C6"/></linearGradient></defs>' +
        '<rect x="40" y="186" width="70" height="28" rx="3" fill="url(#pmWall)" stroke="#7A7F96" stroke-width="2"/><path d="M50 186 l-10 12 M70 186 l-20 24 M90 186 l-24 28 M108 190 l-20 24" stroke="#9AA0B4" stroke-width="1.5"/>', { enter: 'fade' });
      s.add('<defs>' + WOOD + '</defs><rect x="116" y="192" width="420" height="16" rx="5" fill="url(#pmWood)" stroke="#9A6532" stroke-width="2"/><path d="M130 196 H330 M380 197 H520" stroke="#F4CF9E" stroke-width="2" stroke-linecap="round" opacity=".7"/>' +
        '<defs><radialGradient id="pmKnob" cx=".35" cy=".35" r=".7"><stop offset="0" stop-color="#FFE48A"/><stop offset="1" stop-color="#E0A21A"/></radialGradient></defs><circle cx="510" cy="186" r="8" fill="url(#pmKnob)" stroke="#B8860B" stroke-width="1.5"/>', { enter: 'fade' });
      s.add('<circle cx="118" cy="200" r="9" fill="#55526E"/><circle cx="116" cy="198" r="3" fill="#C9CED8"/>', { enter: 'pop' });
      s.text(118, 240, 'hinge', { size: 18, weight: 700, colour: s.C.deep, delay: 200 });
      s.text(118, 262, '(pivot)', { size: 16, colour: s.C.muted, delay: 200 });
      s.arrow(190, 290, 76, 'u', { label: 'push', colour: s.C.red, size: 17, delay: 600 });
      s.arrow(490, 290, 76, 'u', { label: 'push', colour: s.C.red, size: 17, delay: 1000 });
      s.text(190, 150, 'hard!', { size: 24, weight: 700, colour: s.C.red, delay: 1500 });
      s.text(490, 150, 'easy!', { size: 24, weight: 700, colour: s.C.green, delay: 1900 });
      s.text(200, 322, 'small distance: small moment', { size: 17, colour: s.C.muted, delay: 2200 });
      s.text(500, 322, 'big distance: big moment', { size: 17, colour: s.C.muted, delay: 2400 });
    },

    /* ---------- 5. Balancing a see-saw (1 m = 90 units) ---------- */
    'seesaw': function (s) {
      s.ground(300);
      s.add(seesawBase() + PLANK, { enter: 'up' });
      s.add(block(60, '30 N', '#6C4DF6'), { x: 140, y: 240, enter: 'down', delay: 400 });
      s.add(block(50, '20 N', '#FF8A3D'), { x: 590, y: 240, enter: 'down', delay: 800 });
      s.add(curl(false, '#6C4DF6'), { x: 140, y: 70, enter: 'pop', delay: 1400, name: 'c1' });
      s.text(140, 120, 'anticlockwise', { size: 20, weight: 700, colour: s.C.fun, delay: 1500, name: 'l1' });
      s.add(curl(true, '#FF8A3D'), { x: 500, y: 70, enter: 'pop', delay: 2200, name: 'c2' });
      s.text(500, 120, 'clockwise', { size: 20, weight: 700, colour: s.C.orange, delay: 2300, name: 'l2' });
    },
    'seesaw-calc': function (s) {
      s.add(dim(140, 320, 160, '2 m', '#6C4DF6') + dim(320, 590, 160, '3 m', '#FF8A3D'), { enter: 'fade' });
      s.text(170, 330, '30 N × 2 m = 60 N m', { size: 20, weight: 700, colour: s.C.fun, delay: 700 });
      s.text(470, 330, '20 N × 3 m = 60 N m', { size: 20, weight: 700, colour: s.C.orange, delay: 1600 });
    },
    'seesaw-balance': function (s) {
      hideAll(s, ['c1', 'l1', 'c2', 'l2']);
      s.add(pill('60 N m = 60 N m: it balances!', 420), { x: 320, y: 90, enter: 'pop', delay: 300 });
    },
    'seesaw-people': function (s) {
      s.clear(); s.ref = {};
      s.ground(300);
      s.add(seesawBase() + PLANK, { enter: 'fade' });
      s.owl(230, 242, 130, { delay: 200 });
      s.owl(570, 242, 72, { delay: 600 });
      s.text(230, 90, 'heavier: sits closer', { size: 20, weight: 700, colour: s.C.fun, delay: 1100 });
      s.text(505, 150, 'lighter: sits further away', { size: 20, weight: 700, colour: s.C.orange, delay: 1600 });
      s.text(320, 330, 'balanced!', { size: 24, weight: 700, colour: s.C.green, delay: 2200 });
    }
  });
})();
