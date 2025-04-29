// frontend/src/utils/ratings.js
export const KID_SAFE_RATINGS = ["G", "PG", "TV-Y", "TV-Y7"];

export const isKidSafe = (rated = "", age = 13) =>
  KID_SAFE_RATINGS.includes(rated) || (rated === "PG-13" && age >= 13);
