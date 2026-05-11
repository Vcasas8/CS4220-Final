/* Author: Vivian Casas
Objectives for games.js

-> GET /games
    + Uses a query parameter to accept the search keyword
    + Interacts with api.js to perform a keyword-based search using the FreeToGame API
    + Returns a minimal and clean JSON response for each item containing only:
        - display: a readable display name associated with the keyword (game title)
        - identifier: the unique ID needed for future detailed requests

-> Saves Search Keywords
    + Stores unique search keywords in the MongoDB 'SearchHistoryKeyword' collection
*/

// imported express and db instance for handling routes and database operations,
// as well as the searchGamesByKeyword function for API interactions
import express from "express";
import db from "../services/db.js";
import { searchGamesByKeyword } from "../services/api.js";

// create a router instance for games routes
const router = express.Router();

// initialize db instance for database operations
const db = mongo();

// GET /games route handler to search games by keyword and save unique keywords to MongoDB
router.get("/", async (req, res) => {
    try {
        // Extract the 'keyword' query parameter from the request
        const { keyword } = req.query;

        // Validate that the 'keyword' parameter is provided and not just whitespace
        if (!keyword || !keyword.trim()) {
            return res.status(400).json({ error: "Query parameter 'keyword' is required" });
        }

        // Connect to the MongoDB database before performing any operations that involve the database
        await db.connect();

        // Use the searchGamesByKeyword function from api.js to get search results based on the provided keyword 
        const results = await searchGamesByKeyword(keyword);

        // Format the search results to include only the 'display' and 'identifier' fields for each game
        // 'display' will be the game title, and 'identifier' will be the unique ID of the game
        const formatted = results.map((game) => ({
            display: game.title,
            identifier: game.id
        }));

        // Check if this keyword has already been saved in MongoDB
        // We search the SearchHistoryKeyword collection for a document with this keyword
        const cursor = await db.find("SearchHistoryKeyword", { keyword });

        // Convert the cursor into an array so we can check if any documents exist
        const existing = await cursor.toArray();

        // If the keyword does NOT already exist in the database, insert it
        if (existing.length === 0) {
            await db.insert("SearchHistoryKeyword", { keyword });
        }

        // Return the formatted search results in the response, along with the original keyword and the count of results
        // This provides a clean and minimal JSON response to the client
        res.json({
            keyword,
            count: formatted.length,
            results: formatted
        });

    } catch (error) {
        // Log the error for debugging
        console.error(error);

        // Return a generic server error message to the client
        res.status(500).json({ error: "Server error occurred" });
    }
});

// Export the router so it can be used in server.js
export default router;
