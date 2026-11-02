import { useId, useState } from 'react';
import { usePubgAirdropTimer } from './usePubgAirdropTimer.js';
import { useOptimisticClaim } from './useOptimisticClaim.js';

const SQUADS = [
  { id: 'te', name: 'The Expendables', wwcd: 3, placementPts: 42, killPts: 36 },
  { id: 'ces', name: 'Cerberus Esports', wwcd: 2, placementPts: 38, killPts: 31 },
  { id: 'ge', name: 'Genius Esports', wwcd: 1, placementPts: 28, killPts: 29 },
  { id: 'agg', name: 'AGG', wwcd: 1, placementPts: 25, killPts: 22 },
];
const formatVnd = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' });

export function KraftonPubgVnArena() {
  const filterId = useId();
  const [query, setQuery] = useState('');
  const [targetEpochMs] = useState(() => Date.now() + 60_000);
  const { remainingMs, isLive } = usePubgAirdropTimer(targetEpochMs);
  const { stock, status, claim } = useOptimisticClaim(12);
  const visibleSquads = SQUADS
    .filter((squad) => squad.name.toLowerCase().includes(query.trim().toLowerCase()))
    .toSorted((a, b) => b.placementPts + b.killPts - (a.placementPts + a.killPts));

  return (
    <section aria-label="KRAFTON PUBG Vietnam Arena">
      <h2>PVS Finals VIP Pass + 5,000 G-Coin</h2>
      <p>{formatVnd.format(1_500_000)}</p>
      <p>{isLive ? 'Airdrop live' : `Airdrop in ${Math.ceil(remainingMs / 1000)}s`}</p>
      <p>Remaining stock: {stock}</p>
      <button type="button" disabled={!isLive || stock === 0 || status === 'claiming'} onClick={claim}>
        {status === 'claiming' ? 'Claiming…' : 'Claim drop'}
      </button>
      {status === 'sold-out' && <p role="status">Looted out. Stock restored.</p>}
      {status === 'error' && <p role="alert">Claim failed. Stock restored; try again.</p>}
      <label htmlFor={filterId}>Filter squads</label>
      <input id={filterId} value={query} onChange={(event) => setQuery(event.target.value)} />
      <ol>
        {visibleSquads.map((squad) => (
          <li key={squad.id}>
            {squad.name}: {squad.wwcd} WWCD, {squad.placementPts} placement points, {squad.killPts} kill points
          </li>
        ))}
      </ol>
    </section>
  );
}