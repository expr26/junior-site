/* Remembers where this visit came from (?utm_source=..., else the referring site) for the lessons form, then removes the
   tracking parameters from the address bar. Kept only for this browser tab (sessionStorage); nothing is sent anywhere. */
(function () {
  try {
    if (sessionStorage.getItem('js-src')) return;
    var u = new URL(location.href), s = u.searchParams.get('utm_source');
    if (!s && document.referrer) { var r = new URL(document.referrer); if (r.hostname !== location.hostname) s = r.hostname; }
    sessionStorage.setItem('js-src', (s || 'direct').slice(0, 60));
    if (u.searchParams.has('utm_source')) {
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (k) { u.searchParams.delete(k); });
      history.replaceState(null, '', u.pathname + (u.search || '') + u.hash);
    }
  } catch (e) {}
})();
