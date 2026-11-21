// Speed round: guess as many Pokémon as you can in 3 minutes. Requires data.js and pokecore.js.
(function () {
  'use strict';
  var $ = PokeCore.$, POOL = PokeCore.POOL;
  var ROUND_SECONDS = 180;
  var STAT_ROWS = [
    { id: 'Health', bar: 'HealthBar', label: 'HP', row: 'row-hp' },
    { id: 'Attack', bar: 'AttackBar', label: 'Attack', row: 'row-atk' },
    { id: 'Defense', bar: 'DefenseBar', label: 'Defense', row: 'row-def' },
    { id: 'SpecialAttack', bar: 'SpecialAttackBar', label: 'Special Attack', row: 'row-spa' },
    { id: 'SpecialDefense', bar: 'SDFBar', label: 'Special Defense', row: 'row-spd' },
    { id: 'Speed', bar: 'SPDBar', label: 'Speed', row: 'row-spe' }
  ];
  var answer = null, total = 0, left = 0, timer = null, live = false;

  function clock(s) { return Math.floor(s / 60) + ':' + ('0' + (s % 60)).slice(-2); }

  function best() { try { return parseInt(localStorage.getItem('pokeSpeedBest'), 10) || 0; } catch (e) { return 0; } }
  function saveBest(n) { try { localStorage.setItem('pokeSpeedBest', n); } catch (e) { /* storage blocked */ } }
  function showBest() { $('best').textContent = best() ? 'Best: ' + best() : ' '; }

  function show(p) {
    STAT_ROWS.forEach(function (s, i) {
      var v = p.stats[i], bar = $(s.bar);
      bar.style.visibility = 'visible';
      bar.style.width = (v * 50 / 200) + '%';
      bar.style.setProperty('--pct', (v / 255 * 100) + '%');
      $(s.id).textContent = s.label + ': ' + v;
      $(s.row).setAttribute('data-value', v);
    });
    $('Total').textContent = 'Total: ' + p.total;
  }

  function nextPokemon() {
    var pool = PokeCore.filterPool(PokeCore.readOptions());
    if (!pool.length) { $('message').textContent = 'No Pokemon match those filters.'; return false; }
    answer = PokeCore.pick(pool);
    show(answer);
    return true;
  }

  function setLive(on) {
    live = on;
    $('answer').disabled = !on;
    $('guess').disabled = !on;
  }

  function end() {
    clearInterval(timer); timer = null;
    setLive(false);
    $('Timer').textContent = '0:00';
    $('Done').textContent = 'Congratulations! Your score was ' + total + '!';
    if (total > best()) { saveBest(total); $('Done').textContent += ' New best!'; }
    showBest();
  }

  function newRound() {
    clearInterval(timer);
    total = 0; left = ROUND_SECONDS;
    $('total').textContent = 'Score: 0';
    $('Timer').textContent = clock(left);
    ['message', 'Done', 'Answered'].forEach(function (id) { $(id).textContent = ' '; });
    if (!nextPokemon()) return;
    setLive(true);
    $('answer').focus();
    timer = setInterval(function () {
      left--;
      $('Timer').textContent = clock(Math.max(left, 0));
      if (left <= 0) end();
    }, 1000);
  }

  function guess(typed) {
    typed = (typed || '').trim();
    if (!live || !typed) return;
    var hits = PokeCore.findMatches(typed);
    $('answer').value = '';
    if (!hits.length) { $('message').textContent = 'Try Again...Check Your Spelling'; return; }
    var win = hits.filter(function (i) { return POOL[i] === answer || PokeCore.sameStats(POOL[i], answer); })[0];
    if (win !== undefined) {
      total++;
      $('total').textContent = 'Score: ' + total;
      $('message').textContent = 'Correct! The Pokemon was ' + answer.name + '!';
      nextPokemon();
      return;
    }
    var g = POOL[hits[0]];
    $('message').textContent = g.gen === answer.gen ? 'Try Again...Same Generation'
      : g.gen > answer.gen ? 'Try Again...Its from an older Generation'
      : 'Try Again...Its from a newer Generation';
  }

  $('btnRound').addEventListener('click', newRound);
  $('guess').addEventListener('click', function () { guess($('answer').value); });
  $('answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') guess($('answer').value); });
  ['Generations', 'goodness', 'forms'].forEach(function (id) {
    $(id).addEventListener('change', function () { if (live) nextPokemon(); });
  });
  STAT_ROWS.forEach(function (s) { $(s.bar).style.visibility = 'hidden'; });
  showBest();
  window.Speedround = { _state: function () { return { answer: answer, total: total, left: left, live: live }; }, _tick: function (n) { left = n; } };
})();
