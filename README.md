# 🚀 Postboy

**Postboy** est un client API open source moderne et multi-plateforme, alternative à Postman. Construit avec Electron, React, TypeScript et TailwindCSS.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-macOS%20%7C%20Linux%20%7C%20Windows-lightgrey.svg)

## ✨ Fonctionnalités

- 🌐 **Support complet HTTP** : GET, POST, PUT, DELETE, PATCH, HEAD, OPTIONS
- 📁 **Collections** : Organisez vos requêtes en collections
- 🔧 **Paramètres & En-têtes** : Gestion complète des query params et headers
- 📝 **Corps de requête** : Support JSON, XML, texte brut, Form-data avec upload de fichiers
- 🔐 **Authentification** : Bearer Token, Basic Auth, OAuth 2.0
- 🌍 **Variables d'environnement** : Gérez plusieurs environnements (dev, staging, prod)
- 📊 **Réponses détaillées** : Statut, temps de réponse, taille, headers
- 📜 **Historique détaillé** : Visualisation complète requête par requête (100 dernières)
- 📤 **Import/Export ZIP** : Sauvegarde complète de toutes les collections et environnements
- 💻 **Génération de code** : Snippets en cURL, JavaScript, Node.js, PHP, Symfony, Python, Wget
- 🧪 **Scripts & Tests** : Pre-request scripts et tests automatisés (API Postman-like)
- 🍪 **Gestion des Cookies** : Configuration manuelle des cookies par domaine
- ⚙️ **Settings avancés** : Timeout, proxy, SSL, redirections
- ✨ **Beautify JSON** : Formatage automatique du JSON
- 🎨 **Thème clair/sombre** : Interface adaptable à vos préférences
- 📋 **Duplication** : Dupliquez collections et requêtes en un clic
- 📚 **Aide intégrée** : Guide d'utilisation complet accessible en un clic
- 💾 **Sauvegarde locale** : Vos données restent sur votre machine (localStorage)
- 🔄 **Multi-plateforme** : macOS, Linux, Windows

## 🛠️ Installation

### 📦 Téléchargement des binaires

