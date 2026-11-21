// Stat math shared by the calculators and the damage game.
var PokeCalc = (function () {
  'use strict';
  // nature -> [boosted stat, lowered stat] using indexes 1..5 = Atk, Def, SpA, SpD, Spe (null = neutral)
  var NATURES = {
    Adamant: [1, 3], Lonely: [1, 2], Naughty: [1, 4], Brave: [1, 5],
    Bold: [2, 1], Impish: [2, 3], Lax: [2, 4], Relaxed: [2, 5],
    Modest: [3, 1], Mild: [3, 2], Rash: [3, 4], Quiet: [3, 5],
    Calm: [4, 1], Gentle: [4, 2], Careful: [4, 3], Sassy: [4, 5],
    Timid: [5, 1], Hasty: [5, 2], Jolly: [5, 3], Naive: [5, 4],
    Docile: null, Serious: null, Hardy: null, Bashful: null, Quirky: null
  };

  function natureMult(nature, statIndex) {
    var n = NATURES[nature];
    if (!n || statIndex === 0) return [1, 1];
    if (n[0] === statIndex) return [11, 10];
    if (n[1] === statIndex) return [9, 10];
    return [1, 1];
  }

  // statIndex: 0 HP, 1 Atk, 2 Def, 3 SpA, 4 SpD, 5 Spe
  function stat(base, iv, ev, level, nature, statIndex) {
    var core = Math.floor((2 * base + iv + Math.floor(ev / 4)) * level / 100);
    if (statIndex === 0) return base === 1 ? 1 : core + level + 10; // Shedinja
    var m = natureMult(nature, statIndex);
    return Math.floor((core + 5) * m[0] / m[1]);
  }

  // Every IV (0-31) that produces `value`; empty if the value is impossible.
  function possibleIVs(base, value, ev, level, nature, statIndex) {
    var ivs = [];
    for (var iv = 0; iv <= 31; iv++) {
      if (stat(base, iv, ev, level, nature, statIndex) === value) ivs.push(iv);
    }
    return ivs;
  }

  return { NATURES: NATURES, stat: stat, possibleIVs: possibleIVs };
})();
