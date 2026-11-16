(function () {
  var doc = document;

  // ---- 3D-эмблема: плоский знак собирается из слоёв по глубине, получается объём; вращает CSS
  doc.querySelectorAll('[data-emblem]').forEach(function (el) {
    var spin = el.querySelector('.emb__spin'), front = spin && spin.querySelector('img');
    if (!front) return;
    var n = Math.max(3, +el.getAttribute('data-layers') || 9);
    var d = parseFloat(el.getAttribute('data-depth')) || 24;
    front.style.transform = 'translateZ(' + (d / 2) + 'px)';
    for (var i = 0; i < n - 1; i++) {
      var t = i / (n - 1);
      var c = front.cloneNode(false);
      c.style.transform = 'translateZ(' + (-d / 2 + d * t).toFixed(2) + 'px)';
      c.style.filter = 'brightness(' + (0.42 + 0.3 * t).toFixed(2) + ') saturate(1.15)';
      spin.insertBefore(c, front);
    }
  });

  // ---- карта Яндекса: грузим при подходе к блоку, при неудаче остаётся запасной блок со ссылками
  var map = doc.getElementById('map'), frame = doc.getElementById('mapFrame'), loaded = false;
  function loadMap() {
    if (loaded || !map) return; loaded = true;
    var t = setTimeout(function () { map.classList.add('is-failed'); }, 9000);
    frame.addEventListener('load', function () { clearTimeout(t); map.classList.add('is-ok'); });
    frame.addEventListener('error', function () { clearTimeout(t); });
    if (!navigator.onLine) { clearTimeout(t); return; }
    frame.src = frame.getAttribute('data-src');
  }
  if (map) {
    if ('IntersectionObserver' in window) {
      var mo = new IntersectionObserver(function (es) { if (es[0].isIntersecting) { loadMap(); mo.disconnect(); } }, { rootMargin: '300px' });
      mo.observe(map);
    } else loadMap();
  }

  // ---- ВКонтакте не принимает готовый текст по ссылке: копируем сообщение и открываем профиль
  doc.addEventListener('click', function (e) {
    var a = e.target.closest('[data-vk]'); if (!a) return;
    var b = doc.querySelector('[data-s-bubble]');
    try { if (b && navigator.clipboard) navigator.clipboard.writeText(b.textContent); } catch (_) {}
    var n = doc.querySelector('[data-s-copied]');
    if (n) { n.hidden = false; setTimeout(function () { n.hidden = true; }, 4000); }
  });
})();
