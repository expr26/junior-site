/* /my-progress/: level, streak, last 7 days, badges and stars per unit, all from window.JG (this browser only). */
(function () {
  function run() {
    if (!window.JG) return;
    var S = JG.state(), L = JG.level(S.xp), t = JG.today();
    var streak = S.last && JG.dayDiff(S.last, t) <= 1 ? S.streak : 0;
    var todayXp = S.days[t] || 0, goalPct = Math.min(100, Math.round(100 * todayXp / JG.DAILY_GOAL));
    var week = [];
    for (var k = 6; k >= 0; k--) { var d = new Date(); d.setDate(d.getDate() - k); var key = JG.today(d);
      week.push({ day: d.toLocaleDateString('en-GB', { weekday: 'short' }), xp: S.days[key] || 0 }); }
    var max = Math.max.apply(null, week.map(function (w) { return w.xp; }).concat([JG.DAILY_GOAL]));
    document.getElementById('me').innerHTML =
      '<div class="card stat level-card"><p class="stat-k">Level ' + L.n + '</p><p class="stat-v">' + L.title + '</p>' +
        '<div class="meter" role="img" aria-label="' + L.pct + '% of the way to the next level"><span style="width:' + L.pct + '%"></span></div>' +
        '<p class="small">' + (L.to ? (L.to - S.xp) + ' more stars to level ' + (L.n + 1) : 'Top level reached!') + '</p></div>' +
      '<div class="card stat"><p class="stat-k">Stars</p><p class="stat-v">⭐ ' + S.xp + '</p><p class="small">' + S.answered + ' questions answered, ' + S.fixed + ' mistakes fixed</p></div>' +
      '<div class="card stat"><p class="stat-k">Day streak</p><p class="stat-v">🔥 ' + streak + '</p><p class="small">Best: ' + S.best + ' days</p></div>' +
      '<div class="card stat"><p class="stat-k">Today\'s goal</p><div class="ring" style="--p:' + goalPct + '"><span>' + todayXp + '/' + JG.DAILY_GOAL + '</span></div></div>' +
      '<div class="card stat week"><p class="stat-k">Last 7 days</p><div class="week-bars">' + week.map(function (w) {
        return '<div><span style="height:' + Math.round(100 * w.xp / max) + '%" title="' + w.xp + ' stars"></span><small>' + w.day + '</small></div>'; }).join('') + '</div></div>';
    document.getElementById('me-badges').innerHTML = JG.BADGES.map(function (b) {
      var got = S.badges[b.id];
      return '<div class="badge' + (got ? ' got' : '') + '"><span class="b-icon">' + (got ? b.icon : '🔒') + '</span><b>' + b.name + '</b><small>' + b.desc + '</small></div>';
    }).join('');
    fetch('/static/topics.json').then(function (r) { return r.json(); }).then(function (topics) {
      document.getElementById('me-topics').innerHTML = topics.map(function (tp) {
        var got = 0, rows = tp.units.map(function (u) {
          var s = S.units[tp.slug + '/' + u.slug], n = s ? s.stars : 0; got += n;
          return '<li><a href="' + u.href + '">' + u.title + '</a><span class="stars">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= n ? 'on' : '') + '"></i>'; }).join('') + '</span></li>';
        }).join('');
        return '<div class="card"><span class="' + (tp.subject === 'maths' ? 'tag' : 'tag sci') + '">' + (tp.subject === 'maths' ? 'Maths' : 'Science') + '</span>' +
          '<h3><a href="' + tp.href + '">' + tp.title + '</a></h3><p class="small">' + got + ' of ' + tp.units.length * 3 + ' stars</p><ul class="unit-stars">' + rows + '</ul></div>';
      }).join('');
    }).catch(function () {});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
})();
