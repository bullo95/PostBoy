import { Environment } from '../types'

export interface EnvironmentExport {
  version: string
  name: string
  environments: Environment[]
  exportedAt: number
}

export const exportEnvironments = (environments: Environment[], filename?: string): void => {
  const exportData: EnvironmentExport = {
    version: '1.0',
    name: 'Postboy Environments',
    environments: environments.map(env => ({
      ...env,
      active: false, // Reset active state on export
    })),
    exportedAt: Date.now(),
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename || `postboy-environments-${Date.now()}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const exportSingleEnvironment = (environment: Environment): void => {
  const exportData: EnvironmentExport = {
    version: '1.0',
    name: environment.name,
    environments: [{
      ...environment,
      active: false,
    }],
    exportedAt: Date.now(),
  }

  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${environment.name.toLowerCase().replace(/\s+/g, '-')}-env.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importEnvironments = (file: File): Promise<Environment[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        
        // Detect format: Postboy or Postman
        let importedEnvironments: Environment[] = []
        
        // Format Postman Environment (single environment)
        if (json._postman_variable_scope === 'environment' && json.values) {
          const variables: Record<string, string> = {}
          
          // Convert Postman values array to Postboy variables object
          json.values.forEach((item: any) => {
            if (item.enabled !== false) {
              variables[item.key] = item.value || ''
            }
          })
          
          importedEnvironments = [{
            id: crypto.randomUUID(),
            name: json.name || 'Environnement Postman',
            variables,
            active: false,
          }]
        }
        // Format Postboy (multiple environments)
        else if (json.environments && Array.isArray(json.environments)) {
          importedEnvironments = json.environments.map((env: any) => ({
            id: crypto.randomUUID(),
            name: env.name || 'Environnement importé',
            variables: env.variables || {},
            active: false,
          }))
        }
        // Invalid format
        else {
          reject(new Error('Format de fichier invalide. Formats supportés : Postman Environment ou Postboy Environments'))
          return
        }

        resolve(importedEnvironments)
      } catch (error) {
        reject(new Error('Erreur lors de la lecture du fichier JSON'))
      }
    }

    reader.onerror = () => {
      reject(new Error('Erreur lors de la lecture du fichier'))
    }

    reader.readAsText(file)
  })
}
