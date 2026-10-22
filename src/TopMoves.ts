// Most-used moves per Pokémon, keyed by the calculator's species name.
// Example (format only, fill with real usage data):
//   Garchomp: ['Earthquake', 'Dragon Claw', 'Protect', 'Rock Slide'],
const topMoves: Record<string, string[]> = {};

export function topMovesFor(species: string): string[] {
  const base = species.replace(/-Mega(-[XYZ])?$/i, '');
  return topMoves[species] ?? topMoves[base] ?? [];
}