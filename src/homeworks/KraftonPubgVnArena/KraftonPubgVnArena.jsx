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
  { id: 'expendables', name: 'The Expendables', wwcd: 3, placementPts: 130, killPts: 54 },
  { id: 'genius', name: 'Genius Esports', wwcd: 2, placementPts: 150, killPts: 48 },
  { id: 'cerberus', name: 'Cerberus Esports', wwcd: 2, placementPts: 150, killPts: 62 },
  { id: 'team-flash', name: 'Team Flash', wwcd: 1, placementPts: 110, killPts: 70 },
];

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
  const [playerTag, setPlayerTag] = useState('');
  const [message, setMessage] = useState('Enter your player tag to claim a crate.');
  const [dropTarget] = useState(() => Date.now() + 5000);
  const { remainingMs, isLive } = usePubgAirdropTimer(dropTarget, 0);
  const { stock, pendingClaimIds, claim } = useOptimisticClaim(4, mockConflictFetch);
  const leaderboard = SQUADS.toSorted((a, b) =>
    b.wwcd - a.wwcd || b.placementPts - a.placementPts || b.killPts - a.killPts,
  );

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
        <p aria-live="polite">{isLive ? 'Airdrop is live' : 'Drop opens in ' + formatCountdown(remainingMs)}</p>
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
                    disabled={!isLive || !playerTag.trim() || stock < 1 || pendingClaimIds.has(claimId)}
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
