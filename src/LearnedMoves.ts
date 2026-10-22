import { Dex } from '@pkmn/dex';
import { Generations as PkmnGenerations } from '@pkmn/data';
import { moveNames } from './damage';

const pkmnGen = new PkmnGenerations(Dex).get(9);
const toId = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

// Only keep moves the damage calculator also knows, using its spelling
const calcMoves = new Map<string, string>(
  moveNames.map((n): [string, string] => [toId(n), n]),
);
const cache = new Map<string, string[] | null>();

// Mega forms use their base Pokémon's learnset
const baseForm = (species: string) => species.replace(/-Mega(-[XYZ])?$/i, '');

export async function learnableMoves(species: string): Promise<string[] | null> {
  const key = toId(baseForm(species));
  if (cache.has(key)) return cache.get(key)!;

  let result: string[] | null = null;
  try {
    const learnable = await pkmnGen.learnsets.learnable(key);
    if (learnable) {
      result = Object.keys(learnable)
        .map((id) => calcMoves.get(id))
        .filter((n): n is string => !!n)
        .sort();
    }
  } catch {
    result = null; // unknown or half-typed name
  }
  cache.set(key, result);
  return result;
}