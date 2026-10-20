import { useState } from 'react';

function spriteUrl(species: string) {
  const id = species
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')
    .replace('-mega-z', '-megaz');
  return `https://play.pokemonshowdown.com/sprites/dex/${id}.png`;
}

export default function Sprite({ species }: { species: string }) {
  const [failed, setFailed] = useState<string | null>(null);

  if (failed === species) {
    return <div style={{ width: 160, height: 160, display: 'grid', placeItems: 'center', fontSize: 48 }}>?</div>;
  }
  return (
    <img
      src={spriteUrl(species)}
      alt={species}
      width={160}
      height={160}
      style={{ objectFit: 'contain' }}
      onError={() => setFailed(species)}
    />
  );
}