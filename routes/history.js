/* Author: Krystal Lo
Objectives for history.js

-> History Functionality
    + GET /history
        - Accepts a required query parameter 'type' with the value 'keywords'
            - Handles validation if the 'type' is not provided and is not 'keywords'
    + If the value is 'keywords':
        -  Is able to retrieve all saved keywords from the 'SearchHistoryKeyword' collection in MongoDB and return them in clean JSON format that does not include the Mongo '_id'
        */

import express from 'express';
import db from '../services/db.js' 

const router = express.Router();

// function to display search history
async function displaySearchHistory() {
    try {
        const cursor = await db.find( 'SearchHistoryKeyword' );

        const searchHistory = await cursor.toArray();

        const cleanSearchHistory = searchHistory.map((doc) => {
            const { _id, ...rest } = doc;
            return rest;
        });

        return cleanSearchHistory;
    } catch (error) {
        console.error('Database error:', error);
        throw new Error('Error occurred while fetching search history');
    }
}

// GET /history
router.get('/', async (req, res) => {
    try {
        // validate query parameter 'type'
        const { type } = req.query;

        // handles validation if type is not provided 
        if (!type) {
            return res.status(400).json({ error: 'Query parameter "type" is required' });
        }
            
        // handles validation if 'type' is not 'keywords'
        if (type !== 'keywords') {
            return res.status(400).json({ error: 'Query parameter "type" must be "keywords"' });
        }

        // retrieve the search history
        const searchHistory = await displaySearchHistory(type);
        res.json(searchHistory);
    } catch (error) {
        console.error('Route error:', error);
        res.status(500).json({  error: 'Internal Server Error' });
    }
});

export default router;