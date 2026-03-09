import { Collection, Request, PostmanCollection, PostmanItem } from '../types'

export const exportToPostman = (collection: Collection): PostmanCollection => {
  const items: PostmanItem[] = collection.requests.map((req) => ({
    name: req.name,
    request: {
      method: req.method,
      header: req.headers
        .filter((h) => h.enabled)
        .map((h) => ({ key: h.key, value: h.value })),
      url: {
        raw: req.url,
        query: req.queryParams
          .filter((p) => p.enabled)
          .map((p) => ({ key: p.key, value: p.value })),
      },
      body:
        req.bodyType !== 'none'
          ? {
              mode: req.bodyType === 'json' ? 'raw' : req.bodyType,
              raw: req.body,
            }
          : undefined,
      auth:
        req.auth.type !== 'none'
          ? {
              type: req.auth.type,
              bearer: req.auth.bearer
                ? [{ key: 'token', value: req.auth.bearer.token }]
                : undefined,
              basic: req.auth.basic
                ? [
                    { key: 'username', value: req.auth.basic.username },
                    { key: 'password', value: req.auth.basic.password },
                  ]
                : undefined,
            }
          : undefined,
    },
  }))

  return {
    info: {
      name: collection.name,
      schema: 'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
    },
    item: items,
  }
}

export const importFromPostman = (postmanCollection: PostmanCollection): Collection => {
  const parseUrl = (url: any): { raw: string; query: any[] } => {
    if (typeof url === 'string') {
      const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
      const query = Array.from(urlObj.searchParams.entries()).map(([key, value]) => ({
        key,
        value,
      }))
      return { raw: url, query }
    }
    return {
      raw: url.raw || '',
      query: url.query || [],
    }
  }

  const requests: Request[] = postmanCollection.item.map((item) => {
    const urlData = parseUrl(item.request.url)
    
    const auth = item.request.auth
      ? {
          type: (item.request.auth.type as any) || 'none',
          bearer: item.request.auth.bearer
            ? {
                token:
                  item.request.auth.bearer.find((b) => b.key === 'token')?.value || '',
              }
            : undefined,
          basic: item.request.auth.basic
            ? {
                username:
                  item.request.auth.basic.find((b) => b.key === 'username')?.value || '',
                password:
                  item.request.auth.basic.find((b) => b.key === 'password')?.value || '',
              }
            : undefined,
        }
      : { type: 'none' as const }

    const headers = Array.isArray(item.request.header)
      ? item.request.header.map((h) => ({
          key: h.key,
          value: h.value,
          enabled: true,
        }))
      : []

    const bodyType = item.request.body?.mode === 'raw' 
      ? 'json' 
      : item.request.body?.mode === 'formdata'
      ? 'form-data'
      : (item.request.body?.mode as any) || 'none'

    return {
      id: crypto.randomUUID(),
      name: item.name,
      method: (item.request.method?.toUpperCase() || 'GET') as any,
      url: urlData.raw,
      headers,
      queryParams: urlData.query.map((q) => ({
        key: q.key,
        value: q.value,
        enabled: true,
      })),
      body: item.request.body?.raw || '',
      bodyType,
      auth,
    }
  })

  return {
    id: crypto.randomUUID(),
    name: postmanCollection.info.name,
    requests,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }
}

export const downloadJSON = (data: any, filename: string) => {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const readJSONFile = (file: File): Promise<any> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        resolve(json)
      } catch (error) {
        reject(error)
      }
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}
