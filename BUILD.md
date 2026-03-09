# 🏗️ Guide de Build - POSTBOY

## 📋 Prérequis

- Node.js 18+ installé
- npm ou yarn
- Dépendances installées : `npm install`

---

## 🚀 Build pour production

### macOS (DMG + ZIP)

```bash
npm run build:mac
```

**Sortie** :
- `release/Postboy-1.0.0.dmg` - Installateur macOS
- `release/Postboy-1.0.0-mac.zip` - Archive portable

**Compatibilité** : macOS 10.13+

---

### Linux (AppImage + DEB)

```bash
npm run build:linux
```

**Sortie** :
- `release/Postboy-1.0.0.AppImage` - Exécutable portable Linux
- `release/Postboy-1.0.0.deb` - Package Debian/Ubuntu

**Compatibilité** : 
- AppImage : Toutes distributions Linux
- DEB : Debian, Ubuntu, Linux Mint, etc.

---

### Windows (NSIS + Portable)

```bash
npm run build:win
```

**Sortie** :
- `release/Postboy Setup 1.0.0.exe` - Installateur Windows
- `release/Postboy-1.0.0-win.zip` - Version portable

**Compatibilité** : Windows 10+

---

## 🔧 Build multi-plateforme

Pour builder toutes les plateformes en une fois :

```bash
npm run build
```

⚠️ **Note** : Le build cross-platform peut nécessiter des outils spécifiques selon votre OS.

---

## 📦 Structure des fichiers de sortie

```
release/
├── Postboy-1.0.0.dmg              # macOS installer
├── Postboy-1.0.0-mac.zip          # macOS portable
├── Postboy-1.0.0.AppImage         # Linux portable
├── Postboy-1.0.0.deb              # Linux Debian package
├── Postboy Setup 1.0.0.exe        # Windows installer
└── Postboy-1.0.0-win.zip          # Windows portable
```

---

## 🎯 Installation

### macOS
1. Ouvrir le fichier `.dmg`
2. Glisser Postboy dans Applications
3. Lancer depuis Applications

### Linux (AppImage)
```bash
chmod +x Postboy-1.0.0.AppImage
./Postboy-1.0.0.AppImage
```

### Linux (DEB)
```bash
sudo dpkg -i Postboy-1.0.0.deb
```

### Windows
1. Exécuter `Postboy Setup 1.0.0.exe`
2. Suivre l'assistant d'installation
3. Lancer depuis le menu Démarrer

---

## 🔍 Vérification du build

Après le build, vérifier :

```bash
ls -lh release/
```

Tailles approximatives :
- macOS DMG : ~80-100 MB
- Linux AppImage : ~100-120 MB
- Windows Setup : ~70-90 MB

---

## 🐛 Dépannage

### Erreur "electron-builder not found"
```bash
npm install --save-dev electron-builder
```

### Erreur de permissions (Linux/macOS)
```bash
chmod +x node_modules/.bin/electron-builder
```

### Erreur de build Windows sur macOS/Linux
Installer wine pour le cross-compilation :
```bash
# macOS
brew install wine-stable

# Linux
sudo apt-get install wine64
```

---

## 🚀 Build optimisé

Pour un build plus rapide (sans compression maximale) :

```bash
npm run build:mac -- --publish never
```

---

## 📝 Configuration avancée

Modifier `package.json` section `"build"` pour personnaliser :

- Icônes d'application
- Nom du produit
- ID de l'application
- Formats de sortie
- Compression
- Code signing (macOS/Windows)

---

## ✅ Checklist avant release

- [ ] Version mise à jour dans `package.json`
- [ ] README.md à jour
- [ ] Logs de debug supprimés
- [ ] Tests effectués
- [ ] Build testé sur chaque plateforme
- [ ] Icônes créés (`.icns`, `.ico`, `.png`)
- [ ] CHANGELOG.md mis à jour

---

## 🎨 Icônes requis

Pour un build complet, créer les icônes :

```
build/
├── icon.icns    # macOS (512x512)
├── icon.ico     # Windows (256x256)
└── icon.png     # Linux (512x512)
```

Outils recommandés :
- [Icon Converter](https://cloudconvert.com/png-to-icns)
- [Electron Icon Maker](https://www.npmjs.com/package/electron-icon-maker)

---

## 📊 Tailles et performances

**Temps de build** (approximatif) :
- macOS : 2-3 minutes
- Linux : 2-3 minutes  
- Windows : 3-4 minutes

**Espace disque requis** :
- Build complet : ~500 MB
- node_modules : ~300 MB
- Fichiers source : ~5 MB

---

**Postboy v1.0.0** - Build Guide  
Client API Open Source pour macOS, Linux et Windows 🚀
