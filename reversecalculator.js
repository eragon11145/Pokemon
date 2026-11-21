// IV Calculator: final stat values -> the IVs that could have produced them. Requires data.js, pokecore.js, calc.js.
(function () {
  'use strict';
  var $ = PokeCore.$, POOL = PokeCore.POOL;
  var IDS = ['Health', 'Attack', 'Defense', 'SpecialAttack', 'SpecialDefense', 'Speed'];

  function describe(ivs) {
    if (!ivs.length) return 'impossible';
    if (ivs.length === 1) return String(ivs[0]);
    return ivs[0] + '–' + ivs[ivs.length - 1];
  }

  function calculate() {
    var hits = PokeCore.findMatches($('answer').value);
    if (!hits.length) { $('message').textContent = 'Pokemon not recognized — check your spelling.'; return; }
    var p = POOL[hits[0]];
    var level = Math.min(100, Math.max(1, parseInt($('Level').value, 10) || 100));
    var nature = $('Nature').value, impossible = false;
    $('Pokemon').textContent = p.name + ' (Level ' + level + ', ' + nature + ')';
    IDS.forEach(function (id, i) {
      $(id).textContent = p.stats[i];
      var value = parseInt($(id + '2').value, 10);
      if (isNaN(value)) { $(id + '3').textContent = '–'; return; }
      var ev = Math.min(252, Math.max(0, parseInt($(id + '1').value, 10) || 0));
      var ivs = PokeCalc.possibleIVs(p.stats[i], value, ev, level, nature, i);
      if (!ivs.length) impossible = true;
      $(id + '3').textContent = describe(ivs);
    });
    $('Total').textContent = p.total;
    $('message').textContent = impossible
      ? 'Some stats are impossible — double-check the level, nature and EVs.'
      : 'IVs shown as a single number, or the range of IVs that give the same stat value (lowest first).';
  }

  $('guess').addEventListener('click', calculate);
  $('answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') calculate(); });
})();
