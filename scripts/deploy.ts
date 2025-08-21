import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));
    
    let trustTokenAddress = process.env.TRUST_TOKEN_ADDRESS;
    
    // Deploy TrustMock if no TRUST_TOKEN_ADDRESS is provided
    if (!trustTokenAddress) {
        console.log("No TRUST_TOKEN_ADDRESS found, deploying TrustMock...");
        
        const TrustMock = await ethers.getContractFactory("TrustMock");
        const trustMock = await TrustMock.deploy();
        await trustMock.waitForDeployment();
        
        trustTokenAddress = await trustMock.getAddress();
        console.log("TrustMock deployed to:", trustTokenAddress);
    } else {
        console.log("Using existing TRUST token at:", trustTokenAddress);
    }
    
    // Deploy PixelGarden
    console.log("Deploying PixelGarden...");
    
    const PixelGarden = await ethers.getContractFactory("PixelGarden");
    const pixelGarden = await PixelGarden.deploy(64, 64, trustTokenAddress);
    await pixelGarden.waitForDeployment();
    
    const pixelGardenAddress = await pixelGarden.getAddress();
    console.log("PixelGarden deployed to:", pixelGardenAddress);
    
    // Verify deployment
    const width = await pixelGarden.width();
    const height = await pixelGarden.height();
    const tokenAddress = await pixelGarden.trustToken();
    
    console.log("\nDeployment Summary:");
    console.log("==================");
    console.log("PixelGarden Address:", pixelGardenAddress);
    console.log("TRUST Token Address:", tokenAddress);
    console.log("Grid Size:", `${width}x${height}`);
    
    // Save addresses for other scripts
    console.log("\nEnvironment variables for future use:");
    console.log(`PIXEL_GARDEN_ADDRESS=${pixelGardenAddress}`);
    console.log(`TRUST_TOKEN_ADDRESS=${tokenAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
