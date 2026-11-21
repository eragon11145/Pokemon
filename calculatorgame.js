// Damage-guessing game: estimate the % of HP an attack removes. Requires data.js, pokecore.js, types.js, moves.js, calc.js.
(function () {
  'use strict';
  var $ = PokeCore.$;
  var state = null, guesses = 0, over = true;

  function rnd(n) { return Math.floor(Math.random() * n); }

  function typeMult(moveType, types) {
    var row = TYPE_CHART[TYPE_ORDER.indexOf(moveType)], m = 1;
    (types || []).forEach(function (t) {
      var col = TYPE_ORDER.indexOf(t);
      if (col >= 0) m *= row[col];
    });
    return m;
  }

  function build() {
    var pool = PokeCore.filterPool(PokeCore.readOptions()).filter(function (p) { return p.types; });
    var chaos = $('chaos').checked;
    var atker = PokeCore.pick(pool), defer = PokeCore.pick(pool);
    var m, mult;
    do { m = rnd(MOVES.names.length); mult = typeMult(MOVES.types[m], defer.types); } while (mult === 0);
    var special = MOVES.categories[m] === 'Special';

    var lv1 = chaos ? 1 + rnd(100) : 100, lv2 = chaos ? 1 + rnd(100) : 100;
    var aIV = chaos ? rnd(32) : 31, aEV = chaos ? rnd(253) : 252;
    var hpIV = chaos ? rnd(32) : 31, dIV = chaos ? rnd(32) : 31;
    var hpEV = chaos ? rnd(253) : 0, dEV = chaos ? rnd(253) : 0;

    var aIdx = special ? 3 : 1, dIdx = special ? 4 : 2;
    var A = PokeCalc.stat(atker.stats[aIdx], aIV, aEV, lv1, 'Hardy', aIdx);
    var D = PokeCalc.stat(defer.stats[dIdx], dIV, dEV, lv2, 'Hardy', dIdx);
    var HP = PokeCalc.stat(defer.stats[0], hpIV, hpEV, lv2, 'Hardy', 0);

    var stab = atker.types.indexOf(MOVES.types[m]) !== -1;
    var factor = mult * (stab ? 1.5 : 1);
    var base = (((2 * lv1 / 5) + 2) * MOVES.powers[m] * (A / D)) / 50 + 2;
    var lower = Math.floor(0.85 * base * factor) / HP * 100;
    var upper = Math.floor(base * factor) / HP * 100;

    var atkLabel = special ? 'Special Attack' : 'Attack', defLabel = special ? 'SpDef' : 'Def';
    var q = 'What is the damage taken by a ' + (chaos ? 'Level ' + lv2 + ' ' : '') + hpEV + ' HP' +
      (chaos ? ' ' + hpIV + ' IVs' : '') + ' / ' + dEV + ' ' + defLabel + (chaos ? ' ' + dIV + ' IVs' : '') + ' ' + defer.name +
      ' from a ' + (chaos ? 'Level ' + lv1 + ' ' + aIV + ' IV ' : '') + aEV + ' ' + atkLabel + ' ' + atker.name + ' ' + MOVES.names[m] + '?';
    return { atker: atker, defer: defer, m: m, A: A, D: D, HP: HP, lower: lower, upper: upper, mult: mult, stab: stab,
      question: q, attackerText: atker.name + ' Raw ' + atkLabel + ' ' + A + '.',
      defenderText: defer.name + ' Raw HP ' + HP + '. Raw ' + (special ? 'Special Defense ' : 'Defense ') + D + '.' };
  }

  function newGame() {
    var pool = PokeCore.filterPool(PokeCore.readOptions()).filter(function (p) { return p.types; });
    if (!pool.length) { $('message').textContent = 'No Pokemon match those filters.'; return; }
    state = build(); guesses = 0; over = false;
    $('Attacker').textContent = state.attackerText;
    $('Defender').textContent = state.defenderText;
    $('Damagee').textContent = state.question;
    ['message', 'GuessNumber', 'Hinted', 'Answered'].forEach(function (id) { $(id).textContent = ' '; });
    $('message').className = '';
    $('guessButtons').style.visibility = 'visible';
    $('answer').value = '';
    $('answer').focus();
  }

  function guess(value) {
    if (!state) { $('message').textContent = 'Hit New Game to start!'; $('message').className = 'info'; return; }
    if (over) { $('message').textContent = 'Round finished — hit New Game to play again.'; $('message').className = 'info'; return; }
    var damage = parseInt(String(value).replace(/\D/g, ''), 10);
    if (isNaN(damage)) return;
    guesses++;
    $('GuessNumber').textContent = 'Number of Guesses: ' + guesses;
    if (damage > state.lower - 0.7 && damage < state.upper + 0.7) {
      over = true;
      $('message').textContent = 'Correct! The damage range was between ' + state.lower.toFixed(2) + ' and ' + state.upper.toFixed(2) + '%!';
      $('message').className = 'good';
    } else {
      $('message').textContent = 'Incorrect, your guess is not in the damage range.';
      $('message').className = 'bad';
    }
    $('answer').value = '';
  }

  function hint() {
    if (!state || over) return;
    var eff = state.mult > 1 ? 'super effective' : state.mult < 1 ? 'not very effective' : 'neutral';
    $('Hinted').textContent = 'Hint: ' + MOVES.names[state.m] + ' (' + MOVES.types[state.m] + ', power ' + MOVES.powers[state.m] +
      ') is ' + eff + (state.mult !== 1 ? ' (×' + state.mult + ')' : '') + (state.stab ? ' and gets STAB' : ' with no STAB') + '.';
  }

  function showAnswer() {
    if (!state) return;
    over = true;
    $('Answered').textContent = 'Answer: ' + state.lower.toFixed(2) + '% to ' + state.upper.toFixed(2) + '%';
  }

  $('btnNew').addEventListener('click', newGame);
  $('btnGo').addEventListener('click', function () { guess($('answer').value); });
  $('btnHint').addEventListener('click', hint);
  $('btnAnswer').addEventListener('click', showAnswer);
  $('answer').addEventListener('keydown', function (e) { if (e.key === 'Enter') guess($('answer').value); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-pct]'), function (b) {
    b.addEventListener('click', function () { guess(b.getAttribute('data-pct')); });
  });
  window.DamageGame = { _state: function () { return state; } };
})();
