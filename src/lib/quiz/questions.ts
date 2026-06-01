import type { Answer, Domain, Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: "NET-BEG-001",
    domain: "Réseaux",
    level: "Débutant",
    text: "Quel protocole garantit généralement la livraison ordonnée des paquets ?",
    options: [
      { id: "a", text: "UDP" },
      { id: "b", text: "TCP" },
      { id: "c", text: "ICMP" },
      { id: "d", text: "ARP" },
    ],
    correctOptionId: "b",
    explanation: "TCP établit une connexion et gère l'ordre, les accusés de réception et les retransmissions.",
  },
  {
    id: "NET-BEG-002",
    domain: "Réseaux",
    level: "Débutant",
    text: "Quel service traduit un nom de domaine comme cirt.gov.mg en adresse IP ?",
    options: [
      { id: "a", text: "DNS" },
      { id: "b", text: "DHCP" },
      { id: "c", text: "NTP" },
      { id: "d", text: "SMTP" },
    ],
    correctOptionId: "a",
    explanation: "Le DNS résout les noms de domaine vers des enregistrements réseau, dont les adresses IP.",
  },
  {
    id: "NET-INT-001",
    domain: "Réseaux",
    level: "Intermédiaire",
    text: "Une attaque ARP spoofing sert principalement à...",
    options: [
      { id: "a", text: "Chiffrer le trafic d'un réseau local" },
      { id: "b", text: "Se placer en homme du milieu sur un LAN" },
      { id: "c", text: "Empêcher la résolution DNS externe" },
      { id: "d", text: "Créer un tunnel VPN site-à-site" },
    ],
    correctOptionId: "b",
    explanation: "L'attaquant associe son adresse MAC à l'IP d'une autre machine, souvent la passerelle.",
  },
  {
    id: "NET-INT-002",
    domain: "Réseaux",
    level: "Intermédiaire",
    text: "Quelle différence décrit le mieux IDS et IPS ?",
    options: [
      { id: "a", text: "Un IDS détecte, un IPS peut bloquer en ligne" },
      { id: "b", text: "Un IDS chiffre, un IPS déchiffre" },
      { id: "c", text: "Un IDS remplace le pare-feu, un IPS remplace le DNS" },
      { id: "d", text: "Aucune différence opérationnelle" },
    ],
    correctOptionId: "a",
    explanation: "Un IDS alerte sur des activités suspectes, tandis qu'un IPS peut intervenir pour les bloquer.",
  },
  {
    id: "WEB-BEG-001",
    domain: "Web",
    level: "Débutant",
    text: "Quelle défense réduit fortement le risque d'injection SQL ?",
    options: [
      { id: "a", text: "Concaténer les chaînes côté serveur" },
      { id: "b", text: "Utiliser des requêtes préparées paramétrées" },
      { id: "c", text: "Désactiver HTTPS" },
      { id: "d", text: "Masquer les erreurs CSS" },
    ],
    correctOptionId: "b",
    explanation: "Les requêtes préparées séparent le code SQL des données utilisateur.",
  },
  {
    id: "WEB-BEG-002",
    domain: "Web",
    level: "Débutant",
    text: "Une XSS stockée est dangereuse car...",
    options: [
      { id: "a", text: "Elle ne touche que le navigateur de l'attaquant" },
      { id: "b", text: "Elle est sauvegardée puis servie à plusieurs utilisateurs" },
      { id: "c", text: "Elle bloque uniquement les images" },
      { id: "d", text: "Elle nécessite toujours un accès root serveur" },
    ],
    correctOptionId: "b",
    explanation: "Le payload est persistant dans l'application et peut atteindre les visiteurs légitimes.",
  },
  {
    id: "WEB-INT-001",
    domain: "Web",
    level: "Intermédiaire",
    text: "Quel en-tête aide à limiter l'impact des attaques XSS ?",
    options: [
      { id: "a", text: "Content-Security-Policy" },
      { id: "b", text: "Accept-Language" },
      { id: "c", text: "Server-Timing" },
      { id: "d", text: "Cache-Control: public" },
    ],
    correctOptionId: "a",
    explanation: "Une CSP bien configurée restreint les sources de scripts et réduit les injections exploitables.",
  },
  {
    id: "WEB-INT-002",
    domain: "Web",
    level: "Intermédiaire",
    text: "Une attaque SSRF vise souvent à...",
    options: [
      { id: "a", text: "Forcer le serveur à contacter une ressource interne" },
      { id: "b", text: "Augmenter la taille des cookies" },
      { id: "c", text: "Modifier la police du navigateur" },
      { id: "d", text: "Transformer UDP en TCP" },
    ],
    correctOptionId: "a",
    explanation: "La SSRF détourne le serveur pour atteindre des services internes ou des métadonnées cloud.",
  },
  {
    id: "CRY-BEG-001",
    domain: "Cryptographie",
    level: "Débutant",
    text: "Dans un chiffrement asymétrique, la clé publique sert typiquement à...",
    options: [
      { id: "a", text: "Être gardée secrète par une seule personne" },
      { id: "b", text: "Chiffrer ou vérifier une signature selon l'usage" },
      { id: "c", text: "Remplacer tous les mots de passe" },
      { id: "d", text: "Désactiver l'authentification" },
    ],
    correctOptionId: "b",
    explanation: "La clé publique peut être distribuée; elle sert par exemple au chiffrement ou à la vérification.",
  },
  {
    id: "CRY-BEG-002",
    domain: "Cryptographie",
    level: "Débutant",
    text: "Pourquoi le mode ECB est-il déconseillé avec AES ?",
    options: [
      { id: "a", text: "Il révèle des motifs quand des blocs identiques sont chiffrés" },
      { id: "b", text: "Il est toujours plus lent que tous les autres modes" },
      { id: "c", text: "Il supprime automatiquement l'intégrité" },
      { id: "d", text: "Il ne fonctionne que sur Linux" },
    ],
    correctOptionId: "a",
    explanation: "ECB chiffre chaque bloc indépendamment; deux blocs identiques donnent deux chiffrés identiques.",
  },
  {
    id: "CRY-INT-001",
    domain: "Cryptographie",
    level: "Intermédiaire",
    text: "Quelle propriété est fournie par une fonction de hachage cryptographique ?",
    options: [
      { id: "a", text: "Réversibilité facile du message" },
      { id: "b", text: "Résistance aux collisions et préimages" },
      { id: "c", text: "Compression ZIP sans perte" },
      { id: "d", text: "Confidentialité automatique du canal réseau" },
    ],
    correctOptionId: "b",
    explanation: "Un bon hash rend difficile de trouver une entrée équivalente ou de retrouver l'entrée originale.",
  },
  {
    id: "FOR-BEG-001",
    domain: "Forensics",
    level: "Débutant",
    text: "La chaîne de conservation des preuves sert à...",
    options: [
      { id: "a", text: "Prouver l'intégrité et la traçabilité d'une preuve" },
      { id: "b", text: "Accélérer le Wi-Fi" },
      { id: "c", text: "Compresser les journaux en JPEG" },
      { id: "d", text: "Supprimer les horodatages" },
    ],
    correctOptionId: "a",
    explanation: "Elle documente qui a manipulé la preuve, quand, comment, et dans quelles conditions.",
  },
  {
    id: "FOR-BEG-002",
    domain: "Forensics",
    level: "Débutant",
    text: "Volatility est principalement utilisé pour analyser...",
    options: [
      { id: "a", text: "Des captures mémoire" },
      { id: "b", text: "Des chartes graphiques" },
      { id: "c", text: "Des certificats papier" },
      { id: "d", text: "Des antennes radio" },
    ],
    correctOptionId: "a",
    explanation: "Volatility permet d'extraire processus, connexions et artefacts depuis un dump mémoire.",
  },
  {
    id: "FOR-INT-001",
    domain: "Forensics",
    level: "Intermédiaire",
    text: "Les fichiers Prefetch Windows peuvent aider à déterminer...",
    options: [
      { id: "a", text: "Qu'un programme a été exécuté et à quels moments approximatifs" },
      { id: "b", text: "Le mot de passe exact de l'utilisateur" },
      { id: "c", text: "La couleur de l'écran" },
      { id: "d", text: "La clé privée TLS du serveur distant" },
    ],
    correctOptionId: "a",
    explanation: "Les Prefetch contiennent des traces d'exécution utiles à la chronologie d'une investigation.",
  },
  {
    id: "REV-BEG-001",
    domain: "Reverse",
    level: "Débutant",
    text: "Un désassembleur transforme un binaire en...",
    options: [
      { id: "a", text: "Instructions assembleur lisibles" },
      { id: "b", text: "Fichier audio" },
      { id: "c", text: "Certificat TLS" },
      { id: "d", text: "Adresse IP publique" },
    ],
    correctOptionId: "a",
    explanation: "Le désassemblage reconstruit une représentation assembleur du code machine.",
  },
  {
    id: "REV-INT-001",
    domain: "Reverse",
    level: "Intermédiaire",
    text: "La technique de process hollowing consiste généralement à...",
    options: [
      { id: "a", text: "Lancer un processus légitime puis remplacer son contenu mémoire" },
      { id: "b", text: "Défragmenter un disque dur" },
      { id: "c", text: "Renommer un fichier texte" },
      { id: "d", text: "Changer le fuseau horaire" },
    ],
    correctOptionId: "a",
    explanation: "Des malwares l'utilisent pour exécuter du code sous l'apparence d'un processus légitime.",
  },
];

