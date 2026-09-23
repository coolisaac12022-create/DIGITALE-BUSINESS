/**
 * Connexion a la base PostgreSQL Neon
 */
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

pool.on('error', (err) => {
  console.error('[DB] Erreur inattendue du pool Neon :', err.message);
});

async function tester() {
  try {
    const res = await pool.query('SELECT NOW() as heure');
    console.log('[DB] Connexion Neon reussie —', res.rows[0].heure);
    return true;
  } catch (err) {
    console.error('[DB] Echec connexion Neon :', err.message);
    return false;
  }
}

module.exports = { pool, tester };
