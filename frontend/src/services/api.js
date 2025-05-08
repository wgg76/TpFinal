<<<<<<< HEAD
// src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * Utilidad genérica para peticiones al backend
 */
async function request(path, { method = "GET", body, token } = {}) {
  const url = `${API_URL}${path}`;
  // Log para depuración: muestra la URL y el token usado
  console.log(`→ [API] ${method} ${url} — token:`, token);

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Error en API");
  return data;
}

export const auth = {
  register: (email, password, role) =>
    request("/api/auth/register", {
      method: "POST",
      body: { email, password, role },
    }),
  login: (email, password) =>
    request("/api/auth/login", {
      method: "POST",
      body: { email, password },
    }),
};

export const movies = {
  list: (params, token) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/movies?${query}`, { token });
  },
  get: (id, token, options = {}) => {
    const query = options.refresh ? "?refresh=true" : "";
    return request(`/api/movies/${id}${query}`, { token });
  },
  topRating: (token) => request("/api/movies/rating", { token }),
  topImdb: (token) => request("/api/movies/top-imdb", { token }),
  create: (payload, token) =>
    request("/api/movies", { method: "POST", body: payload, token }),
  updateById: (id, payload, token) =>
    request(`/api/movies/${id}`, { method: "PUT", body: payload, token }),
  removeById: (id, token) =>
    request(`/api/movies/${id}`, { method: "DELETE", token }),
};

export const series = {
  list: (params, token) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/series?${query}`, { token });
  },
  get: (id, token, options = {}) => {
    const query = options.refresh ? "?refresh=true" : "";
    return request(`/api/series/${id}${query}`, { token });
  },
  topRating: (token) => request("/api/series/rating", { token }),
  topImdb: (token) => request("/api/series/top-imdb", { token }),
  create: (payload, token) =>
    request("/api/series", { method: "POST", body: payload, token }),
  updateById: (id, payload, token) =>
    request(`/api/series/${id}`, { method: "PUT", body: payload, token }),
  removeById: (id, token) =>
    request(`/api/series/${id}`, { method: "DELETE", token }),
};

export const profiles = {
  list: (token) => request("/api/profiles", { token }),
  create: (data, token) =>
    request("/api/profiles", { method: "POST", body: data, token }),
  update: (id, data, token) =>
    request(`/api/profiles/${id}`, { method: "PUT", body: data, token }),
  remove: (id, token) =>
    request(`/api/profiles/${id}`, { method: "DELETE", token }),
  getWatchlist: (profileId, token) =>
    request(`/api/profiles/${profileId}/watchlist`, { token }),
};

export const watchlist = {
  add: (profileId, itemId, token) =>
    request(`/api/profiles/${profileId}/watchlist`, {
      method: "POST",
      body: { itemId },
      token,
    }),
  remove: (profileId, itemId, token) =>
    request(`/api/profiles/${profileId}/watchlist/${itemId}`, {
      method: "DELETE",
      token,
    }),
};

export default { auth, movies, series, profiles, watchlist };
=======
// src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || "";

async function request(path, { method = "GET", body, token } = {}) {
  const url = `${API_URL}${path}`;

  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(url, {
    method,
    headers,
    body: body && JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en API");
  return data;
}

export const auth = {
  register: (email, password, role) =>
    request("/api/auth/register", {
      method: "POST",
      body: { email, password, role },
    }),
  login: (email, password) =>
    request("/api/auth/login", { method: "POST", body: { email, password } }),
  refresh: (refreshToken) =>
    request("/api/auth/refresh", { method: "POST", body: { refreshToken } }),
  logout: (refreshToken) =>
    request("/api/auth/logout", { method: "POST", body: { refreshToken } }),
};

// — Películas CRUD
export const movies = {
  list: (params = {}, token) =>
    request(`/api/movies?${new URLSearchParams(params)}`, { token }),
  get: (id, token) => request(`/api/movies/${id}?skipCount=true`, { token }),
  create: (body, token) =>
    request("/api/movies", { method: "POST", body, token }),
  update: (id, body, token) =>
    request(`/api/movies/${id}`, { method: "PUT", body, token }),
  remove: (id, token) =>
    request(`/api/movies/${id}`, { method: "DELETE", token }),
};

// — Series CRUD
export const series = {
  list: (params = {}, token) =>
    request(`/api/series?${new URLSearchParams(params)}`, { token }),
  get: (id, token) => request(`/api/series/${id}?skipCount=true`, { token }),
  create: (body, token) =>
    request("/api/series", { method: "POST", body, token }),
  update: (id, body, token) =>
    request(`/api/series/${id}`, { method: "PUT", body, token }),
  remove: (id, token) =>
    request(`/api/series/${id}`, { method: "DELETE", token }),
};

// — Perfiles
export const profiles = {
  list: (token) => request("/api/profiles", { token }),
  create: (data, token) =>
    request("/api/profiles", { method: "POST", body: data, token }),
  update: (id, data, token) =>
    request(`/api/profiles/${id}`, { method: "PUT", body: data, token }),
  remove: (id, token) =>
    request(`/api/profiles/${id}`, { method: "DELETE", token }),
  getWatchlist: (id, token) =>
    request(`/api/profiles/${id}/watchlist`, { token }),
};

// — Watchlist
export const watchlist = {
  add: (id, itemId, token) =>
    request(`/api/profiles/${id}/watchlist`, {
      method: "POST",
      body: { itemId },
      token,
    }),
  remove: (id, itemId, token) =>
    request(`/api/profiles/${id}/watchlist/${itemId}`, {
      method: "DELETE",
      token,
    }),
};

// — Usuarios (administración de roles)
export const users = {
  list: (token) => request("/api/users", { token }),
  changeRole: (id, role, token) =>
    request(`/api/users/${id}/role`, {
      method: "PUT",
      body: { role },
      token,
    }),
};

export default { auth, movies, series, profiles, watchlist, users };
>>>>>>> 5582115 (veamos que sale)
