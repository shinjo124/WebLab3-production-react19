import { useEffect } from 'react';

export function useDrumKeyboard(padMap, onTriggerPad, isEnabled = true) {
  useEffect(() => {
    if (!isEnabled) return undefined;

    const onKeyDown = (event) => {
      if (event.repeat || ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)) return;
      const pad = padMap.get(event.code);
      if (!pad) return;
      event.preventDefault();
      onTriggerPad(pad.id);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [padMap, onTriggerPad, isEnabled]);
}