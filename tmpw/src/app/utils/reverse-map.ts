export const reverseMap = <T = any, K = any>(
  arr: T[],
  mapFn: (value: T, idx: number) => K,
): K[] => {
  if (arr == null || arr?.length <= 0) return [];

  const mappedList: K[] = [];
  const endIdx = arr.length - 1;

  for (let idx = endIdx; idx >= 0; idx--) {
    const value = arr[idx];

    mappedList.push(mapFn(value, idx));
  }

  return mappedList;
};
