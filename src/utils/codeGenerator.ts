import { Request, Environment } from '../types'
import { replaceVariables } from './variables'

export type CodeLanguage = 'curl' | 'javascript' | 'php' | 'symfony' | 'python' | 'wget' | 'nodejs'

const buildUrl = (request: Request, env: Environment | null): string => {
  let url = replaceVariables(request.url, env)
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = 'https://' + url
  }

  const params = request.queryParams
    .filter((p) => p.enabled && p.key)
    .map((p) => `${encodeURIComponent(p.key)}=${encodeURIComponent(replaceVariables(p.value, env))}`)

  if (params.length > 0) {
    url += (url.includes('?') ? '&' : '?') + params.join('&')
  }

  return url
}

const getHeaders = (request: Request, env: Environment | null): Record<string, string> => {
  const headers: Record<string, string> = {}
  
  request.headers
    .filter((h) => h.enabled && h.key)
    .forEach((h) => {
      headers[h.key] = replaceVariables(h.value, env)
    })

  if (request.auth.type === 'bearer' && request.auth.bearer) {
    headers['Authorization'] = `Bearer ${replaceVariables(request.auth.bearer.token, env)}`
  } else if (request.auth.type === 'basic' && request.auth.basic) {
    const username = replaceVariables(request.auth.basic.username, env)
    const password = replaceVariables(request.auth.basic.password, env)
    const encoded = btoa(`${username}:${password}`)
    headers['Authorization'] = `Basic ${encoded}`
  } else if (request.auth.type === 'oauth2' && request.auth.oauth2) {
    const token = replaceVariables(request.auth.oauth2.accessToken, env)
    const tokenType = request.auth.oauth2.tokenType || 'Bearer'
    headers['Authorization'] = `${tokenType} ${token}`
  }

  if (request.bodyType === 'json' && request.body && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
  }

  return headers
}

const getBody = (request: Request, env: Environment | null): string => {
  if (request.method === 'GET' || request.method === 'HEAD' || request.bodyType === 'none') {
    return ''
  }
  return replaceVariables(request.body, env)
}

export const generateCurl = (request: Request, env: Environment | null): string => {
  const url = buildUrl(request, env)
  const headers = getHeaders(request, env)
  const body = getBody(request, env)

  let curl = `curl -X ${request.method} '${url}'`

  Object.entries(headers).forEach(([key, value]) => {
    curl += ` \\\n  -H '${key}: ${value}'`
  })

  if (body) {
    curl += ` \\\n  -d '${body.replace(/'/g, "'\\''")}'`
  }

  return curl
}

export const generateJavaScript = (request: Request, env: Environment | null): string => {
  const url = buildUrl(request, env)
  const headers = getHeaders(request, env)
  const body = getBody(request, env)

  const headersObj = JSON.stringify(headers, null, 2)
  const bodyStr = body ? `,\n  body: ${JSON.stringify(body)}` : ''

  return `fetch('${url}', {
  method: '${request.method}',
  headers: ${headersObj}${bodyStr}
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));`
}

export const generateNodeJS = (request: Request, env: Environment | null): string => {
  const url = buildUrl(request, env)
  const headers = getHeaders(request, env)
  const body = getBody(request, env)

  const headersObj = JSON.stringify(headers, null, 2)
  const bodyStr = body ? `,\n    body: ${JSON.stringify(body)}` : ''

  return `const axios = require('axios');

axios({
  method: '${request.method.toLowerCase()}',
  url: '${url}',
  headers: ${headersObj}${bodyStr}
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error('Error:', error.message);
  });`
}

