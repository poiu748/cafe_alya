# ☕ CoffeeManager

**Système complet de gestion de café** développé avec Angular 20 et JSON Server.

Un système de gestion moderne et élégant pour cafés avec interface dark mode inspirée du café (marron, noir, beige).

## 🌟 Fonctionnalités

### ✅ Implémentées
- **🔐 Authentification** : Connexion avec rôles (Admin / Employé)
- **📊 Dashboard** : Statistiques en temps réel (revenus, commandes, clients)
- **☕ Gestion des Produits** : Liste des produits avec catégories et images
- **📋 Gestion des Commandes** : Création, suivi et impression PDF des tickets
- **👥 Gestion des Employés** : Fiches employés avec rôles et horaires
- **📦 Gestion du Stock** : Suivi d'inventaire avec alertes stock faible
- **🎁 Fidélité** : Système de cartes de fidélité avec paliers (Bronze, Silver, Gold, Platinum)
- **🎨 Design Coffee** : Interface dark mode avec thème café élégant et responsive

### 🚧 À développer (extension possible)
- Formulaires d'ajout/édition complets
- Système de chat interne employés
- Menu digital avec QR Code
- Graphiques avec Chart.js
- Gestion des promotions
- Upload d'images produits
- Rapports et exports

## 🚀 Installation

### Prérequis
- Node.js 18+ et npm
- Angular CLI 20+

### Étapes d'installation

1. **Installer les dépendances**
```bash
npm install
```

2. **Lancer le serveur backend (JSON Server)**
```bash
npm run server
```
Le serveur backend démarre sur http://localhost:3000

3. **Dans un autre terminal, lancer l'application Angular**
```bash
npm start
```
L'application démarre sur http://localhost:4200

> **💡 Astuce** : Si vous avez `concurrently` installé, vous pouvez utiliser `npm run dev` pour lancer les deux serveurs en même temps.

## 👤 Comptes de démonstration

### Administrateur
- **Username**: `admin`
- **Password**: `admin123`
- **Accès**: Dashboard, Produits, Commandes, Employés, Stock, Fidélité

### Employé
- **Username**: `employee`
- **Password**: `emp123`
- **Accès**: Dashboard, Produits, Commandes (accès limité)

## 📁 Structure du projet

```
coffee-manager/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── services/       # Services métier
│   │   │   └── guards/         # Guards d'authentification
│   │   ├── models/             # Interfaces TypeScript
│   │   ├── features/           # Modules fonctionnels
│   │   │   ├── auth/          # Composants authentification
│   │   │   ├── dashboard/     # Tableau de bord
│   │   │   ├── products/      # Gestion produits
│   │   │   ├── orders/        # Gestion commandes
│   │   │   ├── employees/     # Gestion employés
│   │   │   ├── inventory/     # Gestion stock
│   │   │   └── loyalty/       # Programme fidélité
│   │   ├── layouts/           # Layout principal avec sidebar
│   │   └── app.routes.ts      # Configuration des routes
│   ├── styles.scss            # Styles globaux (thème café)
│   └── ...
├── db.json                    # Base de données JSON Server
├── package.json
└── README.md
```

## 🎨 Thème et Design

- **Palette de couleurs** : Inspirée du café (noir, marron, beige, or)
- **Mode** : Dark mode par défaut
- **Typographie** : Segoe UI
- **Composants** : Cards, tables, badges, formes stylisées
- **Responsive** : Adapté mobile, tablet et desktop
- **Animations** : Transitions fluides et micro-animations

## 🛠️ Technologies utilisées

- **Frontend** : Angular 20 (Standalone Components)
- **Styling** : SCSS with CSS Variables
- **Backend (dev)** : JSON Server (REST API simulation)
- **HTTP Client** : Angular HttpClient
- **State Management** : RxJS & Services
- **PDF** : jsPDF
- **QR Codes** : angularx-qrcode
- **Charts** : Chart.js (à intégrer)

## 📊 API Endpoints (JSON Server)

```
GET    /users              # Liste des utilisateurs
GET    /products           # Liste des produits
POST   /products           # Créer un produit
PATCH  /products/:id       # Modifier un produit
DELETE /products/:id       # Supprimer un produit

GET    /orders             # Liste des commandes
POST   /orders             # Créer une commande
PATCH  /orders/:id         # Modifier une commande

GET    /employees          # Liste des employés
POST   /employees          # Créer un employé

GET    /inventory          # Liste du stock
POST   /inventory          # Ajouter un article

GET    /loyaltyCards       # Cartes de fidélité
POST   /loyaltyCards       # Créer une carte
```

## 🔧 Configuration

### Variables d'environnement
Les URLs de l'API sont configurées dans les services (`core/services/*.service.ts`).
Par défaut : `http://localhost:3000`

### Personnalisation du thème
Modifiez les variables CSS dans `src/styles.scss` :
```scss
:root {
  --coffee-dark: #1a0f0a;
  --coffee-brown: #3e2723;
  --coffee-gold: #ffb74d;
  // ...
}
```

## 📝 Notes de développement

- **Architecture** : Utilise les Standalone Components d'Angular
- **Lazy Loading** : Les routes utilisent le lazy loading pour optimiser les performances
- **Guards** : AuthGuard pour la protection des routes et contrôle d'accès par rôle
- **Services** : Chaque module a son service dédié (ProductService, OrderService, etc.)
- **Reactive** : Utilise RxJS Observables pour la gestion de l'état

## 🚀 Prochaines étapes

1. Compléter les formulaires CRUD complets
2. Ajouter Chart.js pour les graphiques du dashboard
3. Implémenter le QR Code pour menu digital
4. Créer le système de chat interne
5. Ajouter les filtres et recherche
6. Intégrer un vrai backend (Node.js, .NET, etc.)
7. Ajouter les tests unitaires
8. Déploiement en production

## 📜 License

Ce projet est libre de droits et peut être utilisé/modifié selon vos besoins.

## 💡 Support

Pour toute question ou problème :
1. Vérifiez que JSON Server tourne sur le port 3000
2. Vérifiez que tous les packages sont bien installés
3. Consultez la console du navigateur pour les erreurs

---

Développé avec ☕ et 💻 pour la gestion moderne de cafés
