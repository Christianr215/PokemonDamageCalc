import { speciesNames, itemNames, natureNames, type Build, type Stats } from './damage';

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

  const setSp = (stat: keyof Stats, value: number) => {
    const others = total - build.sp[stat];
    const clamped = Math.max(0, Math.min(MAX_PER_STAT, MAX_TOTAL - others, value));
    onChange({ ...build, sp: { ...build.sp, [stat]: clamped } });
  };

  return (
    <section style={{ flex: 1 }}>
      <h2>{label}</h2>

      <input
        list="species-list"
        value={build.species}
        onChange={(e) => onChange({ ...build, species: e.target.value })}
      />
      <datalist id="species-list">
        {speciesNames.map((n) => <option key={n} value={n} />)}
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