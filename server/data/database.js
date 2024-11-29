const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: false,
        }
      : false,
});

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS greetings (
        id SERIAL PRIMARY KEY,
        timeOfDay TEXT NOT NULL,
        language TEXT NOT NULL,
        greetingMessage TEXT NOT NULL UNIQUE,
        tone TEXT NOT NULL
      )
    `);
    console.log("Tables created successfully");
  } catch (err) {
    console.error("Error creating tables:", err);
  }
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

  try {
    // Check if data already exists
    const result = await pool.query("SELECT COUNT(*) FROM greetings");
    if (parseInt(result.rows[0].count) > 0) {
      return;
    }

    // Insert data using a single transaction
    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const insertQuery = `
        INSERT INTO greetings (timeOfDay, language, greetingMessage, tone)
        VALUES ($1, $2, $3, $4)
      `;

      for (const greeting of greetings) {
        await client.query(insertQuery, greeting);
      }
      await client.query("COMMIT");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
    console.log("Data seeded successfully");
  } catch (err) {
    console.error("Error seeding data:", err);
  }
};

const init = async () => {
  try {
    await createTables();
    await seedData();
    console.log("Database initialized successfully");
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

init();

module.exports = pool;
