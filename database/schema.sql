-- Schema de base de donnees Digital Business
-- A executer dans le SQL Editor de Neon

-- Table des clients
CREATE TABLE IF NOT EXISTS clients (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  telephone VARCHAR(20),
  email VARCHAR(100),
  service_demande VARCHAR(50),
  statut VARCHAR(20) DEFAULT 'nouveau',
  notes TEXT,
  cree_le TIMESTAMP DEFAULT NOW()
);

-- Table des services
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  categorie VARCHAR(50),
  prix_indicatif VARCHAR(50),
  actif BOOLEAN DEFAULT true
);

-- Table des conversations avec les agents IA
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(100) NOT NULL,
  agent_id VARCHAR(50) NOT NULL,
  message_utilisateur TEXT NOT NULL,
  reponse_agent TEXT,
  cree_le TIMESTAMP DEFAULT NOW()
);

-- Table des projets internes
CREATE TABLE IF NOT EXISTS projets (
  id SERIAL PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  description TEXT,
  statut VARCHAR(20) DEFAULT 'en_cours',
  priorite INTEGER DEFAULT 3,
  cree_le TIMESTAMP DEFAULT NOW(),
  maj_le TIMESTAMP DEFAULT NOW()
);

-- Index pour les requetes frequentes
CREATE INDEX IF NOT EXISTS idx_clients_telephone ON clients(telephone);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_projets_statut ON projets(statut);

-- Donnees initiales : services de Digital Business
INSERT INTO services (nom, description, categorie) VALUES
  ('Creation site web', 'Site vitrine ou e-commerce sur mesure', 'web'),
  ('Deblocage telephone', 'Deblocage Samsung, Tecno, itel, Infinix, Philips', 'telephone'),
  ('Installation logiciel', 'Installation et configuration de logiciels', 'logiciel'),
  ('Assistance technique', 'Depannage et support informatique', 'assistance'),
  ('Formation', 'Formation en informatique et numerique', 'formation')
ON CONFLICT DO NOTHING;
