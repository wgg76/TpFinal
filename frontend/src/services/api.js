// src/services/api.js

const API_URL = import.meta.env.VITE_API_URL || "/api";

/**
 * Utilidad genérica para peticiones al backend
 */
async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Error en API");
  return data;
}

export const auth = {
  register: (email, password, role) =>
    request("/auth/register", { method: "POST", body: { email, password, role } }),
  login: (email, password) =>
    request("/auth/login", { method: "POST", body: { email, password } }),
};

export const movies = {
  list: (params, token) => {
    const query = new URLSearchParams(params).toString();
    return request(`/movies?${query}`, { token });
  },
  get: (id, token, options = {}) => {
    const query = options.refresh ? "?refresh=true" : "";
    return request(`/movies/${id}${query}`, { token });
  },
  topRating: (token) => request("/movies/rating", { token }),
  topImdb: (token) => request("/movies/top-imdb", { token }),
  create: (payload, token) =>
    request("/movies", { method: "POST", body: payload, token }),
  updateById: (id, payload, token) =>
    request(`/movies/${id}`, { method: "PUT", body: payload, token }),
  removeById: (id, token) => request(`/movies/${id}`, { method: "DELETE", token }),
};

export const profiles = {
  list: (token) => request("/profiles", { token }),
  create: (data, token) => request("/profiles", { method: "POST", body: data, token }),
  update: (id, data, token) =>
    request(`/profiles/${id}`, { method: "PUT", body: data, token }),
  remove: (id, token) => request(`/profiles/${id}`, { method: "DELETE", token }),
};

export const watchlist = {
  add: (profileId, itemId, token) =>
    request(`/profiles/${profileId}/watchlist`, { method: "POST", body: { itemId }, token }),
  remove: (profileId, itemId, token) =>
    request(`/profiles/${profileId}/watchlist/${itemId}`, { method: "DELETE", token }),
};

export default { auth, movies, profiles, watchlist };