Téléchargez la dernière version depuis [GitHub Releases](https://github.com/bullo95/PostBoy/releases).

#### macOS (ARM64)

**Option 1 : DMG (recommandé)**
```bash
# Si macOS indique que le fichier est "endommagé", exécuter :
xattr -cr ~/Downloads/Postboy-1.0.0-arm64.dmg
open ~/Downloads/Postboy-1.0.0-arm64.dmg
```

**Option 2 : ZIP (recommandé)**
```bash
# Télécharger et décompresser
unzip Postboy-1.0.1-arm64-mac.zip

# Déplacer dans Applications
mv Postboy.app /Applications/

# Re-signer l'application localement (SOLUTION DÉFINITIVE)
codesign --force --deep --sign - /Applications/Postboy.app

# Lancer l'application
open /Applications/Postboy.app
```

**Note** : L'application n'est pas signée avec un certificat Apple Developer. La commande `codesign` re-signe l'app localement avec un certificat ad-hoc, ce qui permet à macOS de l'accepter.

**Si le message "endommagé" persiste** :
```bash
# Supprimer la quarantaine
xattr -d com.apple.quarantine /Applications/Postboy.app
# Puis re-signer
codesign --force --deep --sign - /Applications/Postboy.app
```

#### Linux (x64)

**Debian/Ubuntu (.deb)**
```bash
sudo dpkg -i postboy_1.0.0_amd64.deb
# Si des dépendances manquent :
sudo apt-get install -f
```

**AppImage (universel)**
```bash
chmod +x Postboy-1.0.0.AppImage
./Postboy-1.0.0.AppImage
```

#### Windows (ARM64)

- **Installateur** : `Postboy Setup 1.0.0.exe`
- **Portable** : `Postboy 1.0.0.exe`

### 🔧 Développement

### Prérequis

- Node.js 18+ 
- npm ou yarn

### Installation

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev
```

### Build

```bash
# Build pour toutes les plateformes
npm run build

# Build spécifique
npm run build:mac        # macOS ARM64
npm run build:win        # Windows
npm run build:linux      # Linux (toutes architectures)
npm run build:linux:x64  # Linux x64 uniquement
```

Les fichiers compilés seront dans le dossier `release/`.

## 🚀 Utilisation

### Requêtes de base

1. **Créer une collection** : Cliquez sur "Nouveau" dans la sidebar
2. **Ajouter une requête** : Développez la collection et cliquez sur "Nouvelle Requête"
3. **Configurer la requête** :
   - Sélectionnez la méthode HTTP
   - Entrez l'URL
   - Ajoutez des paramètres, headers ou un corps si nécessaire
4. **Envoyer** : Cliquez sur "Envoyer" et visualisez la réponse

### Variables d'environnement

1. Cliquez sur l'icône **⚙️ Settings** dans la sidebar
2. Créez un nouvel environnement
3. Ajoutez des variables (ex: `api_url`, `token`)
4. Sélectionnez l'environnement actif
5. Utilisez les variables dans vos requêtes avec `{{nom_variable}}`

**Import/Export d'environnements** :
- **Importer** : Bouton "Importer" dans le gestionnaire d'environnements
- **Exporter un environnement** : Icône 📥 au survol d'un environnement
- **Exporter tous** : Bouton "Tout exporter" dans le header

### Authentification

1. Ouvrez l'onglet **Authentification** dans votre requête
2. Choisissez le type :
   - **Bearer Token** : Pour les APIs avec JWT
   - **Basic Auth** : Username/Password encodé en Base64
   - **OAuth 2.0** : Access token avec type personnalisable
3. Les credentials sont automatiquement ajoutés aux headers

### Import/Export

- **Exporter** : Survolez une collection → cliquez sur l'icône 📥
- **Importer** : Cliquez sur l'icône 📤 → sélectionnez un fichier `.json` Postman

### Historique

- Cliquez sur l'icône **🕐 Clock** pour voir vos 100 dernières requêtes
- Cliquez sur une entrée pour la recharger
- L'historique est sauvegardé localement

### Génération de code

1. Configurez votre requête
2. Cliquez sur le bouton **</>** à côté de "Envoyer"
3. Sélectionnez votre langage :
   - **cURL** : Commande shell universelle
   - **JavaScript** : Fetch API moderne
   - **Node.js** : Avec Axios
   - **PHP** : cURL natif
   - **Symfony** : HttpClient component
   - **Python** : Requests library
   - **Wget** : Alternative à cURL
4. Copiez le code généré en un clic

### Aide en ligne

- Cliquez sur le bouton **?** en bas à droite
- Guide complet avec exemples et astuces
- Documentation des fonctionnalités
- Raccourcis clavier

## 🏗️ Architecture

```
postboy/
├── electron/          # Code Electron (processus principal)
├── src/
│   ├── components/    # Composants React
│   ├── store/         # State management (Zustand)
│   ├── types/         # Types TypeScript
│   ├── utils/         # Utilitaires (HTTP client)
│   ├── App.tsx        # Composant principal
│   └── main.tsx       # Point d'entrée React
├── package.json
└── vite.config.ts
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amazing-feature`)
3. Commit vos changements (`git commit -m 'Add amazing feature'`)
4. Push vers la branche (`git push origin feature/amazing-feature`)
5. Ouvrir une Pull Request

## 📝 Roadmap

- [x] Variables d'environnement ✅
- [x] Import/Export de collections (format Postman) ✅
- [x] Import/Export ZIP complet ✅
- [x] Historique des requêtes détaillé ✅
- [x] Authentification (OAuth, Bearer, Basic) ✅
- [x] Génération de code (7 langages) ✅
- [x] Aide en ligne intégrée ✅
- [x] Tests automatisés (scripts pre/post-request) ✅
- [x] Thèmes personnalisables (clair/sombre) ✅
- [x] Gestion des cookies ✅
- [x] Settings avancés (proxy, timeout, SSL) ✅
- [x] Form-data avec upload de fichiers ✅
- [x] Beautify JSON ✅
- [x] Duplication collections/requêtes ✅
- [ ] WebSocket support
- [ ] GraphQL support natif
- [ ] Certificats SSL personnalisés
- [ ] Mock servers
- [ ] API documentation generator
- [ ] Collaboration en temps réel

## 📄 Licence

MIT © Bruno Domenech

## 🙏 Remerciements

Inspiré par Postman, construit avec amour pour la communauté open source.

---

**Fait avec ❤️ et TypeScript**
