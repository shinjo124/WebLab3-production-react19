import { useCallback, useEffect, useRef, useState } from 'react';

export function mockConflictFetch(_url, { signal }) {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException('Claim aborted', 'AbortError'));
      return;
    }

    const finish = (callback, value) => {
      window.clearTimeout(timer);
      signal.removeEventListener('abort', abort);
      callback(value);
    };
    const abort = () => finish(reject, new DOMException('Claim aborted', 'AbortError'));
    const timer = window.setTimeout(() => finish(resolve, new Response(null, { status: 409 })), 200);
    signal.addEventListener('abort', abort, { once: true });
  });
}

export function useOptimisticClaim(initialStock = 0, fetcher = fetch) {
  const [stock, setStock] = useState(initialStock);
  const [pendingClaimIds, setPendingClaimIds] = useState(() => new Set());
  const stockRef = useRef(initialStock);
  const claimsRef = useRef(new Map());
  const mountedRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    const claims = claimsRef.current;
    return () => {
      mountedRef.current = false;
      for (const controller of claims.values()) controller.abort();
      claims.clear();
    };
  }, []);

  const claim = useCallback(async (claimId) => {
    if (claimsRef.current.has(claimId) || stockRef.current < 1) return false;

    const controller = new AbortController();
    claimsRef.current.set(claimId, controller);
    stockRef.current -= 1;
    setStock(stockRef.current);
    setPendingClaimIds((previous) => new Set(previous).add(claimId));

    try {
      const response = await fetcher('/api/airdrops/claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ claimId }),
        signal: controller.signal,
      });

      if (response.status === 409 || !response.ok) {
        if (mountedRef.current) {
          stockRef.current += 1;
          setStock(stockRef.current);
        }
        return false;
      }
      return true;
    } catch (error) {
      if (!controller.signal.aborted && mountedRef.current) {
        stockRef.current += 1;
        setStock(stockRef.current);
      }
      if (error.name !== 'AbortError') throw error;
      return false;
    } finally {
      if (claimsRef.current.get(claimId) === controller) {
        claimsRef.current.delete(claimId);
        if (mountedRef.current) {
          setPendingClaimIds((previous) => {
            const next = new Set(previous);
            next.delete(claimId);
            return next;
          });
        }
      }
    }
  }, [fetcher]);

  return { stock, pendingClaimIds, claim };
}
