import { useState, useRef } from 'react'
import { Plus, Folder, ChevronRight, ChevronDown, Trash2, FileText, Download, Upload, Settings, Clock, Search, Globe, Copy, Archive } from 'lucide-react'
import { useStore } from '../store/useStore'
import { Request } from '../types'
import { exportToPostman, importFromPostman, downloadJSON, readJSONFile } from '../utils/postman'
import { exportAllToZip } from '../utils/backup'
import InputModal from './InputModal'
import ConfirmModal from './ConfirmModal'

interface SidebarProps {
  width: number
  onResize: (width: number) => void
  onOpenEnvironments: () => void
  onOpenHistory: () => void
}

export default function Sidebar({ width, onOpenEnvironments, onOpenHistory }: SidebarProps) {
  const [expandedCollections, setExpandedCollections] = useState<Set<string>>(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [showInputModal, setShowInputModal] = useState(false)
  const [inputModalConfig, setInputModalConfig] = useState({ title: '', placeholder: '', onConfirm: (value: string) => {} })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmModalConfig, setConfirmModalConfig] = useState({ title: '', message: '', onConfirm: () => {} })
  const fileInputRef = useRef<HTMLInputElement>(null)
  const collections = useStore((state) => state.collections)
  const currentRequest = useStore((state) => state.currentRequest)
  const addCollection = useStore((state) => state.addCollection)
  const deleteCollection = useStore((state) => state.deleteCollection)
  const duplicateCollection = useStore((state) => state.duplicateCollection)
  const addRequest = useStore((state) => state.addRequest)
  const deleteRequest = useStore((state) => state.deleteRequest)
  const duplicateRequest = useStore((state) => state.duplicateRequest)
  const setCurrentRequest = useStore((state) => state.setCurrentRequest)
  const importCollection = useStore((state) => state.importCollection)
  const environments = useStore((state) => state.environments)
  const activeEnvironment = useStore((state) => state.activeEnvironment)
  const setActiveEnvironment = useStore((state) => state.setActiveEnvironment)

  const toggleCollection = (id: string) => {
    const newExpanded = new Set(expandedCollections)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedCollections(newExpanded)
  }

  const handleExportAll = async () => {
    await exportAllToZip(collections, environments)
  }

  const handleImportZip = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const { importFromZip } = await import('../utils/backup')
      const { collections: importedCollections, environments: importedEnvironments } = await importFromZip(file)
      
      // Importer toutes les collections
      importedCollections.forEach((collection) => {
        importCollection(collection)
      })
      
      // Importer tous les environnements
      const importEnvironment = useStore.getState().importEnvironment
      importedEnvironments.forEach((env) => {
        importEnvironment(env)
      })
      
      alert(`Import réussi !\n${importedCollections.length} collection(s) et ${importedEnvironments.length} environnement(s) importés.`)
    } catch (error) {
      console.error('Erreur lors de l\'import:', error)
      alert('Erreur lors de l\'import du fichier ZIP')
    }
    
    // Reset input
    event.target.value = ''
  }

  const handleAddCollection = () => {
    setInputModalConfig({
      title: 'Nouvelle Collection',
      placeholder: 'Nom de la collection',
      onConfirm: (name: string) => {
        addCollection(name)
        setShowInputModal(false)
      }
    })
    setShowInputModal(true)
  }

  const handleAddRequest = (collectionId: string) => {
    setInputModalConfig({
      title: 'Nouvelle Requête',
      placeholder: 'Nom de la requête',
      onConfirm: (name: string) => {
        addRequest(collectionId, {
          name,
          method: 'GET',
          url: '',
          headers: [],
          queryParams: [],
          body: '',
          bodyType: 'none',
          auth: { type: 'none' },
        })
        setShowInputModal(false)
      }
    })
    setShowInputModal(true)
  }

  const handleExportCollection = (collectionId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const collection = collections.find((c) => c.id === collectionId)
    if (collection) {
      const postmanCollection = exportToPostman(collection)
      downloadJSON(postmanCollection, `${collection.name}.postman_collection.json`)
    }
  }

  const handleImportCollection = async () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const json = await readJSONFile(file)
        const collection = importFromPostman(json)
        importCollection(collection)
        alert(`Collection "${collection.name}" importée avec succès !`)
      } catch (error) {
        alert('Erreur lors de l\'import de la collection')
        console.error(error)
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleDeleteCollection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmModalConfig({
      title: 'Supprimer la collection',
      message: 'Êtes-vous sûr de vouloir supprimer cette collection et toutes ses requêtes ?',
      onConfirm: () => {
        deleteCollection(id)
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const handleDeleteRequest = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setConfirmModalConfig({
      title: 'Supprimer la requête',
      message: 'Êtes-vous sûr de vouloir supprimer cette requête ?',
      onConfirm: () => {
        deleteRequest(id)
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const handleSelectRequest = (request: Request) => {
    setCurrentRequest(request)
  }

  return (
    <div
      className="bg-[#252526] dark:bg-[#252526] bg-gray-100 border-r border-gray-700 dark:border-gray-700 border-gray-300 flex flex-col"
      style={{ width: `${width}px` }}
    >
      <div className="p-4 border-b border-gray-700 dark:border-gray-700 border-gray-300">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Collections</h2>
          <div className="flex gap-2">
            <button
              onClick={handleExportAll}
              className="p-2 hover:bg-green-700 dark:hover:bg-green-700 hover:bg-green-100 rounded transition-colors text-gray-700 dark:text-white"
              title="Tout exporter en ZIP"
            >
              <Archive size={18} />
            </button>
            <button
              onClick={onOpenHistory}
              className="p-2 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 rounded transition-colors text-gray-700 dark:text-white"
              title="Historique"
            >
              <Clock size={18} />
            </button>
            <button
              onClick={onOpenEnvironments}
              className="p-2 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 rounded transition-colors text-gray-700 dark:text-white"
              title="Environnements"
            >
              <Settings size={18} />
            </button>
          </div>
        </div>
        
        <div className="relative mb-3">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-500 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] dark:bg-[#1e1e1e] bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm text-gray-900 dark:text-white"
          />
        </div>

        <div className="flex gap-2 mb-2">
          <button
            onClick={handleAddCollection}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
          >
            <Plus size={16} />
            Nouveau
          </button>
          <button
            onClick={handleImportCollection}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors"
            title="Importer collection"
          >
            <Upload size={16} />
          </button>
          <button
            onClick={() => document.getElementById('zip-import-input')?.click()}
            className="px-3 py-2 bg-purple-600 hover:bg-purple-700 rounded text-sm font-medium transition-colors"
            title="Importer ZIP complet"
          >
            <Archive size={16} />
          </button>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".json"
          className="hidden"
        />
        <input
          type="file"
          id="zip-import-input"
          onChange={handleImportZip}
          accept=".zip"
          className="hidden"
        />
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin">
        {collections
          .filter(collection => 
            searchQuery === '' || 
            collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            collection.requests.some(req => 
              req.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
          )
          .map((collection) => (
          <div key={collection.id} className="border-b border-gray-800 dark:border-gray-800 border-gray-300">
            <div
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer group text-gray-900 dark:text-white"
              onClick={() => toggleCollection(collection.id)}
            >
              {expandedCollections.has(collection.id) ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <Folder size={16} className="text-blue-400 dark:text-blue-400 text-blue-600" />
              <span className="flex-1 truncate">{collection.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  duplicateCollection(collection.id)
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-600 rounded transition-opacity"
                title="Dupliquer"
              >
                <Copy size={14} />
              </button>
              <button
                onClick={(e) => handleExportCollection(collection.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-600 rounded transition-opacity"
                title="Exporter"
              >
                <Download size={14} />
              </button>
              <button
                onClick={(e) => handleDeleteCollection(collection.id, e)}
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-opacity"
                title="Supprimer"
              >
                <Trash2 size={14} />
              </button>
            </div>

            {expandedCollections.has(collection.id) && (
              <div className="bg-[#1e1e1e] dark:bg-[#1e1e1e] bg-gray-50">
                <button
                  onClick={() => handleAddRequest(collection.id)}
                  className="w-full flex items-center gap-2 px-8 py-2 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 text-sm text-gray-400 dark:text-gray-400 text-gray-600 hover:text-white dark:hover:text-white hover:text-gray-900 transition-colors"
                >
                  <Plus size={14} />
                  Nouvelle Requête
                </button>

                {collection.requests.map((request) => (
                  <div
                    key={request.id}
                    onClick={() => handleSelectRequest(request)}
                    className={`flex items-center gap-2 px-8 py-2 hover:bg-gray-700 dark:hover:bg-gray-700 hover:bg-gray-200 cursor-pointer group text-gray-900 dark:text-white ${
                      currentRequest?.id === request.id ? 'bg-gray-700 dark:bg-gray-700 bg-gray-300' : ''
                    }`}
                  >
                    <FileText size={14} className="text-gray-400 dark:text-gray-400 text-gray-600" />
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        request.method === 'GET'
                          ? 'bg-green-600'
                          : request.method === 'POST'
                          ? 'bg-blue-600'
                          : request.method === 'PUT'
                          ? 'bg-yellow-600'
                          : request.method === 'DELETE'
                          ? 'bg-red-600'
                          : 'bg-gray-600'
                      }`}
                    >
                      {request.method}
                    </span>
                    <span className="flex-1 truncate text-sm">{request.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        duplicateRequest(request.id)
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-blue-600 rounded transition-opacity"
                      title="Dupliquer"
                    >
                      <Copy size={12} />
                    </button>
                    <button
                      onClick={(e) => handleDeleteRequest(request.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-opacity"
                      title="Supprimer"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-gray-700 dark:border-gray-700 border-gray-300">
        <div className="mb-2 text-xs text-gray-500 dark:text-gray-500 text-gray-600 font-semibold">ENVIRONNEMENT</div>
        <select
          value={activeEnvironment?.id || ''}
          onChange={(e) => {
            const envId = e.target.value
            setActiveEnvironment(envId || null)
          }}
          className="w-full px-3 py-2 bg-[#252526] dark:bg-[#252526] bg-white border border-gray-600 dark:border-gray-600 border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm text-gray-900 dark:text-white"
        >
          <option value="">Aucun environnement</option>
          {environments.map((env) => (
            <option key={env.id} value={env.id}>
              {env.name}
            </option>
          ))}
        </select>
        {activeEnvironment && (
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-400 text-gray-600">
            <Globe size={12} className="text-green-400 dark:text-green-400 text-green-600" />
            <span className="truncate">{Object.keys(activeEnvironment.variables).length} variable(s)</span>
          </div>
        )}
      </div>

      <InputModal
        isOpen={showInputModal}
        title={inputModalConfig.title}
        placeholder={inputModalConfig.placeholder}
        onConfirm={inputModalConfig.onConfirm}
        onCancel={() => setShowInputModal(false)}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        title={confirmModalConfig.title}
        message={confirmModalConfig.message}
        confirmText="Supprimer"
        onConfirm={confirmModalConfig.onConfirm}
        onCancel={() => setShowConfirmModal(false)}
      />
    </div>
  )
}
