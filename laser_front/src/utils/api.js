// Replace with your Railway proxy URL after deployment
const PROXY_URL = 'https://laser-proxy-server-production.up.railway.app';

export function getApiUrl(endpoint) {
  return `${PROXY_URL}/api${endpoint}`;
}
