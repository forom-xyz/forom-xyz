export const DEFAULT_PUBLIC_FOROM_MISSION = 'Sauver les communautés'

interface FoundationalQuestSpec {
  id: string
  district: string
  action: string
  title: string
}

export interface SeededQuest {
  id: string
  title: string
  reward: number
  question: string
  category: string
}

export const FOUNDATIONAL_QUEST_SPECS: FoundationalQuestSpec[] = [
  { id: 'A0', district: 'Vision', action: 'Idée', title: 'Valeur pilier' },
  { id: 'A1', district: 'Vision', action: 'Échange', title: 'Débat philosophie' },
  { id: 'A2', district: 'Vision', action: 'Quête', title: 'Draft manifeste' },
  { id: 'A3', district: 'Vision', action: 'Chantier', title: 'Édition manifeste' },
  { id: 'A4', district: 'Vision', action: 'SOS', title: 'Crise de vision' },
  { id: 'A5', district: 'Vision', action: 'Accompli', title: 'Manifeste publié' },
  { id: 'A6', district: 'Vision', action: 'Matériel', title: 'Logos & Branding' },
  { id: 'A7', district: 'Vision', action: 'Décision', title: 'Vote des valeurs' },
  { id: 'A8', district: 'Vision', action: 'Savoir', title: 'Manifeste Canon' },
  { id: 'A9', district: 'Vision', action: 'Urgence', title: 'Pivot identitaire' },
  { id: 'B0', district: 'Équipe', action: 'Idée', title: 'Nouveau rôle' },
  { id: 'B1', district: 'Équipe', action: 'Échange', title: 'Maillage talents' },
  { id: 'B2', district: 'Équipe', action: 'Quête', title: 'Recrutement' },
  { id: 'B3', district: 'Équipe', action: 'Chantier', title: 'Setup Onboarding' },
  { id: 'B4', district: 'Équipe', action: 'SOS', title: 'Burnout équipe' },
  { id: 'B5', district: 'Équipe', action: 'Accompli', title: 'Staff complet' },
  { id: 'B6', district: 'Équipe', action: 'Matériel', title: 'Annuaire membre' },
  { id: 'B7', district: 'Équipe', action: 'Décision', title: 'Élection Mods' },
  { id: 'B8', district: 'Équipe', action: 'Savoir', title: 'Hiérarchie Canon' },
  { id: 'B9', district: 'Équipe', action: 'Urgence', title: 'Crise modération' },
  { id: 'C0', district: 'Stratégie', action: 'Idée', title: 'Idée Roadmap' },
  { id: 'C1', district: 'Stratégie', action: 'Échange', title: 'Tactiques croissance' },
  { id: 'C2', district: 'Stratégie', action: 'Quête', title: 'Étude écosystème' },
  { id: 'C3', district: 'Stratégie', action: 'Chantier', title: 'Plan Phases 1-3' },
  { id: 'C4', district: 'Stratégie', action: 'SOS', title: 'Manque ressources' },
  { id: 'C5', district: 'Stratégie', action: 'Accompli', title: 'Roadmap finale' },
  { id: 'C6', district: 'Stratégie', action: 'Matériel', title: 'Diagrammes strat.' },
  { id: 'C7', district: 'Stratégie', action: 'Décision', title: 'Prochain jalon' },
  { id: 'C8', district: 'Stratégie', action: 'Savoir', title: 'Plan Canon' },
  { id: 'C9', district: 'Stratégie', action: 'Urgence', title: 'Pivot stratégique' },
  { id: 'D0', district: 'Opérations', action: 'Idée', title: 'Flux de travail' },
  { id: 'D1', district: 'Opérations', action: 'Échange', title: 'Feedback ops' },
  { id: 'D2', district: 'Opérations', action: 'Quête', title: 'Event spécial' },
  { id: 'D3', district: 'Opérations', action: 'Chantier', title: 'Projet en cours' },
  { id: 'D4', district: 'Opérations', action: 'SOS', title: 'Bloquage ops' },
  { id: 'D5', district: 'Opérations', action: 'Accompli', title: 'Sprint terminé' },
  { id: 'D6', district: 'Opérations', action: 'Matériel', title: 'Templates & SOP' },
  { id: 'D7', district: 'Opérations', action: 'Décision', title: 'Vote date event' },
  { id: 'D8', district: 'Opérations', action: 'Savoir', title: 'SOP Canoniques' },
  { id: 'D9', district: 'Opérations', action: 'Urgence', title: 'Arrêt opérations' },
  { id: 'E0', district: 'Logistique', action: 'Idée', title: 'Choix software' },
  { id: 'E1', district: 'Logistique', action: 'Échange', title: 'Architecture tech' },
  { id: 'E2', district: 'Logistique', action: 'Quête', title: 'Setup Nœud' },
  { id: 'E3', district: 'Logistique', action: 'Chantier', title: 'Migration DB' },
  { id: 'E4', district: 'Logistique', action: 'SOS', title: 'Panne serveur' },
  { id: 'E5', district: 'Logistique', action: 'Accompli', title: 'Node stable' },
  { id: 'E6', district: 'Logistique', action: 'Matériel', title: 'Config & Code' },
  { id: 'E7', district: 'Logistique', action: 'Décision', title: 'Budget hardware' },
  { id: 'E8', district: 'Logistique', action: 'Savoir', title: 'Doc Infrastructure' },
  { id: 'E9', district: 'Logistique', action: 'Urgence', title: 'Alerte données' },
  { id: 'F0', district: 'Soutien', action: 'Idée', title: 'Système tickets' },
  { id: 'F1', district: 'Soutien', action: 'Échange', title: 'Aide entre pairs' },
  { id: 'F2', district: 'Soutien', action: 'Quête', title: 'Accueil recrues' },
  { id: 'F3', district: 'Soutien', action: 'Chantier', title: 'Tutos Forom' },
  { id: 'F4', district: 'Soutien', action: 'SOS', title: 'Retard support' },
  { id: 'F5', district: 'Soutien', action: 'Accompli', title: 'Bug majeur résolu' },
  { id: 'F6', district: 'Soutien', action: 'Matériel', title: 'Logs de bugs' },
  { id: 'F7', district: 'Soutien', action: 'Décision', title: 'Priorité tickets' },
  { id: 'F8', district: 'Soutien', action: 'Savoir', title: 'FAQ Canon' },
  { id: 'F9', district: 'Soutien', action: 'Urgence', title: 'Faille sécurité' },
  { id: 'G0', district: 'Réalisations', action: 'Idée', title: 'Pitch Showcase' },
  { id: 'G1', district: 'Réalisations', action: 'Échange', title: 'Fête des victoires' },
  { id: 'G2', district: 'Réalisations', action: 'Quête', title: 'Montage vidéo' },
  { id: 'G3', district: 'Réalisations', action: 'Chantier', title: 'Sélection memos' },
  { id: 'G4', district: 'Réalisations', action: 'SOS', title: 'Rush média' },
  { id: 'G5', district: 'Réalisations', action: 'Accompli', title: 'Portfolio public' },
  { id: 'G6', district: 'Réalisations', action: 'Matériel', title: 'Fichiers projets' },
  { id: 'G7', district: 'Réalisations', action: 'Décision', title: 'Projet du mois' },
  { id: 'G8', district: 'Réalisations', action: 'Savoir', title: 'Hall of Fame' },
  { id: 'G9', district: 'Réalisations', action: 'Urgence', title: 'Vol de crédit' },
  { id: 'H0', district: 'Gouvernance', action: 'Idée', title: 'Nouvelle règle' },
  { id: 'H1', district: 'Gouvernance', action: 'Échange', title: 'Économie Pixel' },
  { id: 'H2', district: 'Gouvernance', action: 'Quête', title: 'Audit Trésorerie' },
  { id: 'H3', district: 'Gouvernance', action: 'Chantier', title: 'Code de loi' },
  { id: 'H4', district: 'Gouvernance', action: 'SOS', title: 'Médiation conflit' },
  { id: 'H5', district: 'Gouvernance', action: 'Accompli', title: 'Loi adoptée' },
  { id: 'H6', district: 'Gouvernance', action: 'Matériel', title: 'Licences & ToS' },
  { id: 'H7', district: 'Gouvernance', action: 'Décision', title: 'Débloquer fonds' },
  { id: 'H8', district: 'Gouvernance', action: 'Savoir', title: 'Constitution' },
  { id: 'H9', district: 'Gouvernance', action: 'Urgence', title: 'Abus de pouvoir' },
  { id: 'I0', district: 'Mémoire', action: 'Idée', title: 'Événement à noter' },
  { id: 'I1', district: 'Mémoire', action: 'Échange', title: 'Nostalgie débuts' },
  { id: 'I2', district: 'Mémoire', action: 'Quête', title: 'Transcription logs' },
  { id: 'I3', district: 'Mémoire', action: 'Chantier', title: 'Training IA ROM' },
  { id: 'I4', district: 'Mémoire', action: 'SOS', title: 'Formatage corrompu' },
  { id: 'I5', district: 'Mémoire', action: 'Accompli', title: 'Archive scellée' },
  { id: 'I6', district: 'Mémoire', action: 'Matériel', title: 'Embeddings IA' },
  { id: 'I7', district: 'Mémoire', action: 'Décision', title: 'Vote Lore Canon' },
  { id: 'I8', district: 'Mémoire', action: 'Savoir', title: "Livre d'Histoire" },
  { id: 'I9', district: 'Mémoire', action: 'Urgence', title: "Perte d'archive" },
  { id: 'J0', district: 'Hors-sujet', action: 'Idée', title: 'Jeu weekend' },
  { id: 'J1', district: 'Hors-sujet', action: 'Échange', title: 'Social / Chat' },
  { id: 'J2', district: 'Hors-sujet', action: 'Quête', title: 'Concours mèmes' },
  { id: 'J3', district: 'Hors-sujet', action: 'Chantier', title: 'Meetup IRL' },
  { id: 'J4', district: 'Hors-sujet', action: 'SOS', title: 'Drama Lounge' },
  { id: 'J5', district: 'Hors-sujet', action: 'Accompli', title: 'Party fini' },
  { id: 'J6', district: 'Hors-sujet', action: 'Matériel', title: 'Playlist / Mèmes' },
  { id: 'J7', district: 'Hors-sujet', action: 'Décision', title: 'Meilleure blague' },
  { id: 'J8', district: 'Hors-sujet', action: 'Savoir', title: 'Culture interne' },
  { id: 'J9', district: 'Hors-sujet', action: 'Urgence', title: 'Invasion bots' },
]

export function getInitialQuestsForMission(mission: string): SeededQuest[] {
  if (mission !== DEFAULT_PUBLIC_FOROM_MISSION) {
    return []
  }

  return FOUNDATIONAL_QUEST_SPECS.map(({ id, title }) => ({
    id,
    title,
    reward: 2,
    question: id.slice(1),
    category: id.slice(0, 1),
  }))
}