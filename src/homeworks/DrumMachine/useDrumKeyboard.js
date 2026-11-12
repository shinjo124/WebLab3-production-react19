import { useEffect } from 'react';

export function useDrumKeyboard(padMap, onTriggerPad, isEnabled) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const onKeyDown = (event) => {
      if (event.repeat || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target?.tagName)) return;

      const pad = padMap.get(event.code);
      if (pad) onTriggerPad(pad.id);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [padMap, onTriggerPad, isEnabled]);
}
