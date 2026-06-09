# Vue d'ensemble de l'application

Cette application est le portail web du Cybersecurity Summit CIRT. Elle couvre la vitrine publique de l'evenement, les inscriptions, le quiz candidat, l'evaluation jury et les interfaces d'administration.

## Interfaces publiques

La page d'accueil presente l'evenement, ses objectifs, les informations pratiques, les partenaires et les appels a l'action vers les formulaires d'inscription. Les visiteurs peuvent consulter les pages d'informations, les conditions generales d'utilisation et la page partenaires.

Les formulaires publics permettent de collecter plusieurs types d'inscriptions :

- Visiteur : inscription billetterie avec statut de paiement ou invitation.
- CTF / Hackathon : inscription individuelle ou en equipe.
- Job Dating : inscription avec profil technique, portfolio et CV.
- Ateliers : inscription a une session de workshop.
- Newsletter : collecte de contacts pour les communications.

Chaque inscription est enregistree dans Firebase et peut recevoir un QR code de reference.

## Authentification et profils

L'authentification se fait avec Firebase Auth, principalement via Google. Apres connexion, l'application hydrate le profil utilisateur depuis la collection `users`.

Un nouvel utilisateur est candidat par defaut. Lors de la finalisation du profil, une invitation de role en attente peut etre consommee si l'email ou le telephone correspond. Le role attribue peut etre `candidate`, `juror`, `admin` ou `superadmin`.

Les roles controlent les redirections et l'acces aux interfaces protegees :

- Candidat : acces au quiz.
- Jure : acces aux evaluations.
- Administrateur : acces a l'administration et aux evaluations.
- Superadministrateur : acces a la superadministration, l'administration et les evaluations.

## Parcours candidat

Le candidat se connecte, complete son profil si necessaire, puis accede au QCM cybersécurité.

Le quiz ne demarre pas automatiquement a l'arrivee sur la page. L'utilisateur voit d'abord un ecran de preparation qui indique que la premiere question et le minuteur apparaitront apres le clic sur `Commencer le quiz`.

Apres le demarrage :

- les questions sont selectionnees pour la session ;
- le minuteur s'execute uniquement pendant le quiz actif ;
- l'utilisateur choisit une reponse par question ;
- la soumission finale est possible lorsque toutes les questions sont repondues ;
- a la fin du temps imparti, le quiz est soumis automatiquement.

Si l'utilisateur se deconnecte pendant le quiz, le brouillon local est supprime, le minuteur s'arrete et le quiz en cours est annule.

## Interface jury

L'interface jury permet aux membres autorises de consulter les soumissions de quiz et d'evaluer les candidats. Les notes et scores jury sont associes aux soumissions et changent leur statut en `reviewed`.

## Interface administration

L'interface administration permet aux administrateurs et superadministrateurs de consulter les soumissions de quiz. Les utilisateurs autorises peuvent supprimer une soumission lorsque leur role le permet.

## Interface superadministration

La superadministration regroupe les operations sensibles.

### Invitations de role

Un superadministrateur peut creer des invitations de role par email ou par telephone. Les roles disponibles sont :

- Superadministrateur
- Administrateur
- Jure

Une invitation peut etre en attente, utilisee ou revoquee. Quand un utilisateur finalise son profil avec un email ou telephone correspondant, l'invitation est marquee comme utilisee et le role est applique au profil et aux claims Firebase.

### Utilisateurs a role

La vue `Utilisateurs a role` liste les utilisateurs staff : superadministrateurs, administrateurs et jures.

Un superadministrateur peut retirer tous les roles staff d'un utilisateur. L'utilisateur redevient candidat et perd l'acces aux interfaces superadmin, admin et jury. L'application empeche de retirer ses propres roles et empeche de retirer le dernier superadministrateur.

### Demandes partenaires

La vue partenaires liste les demandes de packages ou sponsors. Les superadministrateurs peuvent filtrer, exporter en CSV, changer le statut et archiver une demande.

### Inscriptions publiques

Les vues d'inscriptions affichent toutes les inscriptions ou un formulaire specifique : visiteurs, CTF, job dating, ateliers ou newsletter. Les donnees peuvent etre filtrees, exportees en CSV ou PDF, et les inscriptions peuvent etre masquees du tableau.

## Deconnexion

La deconnexion passe par une confirmation. Si un quiz est en cours, la confirmation indique que le quiz sera annule et que le minuteur s'arretera. Apres confirmation, l'utilisateur est redirige vers la page de connexion.

## Donnees principales

Les collections Firebase principales sont :

- `users` : profils, roles, etat d'inscription et statut quiz.
- `roleInvites` : invitations de role.
- `quiz` : soumissions de quiz et evaluations.
- `partnershipLeads` : demandes partenaires.
- `eventRegistrations` : inscriptions publiques.
- `appConfig` : configuration initiale du bootstrap superadmin.

## Parcours de configuration initiale

Quand l'application n'a pas encore de superadministrateur configure, la route de bootstrap permet de creer le premier compte superadmin. Une fois la configuration terminee, la route de bootstrap n'est plus accessible publiquement.
