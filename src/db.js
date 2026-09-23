/**
 * Connexion a la base PostgreSQL Neon (optionnelle)
 * Si DATABASE_URL n'est pas definie ou pointe vers localhost, l'app fonctionne sans base.
 */

let pool = null;
let dbDisponible = false;

const url = process.env.DATABASE_URL || '';
const urlValide = url && !url.includes('127.0.0.1') && !url.includes('localhost');

if (urlValide) {
  try {
    const { Pool } = require('pg');
    pool = new Pool({
      connectionString: url,
      ssl: { rejectUnauthorized: false }
    });
    pool.on('error', (err) => {
      console.error('[DB] Erreur pool Neon :', err.message);
      dbDisponible = false;
    });
  } catch (err) {
    console.error('[DB] Impossible de creer le pool :', err.message);
  }
} else {
  console.log('[DB] Pas de DATABASE_URL externe — mode sans base de donnees');
}

async function tester() {
  if (!pool) {
    console.log('[DB] Mode sans base de donnees (aucune connexion)');
    return false;
  }
  try {
    const res = await pool.query('SELECT NOW() as heure');
    console.log('[DB] Connexion Neon reussie —', res.rows[0].heure);
    dbDisponible = true;
    return true;
  } catch (err) {
    console.error('[DB] Echec connexion Neon :', err.message);
    dbDisponible = false;
    return false;
  }
}

function estDisponible() {
  return dbDisponible && pool !== null;
}

module.exports = { pool, tester, estDisponible };
