export default function Exclude<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const j: { [name: string]: any } = JSON.parse(JSON.stringify(obj)); // make a copy of the object

  for (const key of keys) {
    delete j[key as string];
  }

  return <Omit<T, K>>j;
}
