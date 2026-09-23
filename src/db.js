/**
 * Connexion a la base PostgreSQL Neon (optionnelle)
 * Si DATABASE_URL n'est pas definie, l'app fonctionne sans base.
 */
const { Pool } = require('pg');

let pool = null;
let dbDisponible = false;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  pool.on('error', (err) => {
    console.error('[DB] Erreur inattendue du pool Neon :', err.message);
  });
}

async function tester() {
  if (!pool) {
    console.log('[DB] DATABASE_URL non configuree — mode sans base de donnees');
    return false;
  }
  try {
    const res = await pool.query('SELECT NOW() as heure');
    console.log('[DB] Connexion Neon reussie —', res.rows[0].heure);
    dbDisponible = true;
    return true;
  } catch (err) {
    console.error('[DB] Echec connexion Neon :', err.message);
    return false;
  }
}

function estDisponible() {
  return dbDisponible && pool !== null;
}

module.exports = { pool, tester, estDisponible };
