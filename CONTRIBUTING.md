# 🤝 Guide de Contribution

Merci de votre intérêt pour contribuer à **Postboy** ! Ce document vous guidera à travers le processus de contribution.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Configuration de l'environnement](#configuration-de-lenvironnement)
- [Processus de développement](#processus-de-développement)
- [Standards de code](#standards-de-code)
- [Soumettre une Pull Request](#soumettre-une-pull-request)
- [Signaler un bug](#signaler-un-bug)
- [Proposer une fonctionnalité](#proposer-une-fonctionnalité)

## 📜 Code de conduite

En participant à ce projet, vous acceptez de respecter notre code de conduite. Soyez respectueux, inclusif et constructif dans toutes vos interactions.

## 🚀 Comment contribuer

Il existe plusieurs façons de contribuer à Postboy :

- 🐛 **Signaler des bugs** : Ouvrez une issue avec des détails précis
- ✨ **Proposer des fonctionnalités** : Partagez vos idées via les issues
- 📝 **Améliorer la documentation** : README, guides, commentaires
- 💻 **Contribuer au code** : Corrections de bugs, nouvelles fonctionnalités
- 🌍 **Traductions** : Aidez à internationaliser l'application
- 🎨 **Design** : Améliorations UI/UX, icônes, thèmes

## 🛠️ Configuration de l'environnement

### Prérequis

- **Node.js** 18+ et npm
- **Git**
- Un éditeur de code (VS Code recommandé)

### Installation

```bash
# 1. Forker le repository sur GitHub
# 2. Cloner votre fork
git clone https://github.com/VOTRE_USERNAME/postboy.git
cd postboy

# 3. Ajouter le repository upstream
git remote add upstream https://github.com/brunodomenech/postboy.git

# 4. Installer les dépendances
npm install

# 5. Lancer en mode développement
npm run dev
```

L'application s'ouvrira automatiquement avec hot-reload activé.

## 🔄 Processus de développement

### 1. Créer une branche

```bash
# Synchroniser avec upstream
git checkout main
git pull upstream main

# Créer une branche pour votre fonctionnalité/fix
git checkout -b feature/ma-super-feature
# ou
git checkout -b fix/correction-bug
```

### 2. Développer

- Écrivez du code propre et commenté
- Suivez les standards de code (voir ci-dessous)
- Testez vos modifications localement
- Commitez régulièrement avec des messages clairs

### 3. Tester

```bash
# Lancer l'application en dev
npm run dev

# Vérifier le linting
npm run lint

# Build de production (optionnel)
npm run build:mac    # ou build:linux, build:win
```

### 4. Commit

Utilisez des messages de commit descriptifs :

```bash
git commit -m "feat: ajout de la gestion des WebSockets"
git commit -m "fix: correction du bug d'export ZIP"
git commit -m "docs: mise à jour du README avec les nouvelles features"
git commit -m "style: amélioration du thème clair"
```

**Préfixes recommandés** :
- `feat:` - Nouvelle fonctionnalité
- `fix:` - Correction de bug
- `docs:` - Documentation
- `style:` - Formatage, style (pas de changement de code)
- `refactor:` - Refactoring du code
- `test:` - Ajout de tests
- `chore:` - Maintenance, dépendances

## 📏 Standards de code

### TypeScript

- Utilisez TypeScript strict
- Définissez des types explicites
- Évitez `any` autant que possible
- Documentez les fonctions complexes

```typescript
// ✅ Bon
interface User {
  id: string
  name: string
  email: string
}

function getUser(id: string): User | null {
  // ...
}

// ❌ Mauvais
function getUser(id: any): any {
  // ...
}
```

### React

- Utilisez des composants fonctionnels avec hooks
- Préférez les named exports
- Utilisez `useState`, `useEffect` de manière appropriée
- Évitez les re-renders inutiles

```typescript
// ✅ Bon
export default function MyComponent({ data }: Props) {
  const [state, setState] = useState<string>('')
  
  useEffect(() => {
    // Effect logic
  }, [dependencies])
  
  return <div>{data}</div>
}
```

### Style et formatage

- Indentation : 2 espaces
- Utilisez TailwindCSS pour le styling
- Pas de CSS inline sauf exception
- Classes Tailwind ordonnées : layout → spacing → colors → typography

```tsx
// ✅ Bon
<button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium">
  Click me
</button>
```

### Zustand Store

- Gardez le store minimal et organisé
- Utilisez des actions claires
- Évitez la duplication de state

```typescript
// ✅ Bon
interface AppState {
  collections: Collection[]
  addCollection: (collection: Collection) => void
  deleteCollection: (id: string) => void
}
```

## 📤 Soumettre une Pull Request

1. **Push vers votre fork**
   ```bash
   git push origin feature/ma-super-feature
   ```

2. **Ouvrir une Pull Request sur GitHub**
   - Titre clair et descriptif
   - Description détaillée des changements
   - Référencez les issues liées (`Fixes #123`)
   - Ajoutez des captures d'écran si pertinent

3. **Template de PR**
   ```markdown
   ## Description
   Brève description des changements

   ## Type de changement
   - [ ] Bug fix
   - [ ] Nouvelle fonctionnalité
   - [ ] Breaking change
   - [ ] Documentation

   ## Checklist
   - [ ] Code testé localement
   - [ ] Lint passé sans erreurs
   - [ ] Documentation mise à jour si nécessaire
   - [ ] Commits avec messages clairs

   ## Captures d'écran (si applicable)
   ```

4. **Review et ajustements**
   - Répondez aux commentaires de review
   - Effectuez les modifications demandées
   - Gardez la branche à jour avec `main`

## 🐛 Signaler un bug

Ouvrez une issue avec le template suivant :

```markdown
## Description du bug
Description claire et concise du bug

## Étapes pour reproduire
1. Aller à '...'
2. Cliquer sur '...'
3. Voir l'erreur

## Comportement attendu
Ce qui devrait se passer

## Comportement actuel
Ce qui se passe réellement

## Captures d'écran
Si applicable

## Environnement
- OS: [macOS 14.0 / Windows 11 / Ubuntu 22.04]
- Version Postboy: [1.0.0]
- Version Node.js: [18.0.0]

## Informations supplémentaires
Tout autre contexte utile
```

## 💡 Proposer une fonctionnalité

Ouvrez une issue avec le template suivant :

```markdown
## Description de la fonctionnalité
Description claire de ce que vous proposez

## Problème résolu
Quel problème cette fonctionnalité résout-elle ?

## Solution proposée
Comment devrait-elle fonctionner ?

## Alternatives considérées
Autres approches possibles

## Contexte supplémentaire
Mockups, exemples, références
```

## 🎯 Domaines prioritaires

Nous recherchons particulièrement des contributions dans ces domaines :

- 🧪 **Tests automatisés** : Ajout de tests unitaires et E2E
- 🌍 **Internationalisation** : Support multilingue
- 🎨 **Thèmes** : Nouveaux thèmes et personnalisation
- 📱 **Responsive design** : Amélioration sur petits écrans
- 🔌 **Plugins** : Système d'extensions
- 📊 **Analytics** : Statistiques d'utilisation des requêtes
- 🔐 **Sécurité** : Chiffrement des données sensibles

## 📞 Besoin d'aide ?

- 💬 **Discussions** : Utilisez les GitHub Discussions
- 📧 **Email** : bruno@postboy.app
- 🐛 **Issues** : Pour les bugs et features

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent Postboy meilleur chaque jour !

---

**Fait avec ❤️ pour la communauté open source**
