# Mise en place de l'environnement de production

Ce document guide la personne qui configure Firebase et remplit le fichier `.env` de production pour le Cybersecurity Summit. L'objectif est d'obtenir une application connectée au vrai projet Firebase, avec Google comme unique méthode de connexion pour le parcours quiz.

## 1. Préparer le projet Firebase

1. Aller sur `https://console.firebase.google.com`.
2. Créer un projet ou ouvrir le projet Firebase de production.
3. Vérifier que le projet sélectionné est bien celui qui recevra les comptes, les quiz, les rôles admin/juré, les inscriptions et les demandes partenaires.
4. Noter le `Project ID` affiché dans les paramètres du projet. Il servira à remplir `VITE_FIREBASE_PROJECT_ID` et `FIREBASE_PROJECT_ID`.

## 2. Créer ou retrouver l'application Web Firebase

1. Dans la console Firebase, ouvrir `Project settings`.
2. Dans l'onglet `General`, descendre jusqu'à `Your apps`.
3. Si aucune application Web n'existe, cliquer sur l'icône Web `</>` et créer une application.
4. Copier la configuration affichée dans le bloc `firebaseConfig`.
5. Reporter chaque valeur dans `.env` :

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
```

## 3. Configurer Firebase Authentication

1. Dans Firebase Console, ouvrir `Build > Authentication`.
2. Cliquer sur `Get started` si Authentication n'a pas encore été initialisé.
3. Aller dans `Sign-in method`.
4. Activer uniquement `Google`.
5. Renseigner l'email de support demandé par Firebase pour le fournisseur Google.
6. Laisser `Email/Password` désactivé.
7. Laisser `Facebook` désactivé.
8. Aller dans `Settings > Authorized domains`.
9. Ajouter le domaine public de production, par exemple `summit.example.com`.
10. Ajouter aussi les domaines de préproduction si l'équipe les utilise.

Le parcours quiz ne propose plus de connexion par email/mot de passe ni de connexion Facebook. Si Google n'est pas activé ou si le domaine public n'est pas autorisé, les utilisateurs ne pourront pas entrer dans le quiz.

## 4. Configurer Firestore

1. Dans Firebase Console, ouvrir `Build > Firestore Database`.
2. Créer la base si elle n'existe pas.
3. Choisir le mode de production.
4. Choisir une région cohérente avec l'hébergement et l'équipe.
5. Déployer les règles du dépôt avec la CLI Firebase quand le projet est prêt :

```bash
npx -y firebase-tools@latest deploy --only firestore:rules --project <PROJECT_ID>
```

## 5. Configurer le compte de service serveur

Le serveur utilise Firebase Admin pour créer les sessions, gérer les rôles, lire et écrire dans Firestore, et traiter les opérations protégées.

1. Dans Firebase Console, ouvrir `Project settings`.
2. Aller dans `Service accounts`.
3. Cliquer sur `Generate new private key`.
4. Télécharger le fichier JSON.
5. Stocker ce fichier dans un emplacement privé du serveur, jamais dans Git.
6. Choisir une des deux méthodes suivantes dans `.env` :

Méthode fichier :

```env
GOOGLE_APPLICATION_CREDENTIALS=/chemin/absolu/service-account.json
```

Méthode variable JSON :

```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

La méthode fichier est généralement plus lisible sur VPS. La méthode JSON est pratique sur certaines plateformes qui gèrent les secrets sous forme de variables.

## 6. Remplir chaque variable `.env`

### `VITE_FIREBASE_API_KEY`

Valeur `apiKey` du bloc `firebaseConfig`.

Elle identifie l'application Web Firebase côté navigateur. Ce n'est pas une clé serveur, mais elle doit correspondre au projet Firebase de production.

### `VITE_FIREBASE_AUTH_DOMAIN`

Valeur `authDomain` du bloc `firebaseConfig`, souvent sous la forme `<PROJECT_ID>.firebaseapp.com`.

Elle est utilisée par Firebase Authentication pour les popups Google.

### `VITE_FIREBASE_PROJECT_ID`

Valeur `projectId` du bloc `firebaseConfig`.

Elle doit être identique au projet Firestore, Auth et Admin SDK utilisés en production.

### `VITE_FIREBASE_APP_ID`

Valeur `appId` du bloc `firebaseConfig`.

Elle identifie l'application Web Firebase dans le projet.

### `VITE_FIREBASE_MESSAGING_SENDER_ID`

Valeur `messagingSenderId` du bloc `firebaseConfig`.

Même si l'application n'utilise pas Firebase Cloud Messaging directement, la valeur fait partie de la configuration Web Firebase.

### `VITE_FIREBASE_STORAGE_BUCKET`

Valeur `storageBucket` du bloc `firebaseConfig`, souvent sous la forme `<PROJECT_ID>.appspot.com`.

Elle sert aussi côté serveur pour les fichiers liés aux inscriptions lorsque le stockage est utilisé.

### `VITE_USE_FIREBASE_EMULATOR`

Mettre `false` en production.

```env
VITE_USE_FIREBASE_EMULATOR=false
```

La valeur `true` force l'application à utiliser les émulateurs locaux Auth et Firestore. Elle ne doit pas être utilisée sur le site public.

### `FIREBASE_PROJECT_ID`

Mettre le même Project ID que `VITE_FIREBASE_PROJECT_ID`.

Cette variable est lue côté serveur par Firebase Admin.

### `FIREBASE_SERVICE_ACCOUNT_JSON`

Optionnel si `GOOGLE_APPLICATION_CREDENTIALS` est utilisé.

Contient le JSON complet du compte de service sur une seule ligne. Ne jamais exposer cette valeur côté client, dans le dépôt Git ou dans une image Docker publique.

### `GOOGLE_APPLICATION_CREDENTIALS`

Optionnel si `FIREBASE_SERVICE_ACCOUNT_JSON` est utilisé.

Contient le chemin absolu vers le fichier JSON du compte de service sur le serveur.

### `FIREBASE_ADMINSDK_FILE`

Utilisé par `docker-compose.yml` pour monter le fichier JSON du compte de service dans le conteneur.

Exemple :

```env
FIREBASE_ADMINSDK_FILE=/opt/cirt-summit/secrets/firebase-adminsdk.json
```

Le chemin doit exister sur la machine hôte avant le démarrage de Docker Compose.

## 7. Exemple minimal de `.env` production

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=mon-projet.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mon-projet
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_STORAGE_BUCKET=mon-projet.appspot.com
VITE_USE_FIREBASE_EMULATOR=false

FIREBASE_PROJECT_ID=mon-projet
GOOGLE_APPLICATION_CREDENTIALS=/opt/cirt-summit/secrets/firebase-adminsdk.json
FIREBASE_ADMINSDK_FILE=/opt/cirt-summit/secrets/firebase-adminsdk.json
```

## 8. Vérifications avant mise en ligne

1. `VITE_USE_FIREBASE_EMULATOR=false`.
2. Google est activé dans `Authentication > Sign-in method`.
3. Email/Password est désactivé.
4. Facebook est désactivé.
5. Le domaine public est présent dans `Authentication > Settings > Authorized domains`.
6. `FIREBASE_PROJECT_ID` correspond au même projet que les variables `VITE_FIREBASE_*`.
7. Le fichier Admin SDK existe sur le serveur et n'est pas commité.
8. Les règles Firestore ont été déployées.
9. Le premier superadministrateur a été initialisé via `/bootstrap` avec un compte Google autorisé.
