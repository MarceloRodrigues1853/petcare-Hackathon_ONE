// O proxy do Vite irá redirecionar os caminhos que começam com /api
// para o seu backend. Portanto, não precisamos de uma URL base aqui.

function getAuthHeader() {
  // Garante que estamos a ler a chave 'jwt' que o AuthContext salva.
  const token = localStorage.getItem('jwt');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

async function request(path, { method = 'GET', body, headers = {} } = {}) {
  const fullPath = path.startsWith('/') ? path : `/${path}`;

  const finalHeaders = {
    ...getAuthHeader(),
    ...(!(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}),
    ...headers,
  };

  let res;
  try {
    res = await fetch(fullPath, {
      method,
      headers: finalHeaders,
      body: body && !(body instanceof FormData) ? JSON.stringify(body) : body,
    });
  } catch (e) {
    throw new Error('Falha de rede. Verifique a sua conexão.');
  }

  if (!res.ok) {
    let message = `Erro HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data.message || data.error || `Erro HTTP ${res.status}`;
    } catch {
      // Ignora se a resposta de erro não for JSON, pois pode ser um erro de servidor (HTML).
    }
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }

  if (res.status === 204) return null;
  const contentType = res.headers.get('content-type');
  return contentType && contentType.includes('application/json') ? res.json() : res.text();
}

export const get  = (url, opts) => request(url, { method: 'GET', ...opts });
export const post = (url, body, opts) => request(url, { method: 'POST', body, ...opts });
export const put  = (url, body, opts) => request(url, { method: 'PUT',  body, ...opts });
export const del  = (url, opts) => request(url, { method: 'DELETE', ...opts });

export default { get, post, put, del };