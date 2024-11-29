require("dotenv").config();
const express = require("express");
const { neon } = require("@neondatabase/serverless");
const {
  GreetingRequest,
  GreetingResponse,
} = require("./models/greetingModels");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Neon serverless driver initialization
const sql = neon(process.env.DATABASE_URL);

app.use(express.json());

// Greet endpoint
app.post("/api/greet", async (req, res) => {
  const { timeOfDay, language, tone } = req.body;
  const request = new GreetingRequest(timeOfDay, language, tone);

  try {
    const result = await sql`
      SELECT greetingMessage 
      FROM greetings 
      WHERE timeOfDay = ${request.timeOfDay} 
      AND language = ${request.language} 
      AND tone = ${request.tone}
    `;

    if (result.length === 0) {
      return res.status(404).json({
        error: "Greeting not found for the specified time, language, and tone",
      });
    }

    const response = new GreetingResponse(result[0].greetingmessage);
    res.json(response);
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all times of day
app.get("/api/timesOfDay", async (req, res) => {
  try {
    const result = await sql`SELECT DISTINCT timeOfDay FROM greetings`;
    res.json(result.map((row) => row.timeofday));
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Get all supported languages
app.get("/api/languages", async (req, res) => {
  try {
    const result = await sql`SELECT DISTINCT language FROM greetings`;
    res.json(result.map((row) => row.language));
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(HTTP_PORT, () => console.log(`Server listening on: ${HTTP_PORT}`));

module.exports = app;
