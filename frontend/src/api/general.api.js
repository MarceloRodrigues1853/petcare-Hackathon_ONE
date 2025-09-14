// api/general.api.js
import { get } from './http.js';

/**
 * Verifica se o servidor está online.
 * Endpoint: GET /ping
 */
export function pingServer() {
  return get('/ping');
}