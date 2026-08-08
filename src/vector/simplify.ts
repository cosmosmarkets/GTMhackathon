export function simplify(points: number[], tolerance = 1): number[] {
  return tolerance <= 0 ? points : points.filter((_, index) => index % 2 === 0)
}
