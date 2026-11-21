// Stat Calculator: base stats + EVs + IVs + nature + level -> final stats. Requires data.js, pokecore.js, calc.js.
(function () {
  'use strict';
  var $ = PokeCore.$, POOL = PokeCore.POOL;
  var IDS = ['Health', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'];

  function num(id, fallback, lo, hi) {
    var v = parseInt($(id).value, 10);
    if (isNaN(v)) return fallback;
    return Math.min(hi, Math.max(lo, v));
  }

  function calculate() {
    var hits = PokeCore.findMatches($('answer').value);
    if (!hits.length) { $('message').textContent = 'Pokemon not recognized — check your spelling.'; return; }
    var p = POOL[hits[0]];
    var level = num('Level', 100, 1, 100), nature = $('Nature').value;
    $('message').textContent = ' ';
    $('Pokemon').textContent = p.name + ' (Level ' + level + ', ' + nature + ')';
    IDS.forEach(function (id, i) {
      var ev = num(id + '1', 0, 0, 252), iv = num(id + '2', 31, 0, 31);
      $(id).textContent = p.stats[i];
      $(id + '3').textContent = PokeCalc.stat(p.stats[i], iv, ev, level, nature, i);
    });
    $('Total').textContent = p.total;
  }

  $('guess').addEventListener('click', calculate);
  $('answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') calculate(); });
})();
