# 📤 Import/Export des Environnements - POSTBOY

## 🎯 Vue d'ensemble

Vous pouvez maintenant **importer et exporter vos environnements** pour les partager avec votre équipe, les sauvegarder ou les transférer entre différentes installations de Postboy.

---

## 📥 Exporter des environnements

### Exporter tous les environnements

1. Ouvrez le gestionnaire d'environnements (icône ⚙️)
2. Cliquez sur le bouton **"Tout exporter"** dans le header
3. Un fichier JSON est téléchargé : `postboy-environments-[timestamp].json`

**Contenu du fichier** :
```json
{
  "version": "1.0",
  "name": "Postboy Environments",
  "environments": [
    {
      "id": "...",
      "name": "Production",
      "variables": {
        "api_url": "https://api.production.com",
        "api_token": "prod_token_123"
      },
      "active": false
    }
  ],
  "exportedAt": 1709987654321
}
```

### Exporter un environnement spécifique

1. Ouvrez le gestionnaire d'environnements
2. Survolez l'environnement que vous souhaitez exporter
3. Cliquez sur l'icône **📥** (Download)
4. Un fichier JSON est téléchargé : `[nom-environnement]-env.json`

---

## 📤 Importer des environnements

### Procédure d'import

1. Ouvrez le gestionnaire d'environnements (icône ⚙️)
2. Cliquez sur le bouton **"Importer"** dans le header
3. Sélectionnez un fichier `.json` d'environnements
4. Les environnements sont importés automatiquement
5. Un message de confirmation s'affiche : `X environnement(s) importé(s) avec succès !`

### Comportement de l'import

- ✅ **Nouveaux IDs** : Chaque environnement importé reçoit un nouvel ID unique
- ✅ **Pas de conflit** : Les environnements importés ne remplacent pas les existants
- ✅ **Variables préservées** : Toutes les variables sont importées
- ✅ **État désactivé** : Les environnements importés ne sont pas activés automatiquement

---

## 🔧 Format du fichier

### Structure JSON

```json
{
  "version": "1.0",
  "name": "Nom de l'export",
  "environments": [
    {
      "id": "uuid-unique",
      "name": "Nom de l'environnement",
      "variables": {
        "variable1": "valeur1",
        "variable2": "valeur2"
      },
      "active": false
    }
  ],
  "exportedAt": 1709987654321
}
```

### Champs requis

| Champ | Type | Description |
|-------|------|-------------|
| `version` | string | Version du format (actuellement "1.0") |
| `name` | string | Nom de l'export |
| `environments` | array | Liste des environnements |
| `exportedAt` | number | Timestamp de l'export |

### Champs d'un environnement

| Champ | Type | Description |
|-------|------|-------------|
| `id` | string | Identifiant unique (regénéré à l'import) |
| `name` | string | Nom de l'environnement |
| `variables` | object | Objet clé-valeur des variables |
| `active` | boolean | État d'activation (toujours false à l'export) |

---

## 💡 Cas d'usage

### 1. Partage avec l'équipe

**Scénario** : Partager les configurations d'environnement avec votre équipe

```bash
# Développeur 1
1. Configure les environnements (dev, staging, prod)
2. Exporte tous les environnements
3. Partage le fichier JSON via Git/Slack/Email

# Développeur 2
1. Reçoit le fichier JSON
2. Importe les environnements
3. Dispose immédiatement des mêmes configurations
```

### 2. Sauvegarde

**Scénario** : Sauvegarder vos environnements avant une réinstallation

```bash
1. Exporter tous les environnements
2. Sauvegarder le fichier JSON
3. Réinstaller Postboy
4. Importer le fichier sauvegardé
5. Retrouver tous vos environnements
```

### 3. Migration

**Scénario** : Transférer vos environnements vers une autre machine

```bash
# Machine A
1. Exporter tous les environnements
2. Copier le fichier JSON sur clé USB/cloud

# Machine B
1. Installer Postboy
2. Importer le fichier JSON
3. Tous les environnements sont disponibles
```

### 4. Versioning

**Scénario** : Versionner vos environnements dans Git

```bash
# Dans votre projet
mkdir .postboy
cd .postboy

# Exporter et commiter
1. Exporter les environnements
2. Renommer en "environments.json"
3. git add environments.json
4. git commit -m "Add Postboy environments"
5. git push

# Autres développeurs
1. git pull
2. Importer .postboy/environments.json
```

---

## 🔒 Sécurité

### ⚠️ Avertissements importants

**Données sensibles** :
- Les fichiers exportés contiennent **toutes les variables** en clair
- Cela inclut les **tokens**, **mots de passe**, **clés API**
- **Ne partagez JAMAIS** ces fichiers publiquement

### 🛡️ Bonnes pratiques

