/* Lessons form: sends how long the form was open (bots submit instantly), then sends with fetch so the parent stays on the page.
   Without JavaScript the form still posts normally and the server redirects to /lessons/thanks/. */
(function () {
  var f = document.getElementById('inquiry');
  if (!f) return;
  var opened = Date.now();
  try { f.source.value = sessionStorage.getItem('js-src') || ''; } catch (e) {}
  var msg = f.querySelector('.form-msg');
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    f.ts.value = String(Date.now() - opened);   // milliseconds the form was open, measured on this device
    if (!f.querySelector('input[name=subjects]:checked')) { msg.textContent = 'Please choose at least one subject.'; return; }
    var btn = f.querySelector('button[type=submit]');
    btn.disabled = true; msg.textContent = 'Sending…';
    fetch(f.action, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
      .then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok) {
          location.href = '/lessons/thanks/';
        } else { msg.textContent = res.j.error || 'Something went wrong. Please try again.'; btn.disabled = false; }
      })
      .catch(function () { msg.textContent = 'No connection. Please try again.'; btn.disabled = false; });
  });
})();
