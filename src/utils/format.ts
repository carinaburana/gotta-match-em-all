/** "00:45" — whole seconds rounded up, so the timer shows 00:01 until time is really up. */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.ceil(Math.max(0, ms) / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

/** "42.3 s" */
export function formatDurationSeconds(ms: number): string {
  return `${(ms / 1000).toFixed(1)} s`;
}

/** Replaces "{key}" placeholders, e.g. fillTemplate("Hi {name}", { name: "Zork" }). */
export function fillTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => values[key] ?? match);
}
