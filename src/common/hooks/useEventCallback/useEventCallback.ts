import { useCallback, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '..';

export function useEventCallback<Args extends Array<unknown>, R>(fn: (...args: Args) => R) {
  const ref = useRef<typeof fn>(() => {
    throw new Error('Cannot call an event handler while rendering.');
  });

  useIsomorphicLayoutEffect(() => {
    ref.current = fn;
  }, [fn]);

  return useCallback((...args: Args) => ref.current(...args), [ref]);
}
