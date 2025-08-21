import { ethers } from "hardhat";
import { stateKey } from "../src/utils/states";

async function main() {
    const [signer] = await ethers.getSigners();
    
    // You'll need to set these addresses after deployment
    const PIXEL_GARDEN_ADDRESS = process.env.PIXEL_GARDEN_ADDRESS;
    const TRUST_TOKEN_ADDRESS = process.env.TRUST_TOKEN_ADDRESS;
    
    if (!PIXEL_GARDEN_ADDRESS) {
        throw new Error("PIXEL_GARDEN_ADDRESS environment variable not set");
    }
    
    if (!TRUST_TOKEN_ADDRESS) {
        throw new Error("TRUST_TOKEN_ADDRESS environment variable not set");
    }
    
    console.log("Seeding pixels with account:", signer.address);
    
    // Get contract instances
    const pixelGarden = await ethers.getContractAt("PixelGarden", PIXEL_GARDEN_ADDRESS);
    
    // Always try TrustMock first (for local testing), fallback to IERC20
    let trustToken;
    try {
        trustToken = await ethers.getContractAt("TrustMock", TRUST_TOKEN_ADDRESS);
        console.log("Minting TRUST tokens for testing...");
        await trustToken.mint(signer.address, ethers.parseEther("10000"));
    } catch (error) {
        // Not a TrustMock, use IERC20 interface
        console.log("Using existing TRUST token balance");
        trustToken = await ethers.getContractAt("IERC20", TRUST_TOKEN_ADDRESS);
    }
    
    const balance = await trustToken.balanceOf(signer.address);
    console.log("TRUST balance:", ethers.formatEther(balance));
    
    // Approve PixelGarden to spend TRUST tokens
    const approvalAmount = ethers.parseEther("1000");
    console.log("Approving PixelGarden to spend TRUST tokens...");
    
    const approveTx = await trustToken.approve(PIXEL_GARDEN_ADDRESS, approvalAmount);
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
    
    console.log("Seeding pixels...");
    
    for (const seed of seedData) {
        const stateHash = stateKey(seed.state);
        console.log(`Setting pixel (${seed.x}, ${seed.y}) to ${seed.state} with ${ethers.formatEther(seed.amount)} TRUST`);
        
        const tx = await pixelGarden.setPixel(seed.x, seed.y, stateHash, seed.amount);
        await tx.wait();
        
        // Verify the pixel state
        const [current, currentStake] = await pixelGarden.getPixel(seed.x, seed.y);
        console.log(`  Result: current state hash ${current}, stake: ${ethers.formatEther(currentStake)}`);
    }
    
    console.log("Seeding completed!");
    
    // Show some example pixels
    console.log("\nExample pixel states:");
    for (let i = 0; i < 3; i++) {
        const seed = seedData[i];
        const [current, currentStake] = await pixelGarden.getPixel(seed.x, seed.y);
        const [topStates, topStakes] = await pixelGarden.getTopStates(seed.x, seed.y, 3);
        
        console.log(`Pixel (${seed.x}, ${seed.y}):`);
        console.log(`  Current: ${current} (${ethers.formatEther(currentStake)} TRUST)`);
        console.log(`  Top 3 states:`);
        for (let j = 0; j < Math.min(3, topStates.length); j++) {
            console.log(`    ${topStates[j]}: ${ethers.formatEther(topStakes[j])} TRUST`);
        }
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
