const { calculate, Generations, Pokemon, Move } = require('@smogon/calc');

const gen = Generations.get(9);

// Run test file on specific interaction with specific stat points (SP) to see if calculation is correct
const spToEv = (sp) => (sp === 0 ? 0 : 4 + 8 * (sp - 1));

const attacker = new Pokemon(gen, 'Rillaboom', {
  level: 50,
  nature: 'Adamant',
  item: 'Miracle Seed',
  evs: { atk: spToEv(32) },
});

const defender = new Pokemon(gen, 'Sneasler', {
  level: 50,
  evs: { hp: spToEv(2) },
});

const result = calculate(gen, attacker, defender, new Move(gen, 'Grassy Glide'));
console.log(result.desc());
console.log(result.range());