// server.js

const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017'; // MongoDB connection URL
const dbName = 'chatbot'; // Name of the MongoDB database
const collectionName = 'interactions'; // Name of the collection to store interactions

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Connect to MongoDB
MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error connecting to MongoDB:', err);
        return;
    }

    const db = client.db(dbName);
    const interactionsCollection = db.collection(collectionName);

    // API endpoint to store chat interactions
    app.post('/api/storeInteraction', (req, res) => {
        const interaction = req.body;

        // Insert the interaction into the MongoDB collection
        interactionsCollection.insertOne(interaction, (err, result) => {
            if (err) {
                console.error('Error storing interaction in MongoDB:', err);
                res.status(500).json({ error: 'Failed to store interaction' });
            } else {
                console.log('Interaction stored in MongoDB');
                res.json({ message: 'Interaction stored successfully' });
            }
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
