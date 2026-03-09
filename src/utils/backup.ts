import JSZip from 'jszip'
import { Collection, Environment } from '../types'
import { exportToPostman } from './postman'

export const exportAllToZip = async (
  collections: Collection[],
  environments: Environment[]
): Promise<void> => {
  const zip = new JSZip()

  // Créer un dossier pour les collections
  const collectionsFolder = zip.folder('collections')
  if (collectionsFolder) {
    collections.forEach((collection) => {
      const postmanCollection = exportToPostman(collection)
      const fileName = `${collection.name.replace(/[^a-z0-9]/gi, '_')}.postman_collection.json`
      collectionsFolder.file(fileName, JSON.stringify(postmanCollection, null, 2))
    })
  }

  // Créer un dossier pour les environnements
  const environmentsFolder = zip.folder('environments')
  if (environmentsFolder) {
    environments.forEach((env) => {
      const envData = {
        id: env.id,
        name: env.name,
        values: Object.entries(env.variables).map(([key, value]) => ({
          key,
          value,
          enabled: true,
          type: 'default',
        })),
        _postman_variable_scope: 'environment',
        _postman_exported_at: new Date().toISOString(),
        _postman_exported_using: 'Postboy',
      }
      const fileName = `${env.name.replace(/[^a-z0-9]/gi, '_')}.postman_environment.json`
      environmentsFolder.file(fileName, JSON.stringify(envData, null, 2))
    })
  }

  // Créer un fichier README
  const readme = `# Postboy Backup
  
Date: ${new Date().toLocaleString('fr-FR')}

## Contenu

- **collections/**: ${collections.length} collection(s)
- **environments/**: ${environments.length} environnement(s)

## Import

Pour importer ces données dans Postboy :
1. Ouvrez Postboy
2. Utilisez les boutons d'import individuels pour chaque collection et environnement
3. Ou utilisez la fonction d'import de Postman (compatible)

## Format

Tous les fichiers sont au format Postman Collection v2.1 et Postman Environment.
`
  zip.file('README.md', readme)

  // Générer le ZIP et le télécharger
  const blob = await zip.generateAsync({ type: 'blob' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `postboy_backup_${new Date().toISOString().split('T')[0]}.zip`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export const importFromZip = async (file: File): Promise<{
  collections: Collection[]
  environments: Omit<Environment, 'id' | 'active'>[]
}> => {
  const zip = await JSZip.loadAsync(file)
  const collections: Collection[] = []
  const environments: Omit<Environment, 'id' | 'active'>[] = []

  // Importer les collections
  const collectionsFolder = zip.folder('collections')
  if (collectionsFolder) {
    const files = Object.keys(zip.files).filter(
      (name) => name.startsWith('collections/') && name.endsWith('.json')
    )
    
    for (const fileName of files) {
      const fileData = await zip.file(fileName)?.async('string')
      if (fileData) {
        try {
          const data = JSON.parse(fileData)
          // Ici on pourrait ajouter la logique d'import Postman
          // Pour l'instant on stocke juste les données brutes
          collections.push(data)
        } catch (error) {
          console.error(`Erreur lors de l'import de ${fileName}:`, error)
        }
      }
    }
  }

  // Importer les environnements
  const environmentsFolder = zip.folder('environments')
  if (environmentsFolder) {
    const files = Object.keys(zip.files).filter(
      (name) => name.startsWith('environments/') && name.endsWith('.json')
    )
    
    for (const fileName of files) {
      const fileData = await zip.file(fileName)?.async('string')
      if (fileData) {
        try {
          const data = JSON.parse(fileData)
          environments.push({
            name: data.name,
            variables: data.values?.reduce((acc: Record<string, string>, v: any) => {
              acc[v.key] = v.value
              return acc
            }, {}) || data.variables || {},
          })
        } catch (error) {
          console.error(`Erreur lors de l'import de ${fileName}:`, error)
        }
      }
    }
  }

  return { collections, environments }
}
