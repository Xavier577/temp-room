import { useState } from 'react';

export const useMut = <T = any>(initialValue: T) => {
  const [state, setState] = useState(initialValue);

  let mutableStateSync = initialValue;

  const updateSyncedState = (value: T) => {
    mutableStateSync = value;
  };

  const getMutValue = () => mutableStateSync;

  const updateState = (value: T | ((value: T) => T)) => {
    setState(value);
    if (value instanceof Function) {
      updateSyncedState(value(mutableStateSync));
    } else {
      updateSyncedState(value);
    }
  };

  return [state, getMutValue, updateState] as const;
};
