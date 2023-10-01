export default function mapReduce<A, K = string, V = any>(
  map: Map<K, V>,
  accumulatorInitialValue: A,
  reduceFn: (value: V, accumulator: A, key: K) => A,
): A {
  let accumulator = accumulatorInitialValue;

  map.forEach((value, key) => {
    accumulator = reduceFn(value, accumulator, key);
  });

  return accumulator;
}
