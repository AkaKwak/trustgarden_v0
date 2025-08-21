#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { glob } from 'glob'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Couleurs
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

async function findUnusedFiles() {
  console.log(`${colors.bold}🔍 RECHERCHE DE FICHIERS INUTILISÉS${colors.reset}\n`)
  
  // Collecter tous les fichiers TypeScript/React
  const allFiles = await glob('src/**/*.{ts,tsx}', {
    ignore: ['node_modules/**', 'dist/**', 'build/**']
  })
  
  console.log(`${colors.blue}📁 Fichiers trouvés: ${allFiles.length}${colors.reset}`)
  
  // Fichiers essentiels (ne jamais supprimer)
  const essentialFiles = [
    'src/App.tsx',
    'src/main.tsx',
    'src/vite-env.d.ts',
    'src/components/SignalGarden.tsx',
    'src/components/grid/KonvaGrid.tsx',
    'src/components/grid/Pixel.tsx',
    'src/components/grid/constants.ts',
    'src/components/grid/index.ts',
    'src/components/ui/index.ts',
    'src/hooks/index.ts',
    'src/config/layout.ts',
    'src/config/wagmi.ts',
    'src/styles/colors.css',
    'src/utils/signalTypes.ts'
  ]
  
  // Collecter tous les imports
  const allImports = new Set()
  const importMap = new Map()
  
  for (const file of allFiles) {
    try {
      const content = fs.readFileSync(file, 'utf8')
      const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g)
      
      if (importMatches) {
        importMatches.forEach(match => {
          const importPath = match.match(/['"]([^'"]+)['"]/)[1]
          
          // Ignorer les imports externes
          if (importPath.startsWith('.') || importPath.startsWith('/')) {
            const resolvedPath = resolveImportPath(file, importPath)
            if (resolvedPath) {
              allImports.add(resolvedPath)
              if (!importMap.has(resolvedPath)) {
                importMap.set(resolvedPath, [])
              }
              importMap.get(resolvedPath).push(file)
            }
          }
        })
      }
    } catch (error) {
      console.log(`${colors.red}❌ Erreur lecture ${file}: ${error.message}${colors.reset}`)
    }
  }
  
  // Identifier les fichiers inutilisés
  const unusedFiles = allFiles.filter(file => {
    // Ignorer les fichiers essentiels
    if (essentialFiles.includes(file)) return false
    
    // Ignorer les fichiers index.ts (barrel exports)
    if (file.endsWith('index.ts') || file.endsWith('index.tsx')) return false
    
    // Ignorer les fichiers avec des exports
    try {
      const content = fs.readFileSync(file, 'utf8')
      if (content.includes('export')) return false
    } catch (error) {
      return false
    }
    
    return !allImports.has(file)
  })
  
  // Afficher le rapport
  console.log(`\n${colors.bold}📊 RAPPORT DES FICHIERS INUTILISÉS${colors.reset}\n`)
  
  if (unusedFiles.length > 0) {
    console.log(`${colors.yellow}⚠️  FICHIERS POTENTIELLEMENT INUTILISÉS (${unusedFiles.length}):${colors.reset}`)
    unusedFiles.forEach(file => {
      console.log(`  ${colors.yellow}•${colors.reset} ${file}`)
    })
    
    console.log(`\n${colors.magenta}💡 ACTIONS RECOMMANDÉES:${colors.reset}`)
    console.log(`  • Vérifier manuellement chaque fichier avant suppression`)
    console.log(`  • Utiliser: rm ${unusedFiles.map(f => `"${f}"`).join(' ')}`)
    console.log(`  • Ou supprimer un par un pour plus de sécurité`)
  } else {
    console.log(`${colors.green}✅ Aucun fichier inutilisé détecté !${colors.reset}`)
  }
  
  // Statistiques
  console.log(`\n${colors.cyan}📈 STATISTIQUES:${colors.reset}`)
  console.log(`  • Fichiers analysés: ${allFiles.length}`)
  console.log(`  • Fichiers importés: ${allImports.size}`)
  console.log(`  • Fichiers inutilisés: ${unusedFiles.length}`)
  console.log(`  • Fichiers essentiels: ${essentialFiles.length}`)
  
  return unusedFiles
}

function resolveImportPath(fromFile, importPath) {
  if (importPath.startsWith('.')) {
    const dir = path.dirname(fromFile)
    const resolved = path.resolve(dir, importPath)
    
    // Essayer différentes extensions
    const extensions = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx', '/index.js', '/index.jsx']
    for (const ext of extensions) {
      const fullPath = resolved + ext
      if (fs.existsSync(fullPath)) {
        return fullPath
      }
    }
  }
  return null
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  findUnusedFiles().catch(console.error)
}

export default findUnusedFiles
