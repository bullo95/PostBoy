import { useState, useRef } from 'react'
import { X, Plus, Trash2, Download, Upload } from 'lucide-react'
import { useStore } from '../store/useStore'
import { exportEnvironments, exportSingleEnvironment, importEnvironments } from '../utils/environmentIO'
import InputModal from './InputModal'
import ConfirmModal from './ConfirmModal'

interface EnvironmentManagerProps {
  onClose: () => void
}

export default function EnvironmentManager({ onClose }: EnvironmentManagerProps) {
  const environments = useStore((state) => state.environments)
  const activeEnvironment = useStore((state) => state.activeEnvironment)
  const addEnvironment = useStore((state) => state.addEnvironment)
  const importEnvironment = useStore((state) => state.importEnvironment)
  const updateEnvironment = useStore((state) => state.updateEnvironment)
  const deleteEnvironment = useStore((state) => state.deleteEnvironment)
  const setActiveEnvironment = useStore((state) => state.setActiveEnvironment)

  const [selectedEnvId, setSelectedEnvId] = useState<string | null>(
    activeEnvironment?.id || null
  )
  const [showInputModal, setShowInputModal] = useState(false)
  const [inputModalConfig, setInputModalConfig] = useState({ title: '', placeholder: '', onConfirm: (value: string) => {} })
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [confirmModalConfig, setConfirmModalConfig] = useState({ title: '', message: '', onConfirm: () => {} })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const selectedEnv = environments.find((e) => e.id === selectedEnvId)

  const handleAddEnvironment = () => {
    setInputModalConfig({
      title: 'Nouvel Environnement',
      placeholder: 'Nom de l\'environnement',
      onConfirm: (name: string) => {
        addEnvironment(name)
        setShowInputModal(false)
      }
    })
    setShowInputModal(true)
  }

  const handleDeleteEnvironment = (id: string) => {
    setConfirmModalConfig({
      title: 'Supprimer l\'environnement',
      message: 'Êtes-vous sûr de vouloir supprimer cet environnement et toutes ses variables ?',
      onConfirm: () => {
        deleteEnvironment(id)
        if (selectedEnvId === id) {
          setSelectedEnvId(null)
        }
        setShowConfirmModal(false)
      }
    })
    setShowConfirmModal(true)
  }

  const handleAddVariable = () => {
    if (!selectedEnv) return
    setInputModalConfig({
      title: 'Nouvelle Variable',
      placeholder: 'Nom de la variable',
      onConfirm: (key: string) => {
        updateEnvironment(selectedEnv.id, {
          variables: { ...selectedEnv.variables, [key]: '' },
        })
        setShowInputModal(false)
      }
    })
    setShowInputModal(true)
  }

  const handleUpdateVariable = (key: string, value: string) => {
    if (!selectedEnv) return
    updateEnvironment(selectedEnv.id, {
      variables: { ...selectedEnv.variables, [key]: value },
    })
  }

  const handleDeleteVariable = (key: string) => {
    if (!selectedEnv) return
    const newVars = { ...selectedEnv.variables }
    delete newVars[key]
    updateEnvironment(selectedEnv.id, { variables: newVars })
  }

  const handleSetActive = (id: string) => {
    setActiveEnvironment(id)
  }

  const handleExportAll = () => {
    if (environments.length === 0) {
      alert('Aucun environnement à exporter')
      return
    }
    exportEnvironments(environments)
  }

  const handleExportSingle = (envId: string) => {
    const env = environments.find(e => e.id === envId)
    if (env) {
      exportSingleEnvironment(env)
    }
  }

  const handleImport = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      try {
        const importedEnvs = await importEnvironments(file)
        
        // Import all environments with their variables
        importedEnvs.forEach(env => {
          importEnvironment({
            name: env.name,
            variables: env.variables
          })
        })
        
        alert(`${importedEnvs.length} environnement(s) importé(s) avec succès !`)
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Erreur lors de l\'import')
      }
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252526] rounded-lg w-[800px] h-[600px] flex flex-col border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Gestion des Environnements</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors flex items-center gap-2"
              title="Importer des environnements"
            >
              <Upload size={16} />
              Importer
            </button>
            <button
              onClick={handleExportAll}
              className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium transition-colors flex items-center gap-2"
              title="Exporter tous les environnements"
            >
              <Download size={16} />
              Tout exporter
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700">
              <button
                onClick={handleAddEnvironment}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium transition-colors"
              >
                <Plus size={16} />
                Nouvel Environnement
              </button>
            </div>

            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {environments.map((env) => (
                <div
                  key={env.id}
                  onClick={() => setSelectedEnvId(env.id)}
                  className={`p-3 cursor-pointer hover:bg-gray-700 border-b border-gray-800 group ${
                    selectedEnvId === env.id ? 'bg-gray-700' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="radio"
                        checked={env.active}
                        onChange={() => handleSetActive(env.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-4 h-4"
                      />
                      <span className="truncate">{env.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleExportSingle(env.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-green-600 rounded transition-opacity"
                        title="Exporter cet environnement"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteEnvironment(env.id)
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-600 rounded transition-opacity"
                        title="Supprimer"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            {selectedEnv ? (
              <>
                <div className="p-4 border-b border-gray-700">
                  <h3 className="text-lg font-semibold mb-2">{selectedEnv.name}</h3>
                  <p className="text-sm text-gray-400">
                    Variables: {Object.keys(selectedEnv.variables).length}
                  </p>
                </div>

                <div className="p-4 border-b border-gray-700">
                  <button
                    onClick={handleAddVariable}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
                  >
                    <Plus size={16} />
                    Ajouter une variable
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
                  <div className="space-y-2">
                    {Object.entries(selectedEnv.variables).map(([key, value]) => (
                      <div
                        key={key}
                        className="flex gap-2 items-center p-3 bg-[#1e1e1e] rounded border border-gray-700"
                      >
                        <div className="flex-1 grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">
                              Variable
                            </label>
                            <input
                              type="text"
                              value={key}
                              disabled
                              className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded text-sm"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-gray-400 mb-1 block">
                              Valeur
                            </label>
                            <input
                              type="text"
                              value={value}
                              onChange={(e) => handleUpdateVariable(key, e.target.value)}
                              className="w-full px-3 py-2 bg-[#252526] border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-sm"
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteVariable(key)}
                          className="p-2 hover:bg-red-600 rounded transition-colors mt-5"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {Object.keys(selectedEnv.variables).length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                      Aucune variable définie. Utilisez {'{{variable}}'} dans vos requêtes.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Sélectionnez un environnement
              </div>
            )}
          </div>
        </div>
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
