export function getApiUrl(): string {
  const envUrl = process.env.NEXT_PUBLIC_API_URL || '';

  if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
    try {
      const url = new URL(envUrl);
      return `${url.protocol}//${window.location.hostname}:${url.port}/`;
    } catch {
      return envUrl;
    }
  }

  return envUrl;
}
