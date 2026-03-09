/**
 * Validation et sanitization des entrées utilisateur
 */

/**
 * Valide une URL et bloque les protocoles/IPs dangereux
 */
export function isValidUrl(url: string): boolean {
  if (!url || typeof url !== 'string') {
    return false
  }

  try {
    const parsed = new URL(url)
    
    // Bloquer les protocoles dangereux
    const allowedProtocols = ['http:', 'https:']
    if (!allowedProtocols.includes(parsed.protocol)) {
      return false
    }
    
    // En production, bloquer les IPs locales pour éviter SSRF
    if (process.env.NODE_ENV === 'production') {
      const hostname = parsed.hostname.toLowerCase()
      
      // Bloquer localhost
      if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
        return false
      }
      
      // Bloquer les réseaux privés
      if (
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname.match(/^172\.(1[6-9]|2[0-9]|3[0-1])\./)
      ) {
        return false
      }
      
      // Bloquer les IPs link-local
      if (hostname.startsWith('169.254.')) {
        return false
      }
      
      // Bloquer les métadonnées cloud (AWS, GCP, Azure)
      const blockedHosts = [
        '169.254.169.254', // AWS metadata
        'metadata.google.internal', // GCP metadata
        '169.254.169.253', // Azure metadata
      ]
      if (blockedHosts.includes(hostname)) {
        return false
      }
    }
    
    return true
  } catch {
    return false
  }
}

/**
 * Sanitize une chaîne pour éviter les injections
 */
export function sanitizeString(input: string): string {
  if (!input || typeof input !== 'string') {
    return ''
  }
  
  // Supprimer les caractères de contrôle dangereux
  return input.replace(/[\x00-\x1F\x7F]/g, '')
}

/**
 * Valide un nom de fichier (pas de path traversal)
 */
export function isValidFileName(filename: string): boolean {
  if (!filename || typeof filename !== 'string') {
    return false
  }
  
  // Bloquer les tentatives de path traversal
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return false
  }
  
  // Bloquer les noms de fichiers système
  const blockedNames = ['.', '..', 'CON', 'PRN', 'AUX', 'NUL', 'COM1', 'LPT1']
  if (blockedNames.includes(filename.toUpperCase())) {
    return false
  }
  
  return true
}

/**
 * Rate limiter simple pour éviter les abus
 */
export class RateLimiter {
  private requests: number[] = []
  private maxRequests: number
  private timeWindow: number

  constructor(maxRequests = 10, timeWindowMs = 1000) {
    this.maxRequests = maxRequests
    this.timeWindow = timeWindowMs
  }

  canMakeRequest(): boolean {
    const now = Date.now()
    
    // Nettoyer les anciennes requêtes
    this.requests = this.requests.filter(time => now - time < this.timeWindow)
    
    // Vérifier la limite
    if (this.requests.length >= this.maxRequests) {
      return false
    }
    
    // Enregistrer la nouvelle requête
    this.requests.push(now)
    return true
  }

  reset(): void {
    this.requests = []
  }
}

/**
 * Logger les événements de sécurité
 */
export function logSecurityEvent(event: string, details: any = {}): void {
  const logEntry = {
    type: 'SECURITY',
    event,
    timestamp: new Date().toISOString(),
    ...details,
  }
  
  console.warn('[SECURITY]', logEntry)
  
  // En production, envoyer à un service de monitoring
  // if (process.env.NODE_ENV === 'production') {
  //   // Sentry, LogRocket, etc.
  // }
}
