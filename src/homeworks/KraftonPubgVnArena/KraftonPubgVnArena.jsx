import { useId, useState } from 'react';
import { mockConflictFetch, useOptimisticClaim } from './useOptimisticClaim.js';
import { usePubgAirdropTimer } from './usePubgAirdropTimer.js';
import styles from './KraftonPubgVnArena.module.css';

const CRATES = [
  { id: 'recon', name: 'Recon Crate', price: 10000 },
  { id: 'survivor', name: 'Survivor Crate', price: 25000 },
  { id: 'victory', name: 'Victory Crate', price: 50000 },
];

const SQUADS = [
  { id: 'te', name: 'The Expendables', wwcd: 3, placementPts: 130, killPts: 54 },
  { id: 'ces', name: 'Cerberus Esports', wwcd: 2, placementPts: 150, killPts: 62 },
  { id: 'ge', name: 'Roy Esports', wwcd: 2, placementPts: 150, killPts: 48 },
  { id: 'agg', name: 'AGG', wwcd: 1, placementPts: 110, killPts: 70 },
];

const DROP_DURATION_MS = 60_000;

function mockArenaFetch(url, options) {
  return JSON.parse(options.body).claimId.endsWith(':recon')
    ? mockConflictFetch(url, options)
    : Promise.resolve(new Response(null, { status: 200 }));
}

const formatPrice = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

function formatCountdown(milliseconds) {
  const seconds = Math.ceil(milliseconds / 1000);
  return [Math.floor(seconds / 60), seconds % 60]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

export function KraftonPubgVnArena() {
  const playerId = useId();
  const filterId = useId();
  const sortId = useId();
  const [playerTag, setPlayerTag] = useState('');
  const [squadFilter, setSquadFilter] = useState('');
  const [sortBy, setSortBy] = useState('wwcd');
  const [message, setMessage] = useState('Enter your player tag to claim a crate.');
  const [dropTarget] = useState(() => Date.now() + 30_000);
  const { remainingMs: untilExpiryMs, isLive: isExpired } = usePubgAirdropTimer(dropTarget + DROP_DURATION_MS, 0);
  const warmupMs = Math.max(0, untilExpiryMs - DROP_DURATION_MS);
  const { stock, pendingClaimIds, claim } = useOptimisticClaim(4, mockArenaFetch);
  const phase = warmupMs > 0
    ? 'WARMUP'
    : isExpired
      ? 'EXPIRED'
      : stock === 0
        ? 'LOOTED_OUT'
        : 'AIRDROP_LIVE';
  const leaderboard = SQUADS
    .filter((squad) => squad.name.toLowerCase().includes(squadFilter.trim().toLowerCase()))
    .toSorted((a, b) => b[sortBy] - a[sortBy]
      || b.wwcd - a.wwcd
      || b.placementPts - a.placementPts
      || b.killPts - a.killPts);

  const claimCrate = async (crate) => {
    const claimId = playerTag.trim() + ':' + crate.id;
    setMessage('Claim request sent.');
    try {
      const accepted = await claim(claimId);
      setMessage(accepted
        ? crate.name + ' claimed successfully.'
        : 'Claim conflict (409). Stock restored; try again.');
    } catch {
      setMessage('Claim failed. Stock restored; try again.');
    }
  };

  return (
    <section className={styles.arena} aria-label="KRAFTON PUBG VN Arena">
      <section className={styles.dropStatus} aria-labelledby="airdrop-status-title">
        <h2 id="airdrop-status-title">Airdrop countdown</h2>
        <p aria-live="polite">{phase === 'WARMUP' ? 'Drop opens in ' + formatCountdown(warmupMs) : phase.replaceAll('_', ' ')}</p>
        <p>Phase: <strong>{phase}</strong></p>
        <p>Crates remaining: <strong>{stock}</strong></p>
      </section>

      <section aria-labelledby="crate-title">
        <h2 id="crate-title">Supply crates</h2>
        <label htmlFor={playerId}>Player tag</label>
        <input
          id={playerId}
          value={playerTag}
          onChange={(event) => setPlayerTag(event.target.value)}
          autoComplete="off"
        />
        <ul className={styles.crateList}>
          {CRATES.map((crate) => {
            const claimId = playerTag.trim() + ':' + crate.id;
            return (
              <li key={crate.id}>
                <article className={styles.crate}>
                  <h3>{crate.name}</h3>
                  <p>{formatPrice.format(crate.price)}</p>
                  <button
                    type="button"
                    disabled={phase !== 'AIRDROP_LIVE' || !playerTag.trim() || stock < 1 || pendingClaimIds.has(claimId)}
                    onClick={() => claimCrate(crate)}
                  >
                    {pendingClaimIds.has(claimId) ? 'Claiming…' : 'Claim ' + crate.name}
                  </button>
                </article>
              </li>
            );
          })}
        </ul>
        <output className={styles.claimMessage} aria-live="polite">{message}</output>
      </section>

      <section aria-labelledby="leaderboard-title">
        <h2 id="leaderboard-title">Squad leaderboard</h2>
        <div className={styles.leaderboardControls}>
          <label htmlFor={filterId}>Filter squads</label>
          <input id={filterId} value={squadFilter} onChange={(event) => setSquadFilter(event.target.value)} />
          <label htmlFor={sortId}>Sort by</label>
          <select id={sortId} value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="wwcd">WWCD</option>
            <option value="placementPts">Placement points</option>
            <option value="killPts">Kill points</option>
          </select>
        </div>
        <ol className={styles.leaderboard}>
          {leaderboard.map((squad, index) => (
            <li key={squad.id}>
              <article className={styles.squad}>
                <h3>{index + 1}. {squad.name}</h3>
                <ul>
                  <li><span>WWCD</span><strong>{squad.wwcd}</strong></li>
                  <li><span>Placement pts</span><strong>{squad.placementPts}</strong></li>
                  <li><span>Kill pts</span><strong>{squad.killPts}</strong></li>
                </ul>
              </article>
            </li>
          ))}
        </ol>
      </section>
    </section>
  );
}
