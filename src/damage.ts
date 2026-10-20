import { calculate, Generations, Pokemon, Move } from '@smogon/calc';

export const gen = Generations.get(9);

// Convert the stat points to the EV points the smogon library is used to
const spToEv = (sp: number) => (sp <= 0 ? 0 : 4 + 8 * (sp - 1));

export interface Build {
  species: string;
  nature: string;
  item: string;
  sp: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
}

function toPokemon(b: Build) {
  return new Pokemon(gen, b.species, {
    level: 50,
    nature: b.nature,
    item: b.item || undefined,
    evs: {
      hp: spToEv(b.sp.hp), atk: spToEv(b.sp.atk), def: spToEv(b.sp.def),
      spa: spToEv(b.sp.spa), spd: spToEv(b.sp.spd), spe: spToEv(b.sp.spe),
    },
  });
}

export function runCalc(attacker: Build, defender: Build, moveName: string) {
  const def = toPokemon(defender);
  const result = calculate(gen, toPokemon(attacker), def, new Move(gen, moveName));
  const range = result.range();
  const hp = def.maxHP();
  const pct = (n: number) => Math.floor((n * 1000) / hp) / 10;
  return {
    desc: result.desc(),
    hp,
    min: range[0],
    max: range[1],
    minPct: pct(range[0]),
    maxPct: pct(range[1]),
  };
}
export type Stats = Build['sp'];

export const speciesNames = [...gen.species].map((s) => s.name).sort();
export const moveNames = [...gen.moves].map((m) => m.name).sort();
export const itemNames = [...gen.items].map((i) => i.name).sort();
export const natureNames = [...gen.natures].map((n) => n.name).sort();