// backend/utils/omdb.js

/**
 * Cliente OMDb usando fetch (Node 18+).
 * Asegúrate de que en backend/.env tienes OMDB_API_KEY=55d5dfd9
 */

export async function fetchFromOmdb(imdbID) {
    const key = process.env.OMDB_API_KEY;
    if (!key) throw new Error("OMDB_API_KEY no definida en .env");
    const url = `http://www.omdbapi.com/?apikey=${key}&i=${imdbID}&plot=full`;
    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`Error HTTP OMDb: ${res.status}`);
    }
    const data = await res.json();
    if (data.Response === "False") {
      throw new Error(`OMDb error: ${data.Error}`);
    }
    return data;
  }
  