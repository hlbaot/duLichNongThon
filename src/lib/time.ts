export function getCountdownParts(target: number, now = Date.now()): { h: string; m: string; s: string } {
  const seconds = Math.max(0, Math.ceil((target - now) / 1000));
  const two = (value: number) => String(value).padStart(2, "0");
  return { h: two(Math.floor(seconds / 3600)), m: two(Math.floor(seconds / 60) % 60), s: two(seconds % 60) };
}
