/* Theory video player for /videos/<subject>/<topic>/.

   The words and quick checks come from the page (#tvdata, built from videos/<subject>/<topic>.json).
   The pictures come from static/js/videos/<subject>-<topic>.js, which registers one function per scene:

     Theory.scenes({
       'push-box': function (s) { ... draw with s ... },
       ...
     });

   A scene draws onto the 640 x 360 stage with the helpers in `s` (below). Scenes in a chapter build on each
   other: the stage is cleared only at the start of a chapter, and `s.ref` keeps named things between steps.
   Going back replays the chapter instantly up to the step before, so every scene must only add or move things.

   No timer for the child: steps move on by themselves only after the caption has been read (and spoken),
   and the child can pause, go back or skip at any time. Each quick check uses the same stars as everywhere else. */
(function () {
  var box = document.getElementById('tv'), dataEl = document.getElementById('tvdata');
  if (!box || !dataEl) return;
  var D = JSON.parse(dataEl.textContent);
  var NS = 'http://www.w3.org/2000/svg';
  var still = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var synth = window.speechSynthesis || null;

  var svg = box.querySelector('.tv-stage'), cap = box.querySelector('.tv-cap'), chk = box.querySelector('.tv-check');
  var cover = box.querySelector('.tv-cover'), seg = box.querySelector('.tv-seg');
  var bPlay = box.querySelector('.tv-play'), bBack = box.querySelector('.tv-back'), bNext = box.querySelector('.tv-next'), bVoice = box.querySelector('.tv-voice');
  var chips = document.querySelectorAll('.tv-ch');
  var mascotSvg = (document.querySelector('.tv-cover-owl .mascot') || {}).outerHTML || '';

  var SC = null, ch = 0, st = -1, playing = false, waiting = false, tick = null, minEnd = 0, spoke = false;
  var results = [], firstTry = 0, earned = 0, combo = 0;
  var voiceOn = !!synth;
  try { if (localStorage.getItem('js-tv-voice') === '0') voiceOn = false; } catch (e) {}

  /* ---------- drawing helpers ---------- */
  var C = { ink: '#1E1B3A', muted: '#55526E', fun: '#6C4DF6', deep: '#2D1B69', sci: '#0F9488', pink: '#FF5D8F', sun: '#FFC93C',
            orange: '#FF8A3D', red: '#E5484D', blue: '#2F80ED', green: '#22A06B', paper: '#FFFFFF', wood: '#C98A4B', grey: '#9AA0B4' };

  function el(tag, attrs) {
    var e = document.createElementNS(NS, tag);
    for (var k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }

  function makeStage(fast) {
    var s = { C: C, ref: s && s.ref || {}, fast: fast || still, svg: svg };
    function d(ms) { return s.fast ? 0 : ms; }
    function anim(e, frames, ms, o) {
      o = o || {};
      if (!e.animate) return;
      var a = e.animate(frames, { duration: d(ms), delay: d(o.delay || 0), easing: o.easing || 'ease-out', fill: 'both' });
      if (s.fast) a.finish();
      return a;
    }
    function place(outer, x, y) { outer._x = x; outer._y = y; outer.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }
    var ENTER = {
      fade: [{ opacity: 0 }, { opacity: 1 }],
      pop: [{ opacity: 0, transform: 'scale(.3)' }, { opacity: 1, transform: 'scale(1.08)', offset: .7 }, { opacity: 1, transform: 'scale(1)' }],
      up: [{ opacity: 0, transform: 'translateY(30px)' }, { opacity: 1, transform: 'translateY(0)' }],
      down: [{ opacity: 0, transform: 'translateY(-40px)' }, { opacity: 1, transform: 'translateY(0)' }],
      left: [{ opacity: 0, transform: 'translateX(-60px)' }, { opacity: 1, transform: 'translateX(0)' }],
      right: [{ opacity: 0, transform: 'translateX(60px)' }, { opacity: 1, transform: 'translateX(0)' }]
    };

    /* s.add(markup, {x, y, enter: 'fade'|'pop'|'up'|'down'|'left'|'right'|'none', delay, ms, name}) -> a group at (x, y) */
    s.add = function (markup, o) {
      o = o || {};
      var outer = el('g', {}), inner = el('g', {});
      inner.innerHTML = markup; inner.style.transformBox = 'fill-box'; inner.style.transformOrigin = 'center';
      outer.appendChild(inner); outer._inner = inner;
      place(outer, o.x || 0, o.y || 0);
      svg.appendChild(outer);
      var enter = o.enter || 'fade';
      if (enter !== 'none') anim(inner, ENTER[enter], o.ms || 500, { delay: o.delay });
      if (o.name) s.ref[o.name] = outer;
      return outer;
    };
    /* s.text(x, y, text, {size, colour, weight, anchor, ...add options}) */
    s.text = function (x, y, text, o) {
      o = o || {};
      var t = '<text x="0" y="0" stroke="#FFFDF7" stroke-width="5" paint-order="stroke" font-family="Fredoka, Trebuchet MS, sans-serif" font-size="' + (o.size || 26) + '" font-weight="' + (o.weight || 600) +
        '" fill="' + (o.colour || C.ink) + '" text-anchor="' + (o.anchor || 'middle') + '" dominant-baseline="middle">' + text + '</text>';
      return s.add(t, Object.assign({ x: x, y: y, enter: 'up' }, o));
    };
    /* s.arrow(x, y, length, 'r'|'l'|'u'|'d', {colour, label, labelSide, width, delay, name}): a force arrow that grows from (x, y) */
    s.arrow = function (x, y, len, dir, o) {
      o = o || {};
      var col = o.colour || C.red, w = o.width || 10, head = Math.max(16, w * 2);
      var rot = { r: 0, d: 90, l: 180, u: 270 }[dir];
      var shaft = el('rect', { x: 0, y: -w / 2, width: Math.max(0, len - head + 2), height: w, rx: w / 2, fill: col });
      var tip = el('path', { d: 'M' + (len - head) + ' ' + (-head * 0.75) + ' L' + len + ' 0 L' + (len - head) + ' ' + (head * 0.75) + ' Z', fill: col });
      var g = s.add('', { x: x, y: y, enter: 'none', name: o.name });
      var body = el('g', { transform: 'rotate(' + rot + ')' });
      body.appendChild(shaft); body.appendChild(tip); g._inner.appendChild(body);
      body.style.transformBox = 'view-box'; body.style.transformOrigin = '0 0';
      anim(body, [{ transform: 'rotate(' + rot + 'deg) scaleX(0)' }, { transform: 'rotate(' + rot + 'deg) scaleX(1)' }], 600, { delay: o.delay, easing: 'cubic-bezier(.3,1.4,.6,1)' });
      if (o.label) {
        var rad = rot * Math.PI / 180, mx = Math.cos(rad) * len / 2, my = Math.sin(rad) * len / 2;
        var off = o.labelSide === 'below' ? 26 : -26, dx = 0, anchor = 'middle';
        if (dir === 'u' || dir === 'd') { off = 0; dx = o.labelSide === 'left' ? -14 : 14; anchor = o.labelSide === 'left' ? 'end' : 'start'; }
        var lbl = el('text', { x: mx + dx, y: my + off, 'font-family': 'Fredoka, Trebuchet MS, sans-serif', 'font-size': o.size || 22, 'font-weight': 700,
          fill: col, 'text-anchor': anchor, 'dominant-baseline': 'middle', stroke: '#FFFDF7', 'stroke-width': 5, 'paint-order': 'stroke' });
        lbl.textContent = o.label; g._inner.appendChild(lbl);
        anim(lbl, [{ opacity: 0 }, { opacity: 1 }], 300, { delay: (o.delay || 0) + 450 });
      }
      return g;
    };
    /* s.move(group, x, y, ms, {delay, easing}): glide to a new place */
    s.move = function (g, x, y, ms, o) {
      o = o || {};
      var from = 'translate(' + g._x + 'px,' + g._y + 'px)', to = 'translate(' + x + 'px,' + y + 'px)';
      place(g, x, y);
      if (!s.fast && g.animate) g.animate([{ transform: from }, { transform: to }], { duration: ms || 800, delay: o.delay || 0, easing: o.easing || 'ease-in-out', fill: 'backwards' });
    };
    /* s.anim(group, keyframes, ms, {delay, easing, iterations}): any other animation on a group's drawing */
    s.anim = function (g, frames, ms, o) {
      o = o || {};
      if (o.iterations && !s.fast && g._inner.animate) return g._inner.animate(frames, { duration: ms, delay: o.delay || 0, iterations: o.iterations, easing: o.easing || 'ease-in-out' });
      return anim(g._inner, frames, ms, o);
    };
    s.hide = function (g, o) { if (g) anim(g._inner, [{ opacity: 1 }, { opacity: 0 }], (o && o.ms) || 350, o); };
    s.remove = function (g) { if (g && g.parentNode) g.parentNode.removeChild(g); };
    s.clear = function () { while (svg.firstChild) svg.removeChild(svg.firstChild); };
    s.owl = function (x, y, size, o) {   // the mascot, standing at (x, y) = centre of its feet
      var k = (size || 120) / 120;
      var g = s.add('<g transform="translate(' + (-60 * k) + ',' + (-120 * k) + ') scale(' + k + ')">' + mascotSvg + '</g>', Object.assign({ x: x, y: y, enter: 'pop' }, o || {}));
      var m = g.querySelector('svg'); if (m) { m.setAttribute('width', 120); m.setAttribute('height', 120); }
      return g;
    };
    s.ground = function (y, o) { return s.add('<rect x="0" y="' + y + '" width="640" height="' + (360 - y) + '" fill="#E9DFCB"/><rect x="0" y="' + y + '" width="640" height="5" fill="#C9B48E"/>', Object.assign({ enter: 'fade' }, o || {})); };
    return s;
  }
  var S = makeStage(false); S.ref = {};

  /* ---------- playing ---------- */
  function words(html) { return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }
  function spoken(step) {
    if (step.speak) return step.speak;
    return words(step.say).replace(/(\d)\s*N\/kg/g, '$1 newtons per kilogram').replace(/(\d)\s*N\b/g, '$1 newtons')
      .replace(/(\d)\s*kg\b/g, '$1 kilograms').replace(/(\d)\s*cm\b/g, '$1 centimetres').replace(/(\d)\s*m\/s\b/g, '$1 metres per second')
      .replace(/×/g, ' times ').replace(/−/g, ' minus ').replace(/ = /g, ' equals ').replace(/\*\*/g, '');
  }
  function voice() {
    if (!synth) return null;
    var vs = synth.getVoices();
    return vs.filter(function (v) { return v.lang === 'en-GB'; })[0] || vs.filter(function (v) { return /^en/.test(v.lang); })[0] || null;
  }
  function say(text) {
    if (!synth || !voiceOn) return;
    synth.cancel();
    var u = new SpeechSynthesisUtterance(text), v = voice();
    if (v) u.voice = v;
    u.lang = v ? v.lang : 'en-GB'; u.rate = 0.95; u.pitch = 1.05;
    synth.speak(u); spoke = true;
  }
  function hush() { if (synth) synth.cancel(); }

  function stopTick() { if (tick) { clearInterval(tick); tick = null; } }
  function wait() {
    stopTick();
    if (!playing) return;
    tick = setInterval(function () {
      if (Date.now() < minEnd) return;
      if (synth && voiceOn && spoke && (synth.speaking || synth.pending)) return;
      stopTick(); forward();
    }, 250);
  }

  function chapter() { return D.chapters[ch]; }
  function drawStep(k, fast) {
    S.fast = fast || still;
    var fn = SC[chapter().steps[k].do];
    try { if (fn) fn(S); } catch (e) { if (window.console) console.error(e); }
    S.fast = still;
  }
  function rebuild(upTo) {   // clear and draw steps 0..upTo, all instantly but the last
    S.clear(); S.ref = {};
    for (var k = 0; k <= upTo; k++) drawStep(k, k < upTo);
  }

  function settle() {   // finish whatever is still moving (e.g. after a pause) before the next step draws
    if (svg.getAnimations) svg.getAnimations({ subtree: true }).forEach(function (a) { try { a.finish(); } catch (e) { a.cancel(); } });
  }
  function show(k, animate) {
    settle();
    chk.hidden = true; chk.innerHTML = ''; box.classList.remove('checking');
    st = k;
    if (animate) { if (k === 0) { S.clear(); S.ref = {}; } drawStep(k, false); } else rebuild(k);
    var step = chapter().steps[k];
    cap.innerHTML = step.say;
    minEnd = Date.now() + Math.max(3200, words(step.say).split(' ').length * 330 + 1200);
    spoke = false; say(spoken(step));
    marks(); wait();
  }

  function forward() {
    if (waiting) return;
    if (st + 1 < chapter().steps.length) show(st + 1, true);
    else if (chapter().check && results[ch] === undefined) check();
    else nextChapter();
  }
  function nextChapter() {
    if (ch + 1 < D.chapters.length) { ch++; show(0, true); } else finish();
  }
  function back() {
    hush(); stopTick();
    if (waiting) { waiting = false; show(chapter().steps.length - 1, false); return; }
    if (st > 0) show(st - 1, false);
    else if (ch > 0) { ch--; show(chapter().steps.length - 1, false); }
    else show(0, false);
  }

  function setPlaying(on) {
    playing = on;
    bPlay.textContent = on ? '⏸' : '▶'; bPlay.setAttribute('aria-label', on ? 'Pause' : 'Play');
    box.classList.toggle('paused', !on);
    svg.getAnimations && svg.getAnimations({ subtree: true }).forEach(function (a) { on ? a.play() : a.pause(); });
    if (on) { if (!waiting && st >= 0) { minEnd = Date.now() + 1500; spoke = false; say(spoken(chapter().steps[st])); wait(); } }
    else { hush(); stopTick(); }
  }

  function marks() {
    var total = 0, done = 0;
    D.chapters.forEach(function (c, n) { total += c.steps.length; if (n < ch) done += c.steps.length; });
    done += st + 1;
    seg.style.setProperty('--p', Math.round(100 * done / total) + '%');
    chips.forEach(function (b, n) {
      b.classList.toggle('now', n === ch);
      b.classList.toggle('done', results[n] !== undefined);
      if (n === ch) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current');
    });
  }

  /* ---------- quick check after each chapter ---------- */
  var PRAISE = ['Brilliant!', 'Spot on!', 'Yes, that\'s it!', 'Great thinking!', 'You got it!'];
  var FIXED = ['You fixed it, well done!', 'Great second try!'];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function check() {
    var q = chapter().check, tries = 0;
    waiting = true; stopTick(); hush();
    box.classList.add('checking');
    cap.innerHTML = '<b>Quick check!</b> Have a think, then tap your answer.';
    chk.hidden = false;
    chk.innerHTML = '<div class="tv-q"><p class="tv-q-label">🦉 Part ' + (ch + 1) + ' check</p><div class="q-text">' + q.q + '</div><div class="q-options"></div><div class="q-feedback" role="status"></div></div>';
    var opts = chk.querySelector('.q-options'), fb = chk.querySelector('.q-feedback');
    var order = q.options.map(function (_, k) { return k; }).sort(function () { return Math.random() - .5; });
    order.forEach(function (k) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'opt'; b.innerHTML = q.options[k];
      b.addEventListener('click', function () {
        if (results[ch] !== undefined) return;
        tries++;
        var ok = k === q.answer, sub = D.subject;
        if (ok || tries === 2) {
          var outcome = ok ? (tries === 1 ? 'first' : 'second') : 'missed';
          combo = ok ? combo + 1 : 0;
          if (outcome === 'first') firstTry++;
          results[ch] = outcome;
          var pts = window.JG ? JG.answer(outcome, combo, tries > 1, sub) : 0; earned += pts;
          opts.querySelectorAll('.opt').forEach(function (o, n) { o.disabled = true; if (order[n] === q.answer) o.classList.add('right'); });
          if (!ok) b.classList.add('wrong');
          fb.className = 'q-feedback ' + (ok ? 'good' : 'missed');
          fb.innerHTML = '<p class="fb-title">' + (ok ? (tries === 1 ? pick(PRAISE) : pick(FIXED)) : 'That one was tricky. Here\'s how it works.') +
            ' <span class="plus">+' + pts + ' ⭐</span></p><div class="explain">' + q.explain + '</div>';
          if (ok && tries === 1 && window.JG && combo >= 3) JG.confetti(40);
          var go = document.createElement('button'); go.type = 'button'; go.className = 'btn';
          go.textContent = ch + 1 < D.chapters.length ? 'Next part: ' + D.chapters[ch + 1].title + ' ▶' : 'Finish the video 🎉';
          go.addEventListener('click', function () { waiting = false; if (!playing) setPlaying(true); nextChapter(); });
          fb.appendChild(go); go.focus({ preventScroll: true });
          marks();
        } else {
          b.classList.add('wrong'); b.disabled = true; combo = 0;
          fb.className = 'q-feedback hint';
          fb.innerHTML = '<p class="fb-title">Not quite. Here\'s a hint.</p><div class="hint">💡 ' + q.hint + '</div><p class="small">Have another go!</p>';
        }
      });
      opts.appendChild(b);
    });
    marks();
    chk.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
  }

  function finish() {
    waiting = true; stopTick(); hush(); box.classList.add('checking');
    var total = D.chapters.filter(function (c) { return c.check; }).length || 1;
    var r = window.JG && JG.finishVideo ? JG.finishVideo({ key: 'video/' + D.key, subject: D.subject }, firstTry, total) : { stars: 1, points: 0 };
    earned += r.points;
    var badges = window.JG ? JG.drain() : [];
    S.clear(); S.ref = {};
    S.owl(320, 300, 190, { enter: 'pop' });
    cap.innerHTML = '<b>You watched the whole video!</b>';
    say('You watched the whole video! Well done.');
    var msg = r.stars === 3 ? 'Amazing work!' : r.stars === 2 ? 'Great job!' : 'Well done for finishing!';
    var qb = document.querySelector('.actions .btn:not(.ghost)');
    chk.hidden = false;
    chk.innerHTML = '<div class="endcard"><h3>' + msg + '</h3>' +
      '<div class="big-stars" aria-label="' + r.stars + ' out of 3 stars">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= r.stars ? 'on' : '') + '" style="animation-delay:' + (k * .25) + 's"></i>'; }).join('') + '</div>' +
      '<p class="end-score">' + firstTry + ' of ' + total + ' checks right first time · <b>+' + earned + ' ⭐</b></p>' +
      (badges.length ? '<div class="end-badges"><p><b>New badges</b></p>' + badges.map(function (b) { return '<span class="badge-pill"><span>' + b.icon + '</span>' + b.name + '</span>'; }).join('') + '</div>' : '') +
      '<p class="actions">' + (qb ? '<a class="btn" href="' + qb.getAttribute('href') + '">' + qb.textContent + '</a>' : '') +
      '<button class="btn ghost" type="button" id="tv-again">Watch again</button></p></div>';
    chk.querySelector('#tv-again').addEventListener('click', function () { restart(0); });
    if (window.JG) JG.confetti(r.stars === 3 ? 180 : 90);
    chips.forEach(function (b) { b.classList.remove('now'); });
    seg.style.setProperty('--p', '100%');
  }

  function restart(n) {
    waiting = false; results = results.slice(0, n); if (n === 0) { firstTry = 0; earned = 0; combo = 0; results = []; }
    ch = n; cover.hidden = true; box.classList.add('started');
    st = -1; if (!playing) setPlaying(true);
    show(0, true);
    box.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
  }

  /* ---------- controls ---------- */
  function setVoice(on) {
    voiceOn = on && !!synth;
    bVoice.textContent = voiceOn ? '🔊' : '🔇'; bVoice.setAttribute('aria-pressed', voiceOn ? 'true' : 'false');
    bVoice.setAttribute('aria-label', voiceOn ? 'Read aloud is on' : 'Read aloud is off');
    try { localStorage.setItem('js-tv-voice', voiceOn ? '1' : '0'); } catch (e) {}
    if (!voiceOn) hush(); else if (playing && !waiting && st >= 0) { spoke = false; say(spoken(chapter().steps[st])); }
  }

  function init() {
    if (!SC) return;
    if (!synth) bVoice.hidden = true;
    setVoice(voiceOn);
    box.querySelector('.tv-start').addEventListener('click', function () { restart(0); });
    bPlay.addEventListener('click', function () { if (st < 0) return restart(0); setPlaying(!playing); });
    bNext.addEventListener('click', function () { if (st < 0 || waiting) return; hush(); stopTick(); forward(); });
    bBack.addEventListener('click', function () { if (st < 0) return; back(); });
    bVoice.addEventListener('click', function () { setVoice(!voiceOn); });
    chips.forEach(function (b) {
      b.addEventListener('click', function () {
        hush(); stopTick();
        waiting = false; ch = +b.getAttribute('data-ch'); cover.hidden = true; box.classList.add('started');
        st = -1; if (!playing) setPlaying(true);
        show(0, true); box.scrollIntoView({ block: 'nearest', behavior: still ? 'auto' : 'smooth' });
      });
    });
    document.addEventListener('visibilitychange', function () { if (document.hidden && playing && !waiting) setPlaying(false); });
    box.classList.add('ready');
    if (synth && synth.onvoiceschanged !== undefined) synth.onvoiceschanged = function () {};
  }

  window.Theory = { scenes: function (map) { SC = map; init(); } };
})();
