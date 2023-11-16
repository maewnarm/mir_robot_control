const environment = {
  API_URL: process.env.NEXT_PUBLIC_API_URL ?? '',
  API_KEY: process.env.NEXT_PUBLIC_API_KEY ?? '',
  BASE_PATH: process.env.NEXT_PUBLIC_BASE_PATH ?? null,
}

export function assetUrl(path: string) {
  if (environment.BASE_PATH) {
    return `${environment.BASE_PATH}${path}`
  }

  return path
}

export default environment
