/**
 * DIGITAL BUSINESS — Serveur Express principal
 * Point d'entree pour le deploiement (Render, Railway, etc.)
 */
require('dotenv').config();

const express = require('express');
const path = require('path');
const { tester } = require('./db');
const routesAgent = require('./routes/agent');
const routesClients = require('./routes/clients');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir le frontend statique
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes API
app.use('/api/agent', routesAgent);
app.use('/api/clients', routesClients);

// Route de sante (pour le monitoring Render)
app.get('/api/sante', async (req, res) => {
  const dbOk = await tester();
  res.json({
    statut: 'ok',
    service: 'Digital Business API',
    base_donnees: dbOk ? 'connectee' : 'deconnectee',
    horodatage: new Date().toISOString()
  });
});

// Fallback vers le frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Demarrage
async function demarrer() {
  console.log('[SERVEUR] Verification de la base Neon...');
  await tester();

  app.listen(PORT, () => {
    console.log(`[SERVEUR] Digital Business API demarre sur le port ${PORT}`);
    console.log(`[SERVEUR] Mode : ${process.env.NODE_ENV || 'developpement'}`);
  });
}

demarrer();
