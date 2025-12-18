const BASE_URL = 'http://43.201.113.80:8000';

export function getApiUrl(endpoint) {
  const fullUrl = `${BASE_URL}${endpoint}`;
  return `https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`;
}
