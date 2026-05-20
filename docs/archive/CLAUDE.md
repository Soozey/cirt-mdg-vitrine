# CLAUDE.md — Plateforme Quiz Jobdating Cybersécurité

## Contexte du projet

Tu vas construire une plateforme web complète de quiz de sélection pour un **jobdating cybersécurité**. L'objectif est de permettre aux recruteurs d'identifier des profils techniques de qualité parmi les candidats, en filtrant via un quiz de 5 questions tirées aléatoirement depuis une banque de 200 questions, avec détection automatique des réponses générées par IA.

---

## Stack technique imposée

- **Frontend** : React 18 + Vite + React Router v6
- **Auth** : Firebase Authentication (Google OAuth + Facebook OAuth)
- **Base de données** : Firebase Firestore
- **Détection IA** : API Anthropic `claude-sonnet-4-20250514`
- **Style** : CSS Modules ou Tailwind CSS (au choix), PAS de composant UI tiers
- **Déploiement** : Docker (Nginx multi-stage) sur VPS Linux

---

## Architecture des fichiers à générer

```
hackathon-quiz/
├── CLAUDE.md                          ← ce fichier
├── docker-compose.yml
├── .env.example
├── nginx/
│   └── nginx.conf
├── firebase/
│   ├── firestore.rules
│   ├── firestore.indexes.json
│   └── set-roles.js                   ← script Admin SDK pour assigner rôles
├── frontend/
│   ├── Dockerfile
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── lib/
│       │   ├── firebase.js            ← init Firebase + auth Google/Facebook
│       │   ├── firestore.js           ← toutes les opérations Firestore
│       │   └── aiDetect.js            ← appel Anthropic + calcul scores
│       ├── hooks/
│       │   └── useAuth.js             ← onAuthStateChanged + custom claims
│       ├── data/
│       │   └── questions.js           ← banque de 200 questions (voir section dédiée)
│       └── pages/
│           ├── LoginPage.jsx
│           ├── RegisterPage.jsx
│           ├── QuizPage.jsx
│           ├── DonePage.jsx
│           ├── AdminPage.jsx
│           ├── JurorPage.jsx
│           └── DetailPage.jsx
```

---

## Banque de questions — `src/data/questions.js`

Générer exactement **200 questions** réparties comme suit :

| Domaine    | Débutant | Intermédiaire | Expert | Total |
|------------|----------|---------------|--------|-------|
| Réseaux    | 14       | 14            | 12     | 40    |
| Web        | 14       | 14            | 12     | 40    |
| Cryptographie | 13    | 13            | 14     | 40    |
| Forensics  | 13       | 14            | 13     | 40    |
| Reverse    | 14       | 13            | 13     | 40    |

**Structure d'une question :**
```js
{
  id: 'NET-BEG-001',          // domaine-niveau-numéro
  domain: 'Réseaux',          // Réseaux | Web | Cryptographie | Forensics | Reverse
  level: 'Débutant',          // Débutant | Intermédiaire | Expert
  text: 'Question complète…', // phrase complète, claire, précise
  keywords: ['tcp','udp']     // 3-5 mots-clés pour évaluation sémantique
}
```

**Règles de rédaction des questions :**
- Débutant : concepts fondamentaux, définitions, différences basiques
- Intermédiaire : mécanismes d'attaque, protocoles, outils courants
- Expert : exploitation avancée, reverse engineering, cryptanalyse, forensics poussé
- Chaque question doit être une question ouverte (pas de QCM)
- Formulations variées : "Expliquez…", "Décrivez…", "Comment…", "Analysez…", "Quelle est la différence…"

**Exemples de questions attendues par domaine :**

Réseaux Débutant : différence TCP/UDP, rôle du DNS, qu'est-ce qu'un VPN, modèle OSI, NAT, ARP, pare-feu stateful vs stateless, DHCP, sous-réseaux, hub vs switch vs routeur, DoS, ports standards…
Réseaux Intermédiaire : ARP spoofing vs DNS poisoning, IDS/IPS, three-way handshake exploitation, MITM, BGP hijacking, DDoS amplification DNS, TLS 1.3 handshake, TCP session hijacking, Nmap scan types, zero trust…
Réseaux Expert : BGP route leak, VLAN hopping, ICMP tunneling, covert channels IP headers, IDS evasion, SS7 vulnerabilities, DNSSEC, traffic analysis, IPv6 risks…

