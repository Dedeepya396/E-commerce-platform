const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const OpenAI = require('openai');

// Creating new Express app
const app = express();

// Middleware to parse incoming JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure OpenAI API key is available
if (!process.env.OPENAI_API_KEY) {
    console.error("Missing OpenAI API key! Please set OPENAI_API_KEY in .env");
    process.exit(1);
}

// Setting up OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

app.post('/converse', async (req, res) => {
    try {
        const message = req.body.message;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        const chatCompletion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: message }],
        });

        const reply = chatCompletion.choices[0]?.message?.content || "No response from AI";

        res.json({ reply });

        console.log("AI Response:", reply);
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
