import './HealthBar.css';

function barColor(pct: number) {
  if (pct > 50) return 'var(--hp-green)';
  if (pct > 20) return 'var(--hp-yellow)';
  return 'var(--hp-red)';
}

interface Props {
  hp: number;
  minDmg: number;
  maxDmg: number;
  minPct: number;
  maxPct: number;
}

export default function HealthBar({ hp, minDmg, maxDmg, minPct, maxPct }: Props) {
  // Remaining HP % after the strongest roll (low) and the weakest roll (high)
  const low = Math.max(0, 100 - maxPct);
  const high = Math.max(0, 100 - minPct);

  return (
    <div className="hp">
      <span className="hp-label">HP</span>
      <div className="hp-track">
        <div className="hp-fill" style={{ width: `${low}%`, background: barColor(low) }} />
        <div
          className="hp-range"
          style={{ left: `${low}%`, width: `${high - low}%`, background: barColor(high) }}
        />
      </div>
      <span className="hp-text">
        {Math.max(0, hp - maxDmg)}-{Math.max(0, hp - minDmg)} / {hp}
      </span>
    </div>
  );
}