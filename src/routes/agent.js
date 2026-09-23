/**
 * Routes API — Agent IA (orchestrateur multi-agents)
 */
const express = require('express');
const router = express.Router();
const { traiter } = require('../orchestrator');
const { pool, estDisponible } = require('../db');

// POST /api/agent/question — Envoyer une question a l'equipe IA
router.post('/question', async (req, res) => {
  const { message, session_id } = req.body;

  if (!message || message.trim().length === 0) {
    return res.status(400).json({ erreur: 'Le champ "message" est requis.' });
  }

  try {
    const resultat = await traiter(message);

    // Sauvegarder la conversation en base (si disponible)
    if (session_id && estDisponible()) {
      await pool.query(
        `INSERT INTO conversations (session_id, agent_id, message_utilisateur, reponse_agent)
         VALUES ($1, $2, $3, $4)`,
        [session_id, resultat.agent, message, resultat.reponse]
      );
    }

    res.json({
      agent: resultat.agent,
      reponse: resultat.reponse,
      horodatage: new Date().toISOString()
    });
  } catch (err) {
    console.error('[API/agent] Erreur :', err.message);
    res.status(500).json({ erreur: `Erreur interne : ${err.message}` });
  }
});

// GET /api/agent/historique/:sessionId — Recuperer l'historique d'une session
router.get('/historique/:sessionId', async (req, res) => {
  if (!estDisponible()) {
    return res.json({ session: req.params.sessionId, messages: [], info: 'Base de donnees non configuree' });
  }
  try {
    const result = await pool.query(
      `SELECT agent_id, message_utilisateur, reponse_agent, cree_le
       FROM conversations
       WHERE session_id = $1
       ORDER BY cree_le ASC`,
      [req.params.sessionId]
    );
    res.json({ session: req.params.sessionId, messages: result.rows });
  } catch (err) {
    res.status(500).json({ erreur: 'Erreur lors de la recuperation de l\'historique.' });
  }
});

module.exports = router;
