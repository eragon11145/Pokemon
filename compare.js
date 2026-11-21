// Stat Comparison game: pick which of two Pokémon has the higher stat.
// Requires data.js and pokecore.js.
(function () {
  'use strict';
  var $ = PokeCore.$, STATS = PokeCore.STAT_NAMES;
  var a = null, b = null, z = 0, score = 0, live = false;

  function newgame() {
    if (!live) {
      score = 0; live = true;
      $('feedback').textContent = ' ';
      $('sCore').textContent = ' ';
    }
    var sel = $('stats').value;
    z = sel === 'all' ? Math.floor(Math.random() * 6) : parseInt(sel, 10);
    var pool = PokeCore.filterPool(PokeCore.readOptions());
    if (pool.length < 2) { $('Question').textContent = 'Not enough Pokemon match those filters.'; live = false; return; }
    a = PokeCore.pick(pool);
    do { b = PokeCore.pick(pool); } while (b === a);
    $('Question').textContent = 'Which Pokemon has higher ' + STATS[z] + '?';
    $('option1').textContent = a.name;
    $('option2').textContent = b.name;
    $('choices').style.visibility = 'visible';
  }

  function lose() {
    $('feedback').textContent = 'Incorrect, ' + a.name + "'s " + STATS[z] + ' is ' + a.stats[z] +
      ', and ' + b.name + "'s " + STATS[z] + ' is ' + b.stats[z] + '.';
    $('sCore').textContent = 'Your final score was: ' + score;
    live = false;
    $('choices').style.visibility = 'hidden';
  }

  function choose(n) {
    if (!live) return;
    var va = a.stats[z], vb = b.stats[z];
    var kind = $('kindness').checked;
    var ok = (n === 1 && va > vb) || (n === 2 && vb > va) || (n === 3 && va === vb);
    if (ok) {
      score += 1;
      $('feedback').textContent = 'Correct! Next Question';
      $('sCore').textContent = 'Score: ' + score;
      newgame();
    } else if (va === vb && kind) {
      $('feedback').textContent = "Correct, they're the same and we're being nice. Next Question";
      newgame();
    } else {
      lose();
    }
  }

  $('btnNew').addEventListener('click', function () { live = false; newgame(); });
  $('option1').addEventListener('click', function () { choose(1); });
  $('option2').addEventListener('click', function () { choose(2); });
  $('option3').addEventListener('click', function () { choose(3); });
  window.CompareGame = { _state: function () { return { a: a, b: b, z: z, score: score, live: live }; } };
})();
