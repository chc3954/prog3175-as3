const express = require("express");
const db = require("./data/database");
const {
  GreetingRequest,
  GreetingResponse,
} = require("./models/greetingModels");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.json());

// Greet endpoint
app.post("/api/greet", (req, res) => {
  const { timeOfDay, language, tone } = req.body; // destructure the request body
  const request = new GreetingRequest(timeOfDay, language, tone);

  db.get(
    "SELECT greetingMessage FROM greetings WHERE timeOfDay = ? AND language = ? AND tone = ?",
    [request.timeOfDay, request.language, request.tone],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: "Database error" });
      }
      if (!row) {
        return res.status(404).json({
          error:
            "Greeting not found for the specified time, language, and tone",
        });
      }
      const response = new GreetingResponse(row.greetingMessage);
      res.json(response);
    }
  );
});

// Get all times of day
app.get("/api/timesOfDay", (req, res) => {
  db.all("SELECT DISTINCT timeOfDay FROM greetings", (err, rows) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }
    res.json(rows.map((row) => row.timeOfDay));
  });
});

// Get all supported languages
app.get("/api/languages", (req, res) => {
  db.all(`SELECT DISTINCT language FROM greetings`, (err, rows) => {
    if (err) {
      res.status(500).json({ error: "Database error" });
    } else {
      res.json(rows.map((row) => row.language));
    }
  });
});

app.listen(HTTP_PORT, () => console.log(`Server listening on: ${HTTP_PORT}`));