Web Débutant : injection SQL, XSS types, CSRF, cookies sécurité, HTTPS, same-origin policy, clickjacking, headers sécurité, LFI/RFI, OWASP Top 10, JWT, path traversal…
Web Intermédiaire : SSRF, XXE, CORS misconfiguration, désérialisation, race condition, SSTI, IDOR, HTTP smuggling, WAF bypass, OAuth misconfiguration, subdomain takeover, open redirect…
Web Expert : prototype pollution, SQL blind time-based, CSP bypass, GraphQL introspection, cache poisoning CDN, WebSockets attacks, DOM clobbering, dangling markup, JSONP abuse…

Cryptographie Débutant : symétrique vs asymétrique, hash, signature numérique, RSA, X.509, MD5/SHA1/SHA256, salt, clé publique/privée, Diffie-Hellman, PKI, César, HMAC, PFS…
Cryptographie Intermédiaire : padding oracle CBC, birthday attack, chosen plaintext AES-ECB, length extension, modes CBC/CTR/GCM, nonce reuse, ECDSA k reuse, RSA PKCS1.5, timing side-channel, CSPRNG…
Cryptographie Expert : ECDSA lattice attacks, Bleichenbacher, fault injection smartcard, algorithmes post-quantiques Shor/Grover, invalid curve attacks, homomorphic encryption, cache timing Flush+Reload…

Forensics Débutant : étapes investigation, chain of custody, logs Windows, volatilité données, artefacts Windows, copie forensique, timeline, IoC, registre Windows, triage incident…
Forensics Intermédiaire : processus parent inhabituel, persistance malware, analyse PCAP exfiltration, fichiers supprimés NTFS, Volatility, prefetch Windows, mouvement latéral AD, élévation privilèges logs, webshell détection, amcache/shimcache…
Forensics Expert : rootkit kernel-mode mémoire, firmware UEFI forensics, timeline cross-système, LOTL attacks détection, WMI artefacts, Docker forensics, supply chain forensics, CloudTrail AWS, AD compromis total, fileless malware…

Reverse Débutant : qu'est-ce que le RE, statique vs dynamique, désassembleur vs décompilateur, assembleur x86 registres, format PE, packers, débogage breakpoints, pile/tas, IAT, calling convention cdecl, obfuscateur, bytecode…
Reverse Intermédiaire : anti-debugging contournement, UPX dépacking manuel, shellcode analyse, malware type identification, protocole réseau propriétaire RE, DLL malveillante, algorithme chiffrement custom Ghidra/IDA, process hollowing, PowerShell obfusqué déobfuscation, dropper analyse, C2 identification…
Reverse Expert : déobfuscation chiffrement flux custom, rootkit kernel-mode Windows, code virtualization VMProtect, protocole C2 chiffré émulateur, ROP chains identification, firmware IoT extraction, heap exploitation tcache poisoning, metamorphisme/polymorphisme, ransomware faiblesses crypto, Android smali jadx, format string x86…

---

## Algorithme de tirage des questions — `src/data/questions.js`

```js
export function pickQuestions(nq = 5) {
  // 1. Mélanger les domaines
  // 2. Pour chaque position, prendre un domaine différent
  // 3. Niveau tiré selon répartition : 33% Débutant / 34% Intermédiaire / 33% Expert
  // 4. Question tirée aléatoirement dans le pool domaine+niveau
  // 5. Garantir qu'aucune question ne se répète dans la session
  // Retourner tableau de nq questions
}
```

---

## Détection IA — `src/lib/aiDetect.js`

### Fonction principale
```js
export async function detectAI(question, answer) {
  // Appel à https://api.anthropic.com/v1/messages
  // Modèle : claude-sonnet-4-20250514
  // Retourne : { aiScore: 0-100, contentScore: 0-100 }
  // aiScore : probabilité que la réponse soit générée par IA
  // contentScore : qualité technique de la réponse
}
```

