/**
 * @description delays execution in an async function
 * @param duration time in seconds
 * @constructor
 */
export default async function Hold(duration: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, duration * 1_000));
}
