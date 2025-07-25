const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});


const initDatabase = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resumes (
        id SERIAL PRIMARY KEY,
        filename VARCHAR(255) NOT NULL,
        upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        name VARCHAR(255),
        email VARCHAR(255),
        phone VARCHAR(50),
        summary TEXT,
        skills JSONB,
        experience JSONB,
        education JSONB,
        rating INTEGER,
        suggestions TEXT[],
        improvements TEXT[],
        raw_text TEXT,
        file_size INTEGER,
        analysis_complete BOOLEAN DEFAULT false
      )
    `);
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
  }
};

module.exports = { pool, initDatabase };