### Système prompt pour la détection IA
```
Tu es un évaluateur expert en cybersécurité et en détection de contenu généré par IA
pour un quiz de sélection de candidats jobdating. Analyse la réponse fournie et retourne
UNIQUEMENT un objet JSON valide sans markdown ni backticks.

Format exact : {"aiScore":0-100,"contentScore":0-100}

aiScore — Probabilité que la réponse soit générée par IA (0=humain authentique, 100=IA évident).
Signaux IA positifs : style encyclopédique générique, formules de transition typiques
("il convient de noter", "il est essentiel de", "notamment", "en conclusion", "parmi les
approches les plus pertinentes"), absence d'erreurs ou d'hésitations, structure trop parfaite,
absence d'expériences personnelles ou d'outils cités, vocabulaire trop homogène, longueur
disproportionnée, absence de jargon naturel de praticien, réponse trop complète et équilibrée.
Signaux humains : erreurs mineures acceptables, jargon technique naturel, outil spécifique cité,
expérience personnelle mentionnée ("j'ai testé", "en CTF"), hésitations ou imprécisions,
style direct et non scolaire.

contentScore — Qualité technique de la réponse (0=faux ou vide, 100=réponse d'expert précise).
Evaluer : exactitude technique, précision des mécanismes décrits, profondeur de compréhension,
pertinence des exemples, maîtrise du vocabulaire du domaine.
```

### Calcul du score final
```js
export function computeFinalScore(answeredQuestions) {
  // Pour chaque question :
  //   penalty = aiScore >= 65 ? 0.40 : aiScore >= 35 ? 0.20 : 0
  //   adjustedScore = contentScore - Math.round(contentScore * penalty)
  // Score final = moyenne des adjustedScores
  // Retourner { finalScore, rawScore, totalPenalty, breakdown[] }
}
```

**Seuils de décision :**
- `finalScore >= 70` → `accepted` (profil qualifié pour le jobdating)
- `finalScore >= 50` → `review` (révision manuelle par le jury)
- `finalScore < 50`  → `rejected`

---

## Firebase — `src/lib/firebase.js`

```js
// Initialiser Firebase avec les variables d'environnement VITE_
// Exporter : auth, db (Firestore)
// Exporter : loginWithGoogle()   → signInWithPopup(googleProvider)
// Exporter : loginWithFacebook() → signInWithPopup(facebookProvider)
// Exporter : logout()
// Google provider : addScope('email', 'profile')
// Facebook provider : addScope('email', 'public_profile')
```

---

## Firestore — `src/lib/firestore.js`

### Collections

**`candidates/{uid}`**
```js
{
  uid, name, email, photoURL,
  source: 'google' | 'facebook',
  profile: 'Étudiant' | 'Professionnel' | 'Chercheur' | 'Indépendant',
  phone,                    // optionnel
  linkedinUrl,              // optionnel
  quizDone: false,
  registeredAt: serverTimestamp()
}
```

**`submissions/{uid}`**
```js
{
  candidateId, name, email, photoURL,
  questions: [{
    id, domain, level, text, keywords,
    answer, aiScore, contentScore, adjustedScore
  }],
  rawScore, totalPenalty, finalScore,
  status: 'accepted' | 'review' | 'rejected',
  assignedTo: null | jurorUid,
  submittedAt: serverTimestamp()
}
```

**`overrides/{submissionId}`**
```js
{
  candidateId, status,
  justification,            // texte libre, minimum 20 caractères OBLIGATOIRE
  jurorId, jurorName,
  previousStatus,           // statut avant override
  decidedAt: serverTimestamp()
}
```

**`settings/hackathon`**
```js
{
  open: true,               // inscriptions ouvertes
  aiActive: true,           // détection IA activée
  threshold: 70,            // seuil acceptation auto
  nq: 5,                    // nombre de questions par session
  jobdatingDate: null,      // date de l'événement
  maxCandidates: null       // limite candidatures (null = illimité)
}
```

### Fonctions à exporter
```js
getCandidate(uid)
upsertCandidate(uid, data)
saveSubmission(uid, payload)
getSubmission(uid)
getAllSubmissions()
getSubmissionsByStatus(status)
getSubmissionsByJuror(jurorId)
assignToJuror(submissionId, jurorId)
applyJuryDecision(submissionId, status, justification, juror)
getSettings()
saveSettings(data)
```

