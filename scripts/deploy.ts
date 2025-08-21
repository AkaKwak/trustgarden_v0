import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("🚀 Déploiement du contrat Signal Garden...");

  // Paramètres de déploiement
  const GRID_WIDTH = 64;
  const GRID_HEIGHT = 64;
  
  // Adresse du token TTRUST (à remplacer par l'adresse réelle)
  const TRUST_TOKEN_ADDRESS = "0x0000000000000000000000000000000000000000"; // TODO: Mettre à jour

  console.log("📋 Paramètres de déploiement:");
  console.log(`   - Grille: ${GRID_WIDTH}x${GRID_HEIGHT}`);
  console.log(`   - Token TTRUST: ${TRUST_TOKEN_ADDRESS}`);

  // Déployer le contrat PixelGarden
  const PixelGarden = await ethers.getContractFactory("PixelGarden");
  const pixelGarden = await PixelGarden.deploy(GRID_WIDTH, GRID_HEIGHT, TRUST_TOKEN_ADDRESS);

  await pixelGarden.waitForDeployment();
  const pixelGardenAddress = await pixelGarden.getAddress();

  console.log("✅ Contrat Signal Garden déployé!");
  console.log(`   - Adresse: ${pixelGardenAddress}`);
  console.log(`   - Network: ${network.name}`);
  console.log(`   - Chain ID: ${network.config.chainId}`);

  // Vérifier le déploiement
  console.log("\n🔍 Vérification du déploiement...");
  
  const width = await pixelGarden.width();
  const height = await pixelGarden.height();
  const trustToken = await pixelGarden.trustToken();

  console.log(`   - Largeur: ${width}`);
  console.log(`   - Hauteur: ${height}`);
  console.log(`   - Token: ${trustToken}`);

  // Afficher les informations pour la configuration
  console.log("\n📝 Configuration à mettre à jour:");
  console.log("```typescript");
  console.log(`// src/config/intuition.ts`);
  console.log(`export const APP_CONFIG = {`);
  console.log(`  // ...`);
  console.log(`  contracts: {`);
  console.log(`    pixelGarden: {`);
  console.log(`      address: '${pixelGardenAddress}',`);
  console.log(`    },`);
  console.log(`    trustToken: {`);
  console.log(`      address: '${TRUST_TOKEN_ADDRESS}', // TODO: Mettre à jour avec l'adresse réelle`);
  console.log(`    },`);
  console.log(`  },`);
  console.log(`}`);`);
  console.log("```");

  console.log("\n🎉 Déploiement terminé avec succès!");
  console.log("🌱 Signal Garden est prêt pour la token-curated knowledge!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur lors du déploiement:", error);
    process.exit(1);
  });
