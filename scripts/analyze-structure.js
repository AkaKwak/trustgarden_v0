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
  cyan: '\x1b[36m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
}

async function analyzeStructure() {
  console.log(`${colors.bold}🏗️  ANALYSE DE LA STRUCTURE DU CODEBASE${colors.reset}\n`)
  
  const issues = []
  const warnings = []
  const recommendations = []
  
  // 1. Analyser la structure des dossiers
  const dirStructure = {
    'src/components': { required: true, files: [] },
    'src/components/ui': { required: true, files: [] },
    'src/components/grid': { required: true, files: [] },
    'src/hooks': { required: true, files: [] },
    'src/config': { required: true, files: [] },
    'src/styles': { required: true, files: [] },
    'src/utils': { required: true, files: [] }
  }
  
  // Collecter les fichiers par dossier
  const allFiles = await glob('src/**/*.{ts,tsx}', {
    ignore: ['node_modules/**', 'dist/**', 'build/**']
  })
  
  for (const file of allFiles) {
    const dir = path.dirname(file)
    if (dirStructure[dir]) {
      dirStructure[dir].files.push(file)
    }
  }
  
  // 2. Analyser chaque dossier
  for (const [dir, info] of Object.entries(dirStructure)) {
    if (!fs.existsSync(dir)) {
      issues.push(`❌ Dossier manquant: ${dir}`)
      continue
    }
    
    console.log(`${colors.blue}📁 ${dir} (${info.files.length} fichiers)${colors.reset}`)
    
    // Vérifier les fichiers dans chaque dossier
    for (const file of info.files) {
      const fileName = path.basename(file)
      const fileSize = fs.statSync(file).size
      
      // Analyser le contenu du fichier
      try {
        const content = fs.readFileSync(file, 'utf8')
        const lines = content.split('\n').length
        const hasExports = content.includes('export')
        const hasImports = content.includes('import')
        
        // Vérifier la taille du fichier
        if (lines > 100) {
          warnings.push(`⚠️  ${file} - ${lines} lignes (considérer la division)`)
        }
        
        // Vérifier les exports
        if (!hasExports && !fileName.includes('index')) {
          warnings.push(`⚠️  ${file} - Pas d'exports détectés`)
        }
        
        // Vérifier les imports
        if (!hasImports && fileName !== 'index.ts') {
          warnings.push(`⚠️  ${file} - Pas d'imports détectés`)
        }
        
        console.log(`  ${colors.green}•${colors.reset} ${fileName} (${lines} lignes, ${fileSize} bytes)`)
        
      } catch (error) {
        console.log(`  ${colors.red}•${colors.reset} ${fileName} - Erreur lecture`)
      }
    }
  }
  
  // 3. Analyser les imports barrel
  const barrelFiles = allFiles.filter(f => f.endsWith('index.ts') || f.endsWith('index.tsx'))
  console.log(`\n${colors.cyan}📦 FICHIERS BARREL (${barrelFiles.length}):${colors.reset}`)
  
  for (const barrelFile of barrelFiles) {
    try {
      const content = fs.readFileSync(barrelFile, 'utf8')
      const exports = content.match(/export.*from/g) || []
      console.log(`  ${colors.green}•${colors.reset} ${barrelFile} (${exports.length} exports)`)
      
      if (exports.length === 0) {
        warnings.push(`⚠️  ${barrelFile} - Aucun export détecté`)
      }
    } catch (error) {
      console.log(`  ${colors.red}•${colors.reset} ${barrelFile} - Erreur lecture`)
    }
  }
  
  // 4. Analyser les composants
  const componentFiles = allFiles.filter(f => f.includes('/components/') && f.endsWith('.tsx'))
  console.log(`\n${colors.magenta}🧩 COMPOSANTS (${componentFiles.length}):${colors.reset}`)
  
  const componentStats = {
    small: 0,    // < 50 lignes
    medium: 0,   // 50-100 lignes
    large: 0     // > 100 lignes
  }
  
  for (const componentFile of componentFiles) {
    try {
      const content = fs.readFileSync(componentFile, 'utf8')
      const lines = content.split('\n').length
      
      if (lines < 50) componentStats.small++
      else if (lines < 100) componentStats.medium++
      else componentStats.large++
      
      console.log(`  ${colors.green}•${colors.reset} ${path.basename(componentFile)} (${lines} lignes)`)
      
      if (lines > 100) {
        recommendations.push(`💡 ${componentFile} - Considérer la division en sous-composants`)
      }
    } catch (error) {
      console.log(`  ${colors.red}•${colors.reset} ${path.basename(componentFile)} - Erreur lecture`)
    }
  }
  
  // 5. Analyser les hooks
  const hookFiles = allFiles.filter(f => f.includes('/hooks/') && f.startsWith('use'))
  console.log(`\n${colors.yellow}🎣 HOOKS (${hookFiles.length}):${colors.reset}`)
  
  for (const hookFile of hookFiles) {
    try {
      const content = fs.readFileSync(hookFile, 'utf8')
      const lines = content.split('\n').length
      console.log(`  ${colors.green}•${colors.reset} ${path.basename(hookFile)} (${lines} lignes)`)
      
      if (lines > 80) {
        recommendations.push(`💡 ${hookFile} - Considérer la simplification`)
      }
    } catch (error) {
      console.log(`  ${colors.red}•${colors.reset} ${path.basename(hookFile)} - Erreur lecture`)
    }
  }
  
  // Afficher le rapport final
  console.log(`\n${colors.bold}📊 RAPPORT DE STRUCTURE${colors.reset}\n`)
  
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
  
  if (recommendations.length > 0) {
    console.log(`\n${colors.magenta}💡 RECOMMANDATIONS (${recommendations.length}):${colors.reset}`)
    recommendations.forEach(rec => console.log(`  ${rec}`))
  }
  
  // Statistiques finales
  console.log(`\n${colors.cyan}📈 STATISTIQUES FINALES:${colors.reset}`)
  console.log(`  • Fichiers totaux: ${allFiles.length}`)
  console.log(`  • Composants: ${componentStats.small + componentStats.medium + componentStats.large}`)
  console.log(`    - Petits (<50l): ${componentStats.small}`)
  console.log(`    - Moyens (50-100l): ${componentStats.medium}`)
  console.log(`    - Grands (>100l): ${componentStats.large}`)
  console.log(`  • Hooks: ${hookFiles.length}`)
  console.log(`  • Fichiers barrel: ${barrelFiles.length}`)
  
  return { issues, warnings, recommendations }
}

// Exécuter si appelé directement
if (import.meta.url === `file://${process.argv[1]}`) {
  analyzeStructure().catch(console.error)
}

export default analyzeStructure
