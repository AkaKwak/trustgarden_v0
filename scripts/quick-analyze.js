#!/usr/bin/env node

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Couleurs
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

function quickAnalyze() {
  console.log(`${colors.bold}🔍 ANALYSE RAPIDE DU CODEBASE${colors.reset}\n`)
  
  const issues = []
  const warnings = []
  
  // 1. Vérifier les fichiers potentiellement inutilisés
  const potentiallyUnused = [
    'src/hooks/useGridSize.ts',
    'src/hooks/useSignalGarden.ts',
    'src/components/ui/button.tsx',
    'src/components/ui/card.tsx',
    'src/components/ui/input.tsx',
    'src/components/ui/label.tsx',
    'src/components/ui/slider.tsx',
    'src/components/ui/radio-group.tsx',
    'src/components/ui/toaster.tsx'
  ]
  
  potentiallyUnused.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8')
      const hasExports = content.includes('export')
      const hasImports = content.includes('import')
      
      if (hasExports && !hasImports) {
        warnings.push(`⚠️  ${file} - Exporté mais pas importé`)
      }
    }
  })
  
  // 2. Vérifier les imports manquants
  const filesToCheck = [
    'src/components/SignalGarden.tsx',
    'src/components/grid/KonvaGrid.tsx',
    'src/components/ui/index.ts'
  ]
  
  filesToCheck.forEach(file => {
    if (fs.existsSync(file)) {
      const content = fs.readFileSync(file, 'utf8')
      const importMatches = content.match(/import.*from\s+['"]([^'"]+)['"]/g)
      
      if (importMatches) {
        importMatches.forEach(match => {
          const importPath = match.match(/['"]([^'"]+)['"]/)[1]
          if (importPath.startsWith('.') || importPath.startsWith('/')) {
            const resolvedPath = path.resolve(path.dirname(file), importPath)
            if (!fs.existsSync(resolvedPath) && !fs.existsSync(resolvedPath + '.ts') && !fs.existsSync(resolvedPath + '.tsx')) {
              issues.push(`❌ ${file} -> ${importPath} (fichier manquant)`)
            }
          }
        })
      }
    }
  })
  
  // 3. Vérifier la structure des dossiers
  const requiredDirs = [
    'src/components',
    'src/components/ui',
    'src/components/grid',
    'src/hooks',
    'src/config',
    'src/styles',
    'src/utils'
  ]
  
  requiredDirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      issues.push(`❌ Dossier manquant: ${dir}`)
    }
  })
  
  // 4. Vérifier les fichiers de configuration
  const configFiles = [
    'src/config/layout.ts',
    'src/config/wagmi.ts',
    'src/styles/colors.css'
  ]
  
  configFiles.forEach(file => {
    if (!fs.existsSync(file)) {
      issues.push(`❌ Fichier de config manquant: ${file}`)
    }
  })
  
  // Afficher le rapport
  console.log(`${colors.bold}📊 RAPPORT RAPIDE${colors.reset}\n`)
  
  if (issues.length > 0) {
    console.log(`${colors.red}❌ PROBLÈMES CRITIQUES (${issues.length}):${colors.reset}`)
    issues.forEach(issue => console.log(`  ${issue}`))
  } else {
    console.log(`${colors.green}✅ Aucun problème critique détecté${colors.reset}`)
  }
  
  if (warnings.length > 0) {
    console.log(`\n${colors.yellow}⚠️  AVERTISSEMENTS (${warnings.length}):${colors.reset}`)
    warnings.forEach(warning => console.log(`  ${warning}`))
  } else {
    console.log(`\n${colors.green}✅ Aucun avertissement${colors.reset}`)
  }
  
  // Recommandations
  console.log(`\n${colors.blue}💡 RECOMMANDATIONS IMMÉDIATES:${colors.reset}`)
  console.log(`  • Vérifier que tous les composants sont exportés dans index.ts`)
  console.log(`  • Nettoyer les imports inutilisés`)
  console.log(`  • Vérifier la cohérence des noms de fichiers`)
  console.log(`  • Utiliser des imports barrel pour simplifier`)
  
  return { issues, warnings }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  quickAnalyze()
}

export default quickAnalyze
