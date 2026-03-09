import { useState } from 'react'
import { useStore } from '../store/useStore'

export default function ResponsePanel() {
  const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body')
  const currentResponse = useStore((state) => state.currentResponse)

  if (!currentResponse) {
    return (
      <div className="flex items-center justify-center h-full bg-[#1e1e1e] text-gray-500">
        Aucune réponse pour le moment
      </div>
    )
  }

  const getStatusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400'
    if (status >= 300 && status < 400) return 'text-yellow-400'
    if (status >= 400 && status < 500) return 'text-orange-400'
    if (status >= 500) return 'text-red-400'
    return 'text-gray-400'
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e]">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Statut:</span>
            <span className={`font-semibold ${getStatusColor(currentResponse.status)}`}>
              {currentResponse.status} {currentResponse.statusText}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Temps:</span>
            <span className="font-semibold text-blue-400">{currentResponse.time} ms</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Taille:</span>
            <span className="font-semibold text-purple-400">{formatSize(currentResponse.size)}</span>
          </div>
        </div>
      </div>

      <div className="border-b border-gray-700">
        <div className="flex gap-1 px-4">
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
            onClick={() => setActiveTab('headers')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'headers'
                ? 'text-blue-400 border-b-2 border-blue-400'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            En-têtes
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {activeTab === 'body' && (
          <pre className="bg-[#252526] p-4 rounded border border-gray-700 overflow-x-auto">
            <code className="text-sm font-mono text-gray-200">{currentResponse.data}</code>
          </pre>
        )}

        {activeTab === 'headers' && (
          <div className="space-y-2">
            {Object.entries(currentResponse.headers).map(([key, value]) => (
              <div key={key} className="flex gap-4 p-3 bg-[#252526] rounded border border-gray-700">
                <span className="font-semibold text-blue-400 min-w-[200px]">{key}:</span>
                <span className="text-gray-300 break-all">{value}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
