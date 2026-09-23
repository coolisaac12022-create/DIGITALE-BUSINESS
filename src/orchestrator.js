/**
 * DIGITAL BUSINESS — Orchestrateur Multi-Agents
 * Route les demandes vers l'agent competent via l'API Gemini.
 */

const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(__dirname, '..', 'config', 'agents.json');
const AGENTS_DIR = path.join(__dirname, '..', 'agents');

const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));

// Charger le contexte commun et les prompts de chaque agent
function chargerPrompt(agentId) {
  const contexte = fs.readFileSync(path.join(AGENTS_DIR, '00-contexte.md'), 'utf-8');
  const agent = config.agents.find(a => a.id === agentId);
  if (!agent) throw new Error(`Agent inconnu : ${agentId}`);
  const promptAgent = fs.readFileSync(path.join(__dirname, '..', agent.fichier_prompt), 'utf-8');
  return `${contexte}\n\n---\n\n${promptAgent}`;
}

// Router une demande vers le bon agent
// Les mots-cles plus longs (plus specifiques) ont un poids plus eleve
function routerDemande(message) {
  const messageMin = message.toLowerCase();
  const scores = {};

  for (const regle of config.routing.regles) {
    for (const motCle of regle.mots_cles) {
      if (messageMin.includes(motCle)) {
        const poids = motCle.length;
        scores[regle.agent] = (scores[regle.agent] || 0) + poids;
      }
    }
  }

  const meilleur = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  return meilleur ? meilleur[0] : config.routing.agent_par_defaut;
}

// Appel a l'API Gemini
async function appelerGemini(promptSysteme, messageUtilisateur) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY manquante. Cree un fichier .env avec : GEMINI_API_KEY=ta_cle\n' +
      'Obtiens une cle gratuite sur : https://aistudio.google.com/apikey'
    );
  }

  const reponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: promptSysteme }] },
        contents: [{ role: 'user', parts: [{ text: messageUtilisateur }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      })
    }
  );

  if (!reponse.ok) {
    const erreur = await reponse.text();
    throw new Error(`Erreur Gemini (${reponse.status}) : ${erreur}`);
  }

  const data = await reponse.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || 'Pas de reponse.';
}

// Fonction principale : recoit un message, route, et retourne la reponse
async function traiter(message) {
  const agentId = routerDemande(message);
  const agent = config.agents.find(a => a.id === agentId);
  const promptSysteme = chargerPrompt(agentId);

  console.log(`\n[DIRECTEUR] Demande routed vers : ${agent.nom}`);
  console.log(`[DIRECTEUR] Traitement en cours...\n`);

  const reponse = await appelerGemini(promptSysteme, message);

  console.log(`[${agent.nom}] :\n`);
  console.log(reponse);
  console.log('\n---');

  return { agent: agentId, reponse };
}

// Mode CLI : node orchestrator.js "ta question ici"
if (require.main === module) {
  const message = process.argv.slice(2).join(' ');

  if (!message) {
    console.log('Usage : node src/orchestrator.js "ta demande ici"');
    console.log('\nExemples :');
    console.log('  node src/orchestrator.js "Comment securiser ma cle API Gemini ?"');
    console.log('  node src/orchestrator.js "Propose un design pour le site vitrine"');
    console.log('  node src/orchestrator.js "Quelle strategie de prix pour les deblocages ?"');
    process.exit(0);
  }

  traiter(message).catch(err => {
    console.error('Erreur :', err.message);
    process.exit(1);
  });
}

module.exports = { traiter, routerDemande, chargerPrompt };
