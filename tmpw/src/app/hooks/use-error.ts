import { useState } from 'react';

export type UseErrorState<T extends string = string> = {
  msg: string;
  code: T;
};

export function useError<T extends string = string>() {
  const [err, setErr] = useState<UseErrorState<T> | null>(null);

  return [err, setErr] as const;
}
