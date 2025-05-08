// src/services/tmdb.js
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE = "https://api.themoviedb.org/3";

async function request(path, params = {}) {
  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY);
  url.searchParams.set("language", "es-ES");
  Object.entries(params).forEach(([k,v]) => url.searchParams.set(k, v));
  const res = await fetch(url);
  if (!res.ok) throw new Error(`TMDB ${res.status}`);
  return res.json();
}

/**  
 * Retorna solo trailers de YouTube para una película TMDB  
 * @param {number|string} tmdbId  
 * @returns {Promise<Array<{ key: string, name: string }>>}  
 */
export async function getMovieTrailers(tmdbId) {
  const { results } = await request(`/movie/${tmdbId}/videos`);
  return results
    .filter(v => v.type === "Trailer" && v.site === "YouTube")
    .map(v => ({ key: v.key, name: v.name }));
}
