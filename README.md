# Système de Gestion des Bornes de Recharge Électrique

Ce projet est une application web permettant de visualiser, rechercher et réserver des bornes de recharge pour véhicules électriques. L'application utilise une architecture microservices avec Docker pour l'orchestration.

## Architecture

Le projet est composé de trois services principaux :
- **Frontend** : Application React pour l'interface utilisateur
- **Backend** : API REST en Node.js/Express
- **Base de données** : MongoDB pour le stockage des données

## Prérequis

- Docker
- Docker Compose
- Node.js (pour le développement local)

## Installation

1. Clonez le dépôt :
```bash
git clone https://github.com/blvck2371/TP-Docker-Bornes-pour-vehicules-electriques
cd TP-Docker-Bornes-pour-vehicules-electriques
```

2. Lancez l'application avec Docker Compose :
```bash
docker-compose up --build
```

L'application sera accessible à :
- Frontend : http://localhost:3000
- Backend API : http://localhost:5000

## Structure du Projet

```
.
├── frontend/              # Application React
│   ├── src/
│   │   ├── components/    # Composants React
│   │   ├── services/      # Services API
│   │   └── App.js         # Point d'entrée
│   └── package.json
├── backend/               # API Node.js
│   ├── config/           # Configuration
│   ├── models/           # Modèles MongoDB
│   ├── routes/           # Routes API
│   ├── data/             # Données initiales
│   └── server.js         # Point d'entrée
└── docker-compose.yml    # Configuration Docker
```

## Fonctionnalités

### Frontend
- Visualisation des bornes sur une carte interactive
- Recherche et filtrage des bornes
- Affichage des détails des bornes
- Système de réservation
- Géolocalisation de l'utilisateur

### Backend
- API REST complète
- Gestion des stations de recharge
- Système de réservation
- Importation des données initiales
- Validation des données

## API Endpoints

### Stations
- `GET /api/stations` - Liste toutes les stations
- `GET /api/stations/:id` - Détails d'une station
- `POST /api/stations` - Créer une nouvelle station
- `PUT /api/stations/:id` - Mettre à jour une station
- `DELETE /api/stations/:id` - Supprimer une station

### Réservations
- `GET /api/reservations` - Liste toutes les réservations
- `POST /api/reservations` - Créer une nouvelle réservation
- `DELETE /api/reservations/:id` - Annuler une réservation

## Développement

### Configuration de l'environnement
1. Créez un fichier `.env` dans le dossier backend :
```
PORT=5000
MONGODB_URI=mongodb://admin:password@mongodb:27017/charging_stations?authSource=admin
```

### Commandes utiles
```bash
# Développement frontend
cd frontend
npm install
npm start

# Développement backend
cd backend
npm install
npm start

# Tests
npm test
```

## Technologies Utilisées

- **Frontend** :
  - React
  - Material-UI
  - Leaflet (cartes)
  - Axios (requêtes HTTP)

- **Backend** :
  - Node.js
  - Express
  - MongoDB
  - Mongoose

- **Infrastructure** :
  - Docker
  - Docker Compose

## Sécurité

- CORS configuré pour le frontend
- Validation des données côté serveur
- Protection des routes API
- Gestion sécurisée des mots de passe MongoDB

## Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails. 
