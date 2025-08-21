#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const glob = require('glob')

// Configuration
const SRC_DIR = 'src'
const IGNORE_PATTERNS = ['node_modules', 'dist', 'build', '.git', '*.d.ts']

// Couleurs pour la console
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

class CodebaseAnalyzer {
  constructor() {
    this.allFiles = []
    this.imports = new Map()
    this.exports = new Map()
    this.unusedFiles = []
    this.misusedFiles = []
    this.orphanedFiles = []
  }

  // Analyser tous les fichiers
  async analyze() {
    console.log(`${colors.bold}🔍 ANALYSE DU CODEBASE${colors.reset}\n`)
    
    // 1. Collecter tous les fichiers
    this.collectAllFiles()
    
    // 2. Analyser les imports/exports
    await this.analyzeImportsExports()
    
    // 3. Identifier les fichiers inutilisés
    this.findUnusedFiles()
    
    // 4. Identifier les fichiers mal utilisés
    this.findMisusedFiles()
    
    // 5. Générer le rapport
    this.generateReport()
  }

  // Collecter tous les fichiers
  collectAllFiles() {
    const patterns = [
      'src/**/*.ts',
      'src/**/*.tsx',
      'src/**/*.js',
      'src/**/*.jsx'
    ]
    
    patterns.forEach(pattern => {
      const files = glob.sync(pattern, { ignore: IGNORE_PATTERNS })
      this.allFiles.push(...files)
    })
    
    console.log(`${colors.blue}📁 Fichiers trouvés: ${this.allFiles.length}${colors.reset}`)
  }

  // Analyser les imports et exports
  async analyzeImportsExports() {
    for (const file of this.allFiles) {
      try {
        const content = fs.readFileSync(file, 'utf8')
        this.analyzeFileImports(file, content)
        this.analyzeFileExports(file, content)
      } catch (error) {
        console.log(`${colors.red}❌ Erreur lecture ${file}: ${error.message}${colors.reset}`)
      }
    }
  }

  // Analyser les imports d'un fichier
  analyzeFileImports(file, content) {
    const importRegex = /import\s+(?:(?:\{[^}]*\}|\*\s+as\s+\w+|\w+)\s+from\s+)?['"]([^'"]+)['"]/g
    const imports = []
    
    let match
    while ((match = importRegex.exec(content)) !== null) {
      const importPath = match[1]
      if (!importPath.startsWith('.') && !importPath.startsWith('/')) continue
      
      const resolvedPath = this.resolveImportPath(file, importPath)
      if (resolvedPath) {
        imports.push(resolvedPath)
      }
    }
    
    this.imports.set(file, imports)
  }

  // Analyser les exports d'un fichier
  analyzeFileExports(file, content) {
    const exportRegex = /export\s+(?:default\s+)?(?:function|class|const|let|var|interface|type|enum)\s+(\w+)/g
    const exports = []
    
    let match
    while ((match = exportRegex.exec(content)) !== null) {
      exports.push(match[1])
    }
    
    if (exports.length > 0) {
      this.exports.set(file, exports)
    }
  }

  // Résoudre le chemin d'import
  resolveImportPath(fromFile, importPath) {
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

  // Trouver les fichiers inutilisés
  findUnusedFiles() {
    const allImportedFiles = new Set()
    
    // Collecter tous les fichiers importés
    for (const imports of this.imports.values()) {
      imports.forEach(importPath => allImportedFiles.add(importPath))
    }
    
    // Trouver les fichiers non importés
    this.unusedFiles = this.allFiles.filter(file => {
      // Ignorer les fichiers spéciaux
      if (file.includes('index.ts') || file.includes('App.tsx') || file.includes('main.tsx')) {
        return false
      }
      return !allImportedFiles.has(file)
    })
  }

  // Trouver les fichiers mal utilisés
  findMisusedFiles() {
    for (const [file, imports] of this.imports) {
      for (const importPath of imports) {
        if (!fs.existsSync(importPath)) {
          this.misusedFiles.push({
            file,
            importPath,
            type: 'import_not_found'
          })
        }
      }
    }
  }

  // Générer le rapport
  generateReport() {
    console.log(`\n${colors.bold}📊 RAPPORT D'ANALYSE${colors.reset}\n`)
    
    // Fichiers inutilisés
    if (this.unusedFiles.length > 0) {
      console.log(`${colors.yellow}⚠️  FICHIERS POTENTIELLEMENT INUTILISÉS (${this.unusedFiles.length}):${colors.reset}`)
      this.unusedFiles.forEach(file => {
        console.log(`  ${colors.yellow}•${colors.reset} ${file}`)
      })
    } else {
      console.log(`${colors.green}✅ Aucun fichier inutilisé détecté${colors.reset}`)
    }
    
    // Fichiers mal utilisés
    if (this.misusedFiles.length > 0) {
      console.log(`\n${colors.red}❌ FICHIERS MAL UTILISÉS (${this.misusedFiles.length}):${colors.reset}`)
      this.misusedFiles.forEach(({ file, importPath, type }) => {
        console.log(`  ${colors.red}•${colors.reset} ${file} -> ${importPath} (${type})`)
      })
    } else {
      console.log(`\n${colors.green}✅ Aucun fichier mal utilisé détecté${colors.reset}`)
    }
    
    // Statistiques
    console.log(`\n${colors.cyan}📈 STATISTIQUES:${colors.reset}`)
    console.log(`  • Fichiers analysés: ${this.allFiles.length}`)
    console.log(`  • Fichiers avec exports: ${this.exports.size}`)
    console.log(`  • Fichiers avec imports: ${this.imports.size}`)
    
    // Recommandations
    this.generateRecommendations()
  }

  // Générer des recommandations
  generateRecommendations() {
    console.log(`\n${colors.magenta}💡 RECOMMANDATIONS:${colors.reset}`)
    
    if (this.unusedFiles.length > 0) {
      console.log(`  ${colors.magenta}•${colors.reset} Supprimer les fichiers inutilisés pour réduire la taille du bundle`)
    }
    
    if (this.misusedFiles.length > 0) {
      console.log(`  ${colors.magenta}•${colors.reset} Corriger les imports manquants pour éviter les erreurs`)
    }
    
    console.log(`  ${colors.magenta}•${colors.reset} Utiliser des imports/exports barrel (index.ts) pour simplifier`)
    console.log(`  ${colors.magenta}•${colors.reset} Vérifier la cohérence des noms de fichiers et dossiers`)
  }
}

// Exécuter l'analyse
async function main() {
  const analyzer = new CodebaseAnalyzer()
  await analyzer.analyze()
}

if (require.main === module) {
  main().catch(console.error)
}

module.exports = CodebaseAnalyzer
