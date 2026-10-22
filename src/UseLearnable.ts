import { useEffect, useState } from 'react';
import { learnableMoves } from './LearnedMoves';

export function useLearnable(species: string) {
  const [moves, setMoves] = useState<string[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    learnableMoves(species).then((m) => {
      if (!cancelled) setMoves(m);
    });
    return () => {
      cancelled = true;
    };
  }, [species]);

  return moves;
}