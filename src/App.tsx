import { useEffect, useRef, useState } from 'react';
import { runCalc, moveNames, zeroSp, type Build } from './damage';
import BuildEditor from './BuildEditor';
import HealthBar from './HealthBar';
import Sprite from './Sprite';
import { useLearnable } from './UseLearnable';
import { topMovesFor } from './TopMoves';

type CalcResult = ReturnType<typeof runCalc> | null;

function safeCalc(attacker: Build, defender: Build, move: string): CalcResult {
  try {
    return runCalc(attacker, defender, move);
  } catch {
    return null; // half-typed name or empty move
  }
}

const EMPTY_SLOTS = ['', '', '', ''];

interface SideProps {
  id: string;
  label: string;
  build: Build;
  onBuild: (b: Build) => void;
  slots: string[];
  onSlots: (s: string[]) => void;
  selected: number;
  onSelect: (i: number) => void;
  incoming: CalcResult;   // damage this Pokémon takes (drives its bar)
  outgoing: CalcResult[]; // damage each of its own moves deals
}

function Side({ id, label, build, onBuild, slots, onSlots, selected, onSelect, incoming, outgoing }: SideProps) {
  const moves = useLearnable(build.species);

  const latest = useRef({ species: build.species, slots });
  useEffect(() => {
    latest.current = { species: build.species, slots };
  });

  // Runs when the learnable list changes (the Pokémon changed)
  useEffect(() => {
    if (!moves) return;
    const { species, slots: current } = latest.current;
    const has = (m: string) => moves.some((x) => x.toLowerCase() === m.toLowerCase());

    const top = topMovesFor(species).filter(has).slice(0, 4);
    if (top.length > 0) {
      onSlots([...top, ...EMPTY_SLOTS].slice(0, 4));
      onSelect(0);
      return;
    }
    // No usage data: keep moves that are still learnable, clear the rest
    const cleaned = current.map((m) => (m && !has(m) ? '' : m));
    if (cleaned.some((m, i) => m !== current[i])) onSlots(cleaned);
  }, [moves, onSlots, onSelect]);

  const listId = `moves-${id}`;

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
        <p>Pick a valid Pokémon and a move on the other side to see damage here.</p>
      )}

      <BuildEditor label={label} build={build} onChange={onBuild} />

      <h3>{label}'s moves</h3>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Click a move to show its damage on the opponent's bar. Edit the name to swap it.
      </p>
      {slots.map((m, i) => {
        const r = outgoing[i];
        return (
          <div
            key={i}
            onClick={() => onSelect(i)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: 6,
              marginBottom: 6,
              border: i === selected ? '2px solid #3b82f6' : '2px solid #ccc',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            <input
              list={listId}
              placeholder={`Move ${i + 1}`}
              value={m}
              onChange={(e) => onSlots(slots.map((x, j) => (j === i ? e.target.value : x)))}
              style={{ flex: 1 }}
            />
            <span style={{ fontSize: 12, minWidth: 110, textAlign: 'right' }}>
              {r ? `${r.minPct}-${r.maxPct}%` : '—'}
            </span>
          </div>
        );
      })}
      <datalist id={listId}>
        {(moves ?? moveNames).map((n) => (
          <option key={n} value={n} />
        ))}
      </datalist>
    </div>
  );
}

export default function App() {
  const [a, setA] = useState<Build>({
    species: 'Rillaboom', nature: 'Adamant', item: 'Miracle Seed', sp: { ...zeroSp },
  });
  const [b, setB] = useState<Build>({
    species: 'Sneasler', nature: 'Adamant', item: '', sp: { ...zeroSp },
  });
  const [slotsA, setSlotsA] = useState(['Grassy Glide', '', '', '']);
  const [slotsB, setSlotsB] = useState(['Close Combat', '', '', '']);
  const [selA, setSelA] = useState(0);
  const [selB, setSelB] = useState(0);

  const outA = slotsA.map((m) => (m ? safeCalc(a, b, m) : null)); // A's moves hit B
  const outB = slotsB.map((m) => (m ? safeCalc(b, a, m) : null)); // B's moves hit A

  return (
    <main style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Champions Damage Calc</h1>
      <div style={{ display: 'flex', gap: 32 }}>
        <Side
          id="a" label="Pokémon A" build={a} onBuild={setA}
          slots={slotsA} onSlots={setSlotsA} selected={selA} onSelect={setSelA}
          incoming={outB[selB]} outgoing={outA}
        />
        <Side
          id="b" label="Pokémon B" build={b} onBuild={setB}
          slots={slotsB} onSlots={setSlotsB} selected={selB} onSelect={setSelB}
          incoming={outA[selA]} outgoing={outB}
        />
      </div>
      <p style={{ fontSize: 12, opacity: 0.7 }}>
        Unofficial fan project. Pokémon and related names and images are property of Nintendo, Game Freak, and The Pokémon Company.
      </p>
    </main>
  );
}