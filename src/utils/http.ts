import axios, { AxiosRequestConfig } from 'axios'
import { Request, Response, Environment } from '../types'
import { replaceVariables } from './variables'
import { isValidUrl, RateLimiter, logSecurityEvent } from './validation'

// Rate limiter : 10 requêtes par seconde max
const rateLimiter = new RateLimiter(10, 1000)

export const sendRequest = async (
  request: Request,
  environment: Environment | null = null
): Promise<Response & { resolvedUrl?: string; resolvedHeaders?: Record<string, string>; resolvedBody?: string }> => {
  const startTime = performance.now()

  try {
    // Rate limiting
    if (!rateLimiter.canMakeRequest()) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { url: request.url })
      throw new Error('Trop de requêtes. Veuillez patienter quelques secondes.')
    }

    const headers: Record<string, string> = {}
    request.headers
      .filter((h) => h.enabled && h.key)
      .forEach((h) => {
        headers[h.key] = replaceVariables(h.value, environment)
      })

    const params: Record<string, string> = {}
    request.queryParams
      .filter((p) => p.enabled && p.key)
      .forEach((p) => {
        params[p.key] = replaceVariables(p.value, environment)
      })

    let url = replaceVariables(request.url, environment)
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url
    }

    // Validation de l'URL
    if (!isValidUrl(url)) {
      logSecurityEvent('INVALID_URL', { url })
      throw new Error('URL invalide ou non autorisée')
    }

    const config: AxiosRequestConfig = {
      method: request.method,
      url,
      headers,
      params,
      validateStatus: () => true,
    }

    if (request.auth.type === 'bearer' && request.auth.bearer) {
      const token = replaceVariables(request.auth.bearer.token, environment)
      headers['Authorization'] = `Bearer ${token}`
    } else if (request.auth.type === 'basic' && request.auth.basic) {
      const username = replaceVariables(request.auth.basic.username, environment)
      const password = replaceVariables(request.auth.basic.password, environment)
      const encoded = btoa(`${username}:${password}`)
      headers['Authorization'] = `Basic ${encoded}`
    } else if (request.auth.type === 'oauth2' && request.auth.oauth2) {
      const token = replaceVariables(request.auth.oauth2.accessToken, environment)
      const tokenType = request.auth.oauth2.tokenType || 'Bearer'
      headers['Authorization'] = `${tokenType} ${token}`
    }

    let resolvedBody: string | undefined
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      if (request.bodyType === 'form-data' && request.formData) {
        const formData = new FormData()
        request.formData
          .filter((field) => field.enabled && field.key)
          .forEach((field) => {
            if (field.type === 'file' && field.fileContent) {
              const base64Data = field.fileContent.split(',')[1]
              const byteCharacters = atob(base64Data)
              const byteNumbers = new Array(byteCharacters.length)
              for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i)
              }
              const byteArray = new Uint8Array(byteNumbers)
              const blob = new Blob([byteArray])
              formData.append(field.key, blob, field.fileName || 'file')
            } else {
              const value = replaceVariables(field.value, environment)
              formData.append(field.key, value)
            }
          })
        config.data = formData
        resolvedBody = JSON.stringify(
          request.formData
            .filter((f) => f.enabled)
            .map((f) => ({ key: f.key, value: f.type === 'file' ? f.fileName : f.value, type: f.type }))
        )
      } else if (request.bodyType === 'json' && request.body) {
        try {
          const bodyWithVars = replaceVariables(request.body, environment)
          config.data = JSON.parse(bodyWithVars)
          resolvedBody = bodyWithVars
          if (!headers['Content-Type']) {
            headers['Content-Type'] = 'application/json'
          }
        } catch {
          const bodyWithVars = replaceVariables(request.body, environment)
          config.data = bodyWithVars
          resolvedBody = bodyWithVars
        }
      } else if (request.bodyType === 'text' || request.bodyType === 'xml') {
        const bodyWithVars = replaceVariables(request.body, environment)
        config.data = bodyWithVars
        resolvedBody = bodyWithVars
      }
    }

    const response = await axios(config)
    const endTime = performance.now()

    let responseData: string
    if (typeof response.data === 'object') {
      responseData = JSON.stringify(response.data, null, 2)
    } else {
      responseData = String(response.data)
    }

    const responseSize = new Blob([responseData]).size

    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(
        Object.entries(response.headers).map(([k, v]) => [k, String(v)])
      ),
      data: responseData,
      time: Math.round(endTime - startTime),
      size: responseSize,
      resolvedUrl: url,
      resolvedHeaders: headers,
      resolvedBody,
    }
  } catch (error) {
    const endTime = performance.now()
    
    if (axios.isAxiosError(error)) {
      return {
        status: error.response?.status || 0,
        statusText: error.message,
        headers: error.response?.headers
          ? Object.fromEntries(
              Object.entries(error.response.headers).map(([k, v]) => [k, String(v)])
            )
          : {},
        data: JSON.stringify({ error: error.message }, null, 2),
        time: Math.round(endTime - startTime),
        size: 0,
      }
    }

    return {
      status: 0,
      statusText: 'Error',
      headers: {},
      data: JSON.stringify({ error: String(error) }, null, 2),
      time: Math.round(endTime - startTime),
      size: 0,
    }
  }
}
