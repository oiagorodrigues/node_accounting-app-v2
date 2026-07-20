const pg = require('pg');
const dotenv = require('dotenv');

dotenv.config();

// Creating a pool of connections to the database
// So we can reuse the connections and avoid
// creating a new connection for each request
const db = new pg.Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect();

module.exports = {
  db,
};
