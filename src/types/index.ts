export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'HEAD' | 'OPTIONS'

export type AuthType = 'none' | 'bearer' | 'basic' | 'oauth2'

export interface Header {
  key: string
  value: string
  enabled: boolean
}

export interface QueryParam {
  key: string
  value: string
  enabled: boolean
}

export interface Auth {
  type: AuthType
  bearer?: {
    token: string
  }
  basic?: {
    username: string
    password: string
  }
  oauth2?: {
    accessToken: string
    tokenType?: string
  }
}

export interface FormDataField {
  key: string
  value: string
  type: 'text' | 'file'
  enabled: boolean
  fileName?: string
  fileContent?: string
}

export interface Request {
  id: string
  name: string
  method: HttpMethod
  url: string
  headers: Header[]
  queryParams: QueryParam[]
  body: string
  bodyType: 'none' | 'json' | 'xml' | 'text' | 'form-data'
  formData?: FormDataField[]
  auth: Auth
  collectionId?: string
}

export interface Collection {
  id: string
  name: string
  requests: Request[]
  createdAt: number
  updatedAt: number
}

export interface Response {
  status: number
  statusText: string
  headers: Record<string, string>
  data: string
  time: number
  size: number
}

export interface Environment {
  id: string
  name: string
  variables: Record<string, string>
  active: boolean
}

export interface AppSettings {
  debugMode: boolean
  theme: 'light' | 'dark'
}

export interface HistoryEntry {
  id: string
  request: Request
  response: Response
  timestamp: number
  resolvedUrl?: string
  resolvedHeaders?: Record<string, string>
  resolvedBody?: string
}

export interface PostmanCollection {
  info: {
    name: string
    schema: string
  }
  item: PostmanItem[]
}

export interface PostmanItem {
  name: string
  request: {
    method: string
    header: Array<{ key: string; value: string }>
    url: {
      raw: string
      query?: Array<{ key: string; value: string }>
    }
    body?: {
      mode: string
      raw?: string
    }
    auth?: {
      type: string
      bearer?: Array<{ key: string; value: string }>
      basic?: Array<{ key: string; value: string }>
    }
  }
}
