import { useState } from 'react'
import { X, Book, Zap, Globe, Lock, History, Code2, Download, Upload, Settings, Search } from 'lucide-react'

interface DocumentationProps {
  onClose: () => void
}

type Section = 
  | 'introduction'
  | 'quickstart'
  | 'collections'
  | 'requests'
  | 'environments'
  | 'authentication'
  | 'history'
  | 'import-export'
  | 'code-generation'
  | 'shortcuts'

export default function Documentation({ onClose }: DocumentationProps) {
  const [activeSection, setActiveSection] = useState<Section>('introduction')
  const [searchQuery, setSearchQuery] = useState('')

  const sections = [
    { id: 'introduction' as Section, title: 'Introduction', icon: Book },
    { id: 'quickstart' as Section, title: 'Démarrage rapide', icon: Zap },
    { id: 'collections' as Section, title: 'Collections', icon: Book },
    { id: 'requests' as Section, title: 'Requêtes HTTP', icon: Zap },
    { id: 'environments' as Section, title: 'Environnements', icon: Globe },
    { id: 'authentication' as Section, title: 'Authentification', icon: Lock },
    { id: 'history' as Section, title: 'Historique', icon: History },
    { id: 'import-export' as Section, title: 'Import/Export', icon: Download },
    { id: 'code-generation' as Section, title: 'Génération de code', icon: Code2 },
    { id: 'shortcuts' as Section, title: 'Raccourcis', icon: Settings },
  ]

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Bienvenue sur Postboy
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Postboy est un client API open source, gratuit et multi-plateforme conçu pour tester et 
                développer vos APIs REST de manière simple et efficace.
              </p>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Zap className="text-yellow-400" size={24} />
                Pourquoi Postboy ?
              </h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>100% Open Source</strong> - Code transparent et communauté active</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>Données locales</strong> - Vos données restent sur votre machine</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>Multi-plateforme</strong> - macOS, Linux et Windows</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>Interface moderne</strong> - UI intuitive et élégante</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-400 mt-1">✓</span>
                  <span><strong>Compatible Postman</strong> - Importez vos collections existantes</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-3">🚀 Fonctionnalités principales</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>• Requêtes HTTP complètes</div>
                <div>• Variables d'environnement</div>
                <div>• Authentification (Bearer, Basic, OAuth)</div>
                <div>• Historique automatique</div>
                <div>• Import/Export Postman</div>
                <div>• Génération de code (7 langages)</div>
                <div>• Collections organisées</div>
                <div>• Sauvegarde automatique</div>
              </div>
            </div>
          </div>
        )

      case 'quickstart':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Démarrage rapide</h2>
            
            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">En 5 étapes simples</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Créer une collection</h4>
                    <p className="text-gray-300">
                      Cliquez sur <strong>"Nouveau"</strong> dans la sidebar pour créer votre première collection.
                      Les collections vous permettent d'organiser vos requêtes par projet ou API.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Ajouter une requête</h4>
                    <p className="text-gray-300">
                      Développez votre collection et cliquez sur <strong>"Nouvelle Requête"</strong>.
                      Donnez-lui un nom descriptif (ex: "Récupérer utilisateurs").
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Configurer la requête</h4>
                    <p className="text-gray-300 mb-2">
                      Sélectionnez la méthode HTTP (GET, POST, PUT, DELETE...) et entrez l'URL :
                    </p>
                    <div className="bg-[#252526] p-3 rounded font-mono text-sm">
                      https://api.example.com/users
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Ajouter des paramètres (optionnel)</h4>
                    <p className="text-gray-300">
                      Utilisez les onglets <strong>Paramètres</strong>, <strong>En-têtes</strong>, 
                      <strong>Corps</strong> et <strong>Authentification</strong> pour configurer votre requête.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-green-600 rounded-full flex items-center justify-center font-bold">
                    5
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Envoyer !</h4>
                    <p className="text-gray-300">
                      Cliquez sur le bouton <strong className="text-blue-400">"Envoyer"</strong> et 
                      visualisez la réponse dans le panneau inférieur.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
              <p className="text-yellow-200">
                💡 <strong>Astuce :</strong> Toutes vos requêtes sont automatiquement sauvegardées. 
                Vous pouvez fermer l'application et retrouver votre travail au prochain démarrage !
              </p>
            </div>
          </div>
        )

      case 'collections':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Collections</h2>
            
            <p className="text-gray-300 text-lg">
              Les collections permettent d'organiser vos requêtes par projet, API ou environnement.
            </p>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Gestion des collections</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Créer une collection</h4>
                  <p className="text-gray-300">
                    Cliquez sur le bouton <strong>"Nouveau"</strong> dans la sidebar et donnez un nom à votre collection.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Organiser les requêtes</h4>
                  <p className="text-gray-300">
                    Cliquez sur une collection pour la développer et voir toutes ses requêtes. 
                    Vous pouvez ajouter autant de requêtes que nécessaire dans chaque collection.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Exporter une collection</h4>
                  <p className="text-gray-300 mb-2">
                    Survolez une collection et cliquez sur l'icône <strong>📥</strong> pour l'exporter au format Postman.
                    Le fichier JSON peut être partagé avec votre équipe ou importé dans Postman.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">Supprimer une collection</h4>
                  <p className="text-gray-300">
                    Survolez une collection et cliquez sur l'icône <strong>🗑️</strong>. 
                    Une confirmation vous sera demandée.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
              <p className="text-blue-200">
                💡 <strong>Bonne pratique :</strong> Créez une collection par API ou par projet. 
                Par exemple : "API Utilisateurs", "API Paiements", "Tests Production", etc.
              </p>
            </div>
          </div>
        )

      case 'requests':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Requêtes HTTP</h2>
            
            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Méthodes HTTP supportées</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded p-3">
                  <div className="font-bold text-green-400">GET</div>
                  <div className="text-sm text-gray-300">Récupérer des données</div>
                </div>
                <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded p-3">
                  <div className="font-bold text-blue-400">POST</div>
                  <div className="text-sm text-gray-300">Créer une ressource</div>
                </div>
                <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded p-3">
                  <div className="font-bold text-yellow-400">PUT</div>
                  <div className="text-sm text-gray-300">Mettre à jour (complet)</div>
                </div>
                <div className="bg-orange-600 bg-opacity-20 border border-orange-600 rounded p-3">
                  <div className="font-bold text-orange-400">PATCH</div>
                  <div className="text-sm text-gray-300">Mettre à jour (partiel)</div>
                </div>
                <div className="bg-red-600 bg-opacity-20 border border-red-600 rounded p-3">
                  <div className="font-bold text-red-400">DELETE</div>
                  <div className="text-sm text-gray-300">Supprimer une ressource</div>
                </div>
                <div className="bg-gray-600 bg-opacity-20 border border-gray-600 rounded p-3">
                  <div className="font-bold text-gray-400">HEAD / OPTIONS</div>
                  <div className="text-sm text-gray-300">Métadonnées</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Onglets de configuration</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">📋 Paramètres</h4>
                  <p className="text-gray-300 mb-2">
                    Ajoutez des paramètres de requête (query parameters) qui seront ajoutés à l'URL.
                  </p>
                  <div className="bg-[#252526] p-3 rounded font-mono text-sm">
                    ?page=1&limit=10&sort=name
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">📝 En-têtes</h4>
                  <p className="text-gray-300 mb-2">
                    Configurez les headers HTTP (Content-Type, Accept, etc.)
                  </p>
                  <div className="bg-[#252526] p-3 rounded font-mono text-sm">
                    Content-Type: application/json<br/>
                    Accept: application/json
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">📄 Corps</h4>
                  <p className="text-gray-300 mb-2">
                    Ajoutez un corps de requête (JSON, XML, texte) pour les méthodes POST, PUT, PATCH.
                  </p>
                  <div className="bg-[#252526] p-3 rounded font-mono text-sm">
                    {'{'}<br/>
                    &nbsp;&nbsp;"name": "John Doe",<br/>
                    &nbsp;&nbsp;"email": "john@example.com"<br/>
                    {'}'}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-blue-400 mb-2">🔐 Authentification</h4>
                  <p className="text-gray-300">
                    Configurez l'authentification (voir section dédiée).
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'environments':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Variables d'environnement</h2>
            
            <p className="text-gray-300 text-lg">
              Les environnements permettent de gérer différentes configurations (développement, staging, production) 
              avec des variables réutilisables.
            </p>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Créer un environnement</h3>
              
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">1.</span>
                  <span>Cliquez sur l'icône <strong>⚙️</strong> dans la sidebar</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">2.</span>
                  <span>Cliquez sur <strong>"Nouvel Environnement"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">3.</span>
                  <span>Donnez un nom (ex: "Production", "Développement")</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">4.</span>
                  <span>Ajoutez des variables avec <strong>"Ajouter une variable"</strong></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">5.</span>
                  <span>Sélectionnez l'environnement actif avec le bouton radio</span>
                </li>
              </ol>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Utiliser les variables</h3>
              
              <p className="text-gray-300 mb-4">
                Utilisez la syntaxe <code className="bg-[#252526] px-2 py-1 rounded">{'{{nom_variable}}'}</code> 
                dans vos requêtes :
              </p>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">URL :</div>
                  <div className="bg-[#252526] p-3 rounded font-mono text-sm text-yellow-400">
                    {'{{api_url}}'}/users
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Header :</div>
                  <div className="bg-[#252526] p-3 rounded font-mono text-sm">
                    Authorization: Bearer {'{{api_token}}'}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 mb-1">Body :</div>
                  <div className="bg-[#252526] p-3 rounded font-mono text-sm">
                    {'{'}<br/>
                    &nbsp;&nbsp;"api_key": "{'{{api_key}}'}"<br/>
                    {'}'}
                  </div>
                </div>
              </div>

              <div className="mt-4 bg-green-600 bg-opacity-20 border border-green-600 rounded p-3">
                <p className="text-green-200 text-sm">
                  ✅ <strong>Sélection rapide :</strong> Vous pouvez aussi sélectionner l'environnement directement 
                  en bas de la sidebar, sans ouvrir le gestionnaire !
                </p>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Exemple pratique</h3>
              
              <div className="space-y-3">
                <div>
                  <div className="font-semibold text-green-400 mb-2">Environnement "Production"</div>
                  <div className="bg-[#252526] p-3 rounded font-mono text-sm space-y-1">
                    <div>api_url = https://api.production.com</div>
                    <div>api_token = prod_abc123xyz</div>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-blue-400 mb-2">Environnement "Développement"</div>
                  <div className="bg-[#252526] p-3 rounded font-mono text-sm space-y-1">
                    <div>api_url = http://localhost:3000</div>
                    <div>api_token = dev_test123</div>
                  </div>
                </div>
              </div>

              <p className="text-gray-400 text-sm mt-4">
                Changez d'environnement en un clic pour tester sur différents serveurs !
              </p>
            </div>
          </div>
        )

      case 'authentication':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Authentification</h2>
            
            <p className="text-gray-300 text-lg">
              Postboy supporte les principaux types d'authentification utilisés par les APIs modernes.
            </p>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">🔑</div>
                Bearer Token
              </h3>
              
              <p className="text-gray-300 mb-3">
                Utilisé pour les APIs avec JWT (JSON Web Tokens) ou tokens d'API.
              </p>

              <div className="bg-[#252526] p-4 rounded">
                <div className="text-sm text-gray-500 mb-2">Configuration :</div>
                <div className="font-mono text-sm mb-3">
                  Token: <span className="text-yellow-400">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">Header généré :</div>
                <div className="font-mono text-sm text-green-400">
                  Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                💡 Vous pouvez utiliser une variable : <code className="bg-[#252526] px-2 py-1 rounded">{'{{auth_token}}'}</code>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">👤</div>
                Basic Auth
              </h3>
              
              <p className="text-gray-300 mb-3">
                Authentification par nom d'utilisateur et mot de passe (encodé en Base64).
              </p>

              <div className="bg-[#252526] p-4 rounded">
                <div className="text-sm text-gray-500 mb-2">Configuration :</div>
                <div className="font-mono text-sm mb-1">
                  Username: <span className="text-yellow-400">admin</span>
                </div>
                <div className="font-mono text-sm mb-3">
                  Password: <span className="text-yellow-400">••••••••</span>
                </div>
                <div className="text-sm text-gray-500 mb-2">Header généré :</div>
                <div className="font-mono text-sm text-green-400">
                  Authorization: Basic YWRtaW46cGFzc3dvcmQ=
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                🔒 Le mot de passe est automatiquement encodé en Base64
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-600 rounded flex items-center justify-center">🔐</div>
                OAuth 2.0
              </h3>
              
              <p className="text-gray-300 mb-3">
                Pour les APIs utilisant OAuth 2.0 avec access token.
              </p>

              <div className="bg-[#252526] p-4 rounded">
                <div className="text-sm text-gray-500 mb-2">Configuration :</div>
                <div className="font-mono text-sm mb-1">
                  Access Token: <span className="text-yellow-400">ya29.a0AfH6SMBx...</span>
                </div>
                <div className="font-mono text-sm mb-3">
                  Token Type: <span className="text-yellow-400">Bearer</span> (optionnel)
                </div>
                <div className="text-sm text-gray-500 mb-2">Header généré :</div>
                <div className="font-mono text-sm text-green-400">
                  Authorization: Bearer ya29.a0AfH6SMBx...
                </div>
              </div>
            </div>

            <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-4">
              <p className="text-yellow-200">
                ⚠️ <strong>Sécurité :</strong> Utilisez les variables d'environnement pour stocker vos tokens 
                et credentials sensibles. Ne les partagez jamais dans les exports !
              </p>
            </div>
          </div>
        )

      case 'history':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Historique des requêtes</h2>
            
            <p className="text-gray-300 text-lg">
              Postboy sauvegarde automatiquement vos 100 dernières requêtes avec les valeurs réelles des variables.
            </p>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Accéder à l'historique</h3>
              
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">1.</span>
                  <span>Cliquez sur l'icône <strong>🕐</strong> dans la sidebar</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">2.</span>
                  <span>Parcourez la liste de vos requêtes récentes</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">3.</span>
                  <span>Cliquez sur une entrée pour recharger la requête et sa réponse</span>
                </li>
              </ol>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">🐛</div>
                Mode Debug
              </h3>
              
              <p className="text-gray-300 mb-4">
                Le bouton <strong className="text-green-400">Debug ON/OFF</strong> vous permet de basculer entre deux modes d'affichage :
              </p>

              <div className="space-y-4">
                <div className="bg-[#252526] p-4 rounded">
                  <div className="text-sm font-semibold text-gray-400 mb-2">🔴 Debug OFF (par défaut)</div>
                  <div className="text-gray-300 mb-2">Affiche les <strong>valeurs réelles</strong> après remplacement des variables :</div>
                  <div className="font-mono text-sm text-green-400">
                    https://nantes.lnh-sa.fr:17000/api/users
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    ✅ Vous voyez exactement ce qui a été envoyé au serveur
                  </div>
                </div>

                <div className="bg-[#252526] p-4 rounded">
                  <div className="text-sm font-semibold text-green-400 mb-2">🟢 Debug ON</div>
                  <div className="text-gray-300 mb-2">Affiche les <strong>variables originales</strong> :</div>
                  <div className="font-mono text-sm text-yellow-400">
                    {'{{baseUrl}}'}/api/users
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    ✅ Utile pour vérifier la structure de vos requêtes avec variables
                  </div>
                </div>
              </div>

              <div className="mt-4 text-sm text-gray-400">
                💡 Le mode debug est persisté entre les sessions
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Informations affichées</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-8 bg-green-600 rounded flex items-center justify-center text-xs font-bold">
                    GET
                  </div>
                  <span className="text-gray-300">Méthode HTTP</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-8 bg-green-600 rounded flex items-center justify-center text-xs font-bold">
                    200
                  </div>
                  <span className="text-gray-300">Code de statut</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-8 bg-gray-700 rounded flex items-center justify-center text-xs">
                    245ms
                  </div>
                  <span className="text-gray-300">Temps de réponse</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 h-8 bg-gray-700 rounded flex items-center text-xs font-mono">
                    /api/users
                  </div>
                  <span className="text-gray-300">URL résolue (ou avec variables en mode debug)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-3 h-8 bg-gray-700 rounded flex items-center text-xs">
                    Il y a 5 min
                  </div>
                  <span className="text-gray-300">Horodatage</span>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Gestion de l'historique</h3>
              
              <div className="space-y-3 text-gray-300">
                <div>
                  <strong className="text-blue-400">Supprimer une entrée :</strong> 
                  <span className="ml-2">Survolez l'entrée et cliquez sur l'icône 🗑️</span>
                </div>
                <div>
                  <strong className="text-blue-400">Tout supprimer :</strong> 
                  <span className="ml-2">Cliquez sur "Tout supprimer" en haut de la fenêtre</span>
                </div>
                <div>
                  <strong className="text-blue-400">Limite :</strong> 
                  <span className="ml-2">Les 100 requêtes les plus récentes sont conservées</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
              <p className="text-blue-200">
                💡 <strong>Astuce :</strong> L'historique sauvegarde les valeurs réelles après remplacement des variables. 
                Vous voyez exactement ce qui a été envoyé au serveur !
              </p>
            </div>
          </div>
        )

      case 'import-export':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Import / Export</h2>
            
            <p className="text-gray-300 text-lg">
              Postboy est compatible avec le format Postman Collection v2.1 pour faciliter la migration 
              et le partage de collections.
            </p>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Download className="text-green-400" size={24} />
                Exporter une collection
              </h3>
              
              <ol className="space-y-3 text-gray-300 mb-4">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">1.</span>
                  <span>Survolez la collection que vous souhaitez exporter</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">2.</span>
                  <span>Cliquez sur l'icône <strong>📥</strong> (Download)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">3.</span>
                  <span>Le fichier JSON est téléchargé automatiquement</span>
                </li>
              </ol>

              <div className="bg-[#252526] p-4 rounded">
                <div className="text-sm text-gray-500 mb-2">Nom du fichier :</div>
                <div className="font-mono text-sm text-green-400">
                  Ma_Collection.postman_collection.json
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Upload className="text-blue-400" size={24} />
                Importer une collection
              </h3>
              
              <ol className="space-y-3 text-gray-300 mb-4">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">1.</span>
                  <span>Cliquez sur l'icône <strong>📤</strong> (Upload) dans la sidebar</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">2.</span>
                  <span>Sélectionnez un fichier <code className="bg-[#252526] px-2 py-1 rounded">.json</code></span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">3.</span>
                  <span>La collection est importée avec toutes ses requêtes</span>
                </li>
              </ol>

              <div className="bg-yellow-600 bg-opacity-20 border border-yellow-600 rounded-lg p-3 text-sm">
                <p className="text-yellow-200">
                  ⚠️ Les collections importées reçoivent un nouvel ID unique pour éviter les conflits.
                </p>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Globe className="text-purple-400" size={24} />
                Import/Export d'environnements
              </h3>
              
              <p className="text-gray-300 mb-4">
                Vous pouvez également importer et exporter vos environnements, y compris depuis Postman !
              </p>

              <div className="space-y-3 text-gray-300">
                <div>
                  <strong className="text-blue-400">Exporter tous les environnements :</strong> 
                  <span className="ml-2">Bouton "Tout exporter" dans le gestionnaire d'environnements</span>
                </div>
                <div>
                  <strong className="text-blue-400">Exporter un environnement :</strong> 
                  <span className="ml-2">Icône 📥 au survol d'un environnement</span>
                </div>
                <div>
                  <strong className="text-blue-400">Importer :</strong> 
                  <span className="ml-2">Bouton "Importer" - Compatible avec les fichiers Postman Environment</span>
                </div>
              </div>

              <div className="mt-4 bg-green-600 bg-opacity-20 border border-green-600 rounded p-3">
                <p className="text-green-200 text-sm">
                  ✅ <strong>Format Postman :</strong> Postboy détecte automatiquement et convertit les environnements Postman !
                </p>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Compatibilité</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-2xl">✓</span>
                  <span className="text-gray-300">Format Postman Collection v2.1</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-2xl">✓</span>
                  <span className="text-gray-300">Format Postman Environment</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-2xl">✓</span>
                  <span className="text-gray-300">Méthodes HTTP (GET, POST, PUT, DELETE, etc.)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-2xl">✓</span>
                  <span className="text-gray-300">Headers et query parameters</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-2xl">✓</span>
                  <span className="text-gray-300">Corps de requête (JSON, XML, texte)</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-green-400 text-2xl">✓</span>
                  <span className="text-gray-300">Authentification (Bearer, Basic, OAuth2)</span>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
              <p className="text-blue-200">
                💡 <strong>Partage d'équipe :</strong> Exportez vos collections et environnements pour les partager avec votre équipe 
                ou les versionner dans Git !
              </p>
            </div>
          </div>
        )

      case 'code-generation':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Génération de code</h2>
            
            <p className="text-gray-300 text-lg">
              Générez automatiquement le code de vos requêtes dans 7 langages différents.
            </p>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Comment générer du code</h3>
              
              <ol className="space-y-3 text-gray-300">
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">1.</span>
                  <span>Configurez votre requête (URL, méthode, headers, body, auth)</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">2.</span>
                  <span>Cliquez sur le bouton <strong>{'</>'}</strong> à côté de "Envoyer"</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">3.</span>
                  <span>Sélectionnez le langage souhaité dans la liste</span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-blue-400">4.</span>
                  <span>Cliquez sur <strong>"Copier"</strong> pour copier le code</span>
                </li>
              </ol>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Langages supportés</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#252526] p-4 rounded border border-gray-700">
                  <div className="font-bold text-orange-400 mb-2">cURL</div>
                  <div className="text-sm text-gray-400">Commande shell universelle</div>
                </div>
                <div className="bg-[#252526] p-4 rounded border border-gray-700">
                  <div className="font-bold text-yellow-400 mb-2">JavaScript</div>
                  <div className="text-sm text-gray-400">Fetch API moderne</div>
                </div>
                <div className="bg-[#252526] p-4 rounded border border-gray-700">
                  <div className="font-bold text-green-400 mb-2">Node.js</div>
                  <div className="text-sm text-gray-400">Avec Axios</div>
                </div>
                <div className="bg-[#252526] p-4 rounded border border-gray-700">
                  <div className="font-bold text-purple-400 mb-2">PHP</div>
                  <div className="text-sm text-gray-400">cURL natif</div>
                </div>
                <div className="bg-[#252526] p-4 rounded border border-gray-700">
                  <div className="font-bold text-red-400 mb-2">Symfony</div>
                  <div className="text-sm text-gray-400">HttpClient component</div>
                </div>
                <div className="bg-[#252526] p-4 rounded border border-gray-700">
                  <div className="font-bold text-blue-400 mb-2">Python</div>
                  <div className="text-sm text-gray-400">Requests library</div>
                </div>
                <div className="bg-[#252526] p-4 rounded border border-gray-700 col-span-2">
                  <div className="font-bold text-cyan-400 mb-2">Wget</div>
                  <div className="text-sm text-gray-400">Alternative à cURL</div>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Exemple de code généré</h3>
              
              <div className="bg-[#252526] p-4 rounded font-mono text-sm">
                <div className="text-gray-500 mb-2"># cURL</div>
                <div className="text-green-400">curl -X POST 'https://api.example.com/users' \</div>
                <div className="text-green-400">&nbsp;&nbsp;-H 'Content-Type: application/json' \</div>
                <div className="text-green-400">&nbsp;&nbsp;-H 'Authorization: Bearer token123' \</div>
                <div className="text-green-400">&nbsp;&nbsp;-d '{'{"name":"John"}'}'</div>
              </div>
            </div>

            <div className="bg-green-600 bg-opacity-20 border border-green-600 rounded-lg p-4">
              <p className="text-green-200">
                ✨ <strong>Automatique :</strong> Les variables d'environnement et l'authentification 
                sont automatiquement appliquées dans le code généré !
              </p>
            </div>
          </div>
        )

      case 'shortcuts':
        return (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold mb-4">Raccourcis clavier</h2>
            
            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Raccourcis généraux</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#252526] rounded">
                  <span className="text-gray-300">Envoyer la requête</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded font-mono text-sm">Ctrl/Cmd + Enter</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#252526] rounded">
                  <span className="text-gray-300">Nouvelle collection</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded font-mono text-sm">Ctrl/Cmd + N</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#252526] rounded">
                  <span className="text-gray-300">Rechercher</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded font-mono text-sm">Ctrl/Cmd + K</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#252526] rounded">
                  <span className="text-gray-300">Ouvrir l'aide</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded font-mono text-sm">F1</kbd>
                </div>
              </div>
            </div>

            <div className="bg-[#1e1e1e] rounded-lg p-6 border border-gray-700">
              <h3 className="text-xl font-semibold mb-4">Navigation</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#252526] rounded">
                  <span className="text-gray-300">Onglet suivant</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded font-mono text-sm">Tab</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#252526] rounded">
                  <span className="text-gray-300">Onglet précédent</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded font-mono text-sm">Shift + Tab</kbd>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#252526] rounded">
                  <span className="text-gray-300">Fermer modal</span>
                  <kbd className="px-3 py-1 bg-gray-700 rounded font-mono text-sm">Esc</kbd>
                </div>
              </div>
            </div>

            <div className="bg-blue-600 bg-opacity-20 border border-blue-600 rounded-lg p-4">
              <p className="text-blue-200">
                💡 <strong>Productivité :</strong> Utilisez les raccourcis pour gagner du temps 
                dans votre workflow quotidien !
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#252526] rounded-lg w-[1100px] h-[800px] flex border border-gray-700 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Book size={24} className="text-blue-400" />
                Documentation
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-700 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 bg-[#1e1e1e] border border-gray-600 rounded focus:outline-none focus:border-blue-500 text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
            {sections
              .filter(section => 
                searchQuery === '' || 
                section.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-4 py-3 rounded mb-1 transition-colors flex items-center gap-3 ${
                      activeSection === section.id
                        ? 'bg-blue-600 text-white'
                        : 'hover:bg-gray-700 text-gray-300'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{section.title}</span>
                  </button>
                )
              })}
          </div>

          <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
            <div>Postboy v1.0.0</div>
            <div className="mt-1">Documentation utilisateur</div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
