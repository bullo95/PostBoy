# 🔒 Sécurité - Postboy

## 🚨 Problèmes de sécurité identifiés et correctifs

### 1. Configuration Electron (CRITIQUE)

**Problème actuel** :
```typescript
webPreferences: {
  nodeIntegration: true,      // ❌ DANGEREUX
  contextIsolation: false,    // ❌ DANGEREUX
}
```

**Correctif recommandé** :
```typescript
webPreferences: {
  nodeIntegration: false,     // ✅ Désactiver Node.js dans le renderer
  contextIsolation: true,     // ✅ Isoler le contexte
  sandbox: true,              // ✅ Activer le sandbox
  webSecurity: true,          // ✅ Activer la sécurité web
  preload: path.join(__dirname, 'preload.js'), // ✅ Utiliser un preload script
}
```

**Créer un preload script sécurisé** (`electron/preload.ts`) :
```typescript
import { contextBridge, ipcRenderer } from 'electron'

// Exposer uniquement les APIs nécessaires
contextBridge.exposeInMainWorld('electronAPI', {
  // Exemple: lecture/écriture sécurisée
  readFile: (path: string) => ipcRenderer.invoke('read-file', path),
  writeFile: (path: string, data: string) => ipcRenderer.invoke('write-file', path, data),
})
```

### 2. Chiffrement des données sensibles

**Problème** : Tokens et passwords stockés en clair dans localStorage.

**Solution** : Utiliser `electron-store` avec chiffrement :

```bash
npm install electron-store
```

```typescript
import Store from 'electron-store'

const store = new Store({
  encryptionKey: 'your-encryption-key', // Générer une clé unique par installation
  schema: {
    environments: {
      type: 'array',
      default: []
    }
  }
})

// Utilisation
store.set('environments', environments)
const environments = store.get('environments')
```

**Mieux encore** : Utiliser le keychain système :
```bash
npm install keytar
```

```typescript
import * as keytar from 'keytar'

// Stocker un token de manière sécurisée
await keytar.setPassword('postboy', 'api-token', token)

// Récupérer
const token = await keytar.getPassword('postboy', 'api-token')
```

### 3. Validation des entrées

**Ajouter une validation d'URL** :

```typescript
// src/utils/validation.ts
export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    // Bloquer les protocoles dangereux
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return false
    }
    // Bloquer les IPs locales en production
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsed.hostname
      if (
        hostname === 'localhost' ||
        hostname === '127.0.0.1' ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.startsWith('172.')
      ) {
        return false
      }
    }
    return true
  } catch {
    return false
  }
}

// Utilisation dans http.ts
if (!isValidUrl(url)) {
  throw new Error('URL invalide ou non autorisée')
}
```

### 4. Sandbox pour les scripts utilisateur

**Utiliser `vm2` pour exécuter les scripts en toute sécurité** :

```bash
npm install vm2
```

```typescript
import { VM } from 'vm2'

export function executeScript(script: string, context: any) {
  const vm = new VM({
    timeout: 5000, // 5 secondes max
    sandbox: {
      pm: context, // API Postman limitée
      console: {
        log: (...args: any[]) => console.log('[Script]', ...args)
      }
    },
    eval: false,
    wasm: false,
  })
  
  try {
    return vm.run(script)
  } catch (error) {
    console.error('Script execution error:', error)
    throw error
  }
}
```

### 5. Content Security Policy (CSP)

**Ajouter dans `index.html`** :

```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src *;">
```

### 6. Mise à jour des dépendances vulnérables

```bash
# Mettre à jour les packages avec vulnérabilités
npm update electron
npm update esbuild
npm update minimatch

# Vérifier les vulnérabilités
npm audit fix

# Pour les breaking changes (à tester)
npm audit fix --force
```

### 7. Sanitization des données

**Installer DOMPurify pour nettoyer le HTML** :

```bash
npm install dompurify
```

```typescript
import DOMPurify from 'dompurify'

// Nettoyer le HTML avant affichage
const cleanHtml = DOMPurify.sanitize(dirtyHtml)
```

### 8. Rate limiting pour les requêtes

**Limiter le nombre de requêtes par seconde** :

```typescript
// src/utils/rateLimiter.ts
class RateLimiter {
  private requests: number[] = []
  private maxRequests = 10 // 10 requêtes
  private timeWindow = 1000 // par seconde

  canMakeRequest(): boolean {
    const now = Date.now()
    this.requests = this.requests.filter(time => now - time < this.timeWindow)
    
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    this.requests.push(now)
    return true
  }
}

export const rateLimiter = new RateLimiter()
```

### 9. Logs de sécurité

**Ajouter des logs pour les actions sensibles** :

```typescript
// src/utils/securityLogger.ts
export function logSecurityEvent(event: string, details: any) {
  console.warn('[SECURITY]', event, {
    timestamp: new Date().toISOString(),
    ...details
  })
  
  // En production, envoyer à un service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // Sentry, LogRocket, etc.
  }
}

// Utilisation
logSecurityEvent('SUSPICIOUS_URL', { url: suspiciousUrl })
```

### 10. Permissions minimales

**Demander uniquement les permissions nécessaires** :

```typescript
// electron/main.ts
app.on('web-contents-created', (event, contents) => {
  // Bloquer la navigation vers des sites externes
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl)
    if (parsedUrl.origin !== 'http://localhost:5173') {
      event.preventDefault()
    }
  })
  
  // Bloquer l'ouverture de nouvelles fenêtres
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' }
  })
})
```

## 📋 Checklist de sécurité

### Avant release en production

- [ ] Désactiver `nodeIntegration`
- [ ] Activer `contextIsolation`
- [ ] Implémenter le preload script
- [ ] Chiffrer les données sensibles (tokens, passwords)
- [ ] Valider toutes les entrées utilisateur
- [ ] Mettre à jour toutes les dépendances vulnérables
- [ ] Ajouter CSP (Content Security Policy)
- [ ] Sandbox les scripts utilisateur
- [ ] Implémenter rate limiting
- [ ] Ajouter des logs de sécurité
- [ ] Tester avec `npm audit`
- [ ] Code signing des builds
- [ ] Activer auto-update sécurisé

### Tests de sécurité recommandés

1. **Test d'injection XSS** : Essayer d'injecter `<script>alert('XSS')</script>` dans tous les champs
2. **Test SSRF** : Essayer d'accéder à `http://localhost:22` ou `http://169.254.169.254`
3. **Test de path traversal** : Essayer `../../etc/passwd` dans les noms de fichiers
4. **Test de script malveillant** : Exécuter un script infini dans Pre-request
5. **Test de stockage** : Vérifier que les tokens ne sont pas en clair dans localStorage

## 🔐 Bonnes pratiques

1. **Ne jamais stocker de secrets en clair**
2. **Toujours valider les entrées utilisateur**
3. **Utiliser HTTPS uniquement en production**
4. **Limiter les permissions Electron au strict minimum**
5. **Mettre à jour régulièrement les dépendances**
6. **Activer le sandbox Electron**
7. **Utiliser CSP stricte**
8. **Logger les événements de sécurité**
9. **Chiffrer les données sensibles au repos**
10. **Implémenter rate limiting**

## 📞 Signaler une vulnérabilité

Si vous découvrez une vulnérabilité de sécurité, **ne créez PAS d'issue publique**.

Envoyez un email à : **security@postboy.app**

Nous nous engageons à répondre sous 48h et à publier un correctif dans les 7 jours.

## 📚 Ressources

- [Electron Security Checklist](https://www.electronjs.org/docs/latest/tutorial/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

---

**Dernière mise à jour** : Mars 2026
