# Audit Codex

Date : 2026-05-20

## État initial constaté

- Le dossier `D:\cirt-mdg-vitrine` était vide et n’était pas un dépôt Git local.
- Le dépôt distant `https://github.com/Soozey/cirt-mdg-vitrine.git` répondait, mais ne renvoyait aucune référence Git au moment de l’audit.
- Un projet minimal a donc été créé avec Vite, React et TypeScript.

## Stack réelle

- React
- TypeScript
- Vite
- CSS natif
- Aucun backend
- Aucune base de données
- Aucun service Firebase
- Aucun framework CSS externe

## Éléments inutiles identifiés

Le template Vite initial contenait :

- écran de démarrage Vite ;
- compteur React ;
- liens externes vers Vite, React, GitHub, Discord, X et Bluesky ;
- assets Vite/React (`react.svg`, `vite.svg`, `hero.png`, `favicon.svg`, `icons.svg`) ;
- styles du template Vite.

## Données ou fonctionnalités inventées

Aucune donnée métier préexistante n’a été trouvée dans le dossier initial.

Le fichier `D:\cybersécurité\CLAUDE.md` a été vérifié à la demande du 2026-05-20. Il décrit l’ancienne plateforme complète de quiz/jobdating avec Firebase, Anthropic, admin, jury, authentification et banque de questions. Il a été copié dans `public/documents/CLAUDE.md` et rendu consultable via `#/documents/claude`, sur une page séparée de la vitrine principale.

Les éléments suivants n’existaient pas dans le projet audité et n’ont pas été ajoutés :

- quiz ;
- authentification ;
- inscription réelle ;
- administration ;
- jury ;
- Firebase ;
- Anthropic ;
- détection IA ;
- speakers fictifs ;
- sponsors fictifs ;
- partenaires fictifs ;
- articles fictifs ;
- statistiques fictives ;
- programme détaillé inventé ;
- témoignages ;
- galerie fictive ;
- formulaire connecté ;
- backend ou API.

## Assets logos

- Le logo CIRT MDG fourni en pièce jointe a été intégré sous forme de fichier `public/cirt-mdg-logo.svg`.
- Aucun logo CERT fourni n’a été trouvé dans `public/` ou `src/assets/`.
- Aucun logo CERT n’a été inventé.

## Corrections réalisées

- Remplacement du template Vite par une landing page institutionnelle unique.
- Ajout des sections autorisées uniquement : header, hero, présentation courte, informations essentielles, axes thématiques, contact et footer.
- Suppression du rendu public des liens et éléments Vite/React.
- Suppression des assets inutiles du template.
- Ajout du SEO minimal dans `index.html`.
- Correction de la date de l’événement : 23 au 24 juin 2026.
- Ajout d’un compte à rebours discret.
- Ajout de pages de détail statiques pour les informations essentielles.
- Ajout de la page séparée `#/documents/claude` pour consulter `CLAUDE.md`.
- Préparation du point `CTF étudiant` comme lien externe à renseigner plus tard.
- Ajout d’un bloc contact sans backend avec boutons actifs vers des ancres internes ou le site officiel du CIRT MDG.
- Mise à jour du README avec les commandes exactes.

## Sécurité

- Aucun fichier `.env` réel trouvé.
- Aucun secret ni clé API ajouté.
- Aucun script tiers ajouté.
- Aucun appel API externe.
- Aucun usage de `dangerouslySetInnerHTML`.
- Les liens externes utilisent `rel="noopener noreferrer"`.
- Les boutons pointent vers des ancres internes ou vers `https://cirt.gov.mg/`.

## Notes

Si un logo CERT officiel ou une URL CTF officielle sont fournis plus tard, ils pourront être ajoutés sans créer de contenu fictif.
