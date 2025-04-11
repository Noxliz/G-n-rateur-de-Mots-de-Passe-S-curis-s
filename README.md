# Générateur de Mots de Passe Sécurisés

Un outil pour créer des mots de passe forts et aléatoires avec des fonctionnalités avancées.

## Fonctionnalités

- Génération cryptographique sécurisée de mots de passe
- Personnalisation de la longueur (8 à 64 caractères)
- Options de composition :
  - Majuscules (A-Z)
  - Minuscules (a-z)
  - Chiffres (0-9)
  - Symboles (!@#$%^&*)
  - Exclusion des caractères similaires (1,l,I,0,O)
- Estimation de la force du mot de passe
- Calcul du temps théorique pour cracker le mot de passe
- Historique des derniers mots de passe générés
- Bouton de copie rapide
- Effacement de l'historique

## Comment utiliser

1. Ouvrez `index.html` dans votre navigateur
2. Configurez les options souhaitées
3. Cliquez sur "Générer"
4. Utilisez le bouton "Copier" pour récupérer le mot de passe

## Technologies utilisées

- HTML5
- CSS3
- JavaScript (API Web Crypto)

## Structure des fichiers

- `index.html` - Structure de la page
- `style.css` - Styles CSS
- `script.js` - Logique de génération

## Sécurité

L'application utilise :
- L'API Web Crypto pour une génération réellement aléatoire
- Aucun stockage externe des mots de passe
- Calculs locaux uniquement

## Auteur

[Votre nom]

## Licence

MIT
