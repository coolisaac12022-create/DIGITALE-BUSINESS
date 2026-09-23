# DIGITAL BUSINESS - Systeme Multi-Agents IA

> "Plus qu'un service, une solution !"

Agence ivoirienne fondee par Isaac, specialisee en :
- Creation de sites web
- Installation/configuration de logiciels
- Assistance et deblocage de telephones (Samsung, Tecno, itel, Infinix, Philips)
- Formations

## Architecture

```
Client / Isaac --> DIRECTEUR (orchestrateur)
  |--> Developpeur Full-Stack
  |--> Comite Managers
  |--> Data Scientist
  |--> Cybersecurite
  |--> Design & Codeur
```

## Structure du projet

```
.
├── README.md              # Ce fichier
├── agents/                # Prompts systeme de chaque agent
│   ├── 00-contexte.md     # Contexte commun (inclus dans chaque agent)
│   ├── 01-directeur.md    # Superviseur / Orchestrateur
│   ├── 02-developpeur.md  # Developpeur Full-Stack
│   ├── 03-managers.md     # Comite Managers
│   ├── 04-data-scientist.md
│   ├── 05-cybersecurite.md
│   └── 06-design-codeur.md
├── config/                # Configuration du systeme
│   └── agents.json        # Registre des agents et routing
└── src/                   # Implementation
    └── orchestrator.js    # Orchestrateur Node.js
```

## Contraintes globales

| Contrainte | Valeur |
|-----------|--------|
| Budget | 0 EUR (services gratuits uniquement) |
| Stack | Node.js + Express + Grok API (xAI) + PostgreSQL/Neon |
| Langue | Francais |
| Engagement financier | Jamais sans validation d'Isaac |
| Contact humain | WhatsApp : 0595532884 |

## Demarrage rapide

```bash
# Installer les dependances
npm install

# Lancer l'orchestrateur
node src/orchestrator.js
```

## Projets actifs

- Digital Business (site vitrine + services)
- Aelyra
- Isaac AI Team
- Sport-Analytics (pronostics sportifs)
- Projets scolaires ALX
