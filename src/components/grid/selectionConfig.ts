// ===== CONFIGURATION DE SÉLECTION ÉLÉGANTE =====

export const SELECTION_CONFIG = {
  // Couleurs cohérentes avec notre design system (couleurs directes pour Konva)
  colors: {
    primary: '#0ea5e9',      // Bleu principal pour la sélection
    secondary: '#38bdf8',    // Bleu plus clair pour les gradients
    shadow: '#0ea5e9',       // Couleur de l'ombre
    text: '#ffffff',         // Texte blanc
    background: 'rgba(255, 255, 255, 0.98)', // Fond avec transparence
    border: '#e5e7eb',       // Bordure subtile
  },
  
  // Dimensions raffinées
  dimensions: {
    strokeWidth: 2,          // Bordure plus fine et élégante
    shadowBlur: 8,           // Ombre plus subtile
    shadowOpacity: 0.3,      // Ombre plus transparente
    scale: 1.08,             // Échelle plus subtile
    cornerRadius: 4,         // Coins plus arrondis
    offset: 1,               // Décalage de la sélection
  },
  
  // Animations fluides
  animations: {
    duration: {
      appear: 0.2,           // Apparition rapide
      disappear: 0.15,       // Disparition rapide
      pulse: 2,              // Pulsation plus lente
      hover: 0.1,            // Hover instantané
    },
    easing: {
      appear: 'EaseOut',     // Easing d'apparition
      disappear: 'EaseIn',   // Easing de disparition
      pulse: 'EaseInOut',    // Easing de pulsation
      hover: 'Linear',       // Hover linéaire
    },
    pulse: {
      minShadow: 8,          // Ombre minimale
      maxShadow: 16,         // Ombre maximale
      minScale: 1.08,        // Échelle minimale
      maxScale: 1.12,        // Échelle maximale
    },
  },
  
  // Hover subtil
  hover: {
    scale: 1.03,             // Échelle très subtile
    enabled: true,           // Activer le hover
    shadowBlur: 4,           // Ombre au hover
  },
  
  // Indicateur élégant et visible
  indicator: {
    offset: {
      x: -50,                // Décalage horizontal ajusté
      y: -40,                // Décalage vertical ajusté
    },
    size: {
      width: 100,            // Largeur de l'indicateur augmentée
      height: 40,            // Hauteur de l'indicateur augmentée
    },
    fontSize: {
      coordinates: 12,       // Taille pour les coordonnées augmentée
      type: 10,              // Taille pour le type augmentée
    },
    borderRadius: 8,         // Coins arrondis augmentés
    backdropBlur: 10,        // Effet de flou d'arrière-plan augmenté
  },
  
  // États visuels
  states: {
    default: {
      strokeWidth: 2,
      shadowBlur: 8,
      scale: 1.08,
    },
    hover: {
      strokeWidth: 2,
      shadowBlur: 12,
      scale: 1.1,
    },
    selected: {
      strokeWidth: 3,
      shadowBlur: 16,
      scale: 1.12,
    },
  },
}
