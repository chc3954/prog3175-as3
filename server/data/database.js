const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./data/greetings.sqlite", (err) => {
  if (err) {
    console.error("Error opening database:", err);
  } else {
    console.log("Connected to SQLite database");
  }
});

const createTables = () => {
  db.run(`
    CREATE TABLE IF NOT EXISTS greetings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timeOfDay TEXT NOT NULL,
      language TEXT NOT NULL,
      greetingMessage TEXT NOT NULL UNIQUE,
      tone TEXT NOT NULL
    )
  `);
};

const seedData = async () => {
  const greetings = [
    // English
    ["Morning", "English", "Good morning!", "Casual"],
    ["Morning", "English", "I wish you a pleasant morning.", "Formal"],
    ["Afternoon", "English", "Good afternoon!", "Casual"],
    ["Afternoon", "English", "I hope your afternoon is going well.", "Formal"],
    ["Evening", "English", "Good evening!", "Casual"],
    ["Evening", "English", "I wish you a pleasant evening.", "Formal"],

    // French
    ["Morning", "French", "Bonjour!", "Casual"],
    ["Morning", "French", "Je vous souhaite une bonne matinée.", "Formal"],
    ["Afternoon", "French", "Bon après-midi!", "Casual"],
    ["Afternoon", "French", "Je vous souhaite un bon après-midi.", "Formal"],
    ["Evening", "French", "Bonsoir!", "Casual"],
    ["Evening", "French", "Je vous souhaite une bonne soirée.", "Formal"],

    // Spanish
    ["Morning", "Spanish", "¡Buenos días!", "Casual"],
    ["Morning", "Spanish", "Le deseo muy buenos días.", "Formal"],
    ["Afternoon", "Spanish", "¡Buenas tardes!", "Casual"],
    ["Afternoon", "Spanish", "Le deseo muy buenas tardes.", "Formal"],
    ["Evening", "Spanish", "¡Buenas noches!", "Casual"],
    ["Evening", "Spanish", "Le deseo muy buenas noches.", "Formal"],
  ];

  db.get("SELECT COUNT(*) As count FROM greetings", (err, row) => {
    if (row?.count > 0) {
      return;
    }

    const stmt = db.prepare(
      "INSERT INTO greetings (timeOfDay, language, greetingMessage, tone) VALUES (?, ?, ?, ?)"
    );
    greetings.forEach((greeting) => stmt.run(greeting));
    stmt.finalize();
  });
};

createTables();
seedData();

console.log("Database initialized successfully");

module.exports = db;
