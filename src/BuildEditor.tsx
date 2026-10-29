import { useState } from 'react';
import {
  speciesNames, speciesByLabel, itemNames, natureNames, zeroSp,
  type Build, type Stats,
} from './damage';
import { speciesLabel } from './ChampionsRoster';

const STATS: (keyof Stats)[] = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
const MAX_TOTAL = 66;
const MAX_PER_STAT = 32;

interface Props {
  label: string;
  build: Build;
  onChange: (b: Build) => void;
}

export default function BuildEditor({ label, build, onChange }: Props) {
  const total = STATS.reduce((sum, s) => sum + build.sp[s], 0);

  // Text being typed. The Pokémon only changes once it matches a real name,
  // so half-typed words never reset your SP or moves.
  const [typed, setTyped] = useState<string | null>(null);

  const setSp = (stat: keyof Stats, value: number) => {
    const others = total - build.sp[stat];
    const clamped = Math.max(0, Math.min(MAX_PER_STAT, MAX_TOTAL - others, value));
    onChange({ ...build, sp: { ...build.sp, [stat]: clamped } });
  };

  const onSpeciesInput = (value: string) => {
    const species = speciesByLabel.get(value.toLowerCase());
    if (species) {
      setTyped(null);
      onChange({ ...build, species, sp: { ...zeroSp } });
    } else {
      setTyped(value);
    }
  };

  return (
    <section style={{ flex: 1 }}>
      <h2>{label}</h2>

      <input
        list="species-list"
        placeholder="Search Pokémon or form"
        value={typed ?? speciesLabel(build.species)}
        onChange={(e) => onSpeciesInput(e.target.value)}
        onBlur={() => setTyped(null)}
      />
      <datalist id="species-list">
        {speciesNames.map((n) => <option key={n} value={speciesLabel(n)} />)}
      </datalist>

      <div>
        <select value={build.nature} onChange={(e) => onChange({ ...build, nature: e.target.value })}>
          {natureNames.map((n) => <option key={n}>{n}</option>)}
        </select>
        <input
          list="item-list"
          placeholder="Item"
          value={build.item}
          onChange={(e) => onChange({ ...build, item: e.target.value })}
        />
        <datalist id="item-list">
          {itemNames.map((n) => <option key={n} value={n} />)}
        </datalist>
      </div>

      <p>Stat Points: {total} / {MAX_TOTAL}</p>
      {STATS.map((s) => (
        <label key={s} style={{ display: 'block' }}>
          {s.toUpperCase()} {build.sp[s]}
          <input
            type="range"
            min={0}
            max={MAX_PER_STAT}
            value={build.sp[s]}
            onChange={(e) => setSp(s, Number(e.target.value))}
          />
        </label>
      ))}
    </section>
  );
}