export const generatePHP = (request: Request, env: Environment | null): string => {
  const url = buildUrl(request, env)
  const headers = getHeaders(request, env)
  const body = getBody(request, env)

  let php = `<?php\n\n$ch = curl_init();\n\n`
  php += `curl_setopt($ch, CURLOPT_URL, '${url}');\n`
  php += `curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);\n`
  php += `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${request.method}');\n\n`

  if (Object.keys(headers).length > 0) {
    php += `$headers = [\n`
    Object.entries(headers).forEach(([key, value]) => {
      php += `    '${key}: ${value}',\n`
    })
    php += `];\ncurl_setopt($ch, CURLOPT_HTTPHEADER, $headers);\n\n`
  }

  if (body) {
    php += `$data = '${body.replace(/'/g, "\\'")}';\n`
    php += `curl_setopt($ch, CURLOPT_POSTFIELDS, $data);\n\n`
  }

  php += `$response = curl_exec($ch);\n`
  php += `$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);\n`
  php += `curl_close($ch);\n\n`
  php += `echo "Status: " . $httpCode . "\\n";\n`
  php += `echo $response;\n`
  php += `?>`

  return php
}

export const generateSymfony = (request: Request, env: Environment | null): string => {
  const url = buildUrl(request, env)
  const headers = getHeaders(request, env)
  const body = getBody(request, env)

  let symfony = `<?php\n\nuse Symfony\\Component\\HttpClient\\HttpClient;\n\n`
  symfony += `$client = HttpClient::create();\n\n`

  const headersArray = Object.entries(headers).map(([key, value]) => `        '${key}' => '${value}'`)
  const headersStr = headersArray.length > 0 ? `    'headers' => [\n${headersArray.join(',\n')}\n    ]` : ''
  
  const bodyStr = body ? `,\n    'body' => '${body.replace(/'/g, "\\'")}'` : ''

  symfony += `$response = $client->request('${request.method}', '${url}', [\n`
  if (headersStr) symfony += headersStr
  if (bodyStr) symfony += bodyStr
  symfony += `\n]);\n\n`
  symfony += `$statusCode = $response->getStatusCode();\n`
  symfony += `$content = $response->getContent();\n\n`
  symfony += `echo "Status: " . $statusCode . "\\n";\n`
  symfony += `echo $content;\n`
  symfony += `?>`

  return symfony
}

export const generatePython = (request: Request, env: Environment | null): string => {
  const url = buildUrl(request, env)
  const headers = getHeaders(request, env)
  const body = getBody(request, env)

  let python = `import requests\n\n`
  python += `url = '${url}'\n`

  if (Object.keys(headers).length > 0) {
    python += `headers = {\n`
    Object.entries(headers).forEach(([key, value]) => {
      python += `    '${key}': '${value}',\n`
    })
    python += `}\n`
  }

  if (body) {
    python += `data = '''${body}'''\n\n`
  }

  python += `response = requests.${request.method.toLowerCase()}(url`
  if (Object.keys(headers).length > 0) python += `, headers=headers`
  if (body) python += `, data=data`
  python += `)\n\n`
  python += `print(f"Status: {response.status_code}")\n`
  python += `print(response.text)`

  return python
}

export const generateWget = (request: Request, env: Environment | null): string => {
  const url = buildUrl(request, env)
  const headers = getHeaders(request, env)
  const body = getBody(request, env)

  let wget = `wget --method=${request.method} \\\n`
  wget += `  '${url}'`

  Object.entries(headers).forEach(([key, value]) => {
    wget += ` \\\n  --header='${key}: ${value}'`
  })

  if (body) {
    wget += ` \\\n  --body-data='${body.replace(/'/g, "'\\''")}'`
  }

  wget += ` \\\n  -O -`

  return wget
}

export const generateCode = (language: CodeLanguage, request: Request, env: Environment | null): string => {
  switch (language) {
    case 'curl':
      return generateCurl(request, env)
    case 'javascript':
      return generateJavaScript(request, env)
    case 'nodejs':
      return generateNodeJS(request, env)
    case 'php':
      return generatePHP(request, env)
    case 'symfony':
      return generateSymfony(request, env)
    case 'python':
      return generatePython(request, env)
    case 'wget':
      return generateWget(request, env)
    default:
      return ''
  }
}
