import { X, Trash2, Clock, ArrowRight, Bug, Eye, ChevronLeft } from 'lucide-react'
import { useStore } from '../store/useStore'
import ConfirmModal from './ConfirmModal'
import { useState } from 'react'
import { HistoryEntry } from '../types'

interface HistoryPanelProps {
  onClose: () => void
}

export default function HistoryPanel({ onClose }: HistoryPanelProps) {
  const history = useStore((state) => state.history)
  const clearHistory = useStore((state) => state.clearHistory)
  const deleteHistoryEntry = useStore((state) => state.deleteHistoryEntry)
  const setCurrentRequest = useStore((state) => state.setCurrentRequest)
  const setCurrentResponse = useStore((state) => state.setCurrentResponse)
  const debugMode = useStore((state) => state.debugMode)
  const setDebugMode = useStore((state) => state.setDebugMode)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<HistoryEntry | null>(null)
  const [detailTab, setDetailTab] = useState<'request' | 'response'>('request')

  const handleLoadEntry = (entry: HistoryEntry) => {
    setCurrentRequest(entry.request)
    setCurrentResponse(entry.response)
    onClose()
  }

  const handleViewDetails = (entry: HistoryEntry, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedEntry(entry)
  }

  const handleClearAll = () => {
    setShowConfirmModal(true)
  }

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'À l\'instant'
    if (minutes < 60) return `Il y a ${minutes} min`
    if (hours < 24) return `Il y a ${hours}h`
    if (days < 7) return `Il y a ${days}j`
    return date.toLocaleDateString('fr-FR')
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400'
    if (status >= 300 && status < 400) return 'text-yellow-400'
    if (status >= 400 && status < 500) return 'text-orange-400'
    if (status >= 500) return 'text-red-400'
    return 'text-gray-400'
  }

  // Vue détaillée d'une entrée
  if (selectedEntry) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#252526] rounded-lg w-[1200px] h-[800px] flex flex-col border border-gray-700">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
                title="Retour à la liste"
              >
                <ChevronLeft size={20} />
              </button>
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-1 rounded text-sm font-semibold ${
                    selectedEntry.request.method === 'GET'
                      ? 'bg-green-600'
                      : selectedEntry.request.method === 'POST'
                      ? 'bg-blue-600'
                      : selectedEntry.request.method === 'PUT'
                      ? 'bg-yellow-600'
                      : selectedEntry.request.method === 'DELETE'
                      ? 'bg-red-600'
                      : 'bg-gray-600'
                  }`}
                >
                  {selectedEntry.request.method}
                </span>
                <span className={`text-lg font-semibold ${getStatusColor(selectedEntry.response.status)}`}>
                  {selectedEntry.response.status} {selectedEntry.response.statusText}
                </span>
                <span className="text-sm text-gray-500">{selectedEntry.response.time}ms</span>
                <span className="text-sm text-gray-500">{formatDate(selectedEntry.timestamp)}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex border-b border-gray-700">
            <button
              onClick={() => setDetailTab('request')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                detailTab === 'request'
                  ? 'bg-[#1e1e1e] text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Requête
            </button>
            <button
              onClick={() => setDetailTab('response')}
              className={`flex-1 px-4 py-3 font-medium transition-colors ${
                detailTab === 'response'
                  ? 'bg-[#1e1e1e] text-blue-400 border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              Réponse
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {detailTab === 'request' ? (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">URL</h3>
                  <div className="bg-[#1e1e1e] p-3 rounded border border-gray-700 font-mono text-sm break-all">
                    {debugMode ? selectedEntry.request.url : (selectedEntry.resolvedUrl || selectedEntry.request.url)}
                  </div>
                </div>

                {selectedEntry.request.headers.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Headers</h3>
                    <div className="bg-[#1e1e1e] rounded border border-gray-700">
                      {selectedEntry.request.headers.filter(h => h.enabled).map((header, idx) => (
                        <div key={idx} className="flex border-b border-gray-700 last:border-b-0">
                          <div className="px-3 py-2 font-mono text-sm text-blue-400 w-1/3">{header.key}</div>
                          <div className="px-3 py-2 font-mono text-sm text-gray-300 flex-1 break-all">{header.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEntry.request.queryParams.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Query Parameters</h3>
                    <div className="bg-[#1e1e1e] rounded border border-gray-700">
                      {selectedEntry.request.queryParams.filter(p => p.enabled).map((param, idx) => (
                        <div key={idx} className="flex border-b border-gray-700 last:border-b-0">
                          <div className="px-3 py-2 font-mono text-sm text-blue-400 w-1/3">{param.key}</div>
                          <div className="px-3 py-2 font-mono text-sm text-gray-300 flex-1 break-all">{param.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {selectedEntry.request.body && selectedEntry.request.bodyType !== 'none' && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Body ({selectedEntry.request.bodyType})</h3>
                    <pre className="bg-[#1e1e1e] p-3 rounded border border-gray-700 font-mono text-sm overflow-x-auto">
                      {selectedEntry.request.bodyType === 'json' 
                        ? JSON.stringify(JSON.parse(selectedEntry.request.body), null, 2)
                        : selectedEntry.request.body}
                    </pre>
                  </div>
                )}

                {selectedEntry.request.auth.type !== 'none' && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Authentification</h3>
                    <div className="bg-[#1e1e1e] p-3 rounded border border-gray-700">
                      <div className="text-sm text-blue-400 mb-2">Type: {selectedEntry.request.auth.type}</div>
                      {selectedEntry.request.auth.type === 'bearer' && selectedEntry.request.auth.bearer && (
                        <div className="font-mono text-sm text-gray-300 break-all">Token: {selectedEntry.request.auth.bearer.token}</div>
                      )}
                      {selectedEntry.request.auth.type === 'basic' && selectedEntry.request.auth.basic && (
                        <div className="font-mono text-sm text-gray-300">
                          <div>Username: {selectedEntry.request.auth.basic.username}</div>
                          <div>Password: ••••••••</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Status</h3>
                  <div className="bg-[#1e1e1e] p-3 rounded border border-gray-700">
                    <span className={`text-lg font-semibold ${getStatusColor(selectedEntry.response.status)}`}>
                      {selectedEntry.response.status} {selectedEntry.response.statusText}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Métadonnées</h3>
                  <div className="bg-[#1e1e1e] rounded border border-gray-700">
                    <div className="flex border-b border-gray-700">
                      <div className="px-3 py-2 text-sm text-gray-400 w-1/3">Temps de réponse</div>
                      <div className="px-3 py-2 text-sm text-gray-300">{selectedEntry.response.time}ms</div>
                    </div>
                    <div className="flex">
                      <div className="px-3 py-2 text-sm text-gray-400 w-1/3">Taille</div>
                      <div className="px-3 py-2 text-sm text-gray-300">{selectedEntry.response.size} bytes</div>
                    </div>
                  </div>
                </div>

                {Object.keys(selectedEntry.response.headers).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-400 mb-2">Headers</h3>
                    <div className="bg-[#1e1e1e] rounded border border-gray-700">
                      {Object.entries(selectedEntry.response.headers).map(([key, value], idx) => (
                        <div key={idx} className="flex border-b border-gray-700 last:border-b-0">
                          <div className="px-3 py-2 font-mono text-sm text-blue-400 w-1/3">{key}</div>
                          <div className="px-3 py-2 font-mono text-sm text-gray-300 flex-1 break-all">{value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <h3 className="text-sm font-semibold text-gray-400 mb-2">Body</h3>
                  <pre className="bg-[#1e1e1e] p-3 rounded border border-gray-700 font-mono text-sm overflow-x-auto max-h-96">
                    {selectedEntry.response.data}
                  </pre>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
            <button
              onClick={() => handleLoadEntry(selectedEntry)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded font-medium transition-colors"
            >
              Charger dans l'éditeur
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Vue liste
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252526] rounded-lg w-[900px] h-[700px] flex flex-col border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock size={20} />
            Historique
          </h2>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setDebugMode(!debugMode)}
              className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-2 ${
                debugMode ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-700 hover:bg-gray-600'
              }`}
              title="Mode debug : affiche les variables au lieu des valeurs résolues"
            >
              <Bug size={16} />
              {debugMode ? 'Debug ON' : 'Debug OFF'}
            </button>
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm transition-colors"
              >
                Tout supprimer
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Clock size={64} className="mb-4 opacity-50" />
              <p className="text-lg">Aucune requête dans l'historique</p>
              <p className="text-sm mt-2">Vos 100 dernières requêtes apparaîtront ici</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="bg-[#1e1e1e] rounded-lg p-4 hover:bg-[#2a2a2a] transition-colors cursor-pointer border border-gray-700 group"
                  onClick={() => handleLoadEntry(entry)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-semibold ${
                            entry.request.method === 'GET'
                              ? 'bg-green-600'
                              : entry.request.method === 'POST'
                              ? 'bg-blue-600'
                              : entry.request.method === 'PUT'
                              ? 'bg-yellow-600'
                              : entry.request.method === 'DELETE'
                              ? 'bg-red-600'
                              : 'bg-gray-600'
                          }`}
                        >
                          {entry.request.method}
                        </span>
                        <span className={`text-sm font-semibold ${getStatusColor(entry.response.status)}`}>
                          {entry.response.status}
                        </span>
                        <span className="text-xs text-gray-500">{entry.response.time}ms</span>
                        <span className="text-xs text-gray-500">{formatDate(entry.timestamp)}</span>
                      </div>

                      <div className="text-sm text-gray-300 mb-2 font-mono truncate">
                        {debugMode ? entry.request.url : (entry.resolvedUrl || entry.request.url)}
                      </div>

                      {entry.request.name && (
                        <div className="text-xs text-gray-500">
                          {entry.request.name}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={(e) => handleViewDetails(entry, e)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-purple-600 hover:bg-purple-700 rounded transition-all"
                        title="Voir les détails"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleLoadEntry(entry)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-blue-600 hover:bg-blue-700 rounded transition-all"
                        title="Charger dans l'éditeur"
                      >
                        <ArrowRight size={16} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteHistoryEntry(entry.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-600 rounded transition-all"
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirmModal}
        title="Supprimer l'historique"
        message="Êtes-vous sûr de vouloir supprimer tout l'historique ? Cette action est irréversible."
        confirmText="Supprimer"
        onConfirm={() => {
          clearHistory()
          setShowConfirmModal(false)
        }}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  )
}
