/**
 * Routes API — Gestion des clients
 */
const express = require('express');
const router = express.Router();
const { pool, estDisponible } = require('../db');

// Middleware : verifier que la base est disponible
router.use((req, res, next) => {
  if (!estDisponible()) {
    return res.status(503).json({ erreur: 'Base de donnees non configuree. Ajoutez DATABASE_URL dans les variables d\'environnement.' });
  }
  next();
});

// GET /api/clients — Liste des clients
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients ORDER BY cree_le DESC LIMIT 50');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur lors de la recuperation des clients.' });
  }
});

// POST /api/clients — Ajouter un client
router.post('/', async (req, res) => {
  const { nom, telephone, email, service_demande, notes } = req.body;

  if (!nom) {
    return res.status(400).json({ erreur: 'Le champ "nom" est requis.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO clients (nom, telephone, email, service_demande, notes)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [nom, telephone || null, email || null, service_demande || null, notes || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur lors de la creation du client.' });
  }
});

// GET /api/clients/:id — Detail d'un client
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM clients WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ erreur: 'Client introuvable.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur lors de la recuperation du client.' });
  }
});

// PUT /api/clients/:id — Modifier un client
router.put('/:id', async (req, res) => {
  const { nom, telephone, email, service_demande, statut, notes } = req.body;

  try {
    const result = await pool.query(
      `UPDATE clients SET nom=$1, telephone=$2, email=$3, service_demande=$4, statut=$5, notes=$6
       WHERE id=$7 RETURNING *`,
      [nom, telephone, email, service_demande, statut || 'nouveau', notes, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ erreur: 'Client introuvable.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur lors de la modification du client.' });
  }
});

module.exports = router;
