const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const poolConfig = {
  connectionString: process.env.DATABASE_URL,
};


// Check if SSL should be used
// DATABASE_SSL can be 'true', 'false', or 'no-verify'
if (process.env.DATABASE_SSL === 'true') {
  poolConfig.ssl = true;
} else if (process.env.DATABASE_SSL === 'no-verify') {
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
} else if (process.env.DATABASE_SSL === 'false' || process.env.NODE_ENV === 'development') {
  // Explicitly no SSL
  poolConfig.ssl = false;
} else if (process.env.NODE_ENV === 'production') {
  // Default to SSL in production
  poolConfig.ssl = {
    rejectUnauthorized: false
  };
}

console.log('Database configuration:', {
  connectionString: poolConfig.connectionString ? 'Set' : 'Not set',
  ssl: poolConfig.ssl,
  nodeEnv: process.env.NODE_ENV
});



// Function to determine SSL configuration
const getSSLConfig = () => {
  const connectionString = process.env.DATABASE_URL || '';
  
  // Local development - no SSL
  if (connectionString.includes('localhost') || 
      connectionString.includes('127.0.0.1') ||
      process.env.NODE_ENV === 'development' ||
      !process.env.NODE_ENV) {
    return false;
  }
  
  // Production or external databases - use SSL
  if (process.env.NODE_ENV === 'production' ||
      connectionString.includes('render.com') ||
      connectionString.includes('amazonaws.com') ||
      connectionString.includes('elephantsql.com') ||
      connectionString.includes('supabase.co')) {
    return {
      rejectUnauthorized: false
    };
  }
  
  // Default to no SSL
  return false;
};


// Only add SSL if needed
const sslConfig = getSSLConfig();
if (sslConfig) {
  poolConfig.ssl = sslConfig;
}

console.log('Database config:', {
  hasConnectionString: !!process.env.DATABASE_URL,
  ssl: !!sslConfig,
  environment: process.env.NODE_ENV || 'development'
});

const pool = new Pool(poolConfig);

// Error handling
pool.on('error', (err) => {
  console.error('Unexpected pool error:', err);
});

const initDatabase = async () => {
  try {
    console.log('🔧 Initializing database...');
    
    // Test connection
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connected at:', result.rows[0].now);
    client.release();
    
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
    
    console.log('✅ Database tables initialized');
    
  } catch (error) {
    console.error('❌ Database initialization error:', error.message);
    
    // Provide helpful error messages
    if (error.message.includes('SSL')) {
      console.error('💡 SSL Error: Try setting DATABASE_URL without SSL requirement');
      console.error('💡 For local PostgreSQL, use: postgresql://username:password@localhost:5432/database_name');
    }
    
    throw error;
  }
};

module.exports = { pool, initDatabase };