---

## Pages et comportements

### LoginPage (`/login`)
- Deux boutons : **Continuer avec Google** (rouge Google) + **Continuer avec Facebook** (bleu #1877F2)
- Lien discret "Accès jury / admin" en bas
- Après connexion OAuth :
  - Si candidat sans quiz → `/quiz`
  - Si candidat avec quiz → `/done`
  - Si rôle `admin` → `/admin`
  - Si rôle `juror` → `/jury`

### RegisterPage (`/register`)
- Formulaire : prénom, nom, email (pré-rempli si dispo), téléphone, profil (select), URL LinkedIn (optionnel)
- Enclenché uniquement si le profil Firestore est incomplet après OAuth
- Bouton "Sauvegarder et démarrer le quiz"

### QuizPage (`/quiz`)
- Barre de progression en haut
- Affichage : numéro question, badge domaine, badge niveau (coloré par niveau)
- Zone de texte (min-height 120px, resize vertical)
- Compteur de caractères en temps réel
- **Analyse IA déclenchée automatiquement après 1800ms d'inactivité** si la réponse dépasse 80 caractères
- Indicateur visuel IA : barre de progression colorée (vert < 35%, orange 35-65%, rouge > 65%)
- Message d'avertissement si aiScore > 65% : "⚠ Style indicatif d'une réponse générée par IA — votre score sera pénalisé"
- Navigation : Précédent / Suivant (désactivé si < 50 caractères) / Soumettre
- Pas de retour possible après soumission

### DonePage (`/done`)
- Confirmation de soumission
- Affichage : score brut, pénalité IA, score final, verdict (badge coloré)
- Message différencié selon statut : accepté / révision / refusé
- Pas de détail des réponses visible par le candidat

### AdminPage (`/admin`) — rôle `admin` uniquement
- Stats : total candidatures, acceptés, en révision, refusés, score moyen
- Onglets : "En révision" | "Toutes les candidatures" | "Gestion jurés" | "Paramètres"

**Onglet En révision :**
- Liste des candidatures status='review' avec : avatar initiales, nom, email, profil, score final, badge statut, juré assigné
- Bouton "Voir le dossier"

**Onglet Toutes les candidatures :**
- Filtre par statut + recherche par nom/email
- Export CSV des candidatures (bouton)

**Onglet Gestion jurés :**
- Liste des jurés avec leurs dossiers attribués
- Sélecteur pour attribuer un dossier à un juré
- Indicateurs : nb dossiers en attente / traités

**Onglet Paramètres :**
- Toggles : inscriptions ouvertes, détection IA active
- Inputs : seuil d'acceptation, nb questions, date jobdating, max candidats
- Bouton "Enregistrer"

### JurorPage (`/jury`) — rôles `juror` et `admin`
- Stats : dossiers à traiter, traités
- Liste uniquement des dossiers `assignedTo === currentUser.uid` ET `status === 'review'`
- Bouton "Évaluer" sur chaque ligne

### DetailPage (`/detail/:id`) — rôles `juror` et `admin`
- Profil complet du candidat (avatar, nom, email, profil, LinkedIn si renseigné)
- Scores : brut, pénalité IA, final
- Pour chaque question :
  - Badges domaine + niveau + score contenu + indice IA
  - Texte de la question
  - Réponse du candidat
- **Zone de décision** (uniquement si status='review' ET utilisateur habilité) :
  - Boutons : Accepter / Refuser
  - Au clic : panneau de justification obligatoire (textarea, min 20 caractères)
  - Confirmation bloquée si justification vide ou trop courte
  - Trace : juré + horodatage + texte justification affiché dans le dossier
- Bouton retour contextuel (vers /admin ou /jury selon le rôle)

---

## Sécurité

### Règles Firestore (`firebase/firestore.rules`)
```
candidates/{uid}   : lecture/écriture = auth.uid == uid OU role in [admin, juror]
submissions/{uid}  : création = auth.uid == uid
                     lecture  = auth.uid == uid OU role in [admin, juror]
                     update   = role == admin OU (role == juror ET assignedTo == auth.uid ET status == 'review')
overrides/{id}     : écriture = role in [admin, juror]
                     lecture  = role == admin
settings/hackathon : lecture  = auth != null
                     écriture = role == admin
```

### Custom claims Firebase (rôles)
- Assigner via Firebase Admin SDK (script `firebase/set-roles.js`)
- Claims : `{ role: 'admin' | 'juror' | 'candidate' }`
- Lecture dans `useAuth.js` via `getIdTokenResult()`

---

## Design UI

**Palette cybersécurité — sobre et technique :**
- Background principal : `#0D0F14` (quasi-noir)
- Background secondaire : `#151820`
- Accent principal : `#00D4AA` (teal/cyan)
- Accent secondaire : `#5B6EF5` (indigo)
- Texte primaire : `#E8EAF0`
- Texte secondaire : `#8B92A8`
- Bordures : `#252A38`
- Succès : `#22C55E`
- Attention : `#F59E0B`
- Danger : `#EF4444`

**Typographie :**
- Titres : `'JetBrains Mono'` (Google Fonts) — cohérent avec l'univers cybersec
- Corps : `'Inter'` (acceptable ici car usage fonctionnel)
- Tailles : base 14px, titres 18-24px

**Composants clés :**
- Barres de score : colorées dynamiquement (vert/orange/rouge selon seuil)
- Badges niveau : Débutant=vert, Intermédiaire=orange, Expert=rouge
- Badges domaine : teal
- Boutons Google : fond blanc, texte noir, logo SVG Google
- Boutons Facebook : fond #1877F2
- Formulaires : fonds sombres, focus teal
- Toasts de notification pour les succès/erreurs

---

## Docker — `frontend/Dockerfile`

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:1.25-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
```

## `docker-compose.yml`

```yaml
version: "3.9"
services:
  frontend:
    build:
      context: ./frontend
    container_name: hackathon-quiz
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/conf.d/default.conf:ro
      - ./nginx/certs:/etc/nginx/certs:ro
    env_file: .env
networks:
  default:
    name: hackathon-net
```

---

## Variables d'environnement — `.env.example`

```
# Firebase
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MESSAGING_SENDER_ID=

# Anthropic
VITE_ANTHROPIC_API_KEY=

# App
VITE_APP_URL=https://hackathon.eqima.org
```

---

## Nginx — `nginx/nginx.conf`

```nginx
server {
    listen 80;
    server_name _;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    ssl_certificate     /etc/nginx/certs/fullchain.pem;
    ssl_certificate_key /etc/nginx/certs/privkey.pem;
    ssl_protocols       TLSv1.2 TLSv1.3;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(js|css|woff2|png|svg|ico)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://apis.google.com https://connect.facebook.net; connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://api.anthropic.com; frame-src https://accounts.google.com https://*.firebaseapp.com https://www.facebook.com;";
}
```

---

## Note de sécurité importante

> La clé `VITE_ANTHROPIC_API_KEY` est exposée dans le bundle client.
> En production, migrer les appels de détection IA vers une **Firebase Cloud Function**
> qui proxy les requêtes Anthropic côté serveur, ou un endpoint Spring Boot
> sur la Gateway EQIMA existante.
>
> Priorité post-MVP : créer `functions/detectAI.js` (Firebase Functions)
> et remplacer l'appel direct dans `aiDetect.js`.

---

## Ordre de génération recommandé pour Claude Code

1. `src/data/questions.js` — les 200 questions complètes + `pickQuestions()`
2. `src/lib/firebase.js` + `src/lib/firestore.js` + `src/lib/aiDetect.js`
3. `src/hooks/useAuth.js`
4. `src/App.jsx` + `src/main.jsx`
5. `src/pages/LoginPage.jsx` + `RegisterPage.jsx`
6. `src/pages/QuizPage.jsx`
7. `src/pages/DonePage.jsx`
8. `src/pages/AdminPage.jsx` + `JurorPage.jsx` + `DetailPage.jsx`
9. `firebase/firestore.rules` + `firebase/set-roles.js`
10. `frontend/Dockerfile` + `docker-compose.yml` + `nginx/nginx.conf`
11. `.env.example` + `README.md`
