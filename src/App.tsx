import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import RequestPanel from './components/RequestPanel'
import ResponsePanel from './components/ResponsePanel'
import EnvironmentManager from './components/EnvironmentManager'
import HistoryPanel from './components/HistoryPanel'
import CodeSnippets from './components/CodeSnippets'
import Documentation from './components/Documentation'
import { useStore } from './store/useStore'
import { Sun, Moon } from 'lucide-react'

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(280)
  const [showEnvironments, setShowEnvironments] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [showCodeSnippets, setShowCodeSnippets] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const currentRequest = useStore((state) => state.currentRequest)
  const theme = useStore((state) => state.theme)
  const setTheme = useStore((state) => state.setTheme)

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 dark:bg-[#1e1e1e] dark:text-gray-100">
      <Sidebar 
        width={sidebarWidth} 
        onResize={setSidebarWidth}
        onOpenEnvironments={() => setShowEnvironments(true)}
        onOpenHistory={() => setShowHistory(true)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {currentRequest ? (
          <>
            <div className="flex-1 overflow-hidden">
              <RequestPanel onOpenCodeSnippets={() => setShowCodeSnippets(true)} />
            </div>
            <div className="flex-1 overflow-hidden border-t border-gray-700">
              <ResponsePanel />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Postboy
              </h1>
              <p className="text-gray-400 text-lg">
                Open Source API Client
              </p>
              <p className="text-gray-500 mt-2">
                Créez une collection ou sélectionnez une requête pour commencer
              </p>
            </div>
          </div>
        )}
      </div>

      {showEnvironments && (
        <EnvironmentManager onClose={() => setShowEnvironments(false)} />
      )}

      {showHistory && (
        <HistoryPanel onClose={() => setShowHistory(false)} />
      )}

      {showCodeSnippets && (
        <CodeSnippets onClose={() => setShowCodeSnippets(false)} />
      )}

      {showHelp && (
        <Documentation onClose={() => setShowHelp(false)} />
      )}

      <button
        onClick={toggleTheme}
        className="fixed bottom-6 right-24 w-14 h-14 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        title={theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
      >
        {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <button
        onClick={() => setShowHelp(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:scale-110"
        title="Documentation"
      >
        📖
      </button>
    </div>
  )
}

export default App
