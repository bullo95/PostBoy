import { X, Book, Zap, Globe, Lock, History, Code2, Download } from 'lucide-react'

interface HelpPanelProps {
  onClose: () => void
}

export default function HelpPanel({ onClose }: HelpPanelProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252526] rounded-lg w-[900px] h-[700px] flex flex-col border border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Book size={24} className="text-blue-400" />
            <h2 className="text-xl font-semibold">Guide d'utilisation - Postboy</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
          <div className="max-w-3xl mx-auto space-y-6">
            <section>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Bienvenue sur Postboy
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Postboy est un client API open source, gratuit et multi-plateforme. 
                Testez vos APIs REST facilement avec une interface moderne et intuitive.
              </p>
            </section>

            <section className="bg-[#1e1e1e] rounded-lg p-5 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="text-yellow-400" size={20} />
                <h4 className="text-lg font-semibold">Démarrage rapide</h4>
              </div>
              <ol className="space-y-2 text-gray-300 list-decimal list-inside">
                <li>Créez une <strong>collection</strong> pour organiser vos requêtes</li>
                <li>Ajoutez une <strong>nouvelle requête</strong> dans la collection</li>
                <li>Configurez la <strong>méthode HTTP</strong> et l'<strong>URL</strong></li>
                <li>Ajoutez des paramètres, headers ou un body si nécessaire</li>
                <li>Cliquez sur <strong>"Envoyer"</strong> pour exécuter la requête</li>
              </ol>
            </section>

            <section className="bg-[#1e1e1e] rounded-lg p-5 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Globe className="text-green-400" size={20} />
                <h4 className="text-lg font-semibold">Variables d'environnement</h4>
              </div>
              <p className="text-gray-300 mb-3">
                Gérez plusieurs environnements (dev, staging, production) avec des variables réutilisables.
              </p>
              <div className="bg-[#252526] p-3 rounded font-mono text-sm text-gray-300">
                <div>1. Cliquez sur l'icône <strong>⚙️</strong> dans la sidebar</div>
                <div>2. Créez un environnement (ex: "Production")</div>
                <div>3. Ajoutez des variables :</div>
                <div className="ml-4 text-blue-400">• api_url = https://api.example.com</div>
                <div className="ml-4 text-blue-400">• api_key = votre_clé_api</div>
                <div>4. Utilisez-les avec : <span className="text-yellow-400">{'{{api_url}}'}/users</span></div>
              </div>
            </section>

            <section className="bg-[#1e1e1e] rounded-lg p-5 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Lock className="text-red-400" size={20} />
                <h4 className="text-lg font-semibold">Authentification</h4>
              </div>
              <p className="text-gray-300 mb-3">
                Postboy supporte plusieurs types d'authentification :
              </p>
              <ul className="space-y-2 text-gray-300">
                <li>
                  <strong className="text-blue-400">Bearer Token :</strong> Pour les APIs avec JWT
                  <div className="text-sm text-gray-500 ml-4">→ Authorization: Bearer {'<token>'}</div>
                </li>
                <li>
                  <strong className="text-green-400">Basic Auth :</strong> Username/Password encodé en Base64
                  <div className="text-sm text-gray-500 ml-4">→ Authorization: Basic {'<base64>'}</div>
                </li>
                <li>
                  <strong className="text-purple-400">OAuth 2.0 :</strong> Access token avec type personnalisable
                  <div className="text-sm text-gray-500 ml-4">→ Authorization: {'<type>'} {'<token>'}</div>
                </li>
              </ul>
            </section>

            <section className="bg-[#1e1e1e] rounded-lg p-5 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <History className="text-orange-400" size={20} />
                <h4 className="text-lg font-semibold">Historique</h4>
              </div>
              <p className="text-gray-300">
                Toutes vos requêtes sont automatiquement sauvegardées (100 dernières). 
                Cliquez sur l'icône <strong>🕐</strong> pour accéder à l'historique et recharger 
                une requête précédente en un clic.
              </p>
            </section>

            <section className="bg-[#1e1e1e] rounded-lg p-5 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Code2 className="text-cyan-400" size={20} />
                <h4 className="text-lg font-semibold">Génération de code</h4>
              </div>
              <p className="text-gray-300 mb-3">
                Générez automatiquement le code de votre requête dans plusieurs langages :
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                <div>• cURL</div>
                <div>• JavaScript (Fetch)</div>
                <div>• Node.js (Axios)</div>
                <div>• PHP (cURL)</div>
                <div>• Symfony HttpClient</div>
                <div>• Python (Requests)</div>
                <div>• Wget</div>
              </div>
              <p className="text-gray-300 mt-3">
                Cliquez sur le bouton <strong>{"</>"}</strong> dans le panneau de requête.
              </p>
            </section>

            <section className="bg-[#1e1e1e] rounded-lg p-5 border border-gray-700">
              <div className="flex items-center gap-3 mb-3">
                <Download className="text-pink-400" size={20} />
                <h4 className="text-lg font-semibold">Import/Export</h4>
              </div>
              <p className="text-gray-300 mb-2">
                <strong>Exporter :</strong> Survolez une collection → cliquez sur l'icône 📥
              </p>
              <p className="text-gray-300">
                <strong>Importer :</strong> Cliquez sur l'icône 📤 → sélectionnez un fichier Postman Collection (.json)
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Format compatible : Postman Collection v2.1
              </p>
            </section>

            <section className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-5">
              <h4 className="text-lg font-semibold mb-2">💡 Raccourcis clavier</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><kbd className="px-2 py-1 bg-black bg-opacity-30 rounded">Ctrl/Cmd + Enter</kbd> Envoyer</div>
                <div><kbd className="px-2 py-1 bg-black bg-opacity-30 rounded">Ctrl/Cmd + K</kbd> Rechercher</div>
              </div>
            </section>

            <section className="text-center text-gray-500 text-sm pt-4 border-t border-gray-700">
              <p>Postboy v1.0.0 - Open Source API Client</p>
              <p className="mt-1">
                Développé avec ❤️ pour la communauté • 
                <a href="https://github.com" className="text-blue-400 hover:underline ml-1">GitHub</a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
