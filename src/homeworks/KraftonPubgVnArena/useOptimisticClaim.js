import { useCallback, useRef, useState } from 'react';
import { mockClaimCrate } from './claimApi.js';

export function useOptimisticClaim(initialStock, claimRequest = mockClaimCrate) {
  const [stock, setStock] = useState(initialStock);
  const [status, setStatus] = useState('idle');
  const inFlight = useRef(false);

  const claim = useCallback(async () => {
    if (inFlight.current || stock <= 0) return false;
    inFlight.current = true;
    setStock((current) => current - 1);
    setStatus('claiming');
    try {
      await claimRequest();
      setStatus('claimed');
      return true;
    } catch (error) {
      setStock((current) => current + 1);
      setStatus(error.status === 409 ? 'sold-out' : 'error');
      return false;
    } finally {
      inFlight.current = false;
    }
  }, [claimRequest, stock]);

  return { stock, status, claim };
}