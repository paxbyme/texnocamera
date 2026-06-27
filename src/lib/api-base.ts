const LOCAL_API_URL = 'http://localhost:3000';

export function apiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) {
    return configured.replace(/\/+$/, '');
  }

  return process.env.NODE_ENV === 'production' ? '' : LOCAL_API_URL;
}

export function apiUrl(path: string) {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${apiBaseUrl()}${normalizedPath}`;
}
