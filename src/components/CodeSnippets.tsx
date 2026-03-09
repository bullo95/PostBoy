import { useState } from 'react'
import { X, Copy, Check } from 'lucide-react'
import { useStore } from '../store/useStore'
import { generateCode, CodeLanguage } from '../utils/codeGenerator'

interface CodeSnippetsProps {
  onClose: () => void
}

export default function CodeSnippets({ onClose }: CodeSnippetsProps) {
  const currentRequest = useStore((state) => state.currentRequest)
  const activeEnvironment = useStore((state) => state.activeEnvironment)
  const [selectedLanguage, setSelectedLanguage] = useState<CodeLanguage>('curl')
  const [copied, setCopied] = useState(false)

  if (!currentRequest) return null

  const languages: { value: CodeLanguage; label: string }[] = [
    { value: 'curl', label: 'cURL' },
    { value: 'javascript', label: 'JavaScript (Fetch)' },
    { value: 'nodejs', label: 'Node.js (Axios)' },
    { value: 'php', label: 'PHP (cURL)' },
    { value: 'symfony', label: 'Symfony HttpClient' },
    { value: 'python', label: 'Python (Requests)' },
    { value: 'wget', label: 'Wget' },
  ]

  const code = generateCode(selectedLanguage, currentRequest, activeEnvironment)

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252526] rounded-lg w-[900px] h-[700px] flex flex-col border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Exemples de Code</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-64 border-r border-gray-700 overflow-y-auto scrollbar-thin">
            <div className="p-2">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setSelectedLanguage(lang.value)}
                  className={`w-full text-left px-4 py-3 rounded mb-1 transition-colors ${
                    selectedLanguage === lang.value
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-700 text-gray-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">
                  {languages.find((l) => l.value === selectedLanguage)?.label}
                </h3>
                <p className="text-sm text-gray-400 mt-1">
                  {currentRequest.method} {currentRequest.url}
                </p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors"
              >
                {copied ? (
                  <>
                    <Check size={16} />
                    Copié !
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copier
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 overflow-auto scrollbar-thin p-4 bg-[#1e1e1e]">
              <pre className="text-sm font-mono text-gray-300 whitespace-pre-wrap">
                {code}
              </pre>
            </div>

            <div className="p-4 border-t border-gray-700 bg-[#1e1e1e]">
              <p className="text-xs text-gray-500">
                💡 <strong>Astuce :</strong> Ce code utilise les valeurs actuelles de votre requête
                {activeEnvironment && ` avec l'environnement "${activeEnvironment.name}"`}.
                Les variables ont été remplacées automatiquement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