export function pickQuestions(nq = 10): Question[] {
  const domains: Domain[] = ["Réseaux", "Web", "Cryptographie", "Forensics", "Reverse"];
  const byDomain = new Map<Domain, Question[]>();
  for (const d of domains) {
    byDomain.set(
      d,
      [...QUESTIONS.filter((q) => q.domain === d)].sort(() => Math.random() - 0.5),
    );
  }
  const picked: Question[] = [];
  const shuffledDomains = [...domains].sort(() => Math.random() - 0.5);
  for (let i = 0; i < nq; i++) {
    const d = shuffledDomains[i % shuffledDomains.length];
    const pool = byDomain.get(d)!;
    const q = pool.shift();
    if (q) picked.push(q);
  }
  return picked.sort(() => Math.random() - 0.5);
}

export function gradeAnswers(
  questions: Question[],
  selected: Record<string, string>,
  startedAt: number,
): { answers: Answer[]; finalScore: number; correctCount: number } {
  const perQuestion = questions.length ? 100 / questions.length : 0;
  const durationMs = questions.length
    ? Math.round((Date.now() - startedAt) / questions.length)
    : 0;

  const answers = questions.map((question) => {
    const selectedOptionId = selected[question.id] ?? "";
    const option = question.options.find((item) => item.id === selectedOptionId);
    const isCorrect = selectedOptionId === question.correctOptionId;

    return {
      questionId: question.id,
      selectedOptionId,
      selectedOptionText: option?.text ?? "",
      correctOptionId: question.correctOptionId,
      isCorrect,
      points: isCorrect ? perQuestion : 0,
      durationMs,
    };
  });

  const correctCount = answers.filter((answer) => answer.isCorrect).length;
  const finalScore = Math.round(answers.reduce((total, answer) => total + answer.points, 0));

  return { answers, finalScore, correctCount };
}

export function sanitizeQuestion(question: Question): Question {
  return {
    ...question,
    options: question.options.map((option) => ({ ...option })),
  };
}
