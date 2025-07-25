const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Parse DATABASE_URL for Render deployment
const isProduction = process.env.NODE_ENV === 'production';

let poolConfig = {
  connectionString: process.env.DATABASE_URL,
};

// For production (Render), we need SSL
if (isProduction) {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

const pool = new Pool(poolConfig);

const initDatabase = async () => {
  try {
    // Test connection
    await pool.query('SELECT NOW()');
    console.log('✅ Database connected successfully');
    
    // Create tables
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
    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Database initialization error:', error);
    console.error('Connection string:', process.env.DATABASE_URL ? 'Set' : 'Not set');
    throw error;
  }
};

module.exports = { pool, initDatabase };