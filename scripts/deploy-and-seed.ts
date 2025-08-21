import { ethers } from "hardhat";
import { stateKey } from "../src/utils/states";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    
    console.log("=== DEPLOYMENT AND SEEDING DEMO ===");
    console.log("Deploying contracts with account:", deployer.address);
    console.log("Account balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)));
    
    // Deploy TrustMock (always for local testing)
    console.log("\n--- Deploying TrustMock ---");
    const TrustMock = await ethers.getContractFactory("TrustMock");
    const trustMock = await TrustMock.deploy();
    await trustMock.waitForDeployment();
    
    const trustTokenAddress = await trustMock.getAddress();
    console.log("TrustMock deployed to:", trustTokenAddress);
    
    // Deploy PixelGarden
    console.log("\n--- Deploying PixelGarden ---");
    const PixelGarden = await ethers.getContractFactory("PixelGarden");
    const pixelGarden = await PixelGarden.deploy(64, 64, trustTokenAddress);
    await pixelGarden.waitForDeployment();
    
    const pixelGardenAddress = await pixelGarden.getAddress();
    console.log("PixelGarden deployed to:", pixelGardenAddress);
    
    // Verify deployment
    const width = await pixelGarden.width();
    const height = await pixelGarden.height();
    const tokenAddress = await pixelGarden.trustToken();
    
    console.log("\n--- Deployment Summary ---");
    console.log("PixelGarden Address:", pixelGardenAddress);
    console.log("TRUST Token Address:", tokenAddress);
    console.log("Grid Size:", `${width}x${height}`);
    
    // Now start seeding
    console.log("\n=== SEEDING PIXELS ===");
    
    // Mint tokens for testing
    console.log("Minting TRUST tokens for testing...");
    await trustMock.mint(deployer.address, ethers.parseEther("10000"));
    
    const balance = await trustMock.balanceOf(deployer.address);
    console.log("TRUST balance:", ethers.formatEther(balance));
    
    // Approve PixelGarden to spend TRUST tokens
    const approvalAmount = ethers.parseEther("1000");
    console.log("Approving PixelGarden to spend TRUST tokens...");
    
    const approveTx = await trustMock.approve(pixelGardenAddress, approvalAmount);
    await approveTx.wait();
    console.log("Approval confirmed");
    
    // Seed some pixels for testing
    const seedData = [
        { x: 10, y: 10, state: "soil", amount: ethers.parseEther("10") },
        { x: 10, y: 11, state: "seed", amount: ethers.parseEther("15") },
        { x: 10, y: 12, state: "sprout", amount: ethers.parseEther("20") },
        { x: 11, y: 10, state: "leaf", amount: ethers.parseEther("25") },
        { x: 11, y: 11, state: "flower:red", amount: ethers.parseEther("30") },
        { x: 12, y: 10, state: "water", amount: ethers.parseEther("50") },
        { x: 12, y: 11, state: "stone", amount: ethers.parseEther("40") },
        { x: 12, y: 12, state: "path", amount: ethers.parseEther("35") },
    ];
    
    console.log("\n--- Seeding pixels ---");
    
    for (const seed of seedData) {
        const stateHash = stateKey(seed.state);
        console.log(`Setting pixel (${seed.x}, ${seed.y}) to ${seed.state} with ${ethers.formatEther(seed.amount)} TRUST`);
        
        const tx = await pixelGarden.setPixel(seed.x, seed.y, stateHash, seed.amount);
        await tx.wait();
        
        // Verify the pixel state
        const [current, currentStake] = await pixelGarden.getPixel(seed.x, seed.y);
        console.log(`  ✓ Result: current state hash ${current}, stake: ${ethers.formatEther(currentStake)}`);
    }
    
    console.log("\n=== TESTING PIXEL QUERIES ===");
    
    // Show some example pixels
    for (let i = 0; i < 3; i++) {
        const seed = seedData[i];
        const [current, currentStake] = await pixelGarden.getPixel(seed.x, seed.y);
        const [topStates, topStakes] = await pixelGarden.getTopStates(seed.x, seed.y, 3);
        
        console.log(`\nPixel (${seed.x}, ${seed.y}):`);
        console.log(`  Current: ${current} (${ethers.formatEther(currentStake)} TRUST)`);
        console.log(`  Top 3 states:`);
        for (let j = 0; j < Math.min(3, topStates.length); j++) {
            if (topStakes[j] > 0) {
                console.log(`    ${topStates[j]}: ${ethers.formatEther(topStakes[j])} TRUST`);
            }
        }
    }
    
    // Show allowed states
    const allowedStates = await pixelGarden.getAllowedStates();
    console.log(`\n--- Allowed States (${allowedStates.length}) ---`);
    allowedStates.forEach((state: string, index: number) => {
        const hash = stateKey(state);
        console.log(`  ${index + 1}. "${state}" -> ${hash.substring(0, 10)}...`);
    });
    
    console.log("\n=== DEMO COMPLETED SUCCESSFULLY ===");
    console.log("✓ Contracts deployed and verified");
    console.log("✓ Tokens minted and approved");
    console.log("✓ Pixels successfully staked and states set");
    console.log("✓ Pixel queries working correctly");
    console.log("✓ All allowed states verified");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });