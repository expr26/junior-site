/* Shared shell for every game on /games/<slug>/. A game registers itself with:

     Arcade.game({
       intro: 'Text in the owl bubble before the start',
       rounds: 8,
       round: function (i, ui) { ... draw round i into ui.stage ... }
     });

   Inside round(), the game calls:
     ui.owl(text)                       short tip in the owl bubble above the stage
     ui.check(ok, { hint, reveal, why }) after the child answers:
         ok           true when right
         hint         shown after a first wrong try (the child gets a second go)
         reveal()     called after a second wrong try, to show the right answer on the stage
         why          optional short explanation shown after a right answer or a reveal
   Rewards are the same as unit practice (window.JG): stars for first try, second try and effort, never for speed.
   There is no timer anywhere. */
(function () {
  var box = document.getElementById('arcade');
  if (!box || !window.JG) return;
  var KEY = box.getAttribute('data-key'), SUBJECT = box.getAttribute('data-subject');
  var mascotSvg = box.querySelector('.mascot').outerHTML;

  var PRAISE = ['Brilliant!', 'Spot on!', 'Yes, that\'s it!', 'Great thinking!', 'Nailed it!', 'Superb!', 'You got it!'];
  var FIXED = ['You fixed it, well done!', 'Great second try!', 'That\'s the way: learn and fix!'];
  var NEARLY = ['Not quite. Here\'s a hint.', 'Nearly! Have a look at this hint.', 'Good try. This hint should help.'];
  var MISSED = ['That one was tricky. Here\'s how it works.', 'No worries, mistakes help us learn. Here\'s the answer.'];
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var G, i, tries, combo, firstTry, earned, results, done;
  var head, owlBubble, stage, fb;

  function header() {
    var d = h('div', 'r-head');
    var dots = h('ol', 'r-dots'); dots.setAttribute('aria-label', 'Round ' + (i + 1) + ' of ' + G.rounds);
    for (var k = 0; k < G.rounds; k++) dots.appendChild(h('li', results[k] || (k === i ? 'now' : '')));
    d.appendChild(dots);
    if (combo >= 2) d.appendChild(h('span', 'r-combo' + (combo >= 4 ? ' hot' : ''), '🔥 ' + combo + ' in a row'));
    d.appendChild(h('span', 'r-points', '+' + earned + ' ⭐'));
    return d;
  }
  function refreshHead() { var n = header(); box.replaceChild(n, head); head = n; }

  function say(kind, text, extra) {
    fb.className = 'q-feedback ' + kind;
    fb.innerHTML = '<div class="fb-row"><div class="fb-mascot">' + mascotSvg + '</div><div><p class="fb-title">' + text + '</p>' + (extra || '') + '</div></div>';
  }

  var ui = {
    owl: function (text) { owlBubble.innerHTML = text; },
    check: function (ok, o) {
      if (done) return;
      o = o || {}; tries++;
      if (ok) {
        done = true; combo++;
        if (tries === 1) firstTry++;
        results[i] = tries === 1 ? 'good' : 'fixed';
        var pts = JG.answer(tries === 1 ? 'first' : 'second', combo, tries > 1, SUBJECT); earned += pts;
        stage.classList.remove('pop'); void stage.offsetWidth; stage.classList.add('pop');
        say('good', (tries === 1 ? pick(PRAISE) : pick(FIXED)) + ' <span class="plus">+' + pts + ' ⭐</span>', o.why ? '<p>' + o.why + '</p>' : '');
        if (combo === 3 || combo === 5 || combo === 8) JG.confetti(40);
        next();
      } else if (tries === 1) {
        combo = 0;
        stage.classList.remove('shake'); void stage.offsetWidth; stage.classList.add('shake');
        say('hint', pick(NEARLY), '<div class="hint">💡 ' + (o.hint || 'Look again carefully.') + '</div><p class="small">Have another go!</p>');
      } else {
        done = true; combo = 0; results[i] = 'missed';
        if (o.reveal) o.reveal();
        var p2 = JG.answer('missed', 0, true, SUBJECT); earned += p2;
        say('missed', pick(MISSED) + ' <span class="plus">+' + p2 + ' ⭐ for trying</span>', o.why ? '<p>' + o.why + '</p>' : '');
        next();
      }
      refreshHead();
    }
  };

  function next() {
    stage.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
    stage.classList.add('locked');
    var b = h('button', 'btn next', i + 1 < G.rounds ? 'Next round →' : 'See my result 🎉'); b.type = 'button';
    b.addEventListener('click', function () { i++; if (i < G.rounds) play(); else finish(); });
    fb.appendChild(b); b.focus({ preventScroll: true });
  }

  function play() {
    tries = 0; done = false;
    box.innerHTML = '';
    head = header(); box.appendChild(head);
    var talk = h('div', 'runner-mascot a-owl'); talk.innerHTML = mascotSvg;
    owlBubble = h('p', 'bubble'); talk.appendChild(owlBubble); box.appendChild(talk);
    stage = h('div', 'qcard a-stage'); box.appendChild(stage);
    fb = h('div', 'q-feedback'); fb.setAttribute('role', 'status'); box.appendChild(fb);
    G.round(i, ui, stage);
    if (i > 0) box.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  function start() { i = 0; combo = 0; firstTry = 0; earned = 0; results = []; play(); }

  function finish() {
    var r = JG.finishGame({ key: KEY, subject: SUBJECT }, firstTry, G.rounds); earned += r.points;
    var badges = JG.drain();
    box.innerHTML = '';
    var end = h('div', 'endcard');
    var msg = r.stars === 3 ? 'Amazing work!' : r.stars === 2 ? 'Great job!' : 'Well done for finishing!';
    var tip = r.stars < 3 ? '<p>Play again to earn ' + (r.stars === 2 ? 'the third star' : 'more stars') + '. Every go makes you stronger.</p>' : '';
    end.innerHTML = '<div class="end-mascot cheer">' + mascotSvg + '</div><h3>' + msg + '</h3>' +
      '<div class="big-stars" aria-label="' + r.stars + ' out of 3 stars">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= r.stars ? 'on' : '') + '" style="animation-delay:' + (k * .25) + 's"></i>'; }).join('') + '</div>' +
      '<p class="end-score">' + firstTry + ' of ' + G.rounds + ' right first time · <b>+' + earned + ' ⭐</b></p>' + tip +
      (badges.length ? '<div class="end-badges"><p><b>New badges</b></p>' + badges.map(function (b) { return '<span class="badge-pill"><span>' + b.icon + '</span>' + b.name + '</span>'; }).join('') + '</div>' : '') +
      '<p class="actions"><button class="btn" type="button" id="again">Play again</button><a class="btn ghost" href="/games/">More games</a></p>' +
      '<p class="small"><a href="/my-progress/">See all my stars and badges</a></p>';
    box.appendChild(end);
    end.querySelector('#again').addEventListener('click', start);
    JG.confetti(r.stars === 3 ? 180 : 90);
    end.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

  window.Arcade = {
    h: h,
    game: function (def) {
      G = def;
      var intro = box.querySelector('.runner-mascot .bubble');
      intro.innerHTML = def.intro + ' ' + def.rounds + ' rounds. No timer, so take your time!';
      var go = h('button', 'btn', 'Play'); go.type = 'button';
      go.addEventListener('click', start);
      box.querySelector('.runner-mascot').appendChild(go);
    }
  };
})();
