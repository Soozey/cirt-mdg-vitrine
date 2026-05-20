# CIRT MDG - Site vitrine

Site vitrine simple et responsive pour le Sommet de la Cybersécurité Madagascar - 1ère édition 2026.

## Stack

- React
- TypeScript
- Vite
- CSS natif

## Commandes

```bash
npm install
npm run dev
npm run build
npm run preview
```

Sous PowerShell, si `npm` est bloqué par la politique d’exécution locale, utiliser :

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run build
npm.cmd run preview
```

## Contenu

La page affiche uniquement les informations validées du projet :

- titre du sommet ;
- phrase de positionnement ;
- date et lieu ;
- compte à rebours discret ;
- informations essentielles avec pages de détail statiques ;
- axes thématiques ;
- contact statique sans backend ;
- lien vers le site officiel du CIRT MDG : https://cirt.gov.mg/
- page séparée `#/documents/claude` pour consulter le fichier `CLAUDE.md`.

Aucun backend, aucune base de données, aucun service Firebase et aucun système d’authentification ne sont utilisés.

## Assets

Le fichier `public/cirt-mdg-logo.svg` est utilisé comme logo principal, à partir du visuel CIRT MDG fourni dans la conversation.

Le fichier `D:\cybersécurité\CLAUDE.md` a été copié dans `public/documents/CLAUDE.md` pour consultation sur une page dédiée. Il reste séparé de la page vitrine.

## Contact

Les boutons `S’inscrire`, `Devenir sponsor` et `Programme à venir` sont actifs et pointent vers des sections internes. Les actions externes renvoient vers le site officiel du CIRT MDG tant qu’aucune adresse email ou URL spécialisée n’est fournie.
