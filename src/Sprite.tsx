import { useState } from 'react';

const BASE = 'https://play.pokemonshowdown.com/sprites/dex/';

function spriteUrls(species: string): string[] {
  const toId = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/-mega-([xyz])$/, '-mega$1');
  const base = species.replace(/-Mega(-[XYZ])?$/i, '');
  const urls = [toId(species)];
  if (base !== species) urls.push(toId(base)); // fall back to the base Pokémon
  return urls.map((id) => `${BASE}${id}.png`);
}

export default function Sprite({ species }: { species: string }) {
  const urls = spriteUrls(species);
  const [state, setState] = useState({ species, attempt: 0 });
  const attempt = state.species === species ? state.attempt : 0;

  if (attempt >= urls.length) {
    return <div style={{ width: 160, height: 160, display: 'grid', placeItems: 'center', fontSize: 48 }}>?</div>;
  }
  return (
    <img
      src={urls[attempt]}
      alt={species}
      width={160}
      height={160}
      style={{ objectFit: 'contain' }}
      onError={() => setState({ species, attempt: attempt + 1 })}
    />
  );
}