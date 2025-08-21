const { ethers } = require("hardhat");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");

dotenv.config();

async function main() {
    console.log("🔧 Setting up Intuition Testnet Configuration...");
    
    // Check if private key is configured
    const deployerPrivateKey = process.env.PRIVATE_KEY;
    if (!deployerPrivateKey || deployerPrivateKey === "your_private_key_here") {
        console.log("⚠️  No private key configured");
        console.log("   Please set your PRIVATE_KEY in .env file");
        console.log("   Example: PRIVATE_KEY=0x1234567890abcdef...");
        
        // Still check network connectivity without signer
        console.log("\n🌐 Testing network connectivity...");
        try {
            const provider = new ethers.JsonRpcProvider("https://testnet.rpc.intuition.systems");
            const blockNumber = await provider.getBlockNumber();
            console.log("✅ Connected to Intuition testnet, current block:", blockNumber);
        } catch (error) {
            console.error("❌ Failed to connect to Intuition testnet:", error);
            console.log("   Please check your RPC_URL configuration");
        }
        
        console.log("\n📊 Configuration Summary:");
        console.log("=========================");
        console.log("Network: Intuition Testnet (Chain ID: 13579)");
        console.log("RPC URL: https://testnet.rpc.intuition.systems");
        console.log("Explorer: https://testnet.explorer.intuition.systems/");
        console.log("Token Symbol: TTRUST");
        console.log("Grid Size: 64x64");
        
        console.log("\n🎯 Next Steps:");
        console.log("1. Set your PRIVATE_KEY in .env file");
        console.log("2. Run this script again to complete setup");
        console.log("3. Deploy contracts: npm run intuition:deploy");
        console.log("4. Start frontend: npm run dev");
        
        return;
    }
    
    const [deployer] = await ethers.getSigners();
    
    console.log("📋 Current Configuration:");
    console.log("  Account:", deployer.address);
    console.log("  Network:", await ethers.provider.getNetwork());
    
    // Check if .env file exists
    const envPath = path.join(__dirname, "../.env");
    const envExists = fs.existsSync(envPath);
    
    if (!envExists) {
        console.log("\n📝 Creating .env file from template...");
        const envExamplePath = path.join(__dirname, "../env.example");
        const envExample = fs.readFileSync(envExamplePath, "utf8");
        fs.writeFileSync(envPath, envExample);
        console.log("✅ .env file created from template");
    } else {
        console.log("✅ .env file already exists");
    }
    
    // Check network connectivity
    console.log("\n🌐 Testing network connectivity...");
    try {
        const blockNumber = await ethers.provider.getBlockNumber();
        console.log("✅ Connected to Intuition testnet, current block:", blockNumber);
        
        const balance = await ethers.provider.getBalance(deployer.address);
        console.log("💰 Account balance:", ethers.formatEther(balance), "ETH");
        
        if (balance === 0n) {
            console.log("⚠️  Warning: Account has no ETH balance");
            console.log("   You may need to get testnet ETH from a faucet");
        }
    } catch (error) {
        console.error("❌ Failed to connect to Intuition testnet:", error);
        console.log("   Please check your RPC_URL configuration");
        return;
    }
    
    // Check if contracts are already deployed
    const deploymentPath = path.join(__dirname, "../deployment.json");
    if (fs.existsSync(deploymentPath)) {
        console.log("\n📋 Found existing deployment:");
        const deployment = JSON.parse(fs.readFileSync(deploymentPath, "utf8"));
        console.log("  PixelGarden:", deployment.pixelGardenAddress);
        console.log("  TrustToken:", deployment.trustTokenAddress);
        console.log("  Deployed at:", deployment.deployedAt);
        
        // Test contract connectivity
        try {
            const PixelGarden = await ethers.getContractFactory("PixelGarden");
            const pixelGarden = PixelGarden.attach(deployment.pixelGardenAddress);
            
            const width = await pixelGarden.width();
            const height = await pixelGarden.height();
            console.log("✅ Contracts are accessible, grid size:", `${width}x${height}`);
        } catch (error) {
            console.log("⚠️  Contracts may not be accessible, consider redeploying");
        }
    } else {
        console.log("\n📋 No existing deployment found");
        console.log("   Run 'npm run intuition:deploy' to deploy contracts");
    }
    
    // Generate configuration summary
    console.log("\n📊 Configuration Summary:");
    console.log("=========================");
    console.log("Network: Intuition Testnet (Chain ID: 13579)");
    console.log("RPC URL: https://testnet.rpc.intuition.systems");
    console.log("Explorer: https://testnet.explorer.intuition.systems/");
    console.log("Token Symbol: TTRUST");
    console.log("Grid Size: 64x64");
    
    console.log("\n🎯 Next Steps:");
    console.log("1. Deploy contracts: npm run intuition:deploy");
    console.log("2. Update contract addresses in .env file");
    console.log("3. Start frontend: npm run dev");
    
    console.log("\n✅ Intuition Testnet setup completed!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Setup failed:", error);
        process.exit(1);
    });
