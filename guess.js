// "Name a Pokémon with this stat" game. Requires data.js and pokecore.js.
(function () {
  'use strict';
  var $ = PokeCore.$, STATS = PokeCore.STAT_NAMES, POOL = PokeCore.POOL;
  var z = 0, number = 0, answers = [], guesses = 0, over = true, started = false;

  function newgame() {
    var sel = $('stats').value;
    z = sel === 'all' ? Math.floor(Math.random() * 6) : parseInt(sel, 10);
    var min = $('goodness').checked ? 100 : 50;
    number = min + Math.floor(Math.random() * (150 - min));
    answers = POOL.filter(function (p) { return p.stats[z] === number; });
    guesses = 0; over = false; started = true;
    $('Question').textContent = 'Name a Pokemon with a ' + STATS[z] + ' stat of ' + number + '.';
    var bar = $('HealthBar');
    bar.style.visibility = 'visible';
    bar.style.width = (number * 50 / 200) + '%';          // classic scale
    bar.style.setProperty('--pct', (number / 255 * 100) + '%'); // modern scale
    $('Health').textContent = STATS[z] + ': ' + number;
    $('row-hp').setAttribute('data-label', STATS[z]);
    $('row-hp').setAttribute('data-value', number);
    ['message', 'GuessNumber', 'Hinted', 'Answered'].forEach(function (id) { $(id).textContent = ' '; });
    $('message').className = '';
    $('answer').focus();
  }

  function say(text, kind) { $('message').textContent = text; $('message').className = kind || ''; }

  function guess(typed) {
    typed = (typed || '').trim();
    if (!typed) return;
    if (!started) { say('Hit New Game to start!', 'info'); return; }
    if (over) { say('Round finished — hit New Game to play again.', 'info'); return; }
    var hits = PokeCore.findMatches(typed);
    $('answer').value = '';
    if (!hits.length) { say('Check your spelling — that Pokemon was not recognized.', 'bad'); return; }
    guesses++;
    $('GuessNumber').textContent = 'Number of Guesses: ' + guesses;
    var p = POOL[hits.filter(function (i) { return POOL[i].stats[z] === number; })[0] || hits[0]];
    if (p.stats[z] === number) { over = true; say('Correct! ' + p.name + ' has the correct ' + STATS[z] + '!', 'good'); }
    else say('Incorrect, ' + p.name + ' is not a match :(  (its ' + STATS[z] + ' is ' + p.stats[z] + ')', 'bad');
  }

  function nomatch() {
    if (!started || over) return;
    guesses++;
    $('GuessNumber').textContent = 'Number of Guesses: ' + guesses;
    if (!answers.length) { over = true; say('Correct! There was no valid match!', 'good'); }
    else say('Incorrect, there is a solution...', 'bad');
  }

  function hint() {
    if (!started) return;
    $('Hinted').textContent = answers.length
      ? 'Hint: ' + answers.map(function (p) { return 'Gen ' + p.gen; }).join(', ')
      : 'Hint: there may be no match at all';
  }

  function showAnswer() {
    if (!started) return;
    over = true;
    $('Answered').textContent = 'Answer: ' + (answers.length ? answers.map(function (p) { return p.name; }).join(', ') : 'no Pokemon has this stat');
  }

  $('btnNew').addEventListener('click', newgame);
  $('btnGo').addEventListener('click', function () { guess($('answer').value); });
  $('btnNone').addEventListener('click', nomatch);
  $('btnHint').addEventListener('click', hint);
  $('btnAnswer').addEventListener('click', showAnswer);
  $('answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') guess($('answer').value); });
  window.GuessGame = { _state: function () { return { z: z, number: number, answers: answers }; } };
})();
