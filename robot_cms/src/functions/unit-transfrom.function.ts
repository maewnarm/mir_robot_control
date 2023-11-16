export function millisec_to_minute(time_ms: number) {
  const millisec_per_second = 1000
  const sec_per_min = 60
  const result = time_ms / (millisec_per_second * sec_per_min)
  return Math.round(parseFloat(result.toFixed(1)))
}
