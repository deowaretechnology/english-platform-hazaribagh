const getRawApiBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env) {
    const env = (import.meta as any).env;
    return (
      env.VITE_API_URL ||
      env.VITE_API_BASE_URL ||
      env.VITE_BACKEND_URL ||
      ''
    );
  }
  return '';
};

export function getApiUrl(path: string): string {
  const baseUrl = getRawApiBaseUrl().trim().replace(/\/$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  if (baseUrl) {
    return `${baseUrl}${cleanPath}`;
  }
  return cleanPath;
}
