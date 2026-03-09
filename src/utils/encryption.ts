/**
 * Utilitaire de chiffrement pour les données sensibles
 * Utilise AES-256 pour chiffrer les tokens, passwords, etc.
 */

import CryptoJS from 'crypto-js'

// Clé de chiffrement générée par installation
// En production, cette clé devrait être générée de manière unique par machine
const ENCRYPTION_KEY = 'postboy-encryption-key-v1'

/**
 * Chiffre une chaîne de caractères
 */
export function encrypt(plaintext: string): string {
  if (!plaintext) return ''
  
  try {
    const encrypted = CryptoJS.AES.encrypt(plaintext, ENCRYPTION_KEY)
    return encrypted.toString()
  } catch (error) {
    console.error('Encryption error:', error)
    return plaintext // Fallback en cas d'erreur
  }
}

/**
 * Déchiffre une chaîne de caractères
 */
export function decrypt(ciphertext: string): string {
  if (!ciphertext) return ''
  
  try {
    const decrypted = CryptoJS.AES.decrypt(ciphertext, ENCRYPTION_KEY)
    return decrypted.toString(CryptoJS.enc.Utf8)
  } catch (error) {
    console.error('Decryption error:', error)
    return ciphertext // Fallback en cas d'erreur
  }
}

/**
 * Chiffre un objet (pour les environnements)
 */
export function encryptObject<T>(obj: T): string {
  try {
    const json = JSON.stringify(obj)
    return encrypt(json)
  } catch (error) {
    console.error('Object encryption error:', error)
    return JSON.stringify(obj)
  }
}

/**
 * Déchiffre un objet
 */
export function decryptObject<T>(encrypted: string): T | null {
  try {
    const decrypted = decrypt(encrypted)
    return JSON.parse(decrypted) as T
  } catch (error) {
    console.error('Object decryption error:', error)
    return null
  }
}

/**
 * Vérifie si une chaîne est chiffrée (heuristique simple)
 */
export function isEncrypted(text: string): boolean {
  // Les données chiffrées par AES commencent généralement par "U2FsdGVkX1"
  return text.startsWith('U2FsdGVkX1')
}

/**
 * Masque partiellement une chaîne sensible pour l'affichage
 */
export function maskSensitiveData(data: string, visibleChars = 4): string {
  if (!data || data.length <= visibleChars) {
    return '***'
  }
  
  const visible = data.slice(-visibleChars)
  const masked = '*'.repeat(Math.min(data.length - visibleChars, 8))
  return masked + visible
}
