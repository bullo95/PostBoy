import { useState } from 'react'
import { Send, Plus, Trash2, Code2, Upload, Wand2 } from 'lucide-react'
import { useStore } from '../store/useStore'
import { HttpMethod, AuthType } from '../types'
import { sendRequest } from '../utils/http'

interface RequestPanelProps {
  onOpenCodeSnippets?: () => void
}

export default function RequestPanel({ onOpenCodeSnippets }: RequestPanelProps) {
  const [activeTab, setActiveTab] = useState<'params' | 'headers' | 'body' | 'auth' | 'scripts' | 'settings' | 'cookies'>('params')
  const currentRequest = useStore((state) => state.currentRequest)
  const updateRequest = useStore((state) => state.updateRequest)
  const setCurrentResponse = useStore((state) => state.setCurrentResponse)
  const activeEnvironment = useStore((state) => state.activeEnvironment)
  const addToHistory = useStore((state) => state.addToHistory)
  const [loading, setLoading] = useState(false)
  const [preRequestScript, setPreRequestScript] = useState('')
  const [testScript, setTestScript] = useState('')
  const [cookies, setCookies] = useState<Array<{key: string, value: string, domain: string, enabled: boolean}>>([])
  const [scriptTab, setScriptTab] = useState<'pre-request' | 'tests'>('pre-request')

  if (!currentRequest) return null

  const handleSend = async () => {
    setLoading(true)
    try {
      const response = await sendRequest(currentRequest, activeEnvironment)
      setCurrentResponse(response)
      addToHistory(currentRequest, response, response.resolvedUrl, response.resolvedHeaders, response.resolvedBody)
    } catch (error) {
      console.error('Request error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMethodChange = (method: HttpMethod) => {
    updateRequest(currentRequest.id, { method })
  }

  const handleUrlChange = (url: string) => {
    updateRequest(currentRequest.id, { url })
  }

  const addQueryParam = () => {
    updateRequest(currentRequest.id, {
      queryParams: [...currentRequest.queryParams, { key: '', value: '', enabled: true }],
    })
  }

  const updateQueryParam = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    const newParams = [...currentRequest.queryParams]
    newParams[index] = { ...newParams[index], [field]: value }
    updateRequest(currentRequest.id, { queryParams: newParams })
  }

  const deleteQueryParam = (index: number) => {
    const newParams = currentRequest.queryParams.filter((_, i) => i !== index)
    updateRequest(currentRequest.id, { queryParams: newParams })
  }

  const addHeader = () => {
    updateRequest(currentRequest.id, {
      headers: [...currentRequest.headers, { key: '', value: '', enabled: true }],
    })
  }

  const updateHeader = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    const newHeaders = [...currentRequest.headers]
    newHeaders[index] = { ...newHeaders[index], [field]: value }
    updateRequest(currentRequest.id, { headers: newHeaders })
  }

  const deleteHeader = (index: number) => {
    const newHeaders = currentRequest.headers.filter((_, i) => i !== index)
    updateRequest(currentRequest.id, { headers: newHeaders })
  }

  const handleBodyChange = (body: string) => {
    updateRequest(currentRequest.id, { body })
  }

  const addFormDataField = () => {
    const formData = currentRequest.formData || []
    updateRequest(currentRequest.id, {
      formData: [...formData, { key: '', value: '', type: 'text', enabled: true }],
    })
  }

  const updateFormDataField = (index: number, field: string, value: any) => {
    const formData = [...(currentRequest.formData || [])]
    formData[index] = { ...formData[index], [field]: value }
    updateRequest(currentRequest.id, { formData })
  }

  const deleteFormDataField = (index: number) => {
    const formData = (currentRequest.formData || []).filter((_, i) => i !== index)
    updateRequest(currentRequest.id, { formData })
  }

  const handleFileSelect = async (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64 = e.target?.result as string
      updateFormDataField(index, 'fileContent', base64)
      updateFormDataField(index, 'fileName', file.name)
      updateFormDataField(index, 'value', file.name)
    }
    reader.readAsDataURL(file)
  }

  const methods: HttpMethod[] = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS']

  const beautifyJSON = () => {
    if (currentRequest.bodyType === 'json' && currentRequest.body) {
      try {
        const parsed = JSON.parse(currentRequest.body)
        const formatted = JSON.stringify(parsed, null, 2)
        updateRequest(currentRequest.id, { body: formatted })
      } catch (error) {
        console.error('Invalid JSON:', error)
      }
    }
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="p-4 border-b border-gray-700">
        <div className="flex gap-2">
          <select
            value={currentRequest.method}
            onChange={(e) => handleMethodChange(e.target.value as HttpMethod)}
            className="px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-semibold"
          >
            {methods.map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>

          <input
            type="text"
            value={currentRequest.url}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            className="flex-1 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
          />

          <button
            onClick={onOpenCodeSnippets}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded font-medium flex items-center gap-2 transition-colors"
            title="Générer du code"
          >
            <Code2 size={16} />
          </button>

          <button
            onClick={handleSend}
            disabled={loading || !currentRequest.url}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded font-medium flex items-center gap-2 transition-colors"
          >
            <Send size={16} />
            {loading ? 'Envoi...' : 'Envoyer'}
          </button>
        </div>
      </div>

      <div className="border-b border-gray-700">
        <div className="flex gap-1 px-4">
          <button
            onClick={() => setActiveTab('params')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'params'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Paramètres
          </button>
          <button
            onClick={() => setActiveTab('headers')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'headers'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            En-têtes
          </button>
          <button
            onClick={() => setActiveTab('body')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'body'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Corps
          </button>
          <button
            onClick={() => setActiveTab('auth')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'auth'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Authentification
          </button>
          <button
            onClick={() => setActiveTab('scripts')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'scripts'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Scripts
          </button>
          <button
            onClick={() => setActiveTab('cookies')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'cookies'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Cookies
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'settings'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            Settings
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {activeTab === 'params' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Paramètres de requête</h3>
              <button
                onClick={addQueryParam}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              >
                <Plus size={14} />
                Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {currentRequest.queryParams.map((param, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={param.enabled}
                    onChange={(e) => updateQueryParam(index, 'enabled', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) => updateQueryParam(index, 'key', e.target.value)}
                    placeholder="Clé"
                    className="flex-1 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) => updateQueryParam(index, 'value', e.target.value)}
                    placeholder="Valeur"
                    className="flex-1 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => deleteQueryParam(index)}
                    className="p-2 hover:bg-red-600 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'headers' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">En-têtes HTTP</h3>
              <button
                onClick={addHeader}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              >
                <Plus size={14} />
                Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {currentRequest.headers.map((header, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={header.enabled}
                    onChange={(e) => updateHeader(index, 'enabled', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    value={header.key}
                    onChange={(e) => updateHeader(index, 'key', e.target.value)}
                    placeholder="Clé"
                    className="flex-1 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={header.value}
                    onChange={(e) => updateHeader(index, 'value', e.target.value)}
                    placeholder="Valeur"
                    className="flex-1 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => deleteHeader(index)}
                    className="p-2 hover:bg-red-600 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'body' && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold">Corps de la requête</h3>
                <select
                  value={currentRequest.bodyType}
                  onChange={(e) => updateRequest(currentRequest.id, { bodyType: e.target.value as any })}
                  className="px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                >
                  <option value="none">Aucun</option>
                  <option value="json">JSON</option>
                  <option value="text">Texte</option>
                  <option value="xml">XML</option>
                  <option value="form-data">Form Data</option>
                </select>
              </div>
              {currentRequest.bodyType === 'json' && currentRequest.body && (
                <button
                  onClick={beautifyJSON}
                  className="flex items-center gap-2 px-3 py-1 bg-purple-600 hover:bg-purple-700 rounded text-sm transition-colors"
                  title="Formater le JSON"
                >
                  <Wand2 size={14} />
                  Beautify
                </button>
              )}
            </div>
            {currentRequest.bodyType !== 'none' && currentRequest.bodyType !== 'form-data' && (
              <textarea
                value={currentRequest.body}
                onChange={(e) => handleBodyChange(e.target.value)}
                placeholder={
                  currentRequest.bodyType === 'json'
                    ? '{\n  "key": "value"\n}'
                    : 'Entrez le corps de la requête...'
                }
                className="w-full h-64 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
              />
            )}
          </div>
        )}

        {activeTab === 'auth' && (
          <div>
            <div className="mb-4">
              <h3 className="font-semibold mb-3">Type d'authentification</h3>
              <select
                value={currentRequest.auth.type}
                onChange={(e) => updateRequest(currentRequest.id, { 
                  auth: { type: e.target.value as AuthType }
                })}
                className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
              >
                <option value="none">Aucune</option>
                <option value="bearer">Bearer Token</option>
                <option value="basic">Basic Auth</option>
                <option value="oauth2">OAuth 2.0</option>
              </select>
            </div>

            {currentRequest.auth.type === 'bearer' && (
              <div>
                <label className="block text-sm font-medium mb-2">Token</label>
                <input
                  type="text"
                  value={currentRequest.auth.bearer?.token || ''}
                  onChange={(e) => updateRequest(currentRequest.id, {
                    auth: { ...currentRequest.auth, bearer: { token: e.target.value } }
                  })}
                  placeholder="Entrez votre token Bearer"
                  className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Le token sera envoyé dans l'en-tête: Authorization: Bearer {'<token>'}
                </p>
              </div>
            )}

            {currentRequest.auth.type === 'basic' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Nom d'utilisateur</label>
                  <input
                    type="text"
                    value={currentRequest.auth.basic?.username || ''}
                    onChange={(e) => updateRequest(currentRequest.id, {
                      auth: { 
                        ...currentRequest.auth, 
                        basic: { 
                          username: e.target.value, 
                          password: currentRequest.auth.basic?.password || '' 
                        } 
                      }
                    })}
                    placeholder="username"
                    className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Mot de passe</label>
                  <input
                    type="password"
                    value={currentRequest.auth.basic?.password || ''}
                    onChange={(e) => updateRequest(currentRequest.id, {
                      auth: { 
                        ...currentRequest.auth, 
                        basic: { 
                          username: currentRequest.auth.basic?.username || '', 
                          password: e.target.value 
                        } 
                      }
                    })}
                    placeholder="password"
                    className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Les identifiants seront encodés en Base64 et envoyés dans l'en-tête Authorization
                </p>
              </div>
            )}

            {currentRequest.auth.type === 'oauth2' && (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-2">Access Token</label>
                  <input
                    type="text"
                    value={currentRequest.auth.oauth2?.accessToken || ''}
                    onChange={(e) => updateRequest(currentRequest.id, {
                      auth: { 
                        ...currentRequest.auth, 
                        oauth2: { 
                          accessToken: e.target.value,
                          tokenType: currentRequest.auth.oauth2?.tokenType || 'Bearer'
                        } 
                      }
                    })}
                    placeholder="Entrez votre access token"
                    className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Token Type (optionnel)</label>
                  <input
                    type="text"
                    value={currentRequest.auth.oauth2?.tokenType || 'Bearer'}
                    onChange={(e) => updateRequest(currentRequest.id, {
                      auth: { 
                        ...currentRequest.auth, 
                        oauth2: { 
                          accessToken: currentRequest.auth.oauth2?.accessToken || '',
                          tokenType: e.target.value
                        } 
                      }
                    })}
                    placeholder="Bearer"
                    className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                </div>
                <p className="text-xs text-gray-500">
                  Le token sera envoyé dans l'en-tête: Authorization: {'<tokenType>'} {'<accessToken>'}
                </p>
              </div>
            )}

            {currentRequest.auth.type === 'none' && (
              <div className="text-center text-gray-500 mt-8">
                Aucune authentification configurée
              </div>
            )}
          </div>
        )}

        {activeTab === 'scripts' && (
          <div>
            <div className="flex border-b border-gray-700 mb-4">
              <button
                onClick={() => setScriptTab('pre-request')}
                className={`px-4 py-2 font-medium transition-colors ${
                  scriptTab === 'pre-request'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Pre-request Script
              </button>
              <button
                onClick={() => setScriptTab('tests')}
                className={`px-4 py-2 font-medium transition-colors ${
                  scriptTab === 'tests'
                    ? 'text-blue-400 border-b-2 border-blue-400'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                Tests
              </button>
            </div>

            {scriptTab === 'pre-request' && (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Script exécuté avant l'envoi de la requête. Utilisez <code className="bg-gray-800 px-1 rounded">pm</code> pour accéder aux variables.
                </p>
                <textarea
                  value={preRequestScript}
                  onChange={(e) => setPreRequestScript(e.target.value)}
                  placeholder="// Exemple:
// pm.environment.set('timestamp', Date.now());
// pm.globals.set('apiKey', 'your-key');"
                  className="w-full h-96 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
                  spellCheck={false}
                />
                <div className="mt-2 text-xs text-gray-500">
                  <strong>API disponible:</strong> pm.environment, pm.globals, pm.variables, pm.request
                </div>
              </div>
            )}

            {scriptTab === 'tests' && (
              <div>
                <p className="text-sm text-gray-400 mb-3">
                  Script exécuté après réception de la réponse. Utilisez <code className="bg-gray-800 px-1 rounded">pm.test()</code> pour créer des assertions.
                </p>
                <textarea
                  value={testScript}
                  onChange={(e) => setTestScript(e.target.value)}
                  placeholder="// Exemple:
// pm.test('Status is 200', () => {
//   pm.response.to.have.status(200);
// });
//
// pm.test('Response has data', () => {
//   const json = pm.response.json();
//   pm.expect(json).to.have.property('data');
// });"
                  className="w-full h-96 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500 font-mono text-sm"
                  spellCheck={false}
                />
                <div className="mt-2 text-xs text-gray-500">
                  <strong>API disponible:</strong> pm.test, pm.expect, pm.response, pm.environment.set()
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'cookies' && (
          <div>
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold">Cookies</h3>
              <button
                onClick={() => setCookies([...cookies, { key: '', value: '', domain: '', enabled: true }])}
                className="flex items-center gap-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
              >
                <Plus size={14} />
                Ajouter
              </button>
            </div>
            <div className="space-y-2">
              {cookies.map((cookie, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={cookie.enabled}
                    onChange={(e) => {
                      const newCookies = [...cookies]
                      newCookies[index].enabled = e.target.checked
                      setCookies(newCookies)
                    }}
                    className="w-4 h-4"
                  />
                  <input
                    type="text"
                    value={cookie.key}
                    onChange={(e) => {
                      const newCookies = [...cookies]
                      newCookies[index].key = e.target.value
                      setCookies(newCookies)
                    }}
                    placeholder="Nom"
                    className="flex-1 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={cookie.value}
                    onChange={(e) => {
                      const newCookies = [...cookies]
                      newCookies[index].value = e.target.value
                      setCookies(newCookies)
                    }}
                    placeholder="Valeur"
                    className="flex-1 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="text"
                    value={cookie.domain}
                    onChange={(e) => {
                      const newCookies = [...cookies]
                      newCookies[index].domain = e.target.value
                      setCookies(newCookies)
                    }}
                    placeholder="Domaine"
                    className="flex-1 px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => setCookies(cookies.filter((_, i) => i !== index))}
                    className="p-2 hover:bg-red-600 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
            {cookies.length === 0 && (
              <div className="text-center text-gray-500 mt-8">
                Aucun cookie configuré
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div>
            <h3 className="font-semibold mb-4">Paramètres de la requête</h3>
            <div className="space-y-4">
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" defaultChecked />
                  <span className="text-sm">Suivre les redirections automatiquement</span>
                </label>
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Désactiver la vérification SSL</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Timeout (ms)</label>
                <input
                  type="number"
                  defaultValue={30000}
                  className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Proxy (optionnel)</label>
                <input
                  type="text"
                  placeholder="http://proxy.example.com:8080"
                  className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-sm">Encoder automatiquement les paramètres URL</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
