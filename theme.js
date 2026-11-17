// Style switcher: "modern" (modern.css) or "classic" (the original style.css).
// Load this in <head>, right after <link id="theme-css">, so there is no flash of the wrong style.
(function () {
  var KEY = 'pokeTheme';
  var FILES = { modern: 'modern.css', classic: 'style.css' };
  var current = 'modern';

  try { if (localStorage.getItem(KEY) === 'classic') current = 'classic'; } catch (e) { /* storage blocked */ }

  function apply() {
    var link = document.getElementById('theme-css');
    if (link) link.setAttribute('href', FILES[current]);
    document.documentElement.setAttribute('data-theme', current);
    var btn = document.getElementById('themeToggle');
    if (btn) {
      btn.textContent = current === 'modern' ? 'Switch to classic style' : 'Switch to modern style';
      btn.setAttribute('aria-pressed', current === 'classic' ? 'true' : 'false');
    }
  }

  apply();

  document.addEventListener('DOMContentLoaded', function () {
    apply();
    var btn = document.getElementById('themeToggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      current = current === 'modern' ? 'classic' : 'modern';
      try { localStorage.setItem(KEY, current); } catch (e) { /* still switches for this visit */ }
      apply();
    });
  });
})();
