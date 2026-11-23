/* Pictures for the Space theory video (words: videos/physics/space.json). Stage is 640 x 360; see static/js/theory.js.
   Sizes and distances are NOT to scale (the pictures say so where it matters). Seasons are shown by the tilt of the
   Earth's axis, which always leans the same way as the Earth orbits. Moon phases are drawn as seen from the UK
   (northern hemisphere): a waxing Moon is lit on the right. */
(function () {
  if (!window.Theory) return;
  var F = 'font-family="Fredoka, Trebuchet MS, sans-serif"';
  var NIGHT = '#0F1638', SUN = '#FFC93C', LIGHT = '#FFE08A', SEA = '#2F80ED', LAND = '#22A06B', GREY = '#C9CED8';
  var uid = 0;

  /* ---------- small helpers (own to this file) ---------- */
  /* a gradient with a fresh id (prefix "spc"): G([[offset, colour, opacity?], ...], {h: across, radial, cx, cy, r}) -> {u: 'url(#..)', d: '<defs>..</defs>'} */
  function G(stops, o) {
    o = o || {};
    var id = 'spc' + (++uid), tag = o.radial ? 'radialGradient' : 'linearGradient';
    var at = o.radial ? 'cx="' + (o.cx != null ? o.cx : .35) + '" cy="' + (o.cy != null ? o.cy : .3) + '" r="' + (o.r || .8) + '"' : 'x1="0" y1="0" x2="' + (o.h ? 1 : 0) + '" y2="' + (o.h ? 0 : 1) + '"';
    return { u: 'url(#' + id + ')', d: '<defs><' + tag + ' id="' + id + '" ' + at + '>' + stops.map(function (st) {
      return '<stop offset="' + st[0] + '" stop-color="' + st[1] + '"' + (st[2] != null ? ' stop-opacity="' + st[2] + '"' : '') + '/>';
    }).join('') + '</' + tag + '></defs>' };
  }
  function rng(seed) { return function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; }; }
  function tx(x, y, t, o) {   // text markup; dark outline for the night sky
    o = o || {};
    return '<text x="' + x + '" y="' + y + '" ' + F + ' font-size="' + (o.size || 18) + '" font-weight="' + (o.weight || 700) + '" fill="' + (o.colour || '#FFFFFF') +
      '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="middle" stroke="' + (o.stroke || NIGHT) + '" stroke-width="5" paint-order="stroke">' + t + '</text>';
  }
  function T(s, x, y, t, o) { o = o || {}; return s.add(tx(0, 0, t, o), Object.assign({ x: x, y: y, enter: 'up' }, o)); }
  function sky(s, o) {   // the night sky: deep blue with a faint purple glow, small stars and a few bright ones
    var r = rng(11), d = '', g = G([[0, '#1A2156'], [.6, '#0F1638'], [1, '#0A0F2A']], { radial: true, cx: .7, cy: .2, r: 1.1 });
    var neb = G([[0, '#6C4DF6', .22], [1, '#6C4DF6', 0]], { radial: true, cx: .5, cy: .5, r: .5 });
    for (var i = 0; i < 90; i++) d += '<circle cx="' + (r() * 640).toFixed(0) + '" cy="' + (r() * 360).toFixed(0) + '" r="' + (0.6 + r() * 1.4).toFixed(1) + '" fill="#FFFFFF" opacity="' + (0.35 + r() * 0.6).toFixed(2) + '"/>';
    for (var k = 0; k < 7; k++) {
      var x = (r() * 640).toFixed(0), y = (r() * 360).toFixed(0);
      d += '<circle cx="' + x + '" cy="' + y + '" r="4" fill="#C9D4FF" opacity=".18"/><circle cx="' + x + '" cy="' + y + '" r="1.8" fill="#FFFFFF"/>';
    }
    return s.add(g.d + neb.d + '<rect width="640" height="360" fill="' + g.u + '"/><ellipse cx="470" cy="90" rx="260" ry="150" fill="' + neb.u + '"/>' + d,
      Object.assign({ enter: 'fade', ms: 400, flat: true }, o || {}));
  }
  function sunMk(r) {
    var glow = G([[.55, '#FFB020', .55], [1, '#FFB020', 0]], { cx: .5, cy: .5, r: .5, radial: true });
    var body = G([[0, '#FFF7CF'], [.45, '#FFD23F'], [1, '#FF962E']], { radial: true, cx: .4, cy: .38, r: .7 });
    return glow.d + body.d + '<circle r="' + (r * 1.45) + '" fill="' + glow.u + '"/><circle r="' + r + '" fill="' + body.u + '" stroke="#FF8A3D" stroke-opacity=".7" stroke-width="' + Math.max(1.5, r / 18) + '"/>';
  }
  /* soft shading over a round body: a light top-left, a darker rim */
  function shade(r, dark) {
    var g = G([[0, '#FFFFFF', .22], [.45, '#FFFFFF', 0], [1, dark || '#06103A', .45]], { radial: true, cx: .36, cy: .3, r: .78 });
    return g.d + '<circle r="' + r + '" fill="' + g.u + '"/>';
  }
  function earthMk(r) {   // a still Earth
    var sea = G([[0, '#6DB6FF'], [1, '#1E62C8']]), land = G([[0, '#5CD18F'], [1, '#178A55']]);
    return sea.d + land.d + '<circle r="' + r + '" fill="' + sea.u + '"/><path d="M' + (-r * .6) + ' ' + (-r * .3) + ' q' + (r * .3) + ' ' + (-r * .45) + ' ' + (r * .65) + ' ' + (-r * .15) + ' q' + (-r * .05) + ' ' + (r * .45) + ' ' + (-r * .45) + ' ' + (r * .4) + ' z M' + (r * .1) + ' ' + (r * .25) + ' q' + (r * .35) + ' ' + (-r * .15) + ' ' + (r * .55) + ' ' + (r * .1) + ' q' + (-r * .1) + ' ' + (r * .35) + ' ' + (-r * .45) + ' ' + (r * .3) + ' z" fill="' + land.u + '"/>' +
      shade(r) + '<circle r="' + r + '" fill="none" stroke="#9FD3FF" stroke-opacity=".5" stroke-width="' + Math.max(1, r / 25) + '"/>';
  }
  function moonMk(r) {
    var g = G([[0, '#F4F5F9'], [.6, '#C9CED8'], [1, '#8A90A3']], { radial: true, cx: .38, cy: .32, r: .8 });
    function crater(cx, cy, cr) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + cr + '" fill="#A3A9BA"/><path d="M' + (cx - cr * .8) + ' ' + (cy + cr * .4) + ' A' + cr + ' ' + cr + ' 0 0 0 ' + (cx + cr * .8) + ' ' + (cy + cr * .4) + '" fill="none" stroke="#E4E7EF" stroke-width="' + Math.max(.8, cr * .25) + '" stroke-linecap="round"/>'; }
    return g.d + '<circle r="' + r + '" fill="' + g.u + '"/>' + crater(-r * .3, -r * .25, r * .2) + crater(r * .35, r * .3, r * .14) + crater(-r * .2, r * .45, r * .1);
  }
  /* a planet ball with its own light and dark colours */
  function planetMk(r, light, dark) {
    var g = G([[0, light], [1, dark]], { radial: true, cx: .36, cy: .3, r: .85 });
    return g.d + '<circle r="' + r + '" fill="' + g.u + '"/>';
  }
  function jupiterMk(r) {   // banded, with the Great Red Spot
    var id = 'spc' + (++uid);
    return planetMk(r, '#F7DDB4', '#B5763A') + '<defs><clipPath id="' + id + '"><circle r="' + r + '"/></clipPath></defs><g clip-path="url(#' + id + ')" opacity=".75">' +
      '<path d="M' + (-r) + ' ' + (-r * .34) + ' Q0 ' + (-r * .26) + ' ' + r + ' ' + (-r * .34) + '" stroke="#B5763A" stroke-width="' + (r * .13) + '" fill="none"/>' +
      '<path d="M' + (-r) + ' ' + (r * .08) + ' Q0 ' + (r * .16) + ' ' + r + ' ' + (r * .08) + '" stroke="#C98A4B" stroke-width="' + (r * .15) + '" fill="none"/>' +
      '<path d="M' + (-r) + ' ' + (r * .5) + ' Q0 ' + (r * .58) + ' ' + r + ' ' + (r * .5) + '" stroke="#B5763A" stroke-width="' + (r * .1) + '" fill="none"/>' +
      '<ellipse cx="' + (r * .32) + '" cy="' + (r * .3) + '" rx="' + (r * .2) + '" ry="' + (r * .12) + '" fill="#C0533A"/></g>' + shade(r, '#3A1E05');
  }
  function clouds() { return cloud(150, 96, 1) + cloud(505, 120, .8); }
  function cloud(x, y, k) { return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')" opacity=".9"><ellipse cx="0" cy="0" rx="34" ry="13" fill="#FFFFFF"/><circle cx="-12" cy="-8" r="13" fill="#FFFFFF"/><circle cx="8" cy="-12" r="16" fill="#FFFFFF"/><ellipse cx="0" cy="4" rx="30" ry="6" fill="#E3F1FC"/></g>'; }
  function houseMk(snow) {   // a little house standing on (0, 0)
    var wall = G([[0, '#FFF8E6'], [1, '#F1DDB4']]), roof = G([[0, '#FF6B70'], [1, '#C9323A']]);
    return wall.d + roof.d + '<rect x="16" y="-62" width="10" height="22" rx="2" fill="#9A6532"/>' +
      '<rect x="-30" y="-32" width="60" height="32" rx="3" fill="' + wall.u + '" stroke="rgba(154,101,50,.6)" stroke-width="1.5"/>' +
      '<path d="M-40 -28 L0 -60 L40 -28 Q42 -26 38 -26 H-38 Q-42 -26 -40 -28 Z" fill="' + roof.u + '" stroke="rgba(120,30,30,.45)" stroke-width="1.5" stroke-linejoin="round"/>' +
      (snow ? '<path d="M-39 -29 L0 -59 L39 -29" fill="none" stroke="#FFFFFF" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' : '') +
      '<rect x="-7" y="-18" width="14" height="18" rx="3" fill="#9A6532"/><circle cx="3.5" cy="-9" r="1.3" fill="#FFE08A"/>' +
      '<rect x="12" y="-24" width="12" height="11" rx="2" fill="#CFE8FF" stroke="#9A6532" stroke-width="1.5"/><rect x="-24" y="-24" width="12" height="11" rx="2" fill="#CFE8FF" stroke="#9A6532" stroke-width="1.5"/>';
  }
  function nightHalf(r, side) {   // shadow on the half facing away from the Sun; side 1 = right half, -1 = left half
    return '<path d="M0 ' + (-r) + ' A' + r + ' ' + r + ' 0 0 ' + (side > 0 ? 1 : 0) + ' 0 ' + r + ' Z" fill="#050A24" opacity=".62"/>';
  }
  /* a globe whose land slides round (it spins west to east: the near side moves to the right) */
  function globeMk(r) {
    var id = 'spc' + (++uid), P = 2.4 * r, land = '', sea = G([[0, '#6DB6FF'], [1, '#1E62C8']]), lg = G([[0, '#5CD18F'], [1, '#178A55']]);
    var blobs = [[0.05, -0.45, 0.24, 0.2, 20], [0.3, 0.05, 0.16, 0.38, -10], [0.55, -0.35, 0.3, 0.18, 0], [0.62, 0.2, 0.12, 0.2, 15], [0.85, 0.5, 0.18, 0.12, 0]];
    for (var k = -2; k <= 1; k++) blobs.forEach(function (b) {
      land += '<ellipse cx="' + (k * P + b[0] * P).toFixed(1) + '" cy="' + (b[1] * r).toFixed(1) + '" rx="' + (b[2] * r * 1.4).toFixed(1) + '" ry="' + (b[3] * r).toFixed(1) + '" transform="rotate(' + b[4] + ' ' + (k * P + b[0] * P).toFixed(1) + ' ' + (b[1] * r).toFixed(1) + ')" fill="' + lg.u + '"/>';
    });
    return sea.d + lg.d + '<defs><clipPath id="' + id + '"><circle r="' + r + '"/></clipPath></defs><circle r="' + r + '" fill="' + sea.u + '"/>' +
      '<g clip-path="url(#' + id + ')"><g class="land" data-p="' + P.toFixed(1) + '">' + land + '</g>' +
      '<ellipse cx="0" cy="' + (-r) + '" rx="' + (r * .55) + '" ry="' + (r * .16) + '" fill="#F4F8FF"/><ellipse cx="0" cy="' + r + '" rx="' + (r * .55) + '" ry="' + (r * .16) + '" fill="#F4F8FF"/></g>' +
      shade(r) + '<circle r="' + r + '" fill="none" stroke="#9FD3FF" stroke-opacity=".5" stroke-width="2"/>';
  }
  function spin(s, g, ms) {
    var land = g && g.querySelector('.land');
    if (!land || !land.animate || s.fast) return;
    var P = +land.getAttribute('data-p');
    land.animate([{ transform: 'translateX(' + (-P) + 'px)' }, { transform: 'translateX(0px)' }], { duration: ms || 7000, iterations: Infinity, easing: 'linear' });
  }
  function arrowMk(x1, y1, x2, y2, col, w) {   // an arrow from (x1, y1) to (x2, y2)
    w = w || 6;
    var len = Math.hypot(x2 - x1, y2 - y1), deg = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI, h = Math.max(12, w * 2.2);
    return '<g transform="translate(' + x1.toFixed(1) + ' ' + y1.toFixed(1) + ') rotate(' + deg.toFixed(1) + ')"><rect x="0" y="' + (-w / 2) + '" width="' + Math.max(0, len - h + 2).toFixed(1) + '" height="' + w + '" rx="' + (w / 2) + '" fill="' + col + '"/>' +
      '<rect x="' + (w / 2) + '" y="' + (-w / 2 + 1.2) + '" width="' + Math.max(0, len - h - w).toFixed(1) + '" height="' + Math.max(1.2, w / 4) + '" rx="' + (w / 8) + '" fill="#fff" opacity=".35"/>' +
      '<path d="M' + (len - h).toFixed(1) + ' ' + (-h * .7).toFixed(1) + ' L' + len.toFixed(1) + ' 0 L' + (len - h).toFixed(1) + ' ' + (h * .7).toFixed(1) + ' Z" fill="' + col + '" stroke="' + col + '" stroke-width="2" stroke-linejoin="round"/></g>';
  }
  /* a group that turns round its own origin (x, y): draw the moving thing at (dist, 0) */
  function orbiter(s, x, y, markup, o) {
    var g = s.add(markup, Object.assign({ x: x, y: y, enter: 'fade' }, o || {}));
    g._inner.style.transformBox = 'view-box'; g._inner.style.transformOrigin = '0 0';
    return g;
  }
  function turnRound(s, g, from, to, ms, o) {
    o = o || {};
    s.anim(g, [{ transform: 'rotate(' + from + 'deg)' }, { transform: 'rotate(' + to + 'deg)' }], ms, { delay: o.delay, easing: o.easing || 'linear', iterations: o.iterations });
  }
  /* the Moon's phase as seen from the UK: p = 0 new, 0.25 first quarter (right half lit), 0.5 full, 0.75 last quarter */
  function phaseMk(r, p) {
    var dark = '<circle r="' + r + '" fill="#262D55" stroke="#4A5280" stroke-width="2"/>';
    if (p === 0) return dark;
    var g = G([[0, '#FFFDF2'], [.7, '#EDE8D4'], [1, '#CFC8AE']], { radial: true, cx: .5, cy: .4, r: .7 });
    var flip = p > 0.5, q = flip ? 1 - p : p, c = Math.cos(2 * Math.PI * q), rx = Math.abs(c) * r;
    var lit = '<path d="M0 ' + (-r) + ' A' + r + ' ' + r + ' 0 0 1 0 ' + r + ' A' + rx.toFixed(2) + ' ' + r + ' 0 0 ' + (c > 0 ? 0 : 1) + ' 0 ' + (-r) + ' Z" fill="' + g.u + '"/>';
    if (q === 0.5) lit = '<circle r="' + r + '" fill="' + g.u + '"/>';
    return g.d + dark + '<g' + (flip ? ' transform="scale(-1,1)"' : '') + '>' + lit + '</g>';
  }
  function tiltEarthMk(r, sunSide, tilt) {   // side view; axis leans `tilt` degrees, top to the right; red dot = the UK at midday
    var lat = 52 * Math.PI / 180;
    return earthMk(r) + nightHalf(r, -sunSide) +
      '<g transform="rotate(' + tilt + ')"><path d="M0 ' + (-r - 22) + ' V' + (r + 22) + '" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="6 5" stroke-linecap="round"/>' +
      '<path d="M' + (-r) + ' 0 H' + r + '" stroke="#FFFFFF" stroke-width="1.5" opacity=".6"/>' +
      '<circle cx="' + (sunSide * r * Math.cos(lat)).toFixed(1) + '" cy="' + (-r * Math.sin(lat)).toFixed(1) + '" r="5.5" fill="#FF5D8F" stroke="#FFFFFF" stroke-width="2"/></g>';
  }
  function astronautMk() {
    var suit = G([[0, '#FFFFFF'], [1, '#D5D9E3']], { h: true }), visor = G([[0, '#6C8CFF'], [.5, '#2D1B69'], [1, '#1A1240']]), pack = G([[0, '#C9CED8'], [1, '#8A90A3']]);
    var o = ' fill="' + suit.u + '" stroke="rgba(30,27,58,.45)" stroke-width="2"';
    return suit.d + visor.d + pack.d + '<rect x="-25" y="-30" width="50" height="46" rx="10" fill="' + pack.u + '" stroke="rgba(30,27,58,.4)" stroke-width="2"/>' +
      '<rect x="-20" y="-24" width="40" height="52" rx="14"' + o + '/>' +
      '<rect x="-30" y="-20" width="12" height="34" rx="6"' + o + '/><rect x="18" y="-20" width="12" height="34" rx="6"' + o + '/>' +
      '<circle cx="-24" cy="16" r="5.5" fill="#9AA0B4"/><circle cx="24" cy="16" r="5.5" fill="#9AA0B4"/>' +
      '<rect x="-18" y="24" width="14" height="34" rx="6"' + o + '/><rect x="4" y="24" width="14" height="34" rx="6"' + o + '/>' +
      '<rect x="-19" y="51" width="16" height="8" rx="3" fill="#9AA0B4"/><rect x="3" y="51" width="16" height="8" rx="3" fill="#9AA0B4"/>' +
      '<circle cy="-44" r="22"' + o + '/><rect x="-15" y="-56" width="30" height="21" rx="10" fill="' + visor.u + '"/><path d="M-9 -51 q6 -4 12 -1" stroke="#CFE8FF" stroke-width="3" fill="none" stroke-linecap="round"/>' +
      '<rect x="-9" y="-12" width="18" height="12" rx="3" fill="#FF5D8F"/><circle cx="-4" cy="-6" r="1.8" fill="#fff"/><circle cx="3" cy="-6" r="1.8" fill="#FFE08A"/>';
  }
  function rock() { return planetMk(9, '#E2D8CC', '#7F6F62') + '<circle cx="2" cy="3" r="2" fill="#6F6054" opacity=".5"/>'; }
  function pullMk(x, y, px, py, len) {   // a pull arrow at a rock (drawn at 0, 0) pointing towards (px, py)
    var d = Math.hypot(px - x, py - y), ux = (px - x) / d, uy = (py - y) / d;
    return arrowMk(ux * 12, uy * 12, ux * (12 + len), uy * (12 + len), '#FF5D8F', 5);
  }
  function hideAll(s, names) { names.forEach(function (n) { s.hide(s.ref[n]); }); }

  Theory.scenes({
    /* ---------- 1. Day and night ---------- */
    'earth-axis': function (s) {
      sky(s);
      var g = s.add(globeMk(110), { x: 320, y: 190, enter: 'pop', name: 'globe' });
      spin(s, g);
      s.add('<path d="M0 -150 V150" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="10 7"/>', { x: 320, y: 190, enter: 'fade', delay: 800, name: 'axis' });
      s.add('<path d="M-125 20 Q0 70 125 20" fill="none" stroke="' + SUN + '" stroke-width="4"/><path d="M112 9 L131 18 L117 33 Z" fill="' + SUN + '"/>', { x: 320, y: 190, enter: 'fade', delay: 1400 });
      T(s, 420, 66, 'North Pole', { delay: 500 });
      T(s, 420, 316, 'South Pole', { delay: 700 });
      T(s, 160, 70, 'axis', { size: 22, colour: LIGHT, delay: 1000 });
      s.add('<path d="M0 0 L125 0" stroke="' + LIGHT + '" stroke-width="2" stroke-dasharray="4 4"/>', { x: 190, y: 70, enter: 'fade', delay: 1000 });
      T(s, 150, 300, 'it spins', { size: 22, colour: SUN, delay: 1600 });
    },
    'day-night': function (s) {
      spin(s, s.ref.globe);
      s.add(sunMk(120), { x: -70, y: 190, enter: 'left' });
      s.add([130, 190, 250].map(function (y) { return arrowMk(60, y, 190, y, LIGHT, 5); }).join(''), { enter: 'fade', delay: 600 });
      s.add(nightHalf(110, 1), { x: 320, y: 190, enter: 'fade', delay: 900 });
      s.add('<path d="M0 -150 V150" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="10 7"/>', { x: 320, y: 190, enter: 'none' });
      T(s, 265, 190, 'DAY', { size: 28, colour: '#FFF4D6', delay: 1300 });
      T(s, 378, 190, 'NIGHT', { size: 26, colour: '#B7C4FF', delay: 1600 });
    },
    'spin-24': function (s) {
      spin(s, s.ref.globe, 2600);
      var face = G([[0, '#FFFFFF'], [1, '#E9ECF4']], { radial: true, cx: .4, cy: .35 }), rim = G([[0, '#FFE08A'], [1, '#F2A100']]), ticks = '';
      for (var a = 0; a < 360; a += 30) ticks += '<path d="M0 -33 V' + (a % 90 ? -30 : -27) + '" stroke="#9AA0B4" stroke-width="2" stroke-linecap="round" transform="rotate(' + a + ')"/>';
      s.add(face.d + rim.d + '<circle r="42" fill="' + rim.u + '"/><circle r="36" fill="' + face.u + '"/>' + ticks + '<path d="M0 0 V-24 M0 0 L16 7" stroke="#2D1B69" stroke-width="4" stroke-linecap="round"/><circle r="3.5" fill="#E5484D"/>', { x: 545, y: 160, enter: 'pop', name: 'clock' });
      s.anim(s.ref.clock, [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], 2600, { delay: 300 });
      T(s, 545, 236, '1 spin', { size: 24, colour: SUN, delay: 600 });
      T(s, 545, 266, '= about 24 hours', { size: 19, delay: 900 });
    },
    'sun-sky': function (s) {
      s.clear(); s.ref = {};
      s.add('<defs><linearGradient id="spcDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6EC1FF"/><stop offset="1" stop-color="#DDF2FF"/></linearGradient></defs><rect width="640" height="360" fill="url(#spcDay)"/>' + clouds(), { enter: 'fade', flat: true });
      s.add('<path d="M90 290 A230 230 0 0 1 550 290" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="8 8" stroke-linecap="round"/>', { enter: 'fade', delay: 200, flat: true });
      var sun = orbiter(s, 320, 290, '<g transform="translate(-230 0)">' + sunMk(26) + '</g>', { enter: 'fade' });
      turnRound(s, sun, 0, 180, 4200, { delay: 300, easing: 'ease-in-out' });
      s.ground(290);
      s.owl(320, 300, 70, { delay: 300 });
      s.text(80, 320, 'East', { size: 24, weight: 700, colour: s.C.deep });
      s.text(560, 320, 'West', { size: 24, weight: 700, colour: s.C.deep });
      s.text(110, 264, 'rises', { size: 18, colour: '#C2570C', delay: 500 });
      s.text(530, 264, 'sets', { size: 18, colour: '#C2570C', delay: 3800 });
      s.text(320, 340, 'looking south from the UK', { size: 16, colour: s.C.muted, delay: 700 });
      s.text(320, 34, 'The Sun only seems to move', { size: 26, weight: 700, colour: s.C.deep, delay: 900 });
    },

    /* ---------- 2. Years and seasons ---------- */
    'orbit': function (s) {
      var CX = 240, CY = 200, RX = 185, RY = 85;
      sky(s);
      s.add('<ellipse rx="' + RX + '" ry="' + RY + '" fill="none" stroke="#FFFFFF" stroke-opacity=".45" stroke-width="2" stroke-dasharray="6 6"/>', { x: CX, y: CY, enter: 'fade' });
      s.add(sunMk(38), { x: CX, y: CY, enter: 'pop' });
      var e = s.add(earthMk(16), { x: CX - RX, y: CY, enter: 'pop', delay: 300, name: 'earth' });
      var frames = [];
      for (var k = 0; k <= 36; k++) { var a = Math.PI - k * 2 * Math.PI / 36; frames.push({ transform: 'translate(' + (RX + RX * Math.cos(a)).toFixed(1) + 'px,' + (RY * Math.sin(a)).toFixed(1) + 'px)' }); }
      s.anim(e, frames, 5000, { delay: 600, easing: 'linear' });
      T(s, 240, 40, 'The Earth orbits the Sun', { size: 26, colour: SUN, delay: 200 });
      T(s, 540, 150, '1 orbit', { size: 26, colour: SUN, delay: 900, name: 'o1' });
      T(s, 540, 185, '= 1 year', { size: 22, delay: 1200, name: 'o2' });
      T(s, 540, 225, 'about 365¼ days', { size: 19, colour: LIGHT, delay: 1600, name: 'o3' });
    },
    'leap': function (s) {
      hideAll(s, ['o1', 'o2', 'o3']);
      var pg = G([[0, '#FFFFFF'], [1, '#EEF0F6']]), hd = G([[0, '#FF6B70'], [1, '#C9323A']]);
      s.add(pg.d + hd.d + '<rect x="-62" y="-70" width="124" height="140" rx="14" fill="' + pg.u + '"/><path d="M-62 -32 V-56 Q-62 -70 -48 -70 H48 Q62 -70 62 -56 V-32 Z" fill="' + hd.u + '"/>' +
        '<rect x="-30" y="-78" width="8" height="18" rx="4" fill="#55526E"/><rect x="22" y="-78" width="8" height="18" rx="4" fill="#55526E"/>' +
        tx(0, -48, 'February', { size: 18, stroke: '#D9393F' }) + tx(0, 14, '29', { size: 56, colour: '#1E1B3A', stroke: '#FFFFFF' }) + tx(0, 52, 'extra day!', { size: 14, colour: '#E5484D', stroke: '#FFFFFF' }),
        { x: 540, y: 170, enter: 'pop' });
      T(s, 540, 275, 'every 4 years', { size: 22, colour: SUN, delay: 700 });
      T(s, 540, 305, '¼ + ¼ + ¼ + ¼ = 1 day', { size: 17, colour: LIGHT, delay: 1200 });
    },
    'tilt': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      s.add('<ellipse rx="230" ry="62" fill="none" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="2" stroke-dasharray="6 6"/>', { x: 320, y: 200, enter: 'fade' });
      s.add(sunMk(44), { x: 320, y: 200, enter: 'pop' });
      s.add(tiltEarthMk(46, 1, 23.5), { x: 90, y: 200, enter: 'pop', delay: 400, name: 'june' });
      s.add(tiltEarthMk(46, -1, 23.5), { x: 550, y: 200, enter: 'pop', delay: 800, name: 'dec' });
      T(s, 90, 300, 'June', { size: 22, colour: SUN, delay: 1000 });
      T(s, 550, 300, 'December', { size: 22, colour: '#B7C4FF', delay: 1100 });
      T(s, 320, 40, 'The axis is tilted', { size: 26, colour: SUN, delay: 300 });
      T(s, 320, 76, 'and always leans the same way', { size: 18, colour: LIGHT, delay: 1300 });
      s.add(tx(0, 0, 'UK', { size: 15, colour: '#FF5D8F' }), { x: 156, y: 166, enter: 'fade', delay: 1600 });
      s.add(tx(0, 0, 'UK', { size: 15, colour: '#FF5D8F' }), { x: 516, y: 140, enter: 'fade', delay: 1600 });
      T(s, 320, 330, 'not to scale', { size: 13, colour: '#9AA0B4', delay: 1500 });
    },
    'summer': function (s) {
      s.clear(); s.ref = {};
      var sk = G([[0, '#5DB8FF'], [1, '#D6EEFF']]), gr = G([[0, '#8FD88F'], [1, '#4FAF62']]);
      s.add(sk.d + gr.d + '<rect width="640" height="360" fill="#FFFDF7"/><rect x="0" y="0" width="316" height="290" fill="' + sk.u + '"/><rect x="0" y="290" width="316" height="70" fill="' + gr.u + '"/><rect x="0" y="288" width="316" height="4" fill="#A6E3A1"/>' +
        cloud(60, 70, .8), { enter: 'fade', flat: true });
      s.add('<path d="M30 290 Q158 -150 286 290" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round"/>', { enter: 'fade', delay: 300, flat: true });
      var sun = s.add(sunMk(24), { x: 158, y: 70, enter: 'pop', delay: 600 });
      s.anim(sun, [{ transform: 'translateY(220px)' }, { transform: 'translateY(0px)' }], 1600, { delay: 600, easing: 'ease-out' });
      s.add(houseMk(false), { x: 90, y: 292, enter: 'up', delay: 200 });
      var lf = G([[0, '#5CD18F'], [1, '#178A55']], { radial: true, cx: .35, cy: .3, r: .8 });
      s.add(lf.d + '<path d="M-6 0 Q-5 -24 -3 -40 H3 Q5 -24 6 0 Z" fill="#9A6532"/><circle cx="-16" cy="-50" r="18" fill="' + lf.u + '"/><circle cx="16" cy="-50" r="18" fill="' + lf.u + '"/><circle cy="-66" r="24" fill="' + lf.u + '"/><circle cx="-8" cy="-74" r="7" fill="#fff" opacity=".15"/>', { x: 240, y: 292, enter: 'up', delay: 300 });
      s.text(158, 26, 'Summer (June)', { size: 26, weight: 700, colour: '#C2570C', delay: 200 });
      s.text(158, 318, 'Sun high in the sky', { size: 18, weight: 700, colour: '#1E1B3A', delay: 1500 });
      s.text(158, 344, 'about 16 hours of daylight', { size: 16, colour: '#1E1B3A', delay: 1900 });
    },
    'winter': function (s) {
      var sk = G([[0, '#93A8C8'], [1, '#E2E9F3']]), sn = G([[0, '#FFFFFF'], [1, '#DCE5F2']]);
      s.add(sk.d + sn.d + '<rect x="324" y="0" width="316" height="290" fill="' + sk.u + '"/><rect x="324" y="290" width="316" height="70" fill="' + sn.u + '"/><rect x="324" y="288" width="316" height="4" fill="#FFFFFF"/>', { enter: 'fade', flat: true });
      s.add('<path d="M354 290 Q482 90 610 290" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-dasharray="7 7" stroke-linecap="round"/>', { enter: 'fade', delay: 300, flat: true });
      var sun = s.add(sunMk(24), { x: 482, y: 190, enter: 'pop', delay: 600 });
      s.anim(sun, [{ transform: 'translateY(100px)' }, { transform: 'translateY(0px)' }], 1400, { delay: 600, easing: 'ease-out' });
      s.add(houseMk(true), { x: 414, y: 292, enter: 'up', delay: 200 });
      s.add('<path d="M0 0 V-46 M0 -20 L-16 -36 M0 -30 L14 -44 M0 -12 L12 -22" stroke="#7A4E25" stroke-width="6" stroke-linecap="round"/><path d="M0 0 V-46 M0 -20 L-16 -36 M0 -30 L14 -44" stroke="#B07A45" stroke-width="2" stroke-linecap="round" transform="translate(-1 0)"/>' +
        '<path d="M-19 -38 l6 -2 M11 -46 l6 -1" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round"/>', { x: 564, y: 292, enter: 'up', delay: 300 });
      s.text(482, 26, 'Winter (December)', { size: 26, weight: 700, colour: '#2F80ED', delay: 200 });
      s.text(482, 318, 'Sun low in the sky', { size: 18, weight: 700, colour: '#1E1B3A', delay: 1500 });
      s.text(482, 344, 'about 8 hours of daylight', { size: 16, colour: '#1E1B3A', delay: 1900 });
    },

    /* ---------- 3. The Solar System (sizes and distances not to scale) ---------- */
    'sun': function (s) {
      sky(s);
      s.add(sunMk(170), { x: -90, y: 190, enter: 'left', ms: 900 });
      T(s, 330, 150, 'The Sun', { size: 40, colour: SUN, delay: 600, name: 'w1' });
      T(s, 330, 200, 'our star', { size: 26, delay: 1000, name: 'w2' });
      T(s, 330, 240, 'a huge ball of hot, glowing gas', { size: 19, colour: LIGHT, delay: 1400, name: 'w3' });
    },
    'planets': function (s) {
      hideAll(s, ['w1', 'w2', 'w3']);
      var P = [['Mercury', 150, 5, '#B8A89A'], ['Venus', 190, 9, '#E8C07A'], ['Earth', 232, 10, SEA], ['Mars', 272, 7, '#E06A3B'],
               ['Jupiter', 335, 26, '#D9A066'], ['Saturn', 415, 21, '#E8CF8F'], ['Uranus', 495, 14, '#8FE0E8'], ['Neptune', 570, 14, '#4F7BEA']];
      s.add(P.map(function (p) { var r = p[1] + 90; return '<path d="M' + (-90 + r * Math.cos(.5)).toFixed(1) + ' ' + (190 - r * Math.sin(.5)).toFixed(1) + ' A' + r + ' ' + r + ' 0 0 1 ' + (-90 + r * Math.cos(.5)).toFixed(1) + ' ' + (190 + r * Math.sin(.5)).toFixed(1) + '" fill="none" stroke="#FFFFFF" stroke-opacity=".22" stroke-width="1.5"/>'; }).join(''), { enter: 'fade' });
      var LOOK = { Mercury: ['#E2D8CC', '#7F6F62'], Venus: ['#FFEBB8', '#C9953E'], Mars: ['#FFA07A', '#A8391A'], Saturn: ['#FBEBC0', '#C29B4E'], Uranus: ['#D2F7FA', '#3FA8BA'], Neptune: ['#9DBBFF', '#2C47B8'] };
      P.forEach(function (p, i) {
        var mk = p[0] === 'Earth' ? earthMk(p[2]) : p[0] === 'Jupiter' ? jupiterMk(p[2]) : planetMk(p[2], LOOK[p[0]][0], LOOK[p[0]][1]);
        if (p[0] === 'Saturn') mk = '<ellipse rx="38" ry="9" fill="none" stroke="#B89B5E" stroke-width="5"/><ellipse rx="38" ry="9" fill="none" stroke="#E9D59E" stroke-width="2.5"/>' + mk +
          '<path d="M-21 1.5 A38 9 0 0 0 21 1.5" fill="none" stroke="#B89B5E" stroke-width="5"/><path d="M-21 1.5 A38 9 0 0 0 21 1.5" fill="none" stroke="#E9D59E" stroke-width="2.5"/>';
        s.add(mk, { x: p[1], y: 190, enter: 'pop', delay: 200 + i * 350 });
        var up = i % 2 === 0;
        s.add(tx(0, 0, p[0], { size: 15 }), { x: p[1], y: up ? 142 : 240, enter: 'fade', delay: 300 + i * 350, name: 'n' + i });
      });
      T(s, 560, 340, 'not to scale', { size: 13, colour: '#9AA0B4', delay: 2800 });
    },
    'mnemonic': function (s) {
      var words = ['My', 'Very', 'Easy', 'Method', 'Just', 'Speeds', 'Up', 'Naming'];
      var mk = '<text x="0" y="0" ' + F + ' font-size="21" font-weight="600" fill="#FFFFFF" text-anchor="middle" dominant-baseline="middle" stroke="' + NIGHT + '" stroke-width="5" paint-order="stroke">' +
        words.map(function (w) { return '<tspan fill="' + SUN + '" font-size="27" font-weight="700">' + w[0] + '</tspan>' + w.slice(1); }).join(' ') + '</text>';
      s.add('<rect x="-250" y="-26" width="500" height="52" rx="26" fill="#2D1B69" stroke="' + SUN + '" stroke-width="3"/>' + mk, { x: 330, y: 300, enter: 'pop' });
    },
    'inner-outer': function (s) {
      s.add('<path d="M140 104 V94 H284 V104" fill="none" stroke="#FFB36B" stroke-width="3"/><path d="M304 104 V94 H612 V104" fill="none" stroke="#8FE0E8" stroke-width="3"/>', { enter: 'fade' });
      T(s, 212, 70, 'small and rocky', { size: 19, colour: '#FFB36B', delay: 300 });
      T(s, 458, 70, 'giants of gas and ice', { size: 19, colour: '#8FE0E8', delay: 900 });
    },
    'further': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      var CX = 250, CY = 185;
      s.add('<circle r="75" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="2" stroke-dasharray="5 5"/><circle r="160" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="2" stroke-dasharray="5 5"/>', { x: CX, y: CY, enter: 'fade' });
      s.add(sunMk(26), { x: CX, y: CY, enter: 'pop' });
      var e = orbiter(s, CX, CY, '<g transform="translate(75 0)">' + earthMk(10) + '</g>');
      turnRound(s, e, 0, -360, 1400, { iterations: 3 });
      var n = orbiter(s, CX, CY, '<g transform="translate(160 0)">' + planetMk(13, '#9DBBFF', '#2C47B8') + '</g>');
      turnRound(s, n, 0, -9, 4200);
      T(s, 530, 120, 'Earth', { size: 24, colour: '#7FC1FF', delay: 300 });
      T(s, 530, 150, '1 year', { size: 20, delay: 500 });
      T(s, 530, 220, 'Neptune', { size: 24, colour: '#8FA8FF', delay: 1200 });
      T(s, 530, 250, 'about 165 years', { size: 20, delay: 1400 });
      T(s, 560, 340, 'not to scale', { size: 13, colour: '#9AA0B4', delay: 1500 });
    },

    /* ---------- 4. The Moon ---------- */
    'moon-orbit': function (s) {
      sky(s);
      s.add('<circle r="128" fill="none" stroke="#FFFFFF" stroke-opacity=".4" stroke-width="2" stroke-dasharray="6 6"/>', { x: 320, y: 185, enter: 'fade' });
      s.add(earthMk(46), { x: 320, y: 185, enter: 'pop' });
      var m = orbiter(s, 320, 185, '<g transform="translate(0 -128)">' + moonMk(17) + '</g>', { name: 'moon' });
      turnRound(s, m, 0, -360, 3000, { delay: 400, easing: 'ease-in-out' });
      T(s, 320, 340, 'one orbit: about 27 days', { size: 22, colour: LIGHT, delay: 900 });
      T(s, 560, 30, 'not to scale', { size: 13, colour: '#9AA0B4', delay: 1000 });
    },
    'moon-reflect': function (s) {
      s.add(sunMk(90), { x: -40, y: 70, enter: 'left' });
      s.add(moonMk(17) + nightHalf(17, 1).replace('opacity=".62"', 'opacity=".8"'), { x: 320, y: 57, enter: 'fade', delay: 500 });
      s.add(arrowMk(70, 60, 296, 57, LIGHT, 5), { enter: 'fade', delay: 700 });
      T(s, 180, 36, 'sunlight', { size: 18, colour: LIGHT, delay: 800 });
      s.add(arrowMk(330, 78, 330, 134, '#FFF7CC', 5), { enter: 'fade', delay: 1400 });
      T(s, 440, 104, 'reflected light', { size: 18, colour: '#FFF7CC', delay: 1500 });
    },
    'phases-diagram': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      s.add([80, 140, 200, 260, 320].map(function (y) { return arrowMk(10, y, 90, y, LIGHT, 4); }).join(''), { enter: 'left' });
      T(s, 55, 40, 'sunlight', { size: 17, colour: LIGHT });
      var EX = 360, EY = 190, R = 120;
      s.add('<circle r="' + R + '" fill="none" stroke="#FFFFFF" stroke-opacity=".3" stroke-width="2" stroke-dasharray="6 6"/>', { x: EX, y: EY, enter: 'fade' });
      s.add(earthMk(30) + nightHalf(30, 1), { x: EX, y: EY, enter: 'pop' });
      for (var k = 0; k < 8; k++) {
        var a = Math.PI + k * Math.PI / 4;
        s.add(moonMk(15) + nightHalf(15, 1).replace('opacity=".62"', 'opacity=".85"'), { x: EX + R * Math.cos(a), y: EY + R * Math.sin(a), enter: 'pop', delay: 400 + k * 200 });
      }
      T(s, EX - R, EY + 36, 'new moon', { size: 15, colour: LIGHT, delay: 2200 });
      T(s, EX + R, EY + 36, 'full moon', { size: 15, colour: LIGHT, delay: 2400 });
      T(s, 535, 336, 'lit half faces the Sun', { size: 17, delay: 2600 });
    },
    'phases-row': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      T(s, 320, 50, 'Phases of the Moon', { size: 28, colour: LIGHT });
      var names = ['new', 'crescent', 'half', 'gibbous', 'full', 'gibbous', 'half', 'crescent'];
      names.forEach(function (n, k) {
        var x = 52 + k * 76;
        s.add(phaseMk(27, k / 8), { x: x, y: 170, enter: 'pop', delay: 300 + k * 300 });
        s.add(tx(0, 0, n, { size: 15 }), { x: x, y: 220, enter: 'fade', delay: 400 + k * 300 });
      });
      s.add(arrowMk(40, 270, 600, 270, '#8FA8FF', 4), { enter: 'fade', delay: 2600 });
      T(s, 320, 300, 'then back to new moon again', { size: 18, colour: '#B7C4FF', delay: 2800 });
      T(s, 320, 336, 'as seen from the UK', { size: 14, colour: '#9AA0B4', delay: 3000 });
    },

    /* ---------- 5. Gravity in space ---------- */
    'gravity-pull': function (s) {
      sky(s);
      s.add('<path d="M320 70 V340" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="2"/>', { enter: 'fade' });
      T(s, 160, 40, 'More mass: stronger', { size: 22, colour: SUN });
      s.add(moonMk(22), { x: 70, y: 130, enter: 'pop', delay: 300 });
      s.add(rock() + arrowMk(-14, 0, -40, 0, '#FF5D8F', 5), { x: 250, y: 130, enter: 'pop', delay: 500 });
      s.add(earthMk(52), { x: 80, y: 260, enter: 'pop', delay: 700 });
      s.add(rock() + arrowMk(-14, 0, -100, 0, '#FF5D8F', 5), { x: 250, y: 260, enter: 'pop', delay: 900 });
      T(s, 480, 40, 'Further away: weaker', { size: 22, colour: SUN, delay: 1300 });
      s.add(earthMk(44), { x: 400, y: 210, enter: 'pop', delay: 1500 });
      s.add(rock() + pullMk(530, 150, 400, 210, 70), { x: 530, y: 150, enter: 'pop', delay: 1800 });
      s.add(rock() + pullMk(610, 290, 400, 210, 30), { x: 610, y: 290, enter: 'pop', delay: 2200 });
      T(s, 530, 120, 'near', { size: 16, colour: LIGHT, delay: 1900 });
      T(s, 600, 320, 'far', { size: 16, colour: LIGHT, delay: 2300 });
    },
    'orbit-gravity': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      var CX = 210, CY = 190;
      s.add('<circle r="140" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="2" stroke-dasharray="6 6"/>', { x: CX, y: CY, enter: 'fade' });
      s.add(sunMk(36), { x: CX, y: CY, enter: 'pop' });
      var e = orbiter(s, CX, CY, '<g transform="translate(140 0)">' + earthMk(14) + '</g>' + arrowMk(122, 0, 52, 0, '#FF5D8F', 6));
      turnRound(s, e, 0, -360, 6000, { delay: 300 });
      T(s, CX, 26, "the Sun's gravity pulls the Earth", { size: 17, colour: '#FF9DBB', delay: 600 });
      s.add('<circle r="62" fill="none" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="2" stroke-dasharray="5 5"/>', { x: 520, y: 190, enter: 'fade', delay: 1200 });
      s.add(earthMk(24), { x: 520, y: 190, enter: 'pop', delay: 1200 });
      var m = orbiter(s, 520, 190, '<g transform="translate(62 0)">' + moonMk(9) + '</g>' + arrowMk(50, 0, 30, 0, '#FF5D8F', 4), { delay: 1300 });
      turnRound(s, m, 0, -360, 4000, { delay: 1300 });
      T(s, 520, 290, "the Earth's gravity", { size: 17, colour: '#FF9DBB', delay: 1600 });
      T(s, 520, 314, 'holds the Moon', { size: 17, colour: '#FF9DBB', delay: 1700 });
      T(s, 580, 345, 'not to scale', { size: 13, colour: '#9AA0B4', delay: 1800 });
    },
    'g-table': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      T(s, 320, 32, 'Gravity on different worlds', { size: 26, colour: SUN });
      var rows = [['Earth', earthMk(34), '10 N/kg', 10, '#7FC1FF'], ['Moon', moonMk(26), '1.6 N/kg', 1.6, '#DADDE6'],
                  ['Jupiter', jupiterMk(44), '25 N/kg', 25, '#FFB36B']];
      rows.forEach(function (r, i) {
        var x = 120 + i * 200, d = 300 + i * 700;
        s.add(r[1], { x: x, y: 112, enter: 'pop', delay: d });
        s.add(tx(0, 0, r[0], { size: 22, colour: r[4] }), { x: x, y: 176, enter: 'fade', delay: d + 100 });
        var h = r[3] * 4.4;   // bar heights to scale
        var bg = G([[0, '#FFFFFF', .35], [.5, '#FFFFFF', 0], [1, '#000000', .15]], { h: true });
        var bar = s.add(bg.d + '<rect x="-30" y="' + (-h) + '" width="60" height="' + h + '" rx="8" fill="' + r[4] + '"/><rect x="-30" y="' + (-h) + '" width="60" height="' + h + '" rx="8" fill="' + bg.u + '"/>', { x: x, y: 340, enter: 'none' });
        bar._inner.style.transformOrigin = '50% 100%';
        s.anim(bar, [{ transform: 'scaleY(0)' }, { transform: 'scaleY(1)' }], 700, { delay: d + 200 });
        s.add(tx(0, 0, r[2], { size: 20 }), { x: x, y: 330 - h - 16, enter: 'fade', delay: d + 600 });
      });
    },
    'astronaut': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      s.add('<path d="M320 60 V360" stroke="#FFFFFF" stroke-opacity=".25" stroke-width="2"/>', { enter: 'fade' });
      var gr = G([[0, '#5CD18F'], [1, '#178A55']]), mg = G([[0, '#D5D9E3'], [1, '#8A90A3']]);
      s.add(gr.d + '<rect x="0" y="0" width="318" height="60" fill="' + gr.u + '"/><rect x="0" y="0" width="318" height="4" fill="#A6E3A1"/>', { x: 0, y: 300, enter: 'up', flat: true });
      s.add(mg.d + '<rect x="0" y="0" width="318" height="60" fill="' + mg.u + '"/><rect x="0" y="0" width="318" height="4" fill="#EEF0F6"/><ellipse cx="80" cy="30" rx="16" ry="7" fill="#8A90A3"/><path d="M66 32 A16 7 0 0 0 94 32" stroke="#E4E7EF" stroke-width="2" fill="none"/>' +
        '<ellipse cx="220" cy="22" rx="10" ry="4.5" fill="#8A90A3"/><path d="M211 23 A10 4.5 0 0 0 229 23" stroke="#E4E7EF" stroke-width="1.5" fill="none"/>', { x: 322, y: 300, enter: 'up', flat: true });
      s.add(astronautMk(), { x: 130, y: 242, enter: 'pop', delay: 200 });
      s.add(astronautMk(), { x: 450, y: 242, enter: 'pop', delay: 400 });
      s.add(arrowMk(0, 0, 0, 120, '#FF5D8F', 6), { x: 205, y: 180, enter: 'down', delay: 900 });   // to scale: 1 unit = 5 N
      T(s, 250, 240, '600 N', { size: 22, colour: '#FF9DBB', delay: 1200 });
      s.add(arrowMk(0, 0, 0, 19.2, '#FF5D8F', 6), { x: 525, y: 180, enter: 'down', delay: 1500 });
      T(s, 570, 190, '96 N', { size: 22, colour: '#FF9DBB', delay: 1900 });
      T(s, 160, 36, 'On the Earth', { size: 24, colour: '#7FC1FF' });
      T(s, 480, 36, 'On the Moon', { size: 24, colour: '#DADDE6' });
      T(s, 160, 80, '60 kg × 10 N/kg', { size: 17, colour: LIGHT, delay: 600 });
      T(s, 480, 80, '60 kg × 1.6 N/kg', { size: 17, colour: LIGHT, delay: 1300 });
      s.add('<rect x="-150" y="-20" width="300" height="40" rx="20" fill="#2D1B69" stroke="' + SUN + '" stroke-width="3"/>' + tx(0, 1, 'mass 60 kg in both places', { size: 19, colour: SUN, stroke: '#2D1B69' }), { x: 320, y: 130, enter: 'pop', delay: 2400 });
    },

    /* ---------- 6. Stars and galaxies ---------- */
    'stars': function (s) {
      sky(s);
      var r = rng(5), tw = '';
      for (var i = 0; i < 26; i++) tw += '<path d="M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6 Z" fill="#FFFFFF" transform="translate(' + (300 + r() * 320).toFixed(0) + ' ' + (60 + r() * 260).toFixed(0) + ') scale(' + (0.5 + r()).toFixed(2) + ')"/>';
      var st = s.add(tw, { enter: 'fade', delay: 800 });
      s.anim(st, [{ opacity: 1 }, { opacity: .5 }, { opacity: 1 }], 1200, { delay: 1600, iterations: 3 });
      s.add(sunMk(70), { x: 70, y: 190, enter: 'pop' });
      T(s, 80, 300, 'the Sun', { size: 22, colour: SUN, delay: 300 });
      T(s, 80, 326, 'our nearest star', { size: 16, colour: LIGHT, delay: 500 });
      T(s, 460, 36, 'other stars: suns far, far away', { size: 20, delay: 1200 });
      s.owl(250, 340, 70, { delay: 1500 });
    },
    'sun-8min': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      s.add(sunMk(90), { x: -10, y: 190, enter: 'left' });
      s.add(earthMk(16), { x: 590, y: 190, enter: 'pop' });
      T(s, 590, 230, 'Earth', { size: 18, colour: '#7FC1FF' });
      s.add('<path d="M110 190 H568" stroke="' + LIGHT + '" stroke-opacity=".35" stroke-width="2" stroke-dasharray="4 6"/>', { enter: 'fade' });
      var pulse = s.add('<rect x="-40" y="-4" width="40" height="8" rx="4" fill="' + LIGHT + '" opacity=".6"/><circle r="8" fill="#FFF7CC"/>', { x: 110, y: 190, enter: 'fade', delay: 400 });
      s.move(pulse, 566, 190, 2600, { delay: 500, easing: 'linear' });
      T(s, 340, 120, 'light from the Sun', { size: 22, colour: LIGHT, delay: 300 });
      T(s, 340, 260, 'about 8 minutes', { size: 30, colour: SUN, delay: 2800 });
      T(s, 560, 340, 'not to scale', { size: 13, colour: '#9AA0B4' });
    },
    'light-year': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      T(s, 320, 50, '1 light year', { size: 34, colour: SUN });
      T(s, 320, 92, 'is a distance, not a time!', { size: 20, colour: LIGHT, delay: 400 });
      s.add('<path d="M40 200 H600" stroke="#FFFFFF" stroke-opacity=".35" stroke-width="3"/><path d="M40 186 V214 M600 186 V214" stroke="#FFFFFF" stroke-width="3"/>', { enter: 'fade', delay: 300 });
      var pulse = s.add('<rect x="-50" y="-4" width="50" height="8" rx="4" fill="' + LIGHT + '" opacity=".6"/><circle r="9" fill="#FFF7CC"/>', { x: 40, y: 200, enter: 'fade', delay: 600 });
      s.move(pulse, 600, 200, 2400, { delay: 700, easing: 'linear' });
      T(s, 320, 250, 'how far light goes in 1 year', { size: 22, delay: 2200 });
      var pg = G([[0, '#FFFFFF'], [1, '#EEF0F6']]), hd = G([[0, '#FF6B70'], [1, '#C9323A']]);
      s.add(pg.d + hd.d + '<rect x="-26" y="-28" width="52" height="56" rx="8" fill="' + pg.u + '"/><path d="M-26 -12 V-20 Q-26 -28 -18 -28 H18 Q26 -28 26 -20 V-12 Z" fill="' + hd.u + '"/>' +
        '<rect x="-14" y="-33" width="5" height="10" rx="2.5" fill="#55526E"/><rect x="9" y="-33" width="5" height="10" rx="2.5" fill="#55526E"/>' + tx(0, 8, '1 yr', { size: 16, colour: '#1E1B3A', stroke: '#FFFFFF' }), { x: 320, y: 310, enter: 'pop', delay: 2600 });
    },
    'far': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      T(s, 320, 40, '1 light year ≈', { size: 22, colour: LIGHT });
      T(s, 320, 80, '9 500 000 000 000 km', { size: 32, colour: SUN, enter: 'pop', delay: 400 });
      var x0 = 70, k = 120;   // 1 light year = 120 units
      var ticks = '';
      for (var i = 0; i <= 4; i++) ticks += '<path d="M' + (x0 + i * k) + ' 236 V250" stroke="#FFFFFF" stroke-width="2"/>' + tx(x0 + i * k, 268, String(i), { size: 15, colour: '#B7C4FF' });
      s.add('<path d="M' + x0 + ' 236 H' + (x0 + 4.2 * k) + '" stroke="#FFFFFF" stroke-width="2"/>' + ticks, { enter: 'fade', delay: 1200 });
      s.add(sunMk(20), { x: x0, y: 200, enter: 'pop', delay: 1000 });
      var rs = G([[0, '#FFD2C2'], [1, '#E5573A']], { radial: true, cx: .4, cy: .35, r: .7 });
      s.add(rs.d + '<circle r="18" fill="#FF8A6B" opacity=".18"/><circle r="9" fill="' + rs.u + '"/>', { x: x0 + 4.2 * k, y: 200, enter: 'pop', delay: 1800 });
      T(s, 548, 168, 'next nearest star', { size: 16, colour: '#FFB3A0', delay: 1900 });
      T(s, 320, 300, 'light years', { size: 16, colour: '#B7C4FF', delay: 1400 });
      T(s, 320, 334, 'over 4 light years away', { size: 22, colour: SUN, delay: 2300 });
    },
    'galaxy': function (s) {
      s.clear(); s.ref = {};
      sky(s, { enter: 'none' });
      var r = rng(3), dots = '';
      for (var arm = 0; arm < 2; arm++) {
        for (var i = 0; i < 260; i++) {
          var t = 1.5 + r() * 9.5, rad = 10 * Math.exp(0.24 * t), a = t + arm * Math.PI + (r() - .5) * .3;
          var jitter = (r() - .5) * rad * .14, x = (rad + jitter) * Math.cos(a), y = (rad + jitter) * Math.sin(a) * .7;
          dots += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + (0.6 + r() * 1.6).toFixed(1) + '" fill="' + ['#FFFFFF', '#DCD3FF', '#FFE9B0', '#B7C4FF'][Math.floor(r() * 4)] + '" opacity="' + (0.5 + r() * .5).toFixed(2) + '"/>';
        }
      }
      var id = 'spc' + (++uid);
      var g = s.add('<defs><radialGradient id="' + id + '"><stop offset="0" stop-color="#FFF4D6"/><stop offset=".35" stop-color="#C9B6FF" stop-opacity=".5"/><stop offset="1" stop-color="#6C4DF6" stop-opacity="0"/></radialGradient></defs>' +
        '<ellipse rx="150" ry="105" fill="url(#' + id + ')" opacity=".5"/><ellipse rx="22" ry="15" fill="#FFF4D6" opacity=".9"/>' + dots, { x: 250, y: 195, enter: 'pop', ms: 900 });
      T(s, 250, 34, 'The Milky Way', { size: 30, colour: '#DCD3FF', delay: 300 });
      var ht = Math.log(8) / 0.24;   // a point on arm 0 about 80 units from the centre: roughly halfway out, like the Sun
      var hx = 250 + 80 * Math.cos(ht), hy = 195 + 80 * Math.sin(ht) * .7;
      s.add('<circle r="7" fill="none" stroke="#FF5D8F" stroke-width="3"/>', { x: hx, y: hy, enter: 'pop', delay: 1200 });
      s.add('<path d="M0 0 L' + (110 - hx + 20).toFixed(1) + ' ' + (292 - hy - 14).toFixed(1) + '" stroke="#FF5D8F" stroke-width="2"/>', { x: hx - 5, y: hy + 5, enter: 'fade', delay: 1200 });
      T(s, 100, 296, 'we are here', { size: 18, colour: '#FF9DBB', delay: 1300 });
      T(s, 250, 336, 'hundreds of billions of stars', { size: 18, colour: LIGHT, delay: 1700 });
      [[540, 90, 1], [600, 170, .6], [530, 230, .7], [590, 300, .5]].forEach(function (p, i) {
        s.add('<ellipse rx="' + (26 * p[2]) + '" ry="' + (10 * p[2]) + '" fill="#C9B6FF" opacity=".55" transform="rotate(-25)"/><ellipse rx="' + (8 * p[2]) + '" ry="' + (4 * p[2]) + '" fill="#FFF4D6" transform="rotate(-25)"/>',
          { x: p[0], y: p[1], enter: 'pop', delay: 2200 + i * 250 });
      });
      T(s, 560, 34, 'other galaxies', { size: 17, colour: '#DCD3FF', delay: 2300 });
    }
  });
})();
