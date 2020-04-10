# Lien de visualisation : [Lien](https://portfolio-bastien-chantrel.000webhostapp.com/index.html)


# Présentation

Nous devions réaliser une application web qui permet de gérer au mieux la présence des étudiants en classe.

Cette application doit être utile pour les étudiants, les formateurs et l’école.

Les questions auxquelles notre application doit répondre au minimum sont les suivantes :

1. En temps qu’étudiant, comment avertir le formateur de mon retard ou de mon absence.

2. En temps que formateur, comment noter les étudiants présents/absents/en retard sans perdre de temps en début de cours

3. Pour l’école, comment avoir accès à une synthèse permettant de connaître les étudiants présents, absents ou en retard par classe, par élève.


# Connection Test

- Élève : 
Identifiant : robertTest
Mot de passe : 123

- Formateur : 
Identifiant : michelTest
Mot de passe : 456

- Administrateur : 
Identifiant : carlosTest
Mot de passe : 789

## Technologies utilisées

- ## Template de base 

> [SB Admin 2](https://github.com/BlackrockDigital/startbootstrap-sb-admin-2)


- Jquery
> [Smooth Scroll](https://www.design-fluide.com/17-11-2013/un-defilement-anime-smooth-scroll-en-jquery-sans-plugin/)

## Gestion des données




# Wireframe

## Espace Connection

Aucunes données affichées 

Données envoyées :

- Identifiant
- Mot de passe
- Poste 

Accèes à un espace "Mot de passe oublié" qui permet de récuperer son mot de passe avec son identifiant et son adresse mail .
Si l'utilisateur à oublié son identifiant, il devra aller voir l'administration directement pour obtenir ses informations personelles .



## Espace Etudiant


L'élève aura accèes a toutes ses informations sur une seule page .
Cete page est "Mobile Friendly" pour faciliter la visibilité auprès des élèves qui pourront consulter ses informations via leurs téléphones .

Données affichées :

- Eleve -> Nom
- Eleve -> Prenom
- Eleve -> Classe
- Classe -> Statut

Données envoyées :

// Prévenir formateur
- Eleve -> Nom
- Eleve -> Prenom
- Eleve -> Classe
- Eleve -> Formateur
- Eleve -> Justificatif

// Justifier absence
- Eleve -> Nom
- Eleve -> Prenom
- Eleve -> Classe
- Eleve -> Abscence
- Eleve -> Message
- Eleve -> Justificatif

## Espace Formateur

Rien pour le moment

## Espace Admin

Rien pour le moment