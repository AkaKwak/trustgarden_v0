// Configuration pour la sélection des pixels
export const SELECTION_CONFIG = {
  // Couleurs
  colors: {
    primary: '#FF6B35',      // Orange vif pour la sélection
    secondary: '#FF8C42',    // Orange plus clair pour les gradients
    shadow: '#FF6B35',       // Couleur de l'ombre
    text: '#FFFFFF',         // Texte blanc
    background: '#1F2937',   // Fond sombre pour l'indicateur
  },
  
  // Dimensions
  dimensions: {
    strokeWidth: 4,          // Épaisseur de la bordure
    shadowBlur: 15,          // Flou de l'ombre
    shadowOpacity: 0.8,      // Opacité de l'ombre
    scale: 1.15,             // Échelle de la sélection
    cornerRadius: 2,         // Rayon des coins
  },
  
  // Animations
  animations: {
    duration: {
      appear: 0.3,           // Durée d'apparition
      disappear: 0.2,        // Durée de disparition
      pulse: 1,              // Durée de pulsation
    },
    easing: {
      appear: 'EaseOut',     // Easing d'apparition
      disappear: 'EaseIn',   // Easing de disparition
      pulse: 'EaseInOut',    // Easing de pulsation
    },
    pulse: {
      minShadow: 15,         // Ombre minimale
      maxShadow: 25,         // Ombre maximale
    },
  },
  
  // Hover
  hover: {
    scale: 1.05,             // Échelle au survol
    enabled: true,           // Activer le hover
  },
  
  // Indicateur
  indicator: {
    offset: {
      x: -40,                // Décalage horizontal
      y: -25,                // Décalage vertical
    },
    size: {
      width: 80,             // Largeur de l'indicateur
      height: 30,            // Hauteur de l'indicateur
    },
    fontSize: {
      coordinates: 10,       // Taille pour les coordonnées
      type: 8,               // Taille pour le type
    },
  },
}
