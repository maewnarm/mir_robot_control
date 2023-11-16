export function capitalize(msg: string) {
  const trimmed = msg.trim()
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1)
}
