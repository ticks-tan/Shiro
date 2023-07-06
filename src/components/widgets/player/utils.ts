export function hms(seconds: number): string {
  // @ts-ignore
  // return [3600, 60] // 00:00:00
  return [60]
    .reduceRight(
      // @ts-ignore
      (p, b) => (r) => [Math.floor(r / b)].concat(p(r % b)),
      (r) => [r],
    )(seconds)
    .map((a) => a.toString().padStart(2, '0'))
    .join(':')
}
