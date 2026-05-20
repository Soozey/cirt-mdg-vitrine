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

- Aucun logo CIRT MDG fourni n’a été trouvé dans `public/` ou `src/assets/`.
- Aucun logo CERT fourni n’a été trouvé dans `public/` ou `src/assets/`.
- Aucun faux logo image n’a été créé. La page utilise un marquage texte `CIRT MDG` sobre pour éviter d’inventer un asset officiel.

## Corrections réalisées

- Remplacement du template Vite par une landing page institutionnelle unique.
- Ajout des sections autorisées uniquement : header, hero, présentation courte, informations essentielles, axes thématiques, contact et footer.
- Suppression du rendu public des liens et éléments Vite/React.
- Suppression des assets inutiles du template.
- Ajout du SEO minimal dans `index.html`.
- Ajout d’un bloc contact sans backend avec bouton désactivé `Contact à venir`.
- Mise à jour du README avec les commandes exactes.

## Sécurité

- Aucun fichier `.env` réel trouvé.
- Aucun secret ni clé API ajouté.
- Aucun script tiers ajouté.
- Aucun appel API externe.
- Aucun usage de `dangerouslySetInnerHTML`.
- Les boutons pointent vers des ancres internes ou restent désactivés quand aucune fonction réelle n’existe.

## Notes

Si les logos officiels CIRT MDG ou CERT sont fournis plus tard, les placer dans `public/` ou `src/assets/`, puis remplacer le marquage texte par les images officielles avec des attributs `alt` explicites.
