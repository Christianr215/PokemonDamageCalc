import { useState } from 'react';
import { runCalc, moveNames, type Build } from './damage';
import BuildEditor from './BuildEditor';
import HealthBar from './HealthBar';
import Sprite from './Sprite';

const zero = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

function safeCalc(attacker: Build, defender: Build, move: string) {
  try {
    return runCalc(attacker, defender, move);
  } catch {
    return null; // happens while a name is half-typed
  }
}

interface SideProps {
  label: string;
  build: Build;
  onBuild: (b: Build) => void;
  move: string;
  onMove: (m: string) => void;
  incoming: ReturnType<typeof safeCalc>;
}

function Side({ label, build, onBuild, move, onMove, incoming }: SideProps) {
  return (
    <div style={{ flex: 1 }}>
      <Sprite species={build.species} />
      {incoming ? (
        <>
          <HealthBar
            hp={incoming.hp}
            minDmg={incoming.min}
            maxDmg={incoming.max}
            minPct={incoming.minPct}
            maxPct={incoming.maxPct}
          />
          <p style={{ fontSize: 13 }}>{incoming.desc}</p>
        </>
      ) : (
        <p>Pick a valid Pokémon, move, and item to see a result.</p>
      )}
      <BuildEditor label={label} build={build} onChange={onBuild} />
      <p>
        {label}'s move:{' '}
        <input list="move-list" value={move} onChange={(e) => onMove(e.target.value)} />
      </p>
    </div>
  );
}

export default function App() {
  const [a, setA] = useState<Build>({
    species: 'Rillaboom', nature: 'Adamant', item: 'Miracle Seed', sp: { ...zero, atk: 32, hp: 2 },
  });
  const [b, setB] = useState<Build>({
    species: 'Sneasler', nature: 'Adamant', item: '', sp: { ...zero, atk: 32, hp: 2 },
  });
  const [moveA, setMoveA] = useState('Grassy Glide');
  const [moveB, setMoveB] = useState('Close Combat');

  const damageToB = safeCalc(a, b, moveA); // A's move hits B
  const damageToA = safeCalc(b, a, moveB); // B's move hits A

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Champions Damage Calc</h1>
      <div style={{ display: 'flex', gap: 32 }}>
        <Side label="Pokémon A" build={a} onBuild={setA} move={moveA} onMove={setMoveA} incoming={damageToA} />
        <Side label="Pokémon B" build={b} onBuild={setB} move={moveB} onMove={setMoveB} incoming={damageToB} />
      </div>
      <datalist id="move-list">
        {moveNames.map((n) => <option key={n} value={n} />)}
      </datalist>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Unofficial fan project. Pokémon and related names and images are property of Nintendo, Game Freak, and The Pokémon Company.
      </p>
    </main>
  );
}