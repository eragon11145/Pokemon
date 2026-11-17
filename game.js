// Guess the Pokémon by its stats — game logic.
// Requires data.js and pokecore.js to be loaded first.
(function () {
  'use strict';

  var STAT_ROWS = [
    { id: 'Health', bar: 'HealthBar', label: 'HP', row: 'row-hp' },
    { id: 'Attack', bar: 'AttackBar', label: 'Attack', row: 'row-atk' },
    { id: 'Defense', bar: 'DefenseBar', label: 'Defense', row: 'row-def' },
    { id: 'SpecialAttack', bar: 'SpecialAttackBar', label: 'Special Attack', row: 'row-spa' },
    { id: 'SpecialDefense', bar: 'SDFBar', label: 'Special Defense', row: 'row-spd' },
    { id: 'Speed', bar: 'SPDBar', label: 'Speed', row: 'row-spe' }
  ];

  var POOL = PokeCore.POOL, findMatches = PokeCore.findMatches, sameStats = PokeCore.sameStats;

  // ---- State --------------------------------------------------------------
  var answer = -1, guesses = 0, hintLen = 0, over = true, guessed = [];

  var $ = PokeCore.$;
  function setText(id, text) { $(id).textContent = text; }

  function currentPool() { return PokeCore.filterPool(PokeCore.readOptions()); }

  function renderGuesses() {
    var box = $('GuessList');
    box.textContent = '';
    guessed.forEach(function (g) {
      var span = document.createElement('span');
      span.className = 'chip ' + g.cls;
      span.textContent = g.name;
      box.appendChild(span);
      box.appendChild(document.createTextNode(' '));
    });
  }

  function renderStats(p) {
    var values = p ? p.stats : null;
    STAT_ROWS.forEach(function (s, i) {
      var v = values ? values[i] : '';
      var bar = $(s.bar);
      bar.style.visibility = p ? 'visible' : 'hidden';
      bar.style.width = p ? (v * 50 / 200) + '%' : ''; // classic scale
      bar.style.setProperty('--pct', p ? (v / 255 * 100) + '%' : '0%'); // modern scale
      setText(s.id, p ? s.label + ': ' + v : ' ');
      $(s.row).setAttribute('data-value', p ? v : '–');
    });
    setText('Total', p ? 'Total: ' + p.total : ' ');
    $('game').classList.toggle('playing', !!p);
  }

  function newGame() {
    var pool = currentPool();
    if (!pool.length) { setText('message', 'No Pokémon match those filters.'); return; }
    var p = pool[Math.floor(Math.random() * pool.length)];
    answer = POOL.indexOf(p);
    guesses = 0; hintLen = 0; over = false; guessed = [];
    renderStats(p);
    setText('message', ' ');
    setText('Hinted', ' ');
    setText('Answered', ' ');
    setText('GuessNumber', ' ');
    $('message').className = '';
    renderGuesses();
    $('answer').focus();
  }

  function feedback(text, kind) {
    var m = $('message');
    m.textContent = text;
    m.className = kind || '';
  }

  function guess(typed) {
    typed = (typed || '').trim();
    if (!typed) return;
    if (answer < 0) { feedback('Hit New Game to start!', 'info'); return; }
    if (over) { feedback('Round finished — hit New Game to play again.', 'info'); return; }

    var hits = findMatches(typed);
    $('answer').value = '';
    if (!hits.length) { feedback('Try Again...Check your spelling', 'bad'); return; }

    guesses++;
    setText('GuessNumber', 'Number of Guesses: ' + guesses);

    var target = POOL[answer];
    // exact name, or any Pokémon sharing the exact same stat line
    var win = hits.filter(function (i) { return i === answer || sameStats(POOL[i], target); })[0];
    if (win !== undefined) {
      over = true;
      guessed.push({ name: POOL[win].name, cls: 'good' });
      renderGuesses();
      if (win === answer || hits.indexOf(answer) !== -1) {
        feedback('Correct! The Pokemon was ' + target.name + '!', 'good');
      } else {
        feedback('Correct! The intended Pokemon was ' + target.name + ', but ' + POOL[win].name + ' also has the same stats!', 'good');
      }
      return;
    }

    var g = POOL[hits[0]];
    guessed.push({ name: g.name, cls: 'bad' });
    renderGuesses();
    if (g.gen === target.gen) feedback('Try Again...Same Generation', 'bad');
    else if (g.gen > target.gen) feedback('Try Again...Its from an older Generation', 'bad');
    else feedback('Try Again...Its from a newer Generation', 'bad');
  }

  function hint() {
    if (answer < 0 || over) return;
    var name = POOL[answer].name;
    if (hintLen < name.length) hintLen++;
    setText('Hinted', 'Hint: ' + name.slice(0, hintLen));
  }

  function showAnswer() {
    if (answer < 0) return;
    over = true;
    setText('Answered', 'Answer: ' + POOL[answer].name);
  }

  // ---- Wire up ------------------------------------------------------------
  $('btnNew').addEventListener('click', newGame);
  $('btnGo').addEventListener('click', function () { guess($('answer').value); });
  $('btnHint').addEventListener('click', hint);
  $('btnAnswer').addEventListener('click', showAnswer);
  $('answer').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') guess($('answer').value);
  });
  ['Generations', 'goodness', 'forms'].forEach(function (id) {
    var el = $(id);
    if (el) el.addEventListener('change', function () {
      if (answer >= 0) newGame();
    });
  });
  renderStats(null);

  // Handy for debugging / tests
  window.PokeGame = { POOL: POOL, findMatches: findMatches, newGame: newGame, guess: guess,
    _state: function () { return { answer: answer, over: over, guesses: guesses }; },
    _setAnswer: function (i) { answer = i; over = false; renderStats(POOL[i]); } };
})();