1. **Gitignore** : Ajoutez les fichiers d'environnements à `.gitignore`
   ```
   # .gitignore
   *-env.json
   postboy-environments-*.json
   ```

2. **Variables sensibles** : Utilisez des placeholders pour le partage
   ```json
   {
     "api_token": "REMPLACER_PAR_VOTRE_TOKEN",
     "api_key": "REMPLACER_PAR_VOTRE_CLE"
   }
   ```

3. **Chiffrement** : Chiffrez les fichiers avant de les partager
   ```bash
   # Chiffrer
   gpg -c environments.json
   
   # Déchiffrer
   gpg environments.json.gpg
   ```

4. **Partage sécurisé** : Utilisez des canaux sécurisés
   - Slack/Teams (messages privés)
   - Email chiffré
   - Gestionnaire de mots de passe partagé
   - Vault d'entreprise

---

## 🎨 Interface utilisateur

### Boutons disponibles

**Dans le header du gestionnaire** :
- 📤 **Importer** : Ouvre le sélecteur de fichiers
- 📥 **Tout exporter** : Exporte tous les environnements

**Au survol d'un environnement** :
- 📥 **Download** (vert) : Exporte cet environnement
- 🗑️ **Trash** (rouge) : Supprime l'environnement

### Messages de confirmation

**Import réussi** :
```
✅ 3 environnement(s) importé(s) avec succès !
```

**Export vide** :
```
⚠️ Aucun environnement à exporter
```

**Erreur d'import** :
```
❌ Format de fichier invalide
❌ Erreur lors de la lecture du fichier
```

---

## 🔄 Workflow recommandé

### Configuration initiale d'équipe

```
1. Lead Developer
   ├─ Crée les environnements (dev, staging, prod)
   ├─ Configure les variables communes
   ├─ Exporte tous les environnements
   └─ Partage le fichier avec l'équipe

2. Team Members
   ├─ Importent le fichier
   ├─ Ajustent les variables personnelles si nécessaire
   └─ Commencent à travailler
```

### Mise à jour des environnements

```
1. Modification
   ├─ Un développeur modifie un environnement
   ├─ Exporte l'environnement modifié
   └─ Partage avec l'équipe

2. Synchronisation
   ├─ Les autres développeurs reçoivent le fichier
   ├─ Suppriment l'ancien environnement
   ├─ Importent le nouveau
   └─ Activent si nécessaire
```

---

## 📊 Statistiques et limites

- **Taille max recommandée** : 1 MB par fichier
- **Nombre d'environnements** : Illimité
- **Nombre de variables** : Illimité par environnement
- **Format** : JSON standard (UTF-8)
- **Compatibilité** : Postboy v1.0+

---

## 🐛 Dépannage

### Le fichier ne s'importe pas

**Vérifications** :
1. Le fichier est bien au format `.json`
2. Le JSON est valide (utilisez jsonlint.com)
3. La structure contient le champ `environments`
4. Les environnements sont dans un tableau

### Les variables ne sont pas importées

**Solution** :
- Vérifiez que le champ `variables` existe
- Assurez-vous que c'est un objet `{}`
- Les valeurs doivent être des strings

### Erreur "Format de fichier invalide"

**Causes possibles** :
- JSON mal formaté
- Champ `environments` manquant
- Structure incorrecte

**Solution** :
```json
// Structure minimale valide
{
  "version": "1.0",
  "name": "Mon export",
  "environments": [],
  "exportedAt": 1709987654321
}
```

---

## 📝 Exemple complet

### Fichier d'export type

```json
{
  "version": "1.0",
  "name": "Postboy Environments - Projet API",
  "environments": [
    {
      "id": "env-dev-123",
      "name": "Développement",
      "variables": {
        "api_url": "http://localhost:3000",
        "api_token": "dev_token_abc123",
        "debug_mode": "true"
      },
      "active": false
    },
    {
      "id": "env-staging-456",
      "name": "Staging",
      "variables": {
        "api_url": "https://staging-api.example.com",
        "api_token": "staging_token_xyz789",
        "debug_mode": "false"
      },
      "active": false
    },
    {
      "id": "env-prod-789",
      "name": "Production",
      "variables": {
        "api_url": "https://api.example.com",
        "api_token": "prod_token_secure_key",
        "debug_mode": "false"
      },
      "active": false
    }
  ],
  "exportedAt": 1709987654321
}
```

---

## ✅ Checklist avant partage

- [ ] Vérifier qu'aucune donnée sensible n'est exposée
- [ ] Remplacer les tokens/passwords par des placeholders
- [ ] Tester l'import sur une autre machine
- [ ] Documenter les variables à personnaliser
- [ ] Utiliser un canal de partage sécurisé
- [ ] Informer l'équipe des modifications

---

**Postboy v1.0.0** - Import/Export des Environnements  
Partagez vos configurations en toute simplicité ! 🚀
