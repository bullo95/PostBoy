# 📖 Documentation Utilisateur - POSTBOY

## 🎯 Accès à la documentation

La documentation complète est accessible directement dans l'application :

**Bouton flottant** : Cliquez sur le bouton **📖** en bas à droite de l'écran

---

## 📚 Sections disponibles

### 1. Introduction
- Présentation de Postboy
- Pourquoi utiliser Postboy
- Fonctionnalités principales

### 2. Démarrage rapide
- Guide en 5 étapes pour votre première requête
- Configuration de base
- Astuces pour débutants

### 3. Collections
- Créer et organiser des collections
- Exporter une collection
- Supprimer une collection
- Bonnes pratiques d'organisation

### 4. Requêtes HTTP
- Méthodes HTTP supportées (GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS)
- Onglets de configuration :
  - Paramètres (query params)
  - En-têtes (headers)
  - Corps (body)
  - Authentification

### 5. Variables d'environnement
- Créer un environnement
- Ajouter des variables
- Utiliser la syntaxe `{{variable}}`
- Exemples pratiques (dev, staging, production)

### 6. Authentification
- **Bearer Token** : Pour JWT et tokens d'API
- **Basic Auth** : Username/Password encodé en Base64
- **OAuth 2.0** : Access token avec type personnalisable
- Configuration et utilisation

### 7. Historique
- Accéder à l'historique (100 dernières requêtes)
- Informations affichées
- Gestion de l'historique (supprimer, tout supprimer)

### 8. Import / Export
- Exporter une collection au format Postman
- Importer une collection Postman
- Compatibilité et formats supportés

### 9. Génération de code
- 7 langages supportés :
  - cURL
  - JavaScript (Fetch)
  - Node.js (Axios)
  - PHP (cURL)
  - Symfony (HttpClient)
  - Python (Requests)
  - Wget
- Comment générer et copier du code

### 10. Raccourcis clavier
- Raccourcis généraux
- Navigation
- Productivité

---

## 🔍 Recherche dans la documentation

La documentation intégrée dispose d'une **barre de recherche** pour trouver rapidement l'information dont vous avez besoin.

---

## 💡 Fonctionnalités de la documentation

### Navigation intuitive
- **Sidebar** avec toutes les sections
- **Icônes** pour identifier rapidement les sections
- **Recherche** pour filtrer les sections

### Contenu riche
- **Exemples de code** avec coloration syntaxique
- **Instructions pas à pas** numérotées
- **Captures visuelles** des fonctionnalités
- **Astuces et bonnes pratiques** mises en évidence
- **Avertissements** pour les points importants

### Design moderne
- Interface sombre cohérente avec l'application
- Typographie claire et lisible
- Codes couleur pour différencier les types d'information :
  - 🟢 Vert : Succès, bonnes pratiques
  - 🔵 Bleu : Informations, astuces
  - 🟡 Jaune : Avertissements
  - 🔴 Rouge : Erreurs, points critiques

---

## 📖 Guide de démarrage rapide (résumé)

### Étape 1 : Créer une collection
```
Cliquez sur "Nouveau" dans la sidebar
```

### Étape 2 : Ajouter une requête
```
Développez la collection → "Nouvelle Requête"
```

### Étape 3 : Configurer
```
Méthode : GET
URL : https://api.example.com/users
```

### Étape 4 : Envoyer
```
Cliquez sur "Envoyer" → Visualisez la réponse
```

---

## 🌍 Variables d'environnement (exemple)

### Environnement "Production"
```
api_url = https://api.production.com
api_token = prod_abc123xyz
```

### Utilisation dans une requête
```
URL : {{api_url}}/users
Header : Authorization: Bearer {{api_token}}
```

---

## 🔐 Authentification (exemples)

### Bearer Token
```
Token : eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
→ Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Basic Auth
```
Username : admin
Password : password123
→ Authorization: Basic YWRtaW46cGFzc3dvcmQxMjM=
```

### OAuth 2.0
```
Access Token : ya29.a0AfH6SMBx...
Token Type : Bearer
→ Authorization: Bearer ya29.a0AfH6SMBx...
```

---

## 💻 Génération de code (exemple cURL)

```bash
curl -X POST 'https://api.example.com/users' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer token123' \
  -d '{"name":"John Doe","email":"john@example.com"}'
```

---

## ⌨️ Raccourcis clavier principaux

| Action | Raccourci |
|--------|-----------|
| Envoyer la requête | `Ctrl/Cmd + Enter` |
| Nouvelle collection | `Ctrl/Cmd + N` |
| Rechercher | `Ctrl/Cmd + K` |
| Ouvrir l'aide | `F1` |
| Fermer modal | `Esc` |

---

## 📤 Import/Export

### Exporter
```
Survoler collection → Cliquer 📥 → Fichier .json téléchargé
```

### Importer
```
Cliquer 📤 → Sélectionner fichier .json → Collection importée
```

**Format** : Postman Collection v2.1

---

## 🎨 Interface de la documentation

### Caractéristiques
- **Largeur** : 1100px
- **Hauteur** : 800px
- **Sidebar** : 264px avec navigation
- **Contenu** : Zone scrollable avec padding
- **Recherche** : Filtre en temps réel
- **Responsive** : Adapté aux différentes tailles d'écran

### Couleurs
- Fond principal : `#252526`
- Fond secondaire : `#1e1e1e`
- Bordures : `#374151` (gray-700)
- Texte : `#e5e7eb` (gray-100)
- Accents : Bleu, Vert, Jaune, Rouge selon le contexte

---

## 🚀 Conseils d'utilisation

### Pour les débutants
1. Commencez par la section "Démarrage rapide"
2. Créez votre première collection et requête
3. Explorez les onglets de configuration
4. Testez avec une API publique (ex: JSONPlaceholder)

### Pour les utilisateurs avancés
1. Configurez vos environnements (dev, staging, prod)
2. Utilisez les variables partout
3. Configurez l'authentification
4. Générez du code pour vos projets
5. Importez vos collections Postman existantes

### Pour les équipes
1. Exportez vos collections
2. Partagez-les via Git
3. Utilisez les mêmes environnements
4. Documentez vos APIs avec les noms de requêtes

---

## 📞 Support

### Documentation intégrée
Accessible via le bouton **📖** en bas à droite

### Fichiers de référence
- `README.md` - Vue d'ensemble du projet
- `FEATURES.md` - Liste détaillée des fonctionnalités
- `DOCUMENTATION_UTILISATEUR.md` - Ce fichier

### Communauté
- GitHub Issues pour les bugs
- Discussions pour les questions
- Pull Requests pour les contributions

---

## 🔄 Mises à jour

La documentation est mise à jour à chaque nouvelle version de Postboy.

**Version actuelle** : 1.0.0  
**Dernière mise à jour** : Mars 2026

---

## ✨ Fonctionnalités documentées

- ✅ Collections et requêtes
- ✅ Variables d'environnement
- ✅ Authentification (Bearer, Basic, OAuth2)
- ✅ Historique des requêtes
- ✅ Import/Export Postman
- ✅ Génération de code (7 langages)
- ✅ Raccourcis clavier
- ✅ Interface utilisateur

---

**Postboy** - Client API Open Source  
Documentation complète et interactive intégrée dans l'application 📖
