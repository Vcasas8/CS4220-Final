/* Author: Annie Lin
Objectives for api.js

-> Search API by Keyword
    + Accepts a keyword as an argument
    + Sends a request to the selected API using the keyword
    + Returns an array of search results
    
-> Get Detailed Data by Unique Identifier
    + Accepts an item's unique identifier (ID) as an argument
    + Sends a request to the selected API to get detailed information on the item
    + Returns the detailed data
*/

import axios from "axios";

const BASE_URL = "https://www.freetogame.com/api";

function normalizeText(value) {
  return String(value || "").trim().toLowerCase();
}

function buildSearchableText(game) {
  return [
    game.title,
    game.genre,
    game.platform,
    game.publisher,
    game.developer,
    game.short_description,
  ]
    .map(normalizeText)
    .join(" ");
}

async function makeRequest(endpoint, params = {}) {
  const response = await axios.get(`${BASE_URL}${endpoint}`, { params });
  return response.data;
}

export async function searchGamesByKeyword(keyword) {
  if (!keyword || !keyword.trim()) {
    throw new Error("Keyword required");
  }

  const games = await makeRequest("/games");

  const results = games.filter((game) =>
    buildSearchableText(game).includes(normalizeText(keyword))
  );

  return results.map((g) => ({
    id: g.id,
    title: g.title,
    genre: g.genre,
    platform: g.platform,
  }));
}

export async function getGameDetailsById(id) {
  if (!id) {
    throw new Error("ID required");
  }

  const game = await makeRequest("/game", { id });

  return {
    id: game.id,
    title: game.title,
    genre: game.genre,
    platform: game.platform,
    description: game.description,
    releaseDate: game.release_date,
  };
}
