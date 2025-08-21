import { ethers } from "hardhat";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

async function main() {
    console.log("🚀 Deploying TrustGarden to Intuition Testnet...");
    
    const [deployer] = await ethers.getSigners();
    
    console.log("📋 Deployment Info:");
    console.log("  Account:", deployer.address);
    console.log("  Balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH");
    console.log("  Network:", await ethers.provider.getNetwork());
    
    // Check environment variables
    const rpcUrl = process.env.RPC_URL || "https://testnet.rpc.intuition.systems";
    const chainId = process.env.CHAIN_ID || "13579";
    
    console.log("  RPC URL:", rpcUrl);
    console.log("  Chain ID:", chainId);
    
    let trustTokenAddress = process.env.TRUST_TOKEN_ADDRESS;
    
    // Deploy TrustMock if no TRUST_TOKEN_ADDRESS is provided
    if (!trustTokenAddress) {
        console.log("\n🔧 No TRUST_TOKEN_ADDRESS found, deploying TrustMock...");
        
        const TrustMock = await ethers.getContractFactory("TrustMock");
        const trustMock = await TrustMock.deploy();
        await trustMock.waitForDeployment();
        
        trustTokenAddress = await trustMock.getAddress();
        console.log("✅ TrustMock deployed to:", trustTokenAddress);
        
        // Mint some tokens to deployer for testing
        const mintAmount = ethers.parseEther("1000"); // 1000 TRUST tokens
        await trustMock.mint(deployer.address, mintAmount);
        console.log("💰 Minted", ethers.formatEther(mintAmount), "TRUST tokens to deployer");
    } else {
        console.log("\n✅ Using existing TRUST token at:", trustTokenAddress);
    }
    
    // Deploy PixelGarden
    console.log("\n🌱 Deploying PixelGarden...");
    
    const PixelGarden = await ethers.getContractFactory("PixelGarden");
    const pixelGarden = await PixelGarden.deploy(64, 64, trustTokenAddress);
    await pixelGarden.waitForDeployment();
    
    const pixelGardenAddress = await pixelGarden.getAddress();
    console.log("✅ PixelGarden deployed to:", pixelGardenAddress);
    
    // Verify deployment
    const width = await pixelGarden.width();
    const height = await pixelGarden.height();
    const tokenAddress = await pixelGarden.trustToken();
    
    console.log("\n📊 Deployment Summary:");
    console.log("=====================");
    console.log("🌱 PixelGarden Address:", pixelGardenAddress);
    console.log("💰 TRUST Token Address:", tokenAddress);
    console.log("📐 Grid Size:", `${width}x${height}`);
    
    // Save deployment info
    const deploymentInfo = {
        network: "intuition-testnet",
        chainId: chainId,
        deployer: deployer.address,
        pixelGardenAddress: pixelGardenAddress,
        trustTokenAddress: tokenAddress,
        gridSize: `${width}x${height}`,
        deployedAt: new Date().toISOString(),
        blockNumber: await ethers.provider.getBlockNumber(),
    };
    
    const deploymentPath = path.join(__dirname, "../deployment.json");
    fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));
    console.log("💾 Deployment info saved to:", deploymentPath);
    
    // Generate environment variables
    console.log("\n🔧 Environment variables for frontend:");
    console.log("=====================================");
    console.log(`VITE_RPC_URL=${rpcUrl}`);
    console.log(`VITE_CHAIN_ID=${chainId}`);
    console.log(`VITE_PIXEL_GARDEN_ADDRESS=${pixelGardenAddress}`);
    console.log(`VITE_TRUST_TOKEN_ADDRESS=${tokenAddress}`);
    
    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");
    
    // Test getPixel
    const pixelData = await pixelGarden.getPixel(0, 0);
    console.log("✅ getPixel(0,0) works:", {
        pixelType: pixelData[0],
        signalStake: ethers.formatEther(pixelData[1]),
        atomStake: ethers.formatEther(pixelData[2]),
        tripleStake: ethers.formatEther(pixelData[3]),
        totalStake: ethers.formatEther(pixelData[4]),
        lastUpdate: pixelData[5]
    });
    
    // Test getGridStats
    const gridStats = await pixelGarden.getGridStats();
    console.log("✅ getGridStats works:", {
        totalPixels: gridStats[0],
        signalPixels: gridStats[1],
        atomPixels: gridStats[2],
        triplePixels: gridStats[3],
        totalStaked: ethers.formatEther(gridStats[4]),
        signalStaked: ethers.formatEther(gridStats[5]),
        atomStaked: ethers.formatEther(gridStats[6]),
        tripleStaked: ethers.formatEther(gridStats[7])
    });
    
    console.log("\n🎉 Deployment completed successfully!");
    console.log("🌐 View on explorer: https://testnet.explorer.intuition.systems/address/" + pixelGardenAddress);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Deployment failed:", error);
        process.exit(1);
    });
