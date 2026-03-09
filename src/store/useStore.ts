import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Request, Collection, Response, Environment, HistoryEntry } from '../types'

interface AppState {
  collections: Collection[]
  currentRequest: Request | null
  currentResponse: Response | null
  environments: Environment[]
  activeEnvironment: Environment | null
  history: HistoryEntry[]
  debugMode: boolean
  theme: 'light' | 'dark'
  
  addCollection: (name: string) => void
  deleteCollection: (id: string) => void
  updateCollection: (id: string, updates: Partial<Collection>) => void
  importCollection: (collection: Collection) => void
  duplicateCollection: (id: string) => void
  
  addRequest: (collectionId: string, request: Omit<Request, 'id'>) => void
  updateRequest: (id: string, updates: Partial<Request>) => void
  deleteRequest: (id: string) => void
  setCurrentRequest: (request: Request | null) => void
  duplicateRequest: (id: string) => void
  
  setCurrentResponse: (response: Response | null) => void
  
  addEnvironment: (name: string) => void
  importEnvironment: (env: Omit<Environment, 'id' | 'active'>) => void
  updateEnvironment: (id: string, updates: Partial<Environment>) => void
  deleteEnvironment: (id: string) => void
  setActiveEnvironment: (id: string | null) => void
  
  addToHistory: (request: Request, response: Response, resolvedUrl?: string, resolvedHeaders?: Record<string, string>, resolvedBody?: string) => void
  clearHistory: () => void
  deleteHistoryEntry: (id: string) => void
  
  setDebugMode: (enabled: boolean) => void
  setTheme: (theme: 'light' | 'dark') => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      collections: [],
      currentRequest: null,
      currentResponse: null,
      environments: [],
      activeEnvironment: null,
      history: [],
      debugMode: false,
      theme: 'dark',

  addCollection: (name: string) =>
    set((state) => ({
      collections: [
        ...state.collections,
        {
          id: crypto.randomUUID(),
          name,
          requests: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
        },
      ],
    })),

  deleteCollection: (id: string) =>
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
    })),

  updateCollection: (id: string, updates: Partial<Collection>) =>
    set((state) => ({
      collections: state.collections.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c
      ),
    })),

  importCollection: (collection: Collection) =>
    set((state) => ({
      collections: [...state.collections, { ...collection, id: crypto.randomUUID() }],
    })),

  addRequest: (collectionId: string, request: Omit<Request, 'id'>) =>
    set((state) => {
      const newRequest: Request = {
        ...request,
        id: crypto.randomUUID(),
        collectionId,
      }
      
      return {
        collections: state.collections.map((c) =>
          c.id === collectionId
            ? { ...c, requests: [...c.requests, newRequest], updatedAt: Date.now() }
            : c
        ),
        currentRequest: newRequest,
      }
    }),

  updateRequest: (id: string, updates: Partial<Request>) =>
    set((state) => ({
      collections: state.collections.map((c) => ({
        ...c,
        requests: c.requests.map((r) => (r.id === id ? { ...r, ...updates } : r)),
      })),
      currentRequest:
        state.currentRequest?.id === id
          ? { ...state.currentRequest, ...updates }
          : state.currentRequest,
    })),

  deleteRequest: (id: string) =>
    set((state) => ({
      collections: state.collections.map((c) => ({
        ...c,
        requests: c.requests.filter((r) => r.id !== id),
      })),
      currentRequest: state.currentRequest?.id === id ? null : state.currentRequest,
    })),

  setCurrentRequest: (request: Request | null) =>
    set({ currentRequest: request, currentResponse: null }),

  setCurrentResponse: (response: Response | null) =>
    set({ currentResponse: response }),

  addEnvironment: (name: string) =>
    set((state) => ({
      environments: [
        ...state.environments,
        {
          id: crypto.randomUUID(),
          name,
          variables: {},
          active: false,
        },
      ],
    })),

  importEnvironment: (env: Omit<Environment, 'id' | 'active'>) =>
    set((state) => ({
      environments: [
        ...state.environments,
        {
          id: crypto.randomUUID(),
          name: env.name,
          variables: env.variables,
          active: false,
        },
      ],
    })),

  updateEnvironment: (id: string, updates: Partial<Environment>) =>
    set((state) => ({
      environments: state.environments.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    })),

  deleteEnvironment: (id: string) =>
    set((state) => ({
      environments: state.environments.filter((e) => e.id !== id),
      activeEnvironment:
        state.activeEnvironment?.id === id ? null : state.activeEnvironment,
    })),

  setActiveEnvironment: (id: string | null) =>
    set((state) => {
      const updatedEnvironments = state.environments.map((e) => ({
        ...e,
        active: e.id === id,
      }))
      return {
        environments: updatedEnvironments,
        activeEnvironment: updatedEnvironments.find((e) => e.id === id) || null,
      }
    }),

  addToHistory: (request: Request, response: Response, resolvedUrl?: string, resolvedHeaders?: Record<string, string>, resolvedBody?: string) =>
    set((state) => ({
      history: [
        {
          id: crypto.randomUUID(),
          request,
          response,
          timestamp: Date.now(),
          resolvedUrl,
          resolvedHeaders,
          resolvedBody,
        },
        ...state.history.slice(0, 99),
      ],
    })),

  clearHistory: () =>
    set({ history: [] }),

  deleteHistoryEntry: (id: string) =>
    set((state) => ({
      history: state.history.filter((h) => h.id !== id),
    })),

  setDebugMode: (enabled: boolean) =>
    set({ debugMode: enabled }),

  setTheme: (theme: 'light' | 'dark') =>
    set({ theme }),

  duplicateCollection: (id: string) =>
    set((state) => {
      const collection = state.collections.find((c) => c.id === id)
      if (!collection) return state
      
      const newCollection = {
        ...collection,
        id: crypto.randomUUID(),
        name: `${collection.name} (copie)`,
        requests: collection.requests.map((req) => ({
          ...req,
          id: crypto.randomUUID(),
        })),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      
      return {
        collections: [...state.collections, newCollection],
      }
    }),

  duplicateRequest: (id: string) =>
    set((state) => {
      let foundRequest: Request | null = null
      let collectionId: string | null = null
      
      for (const collection of state.collections) {
        const request = collection.requests.find((r) => r.id === id)
        if (request) {
          foundRequest = request
          collectionId = collection.id
          break
        }
      }
      
      if (!foundRequest || !collectionId) return state
      
      const newRequest = {
        ...foundRequest,
        id: crypto.randomUUID(),
        name: `${foundRequest.name} (copie)`,
      }
      
      return {
        collections: state.collections.map((col) =>
          col.id === collectionId
            ? {
                ...col,
                requests: [...col.requests, newRequest],
                updatedAt: Date.now(),
              }
            : col
        ),
      }
    }),
    }),
    {
      name: 'postboy-storage',
      partialize: (state) => ({
        collections: state.collections,
        environments: state.environments,
        history: state.history,
        debugMode: state.debugMode,
        theme: state.theme,
      }),
    }
  )
)
